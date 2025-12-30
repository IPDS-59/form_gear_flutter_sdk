import 'package:form_gear_engine_sdk/form_gear_engine_sdk.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/handlers/action_handler_contract.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/handlers/barcode_action_handler.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/handlers/file_action_handler.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/handlers/location_action_handler.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/handlers/lookup_action_handler.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/handlers/media_action_handler.dart';
import 'package:form_gear_engine_sdk/src/utils/utils.dart';

/// Individual JSHandler for FormGear action() calls
/// Routes actions to specialized sub-handlers for maintainability
class ActionHandler extends JSHandler<ActionInfoJs> {
  /// Registry of all action sub-handlers
  final List<ActionHandlerContract> _handlers = [
    MediaActionHandler(),
    FileActionHandler(),
    LocationActionHandler(),
    LookupActionHandler(),
    BarcodeActionHandler(),
  ];

  @override
  String get handlerName => 'action';

  @override
  Future<ActionInfoJs> callback(List<dynamic> arguments) async {
    try {
      if (arguments.isEmpty) {
        return ActionInfoJs(success: false, error: 'No action specified');
      }

      final action = arguments[0].toString().toUpperCase();
      final dataKey = arguments.length > 1 ? arguments[1].toString() : '';
      final data = arguments.length > 2 ? arguments[2].toString() : '';

      FormGearLogger.webview(
        'Action handler called: $action, dataKey: $dataKey, data: $data',
      );

      // Find and delegate to the appropriate sub-handler
      for (final handler in _handlers) {
        if (handler.canHandle(action)) {
          return handler.handle(action, dataKey, data);
        }
      }

      FormGearLogger.webview('Unknown action: $action');
      return ActionInfoJs(success: false, error: 'Unknown action: $action');
    } on Exception catch (e) {
      FormGearLogger.webviewError('Action handler error: $e');
      return ActionInfoJs(success: false, error: e.toString());
    }
  }
}
