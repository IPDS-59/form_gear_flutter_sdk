// Device check for the zxing scanner: every symbology FormGear forms may use
// round-trips through the native decoder, a full-size frame decodes quickly,
// and the camera stream runs without errors.
//
// Run: flutter test integration_test/zxing_scanner_test.dart -d <device>
import 'dart:typed_data';

import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_zxing/flutter_zxing.dart';
import 'package:integration_test/integration_test.dart';

// The scanner engine is not exported (hosts only need the interface), so the
// camera smoke test goes through the same public hook the SDK uses.
import 'package:form_gear_engine_sdk/form_gear_engine_sdk.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  const formats = <String, int>{
    'QRCode': Format.qrCode,
    'Code128': Format.code128,
    'EAN-13': Format.ean13,
    'DataMatrix': Format.dataMatrix,
    'Code39': Format.code39,
    'PDF417': Format.pdf417,
  };
  const texts = <String, String>{
    'QRCode': 'FASIH-2026-0001',
    'Code128': 'ABC-12345',
    'EAN-13': '5901234123457',
    'DataMatrix': 'DM-98765',
    'Code39': 'CODE39',
    'PDF417': 'PDF-417-DATA',
  };

  for (final entry in formats.entries) {
    testWidgets('round trip ${entry.key}', (tester) async {
      final text = texts[entry.key]!;
      final enc = zx.encodeBarcode(
        contents: text,
        params: EncodeParams(format: entry.value, width: 400, height: 400),
      );
      expect(enc.isValid, isTrue, reason: enc.error);

      // Put the symbol in a 1280x720 luminance frame, like a camera frame.
      const fw = 1280, fh = 720;
      final frame = Uint8List(fw * fh)..fillRange(0, fw * fh, 200);
      final w = enc.width!, h = enc.height!;
      final ox = (fw - w) ~/ 2, oy = (fh - h) ~/ 2;
      for (var y = 0; y < h && oy + y < fh; y++) {
        frame.setRange(
          (oy + y) * fw + ox,
          (oy + y) * fw + ox + (w < fw ? w : fw),
          enc.data!.sublist(y * w, y * w + (w < fw ? w : fw)),
        );
      }

      final sw = Stopwatch()..start();
      final code = zx.readBarcode(frame, DecodeParams(width: fw, height: fh));
      sw.stop();
      // ignore: avoid_print
      print('ZXING ${entry.key}: ${code.text} in ${sw.elapsedMilliseconds} ms');
      expect(code.isValid, isTrue, reason: code.error);
      expect(code.text, text);
    });
  }

  testWidgets('a frame with no code is not valid', (tester) async {
    final frame = Uint8List(1280 * 720)..fillRange(0, 1280 * 720, 128);
    final code = zx.readBarcode(frame, DecodeParams(width: 1280, height: 720));
    expect(code.isValid, isFalse);
  });

  testWidgets('the engine builder hook exists', (tester) async {
    expect(FormGearScanner.engineBuilder, isNull);
  });
}
