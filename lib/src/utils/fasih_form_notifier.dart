import 'package:form_gear_engine_sdk/src/core/js_bridge/js_executor_service.dart';
import 'package:form_gear_engine_sdk/src/utils/form_gear_logger.dart';

/// Utility class for notifying FasihForm JavaScript of events
class FasihFormNotifier {
  /// Notifies FasihForm JavaScript of file selection
  static Future<void> notifyFileSelection({
    required String dataKey,
    required String filePath,
    required String fileName,
  }) async {
    try {
      final jsExecutor = JSExecutorService();
      if (!jsExecutor.isRegistered) {
        FormGearLogger.webview(
          'No JavaScript executor available, skipping file notification',
        );
        return;
      }

      final jsCommand =
          '''
javascript:fasihForm.event.emit(
  "file-selected",
  "$dataKey",
  '[{ "filename": "$fileName", "uri": "file://$filePath" }]'
)
''';

      FormGearLogger.webview('Executing file-selected JS callback: $jsCommand');
      await jsExecutor.executeJavaScript(jsCommand);
    } on Exception catch (e) {
      FormGearLogger.webviewError(
        'Failed to notify FasihForm of file selection: $e',
      );
    }
  }

  /// Notifies FasihForm JavaScript of location acquisition
  static Future<void> notifyLocation({
    required String dataKey,
    required double latitude,
    required double longitude,
    required double accuracy,
  }) async {
    try {
      final jsExecutor = JSExecutorService();
      if (!jsExecutor.isRegistered) {
        FormGearLogger.webview(
          'No JavaScript executor available, skipping location notification',
        );
        return;
      }

      final jsCommand =
          '''
javascript:fasihForm.event.emit(
  "geolocation-acquired",
  "$dataKey",
  '{"latitude": $latitude, "longitude": $longitude, "accuracy": $accuracy}'
)
''';

      FormGearLogger.webview('Executing geolocation JS callback: $jsCommand');
      await jsExecutor.executeJavaScript(jsCommand);
    } on Exception catch (e) {
      FormGearLogger.webviewError(
        'Failed to notify FasihForm of location: $e',
      );
    }
  }
}
