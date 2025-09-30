import 'package:form_gear_engine_sdk/src/core/js_bridge/js_handler_base.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/models/response_models.dart';
import 'package:form_gear_engine_sdk/src/core/listeners/form_data_listener.dart';
import 'package:form_gear_engine_sdk/src/core/listeners/save_submit_data.dart';
import 'package:form_gear_engine_sdk/src/core/listeners/save_submit_result.dart';
import 'package:form_gear_engine_sdk/src/models/assignment_context.dart';
import 'package:form_gear_engine_sdk/src/utils/form_gear_logger.dart';

/// Factory class that creates JSHandlers for Android action methods
/// Now supports both legacy callbacks and new FormDataListener architecture
class AndroidActionHandler {
  AndroidActionHandler({
    this.onAction,
    this.onExecute,
    this.onSaveOrSubmit,
    this.onSaveOrSubmitFasihForm,
    this.formDataListener,
    this.getCurrentAssignment,
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

  /// Legacy callback for FormGear v1 saveOrSubmit
  /// Kept for backward compatibility - use formDataListener for new implementations
  final Future<String?> Function(
    String response,
    String remark,
    String principal,
    String reference,
    String media,
    String action,
  )?
  onSaveOrSubmit;

  /// Legacy callback for FasihForm v2 saveOrSubmitFasihForm
  /// Kept for backward compatibility - use formDataListener for new implementations
  final Future<String?> Function(
    String response,
    String remark,
    String principal,
    String action,
  )?
  onSaveOrSubmitFasihForm;

  /// New FormDataListener for comprehensive save/submit handling
  /// Provides structured data and result handling following FASIH patterns
  final FormDataListener? formDataListener;

  /// Function to get current assignment context for save/submit operations
  final AssignmentContext? Function()? getCurrentAssignment;

  /// Creates individual JSHandlers for each Android action method
  /// Now supports both legacy callbacks and new FormDataListener architecture
  /// Note: 'action' and 'execute' handlers are provided by dedicated classes
  List<JSHandler<JsonCodable>> createHandlers() {
    return [
      // Removed 'action' handler - provided by ActionHandler class instead
      // Removed 'execute' handler - provided by ExecuteHandler class instead
      _AndroidActionMethodHandler('saveOrSubmit', (args) async {
        return _handleSaveOrSubmit(args, SaveSubmitEngineType.formGear);
      }),
      _AndroidActionMethodHandler('saveOrSubmitFasihForm', (args) async {
        return _handleSaveOrSubmit(args, SaveSubmitEngineType.fasihForm);
      }),
    ];
  }

  /// Handles saveOrSubmit operations for both FormGear and FasihForm engines
  /// Supports both legacy callbacks and new FormDataListener architecture
  Future<SubmissionInfoJs> _handleSaveOrSubmit(
    List<dynamic> args,
    SaveSubmitEngineType engineType,
  ) async {
    try {
      // Validate arguments based on engine type
      final isValidArgs = engineType == SaveSubmitEngineType.formGear
          ? args.length >= 6
          : args.length >= 4;

      if (!isValidArgs) {
        FormGearLogger.sdkError(
          'Invalid arguments for ${engineType.displayName} saveOrSubmit: '
          'expected ${engineType == SaveSubmitEngineType.formGear ? 6 : 4} '
          'arguments, got ${args.length}',
        );
        return SubmissionInfoJs(
          success: false,
          error: 'Invalid arguments for ${engineType.displayName}',
        );
      }

      // Extract arguments
      final formData = args[0].toString();
      final remark = args[1].toString();
      final principal = args[2].toString();
      final flag = engineType == SaveSubmitEngineType.formGear
          ? args[5]
                .toString() // FormGear: flag is 6th parameter
          : args[3].toString(); // FasihForm: flag is 4th parameter

      final reference = engineType == SaveSubmitEngineType.formGear
          ? args[3].toString()
          : null; // FasihForm doesn't have reference

      final media = engineType == SaveSubmitEngineType.formGear
          ? args[4].toString()
          : null; // FasihForm doesn't have media

      FormGearLogger.webview(
        '${engineType.displayName} saveOrSubmit called: flag=$flag, '
        'formData=${formData.length} chars, '
        'remark=${remark.length} chars, '
        'principal=${principal.length} chars'
        '${reference != null ? ', reference=${reference.length} chars' : ''}'
        '${media != null ? ', media=${media.length} chars' : ''}',
      );

      // Try new FormDataListener first (preferred approach)
      if (formDataListener != null) {
        return await _handleWithListener(
          formData: formData,
          remark: remark,
          principal: principal,
          reference: reference,
          media: media,
          flag: flag,
          engineType: engineType,
        );
      }

      // Fallback to legacy callbacks for backward compatibility
      return await _handleWithLegacyCallbacks(
        formData: formData,
        remark: remark,
        principal: principal,
        reference: reference,
        media: media,
        flag: flag,
        engineType: engineType,
      );
    } on Exception catch (e, stackTrace) {
      FormGearLogger.sdkError(
        'Error in ${engineType.displayName} saveOrSubmit: $e',
      );
      FormGearLogger.sdkError('Stack trace: $stackTrace');
      return SubmissionInfoJs(
        success: false,
        error: 'Save/submit failed: $e',
      );
    }
  }

  /// Handle save/submit using the new FormDataListener architecture
  Future<SubmissionInfoJs> _handleWithListener({
    required String formData,
    required String remark,
    required String principal,
    required String flag,
    required SaveSubmitEngineType engineType,
    String? reference,
    String? media,
  }) async {
    try {
      // Get assignment context
      final assignmentContext = getCurrentAssignment?.call();
      if (assignmentContext == null) {
        FormGearLogger.sdkError(
          'No assignment context available for '
          '${engineType.displayName} saveOrSubmit',
        );
        return SubmissionInfoJs(
          success: false,
          error: 'No assignment context available',
        );
      }

      // Create SaveSubmitData based on engine type
      late SaveSubmitData saveSubmitData;
      if (engineType == SaveSubmitEngineType.formGear) {
        saveSubmitData = SaveSubmitData.formGear(
          assignmentContext: assignmentContext,
          formData: formData,
          remark: remark,
          principal: principal,
          reference: reference ?? '',
          media: media ?? '',
          flag: flag,
          metadata: {
            'engine_type': engineType.displayName,
            'handler': 'AndroidActionHandler',
          },
        );
      } else {
        saveSubmitData = SaveSubmitData.fasihForm(
          assignmentContext: assignmentContext,
          formData: formData,
          remark: remark,
          principal: principal,
          flag: flag,
          metadata: {
            'engine_type': engineType.displayName,
            'handler': 'AndroidActionHandler',
          },
        );
      }

      // Call listener started callback
      await formDataListener!.onSaveOrSubmitStarted(saveSubmitData);

      // Call appropriate listener method
      late SaveSubmitResult result;
      if (engineType == SaveSubmitEngineType.formGear) {
        result = await formDataListener!.onSaveOrSubmit(saveSubmitData);
      } else {
        result = await formDataListener!.onSaveOrSubmitFasihForm(
          saveSubmitData,
        );
      }

      // Call completion callback if successful
      if (result.isSuccess) {
        await formDataListener!.onSaveOrSubmitCompleted(saveSubmitData, result);
        FormGearLogger.webview(
          '${engineType.displayName} saveOrSubmit completed successfully: '
          '${result.submissionId}',
        );
      } else {
        FormGearLogger.webview(
          '${engineType.displayName} saveOrSubmit failed: ${result.error}',
        );
      }

      return SubmissionInfoJs(
        success: result.isSuccess,
        submissionId: result.submissionId,
        error: result.error,
      );
    } on Exception catch (e, stackTrace) {
      // Call error callback
      final assignmentContext = getCurrentAssignment?.call();
      if (assignmentContext != null) {
        final saveSubmitData = engineType == SaveSubmitEngineType.formGear
            ? SaveSubmitData.formGear(
                assignmentContext: assignmentContext,
                formData: formData,
                remark: remark,
                principal: principal,
                reference: reference ?? '',
                media: media ?? '',
                flag: flag,
              )
            : SaveSubmitData.fasihForm(
                assignmentContext: assignmentContext,
                formData: formData,
                remark: remark,
                principal: principal,
                flag: flag,
              );

        await formDataListener!.onSaveOrSubmitError(
          saveSubmitData,
          e,
          stackTrace,
        );
      }

      rethrow;
    }
  }

  /// Handle save/submit using legacy callbacks for backward compatibility
  Future<SubmissionInfoJs> _handleWithLegacyCallbacks({
    required String formData,
    required String remark,
    required String principal,
    required String flag,
    required SaveSubmitEngineType engineType,
    String? reference,
    String? media,
  }) async {
    FormGearLogger.webview(
      'Using legacy callback for ${engineType.displayName} saveOrSubmit',
    );

    String? submissionId;

    if (engineType == SaveSubmitEngineType.formGear && onSaveOrSubmit != null) {
      submissionId = await onSaveOrSubmit!(
        formData,
        remark,
        principal,
        reference ?? '',
        media ?? '',
        flag,
      );
    } else if (engineType == SaveSubmitEngineType.fasihForm &&
        onSaveOrSubmitFasihForm != null) {
      submissionId = await onSaveOrSubmitFasihForm!(
        formData,
        remark,
        principal,
        flag,
      );
    } else {
      // No callback available - return default implementation
      FormGearLogger.webview(
        'No listener or legacy callback available for '
        '${engineType.displayName} - using default implementation',
      );
      submissionId =
          '${engineType.name}_'
          '${DateTime.now().millisecondsSinceEpoch}';
    }

    return SubmissionInfoJs(
      success: true,
      submissionId: submissionId,
    );
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
