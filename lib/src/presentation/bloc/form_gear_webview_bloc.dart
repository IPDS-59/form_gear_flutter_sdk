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
    FormGearLogger.sdk('_onInitializeWebView: setting status to initializing');
    emit(state.copyWith(status: WebViewStatus.initializing));

    try {
      _controller = event.controller;

      // Register JavaScript handlers - FormGear will call these directly
      // via flutter_inappwebview.callHandler()
      await _registerJavaScriptHandlers(event.controller);

      // iOS: Delay for WebView to be fully ready
      if (Platform.isIOS) {
        await Future<void>.delayed(const Duration(milliseconds: 200));
      }

      // Load HTML content directly - no bridge script injection needed!
      // FormGear v2+ detects Flutter and uses
      // flutter_inappwebview.callHandler()
      if (event.htmlContent != null) {
        // Android: Use loadData() for HTML content
        await event.controller.loadData(
          data: event.htmlContent!,
          baseUrl: WebUri('about:blank'),
        );
        _bridgeInjected = true;
        FormGearLogger.sdk(
          'HTML loaded via loadData() - '
          'FormGear will use flutter_inappwebview directly',
        );
      } else {
        // iOS: HTML content is null, WebView loads from initialUrlRequest
        // (server URL set by WebViewBuilder)
        _bridgeInjected = true;
        FormGearLogger.sdk(
          'iOS: WebView loading from server URL via initialUrlRequest',
        );
      }

      // Only set to ready if page hasn't already finished loading
      // (loadData triggers onLoadStart/onLoadStop which may have already
      // set status to loading or loaded)
      final newStatus =
          state.status == WebViewStatus.loaded ||
              state.status == WebViewStatus.loading
          ? state.status
          : WebViewStatus.ready;
      FormGearLogger.sdk(
        '_onInitializeWebView: current status=${state.status}, '
        'setting to $newStatus',
      );
      emit(
        state.copyWith(
          status: newStatus,
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
      FormGearLogger.sdk('Bridge already set up, skipping...');
      return;
    }

    emit(state.copyWith(isBridgeInjecting: true));

    try {
      // FormGear v2+ doesn't need bridge injection - it calls handlers directly
      // Just ensure handlers are registered
      await _registerJavaScriptHandlers(event.controller);
      _bridgeInjected = true;
      _injectionRetries = 0;

      emit(
        state.copyWith(
          isBridgeInjected: true,
          isBridgeInjecting: false,
        ),
      );

      FormGearLogger.sdk('JavaScript handlers registered successfully');
    } on Exception catch (e) {
      _injectionRetries++;

      if (_injectionRetries < _maxInjectionRetries) {
        FormGearLogger.jsBridgeError(
          'Handler registration failed (attempt $_injectionRetries), '
          'retrying: $e',
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
                'Failed to register handlers after '
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
    FormGearLogger.sdk(
      '_onWebViewLoadStart: url=${event.url}, current status=${state.status}, '
      'handlersRegistered=$_bridgeInjected',
    );

    // Ensure handlers are registered
    if (!_bridgeInjected) {
      try {
        await _registerJavaScriptHandlers(event.controller);
        _bridgeInjected = true;
        FormGearLogger.sdk(
          'JavaScript handlers registered in onLoadStart',
        );
      } on Exception catch (e) {
        FormGearLogger.sdkError(
          'Failed to register handlers on load start: $e',
        );
      }
    }

    FormGearLogger.sdk('_onWebViewLoadStart: setting status to loading');
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
    try {
      FormGearLogger.sdk(
        '_onWebViewLoadStop: url=${event.url}, current status=${state.status}',
      );
      FormGearLogger.sdk('_onWebViewLoadStop: setting status to loaded');
      emit(
        state.copyWith(
          status: WebViewStatus.loaded,
          loadingProgress: 100,
        ),
      );
      FormGearLogger.sdk('_onWebViewLoadStop: emit completed successfully');

      // iOS: Verify handlers are registered after page load
      if (Platform.isIOS) {
        await Future<void>.delayed(const Duration(milliseconds: 500));
        add(VerifyBridgeInjection(event.controller));
      }
    } on Exception catch (e, stack) {
      FormGearLogger.sdkError(
        '_onWebViewLoadStop error: $e\n$stack',
      );
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
      // Verify flutter_inappwebview is available
      final result = await event.controller.evaluateJavascript(
        source: '''
          (function() {
            if (typeof window.flutter_inappwebview === 'undefined') {
              return 'flutter_inappwebview_missing';
            }
            if (typeof window.flutter_inappwebview.callHandler !== 'function') {
              return 'callHandler_missing';
            }
            return 'handlers_ready';
          })();
        ''',
      );

      if (result != 'handlers_ready') {
        FormGearLogger.jsBridgeError(
          'Flutter handler verification failed: $result',
        );
        // Re-register handlers as fallback
        await _registerJavaScriptHandlers(event.controller);
      } else {
        FormGearLogger.sdk('Flutter handler verification successful');
        emit(state.copyWith(isBridgeVerified: true));
      }
    } on Exception catch (e) {
      FormGearLogger.jsBridgeError('Flutter handler verification error: $e');
      // Re-register handlers as fallback
      await _registerJavaScriptHandlers(event.controller);
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

  @override
  Future<void> close() {
    _controller = null;
    return super.close();
  }
}
