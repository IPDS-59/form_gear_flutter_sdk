import 'package:form_gear_engine_sdk/src/core/config/form_config.dart';
import 'package:form_gear_engine_sdk/src/core/config/form_gear_config.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/handlers/action_handler.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/handlers/android_action_handler.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/handlers/android_data_handler.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/handlers/client_action_handler.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/handlers/execute_handler.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/handlers/mobile_exit_handler.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/js_handler_base.dart';
import 'package:form_gear_engine_sdk/src/core/listeners/form_data_listener.dart';
import 'package:form_gear_engine_sdk/src/models/assignment_context.dart';
import 'package:form_gear_engine_sdk/src/utils/form_gear_logger.dart';

/// Factory for creating JavaScript bridge handlers for FormGear and FasihForm
class HandlerFactory {
  /// Creates required handlers for FormGear and FasihForm compatibility
  static List<JSHandler<dynamic>> createRequiredHandlers({
    required FormConfig? currentFormConfig,
    required FormGearConfig? config,
    required AssignmentContext? Function() getCurrentAssignment,
    FormDataListener? formDataListener,
  }) {
    final dataHandler = AndroidDataHandler(
      getCurrentAssignment: getCurrentAssignment,
      onGetReference: () async =>
          currentFormConfig?.reference ??
          {
            'details': <dynamic>[],
            'sidebar': <dynamic>[],
          },
      onGetTemplate: () async =>
          currentFormConfig?.template ??
          {
            'components': <dynamic>[<dynamic>[]],
          },
      onGetPreset: () async =>
          currentFormConfig?.preset ??
          {
            'description': 'Default Preset',
            'dataKey': 'default_preset',
            'predata': <dynamic>[],
          },
      onGetResponse: () async =>
          currentFormConfig?.response ??
          {
            'details': {'answers': <dynamic>[]},
          },
      onGetValidation: () async =>
          currentFormConfig?.validation ??
          {
            'testFunctions': <dynamic>[],
          },
      onGetMedia: () async =>
          currentFormConfig?.media ??
          {
            'details': {'media': <dynamic>[]},
          },
      onGetRemark: () async =>
          currentFormConfig?.remark ??
          {
            'dataKey': 'default_remark',
            'notes': <dynamic>[],
          },
      onGetUserName: () async => config?.username ?? 'Default User',
      onGetFormMode: () async => currentFormConfig?.formMode ?? 1,
      onGetIsNew: () async => currentFormConfig?.isNew ?? 1,
      onGetPrincipalCollection: () async => currentFormConfig?.principals ?? [],
      onGetRolePetugas: () async => config?.bpsUser?.jabatan ?? 'USER',
      onGetUserRole: () async => config?.bpsUser?.jabatan ?? 'USER',
    );

    final actionHandler = AndroidActionHandler(
      onAction: (action, dataKey, data, customData) async {
        FormGearLogger.webview(
          'FormGear fallback Action: $action, DataKey: $dataKey',
        );
        return 'Fallback action $action completed';
      },
      onExecute: (action, dataKey, data) async {
        FormGearLogger.webview(
          'FasihForm fallback Execute: $action, DataKey: $dataKey',
        );
        return 'Fallback execute $action completed';
      },
      onSaveOrSubmit:
          (response, remark, principal, reference, media, action) async {
            FormGearLogger.webview('FormGear SaveOrSubmit: $action');
            return 'form_${DateTime.now().millisecondsSinceEpoch}';
          },
      onSaveOrSubmitFasihForm: (response, remark, principal, action) async {
        FormGearLogger.webview('FasihForm SaveOrSubmit: $action');
        return 'fasih_form_${DateTime.now().millisecondsSinceEpoch}';
      },
      formDataListener: formDataListener,
      getCurrentAssignment: getCurrentAssignment,
    );

    // Individual action handlers following web_view pattern
    final actionCameraHandler = ActionHandler();
    final executeHandler = ExecuteHandler();
    final mobileExitHandler = MobileExitHandler();

    // Client action handlers for FormGear JavaScript integration
    final clientActionHandler = ClientActionHandler(
      onCameraCapture: (fileName, result) async {
        FormGearLogger.webview('Camera captured: $fileName -> $result');
        return result;
      },
      onFileUpload: (fileData, updateCallback, {required bool isReload}) async {
        FormGearLogger.webview('File upload: $fileData (reload: $isReload)');
        return 'upload_completed';
      },
      onLocationUpdate: (locationData) async {
        FormGearLogger.webview('Location updated: $locationData');
      },
      onMapOpen: (coordinates) async {
        FormGearLogger.webview('Map opened with coordinates: $coordinates');
      },
      onResponseSave: (response, media, remark, principal, reference) async {
        FormGearLogger.webview('Response saved to mobile storage');
      },
      onSubmitSave: (response, media, remark, principal, reference) async {
        FormGearLogger.webview('Submission saved to mobile storage');
      },
    );

    // Get only save/submit handlers from the factory
    final saveSubmitHandlers = actionHandler
        .createHandlers()
        .where(
          (handler) =>
              handler.handlerName == 'saveOrSubmit' ||
              handler.handlerName == 'saveOrSubmitFasihForm',
        )
        .toList();

    return [
      ...dataHandler.createHandlers(),
      actionCameraHandler, // Individual action handler
      executeHandler, // Individual execute handler
      mobileExitHandler, // Mobile exit handler
      ...clientActionHandler.createHandlers(), // Client action handlers
      ...saveSubmitHandlers,
    ];
  }

  /// Creates handlers with assignment context awareness
  static List<JSHandler<dynamic>> createAssignmentAwareHandlers({
    required AssignmentContext assignment,
    required FormConfig? currentFormConfig,
    required FormGearConfig? config,
    required AssignmentContext? Function() getCurrentAssignment,
    FormDataListener? formDataListener,
  }) {
    final dataHandler = AndroidDataHandler(
      getCurrentAssignment: getCurrentAssignment,
      onGetReference: () async =>
          currentFormConfig?.reference ??
          {
            'details': <dynamic>[],
            'sidebar': <dynamic>[],
          },
      onGetTemplate: () async =>
          currentFormConfig?.template ??
          {
            'components': <dynamic>[<dynamic>[]],
          },
      onGetPreset: () async =>
          currentFormConfig?.preset ??
          {
            'description': 'Default Preset',
            'dataKey': 'default_preset',
            'predata': <dynamic>[],
          },
      onGetResponse: () async =>
          currentFormConfig?.response ??
          {
            'details': {'answers': <dynamic>[]},
          },
      onGetValidation: () async =>
          currentFormConfig?.validation ??
          {
            'testFunctions': <dynamic>[],
          },
      onGetMedia: () async =>
          currentFormConfig?.media ??
          {
            'details': {'media': <dynamic>[]},
          },
      onGetRemark: () async =>
          currentFormConfig?.remark ??
          {
            'dataKey': 'default_remark',
            'notes': <dynamic>[],
          },
      onGetUserName: () async => config?.username ?? 'Default User',
      onGetFormMode: () async => currentFormConfig?.formMode ?? 1,
      onGetIsNew: () async => currentFormConfig?.isNew ?? 1,
      onGetPrincipalCollection: () async => currentFormConfig?.principals ?? [],
      onGetRolePetugas: () async => config?.bpsUser?.jabatan ?? 'USER',
      onGetUserRole: () async => config?.bpsUser?.jabatan ?? 'USER',
    );

    final actionHandler = AndroidActionHandler(
      onAction: (action, dataKey, data, customData) async {
        FormGearLogger.webview(
          'FormGear Action for ${assignment.assignmentId}: $action, '
          'DataKey: $dataKey',
        );
        return 'Action $action completed for assignment '
            '${assignment.assignmentId}';
      },
      onExecute: (action, dataKey, data) async {
        FormGearLogger.webview(
          'FasihForm Execute for ${assignment.assignmentId}: $action, '
          'DataKey: $dataKey',
        );
        return 'Execute $action completed for assignment '
            '${assignment.assignmentId}';
      },
      onSaveOrSubmit:
          (response, remark, principal, reference, media, action) async {
            FormGearLogger.webview(
              'FormGear SaveOrSubmit for ${assignment.assignmentId}: $action',
            );
            return 'form_${assignment.assignmentId}_'
                '${DateTime.now().millisecondsSinceEpoch}';
          },
      onSaveOrSubmitFasihForm: (response, remark, principal, action) async {
        FormGearLogger.webview(
          'FasihForm SaveOrSubmit for ${assignment.assignmentId}: $action',
        );
        return 'fasih_form_${assignment.assignmentId}_'
            '${DateTime.now().millisecondsSinceEpoch}';
      },
      formDataListener: formDataListener,
      getCurrentAssignment: getCurrentAssignment,
    );

    // Individual action handlers
    final actionCameraHandler = ActionHandler();
    final executeHandler = ExecuteHandler();
    final mobileExitHandler = MobileExitHandler();

    // Assignment-aware client action handlers
    final clientActionHandler = ClientActionHandler(
      onCameraCapture: (fileName, result) async {
        FormGearLogger.webview(
          'Camera captured for ${assignment.assignmentId}: '
          '$fileName -> $result',
        );
        return result;
      },
      onFileUpload: (fileData, updateCallback, {required bool isReload}) async {
        FormGearLogger.webview(
          'File upload for ${assignment.assignmentId}: '
          '$fileData (reload: $isReload)',
        );
        return 'upload_completed';
      },
      onLocationUpdate: (locationData) async {
        FormGearLogger.webview(
          'Location updated for ${assignment.assignmentId}: $locationData',
        );
      },
      onMapOpen: (coordinates) async {
        FormGearLogger.webview(
          'Map opened for ${assignment.assignmentId} '
          'with coordinates: $coordinates',
        );
      },
      onResponseSave: (response, media, remark, principal, reference) async {
        FormGearLogger.webview(
          'Response saved for assignment ${assignment.assignmentId}',
        );
      },
      onSubmitSave: (response, media, remark, principal, reference) async {
        FormGearLogger.webview(
          'Submission saved for assignment ${assignment.assignmentId}',
        );
      },
    );

    // Get only save/submit handlers from the factory
    final saveSubmitHandlers = actionHandler
        .createHandlers()
        .where(
          (handler) =>
              handler.handlerName == 'saveOrSubmit' ||
              handler.handlerName == 'saveOrSubmitFasihForm',
        )
        .toList();

    return [
      ...dataHandler.createHandlers(),
      actionCameraHandler,
      executeHandler,
      mobileExitHandler,
      ...clientActionHandler.createHandlers(),
      ...saveSubmitHandlers,
    ];
  }
}
