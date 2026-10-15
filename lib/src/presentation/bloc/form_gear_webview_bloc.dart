import 'dart:async';

import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:form_gear_engine_sdk/src/core/engine/page_prelude.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/bridge_channel.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/js_executor_service.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/js_handler_base.dart';
import 'package:form_gear_engine_sdk/src/utils/form_gear_logger.dart';
import 'package:webview_flutter/webview_flutter.dart';

part 'form_gear_webview_event.dart';
part 'form_gear_webview_state.dart';

class FormGearWebViewBloc
    extends Bloc<FormGearWebViewEvent, FormGearWebViewState> {
  FormGearWebViewBloc({
    required this.jsHandlers,
    required this.initialHtml,
    this.initialUrl,
    this.engineReadyCheck,
  }) : super(const FormGearWebViewState()) {
    on<InitializeWebView>(_onInitializeWebView);
    on<UpdateLoadingProgress>(_onUpdateLoadingProgress);
    on<WebViewLoadStart>(_onWebViewLoadStart);
    on<WebViewLoadStop>(_onWebViewLoadStop);
    on<WebViewLoadError>(_onWebViewLoadError);
    on<RetryInitialization>(_onRetryInitialization);
  }

  final List<JSHandler<dynamic>> jsHandlers;

  /// HTML to load; when empty, [initialUrl] is loaded instead (iOS server).
  final String initialHtml;
  final String? initialUrl;

  /// JS expression that is true once the engine started; null skips the check.
  final String? engineReadyCheck;
  WebViewController? _controller;
  int _loadGeneration = 0;

  Future<void> _onInitializeWebView(
    InitializeWebView event,
    Emitter<FormGearWebViewState> emit,
  ) async {
    emit(state.copyWith(status: WebViewStatus.initializing));
    final controller = event.controller;
    _controller = controller;

    try {
      // Serves the page's flutter_inappwebview.callHandler polyfill. Added
      // before the first load so it exists when the page script runs.
      final bridge = JsBridge(
        handlers: jsHandlers,
        origin: controller,
        runJavaScript: controller.runJavaScript,
      );
      await controller.addJavaScriptChannel(
        PagePrelude.bridgeChannel,
        onMessageReceived: (message) =>
            unawaited(bridge.onMessage(message.message)),
      );
      await _load(controller);

      // Loading may already have started/finished while we awaited.
      final status =
          state.status == WebViewStatus.loaded ||
              state.status == WebViewStatus.loading
          ? state.status
          : WebViewStatus.ready;
      emit(state.copyWith(status: status, controller: controller));
    } on Object catch (e) {
      emit(
        state.copyWith(
          status: WebViewStatus.error,
          errorMessage: 'Failed to initialize WebView: $e',
        ),
      );
    }
  }

  Future<void> _load(WebViewController controller) => initialHtml.isNotEmpty
      ? controller.loadHtmlString(initialHtml, baseUrl: 'about:blank')
      : controller.loadRequest(Uri.parse(initialUrl ?? 'about:blank'));

  void _onWebViewLoadStart(
    WebViewLoadStart event,
    Emitter<FormGearWebViewState> emit,
  ) {
    _loadGeneration++;
    emit(
      state.copyWith(
        status: WebViewStatus.loading,
        currentUrl: event.url,
        loadingProgress: 0,
      ),
    );
  }

  Future<void> _onWebViewLoadStop(
    WebViewLoadStop event,
    Emitter<FormGearWebViewState> emit,
  ) async {
    emit(state.copyWith(status: WebViewStatus.loaded, loadingProgress: 100));

    final controller = _controller;
    if (controller == null) return;
    final generation = _loadGeneration;
    final startError = await _engineStartError(controller);
    if (startError != null && generation == _loadGeneration) {
      FormGearLogger.webviewError('Form engine failed to start: $startError');
      emit(
        state.copyWith(
          status: WebViewStatus.error,
          errorMessage: 'Form gagal dimuat. $startError',
        ),
      );
    }
  }

  void _onWebViewLoadError(
    WebViewLoadError event,
    Emitter<FormGearWebViewState> emit,
  ) {
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
  }

  /// Polls [engineReadyCheck] briefly after load; returns the page's last
  /// uncaught error (or a generic reason) if the engine never came up.
  Future<String?> _engineStartError(WebViewController controller) async {
    final check = engineReadyCheck;
    if (check == null) return null;
    for (var attempt = 0; attempt < 4; attempt++) {
      if (attempt > 0) {
        await Future<void>.delayed(const Duration(milliseconds: 500));
      }
      try {
        // Pages without our prelude (e.g. the initial blank page) are skipped.
        final result = JSExecutorService.resultValue(
          await controller.runJavaScriptReturningResult(
            "!window.__fgErrorHooked ? 'ready' : ($check) ? 'ready' : "
            "String(window.__fgLastError || '')",
          ),
        );
        if (result == 'ready') return null;
        if (result is String && result.isNotEmpty) return result;
      } on Object catch (e) {
        return 'Engine check failed: $e';
      }
    }
    return 'Engine tidak terinisialisasi.';
  }

  Future<void> _onRetryInitialization(
    RetryInitialization event,
    Emitter<FormGearWebViewState> emit,
  ) async {
    final controller = _controller;
    if (controller == null) return;
    emit(FormGearWebViewState(controller: controller));
    try {
      await _load(controller);
    } on Object catch (e) {
      emit(
        state.copyWith(
          status: WebViewStatus.error,
          errorMessage: 'Failed to reload form: $e',
        ),
      );
    }
  }

  @override
  Future<void> close() {
    // Late camera/GPS results for this form are dropped from here on.
    JSExecutorService().unregisterController(_controller);
    _controller = null;
    return super.close();
  }
}
