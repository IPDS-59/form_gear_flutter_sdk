import 'dart:io';

import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:form_gear_engine_sdk/form_gear_engine_sdk.dart';
import 'package:form_gear_engine_sdk/src/core/capabilities/capability_broker.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/handlers/client_action_handler.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/handlers/execute_handler.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/handlers/media_action_handler.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/handlers/file_action_handler.dart';
import 'package:form_gear_engine_sdk/src/core/services/navigator_context_provider.dart';
import 'package:path_provider_platform_interface/path_provider_platform_interface.dart';

import '../../../helpers/test_path_provider_platform.dart';

/// A scripted host: one outcome per call.
class FakeCapabilities extends FormGearCapabilities {
  FakeCapabilities({
    this.photo,
    this.picked,
    this.error,
    this.kinds,
    this.audio,
    this.video,
  });

  final CapturedMedia? photo;
  final CapturedMedia? audio;
  final CapturedMedia? video;
  final PickedFile? picked;
  final Object? error;
  final Set<CapabilityKind>? kinds;
  final calls = <String>[];
  CapabilityRequest? lastRequest;

  @override
  CapabilitySupport support(CapabilityKind kind) =>
      (kinds ?? CapabilityKind.values.toSet()).contains(kind)
      ? const CapabilitySupport.supported()
      : const CapabilitySupport.unsupported();

  @override
  Future<CapturedMedia?> capturePhoto(CapturePhotoRequest request) async {
    calls.add('photo:${request.dataKey}:${request.assignmentId}');
    lastRequest = request;
    if (error != null) throw error!;
    return photo;
  }

  @override
  Future<CapturedMedia?> recordAudio(RecordAudioRequest request) async {
    calls.add('audio:${request.dataKey}:${request.assignmentId}');
    lastRequest = request;
    if (error != null) Error.throwWithStackTrace(error!, StackTrace.current);
    return audio;
  }

  @override
  Future<CapturedMedia?> recordVideo(RecordVideoRequest request) async {
    calls.add('video:${request.dataKey}:${request.assignmentId}');
    lastRequest = request;
    if (error != null) Error.throwWithStackTrace(error!, StackTrace.current);
    return video;
  }

  @override
  Future<PickedFile?> pickFile(PickRequest request) async {
    calls.add(
      'pick:${request.dataKey}:${request.imagesOnly}:'
      '${request.allowedExtensions.join(',')}',
    );
    lastRequest = request;
    if (error != null) throw error!;
    return picked;
  }
}

void main() {
  late Directory tmp;
  late File jpg;

  setUp(() {
    tmp = Directory.systemTemp.createTempSync('caps_test');
    PathProviderPlatform.instance = TestPathProviderPlatform(
      applicationDocumentsPath: tmp.path,
      temporaryPath: tmp.path,
      applicationSupportPath: tmp.path,
    );
    jpg = File('${tmp.path}/host.jpg')..writeAsBytesSync([1, 2, 3]);
  });

  tearDown(() {
    FormGearSDK.instance.capabilities = null;
    NavigatorContextProvider.instance.unregister();
    tmp.deleteSync(recursive: true);
  });

  Future<void> withContext(WidgetTester t) async {
    await t.pumpWidget(
      Builder(
        builder: (c) {
          NavigatorContextProvider.instance.register(() => c);
          return const SizedBox();
        },
      ),
    );
  }

  group('the defaults', () {
    test('every kind is unsupported and a call says so', () async {
      const caps = _Defaults();
      for (final k in CapabilityKind.values) {
        expect(caps.support(k).supported, isFalse);
      }
      expect(
        () => caps.capturePhoto(
          CapturePhotoRequest(
            context: _FakeContext(),
            dataKey: 'k',
            assignmentId: 'a',
            cancel: CapabilityCancelToken(),
            tempDir: tmp,
          ),
        ),
        throwsA(isA<CapabilityException>()),
      );
    });

    test('no host means the broker provides nothing', () {
      expect(CapabilityBroker(null).provides(CapabilityKind.photo), isFalse);
    });
  });

  group('photo through the action route (CAMERA)', () {
    testWidgets('stores the host file and answers with the name', (t) async {
      await withContext(t);
      final fake = FakeCapabilities(photo: CapturedMedia(file: jpg));
      FormGearSDK.instance.capabilities = fake;

      final r = (await t.runAsync(
        () => MediaActionHandler().handleCamera('foto', 'A1'),
      ))!;

      expect(r.success, isTrue);
      expect(r.result, endsWith('.jpg'));
      expect(fake.calls, ['photo:foto:A1']);
      final media = Directory(tmp.path)
          .listSync(recursive: true)
          .whereType<File>()
          .where((f) => f.path.endsWith(r.result!));
      expect(media, isNotEmpty);
    });

    testWidgets('cancel is a null result, not an error path', (t) async {
      await withContext(t);
      FormGearSDK.instance.capabilities = FakeCapabilities();
      final r = (await t.runAsync(
        () => MediaActionHandler().handleCamera('foto', 'A1'),
      ))!;
      expect(r.success, isFalse);
      expect(r.error, 'Camera cancelled by user');
    });

    testWidgets('a denied permission shows the host sentence', (t) async {
      await withContext(t);
      FormGearSDK.instance.capabilities = FakeCapabilities(
        error: const CapabilityException.denied('Izinkan kamera dulu'),
      );
      final r = (await t.runAsync(
        () => MediaActionHandler().handleCamera('foto', 'A1'),
      ))!;
      expect(r.success, isFalse);
      expect(r.error, 'Izinkan kamera dulu');
    });

    testWidgets('an unexpected failure is sanitized', (t) async {
      await withContext(t);
      FormGearSDK.instance.capabilities = FakeCapabilities(
        error: Exception('boom at /data/user/0/secret/path'),
      );
      final r = (await t.runAsync(
        () => MediaActionHandler().handleCamera('foto', 'A1'),
      ))!;
      expect(r.success, isFalse);
      expect(r.error, isNot(contains('/data/user/0')));
    });

    testWidgets('no open form is a friendly error', (t) async {
      FormGearSDK.instance.capabilities = FakeCapabilities(
        photo: CapturedMedia(file: jpg),
      );
      final r = (await t.runAsync(
        () => MediaActionHandler().handleCamera('foto', 'A1'),
      ))!;
      expect(r.success, isFalse);
      expect(r.error, 'Formulir tidak sedang terbuka');
    });
  });

  group('audio through the action route (AUDIO)', () {
    late File m4a;
    setUp(() => m4a = File('${tmp.path}/host.m4a')..writeAsBytesSync([9, 9]));

    testWidgets('stores the host recording and answers with the name', (
      t,
    ) async {
      await withContext(t);
      final fake = FakeCapabilities(
        audio: CapturedMedia(
          file: m4a,
          mime: 'audio/mp4',
          duration: const Duration(seconds: 3),
        ),
      );
      FormGearSDK.instance.capabilities = fake;

      final r = (await t.runAsync(
        () => MediaActionHandler().handleAudio('rekam', 'A1'),
      ))!;

      expect(r.success, isTrue);
      expect(r.result, endsWith('.m4a'));
      expect(fake.calls, ['audio:rekam:A1']);
      final stored = Directory(tmp.path)
          .listSync(recursive: true)
          .whereType<File>()
          .where((f) => f.path.endsWith(r.result!));
      expect(stored, isNotEmpty);
    });

    testWidgets('a cancelled recording is not an error path', (t) async {
      await withContext(t);
      FormGearSDK.instance.capabilities = FakeCapabilities();
      final r = (await t.runAsync(
        () => MediaActionHandler().handleAudio('rekam', 'A1'),
      ))!;
      expect(r.success, isFalse);
      expect(r.error, 'Audio recording cancelled by user');
    });

    testWidgets('a denied microphone shows the host sentence', (t) async {
      await withContext(t);
      FormGearSDK.instance.capabilities = FakeCapabilities(
        error: const CapabilityException.denied('Izinkan mikrofon dulu'),
      );
      final r = (await t.runAsync(
        () => MediaActionHandler().handleAudio('rekam', 'A1'),
      ))!;
      expect(r.success, isFalse);
      expect(r.error, 'Izinkan mikrofon dulu');
    });

    testWidgets('an unexpected failure is sanitized', (t) async {
      await withContext(t);
      FormGearSDK.instance.capabilities = FakeCapabilities(
        error: Exception('boom at /data/user/0/secret/path'),
      );
      final r = (await t.runAsync(
        () => MediaActionHandler().handleAudio('rekam', 'A1'),
      ))!;
      expect(r.success, isFalse);
      expect(r.error, isNot(contains('/data/user/0')));
    });

    testWidgets('no open form is a friendly error', (t) async {
      FormGearSDK.instance.capabilities = FakeCapabilities(
        audio: CapturedMedia(file: m4a, mime: 'audio/mp4'),
      );
      final r = (await t.runAsync(
        () => MediaActionHandler().handleAudio('rekam', 'A1'),
      ))!;
      expect(r.success, isFalse);
      expect(r.error, 'Formulir tidak sedang terbuka');
    });
  });

  group('video', () {
    testWidgets('a host that records video stores its clip', (t) async {
      await withContext(t);
      final mp4 = File('${tmp.path}/host.mp4')..writeAsBytesSync([7]);
      final fake = FakeCapabilities(
        video: CapturedMedia(file: mp4, mime: 'video/mp4'),
      );
      FormGearSDK.instance.capabilities = fake;
      final r = (await t.runAsync(
        () => MediaActionHandler().handleVideo('film', 'A1'),
      ))!;
      expect(r.success, isTrue);
      expect(r.result, endsWith('.mp4'));
      expect(fake.calls, ['video:film:A1']);
    });

    testWidgets('a cancelled host recording is not an error path', (t) async {
      await withContext(t);
      FormGearSDK.instance.capabilities = FakeCapabilities();
      final r = (await t.runAsync(
        () => MediaActionHandler().handleVideo('film', 'A1'),
      ))!;
      expect(r.error, 'Video recording cancelled by user');
    });

    testWidgets('a host without video keeps the built-in recorder', (t) async {
      // No navigator context is registered, so the built-in path answers with
      // its own "no context" error instead of the broker's.
      FormGearSDK.instance.capabilities = FakeCapabilities(
        kinds: {CapabilityKind.photo},
      );
      final r = (await t.runAsync(
        () => MediaActionHandler().handleVideo('film', 'A1'),
      ))!;
      expect(r.success, isFalse);
      expect(r.error, 'No valid context available for video recorder');
    });

    test('the default host does not provide video', () {
      expect(
        const _Defaults().support(CapabilityKind.video).supported,
        isFalse,
      );
    });
  });

  group('photo through the execute route', () {
    testWidgets('returns the host file path', (t) async {
      await withContext(t);
      FormGearSDK.instance.capabilities = FakeCapabilities(
        photo: CapturedMedia(file: jpg),
      );
      final r = (await t.runAsync(
        () => ExecuteHandler().callback(['CAMERA', 'foto', '']),
      ))!;
      expect(r.success, isTrue);
      expect(r.result, jpg.path);
    });
  });

  group('photo through the client route (cameraHandler)', () {
    testWidgets('hands the host file to onCameraCapture', (t) async {
      await withContext(t);
      FormGearSDK.instance.capabilities = FakeCapabilities(
        photo: CapturedMedia(file: jpg),
      );
      String? got;
      final handler = ClientActionHandler(
        onCameraCapture: (name, path) async {
          got = path;
          return 'stored/$name';
        },
      ).createHandlers().firstWhere((h) => h.handlerName == 'cameraHandler');
      final r =
          (await t.runAsync(() => handler.callback(['x', 'foto.jpg'])))!
              as ActionInfoJs;
      expect(got, jpg.path);
      expect(r.result, 'stored/foto.jpg');
    });
  });

  group('file pick', () {
    testWidgets('FILE_PICKER stores the host file', (t) async {
      await withContext(t);
      final doc = File('${tmp.path}/a.pdf')..writeAsBytesSync([9]);
      final fake = FakeCapabilities(
        picked: PickedFile(file: doc, name: 'a.pdf'),
      );
      FormGearSDK.instance.capabilities = fake;
      final r = (await t.runAsync(
        () => FileActionHandler().handleFilePicker('berkas', 'A1'),
      ))!;
      expect(r.success, isTrue);
      expect(r.result, endsWith('.pdf'));
      expect(fake.calls, ['pick:berkas:false:']);
    });

    testWidgets('execute FILE with an image accept asks for images only', (
      t,
    ) async {
      await withContext(t);
      final fake = FakeCapabilities(
        picked: PickedFile(file: jpg, name: 'host.jpg'),
      );
      FormGearSDK.instance.capabilities = fake;
      final r = (await t.runAsync(
        () => ExecuteHandler().callback([
          'FILE',
          'gambar',
          '{"accept":"image/*"}',
        ]),
      ))!;
      expect(r.success, isTrue);
      expect(fake.calls, ['pick:gambar:true:']);
    });

    testWidgets('execute FILE with csv passes the extension', (t) async {
      await withContext(t);
      final csv = File('${tmp.path}/d.csv')..writeAsStringSync('a,b');
      final fake = FakeCapabilities(
        picked: PickedFile(file: csv, name: 'd.csv'),
      );
      FormGearSDK.instance.capabilities = fake;
      await t.runAsync(
        () => ExecuteHandler().callback([
          'FILE_PICKER',
          'tabel',
          '{"accept":"text/csv"}',
        ]),
      );
      expect(fake.calls, ['pick:tabel:false:csv']);
    });

    testWidgets('cancel and a host failure both reach the page', (t) async {
      await withContext(t);
      FormGearSDK.instance.capabilities = FakeCapabilities();
      var r = (await t.runAsync(
        () => FileActionHandler().handleFilePicker('berkas', ''),
      ))!;
      expect(r.error, 'File picker cancelled by user');

      FormGearSDK.instance.capabilities = FakeCapabilities(
        error: const CapabilityException.permanentlyDenied('Buka pengaturan'),
      );
      r = (await t.runAsync(
        () => FileActionHandler().handleFilePicker('berkas', ''),
      ))!;
      expect(r.error, 'Buka pengaturan');
    });
  });

  group('scan', () {
    testWidgets('the deprecated UiHandler hook forwards to the capability', (
      t,
    ) async {
      late BuildContext ctx;
      await t.pumpWidget(
        Builder(
          builder: (c) {
            ctx = c;
            return const SizedBox();
          },
        ),
      );
      FormGearSDK.instance.capabilities = _ScanCaps();
      // ignore: deprecated_member_use_from_same_package
      final r = await const _PlainUi().scanBarcode(
        ctx,
        const BarcodeScanRequest(dataKey: 'k', title: 't'),
      );
      expect(r?.text, 'ABC');
    });

    testWidgets('no scan capability keeps the old answer: null', (t) async {
      late BuildContext ctx;
      await t.pumpWidget(
        Builder(
          builder: (c) {
            ctx = c;
            return const SizedBox();
          },
        ),
      );
      // ignore: deprecated_member_use_from_same_package
      final r = await const _PlainUi().scanBarcode(
        ctx,
        const BarcodeScanRequest(dataKey: 'k', title: 't'),
      );
      expect(r, isNull);
    });
  });

  testWidgets('the form closing fires the request cancel token', (t) async {
    await withContext(t);
    final fake = FakeCapabilities();
    FormGearSDK.instance.capabilities = fake;
    await t.runAsync(() => MediaActionHandler().handleCamera('foto', 'A1'));
    final token = fake.lastRequest!.cancel;
    expect(token.isCancelled, isFalse);
    CapabilityBroker.cancelOpenCalls();
    expect(token.isCancelled, isTrue);
  });
}

class _Defaults extends FormGearCapabilities {
  const _Defaults();
}

class _PlainUi extends FormGearUiHandler {
  const _PlainUi();
}

class _ScanCaps extends FormGearCapabilities {
  @override
  CapabilitySupport support(CapabilityKind kind) => kind == CapabilityKind.scan
      ? const CapabilitySupport.supported()
      : const CapabilitySupport.unsupported();

  @override
  Future<BarcodeScanResult?> scan(
    BuildContext context,
    BarcodeScanRequest request,
  ) async => const BarcodeScanResult(text: 'ABC', format: 'QRCode');
}

class _FakeContext extends Fake implements BuildContext {}
