// ignore_for_file: lines_longer_than_80_chars

import 'package:form_gear_engine_sdk/src/core/listeners/save_submit_data.dart';
import 'package:form_gear_engine_sdk/src/core/listeners/save_submit_result.dart';

/// Abstract interface for handling FormGear save/submit operations
///
/// This listener allows SDK users to implement their own data persistence
/// and caching strategies following FASIH patterns.
///
/// Usage:
/// ```dart
/// class MyFormDataListener extends FormDataListener {
///   @override
///   Future<SaveSubmitResult> onSaveOrSubmit(SaveSubmitData data) async {
///     // Implement your custom save logic here
///     await myDatabase.saveFormData(data);
///     return SaveSubmitResult.success(
///       submissionId: 'my_submission_${DateTime.now().millisecondsSinceEpoch}',
///     );
///   }
/// }
///
/// // Register the listener
/// FormGearSDK.instance.setFormDataListener(MyFormDataListener());
/// ```
abstract class FormDataListener {
  /// Called when FormGear v1 saveOrSubmit is triggered from JavaScript
  ///
  /// Parameters match FASIH's saveOrSubmit method:
  /// - [data]: The form data containing all answers and responses
  /// - Includes assignment context for dynamic configuration
  /// - Supports both save (flag: 'save') and submit (flag: 'submit') operations
  ///
  /// Returns [SaveSubmitResult] indicating success/failure and optional
  /// submission ID
  Future<SaveSubmitResult> onSaveOrSubmit(SaveSubmitData data);

  /// Called when FasihForm v2 saveOrSubmitFasihForm is triggered
  /// from JavaScript
  ///
  /// This is a simplified version of saveOrSubmit used by FasihForm v2 engine.
  /// Parameters match FASIH's saveOrSubmitFasihForm method:
  /// - [data]: The form data with reduced parameter set (no reference/media)
  /// - Includes assignment context for dynamic configuration
  ///
  /// Returns [SaveSubmitResult] indicating success/failure and optional
  /// submission ID
  Future<SaveSubmitResult> onSaveOrSubmitFasihForm(SaveSubmitData data);

  /// Optional callback for when save/submit operation fails
  ///
  /// This is called by the SDK when an exception occurs during the save/submit process,
  /// allowing listeners to handle errors gracefully.
  ///
  /// Default implementation logs the error but does nothing else.
  Future<void> onSaveOrSubmitError(
    SaveSubmitData data,
    Object error,
    StackTrace? stackTrace,
  ) async {
    // Default implementation - SDK users can override for custom error handling
  }

  /// Optional callback for tracking save/submit operations
  ///
  /// Called before save/submit operations begin, useful for analytics and logging.
  /// Default implementation does nothing.
  Future<void> onSaveOrSubmitStarted(SaveSubmitData data) async {
    // Default implementation - SDK users can override for custom tracking
  }

  /// Optional callback for when save/submit operations complete successfully
  ///
  /// Called after save/submit operations complete successfully, useful for cleanup.
  /// Default implementation does nothing.
  Future<void> onSaveOrSubmitCompleted(
    SaveSubmitData data,
    SaveSubmitResult result,
  ) async {
    // Default implementation - SDK users can override for custom completion handling
  }
}

/// Convenience base class for FormDataListener implementations
///
/// Provides sensible defaults for optional methods while requiring
/// implementation of core save/submit methods.
///
/// Usage:
/// ```dart
/// class MyFormDataListener extends BaseFormDataListener {
///   @override
///   Future<SaveSubmitResult> onSaveOrSubmit(SaveSubmitData data) async {
///     // Only implement the methods you need
///     return await handleSaveOrSubmit(data);
///   }
///
///   @override
///   Future<SaveSubmitResult> onSaveOrSubmitFasihForm(SaveSubmitData data) async {
///     // Reuse same logic for both engines
///     return await handleSaveOrSubmit(data);
///   }
/// }
/// ```
abstract class BaseFormDataListener implements FormDataListener {
  const BaseFormDataListener();

  /// Implement this for FormGear v1 saveOrSubmit
  @override
  Future<SaveSubmitResult> onSaveOrSubmit(SaveSubmitData data);

  /// Implement this for FasihForm v2 saveOrSubmitFasihForm
  @override
  Future<SaveSubmitResult> onSaveOrSubmitFasihForm(SaveSubmitData data);

  /// Default error handling implementation
  @override
  Future<void> onSaveOrSubmitError(
    SaveSubmitData data,
    Object error,
    StackTrace? stackTrace,
  ) async {
    // Default: do nothing, but SDK users can override
  }

  /// Default started tracking implementation
  @override
  Future<void> onSaveOrSubmitStarted(SaveSubmitData data) async {
    // Default: do nothing, but SDK users can override
  }

  /// Default completion tracking implementation
  @override
  Future<void> onSaveOrSubmitCompleted(
    SaveSubmitData data,
    SaveSubmitResult result,
  ) async {
    // Default: do nothing, but SDK users can override
  }
}

/// Simple FormDataListener implementation that handles both FormGear and FasihForm
/// using the same logic
///
/// This is useful when you want to treat both engines the same way.
///
/// Usage:
/// ```dart
/// class UnifiedFormDataListener extends UnifiedFormDataListener {
///   @override
///   Future<SaveSubmitResult> handleSaveOrSubmit(SaveSubmitData data) async {
///     // Handle both FormGear and FasihForm the same way
///     await myDatabase.saveFormData(data);
///     return SaveSubmitResult.success(submissionId: 'unified_${DateTime.now().millisecondsSinceEpoch}');
///   }
/// }
/// ```
abstract class UnifiedFormDataListener extends BaseFormDataListener {
  const UnifiedFormDataListener();

  /// Single method to handle both FormGear and FasihForm save/submit operations
  Future<SaveSubmitResult> handleSaveOrSubmit(SaveSubmitData data);

  @override
  Future<SaveSubmitResult> onSaveOrSubmit(SaveSubmitData data) async {
    return handleSaveOrSubmit(data);
  }

  @override
  Future<SaveSubmitResult> onSaveOrSubmitFasihForm(SaveSubmitData data) async {
    return handleSaveOrSubmit(data);
  }
}
