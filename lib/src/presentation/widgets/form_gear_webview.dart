import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/js_bridge.dart';
import 'package:form_gear_engine_sdk/src/presentation/bloc/form_gear_webview_bloc.dart';
import 'package:form_gear_engine_sdk/src/presentation/widgets/form_gear_loading_screen.dart';
import 'package:form_gear_engine_sdk/src/utils/form_gear_logger.dart';

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
    this.settings,
  });

  final String url;
  final String? htmlContent;
  final List<JSHandler<dynamic>> jsHandlers;
  final String title;
  final void Function(InAppWebViewController controller)? onWebViewCreated;
  final void Function(InAppWebViewController controller, String url)?
  onLoadStart;
  final void Function(InAppWebViewController controller, String url)?
  onLoadStop;
  final void Function(
    InAppWebViewController controller,
    String url,
    int code,
    String message,
  )?
  onLoadError;
  final void Function(
    InAppWebViewController controller,
    ConsoleMessage consoleMessage,
  )?
  onConsoleMessage;
  final InAppWebViewSettings? settings;

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => FormGearWebViewBloc(
        jsHandlers: jsHandlers,
        initialHtml: htmlContent ?? '',
      ),
      child: _FormGearWebViewContent(
        url: url,
        htmlContent: htmlContent,
        title: title,
        onWebViewCreated: onWebViewCreated,
        onLoadStart: onLoadStart,
        onLoadStop: onLoadStop,
        onLoadError: onLoadError,
        onConsoleMessage: onConsoleMessage,
        settings: settings,
      ),
    );
  }
}

class _FormGearWebViewContent extends StatefulWidget {
  const _FormGearWebViewContent({
    required this.url,
    this.htmlContent,
    this.title = 'FormGear',
    this.onWebViewCreated,
    this.onLoadStart,
    this.onLoadStop,
    this.onLoadError,
    this.onConsoleMessage,
    this.settings,
  });

  final String url;
  final String? htmlContent;
  final String title;
  final void Function(InAppWebViewController controller)? onWebViewCreated;
  final void Function(InAppWebViewController controller, String url)?
  onLoadStart;
  final void Function(InAppWebViewController controller, String url)?
  onLoadStop;
  final void Function(
    InAppWebViewController controller,
    String url,
    int code,
    String message,
  )?
  onLoadError;
  final void Function(
    InAppWebViewController controller,
    ConsoleMessage consoleMessage,
  )?
  onConsoleMessage;
  final InAppWebViewSettings? settings;

  @override
  State<_FormGearWebViewContent> createState() =>
      _FormGearWebViewContentState();
}

class _FormGearWebViewContentState extends State<_FormGearWebViewContent> {
  late InAppWebViewSettings _webViewSettings;

  @override
  void initState() {
    super.initState();
    _initializeSettings();
  }

  void _initializeSettings() {
    _webViewSettings =
        widget.settings ??
        InAppWebViewSettings(
          allowFileAccessFromFileURLs: true,
          allowUniversalAccessFromFileURLs: true,
          mixedContentMode: MixedContentMode.MIXED_CONTENT_ALWAYS_ALLOW,
          applicationNameForUserAgent: 'FormGear WebView',
          useOnDownloadStart: true,
          useShouldOverrideUrlLoading: true,
          // iOS-specific settings for local server access
          allowsBackForwardNavigationGestures: false,
          allowsLinkPreview: false,
          isFraudulentWebsiteWarningEnabled: false,
          // Allow insecure content for local development
          upgradeKnownHostsToHTTPS: false,
          // iOS WKWebView specific settings for better JavaScript compatibility
          javaScriptCanOpenWindowsAutomatically: true,
          // iOS specific: Allow inline media playback
          allowsInlineMediaPlayback: true,
          // Remove WebView Asset Loader - using direct injection instead
        );
  }

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<FormGearWebViewBloc, FormGearWebViewState>(
      listener: (context, state) {
        // Handle side effects here if needed
      },
      builder: (context, state) {
        return PopScope(
          canPop: false, // Always handle pop manually
          onPopInvokedWithResult: (didPop, result) async {
            if (didPop) return; // Already popped, nothing to do

            await _handleBackNavigation(state.controller);
          },
          child: Stack(
            children: [
              Column(
                children: [
                  if (state.hasError)
                    Container(
                      width: double.infinity,
                      color: Colors.red[100],
                      padding: const EdgeInsets.all(8),
                      child: Text(
                        'Error: ${state.errorMessage}',
                        style: TextStyle(color: Colors.red[800]),
                      ),
                    ),
                  Expanded(
                    child: SafeArea(
                      child: InAppWebView(
                        initialSettings: _webViewSettings,
                        initialUrlRequest: URLRequest(url: WebUri(widget.url)),
                        initialData: widget.htmlContent != null
                            ? InAppWebViewInitialData(data: widget.htmlContent!)
                            : null,
                        onWebViewCreated: (controller) async {
                          widget.onWebViewCreated?.call(controller);

                          // Initialize WebView with BLoC
                          context.read<FormGearWebViewBloc>().add(
                            InitializeWebView(controller),
                          );
                        },
                        onLoadStart: (controller, url) {
                          widget.onLoadStart?.call(
                            controller,
                            url?.toString() ?? '',
                          );

                          context.read<FormGearWebViewBloc>().add(
                            WebViewLoadStart(controller, url?.toString() ?? ''),
                          );
                        },
                        onProgressChanged: (controller, progress) {
                          context.read<FormGearWebViewBloc>().add(
                            UpdateLoadingProgress(progress),
                          );
                        },
                        onLoadStop: (controller, url) async {
                          widget.onLoadStop?.call(
                            controller,
                            url?.toString() ?? '',
                          );

                          context.read<FormGearWebViewBloc>().add(
                            WebViewLoadStop(controller, url?.toString() ?? ''),
                          );
                        },
                        onReceivedError: (controller, request, error) {
                          final urlString = request.url.toString();
                          final code = error.type.toNativeValue() ?? -1;
                          final message = error.description;

                          widget.onLoadError?.call(
                            controller,
                            urlString,
                            code,
                            message,
                          );

                          context.read<FormGearWebViewBloc>().add(
                            WebViewLoadError(
                              controller: controller,
                              url: urlString,
                              code: code,
                              message: message,
                            ),
                          );
                        },
                        onConsoleMessage: (controller, consoleMessage) {
                          widget.onConsoleMessage?.call(
                            controller,
                            consoleMessage,
                          );
                        },
                        onPermissionRequest: (controller, request) async {
                          return PermissionResponse(
                            resources: request.resources,
                            action: PermissionResponseAction.GRANT,
                          );
                        },
                      ),
                    ),
                  ),
                ],
              ),
              // Modern loading overlay with FormGear logo
              if (state.isLoading)
                FormGearLoadingScreen(loadingProgress: state.loadingProgress),
            ],
          ),
        );
      },
    );
  }

  /// Handle back navigation - check if WebView can go back
  Future<void> _handleBackNavigation(InAppWebViewController? controller) async {
    if (controller == null) {
      // No WebView controller, allow normal back navigation
      if (mounted) {
        Navigator.of(context).pop();
      }
      return;
    }

    try {
      // Check if WebView can go back
      final canGoBack = await controller.canGoBack();

      if (canGoBack) {
        // WebView has history, navigate back within WebView
        await controller.goBack();
        FormGearLogger.webview('WebView navigated back');
      } else {
        // No WebView history, allow normal back navigation
        if (mounted) {
          Navigator.of(context).pop();
        }
      }
    } on Exception catch (e) {
      FormGearLogger.webviewError('Error checking WebView back navigation: $e');

      // On error, allow normal back navigation
      if (mounted) {
        Navigator.of(context).pop();
      }
    }
  }

  /// Get the WebView controller from BLoC state
  InAppWebViewController? getController(BuildContext context) {
    return context.read<FormGearWebViewBloc>().state.controller;
  }

  /// Execute JavaScript in the WebView
  Future<dynamic> executeJavaScript(BuildContext context, String source) async {
    final controller = getController(context);
    if (controller == null) {
      throw Exception('WebView not initialized');
    }
    return controller.evaluateJavascript(source: source);
  }

  /// Reload the WebView
  Future<void> reload(BuildContext context) async {
    final controller = getController(context);
    if (controller == null) {
      throw Exception('WebView not initialized');
    }
    await controller.reload();
  }

  /// Clear WebView cache
  Future<void> clearCache() async {
    await InAppWebViewController.clearAllCache();
  }
}
