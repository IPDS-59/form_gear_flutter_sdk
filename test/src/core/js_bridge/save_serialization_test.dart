import 'dart:convert';
import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:form_gear_engine_sdk/form_gear_engine_sdk.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/handlers/android_action_handler.dart';
import 'package:form_gear_engine_sdk/src/core/listeners/examples/file_system_listener.dart';

/// Varies latency per payload so unserialized writes would finish out of order.
class _SlowListener extends FileSystemFormDataListener {
  _SlowListener(Directory dir)
    : super(baseDirectory: dir, enableBackups: false);

  final flags = <String>[];

  @override
  Future<SaveSubmitResult> handleSaveOrSubmit(SaveSubmitData data) async {
    flags.add(data.flag);
    await Future<void>.delayed(
      Duration(milliseconds: (data.formData.length % 7) * 3),
    );
    return await super.handleSaveOrSubmit(data);
  }
}

String _payload(int i, {int size = 10}) => jsonEncode({
  'details': {
    'answers': [
      {'dataKey': 'q', 'answer': 'x' * size},
    ],
  },
  'i': i,
});

void main() {
  late Directory dir;
  late _SlowListener listener;
  late JSHandler<JsonCodable> save;

  final assignment = AssignmentContext(
    assignmentId: 'a1',
    templateId: 't1',
    surveyId: 's1',
    config: AssignmentConfig.capi(),
    data: AssignmentData.empty().copyWith(
      response: jsonDecode(_payload(-1)) as Map<String, dynamic>,
    ),
  );

  Future<JsonCodable> call(String formData, String flag) =>
      save.callback([formData, '{}', '[]', flag]);

  File dataFile() => File('${dir.path}/BPS/assignments/a1/data.json');
  Object? savedI() =>
      (jsonDecode(dataFile().readAsStringSync()) as Map<String, dynamic>)['i'];

  setUp(() {
    dir = Directory.systemTemp.createTempSync('fg_save');
    listener = _SlowListener(dir);
    save =
        AndroidActionHandler(
          formDataListener: listener,
          getCurrentAssignment: () => assignment,
        ).createHandlers().firstWhere(
          (h) => h.handlerName == 'saveOrSubmitFasihForm',
        );
  });

  tearDown(() => dir.deleteSync(recursive: true));

  test('20 overlapping saves leave valid JSON equal to the last one', () async {
    final payloads = [
      for (var i = 0; i < 20; i++) _payload(i, size: i.isEven ? 50000 : 10),
    ];
    await Future.wait([for (final p in payloads) call(p, 'SAVE')]);

    expect(
      jsonDecode(dataFile().readAsStringSync()),
      jsonDecode(payloads.last),
    );
    // Superseded auto-saves are collapsed instead of all hitting disk.
    expect(listener.flags.length, lessThan(20));
    expect(
      dir.listSync(recursive: true).where((f) => f.path.endsWith('.tmp')),
      isEmpty,
    );
  });

  test('submits are never dropped and run in order', () async {
    await Future.wait([
      call(_payload(1), 'SAVE'),
      call(_payload(2), 'SUBMIT'),
      call(_payload(3), 'SAVE'),
      call(_payload(4), 'SUBMIT'),
    ]);
    expect(listener.flags.where((f) => f == 'SUBMIT').length, 2);
    expect(savedI(), 4);
  });

  test('a SAVE that would erase the opened answers is refused', () async {
    await call(_payload(7), 'SAVE');
    final empty = jsonEncode({
      'details': {'answers': <dynamic>[]},
    });

    final refused = await call(empty, 'SAVE') as SubmissionInfoJs;
    final invalid =
        await call('{"details": {"answ', 'SAVE') as SubmissionInfoJs;

    expect(refused.success, isFalse);
    expect(invalid.success, isFalse);
    expect(savedI(), 7);
  });
}
