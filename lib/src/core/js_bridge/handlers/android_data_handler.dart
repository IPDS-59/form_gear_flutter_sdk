import 'package:form_gear_engine_sdk/src/core/js_bridge/js_handler_base.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/models/response_models.dart';

/// Factory class that creates JSHandlers for Android data methods
class AndroidDataHandler {
  AndroidDataHandler({
    this.onGetReference,
    this.onGetTemplate,
    this.onGetPreset,
    this.onGetResponse,
    this.onGetValidation,
    this.onGetMedia,
    this.onGetRemark,
    this.onGetUserName,
    this.onGetFormMode,
    this.onGetIsNew,
    this.onGetPrincipalCollection,
    this.onGetRolePetugas,
    this.onGetUserRole,
  });

  final Future<Map<String, dynamic>> Function()? onGetReference;
  final Future<Map<String, dynamic>> Function()? onGetTemplate;
  final Future<Map<String, dynamic>> Function()? onGetPreset;
  final Future<Map<String, dynamic>> Function()? onGetResponse;
  final Future<Map<String, dynamic>> Function()? onGetValidation;
  final Future<Map<String, dynamic>> Function()? onGetMedia;
  final Future<Map<String, dynamic>> Function()? onGetRemark;
  final Future<String> Function()? onGetUserName;
  final Future<int> Function()? onGetFormMode;
  final Future<int> Function()? onGetIsNew;
  final Future<List<dynamic>> Function()? onGetPrincipalCollection;
  final Future<String> Function()? onGetRolePetugas;
  final Future<String> Function()? onGetUserRole;

  /// Creates individual JSHandlers for each Android method
  List<JSHandler<JsonCodable>> createHandlers() {
    return [
      _AndroidMethodHandler('getReference', () async {
        final data = await onGetReference?.call() ?? {};
        return JsonInfoJs(success: true, data: data);
      }),
      _AndroidMethodHandler('getTemplate', () async {
        final data = await onGetTemplate?.call() ?? {};
        return JsonInfoJs(success: true, data: data);
      }),
      _AndroidMethodHandler('getPreset', () async {
        final data = await onGetPreset?.call() ?? {};
        return JsonInfoJs(success: true, data: data);
      }),
      _AndroidMethodHandler('getResponse', () async {
        final data = await onGetResponse?.call() ?? {};
        return JsonInfoJs(success: true, data: data);
      }),
      _AndroidMethodHandler('getValidation', () async {
        final data = await onGetValidation?.call() ?? {};
        return JsonInfoJs(success: true, data: data);
      }),
      _AndroidMethodHandler('getMedia', () async {
        final data = await onGetMedia?.call() ?? {};
        return JsonInfoJs(success: true, data: data);
      }),
      _AndroidMethodHandler('getRemark', () async {
        final data = await onGetRemark?.call() ?? {};
        return JsonInfoJs(success: true, data: data);
      }),
      _AndroidMethodHandler('getUserName', () async {
        final value = await onGetUserName?.call() ?? 'Unknown User';
        return StringInfoJs(success: true, value: value);
      }),
      _AndroidMethodHandler('getFormMode', () async {
        final value = await onGetFormMode?.call() ?? 0;
        return StringInfoJs(success: true, value: value.toString());
      }),
      _AndroidMethodHandler('getIsNew', () async {
        final value = await onGetIsNew?.call() ?? 1;
        return StringInfoJs(success: true, value: value.toString());
      }),
      _AndroidMethodHandler('getPrincipalCollection', () async {
        final data = await onGetPrincipalCollection?.call() ?? <dynamic>[];
        return ListInfoJs(success: true, data: data);
      }),
      _AndroidMethodHandler('getRolePetugas', () async {
        final value = await onGetRolePetugas?.call() ?? 'USER';
        return StringInfoJs(success: true, value: value);
      }),
      _AndroidMethodHandler('getUserRole', () async {
        final value = await onGetUserRole?.call() ?? 'USER';
        return StringInfoJs(success: true, value: value);
      }),
    ];
  }
}

/// Individual JSHandler for each Android method
class _AndroidMethodHandler extends JSHandler<JsonCodable> {
  _AndroidMethodHandler(this._handlerName, this._callback);

  final String _handlerName;
  final Future<JsonCodable> Function() _callback;

  @override
  String get handlerName => _handlerName;

  @override
  Future<JsonCodable> callback(List<dynamic> arguments) => _callback();
}
