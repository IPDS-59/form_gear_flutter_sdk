import 'dart:async';

import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:form_gear_engine_sdk/form_gear_engine_sdk.dart';
import 'package:form_gear_engine_sdk/src/presentation/bloc/barcode_scanner_bloc.dart';

class _FakeEngine implements BarcodeScannerEngine {
  _FakeEngine({this.denied = false});

  final bool denied;
  final StreamController<List<ScannedCode>> controller =
      StreamController<List<ScannedCode>>.broadcast();
  bool disposed = false;
  int torchToggles = 0;

  @override
  Stream<List<ScannedCode>> get codes => controller.stream;

  @override
  bool get hasTorch => true;

  @override
  Future<void> initialize() async {
    if (denied) throw const ScannerPermissionDenied();
  }

  @override
  Widget buildPreview(BuildContext context) => const SizedBox.expand();

  @override
  Future<void> toggleTorch() async => torchToggles++;

  @override
  Future<void> switchCamera() async {}

  @override
  Future<void> pause() async {}

  @override
  Future<void> resume() async {}

  @override
  Future<void> dispose() async => disposed = true;
}

void main() {
  tearDown(() => FormGearScanner.engineBuilder = null);

  test('a frame with a code ends the scan with its text', () async {
    final engine = _FakeEngine();
    FormGearScanner.engineBuilder = () => engine;
    final bloc = BarcodeScannerBloc()..add(const InitializeScanner());
    await bloc.stream.firstWhere((s) => s.status == BarcodeScannerStatus.ready);
    expect(bloc.state.hasFlash, isTrue);

    engine.controller.add([
      const ScannedCode(text: 'ABC-123', format: 'QRCode'),
    ]);
    final done = await bloc.stream.firstWhere(
      (s) => s.status == BarcodeScannerStatus.completed,
    );
    expect(done.selectedBarcode, 'ABC-123');
    await bloc.close();
    expect(engine.disposed, isTrue);
  });

  test('an empty frame clears the detection', () async {
    final engine = _FakeEngine();
    FormGearScanner.engineBuilder = () => engine;
    final bloc = BarcodeScannerBloc()..add(const InitializeScanner());
    await bloc.stream.firstWhere((s) => s.status == BarcodeScannerStatus.ready);

    engine.controller.add([const ScannedCode(text: 'X')]);
    await bloc.stream.firstWhere((s) => s.hasDetection);
    engine.controller.add(const []);
    final cleared = await bloc.stream.firstWhere((s) => !s.hasDetection);
    expect(cleared.status, BarcodeScannerStatus.scanning);
    await bloc.close();
  });

  test('a denied camera is an error the screen can retry', () async {
    FormGearScanner.engineBuilder = () => _FakeEngine(denied: true);
    final bloc = BarcodeScannerBloc()..add(const InitializeScanner());
    final s = await bloc.stream.firstWhere(
      (s) => s.status == BarcodeScannerStatus.error,
    );
    expect(s.errorMessage, contains('permission'));
    await bloc.close();
  });

  test('the torch goes through the engine', () async {
    final engine = _FakeEngine();
    FormGearScanner.engineBuilder = () => engine;
    final bloc = BarcodeScannerBloc()..add(const InitializeScanner());
    await bloc.stream.firstWhere((s) => s.status == BarcodeScannerStatus.ready);
    bloc.add(const ToggleFlash());
    await bloc.stream.firstWhere((s) => s.isFlashOn);
    expect(engine.torchToggles, 1);
    await bloc.close();
  });
}
