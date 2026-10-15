import 'dart:convert';
import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:form_gear_engine_sdk/src/core/engine/page_prelude.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/bridge_channel.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/js_handler_base.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/models/response_models.dart';

class _Handler extends JSHandler<JsonCodable> {
  _Handler(this.handlerName, this.run);

  @override
  final String handlerName;
  final JsonCodable Function(List<dynamic>) run;

  @override
  Future<JsonCodable> callback(List<dynamic> arguments) async => run(arguments);
}

void main() {
  // Page calls callHandler -> channel message -> JsBridge -> resolve script
  // -> the page's promise, end to end with the real polyfill in node.
  test(
    'callHandler promises resolve with handler results over the channel',
    () async {
      final resolves = <String>[];
      final bridge = JsBridge(
        origin: Object(),
        runJavaScript: (js) async => resolves.add(js),
        handlers: [
          _Handler(
            'getTemplate',
            (_) => JsonInfoJs(
              success: true,
              data: const {'components': <dynamic>[]},
            ),
          ),
          _Handler(
            'execute',
            (args) => ActionInfoJs(success: true, result: args.join('|')),
          ),
        ],
      );

      final messages = [
        '{"id":1,"name":"getTemplate","args":[]}',
        '{"id":2,"name":"nope","args":["x"]}',
        r'{"id":3,"name":"execute","args":["LOCATION","k\"1",""]}',
      ];
      for (final m in messages) {
        await bridge.onMessage(m);
      }

      final script =
          '''
globalThis.window = globalThis;
globalThis.document = { addEventListener() {} };
const sent = [];
globalThis.${PagePrelude.bridgeChannel} = { postMessage: (m) => sent.push(m) };
${PagePrelude.bridgePolyfill}
const h = window.flutter_inappwebview;
const calls = [h.callHandler('getTemplate'), h.callHandler('nope', 'x'),
  h.callHandler('execute', 'LOCATION', 'k"1', '')];
${resolves.join(';\n')};
Promise.allSettled(calls).then((r) => console.log(JSON.stringify({
  sent,
  results: r.map((x) => x.status === 'fulfilled' ? x.value : 'ERR ' + x.reason.message),
})));
''';
      final dir = Directory.systemTemp.createTempSync('fg_bridge');
      final file = File('${dir.path}/bridge.js')..writeAsStringSync(script);
      final result = await Process.run('node', [file.path]);
      dir.deleteSync(recursive: true);

      expect(result.exitCode, 0, reason: '${result.stderr}');
      final out = jsonDecode(result.stdout as String) as Map<String, dynamic>;
      expect(
        (out['sent'] as List).map((m) => jsonDecode(m as String)),
        messages.map(jsonDecode),
      );
      final results = out['results'] as List;
      // Getters keep returning JSON strings (callAndroidFunction parses them).
      expect(results[0], '{"components":[]}');
      expect(
        results[1],
        startsWith('ERR Bad state: No JS handler named "nope"'),
      );
      expect((results[2] as Map)['result'], 'LOCATION|k"1|');
    },
    skip: Process.runSync('which', ['node']).exitCode != 0
        ? 'node not installed'
        : false,
  );
}
