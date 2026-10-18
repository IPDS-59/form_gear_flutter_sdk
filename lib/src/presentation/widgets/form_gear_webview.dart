import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/js_bridge.dart';
import 'package:form_gear_engine_sdk/src/core/observability/form_gear_bridge_event.dart';
import 'package:form_gear_engine_sdk/src/core/services/navigator_context_provider.dart';
import 'package:form_gear_engine_sdk/src/core/ui/form_gear_ui_handler.dart';
import 'package:form_gear_engine_sdk/src/presentation/bloc/form_gear_webview_bloc.dart';
import 'package:form_gear_engine_sdk/src/presentation/widgets/exit_confirmation_dialog.dart';
import 'package:form_gear_engine_sdk/src/presentation/widgets/form_gear_loading_screen.dart';
import 'package:form_gear_engine_sdk/src/utils/form_gear_logger.dart';
import 'package:form_gear_engine_sdk/src/utils/webview_navigation_helper.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:webview_flutter_android/webview_flutter_android.dart';
import 'package:webview_flutter_wkwebview/webview_flutter_wkwebview.dart';

/// FormGear WebView widget with JSHandler integration and BLoC pattern
/// Follows the web_view pattern - simple parameters, external handler injection
class FormGearWebView extends StatelessWidget {
  const FormGearWebView({
    required this.url,
    super.key,
    this.htmlContent,
    this.jsHandlers = const [],
    this.title = 'FormGear',
    this.onWebViewCreated,
    this.onLoadStart,
    this.onLoadStop,
    this.onLoadError,
    this.onConsoleMessage,
    this.engineReadyCheck,
    this.uiHandler,
  });

  /// Loaded when [htmlContent] is null (iOS local-server path).
  final String url;
  final String? htmlContent;
  final List<JSHandler<dynamic>> jsHandlers;

  /// JS expression that is true once the form engine started. When it stays
  /// false after load, an error with a retry action is shown instead of a
  /// blank form.
  final String? engineReadyCheck;

  /// Host UI for the loader, error and exit dialog; null keeps the built-in.
  final FormGearUiHandler? uiHandler;
  final String title;
  final void Function(WebViewController controller)? onWebViewCreated;
  final void Function(WebViewController controller, String url)? onLoadStart;
  final void Function(WebViewController controller, String url)? onLoadStop;
  final void Function(
    WebViewController controller,
    String url,
    int code,
    String message,
  )?
  onLoadError;
  final void Function(
    WebViewController controller,
    JavaScriptConsoleMessage consoleMessage,
  )?
  onConsoleMessage;

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => FormGearWebViewBloc(
        jsHandlers: jsHandlers,
        initialHtml: htmlContent ?? '',
        initialUrl: url,
        engineReadyCheck: engineReadyCheck,
      ),
      child: _FormGearWebViewContent(widget: this),
    );
  }
}

class _FormGearWebViewContent extends StatefulWidget {
  const _FormGearWebViewContent({required this.widget});

  final FormGearWebView widget;

  @override
  State<_FormGearWebViewContent> createState() =>
      _FormGearWebViewContentState();
}

class _FormGearWebViewContentState extends State<_FormGearWebViewContent> {
  late final WebViewController _controller =
      WebViewController.fromPlatformCreationParams(
        WebViewPlatform.instance is WebKitWebViewPlatform
            ? WebKitWebViewControllerCreationParams(
                allowsInlineMediaPlayback: true,
                javaScriptCanOpenWindowsAutomatically: true,
              )
            : const PlatformWebViewControllerCreationParams(),
        // Engines use camera/mic in-page (barcode, audio); the app holds the
        // runtime permission.
        onPermissionRequest: (request) => request.grant(),
      );

  FormGearWebView get _w => widget.widget;
  FormGearWebViewBloc get _bloc => context.read<FormGearWebViewBloc>();

  @override
  void initState() {
    super.initState();
    NavigatorContextProvider.instance.register(() => mounted ? context : null);
    _start();
  }

  @override
  void dispose() {
    NavigatorContextProvider.instance.unregister();
    super.dispose();
  }

  /// Configures the controller, then lets the bloc wire the bridge and load.
  Future<void> _start() async {
    final c = _controller;
    await c.setJavaScriptMode(JavaScriptMode.unrestricted);
    await c.setOnConsoleMessage(_onConsoleMessage);
    await c.setNavigationDelegate(
      NavigationDelegate(
        onPageStarted: (url) {
          _w.onLoadStart?.call(c, url);
          if (mounted) _bloc.add(WebViewLoadStart(url));
        },
        onPageFinished: (url) {
          _insets = null; // a new page has no variables yet
          _w.onLoadStop?.call(c, url);
          if (mounted) _bloc.add(WebViewLoadStop(url));
        },
        onProgress: (progress) {
          if (mounted) _bloc.add(UpdateLoadingProgress(progress));
        },
        onWebResourceError: (error) {
          // Sub-resource failures (an image, a lookup fetch) are not fatal.
          if (error.isForMainFrame == false) return;
          final url = error.url ?? '';
          _w.onLoadError?.call(c, url, error.errorCode, error.description);
          if (mounted) {
            _bloc.add(
              WebViewLoadError(
                url: url,
                code: error.errorCode,
                message: error.description,
              ),
            );
          }
        },
      ),
    );

    final platform = c.platform;
    if (platform is AndroidWebViewController) {
      // Page is loaded via loadDataWithBaseURL and talks to the local
      // http lookup server / file:// media.
      await platform.setMixedContentMode(MixedContentMode.alwaysAllow);
      await platform.setAllowFileAccess(true);
    } else if (platform is WebKitWebViewController) {
      await platform.setAllowsBackForwardNavigationGestures(false);
      await platform.setAllowsLinkPreview(false);
    }
    final userAgent = await c.getUserAgent();
    await c.setUserAgent('${userAgent ?? ''} FormGear WebView'.trim());

    _w.onWebViewCreated?.call(c);
    if (mounted) _bloc.add(InitializeWebView(c));
  }

  void _onConsoleMessage(JavaScriptConsoleMessage message) {
    // Always surface page errors; the host callback is optional and was the
    // only sink before.
    if (message.level == JavaScriptLogLevel.error) {
      FormGearLogger.webviewError('JS: ${message.message}');
    }
    FormGearBridgeObserver.instance.emit(
      direction: FormGearBridgeDirection.local,
      kind: message.level == JavaScriptLogLevel.error
          ? FormGearBridgeKind.jsError
          : FormGearBridgeKind.console,
      channel: 'console',
      method: message.level.name,
      args: message.message,
    );
    _w.onConsoleMessage?.call(_controller, message);
  }

  EdgeInsets? _insets;

  /// Hands the safe-area insets to the engine as CSS variables, once per
  /// change.
  void _applyInsets(EdgeInsets i) {
    if (_insets == i) return;
    _insets = i;
    unawaited(
      _controller.runJavaScript(
        'const s=document.documentElement.style;\n'
        "s.setProperty('--safe-area-inset-top','${i.top}px');"
        "s.setProperty('--safe-area-inset-right','${i.right}px');"
        "s.setProperty('--safe-area-inset-bottom','${i.bottom}px');"
        "s.setProperty('--safe-area-inset-left','${i.left}px');",
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final useSafeArea = _w.uiHandler?.useSafeArea ?? true;
    if (!useSafeArea) _applyInsets(MediaQuery.paddingOf(context));
    return BlocBuilder<FormGearWebViewBloc, FormGearWebViewState>(
      builder: (context, state) {
        return PopScope(
          canPop: false, // Always handle pop manually
          onPopInvokedWithResult: (didPop, result) async {
            if (didPop) return; // Already popped, nothing to do
            await _handleBackNavigation();
          },
          child: Stack(
            children: [
              Column(
                children: [
                  if (state.hasError)
                    _w.uiHandler?.buildError(
                          context,
                          state.errorMessage ?? '',
                          () => context.read<FormGearWebViewBloc>().add(
                            const RetryInitialization(),
                          ),
                        ) ??
                        Container(
                          width: double.infinity,
                          color: Colors.red[100],
                          padding: const EdgeInsets.all(8),
                          child: Row(
                            children: [
                              Expanded(
                                child: Text(
                                  'Error: ${state.errorMessage}',
                                  style: TextStyle(color: Colors.red[800]),
                                ),
                              ),
                              TextButton(
                                onPressed: () => context
                                    .read<FormGearWebViewBloc>()
                                    .add(const RetryInitialization()),
                                child: const Text('Coba lagi'),
                              ),
                            ],
                          ),
                        ),
                  Expanded(
                    child: useSafeArea
                        ? SafeArea(
                            child: WebViewWidget(controller: _controller),
                          )
                        : WebViewWidget(controller: _controller),
                  ),
                ],
              ),
              if (state.isLoading)
                _w.uiHandler?.buildLoading(context, state.loadingProgress) ??
                    FormGearLoadingScreen(
                      loadingProgress: state.loadingProgress,
                    ),
            ],
          ),
        );
      },
    );
  }

  /// Handle back navigation - navigate within form pages first,
  /// then show exit confirmation dialog when can't go back anymore
  Future<void> _handleBackNavigation() async {
    final canGoBackInForm = await WebViewNavigationHelper.tryNavigateBackInForm(
      _controller,
    );

    if (canGoBackInForm) {
      FormGearLogger.webview('Navigated back within form sections');
      return;
    }
    if (!mounted) return;

    final hostAnswer = await _w.uiHandler?.confirmExit(context);
    if (!mounted) return;
    final shouldExit = hostAnswer ?? await ExitConfirmationDialog.show(context);
    if (!shouldExit || !mounted) return;

    await WebViewNavigationHelper.callMobileExit(_controller);
    // ponytail: fixed grace so the trigger-save bridge call reaches Dart
    // before the WebView is torn down; await an explicit save ack if short.
    await Future<void>.delayed(const Duration(milliseconds: 300));

    if (mounted) Navigator.of(context).pop();
  }
}
