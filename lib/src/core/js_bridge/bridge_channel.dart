import 'dart:async';
import 'dart:convert';

import 'package:form_gear_engine_sdk/src/core/js_bridge/js_executor_service.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/js_handler_base.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/models/response_models.dart';
import 'package:form_gear_engine_sdk/src/utils/form_gear_logger.dart';

/// Serves `window.flutter_inappwebview.callHandler(...)` calls posted by
/// `PagePrelude.bridgePolyfill` and settles each JS promise with the result.
class JsBridge {
  JsBridge({
    required List<JSHandler<dynamic>> handlers,
    required this.origin,
    required this.runJavaScript,
  }) : _handlers = {for (final h in handlers) h.handlerName: h};

  final Map<String, JSHandler<dynamic>> _handlers;

  /// The WebView this bridge serves; tags handler zones so late results
  /// can't reach a different form (see [JSExecutorService.originKey]).
  final Object origin;

  /// Runs JS in [origin] directly (promise settlement is never dropped).
  final Future<void> Function(String javaScript) runJavaScript;

  /// Handles one `{id, name, args}` message from the channel.
  Future<void> onMessage(String message) async {
    final call = jsonDecode(message) as Map<String, dynamic>;
    final id = call['id'];
    final name = call['name'] as String? ?? '';
    final args = call['args'] as List<dynamic>? ?? const <dynamic>[];

    List<Object?> settle;
    try {
      final handler = _handlers[name];
      if (handler == null) throw StateError('No JS handler named "$name"');
      final result = await runZoned(
        () => handler.callback(args),
        zoneValues: {JSExecutorService.originKey: origin},
      );
      settle = [id, true, bridgeValue(name, result)];
    } on Object catch (e) {
      FormGearLogger.jsBridgeError('Handler $name failed: $e');
      settle = [id, false, '$e'];
    }

    try {
      await runJavaScript(
        JSExecutorService.jsCall('window.__fgBridgeResolve', settle),
      );
    } on Object catch (e) {
      // The page is gone (form closed); nothing left to resolve.
      FormGearLogger.webview('Could not settle $name call: $e');
    }
  }

  /// Value the JS caller receives. Getters return the strings FormGear's
  /// `callAndroidFunction` parses; actions return the full JSON response.
  static Object? bridgeValue(String handlerName, Object? result) {
    // Native returns a plain String for these, never a wrapper object.
    if (result is StringInfoJs) return result.value ?? '';
    if (handlerName.startsWith('get') || handlerName.contains('Role')) {
      switch (result) {
        case JsonInfoJs(:final data):
          return jsonEncode(data ?? const <String, dynamic>{});
        case ListInfoJs(:final data):
          return jsonEncode(data ?? const <dynamic>[]);
      }
    }
    return result is JsonCodable ? result.toJson() : result;
  }
}
