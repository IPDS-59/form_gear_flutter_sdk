import 'dart:async';
import 'dart:convert';

import 'package:form_gear_engine_sdk/src/core/observability/form_gear_bridge_event.dart';
import 'package:form_gear_engine_sdk/src/utils/form_gear_logger.dart';
import 'package:webview_flutter/webview_flutter.dart';

/// Global service for executing JavaScript in the current WebView
/// Allows handlers to execute JavaScript without direct WebView
/// controller access
class JSExecutorService {
  /// Get the singleton instance
  factory JSExecutorService() => _instance ??= JSExecutorService._();
  JSExecutorService._();

  static JSExecutorService? _instance;

  /// Zone key holding the controller a bridge call came from. The WebView
  /// bloc runs every handler in a zone carrying it, so a result that arrives
  /// after its form closed (or another form opened) is dropped instead of
  /// landing in the wrong WebView.
  static const originKey = #formGearBridgeOrigin;

  /// `function(a, b, ...)` with every argument JSON-encoded; never splice
  /// raw strings into JS.
  static String jsCall(String function, List<Object?> args) =>
      '$function(${args.map(jsonEncode).join(', ')})';

  WebViewController? _controller;
  String? _formEngineId;

  /// Register a WebView controller for JavaScript execution
  void registerController(WebViewController controller, String? formEngineId) {
    _controller = controller;
    _formEngineId = formEngineId;
    FormGearLogger.sdk(
      'JavaScript executor registered for engine: $formEngineId',
    );
  }

  /// Unregister [controller] (or whatever is registered when omitted). A
  /// stale controller never clears a newer form's registration.
  void unregisterController([WebViewController? controller]) {
    if (controller != null && !identical(controller, _controller)) return;
    _controller = null;
    _formEngineId = null;
    FormGearLogger.sdk('JavaScript executor unregistered');
  }

  /// Execute JavaScript in the current WebView
  Future<void> executeJavaScript(String javascript) async {
    final controller = _controller;
    final origin = Zone.current[originKey];
    if (controller == null ||
        (origin != null && !identical(origin, controller))) {
      FormGearLogger.webview(
        'Dropped JavaScript callback: its form is closed or was replaced',
      );
      return;
    }

    try {
      FormGearLogger.webview('Executing JavaScript: $javascript');
      FormGearBridgeObserver.instance.emit(
        direction: FormGearBridgeDirection.hostToJs,
        kind: FormGearBridgeKind.push,
        channel: 'js',
        args: javascript,
      );
      await controller.runJavaScript(javascript);
    } on Object catch (e) {
      FormGearLogger.webviewError('JavaScript execution failed: $e');
      FormGearBridgeObserver.instance.emit(
        direction: FormGearBridgeDirection.hostToJs,
        kind: FormGearBridgeKind.push,
        channel: 'js',
        args: javascript,
        error: '$e',
      );
    }
  }

  /// Runs [source] in the open form's WebView and returns its result as
  /// text, or null when no form is open. For debuggers; not for app logic.
  Future<String?> evaluate(String source) async {
    final controller = _controller;
    if (controller == null) return null;
    final result = await controller.runJavaScriptReturningResult(source);
    return '${resultValue(result)}';
  }

  /// Emits a FasihForm (engine 2) event; logged in-page if the engine never
  /// started instead of throwing a ReferenceError.
  Future<void> emitFasihFormEvent(
    String event, [
    List<Object?> args = const [],
  ]) => executeJavaScript(
    'if (window.fasihForm && window.fasihForm.event) { '
    '${jsCall('window.fasihForm.event.emit', [event, ...args])}; '
    '} else { console.error('
    '${jsonEncode('[FormGear] fasihForm not ready, dropped $event')}); }',
  );

  /// Normalizes `runJavaScriptReturningResult`: Android returns JS strings
  /// JSON-quoted (`"ready"`), iOS returns them bare.
  static Object resultValue(Object result) {
    if (result is String && result.length >= 2 && result.startsWith('"')) {
      try {
        return jsonDecode(result) as Object;
      } on FormatException {
        return result;
      }
    }
    return result;
  }

  /// Get the current form engine ID
  String? get formEngineId => _formEngineId;

  /// Check if a controller is registered
  bool get isRegistered => _controller != null;
}
