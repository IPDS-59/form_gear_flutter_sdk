import 'package:form_gear_engine_sdk/src/core/js_bridge/js_handler_base.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/models/response_models.dart';

/// Factory class that creates JSHandlers for Android action methods
class AndroidActionHandler {
  AndroidActionHandler({
    this.onAction,
    this.onExecute,
    this.onSaveOrSubmit,
    this.onSaveOrSubmitFasihForm,
  });

  final Future<String?> Function(
    String action,
    String dataKey,
    String data,
    String? customData,
  )?
  onAction;

  final Future<String?> Function(
    String action,
    String dataKey,
    String data,
  )?
  onExecute;

  final Future<String?> Function(
    String response,
    String remark,
    String principal,
    String reference,
    String media,
    String action,
  )?
  onSaveOrSubmit;

  final Future<String?> Function(
    String response,
    String remark,
    String principal,
    String action,
  )?
  onSaveOrSubmitFasihForm;

  /// Creates individual JSHandlers for each Android action method
  List<JSHandler<JsonCodable>> createHandlers() {
    return [
      _AndroidActionMethodHandler('action', (args) async {
        if (args.length >= 3) {
          final result = await onAction?.call(
            args[0].toString(),
            args[1].toString(),
            args[2].toString(),
            args.length > 3 ? args[3].toString() : null,
          );
          return ActionInfoJs(success: true, result: result);
        }
        return ActionInfoJs(success: false, error: 'Invalid arguments');
      }),
      _AndroidActionMethodHandler('execute', (args) async {
        if (args.length >= 3) {
          final result = await onExecute?.call(
            args[0].toString(),
            args[1].toString(),
            args[2].toString(),
          );
          return ActionInfoJs(success: true, result: result);
        }
        return ActionInfoJs(success: false, error: 'Invalid arguments');
      }),
      _AndroidActionMethodHandler('saveOrSubmit', (args) async {
        if (args.length >= 6) {
          final result = await onSaveOrSubmit?.call(
            args[0].toString(),
            args[1].toString(),
            args[2].toString(),
            args[3].toString(),
            args[4].toString(),
            args[5].toString(),
          );
          return SubmissionInfoJs(success: true, submissionId: result);
        }
        return SubmissionInfoJs(success: false, error: 'Invalid arguments');
      }),
      _AndroidActionMethodHandler('saveOrSubmitFasihForm', (args) async {
        if (args.length >= 4) {
          final result = await onSaveOrSubmitFasihForm?.call(
            args[0].toString(),
            args[1].toString(),
            args[2].toString(),
            args[3].toString(),
          );
          return SubmissionInfoJs(success: true, submissionId: result);
        }
        return SubmissionInfoJs(success: false, error: 'Invalid arguments');
      }),
    ];
  }
}

/// Individual JSHandler for each Android action method
class _AndroidActionMethodHandler extends JSHandler<JsonCodable> {
  _AndroidActionMethodHandler(this._handlerName, this._callback);

  final String _handlerName;
  final Future<JsonCodable> Function(List<dynamic> args) _callback;

  @override
  String get handlerName => _handlerName;

  @override
  Future<JsonCodable> callback(List<dynamic> arguments) => _callback(arguments);
}
