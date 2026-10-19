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
  FakeCapabilities({this.photo, this.picked, this.error, this.kinds});

  final CapturedMedia? photo;
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
