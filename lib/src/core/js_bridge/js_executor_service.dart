import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:form_gear_engine_sdk/src/utils/form_gear_logger.dart';

/// Global service for executing JavaScript in the current WebView
/// Allows handlers to execute JavaScript without direct WebView
/// controller access
class JSExecutorService {

  /// Get the singleton instance
  factory JSExecutorService() => _instance ??= JSExecutorService._();
  JSExecutorService._();

  static JSExecutorService? _instance;

  InAppWebViewController? _controller;
  String? _formEngineId;

  /// Register a WebView controller for JavaScript execution
  void registerController(
    InAppWebViewController controller,
    String? formEngineId,
  ) {
    _controller = controller;
    _formEngineId = formEngineId;
    FormGearLogger.sdk(
      'JavaScript executor registered for engine: $formEngineId',
    );
  }

  /// Unregister the current WebView controller
  void unregisterController() {
    _controller = null;
    _formEngineId = null;
    FormGearLogger.sdk('JavaScript executor unregistered');
  }

  /// Execute JavaScript in the current WebView
  Future<void> executeJavaScript(String javascript) async {
    if (_controller == null) {
      FormGearLogger.webviewError(
        'No WebView controller registered for JavaScript execution',
      );
      return;
    }

    try {
      FormGearLogger.webview('Executing JavaScript: $javascript');
      await _controller!.evaluateJavascript(source: javascript);
    } on Exception catch (e) {
      FormGearLogger.webviewError('JavaScript execution failed: $e');
    }
  }

  /// Get the current form engine ID
  String? get formEngineId => _formEngineId;

  /// Check if a controller is registered
  bool get isRegistered => _controller != null;
}
