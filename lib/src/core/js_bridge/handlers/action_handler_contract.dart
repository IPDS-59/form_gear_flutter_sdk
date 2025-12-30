import 'package:form_gear_engine_sdk/form_gear_engine_sdk.dart';

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
}
