import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/js_bridge.dart';
import 'package:form_gear_engine_sdk/src/core/services/navigator_context_provider.dart';
import 'package:form_gear_engine_sdk/src/presentation/bloc/form_gear_webview_bloc.dart';
import 'package:form_gear_engine_sdk/src/presentation/widgets/exit_confirmation_dialog.dart';
import 'package:form_gear_engine_sdk/src/presentation/widgets/form_gear_loading_screen.dart';
import 'package:form_gear_engine_sdk/src/utils/form_gear_logger.dart';
import 'package:form_gear_engine_sdk/src/utils/webview_navigation_helper.dart';

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
    // Register the navigator context for action handlers to use
    NavigatorContextProvider.instance.register(
      () => mounted ? context : null,
    );
  }

  @override
  void dispose() {
    NavigatorContextProvider.instance.unregister();
    super.dispose();
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
        FormGearLogger.sdk(
          'FormGearWebView BlocConsumer listener: '
          'status=${state.status}, isLoading=${state.isLoading}',
        );
      },
      builder: (context, state) {
        FormGearLogger.sdk(
          'FormGearWebView builder: status=${state.status}, '
          'isLoading=${state.isLoading}',
        );
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
                        initialUrlRequest: widget.htmlContent == null
                            ? URLRequest(url: WebUri(widget.url))
                            : null,
                        // DON'T use initialData - loads before bridge
                        // Instead, load HTML after bridge is ready
                        onWebViewCreated: (controller) async {
                          widget.onWebViewCreated?.call(controller);

                          // Initialize WebView with BLoC
                          context.read<FormGearWebViewBloc>().add(
                            InitializeWebView(
                              controller,
                              widget.htmlContent,
                            ),
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
                        shouldOverrideUrlLoading:
                            (controller, navigationAction) async {
                              // Allow all URL loading - required for iOS
                              // when useShouldOverrideUrlLoading is true
                              return NavigationActionPolicy.ALLOW;
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

  /// Handle back navigation - navigate within form pages first,
  /// then show exit confirmation dialog when can't go back anymore
  Future<void> _handleBackNavigation(InAppWebViewController? controller) async {
    if (controller == null) {
      // No WebView controller, allow normal back navigation
      if (mounted) {
        Navigator.of(context).pop();
      }
      return;
    }

    // Try to navigate back within the form using JavaScript
    // The form engines handle their own section/page navigation internally
    final canGoBackInForm = await _tryNavigateBackInForm(controller);

    if (canGoBackInForm) {
      FormGearLogger.webview('Navigated back within form sections');
    } else {
      // Can't go back anymore - show exit confirmation dialog
      await _showExitConfirmationDialog(controller);
    }
  }

  /// Try to navigate back within the form sections/pages
  /// Returns true if navigation was handled, false if at first section
  Future<bool> _tryNavigateBackInForm(InAppWebViewController controller) async {
    return WebViewNavigationHelper.tryNavigateBackInForm(controller);
  }

  /// Show exit confirmation dialog before closing the form
  Future<void> _showExitConfirmationDialog(
    InAppWebViewController controller,
  ) async {
    if (!mounted) return;

    final shouldExit = await ExitConfirmationDialog.show(context);

    if (shouldExit && mounted) {
      await _callMobileExitAndClose(controller);
    }
  }

  /// Call mobileExit() JavaScript function and close the form
  Future<void> _callMobileExitAndClose(
    InAppWebViewController controller,
  ) async {
    await WebViewNavigationHelper.callMobileExit(controller);

    if (mounted) {
      Navigator.of(context).pop();
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
