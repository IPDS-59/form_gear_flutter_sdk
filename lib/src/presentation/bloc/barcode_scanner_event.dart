part of 'barcode_scanner_bloc.dart';

abstract class BarcodeScannerEvent extends Equatable {
  const BarcodeScannerEvent();

  @override
  List<Object?> get props => [];
}

class InitializeScanner extends BarcodeScannerEvent {
  const InitializeScanner();
}

class StartScanning extends BarcodeScannerEvent {
  const StartScanning();
}

class StopScanning extends BarcodeScannerEvent {
  const StopScanning();
}

class ToggleFlash extends BarcodeScannerEvent {
  const ToggleFlash();
}

class SwitchCamera extends BarcodeScannerEvent {
  const SwitchCamera();
}

class BarcodeDetected extends BarcodeScannerEvent {
  const BarcodeDetected(this.barcodes);

  final List<Barcode> barcodes;

  @override
  List<Object?> get props => [barcodes];
}

class ClearDetection extends BarcodeScannerEvent {
  const ClearDetection();
}

class ResumeScanning extends BarcodeScannerEvent {
  const ResumeScanning();
}

class PauseScanning extends BarcodeScannerEvent {
  const PauseScanning();
}

class DisposeScanner extends BarcodeScannerEvent {
  const DisposeScanner();
}

class CheckFlashSupport extends BarcodeScannerEvent {
  const CheckFlashSupport();
}
