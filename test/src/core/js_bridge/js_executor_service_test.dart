import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/js_executor_service.dart';
import 'package:form_gear_engine_sdk/src/core/server/form_gear_server.dart';
import 'package:form_gear_engine_sdk/src/utils/fasih_form_notifier.dart';
import 'package:mocktail/mocktail.dart';
import 'package:webview_flutter/webview_flutter.dart';

class _Controller extends Mock implements WebViewController {}

final _hasNode = Process.runSync('which', ['node']).exitCode == 0;

void main() {
  late _Controller controller;
  late List<String> executed;
  final executor = JSExecutorService();

  setUp(() {
    executed = [];
    controller = _Controller();
    when(() => controller.runJavaScript(any())).thenAnswer((inv) async {
      executed.add(inv.positionalArguments.single as String);
    });
    executor.registerController(controller, '2');
  });

  tearDown(executor.unregisterController);

  test(
    'file names with quotes and backslashes reach the engine intact',
    () async {
      const dataKey = r'photo"1\';
      const fileName = r'''it's "a" \file.jpg''';
      await FasihFormNotifier.notifyFileSelection(
        dataKey: dataKey,
        filePath: '/media/$fileName',
        fileName: fileName,
      );
      expect(executed, hasLength(1));

      final script = '''
globalThis.window = globalThis;
window.fasihForm = { event: { emit: (...a) => console.log(JSON.stringify(a)) } };
${executed.single}''';
      final dir = Directory.systemTemp.createTempSync('fg_js');
      final file = File('${dir.path}/emit.js')..writeAsStringSync(script);
      final result = await Process.run('node', [file.path]);
      dir.deleteSync(recursive: true);

      expect(result.exitCode, 0, reason: '${result.stderr}');
      final args = jsonDecode(result.stdout as String) as List;
      expect(args[0], 'file-selected');
      expect(args[1], dataKey);
      final files = jsonDecode(args[2] as String) as List;
      expect((files.single as Map)['filename'], fileName);
      expect((files.single as Map)['uri'], 'file:///media/$fileName');
    },
    skip: _hasNode ? false : 'node not installed',
  );

  test('a result from a closed form never reaches the new form', () async {
    final oldForm = _Controller();
    await runZoned(
      () => FasihFormNotifier.notifyLocation(
        dataKey: 'gps',
        latitude: 1,
        longitude: 2,
        accuracy: 3,
      ),
      zoneValues: {JSExecutorService.originKey: oldForm},
    );
    expect(executed, isEmpty);

    // The same call from the current form goes through.
    await runZoned(
      () => FasihFormNotifier.notifyLocation(
        dataKey: 'gps',
        latitude: 1,
        longitude: 2,
        accuracy: 3,
      ),
      zoneValues: {JSExecutorService.originKey: controller},
    );
    expect(executed, hasLength(1));
  });

  test('closing a stale form does not unregister the current one', () {
    executor.unregisterController(_Controller());
    expect(executor.isRegistered, isTrue);
    executor.unregisterController(controller);
    expect(executor.isRegistered, isFalse);
  });

  group('FormGearServer.filterLookupRows', () {
    const rows = [
      {'prov': '72', 'kab': '7201', 'name': 'A'},
      {'prov': '72', 'kab': '7202', 'name': 'B'},
      {'prov': '73', 'kab': '7301', 'name': 'C'},
    ];

    test('filters list or {data: [...]} by every key/value condition', () {
      const c = '[{"key":"prov","value":"72"},{"key":"kab","value":"7202"}]';
      expect(FormGearServer.filterLookupRows(rows, c), [rows[1]]);
      expect(FormGearServer.filterLookupRows({'data': rows}, '[]'), rows);
    });

    test('bad conditions return rows unfiltered', () {
      expect(FormGearServer.filterLookupRows(rows, 'not json'), rows);
    });
  });
}
