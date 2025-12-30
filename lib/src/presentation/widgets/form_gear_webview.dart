import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/js_bridge.dart';
import 'package:form_gear_engine_sdk/src/core/services/navigator_context_provider.dart';
import 'package:form_gear_engine_sdk/src/presentation/bloc/form_gear_webview_bloc.dart';
import 'package:form_gear_engine_sdk/src/presentation/widgets/exit_confirmation_dialog.dart';
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
    try {
      // JavaScript that checks if form can go back and navigates if possible
      // Works for both FormGear and FasihForm engines
      // Priority:
      // 1. Call mobileBack() if defined (form engine handles it)
      // 2. Emit back-request event for FasihForm
      // 3. Look for prev/back buttons in the DOM
      // 4. Check WebView history
      final result = await controller.evaluateJavascript(
        source: '''
          (function() {
            try {
              // 1. Check for mobileBack function (custom handler)
              if (typeof window.mobileBack === 'function') {
                var backResult = window.mobileBack();
                // mobileBack returns true if it handled back, false if can't go back
                if (backResult === true || backResult === 'true') {
                  return true;
                }
                if (backResult === false || backResult === 'false') {
                  return false;
                }
              }

              // 2. FasihForm: Emit back-request event and check if handled
              if (window.fasihForm && window.fasihForm.event) {
                // Check if fasihForm has a canGoBack method or similar
                if (typeof window.fasihForm.canGoBack === 'function') {
                  if (window.fasihForm.canGoBack()) {
                    window.fasihForm.goBack();
                    return true;
                  }
                  return false;
                }

                // Try emitting back-request event
                try {
                  window.fasihForm.event.emit('back-request');
                  // If no error, assume handled (form will handle it)
                  // We need to check if we're on first section
                } catch (e) {
                  // Event not supported, continue to DOM check
                }
              }

              // 3. Look for prev/back navigation buttons in DOM
              var prevButton = document.querySelector(
                'button[data-action="prev"], ' +
                'button[data-action="back"], ' +
                '[data-testid="prev-section"], ' +
                '[data-testid="back-button"], ' +
                '.prev-section-btn, ' +
                '.back-btn, ' +
                'button[aria-label*="previous" i], ' +
                'button[aria-label*="sebelumnya" i], ' +
                'button[aria-label*="kembali" i]'
              );

              if (prevButton && !prevButton.disabled &&
                  prevButton.offsetParent !== null &&
                  getComputedStyle(prevButton).display !== 'none') {
                prevButton.click();
                return true;
              }

              // 4. Check for stepper/pagination navigation
              var steppers = document.querySelectorAll(
                '.stepper-item, .step-item, .pagination-item, ' +
                '[role="tab"], [data-step]'
              );

              if (steppers.length > 1) {
                var activeIndex = -1;
                steppers.forEach(function(el, idx) {
                  if (el.classList.contains('active') ||
                      el.classList.contains('current') ||
                      el.getAttribute('aria-selected') === 'true' ||
                      el.getAttribute('data-active') === 'true') {
                    activeIndex = idx;
                  }
                });

                // If we're past first step, click previous step
                if (activeIndex > 0) {
                  steppers[activeIndex - 1].click();
                  return true;
                }

                // On first step, can't go back
                if (activeIndex === 0) {
                  return false;
                }
              }

              // Can't determine navigation state
              return 'unknown';
            } catch (e) {
              console.log('Back navigation check error: ' + e);
              return 'error';
            }
          })();
        ''',
      );

      // Parse result - could be bool, string, or null
      if (result == true || result == 'true') {
        return true;
      }

      if (result == false || result == 'false') {
        return false;
      }

      // If unknown, check WebView history as fallback
      final canGoBack = await controller.canGoBack();
      if (canGoBack) {
        await controller.goBack();
        return true;
      }

      return false;
    } on Exception catch (e) {
      FormGearLogger.webviewError('Error checking form back navigation: $e');
      return false;
    }
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
    try {
      await controller.evaluateJavascript(
        source: '''
          (function() {
            try {
              if (typeof window.mobileExit === 'function') {
                window.mobileExit();
              } else if (typeof Android !== 'undefined' && typeof Android.mobileExit === 'function') {
                Android.mobileExit();
              }
            } catch (e) {
              console.log('mobileExit not available: ' + e);
            }
          })();
        ''',
      );
      FormGearLogger.webview('Called mobileExit before closing form');
    } on Exception catch (e) {
      FormGearLogger.webviewError('Error calling mobileExit: $e');
    }

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
