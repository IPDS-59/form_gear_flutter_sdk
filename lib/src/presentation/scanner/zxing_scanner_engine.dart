import 'dart:async';
import 'dart:io';

import 'package:camera/camera.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_zxing/flutter_zxing.dart' hide ImageFormat;
import 'package:form_gear_engine_sdk/src/presentation/scanner/barcode_scanner_engine.dart';

/// zxing-cpp decoder on the `camera` image stream.
///
/// Frames are decoded in an isolate by flutter_zxing and dropped while one is
/// still being decoded, so a slow phone never queues work. There is no ML Kit
/// model, which saves about 5 MB per ABI in the installed app.
class ZxingScannerEngine implements BarcodeScannerEngine {
  CameraController? _camera;
  List<CameraDescription> _cameras = const [];
  int _cameraIndex = 0;
  bool _busy = false;
  bool _paused = false;
  bool _hadCode = false;
  final _codes = StreamController<List<ScannedCode>>.broadcast();

  // The luminance plane is enough for every 1D and 2D symbology, and tryRotate
  // covers the sensor being turned against the screen.
  final _params = DecodeParams();

  @override
  Stream<List<ScannedCode>> get codes => _codes.stream;

  @override
  bool get hasTorch =>
      _camera != null &&
      _cameras[_cameraIndex].lensDirection == CameraLensDirection.back;

  @override
  Future<void> initialize() async {
    try {
      _cameras = await availableCameras();
      if (_cameras.isEmpty) throw StateError('No camera on this device');
      _cameraIndex = _cameras
          .indexWhere((c) => c.lensDirection == CameraLensDirection.back)
          .clamp(0, _cameras.length - 1);
      await _open();
    } on CameraException catch (e) {
      if (e.code.startsWith('CameraAccess')) {
        throw const ScannerPermissionDenied();
      }
      rethrow;
    }
  }

  Future<void> _open() async {
    final old = _camera;
    _camera = null;
    await old?.dispose();
    final controller = CameraController(
      _cameras[_cameraIndex],
      ResolutionPreset.high,
      enableAudio: false,
      imageFormatGroup: Platform.isAndroid
          ? ImageFormatGroup.yuv420
          : ImageFormatGroup.bgra8888,
    );
    await controller.initialize();
    try {
      await controller.setFocusMode(FocusMode.auto);
    } on CameraException {
      // Fixed-focus camera: nothing to set.
    }
    _camera = controller;
    await controller.startImageStream(_onFrame);
  }

  void _onFrame(CameraImage image) {
    if (_busy || _paused) return;
    _busy = true;
    zx
        .processCameraImage(image, _params)
        .then((code) {
          final text = code.text ?? '';
          if (code.isValid && text.isNotEmpty) {
            _hadCode = true;
            _codes.add([
              ScannedCode(
                text: text,
                format: code.format == null
                    ? ''
                    : zx.barcodeFormatName(code.format!),
              ),
            ]);
          } else if (_hadCode) {
            _hadCode = false;
            _codes.add(const []);
          }
        })
        .catchError((Object _) {
          // A bad frame is skipped; the next one is tried.
        })
        .whenComplete(() => _busy = false);
  }

  @override
  Widget buildPreview(BuildContext context) {
    final camera = _camera;
    if (camera == null || !camera.value.isInitialized) {
      return const SizedBox.expand();
    }
    final size = camera.value.previewSize!;
    // previewSize is landscape; the preview is shown upright.
    return ClipRect(
      child: FittedBox(
        fit: BoxFit.cover,
        child: SizedBox(
          width: size.height,
          height: size.width,
          child: CameraPreview(camera),
        ),
      ),
    );
  }

  @override
  Future<void> toggleTorch() async {
    final camera = _camera;
    if (camera == null) return;
    final on = camera.value.flashMode == FlashMode.torch;
    await camera.setFlashMode(on ? FlashMode.off : FlashMode.torch);
  }

  @override
  Future<void> switchCamera() async {
    if (_cameras.length < 2) return;
    _cameraIndex = (_cameraIndex + 1) % _cameras.length;
    await _open();
  }

  @override
  Future<void> pause() async {
    _paused = true;
    await _camera?.pausePreview();
  }

  @override
  Future<void> resume() async {
    _paused = false;
    await _camera?.resumePreview();
  }

  @override
  Future<void> dispose() async {
    final camera = _camera;
    _camera = null;
    if (camera != null && camera.value.isStreamingImages) {
      await camera.stopImageStream();
    }
    await camera?.dispose();
    await _codes.close();
  }
}
