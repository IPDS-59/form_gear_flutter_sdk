import 'dart:convert';
import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:form_gear_engine_sdk/src/core/engine/page_prelude.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/js_handler_base.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/models/response_models.dart';

class _Handler extends JSHandler<JsonCodable> {
  _Handler(this.handlerName, this.result);

  @override
  final String handlerName;
  final JsonCodable result;

  @override
  Future<JsonCodable> callback(List<dynamic> arguments) async => result;
}

final _handlers = <JSHandler<dynamic>>[
  _Handler(
    'getTemplate',
    JsonInfoJs(
      success: true,
      data: const {
        'components': [
          [
            {'dataKey': 'a', 'label': '</script><b>x'},
          ],
        ],
      },
    ),
  ),
  _Handler(
    'getValidation',
    JsonInfoJs(success: true, data: const {'testFunctions': <dynamic>[]}),
  ),
  _Handler(
    'getPrincipalCollection',
    ListInfoJs(success: true, data: const [1]),
  ),
  _Handler('getFormMode', StringInfoJs(success: true, value: '1')),
  _Handler('getIsNew', StringInfoJs(success: true, value: '0')),
  _Handler('getUserName', StringInfoJs(success: true, value: "O'Brien")),
  _Handler('getUserRole', StringInfoJs(success: true, value: 'PCL')),
  _Handler('execute', ActionInfoJs(success: true)),
];

void main() {
  group('PagePrelude.inject', () {
    test('inserts scripts right after <head>, not <header>', () {
      const html =
          '<html><head lang="id"><title>t</title></head> '
          '<body><header></header></body></html>';
      final out = PagePrelude.inject(html, ['A=1', 'B=2']);
      expect(
        out,
        startsWith(
          '<html><head lang="id">\n<script>A=1</script>\n'
          '<script>B=2</script>\n<title>',
        ),
      );
      expect(out, contains('<header></header>'));
    });

    test('prepends when there is no <head>', () {
      expect(
        PagePrelude.inject('<p>x</p>', ['A=1']),
        '<script>A=1</script>\n<p>x</p>',
      );
    });
  });

  test('htmlSafeJson cannot close the surrounding script tag', () {
    final out = PagePrelude.htmlSafeJson({'k': '</script><script>evil()'});
    expect(out, isNot(contains('</script>')));
    expect(jsonDecode(out), {'k': '</script><script>evil()'});
  });

  test('fasihAndroidShim embeds getters and proxies actions', () async {
    final shim = await PagePrelude.fasihAndroidShim(_handlers);
    expect(shim, isNot(contains('</script>')));
    expect(shim, contains('"getFormMode":"1"'));
    expect(shim, contains('"execute"'));
  });

  test(
    'errorForwarder reports uncaught errors and rejections with stack',
    () async {
      const script =
          '''
globalThis.window = globalThis;
const l = {};
window.addEventListener = (t, f) => { l[t] = f; };
${PagePrelude.errorForwarder}
function boom() { throw new Error('boom'); }
try { boom(); } catch (e) { l.error({ message: e.message, filename: 'x.js', lineno: 3, colno: 7, error: e }); }
l.unhandledrejection({ reason: new TypeError('nope') });
''';
      final dir = Directory.systemTemp.createTempSync('fg_err');
      final file = File('${dir.path}/err.js')..writeAsStringSync(script);
      final result = await Process.run('node', [file.path]);
      dir.deleteSync(recursive: true);

      final err = result.stderr as String;
      expect(err, contains('[FormGear] Uncaught boom at x.js:3:7'));
      expect(err, contains('at boom'));
      expect(err, contains('[FormGear] Unhandled rejection: TypeError: nope'));
    },
    skip: Process.runSync('which', ['node']).exitCode != 0
        ? 'node not installed'
        : false,
  );

  // Runs the shim and the stock FasihForm index.html startup code for real.
  test(
    'stock FasihForm page starts with the shim (no ReferenceError)',
    () async {
      final page = File(
        'example/assets/formengine/2/index.html',
      ).readAsStringSync();
      final module = RegExp(
        r'<script type="module">([\s\S]*?)</script>',
      ).firstMatch(page)!.group(1)!;
      const stub = '''
function FasihForm(sel, opts) {
  globalThis.__opts = opts;
  return { event: { on() {}, emit() {} }, render() {} };
}''';
      final shim = await PagePrelude.fasihAndroidShim(_handlers);
      final script = [
        'globalThis.window = globalThis;',
        'window.flutter_inappwebview = { callHandler: async () => null };',
        PagePrelude.errorForwarder.replaceAll(
          'window.addEventListener',
          '(()=>{})',
        ),
        shim,
        module.replaceFirst('//formgear_js', stub),
        'if (!window.fasihForm) throw new Error("fasihForm not set");',
        'console.log(JSON.stringify(__opts));',
      ].join('\n');

      final dir = Directory.systemTemp.createTempSync('fg_shim');
      final file = File('${dir.path}/page.js')..writeAsStringSync(script);
      final result = await Process.run('node', [file.path]);
      dir.deleteSync(recursive: true);

      expect(result.exitCode, 0, reason: '${result.stderr}');
      final opts = jsonDecode(result.stdout as String) as Map<String, dynamic>;
      expect(opts['formMode'], 1);
      expect(opts['initialMode'], 0);
      expect(opts['user'], {'username': "O'Brien", 'role': 'PCL'});
      expect(opts['validation'], {'testFunctions': <dynamic>[]});
      expect(opts['principals'], [1]);
      final template = opts['template'] as Map<String, dynamic>;
      expect(((template['components'] as List).first as List).first, {
        'dataKey': 'a',
        'label': '</script><b>x',
      });
    },
    skip: Process.runSync('which', ['node']).exitCode != 0
        ? 'node not installed'
        : false,
  );
}
