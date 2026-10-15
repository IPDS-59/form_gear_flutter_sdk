import 'dart:convert';
import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:form_gear_engine_sdk/form_gear_engine_sdk.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/handlers/execute_handler.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/js_executor_service.dart';
import 'package:mocktail/mocktail.dart';
import 'package:webview_flutter/webview_flutter.dart';

class _Controller extends Mock implements WebViewController {}

class _Listener extends Mock implements FileUploadListener {}

void main() {
  setUpAll(() {
    registerFallbackValue(
      FileUploadData(
        assignmentId: '',
        templateId: '',
        dataKey: '',
        file: File(''),
        fileName: '',
        fileUri: '',
      ),
    );
    registerFallbackValue(FileUploadResult.failure(error: ''));
  });

  late List<String> executed;
  late _Listener listener;
  late Directory dir;
  late String data;

  setUp(() {
    executed = [];
    final controller = _Controller();
    when(() => controller.runJavaScript(any())).thenAnswer((inv) async {
      executed.add(inv.positionalArguments.single as String);
    });
    JSExecutorService().registerController(controller, '2');

    dir = Directory.systemTemp.createTempSync('fg_upload');
    final file = File('${dir.path}/BPS/media/a1/photo.jpg')
      ..createSync(recursive: true)
      ..writeAsStringSync('x');
    data = jsonEncode({'filename': 'photo.jpg', 'uri': 'file://${file.path}'});

    listener = _Listener();
    when(
      () => listener.onUploadCompleted(any(), any()),
    ).thenAnswer((_) async {});
    FormGearSDK.instance.setFileUploadListener(listener);
  });

  tearDown(() {
    FormGearSDK.instance.removeFileUploadListener();
    JSExecutorService().unregisterController();
    dir.deleteSync(recursive: true);
  });

  Future<ActionInfoJs> upload() =>
      ExecuteHandler().callback(['FILE_UPLOAD', 'foto', data]);

  test(
    'FILE_UPLOAD uploads via listener, then emits upload-finished',
    () async {
      when(() => listener.onFileUpload(any())).thenAnswer(
        (_) async => FileUploadResult.success(uploadedUrl: 'https://s3/photo'),
      );

      final result = await upload();

      expect(result.success, isTrue);
      verify(() => listener.onFileUpload(any())).called(1);
      expect(executed.single, contains('"upload-finished", "foto"'));
      expect(executed.single, contains(r'\"url\":\"https://s3/photo\"'));
    },
  );

  test('FILE_UPLOAD failure returns the error, no upload-finished', () async {
    when(
      () => listener.onFileUpload(any()),
    ).thenAnswer((_) async => FileUploadResult.failure(error: 'S3 down'));

    final result = await upload();

    expect(result.success, isFalse);
    expect(result.error, 'S3 down');
    expect(executed, isEmpty);
  });

  test('finalizeForm emits trigger-finalize for FasihForm only', () async {
    expect(await FormGearSDK.instance.finalizeForm(), isTrue);
    expect(
      executed.single,
      contains('window.fasihForm.event.emit("trigger-finalize")'),
    );

    JSExecutorService().registerController(_Controller(), '1');
    expect(await FormGearSDK.instance.finalizeForm(), isFalse);
  });
}
