import 'package:equatable/equatable.dart';
import 'package:flutter/widgets.dart';

/// One decoded barcode or QR code.
class ScannedCode extends Equatable {
  const ScannedCode({required this.text, this.format = ''});

  /// The decoded text.
  final String text;

  /// Symbology name, for example `QRCode` or `Code128`. Empty when unknown.
  final String format;

  @override
  List<Object?> get props => [text, format];
}

/// Thrown by [BarcodeScannerEngine.initialize] when the camera is not allowed.
class ScannerPermissionDenied implements Exception {
  const ScannerPermissionDenied();

  @override
  String toString() => 'Camera permission denied';
}

/// Camera plus decoder behind the barcode screen.
///
/// The default is `ZxingScannerEngine` (zxing-cpp, no ML Kit model). A host
/// that wants another decoder, for example ML Kit through `mobile_scanner`,
/// sets [FormGearScanner.engineBuilder] and implements this class.
abstract class BarcodeScannerEngine {
  /// Decoded codes per frame; an empty list means the frame had none.
  Stream<List<ScannedCode>> get codes;

  /// Whether the active camera has a torch.
  bool get hasTorch;

  /// Opens the camera and starts decoding. Throws [ScannerPermissionDenied].
  Future<void> initialize();

  /// The live camera preview, sized to cover its parent.
  Widget buildPreview(BuildContext context);

  Future<void> toggleTorch();

  Future<void> switchCamera();

  /// Stops decoding but keeps the camera (app in background).
  Future<void> pause();

  Future<void> resume();

  Future<void> dispose();
}

/// Host-level settings for the barcode scanner.
abstract final class FormGearScanner {
  /// Builds the engine for each scan. Set it once at startup to replace the
  /// default zxing engine.
  static BarcodeScannerEngine Function()? engineBuilder;
}
