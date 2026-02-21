import 'package:form_gear_engine_sdk/form_gear_engine_sdk.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/js_executor_service.dart';
import 'package:form_gear_engine_sdk/src/utils/utils.dart';

/// Contract for action sub-handlers
/// All action handlers should implement this interface for consistency
abstract mixin class ActionHandlerContract {
  /// List of action types this handler can process
  List<String> get supportedActions;

  /// Check if this handler can handle the given action
  bool canHandle(String action) => supportedActions.contains(action);

  /// Handle the action and return result
  /// [action] - The action type (e.g., 'CAMERA', 'LOCATION')
  /// [dataKey] - The data key from FormGear
  /// [data] - Additional data passed from FormGear
  Future<ActionInfoJs> handle(String action, String dataKey, String data);

  /// Notify FormGear JavaScript of action result
  /// Uses window.result() for cross-platform compatibility (iOS/Android)
  /// [action] - The action type (e.g., 'CAMERA', 'CAMERA_GPS', 'FILE_UPLOADED')
  /// [result] - The result data (filename, JSON, etc.)
  /// [dataKey] - The data key from FormGear (optional)
  Future<void> notifyJavaScript({
    required String action,
    required String result,
    String dataKey = '',
  }) async {
    final jsExecutor = JSExecutorService();
    if (!jsExecutor.isRegistered) {
      FormGearLogger.webview(
        'No JavaScript executor available, skipping notification',
      );
      return;
    }

    try {
      // Escape single quotes in result to prevent JS syntax errors
      final escapedResult = result.replaceAll("'", r"\'");
      final escapedDataKey = dataKey.replaceAll("'", r"\'");

      // Use window.result() for cross-platform compatibility
      final jsCommand =
          "window.result('$action', '$escapedResult', "
          "'$escapedDataKey')";

      FormGearLogger.webview('Executing JS callback: $jsCommand');
      await jsExecutor.executeJavaScript(jsCommand);
    } on Exception catch (e) {
      FormGearLogger.webviewError('Failed to notify JavaScript: $e');
    }
  }
}
