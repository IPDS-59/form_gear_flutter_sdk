import 'dart:async';

import 'package:equatable/equatable.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:form_gear_engine_sdk/src/presentation/scanner/barcode_scanner_engine.dart';
import 'package:form_gear_engine_sdk/src/presentation/scanner/zxing_scanner_engine.dart';

part 'barcode_scanner_event.dart';
part 'barcode_scanner_state.dart';

class BarcodeScannerBloc
    extends Bloc<BarcodeScannerEvent, BarcodeScannerState> {
  BarcodeScannerBloc() : super(const BarcodeScannerState()) {
    on<InitializeScanner>(_onInitializeScanner);
    on<StartScanning>(_onStartScanning);
    on<StopScanning>(_onStopScanning);
    on<ToggleFlash>(_onToggleFlash);
    on<SwitchCamera>(_onSwitchCamera);
    on<BarcodeDetected>(_onBarcodeDetected);
    on<ClearDetection>(_onClearDetection);
    on<ResumeScanning>(_onResumeScanning);
    on<PauseScanning>(_onPauseScanning);
    on<DisposeScanner>(_onDisposeScanner);
    on<CheckFlashSupport>(_onCheckFlashSupport);
  }

  BarcodeScannerEngine? _engine;
  StreamSubscription<List<ScannedCode>>? _codesSub;

  BarcodeScannerEngine? get engine => _engine;

  Future<void> _onInitializeScanner(
    InitializeScanner event,
    Emitter<BarcodeScannerState> emit,
  ) async {
    try {
      emit(state.copyWith(status: BarcodeScannerStatus.initializing));
      await _release();

      final engine =
          (FormGearScanner.engineBuilder ?? ZxingScannerEngine.new)();
      _engine = engine;
      await engine.initialize();
      _codesSub = engine.codes.listen(
        (codes) => add(
          codes.isEmpty ? const ClearDetection() : BarcodeDetected(codes),
        ),
      );

      emit(
        state.copyWith(
          status: BarcodeScannerStatus.ready,
          isFlashOn: false,
          hasFlash: engine.hasTorch,
        ),
      );
    } on ScannerPermissionDenied {
      emit(
        state.copyWith(
          status: BarcodeScannerStatus.error,
          errorMessage:
              'Camera permission denied. '
              'Please enable camera access in settings.',
        ),
      );
    } on Exception catch (e) {
      emit(
        state.copyWith(
          status: BarcodeScannerStatus.error,
          errorMessage: 'Failed to initialize scanner: $e',
        ),
      );
    }
  }

  Future<void> _onCheckFlashSupport(
    CheckFlashSupport event,
    Emitter<BarcodeScannerState> emit,
  ) async {
    emit(state.copyWith(hasFlash: _engine?.hasTorch ?? false));
  }

  Future<void> _onStartScanning(
    StartScanning event,
    Emitter<BarcodeScannerState> emit,
  ) async {
    if (_engine == null) return;
    emit(state.copyWith(status: BarcodeScannerStatus.scanning));
  }

  Future<void> _onStopScanning(
    StopScanning event,
    Emitter<BarcodeScannerState> emit,
  ) async {
    emit(
      state.copyWith(
        status: BarcodeScannerStatus.stopped,
        detectedBarcodes: [],
        hasDetection: false,
      ),
    );
  }

  Future<void> _onToggleFlash(
    ToggleFlash event,
    Emitter<BarcodeScannerState> emit,
  ) async {
    try {
      await _engine?.toggleTorch();
      emit(state.copyWith(isFlashOn: !state.isFlashOn));
    } on Exception catch (e) {
      emit(
        state.copyWith(
          status: BarcodeScannerStatus.error,
          errorMessage: 'Failed to toggle flash: $e',
        ),
      );
    }
  }

  Future<void> _onSwitchCamera(
    SwitchCamera event,
    Emitter<BarcodeScannerState> emit,
  ) async {
    try {
      await _engine?.switchCamera();
      emit(state.copyWith(isFlashOn: false, hasFlash: _engine?.hasTorch));
    } on Exception catch (e) {
      emit(
        state.copyWith(
          status: BarcodeScannerStatus.error,
          errorMessage: 'Failed to switch camera: $e',
        ),
      );
    }
  }

  Future<void> _onBarcodeDetected(
    BarcodeDetected event,
    Emitter<BarcodeScannerState> emit,
  ) async {
    final detectedBarcodes = event.barcodes
        .map((b) => DetectedBarcode(bounds: null, data: b.text, type: b.format))
        .toList();

    emit(
      state.copyWith(
        detectedBarcodes: detectedBarcodes,
        hasDetection: true,
        status: BarcodeScannerStatus.detected,
      ),
    );

    // Auto-select first valid barcode after delay
    if (state.status == BarcodeScannerStatus.detected) {
      await Future<void>.delayed(const Duration(milliseconds: 2000));

      final firstValidBarcode = event.barcodes.firstWhere(
        (b) => b.text.isNotEmpty,
        orElse: () => event.barcodes.first,
      );

      final scannedData = firstValidBarcode.text;
      if (scannedData.isNotEmpty) {
        emit(
          state.copyWith(
            status: BarcodeScannerStatus.completed,
            selectedBarcode: scannedData,
          ),
        );
      }
    }
  }

  Future<void> _onClearDetection(
    ClearDetection event,
    Emitter<BarcodeScannerState> emit,
  ) async {
    emit(
      state.copyWith(
        detectedBarcodes: [],
        hasDetection: false,
        status: BarcodeScannerStatus.scanning,
      ),
    );
  }

  Future<void> _onResumeScanning(
    ResumeScanning event,
    Emitter<BarcodeScannerState> emit,
  ) async {
    // Handle different scenarios for resuming
    if (state.status == BarcodeScannerStatus.paused) {
      await _engine?.resume();
      add(const StartScanning());
    } else if (state.status == BarcodeScannerStatus.error) {
      // Re-initialize scanner if there was an error
      // (e.g., permission denied then approved)
      add(const InitializeScanner());
    }
  }

  Future<void> _onPauseScanning(
    PauseScanning event,
    Emitter<BarcodeScannerState> emit,
  ) async {
    await _engine?.pause();

    emit(state.copyWith(status: BarcodeScannerStatus.paused));
  }

  Future<void> _onDisposeScanner(
    DisposeScanner event,
    Emitter<BarcodeScannerState> emit,
  ) async {
    await _release();

    emit(state.copyWith(status: BarcodeScannerStatus.disposed));
  }

  Future<void> _release() async {
    await _codesSub?.cancel();
    _codesSub = null;
    await _engine?.dispose();
    _engine = null;
  }

  @override
  Future<void> close() async {
    await _release();
    return await super.close();
  }
}
