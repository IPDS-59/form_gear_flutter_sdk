import 'dart:async';

import 'package:equatable/equatable.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:form_gear_engine_sdk/src/utils/form_gear_logger.dart';
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
    on<CheckFlashSupport>(_onCheckFlashSupport);
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

      // Dispose old controller if exists
      await _controller?.dispose();
      _controller = null;
      await _subscription?.cancel();
      _subscription = null;

      // Create new controller with torch off (default)
      // Let MobileScanner widget handle the start/stop lifecycle
      _controller = MobileScannerController();

      // Emit ready state with flash explicitly off
      emit(
        state.copyWith(
          status: BarcodeScannerStatus.ready,
          isFlashOn: false, // Reset flash state
          hasFlash: false, // Will be updated after flash check
        ),
      );

      // Check flash support after a short delay (widget will start controller)
      Future<void>.delayed(const Duration(milliseconds: 800), () {
        if (!isClosed) {
          add(const CheckFlashSupport());
        }
      });
    } on MobileScannerException catch (e) {
      // Handle permission denial specifically
      if (e.errorCode == MobileScannerErrorCode.permissionDenied) {
        emit(
          state.copyWith(
            status: BarcodeScannerStatus.error,
            errorMessage: 'Camera permission denied. '
                'Please enable camera access in settings.',
          ),
        );
      } else {
        emit(
          state.copyWith(
            status: BarcodeScannerStatus.error,
            errorMessage: 'Failed to initialize scanner: '
                '${e.errorDetails?.message ?? e.toString()}',
          ),
        );
      }
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
    try {
      // Check if torch is available without turning it on
      final torchState = _controller?.value.torchState;

      // Torch is available if state is not unavailable
      final hasFlash =
          torchState != null && torchState != TorchState.unavailable;

      FormGearLogger.webview('Flash support: $hasFlash (state: $torchState)');

      // Update state with flash support
      emit(state.copyWith(hasFlash: hasFlash));
    } on Exception catch (e) {
      // Flash not supported or error occurred
      FormGearLogger.webview('Flash check failed: $e');
      emit(state.copyWith(hasFlash: false));
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
    // Handle different scenarios for resuming
    if (state.status == BarcodeScannerStatus.paused) {
      await _controller?.start();
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
