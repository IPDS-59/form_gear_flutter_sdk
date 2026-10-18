import 'dart:typed_data';

import 'package:camera/camera.dart';
import 'package:camera_platform_interface/camera_platform_interface.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_zxing/flutter_zxing.dart' as zxing;
import 'package:form_gear_engine_sdk/src/presentation/scanner/zxing_scanner_engine.dart';

CameraImage _yuvFrame(int width, int height) =>
    CameraImage.fromPlatformInterface(
      CameraImageData(
        format: const CameraImageFormat(ImageFormatGroup.yuv420, raw: 35),
        width: width,
        height: height,
        planes: [
          CameraImagePlane(
            bytes: Uint8List(width * height),
            bytesPerRow: width,
          ),
        ],
      ),
    );

void main() {
  // Regression: DecodeParams defaulted to width/height 0, so zxing-cpp rejected
  // every live camera frame and the scanner never read a code.
  test('decode params carry the frame size and luminance layout', () {
    final params = ZxingScannerEngine.paramsFor(
      _yuvFrame(1280, 720),
      zxing.DecodeParams(),
    );

    expect(params.width, 1280);
    expect(params.height, 720);
    expect(params.imageFormat, zxing.ImageFormat.lum);
  });

  test('the base params are not mutated', () {
    final base = zxing.DecodeParams();
    ZxingScannerEngine.paramsFor(_yuvFrame(640, 480), base);

    expect(base.width, 0);
  });
}
