import 'dart:convert';

import 'package:form_gear_engine_sdk/src/core/js_bridge/js_handler_base.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/models/response_models.dart';

/// Scripts inlined as the first `<script>` in `<head>`, so they run before
/// any engine code regardless of which WebView plugin hosts the page.
class PagePrelude {
  const PagePrelude._();

  /// Forwards uncaught errors and unhandled rejections (with stack) to the
  /// console, which the WebView host relays to Flutter logs.
  static const errorForwarder = r'''
(function () {
  if (window.__fgErrorHooked) return;
  window.__fgErrorHooked = true;
  function stackOf(e) { return e && e.stack ? String(e.stack) : String(e); }
  window.addEventListener('error', function (ev) {
    window.__fgLastError = ev.message || 'error';
    console.error('[FormGear] Uncaught ' + window.__fgLastError + ' at ' +
      (ev.filename || 'inline') + ':' + (ev.lineno || 0) + ':' + (ev.colno || 0) +
      '\n' + stackOf(ev.error));
  });
  window.addEventListener('unhandledrejection', function (ev) {
    window.__fgLastError = 'Unhandled rejection: ' + stackOf(ev.reason);
    console.error('[FormGear] ' + window.__fgLastError);
  });
})();
''';

  /// JavaScript channel the [bridgePolyfill] posts handler calls to.
  static const bridgeChannel = 'FormGearBridge';

  /// `window.flutter_inappwebview.callHandler(name, ...args) -> Promise`,
  /// the contract the engine bundles are compiled against, implemented over a
  /// one-way webview_flutter JavaScript channel. Dart answers each call via
  /// `window.__fgBridgeResolve(id, ok, value)` (see `JsBridge`).
  static const bridgePolyfill =
      """
(function () {
  if (window.flutter_inappwebview) return;
  var seq = 0, pending = {};
  window.__fgBridgeResolve = function (id, ok, value) {
    var p = pending[id];
    if (!p) return;
    delete pending[id];
    if (ok) p.resolve(value); else p.reject(new Error(value));
  };
  window.flutter_inappwebview = {
    callHandler: function (name) {
      var args = Array.prototype.slice.call(arguments, 1);
      return new Promise(function (resolve, reject) {
        var id = ++seq;
        pending[id] = { resolve: resolve, reject: reject };
        $bridgeChannel.postMessage(JSON.stringify({ id: id, name: name, args: args }));
      });
    }
  };
  document.addEventListener('DOMContentLoaded', function () {
    window.dispatchEvent(new Event('flutterInAppWebViewPlatformReady'));
  });
})();
""";

  /// Handlers FasihForm's stock `index.html` reads synchronously via
  /// `window.Android.<name>()`. Everything else is proxied to `callHandler`.
  static const fasihSyncGetters = {
    'getTemplate',
    'getValidation',
    'getPreset',
    'getResponse',
    'getMedia',
    'getRemark',
    'getReference',
    'getPrincipalCollection',
    'getUserName',
    'getFormMode',
    'getIsNew',
    'getUserRole',
    'getRolePetugas',
    'getGPSTimeout',
    'getServerUrl',
    'loadActivityTemplateData',
  };

  /// Builds a synchronous `window.Android` for FasihForm (engine 2).
  ///
  /// The stock page calls `Android.getFormMode()` etc. outside any `try`, so
  /// the object must exist before the page module runs. Getter values are
  /// taken from the same [handlers] the async bridge serves, so both paths
  /// always agree.
  static Future<String> fasihAndroidShim(
    List<JSHandler<dynamic>> handlers,
  ) async {
    final values = <String, Object?>{};
    final proxied = <String>[];
    for (final handler in handlers) {
      final name = handler.handlerName;
      if (fasihSyncGetters.contains(name)) {
        values[name] = rawValue(await handler.callback(const <dynamic>[]));
      } else {
        proxied.add(name);
      }
    }

    return '''
(function () {
  if (typeof window.Android !== 'undefined') return;
  var v = ${htmlSafeJson(values)};
  var proxied = ${htmlSafeJson(proxied)};
  var A = {};
  Object.keys(v).forEach(function (k) {
    A[k] = function () {
      var x = v[k];
      return typeof x === 'string' ? x : JSON.stringify(x);
    };
  });
  proxied.forEach(function (k) {
    A[k] = function () {
      var args = Array.prototype.slice.call(arguments);
      return window.flutter_inappwebview.callHandler.apply(
        window.flutter_inappwebview, [k].concat(args));
    };
  });
  window.Android = A;
})();
''';
  }

  /// Unwraps a handler result to the plain value a native getter returns.
  static Object? rawValue(Object? result) => switch (result) {
    StringInfoJs(:final value) => value ?? '',
    JsonInfoJs(:final data) => data ?? const <String, dynamic>{},
    ListInfoJs(:final data) => data ?? const <dynamic>[],
    JsonCodable() => result.toJson(),
    _ => result,
  };

  /// JSON that is also safe inside an inline `<script>` (no `</script>`).
  static String htmlSafeJson(Object? value) => jsonEncode(value)
      .replaceAll('<', r'\u003c')
      .replaceAll(String.fromCharCode(0x2028), r'\u2028')
      .replaceAll(String.fromCharCode(0x2029), r'\u2029');

  /// Inserts [scripts] as inline `<script>` tags right after `<head>`.
  static String inject(String html, List<String> scripts) {
    if (scripts.isEmpty) return html;
    final tags = scripts.map((s) => '<script>$s</script>').join('\n');
    final head = RegExp(r'<head(\s[^>]*)?>', caseSensitive: false);
    final match = head.firstMatch(html);
    if (match == null) return '$tags\n$html';
    return html.replaceRange(match.end, match.end, '\n$tags\n');
  }
}
