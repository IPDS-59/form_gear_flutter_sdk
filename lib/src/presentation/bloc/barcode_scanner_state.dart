part of 'barcode_scanner_bloc.dart';

enum BarcodeScannerStatus {
  initial,
  initializing,
  ready,
  scanning,
  detected,
  completed,
  paused,
  stopped,
  error,
  disposed,
}

class BarcodeScannerState extends Equatable {
  const BarcodeScannerState({
    this.status = BarcodeScannerStatus.initial,
    this.detectedBarcodes = const [],
    this.hasDetection = false,
    this.hasFlash = false,
    this.isFlashOn = false,
    this.errorMessage,
    this.selectedBarcode,
  });

  final BarcodeScannerStatus status;
  final List<DetectedBarcode> detectedBarcodes;
  final bool hasDetection;
  final bool hasFlash;
  final bool isFlashOn;
  final String? errorMessage;
  final String? selectedBarcode;

  BarcodeScannerState copyWith({
    BarcodeScannerStatus? status,
    List<DetectedBarcode>? detectedBarcodes,
    bool? hasDetection,
    bool? hasFlash,
    bool? isFlashOn,
    String? errorMessage,
    String? selectedBarcode,
  }) {
    return BarcodeScannerState(
      status: status ?? this.status,
      detectedBarcodes: detectedBarcodes ?? this.detectedBarcodes,
      hasDetection: hasDetection ?? this.hasDetection,
      hasFlash: hasFlash ?? this.hasFlash,
      isFlashOn: isFlashOn ?? this.isFlashOn,
      errorMessage: errorMessage ?? this.errorMessage,
      selectedBarcode: selectedBarcode ?? this.selectedBarcode,
    );
  }

  @override
  List<Object?> get props => [
    status,
    detectedBarcodes,
    hasDetection,
    hasFlash,
    isFlashOn,
    errorMessage,
    selectedBarcode,
  ];
}

/// Data class for detected barcode information
class DetectedBarcode extends Equatable {
  const DetectedBarcode({
    required this.bounds,
    required this.data,
    required this.type,
  });

  final List<Offset>? bounds;
  final String data;
  final BarcodeType type;

  @override
  List<Object?> get props => [bounds, data, type];
}
