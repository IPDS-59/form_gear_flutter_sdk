import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:form_gear_engine_sdk/form_gear_engine_sdk.dart';

/// Stub device capabilities for the example app.
///
/// The SDK has no camera, picker, recorder, scanner or location of its own
/// (1.0.0). A real host puts its own screens and plugins here. The stubs below
/// need no plugin and no permission, so the example runs anywhere:
/// photo and file pick return sample files, scan asks for the code in a
/// dialog, and locate returns a fixed position. Audio and video are left out
/// on purpose: the form then shows "tidak tersedia".
class ExampleCapabilities extends FormGearCapabilities {
  const ExampleCapabilities();

  @override
  CapabilitySupport support(CapabilityKind kind) => switch (kind) {
    CapabilityKind.photo ||
    CapabilityKind.pickFile ||
    CapabilityKind.scan ||
    CapabilityKind.locate => const CapabilitySupport.supported(),
    _ => const CapabilitySupport.unsupported('Contoh ini tidak punya perekam'),
  };

  @override
  Future<CapturedMedia?> capturePhoto(CapturePhotoRequest request) async {
    final bytes = await rootBundle.load('assets/sample/sample_photo.jpg');
    final file = File('${request.tempDir.path}/sample_photo.jpg')
      ..writeAsBytesSync(bytes.buffer.asUint8List());
    return CapturedMedia(file: file);
  }

  @override
  Future<PickedFile?> pickFile(PickRequest request) async {
    final file = File('${request.tempDir.path}/sample.csv')
      ..writeAsStringSync('id,name\n1,Contoh\n');
    return PickedFile(file: file, name: 'sample.csv', mime: 'text/csv');
  }

  @override
  Future<BarcodeScanResult?> scan(
    BuildContext context,
    BarcodeScanRequest request,
  ) async {
    final controller = TextEditingController();
    final text = await showDialog<String>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(request.title),
        content: TextField(
          controller: controller,
          decoration: const InputDecoration(labelText: 'Masukkan kode'),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Batal'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, controller.text),
            child: const Text('OK'),
          ),
        ],
      ),
    );
    return BarcodeScanResult(text: text);
  }

  @override
  Future<LocationFix?> locate(LocateRequest request) async => LocationFix(
    latitude: -0.8917,
    longitude: 119.8707,
    accuracy: 5,
    provider: 'example',
    timestamp: DateTime.now().toUtc(),
  );
}
