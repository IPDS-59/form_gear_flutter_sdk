import 'dart:convert';

import 'package:form_gear_engine_sdk/src/core/js_bridge/js_executor_service.dart';

/// Native -> FasihForm (engine 2) events. Payloads are JSON strings the
/// engine `JSON.parse`s, matching the native FASIH app.
class FasihFormNotifier {
  /// Notifies FasihForm JavaScript of file selection
  static Future<void> notifyFileSelection({
    required String dataKey,
    required String filePath,
    required String fileName,
  }) => JSExecutorService().emitFasihFormEvent('file-selected', [
    dataKey,
    jsonEncode([
      {'filename': fileName, 'uri': 'file://$filePath'},
    ]),
  ]);

  /// Notifies FasihForm JavaScript of location acquisition
  static Future<void> notifyLocation({
    required String dataKey,
    required double latitude,
    required double longitude,
    required double accuracy,
  }) => JSExecutorService().emitFasihFormEvent('geolocation-acquired', [
    dataKey,
    jsonEncode({
      'latitude': latitude,
      'longitude': longitude,
      'accuracy': accuracy,
    }),
  ]);

  /// Native FASIH `finalize()` (approval button): FasihForm validates and
  /// submits via `saveOrSubmitFasihForm`.
  static Future<void> triggerFinalize() =>
      JSExecutorService().emitFasihFormEvent('trigger-finalize');

  /// Tells FasihForm a `FILE_UPLOAD` finished; without it the field stays
  /// in its uploading state.
  static Future<void> notifyUploadFinished({
    required String dataKey,
    required String fileName,
    required String fileUri,
    String? url,
  }) => JSExecutorService().emitFasihFormEvent('upload-finished', [
    dataKey,
    jsonEncode({'filename': fileName, 'uri': fileUri, 'url': url}),
  ]);
}
