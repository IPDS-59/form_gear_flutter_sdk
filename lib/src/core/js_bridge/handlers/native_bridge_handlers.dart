import 'dart:convert';

import 'package:form_gear_engine_sdk/src/core/form_gear_sdk.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/js_handler_base.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/models/response_models.dart';
import 'package:form_gear_engine_sdk/src/core/listeners/form_engine_event_listener.dart';
import 'package:form_gear_engine_sdk/src/utils/form_gear_logger.dart';

/// Native `FormGearJsBridge` methods served through the host's
/// [FormEngineEventListener]: `dispatchFinalResult`, `connectorApi`,
/// `sendEvent`, and `s3refreshUrl`.
List<JSHandler<JsonCodable>> createNativeBridgeHandlers() => [
  _Handler('dispatchFinalResult', _dispatchFinalResult),
  _Handler('connectorApi', _connectorApi),
  _Handler('sendEvent', _sendEvent),
  // Native only re-reads the assignment and drops it: a no-op.
  _Handler('s3refreshUrl', (_) async => GenericInfoJs(success: true)),
];

FormEngineEventListener? get _listener =>
    FormGearSDK.instance.formEngineEventListener;

String? get _assignmentId =>
    FormGearSDK.instance.currentAssignment?.assignmentId;

String _arg(List<dynamic> args, int i) =>
    i < args.length && args[i] != null ? '${args[i]}' : '';

Future<JsonCodable> _dispatchFinalResult(List<dynamic> args) async {
  final summary = _arg(args, 3);
  // Native: summary.error.size() > 0 (throws on a malformed summary).
  final errors = (jsonDecode(summary) as Map<String, dynamic>)['error'] as List;
  final listener = _listener;
  if (listener == null) {
    FormGearLogger.webviewError('dispatchFinalResult: no listener registered');
    return GenericInfoJs(success: false, message: 'No listener');
  }
  await listener.onFinalResult(
    data: _arg(args, 0),
    remark: _arg(args, 1),
    principal: _arg(args, 2),
    summary: summary,
    hasErrors: errors.isNotEmpty,
  );
  return GenericInfoJs(success: true);
}

Future<JsonCodable> _connectorApi(List<dynamic> args) async {
  try {
    final listener = _listener;
    if (listener == null) throw StateError('No FormEngineEventListener');
    final id = _assignmentId;
    final payload = <String, dynamic>{
      'assignmentId': ?id,
      'body': jsonDecode(_arg(args, 1)) as Map<String, dynamic>,
    };
    final body = await listener.onConnectorApi(_arg(args, 0), payload);
    return StringInfoJs(
      success: true,
      value: body ?? '{"success":false,"message":"API call failed"}',
    );
  } on Object catch (e) {
    FormGearLogger.webviewError('connectorApi failed: $e');
    return StringInfoJs(
      success: false,
      value: jsonEncode({'success': false, 'message': '$e'}),
    );
  }
}

Future<JsonCodable> _sendEvent(List<dynamic> args) async {
  await _listener?.onSendEvent(_assignmentId ?? '0', _arg(args, 0));
  return GenericInfoJs(success: true);
}

class _Handler extends JSHandler<JsonCodable> {
  _Handler(this.handlerName, this._run);

  @override
  final String handlerName;
  final Future<JsonCodable> Function(List<dynamic>) _run;

  @override
  Future<JsonCodable> callback(List<dynamic> arguments) => _run(arguments);
}
