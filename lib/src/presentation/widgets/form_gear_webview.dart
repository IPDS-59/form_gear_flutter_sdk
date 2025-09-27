import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/js_bridge.dart';
import 'package:form_gear_engine_sdk/src/presentation/widgets/form_gear_loading_screen.dart';
import 'package:form_gear_engine_sdk/src/utils/form_gear_logger.dart';

/// FormGear WebView widget with JSHandler integration
/// Follows the web_view pattern - simple parameters, external handler injection
class FormGearWebView extends StatefulWidget {
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
  State<FormGearWebView> createState() => _FormGearWebViewState();
}

class _FormGearWebViewState extends State<FormGearWebView> {
  InAppWebViewController? _controller;
  String? _currentError;
  bool _isLoading = true;
  int _loadingProgress = 0;

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
              if (_currentError != null)
                Container(
                  width: double.infinity,
                  color: Colors.red[100],
                  padding: const EdgeInsets.all(8),
                  child: Text(
                    'Error: $_currentError',
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
                      _controller = controller;
                      widget.onWebViewCreated?.call(controller);

                      // Register JS handlers directly on controller
                      for (final handler in widget.jsHandlers) {
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
                            return (result as JsonCodable).toJson();
                          },
                        );
                      }

                      // iOS: Delay initial bridge injection for WebView
                      // to be fully ready
                      if (Platform.isIOS) {
                        await Future<void>.delayed(
                          const Duration(milliseconds: 200),
                        );
                      }

                      // Inject Android bridge object using file-based approach
                      await _injectAndroidBridgeFromFile(controller);
                    },
                    onLoadStart: (controller, url) {
                      widget.onLoadStart?.call(
                        controller,
                        url?.toString() ?? '',
                      );
                      setState(() {
                        _currentError = null;
                        _isLoading = true;
                        _loadingProgress = 0;
                      });
                    },
                    onProgressChanged: (controller, progress) {
                      setState(() {
                        _loadingProgress = progress;
                        if (progress >= 100) {
                          _isLoading = false;
                        }
                      });
                    },
                    onLoadStop: (controller, url) async {
                      widget.onLoadStop?.call(
                        controller,
                        url?.toString() ?? '',
                      );
                      setState(() {
                        _isLoading = false;
                        _loadingProgress = 100;
                      });
                      // iOS: Re-inject bridge after page load
                      // for better compatibility
                      if (Platform.isIOS) {
                        await Future<void>.delayed(
                          const Duration(milliseconds: 1000),
                        );
                        await _injectAndroidBridgeFromFile(controller);
                        // Additional delay for iOS to ensure bridge is fully
                        // ready
                        await Future<void>.delayed(
                          const Duration(milliseconds: 500),
                        );
                        await _verifyBridgeOnIOS(controller);
                      }
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

                      setState(() {
                        _currentError = 'Load Error ($code): $message';
                      });
                    },
                    onConsoleMessage: (controller, consoleMessage) {
                      widget.onConsoleMessage?.call(controller, consoleMessage);
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
          if (_isLoading)
            FormGearLoadingScreen(loadingProgress: _loadingProgress),
        ],
      ),
    );
  }

  /// Handle back navigation - check if WebView can go back
  Future<void> _handleBackNavigation() async {
    if (_controller == null) {
      // No WebView controller, allow normal back navigation
      if (mounted) {
        Navigator.of(context).pop();
      }
      return;
    }

    try {
      // Check if WebView can go back
      final canGoBack = await _controller!.canGoBack();

      if (canGoBack) {
        // WebView has history, navigate back within WebView
        await _controller!.goBack();
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

  /// Inject Android bridge object using file-based injection
  Future<void> _injectAndroidBridgeFromFile(
    InAppWebViewController controller,
  ) async {
    final handlerNames = widget.jsHandlers.map((h) => h.handlerName).toList();

    // Pre-load all data from data handlers synchronously
    final preloadedData = <String, dynamic>{};
    for (final handler in widget.jsHandlers) {
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
    }
  }

  /// Build script to set up data for bridge injection
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

  /// Verify bridge is working on iOS and re-inject if necessary
  Future<void> _verifyBridgeOnIOS(InAppWebViewController controller) async {
    try {
      final result = await controller.evaluateJavascript(
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
        await _injectAndroidBridgeFromFile(controller);
      } else {
        FormGearLogger.sdk('iOS bridge verification successful');
      }
    } on Exception catch (e) {
      FormGearLogger.jsBridgeError('iOS bridge verification error: $e');
      await _injectAndroidBridgeFromFile(controller);
    }
  }

  /// Convert Dart list to JavaScript array string
  String _jsArrayFromList(List<String> items) {
    final escapedItems = items.map((item) => "'$item'").join(', ');
    return '[$escapedItems]';
  }

  /// Get the WebView controller
  InAppWebViewController? get controller => _controller;

  /// Execute JavaScript in the WebView
  Future<dynamic> executeJavaScript(String source) async {
    if (_controller == null) {
      throw Exception('WebView not initialized');
    }
    return _controller!.evaluateJavascript(source: source);
  }

  /// Reload the WebView
  Future<void> reload() async {
    if (_controller == null) {
      throw Exception('WebView not initialized');
    }
    await _controller!.reload();
  }

  /// Clear WebView cache
  Future<void> clearCache() async {
    await InAppWebViewController.clearAllCache();
  }

  @override
  void dispose() {
    super.dispose();
  }
}
