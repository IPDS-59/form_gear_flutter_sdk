import 'package:form_gear_engine_sdk/src/core/js_bridge/js_handler_base.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/models/response_models.dart';
import 'package:form_gear_engine_sdk/src/utils/utils.dart';

/// Handler for mobileExit calls - triggers form exit/save behavior
class MobileExitHandler extends JSHandler<ActionInfoJs> {
  MobileExitHandler({String? formEngineId}) : _formEngineId = formEngineId;

  final String? _formEngineId;

  @override
  String get handlerName => 'mobileExit';

  @override
  Future<ActionInfoJs> callback(List<dynamic> arguments) async {
    try {
      final formEngineId = _formEngineId ?? '1';
      FormGearLogger.webview('Mobile exit called for engine: $formEngineId');

      // For mobileExit, we signal that the form should exit/save
      // The actual JavaScript execution will be handled by the calling context
      // This follows the pattern of other bridge methods that return success
      // and let the form engine handle the action

      FormGearLogger.webview('Mobile exit completed successfully');

      return ActionInfoJs(
        success: true,
        result: 'Mobile exit triggered for engine $formEngineId',
      );
    } on Exception catch (e) {
      FormGearLogger.webviewError('Mobile exit error: $e');
      return ActionInfoJs(success: false, error: e.toString());
    }
  }
}
