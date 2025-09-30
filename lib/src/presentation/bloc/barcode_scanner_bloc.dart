import 'dart:async';

import 'package:equatable/equatable.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_scanner/mobile_scanner.dart';

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
  }

  MobileScannerController? _controller;
  StreamSubscription<BarcodeCapture>? _subscription;

  MobileScannerController? get controller => _controller;

  Future<void> _onInitializeScanner(
    InitializeScanner event,
    Emitter<BarcodeScannerState> emit,
  ) async {
    try {
      emit(state.copyWith(status: BarcodeScannerStatus.initializing));

      _controller = MobileScannerController();

      // Check flash support
      await _checkFlashSupport();

      emit(
        state.copyWith(
          status: BarcodeScannerStatus.ready,
          hasFlash: _hasFlash,
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

  bool _hasFlash = false;

  Future<void> _checkFlashSupport() async {
    try {
      await _controller?.toggleTorch();
      await _controller?.toggleTorch(); // Turn it back off
      _hasFlash = true;
    } on Exception {
      _hasFlash = false;
    }
  }

  Future<void> _onStartScanning(
    StartScanning event,
    Emitter<BarcodeScannerState> emit,
  ) async {
    if (_controller == null) return;

    emit(state.copyWith(status: BarcodeScannerStatus.scanning));

    _subscription = _controller!.barcodes.listen((BarcodeCapture capture) {
      if (capture.barcodes.isNotEmpty) {
        add(BarcodeDetected(capture.barcodes));
      } else {
        add(const ClearDetection());
      }
    });
  }

  Future<void> _onStopScanning(
    StopScanning event,
    Emitter<BarcodeScannerState> emit,
  ) async {
    await _subscription?.cancel();
    _subscription = null;

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
      await _controller?.toggleTorch();
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
      await _controller?.switchCamera();
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
        .map(
          (b) => DetectedBarcode(
            bounds: b.corners,
            data: b.rawValue ?? '',
            type: b.type,
          ),
        )
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
        (b) => (b.rawValue ?? '').isNotEmpty,
        orElse: () => event.barcodes.first,
      );

      final scannedData = firstValidBarcode.rawValue ?? '';
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
    if (state.status == BarcodeScannerStatus.paused) {
      await _controller?.start();
      add(const StartScanning());
    }
  }

  Future<void> _onPauseScanning(
    PauseScanning event,
    Emitter<BarcodeScannerState> emit,
  ) async {
    await _controller?.stop();
    await _subscription?.cancel();
    _subscription = null;

    emit(state.copyWith(status: BarcodeScannerStatus.paused));
  }

  Future<void> _onDisposeScanner(
    DisposeScanner event,
    Emitter<BarcodeScannerState> emit,
  ) async {
    await _subscription?.cancel();
    await _controller?.dispose();
    _controller = null;
    _subscription = null;

    emit(state.copyWith(status: BarcodeScannerStatus.disposed));
  }

  @override
  Future<void> close() async {
    await _subscription?.cancel();
    await _controller?.dispose();
    return super.close();
  }
}
