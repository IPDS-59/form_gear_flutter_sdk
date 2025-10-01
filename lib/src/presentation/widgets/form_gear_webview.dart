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
                        initialUrlRequest: widget.htmlContent == null
                            ? URLRequest(url: WebUri(widget.url))
                            : null,
                        // DON'T use initialData - it loads before bridge injection
                        // Instead, load HTML after bridge is ready in onWebViewCreated
                        onWebViewCreated: (controller) async {
                          widget.onWebViewCreated?.call(controller);

                          // Initialize WebView with BLoC (this injects the bridge)
                          context.read<FormGearWebViewBloc>().add(
                            InitializeWebView(controller, widget.htmlContent),
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

  /// Handle back navigation - show exit confirmation dialog
  /// Multi-section navigation is handled by FormGear/FasihForm JavaScript
  Future<void> _handleBackNavigation(InAppWebViewController? controller) async {
    if (controller == null) {
      // No WebView controller, allow normal back navigation
      if (mounted) {
        Navigator.of(context).pop();
      }
      return;
    }

    // Always show exit confirmation dialog
    // Multi-section forms handle their own internal navigation
    await _showExitConfirmationDialog(controller);
  }

  /// Show exit confirmation dialog before closing the form
  /// Uses SDK's modern dialog design system
  Future<void> _showExitConfirmationDialog(
    InAppWebViewController controller,
  ) async {
    if (!mounted) return;

    final shouldExit = await showDialog<bool>(
      context: context,
      barrierDismissible: false,
      builder: (dialogContext) => Dialog(
        backgroundColor: Colors.transparent,
        elevation: 0,
        child: Container(
          constraints: const BoxConstraints(maxWidth: 340),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.1),
                blurRadius: 20,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Header with warning icon
              Container(
                padding: const EdgeInsets.fromLTRB(24, 24, 24, 16),
                child: Row(
                  children: [
                    Container(
                      width: 48,
                      height: 48,
                      decoration: BoxDecoration(
                        color: const Color(0xFFFEF3C7),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(
                        Icons.warning_amber_rounded,
                        color: Color(0xFFF59E0B),
                        size: 24,
                      ),
                    ),
                    const SizedBox(width: 16),
                    const Expanded(
                      child: Text(
                        'Perhatian',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w600,
                          color: Color(0xFF1F2937),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              // Content
              Container(
                padding: const EdgeInsets.fromLTRB(24, 0, 24, 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Apakah Anda yakin akan keluar dari halaman ini?',
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w400,
                        color: Color(0xFF6B7280),
                        height: 1.5,
                      ),
                    ),
                    const SizedBox(height: 24),
                    // Action buttons
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () =>
                                Navigator.of(dialogContext).pop(false),
                            style: OutlinedButton.styleFrom(
                              side: BorderSide(
                                color: Colors.grey.withValues(alpha: 0.3),
                                width: 1.5,
                              ),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                              padding: const EdgeInsets.symmetric(vertical: 14),
                            ),
                            child: const Text(
                              'Tidak',
                              style: TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.w600,
                                color: Color(0xFF6B7280),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Container(
                            decoration: BoxDecoration(
                              gradient: const LinearGradient(
                                colors: [
                                  Color(0xFF1E88E5),
                                  Color(0xFF1976D2),
                                ],
                                begin: Alignment.topCenter,
                                end: Alignment.bottomCenter,
                              ),
                              borderRadius: BorderRadius.circular(12),
                              boxShadow: [
                                BoxShadow(
                                  color: const Color(
                                    0xFF1E88E5,
                                  ).withValues(alpha: 0.3),
                                  blurRadius: 8,
                                  offset: const Offset(0, 2),
                                ),
                              ],
                            ),
                            child: ElevatedButton(
                              onPressed: () =>
                                  Navigator.of(dialogContext).pop(true),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.transparent,
                                shadowColor: Colors.transparent,
                                elevation: 0,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                padding: const EdgeInsets.symmetric(
                                  vertical: 14,
                                ),
                              ),
                              child: const Text(
                                'Iya',
                                style: TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w600,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );

    if ((shouldExit ?? false) && mounted) {
      // Call mobileExit() to trigger cleanup in FormGear/FasihForm
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

      // Close the form
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
