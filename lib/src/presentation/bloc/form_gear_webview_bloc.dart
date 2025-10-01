import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/js_handler_base.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/models/response_models.dart';
import 'package:form_gear_engine_sdk/src/utils/form_gear_logger.dart';

part 'form_gear_webview_event.dart';
part 'form_gear_webview_state.dart';

class FormGearWebViewBloc
    extends Bloc<FormGearWebViewEvent, FormGearWebViewState> {
  FormGearWebViewBloc({
    required this.jsHandlers,
    required this.initialHtml,
  }) : super(const FormGearWebViewState()) {
    on<InitializeWebView>(_onInitializeWebView);
    on<InjectBridge>(_onInjectBridge);
    on<UpdateLoadingProgress>(_onUpdateLoadingProgress);
    on<WebViewLoadStart>(_onWebViewLoadStart);
    on<WebViewLoadStop>(_onWebViewLoadStop);
    on<WebViewLoadError>(_onWebViewLoadError);
    on<VerifyBridgeInjection>(_onVerifyBridgeInjection);
    on<RetryInitialization>(_onRetryInitialization);
  }

  final List<JSHandler<dynamic>> jsHandlers;
  final String initialHtml;
  InAppWebViewController? _controller;
  bool _bridgeInjected = false;
  int _injectionRetries = 0;
  static const int _maxInjectionRetries = 3;

  Future<void> _onInitializeWebView(
    InitializeWebView event,
    Emitter<FormGearWebViewState> emit,
  ) async {
    emit(state.copyWith(status: WebViewStatus.initializing));

    try {
      _controller = event.controller;

      // Register JavaScript handlers
      await _registerJavaScriptHandlers(event.controller);

      // iOS: Delay initial bridge injection for WebView to be fully ready
      if (Platform.isIOS) {
        await Future<void>.delayed(const Duration(milliseconds: 200));
      }

      // Inject Android bridge object using file-based approach
      await _injectAndroidBridgeFromFile(event.controller);
      _bridgeInjected = true;

      emit(
        state.copyWith(
          status: WebViewStatus.ready,
          controller: event.controller,
          isBridgeInjected: true,
        ),
      );
    } on Exception catch (e) {
      emit(
        state.copyWith(
          status: WebViewStatus.error,
          errorMessage: 'Failed to initialize WebView: $e',
        ),
      );
    }
  }

  Future<void> _onInjectBridge(
    InjectBridge event,
    Emitter<FormGearWebViewState> emit,
  ) async {
    if (_bridgeInjected && !event.force) {
      FormGearLogger.sdk('Bridge already injected, skipping...');
      return;
    }

    emit(state.copyWith(isBridgeInjecting: true));

    try {
      await _injectAndroidBridgeFromFile(event.controller);
      _bridgeInjected = true;
      _injectionRetries = 0;

      emit(
        state.copyWith(
          isBridgeInjected: true,
          isBridgeInjecting: false,
        ),
      );

      FormGearLogger.sdk('Bridge injection successful');

      // Verify bridge injection after a delay
      if (Platform.isIOS) {
        await Future<void>.delayed(const Duration(milliseconds: 500));
        add(VerifyBridgeInjection(event.controller));
      }
    } on Exception catch (e) {
      _injectionRetries++;

      if (_injectionRetries < _maxInjectionRetries) {
        FormGearLogger.jsBridgeError(
          'Bridge injection failed (attempt $_injectionRetries), retrying: $e',
        );

        // Retry after delay
        await Future<void>.delayed(const Duration(milliseconds: 500));
        add(InjectBridge(event.controller, force: true));
      } else {
        emit(
          state.copyWith(
            status: WebViewStatus.error,
            isBridgeInjecting: false,
            errorMessage:
                'Failed to inject bridge after '
                '$_maxInjectionRetries attempts: $e',
          ),
        );
      }
    }
  }

  Future<void> _onWebViewLoadStart(
    WebViewLoadStart event,
    Emitter<FormGearWebViewState> emit,
  ) async {
    // CRITICAL: Inject bridge SYNCHRONOUSLY before JavaScript executes
    // onLoadStart is called BEFORE JavaScript in the page runs
    // This ensures bridge is ready when FasihForm/FormGear JavaScript loads
    try {
      await _registerJavaScriptHandlers(event.controller);
      await _injectAndroidBridgeFromFile(event.controller);
      _bridgeInjected = true;
      FormGearLogger.sdk(
        'Bridge injected in onLoadStart (before JS execution)',
      );
    } on Exception catch (e) {
      FormGearLogger.sdkError('Failed to inject bridge on load start: $e');
    }

    emit(
      state.copyWith(
        status: WebViewStatus.loading,
        currentUrl: event.url,
        loadingProgress: 0,
        isBridgeInjected: _bridgeInjected,
      ),
    );
  }

  Future<void> _onWebViewLoadStop(
    WebViewLoadStop event,
    Emitter<FormGearWebViewState> emit,
  ) async {
    emit(
      state.copyWith(
        status: WebViewStatus.loaded,
        loadingProgress: 100,
      ),
    );

    // iOS: Re-inject bridge after page load for better compatibility
    if (Platform.isIOS) {
      await Future<void>.delayed(const Duration(milliseconds: 1000));
      await _injectAndroidBridgeFromFile(event.controller);
      // Additional delay for iOS to ensure bridge is fully ready
      await Future<void>.delayed(const Duration(milliseconds: 500));
      add(VerifyBridgeInjection(event.controller));
    }
  }

  Future<void> _onWebViewLoadError(
    WebViewLoadError event,
    Emitter<FormGearWebViewState> emit,
  ) async {
    emit(
      state.copyWith(
        status: WebViewStatus.error,
        errorMessage: 'Load error (${event.code}): ${event.message}',
      ),
    );
  }

  void _onUpdateLoadingProgress(
    UpdateLoadingProgress event,
    Emitter<FormGearWebViewState> emit,
  ) {
    emit(state.copyWith(loadingProgress: event.progress));

    if (event.progress >= 100) {
      emit(state.copyWith(status: WebViewStatus.loaded));
    }
  }

  Future<void> _onVerifyBridgeInjection(
    VerifyBridgeInjection event,
    Emitter<FormGearWebViewState> emit,
  ) async {
    try {
      final result = await event.controller.evaluateJavascript(
        source: '''
          (function() {
            if (typeof window.Android === 'undefined') {
              return 'bridge_missing';
            }
            if (typeof window.Android.getUserName !== 'function') {
              return 'methods_missing';
            }
            try {
              var testResult = window.Android.getUserName();
              return 'bridge_working';
            } catch (e) {
              return 'bridge_error: ' + e.message;
            }
          })();
        ''',
      );

      if (result != 'bridge_working') {
        FormGearLogger.jsBridgeError('iOS bridge verification failed: $result');
        // Try to re-inject using the file-based method as fallback
        await _injectAndroidBridgeFromFile(event.controller);
      } else {
        FormGearLogger.sdk('iOS bridge verification successful');
        emit(state.copyWith(isBridgeVerified: true));
      }
    } on Exception catch (e) {
      FormGearLogger.jsBridgeError('iOS bridge verification error: $e');
      await _injectAndroidBridgeFromFile(event.controller);
    }
  }

  Future<void> _onRetryInitialization(
    RetryInitialization event,
    Emitter<FormGearWebViewState> emit,
  ) async {
    _bridgeInjected = false;
    _injectionRetries = 0;
    emit(const FormGearWebViewState());

    if (_controller != null) {
      add(InitializeWebView(_controller!));
    }
  }

  Future<void> _registerJavaScriptHandlers(
    InAppWebViewController controller,
  ) async {
    for (final handler in jsHandlers) {
      controller.addJavaScriptHandler(
        handlerName: handler.handlerName,
        callback: (args) async {
          final result = await handler.callback(args);

          // For data methods, return strings that
          // callAndroidFunction can parse
          if (handler.handlerName.startsWith('get') ||
              handler.handlerName.contains('Role')) {
            if (result is StringInfoJs) {
              return result.value ?? '';
            } else if (result is JsonInfoJs) {
              return jsonEncode(result.data ?? {});
            } else if (result is ListInfoJs) {
              return jsonEncode(result.data ?? []);
            }
          }

          // For action methods, return the full JSON response
          return result is JsonCodable ? result.toJson() : result;
        },
      );
    }
  }

  Future<void> _injectAndroidBridgeFromFile(
    InAppWebViewController controller,
  ) async {
    final handlerNames = jsHandlers.map((h) => h.handlerName).toList();

    // Pre-load all data from data handlers synchronously
    final preloadedData = <String, dynamic>{};
    for (final handler in jsHandlers) {
      if (handler.handlerName.startsWith('get') ||
          handler.handlerName.contains('Role')) {
        try {
          final result = await handler.callback([]);
          if (result is StringInfoJs) {
            preloadedData[handler.handlerName] = result.value ?? '';
          } else if (result is JsonInfoJs) {
            preloadedData[handler.handlerName] = result.data ?? {};
          } else if (result is ListInfoJs) {
            preloadedData[handler.handlerName] = result.data ?? [];
          }
        } on Exception catch (e) {
          FormGearLogger.jsBridgeError(
            'Failed to pre-load ${handler.handlerName}: $e',
          );
          preloadedData[handler.handlerName] =
              handler.handlerName.contains('get')
              ? (handler.handlerName.toLowerCase().contains('mode') ||
                        handler.handlerName.toLowerCase().contains('new')
                    ? '1'
                    : (handler.handlerName.toLowerCase().contains('principal')
                          ? <dynamic>[]
                          : ''))
              : <String, dynamic>{};
        }
      }
    }

    try {
      // Inject data as global variables first
      final dataScript = _buildDataScript(preloadedData, handlerNames);
      await controller.evaluateJavascript(source: dataScript);

      // Then inject the bridge file
      await controller.injectJavascriptFileFromAsset(
        assetFilePath:
            'packages/form_gear_engine_sdk/assets/js/android_bridge.js',
      );
    } on Exception catch (e) {
      FormGearLogger.jsBridgeError('File-based bridge injection failed: $e');
      rethrow;
    }
  }

  String _buildDataScript(
    Map<String, dynamic> preloadedData,
    List<String> handlerNames,
  ) {
    final dataEntries = preloadedData.entries
        .map((entry) {
          final value = entry.value;
          final returnValue = value is String ? value : jsonEncode(value);
          final escapedValue = returnValue
              .replaceAll(r'\', r'\\')
              .replaceAll("'", r"\'")
              .replaceAll('\n', r'\n')
              .replaceAll('\r', r'\r');
          return "'${entry.key}': '$escapedValue'";
        })
        .join(', ');

    final actionMethods = handlerNames
        .where((name) => !name.startsWith('get') && !name.contains('Role'))
        .map((name) => "'$name'")
        .join(', ');

    return '''
      window._formGearBridgeData = { $dataEntries };
      window._formGearActionMethods = [ $actionMethods ];
      window._formGearHandlerNames = ${_jsArrayFromList(handlerNames)};
    ''';
  }

  /// Convert Dart list to JavaScript array string
  String _jsArrayFromList(List<String> items) {
    final escapedItems = items.map((item) => "'$item'").join(', ');
    return '[$escapedItems]';
  }

  @override
  Future<void> close() {
    _controller = null;
    return super.close();
  }
}
