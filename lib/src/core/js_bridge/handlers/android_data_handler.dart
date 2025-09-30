import 'package:form_gear_engine_sdk/src/core/js_bridge/js_handler_base.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/models/response_models.dart';
import 'package:form_gear_engine_sdk/src/models/assignment_context.dart';

/// Factory class that creates JSHandlers for Android data methods
/// Now supports dynamic assignment-based configuration following FASIH patterns
class AndroidDataHandler {
  AndroidDataHandler({
    required this.getCurrentAssignment,
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

  /// Function to get current assignment context for dynamic configuration
  final AssignmentContext? Function() getCurrentAssignment;

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
        final assignment = getCurrentAssignment();
        if (assignment != null) {
          // Use assignment-specific reference data
          return JsonInfoJs(success: true, data: assignment.data.reference);
        }
        final data = await onGetReference?.call() ?? {};
        return JsonInfoJs(success: true, data: data);
      }),
      _AndroidMethodHandler('getTemplate', () async {
        final assignment = getCurrentAssignment();
        if (assignment != null) {
          // Use assignment-specific template data
          return JsonInfoJs(success: true, data: assignment.data.template);
        }
        final data = await onGetTemplate?.call() ?? {};
        return JsonInfoJs(success: true, data: data);
      }),
      _AndroidMethodHandler('getPreset', () async {
        final assignment = getCurrentAssignment();
        if (assignment != null) {
          // Use assignment-specific preset data (pre-filled form data)
          return JsonInfoJs(success: true, data: assignment.data.preset);
        }
        final data = await onGetPreset?.call() ?? {};
        return JsonInfoJs(success: true, data: data);
      }),
      _AndroidMethodHandler('getResponse', () async {
        final assignment = getCurrentAssignment();
        if (assignment != null) {
          // Use assignment-specific response data (previous answers)
          return JsonInfoJs(success: true, data: assignment.data.response);
        }
        final data = await onGetResponse?.call() ?? {};
        return JsonInfoJs(success: true, data: data);
      }),
      _AndroidMethodHandler('getValidation', () async {
        final assignment = getCurrentAssignment();
        if (assignment != null) {
          // Use assignment-specific validation rules
          return JsonInfoJs(success: true, data: assignment.data.validation);
        }
        final data = await onGetValidation?.call() ?? {};
        return JsonInfoJs(success: true, data: data);
      }),
      _AndroidMethodHandler('getMedia', () async {
        final assignment = getCurrentAssignment();
        if (assignment != null) {
          // Use assignment-specific media data
          return JsonInfoJs(success: true, data: assignment.data.media);
        }
        final data = await onGetMedia?.call() ?? {};
        return JsonInfoJs(success: true, data: data);
      }),
      _AndroidMethodHandler('getRemark', () async {
        final assignment = getCurrentAssignment();
        if (assignment != null) {
          // Use assignment-specific remark data
          return JsonInfoJs(success: true, data: assignment.data.remark);
        }
        final data = await onGetRemark?.call() ?? {};
        return JsonInfoJs(success: true, data: data);
      }),
      _AndroidMethodHandler('getUserName', () async {
        final assignment = getCurrentAssignment();
        if (assignment != null && assignment.data.userInfo != null) {
          // Use assignment-specific user info
          final userInfo = assignment.data.userInfo!;
          final username =
              userInfo['name'] ?? userInfo['username'] ?? 'Unknown User';
          return StringInfoJs(success: true, value: username.toString());
        }
        final value = await onGetUserName?.call() ?? 'Unknown User';
        return StringInfoJs(success: true, value: value);
      }),
      _AndroidMethodHandler('getFormMode', () async {
        final assignment = getCurrentAssignment();
        if (assignment != null) {
          // Use assignment-specific form mode (dynamic configuration!)
          final formMode = assignment.config.formMode.value;
          return StringInfoJs(success: true, value: formMode.toString());
        }
        final value = await onGetFormMode?.call() ?? 0;
        return StringInfoJs(success: true, value: value.toString());
      }),
      _AndroidMethodHandler('getIsNew', () async {
        final assignment = getCurrentAssignment();
        if (assignment != null) {
          // Determine if this is a new form based on response data
          final hasExistingData =
              assignment.data.response.isNotEmpty &&
              assignment.data.response['details'] != null;
          final details =
              assignment.data.response['details'] as Map<String, dynamic>?;
          final hasAnswers =
              details?['answers'] != null &&
              (details!['answers'] as List<dynamic>).isNotEmpty;
          final isNew = (hasExistingData && hasAnswers) ? 0 : 1;
          return StringInfoJs(success: true, value: isNew.toString());
        }
        final value = await onGetIsNew?.call() ?? 1;
        return StringInfoJs(success: true, value: value.toString());
      }),
      _AndroidMethodHandler('getPrincipalCollection', () async {
        final assignment = getCurrentAssignment();
        if (assignment != null) {
          // Use assignment-specific principal data
          return ListInfoJs(success: true, data: assignment.data.principals);
        }
        final data = await onGetPrincipalCollection?.call() ?? <dynamic>[];
        return ListInfoJs(success: true, data: data);
      }),
      _AndroidMethodHandler('getRolePetugas', () async {
        final assignment = getCurrentAssignment();
        if (assignment != null && assignment.data.userInfo != null) {
          // Use assignment-specific user role
          final userInfo = assignment.data.userInfo!;
          final role = userInfo['role'] ?? userInfo['jabatan'] ?? 'USER';
          return StringInfoJs(success: true, value: role.toString());
        }
        final value = await onGetRolePetugas?.call() ?? 'USER';
        return StringInfoJs(success: true, value: value);
      }),
      _AndroidMethodHandler('getUserRole', () async {
        final assignment = getCurrentAssignment();
        if (assignment != null && assignment.data.userInfo != null) {
          // Use assignment-specific user role
          final userInfo = assignment.data.userInfo!;
          final role = userInfo['role'] ?? userInfo['jabatan'] ?? 'USER';
          return StringInfoJs(success: true, value: role.toString());
        }
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
