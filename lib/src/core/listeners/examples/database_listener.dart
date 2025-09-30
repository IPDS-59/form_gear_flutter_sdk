// Generic catches intentional for example implementation
// ignore_for_file: avoid_catches_without_on_clauses

import 'dart:convert';

import 'package:form_gear_engine_sdk/src/core/listeners/form_data_listener.dart';
import 'package:form_gear_engine_sdk/src/core/listeners/save_submit_data.dart';
import 'package:form_gear_engine_sdk/src/core/listeners/save_submit_result.dart';
import 'package:form_gear_engine_sdk/src/models/validation_result.dart';
import 'package:form_gear_engine_sdk/src/utils/form_gear_logger.dart';

/// Example FormDataListener implementation for database storage
///
/// This example demonstrates how to implement FormDataListener with a database
/// backend. It shows proper transaction handling, data validation, and
/// error recovery patterns.
///
/// Features:
/// - Database transaction support for atomic operations
/// - Data validation before storage
/// - Automatic retry logic for transient failures
/// - Structured data storage with proper indexing
/// - Support for both SQLite and other database backends
///
/// Note: This example uses a generic DatabaseInterface that you would
/// implement with your preferred database solution (SQLite, Hive, etc.)
///
/// Usage:
/// ```dart
/// final database = MySQLiteDatabase(); // Your database implementation
/// final listener = DatabaseFormDataListener(database);
///
/// FormGearSDK.instance.setFormDataListener(listener);
/// ```
class DatabaseFormDataListener extends BaseFormDataListener {
  DatabaseFormDataListener(
    this.database, {
    this.maxRetries = 3,
    this.retryDelay = const Duration(seconds: 1),
    this.enableValidation = true,
    this.enableTransactions = true,
  });

  /// Database interface for storing form data
  final DatabaseInterface database;

  /// Maximum number of retry attempts for failed operations
  final int maxRetries;

  /// Delay between retry attempts
  final Duration retryDelay;

  /// Whether to validate data before storing
  final bool enableValidation;

  /// Whether to use database transactions for atomic operations
  final bool enableTransactions;

  @override
  Future<SaveSubmitResult> onSaveOrSubmit(SaveSubmitData data) async {
    return _handleSaveSubmit(data, isFormGear: true);
  }

  @override
  Future<SaveSubmitResult> onSaveOrSubmitFasihForm(SaveSubmitData data) async {
    return _handleSaveSubmit(data, isFormGear: false);
  }

  @override
  Future<void> onSaveOrSubmitError(
    SaveSubmitData data,
    Object error,
    StackTrace? stackTrace,
  ) async {
    FormGearLogger.sdkError(
      'DatabaseFormDataListener: Error for assignment ${data.assignmentId}: $error',
    );

    // Log error to database for debugging
    try {
      await database.insertErrorLog(
        assignmentId: data.assignmentId,
        errorMessage: error.toString(),
        stackTrace: stackTrace?.toString(),
        timestamp: DateTime.now(),
        engineType: data.engineType.displayName,
        flag: data.flag,
      );
    } catch (e) {
      FormGearLogger.sdkError('Failed to log error to database: $e');
    }
  }

  @override
  Future<void> onSaveOrSubmitStarted(SaveSubmitData data) async {
    FormGearLogger.sdk(
      'DatabaseFormDataListener: Started processing assignment ${data.assignmentId}',
    );

    // Optional: Log operation start for audit trail
    if (database.supportsAuditLog) {
      try {
        await database.insertAuditLog(
          assignmentId: data.assignmentId,
          operation: 'save_submit_started',
          timestamp: DateTime.now(),
          metadata: {
            'engine_type': data.engineType.displayName,
            'flag': data.flag,
            'template_id': data.templateId,
          },
        );
      } catch (e) {
        FormGearLogger.sdkError('Failed to log operation start: $e');
      }
    }
  }

  @override
  Future<void> onSaveOrSubmitCompleted(
    SaveSubmitData data,
    SaveSubmitResult result,
  ) async {
    FormGearLogger.sdk(
      'DatabaseFormDataListener: Completed assignment ${data.assignmentId} '
      'with ${result.isSuccess ? 'success' : 'failure'}',
    );

    // Optional: Log operation completion for audit trail
    if (database.supportsAuditLog) {
      try {
        await database.insertAuditLog(
          assignmentId: data.assignmentId,
          operation: 'save_submit_completed',
          timestamp: DateTime.now(),
          metadata: {
            'success': result.isSuccess,
            'submission_id': result.submissionId,
            'error': result.error,
          },
        );
      } catch (e) {
        FormGearLogger.sdkError('Failed to log operation completion: $e');
      }
    }
  }

  /// Handles save/submit operations with retry logic and transaction support
  Future<SaveSubmitResult> _handleSaveSubmit(
    SaveSubmitData data, {
    required bool isFormGear,
  }) async {
    for (var attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        FormGearLogger.sdk(
          'DatabaseFormDataListener: Attempt $attempt/$maxRetries for assignment ${data.assignmentId}',
        );

        // Validate data if enabled
        if (enableValidation) {
          final validationResult = _validateData(data);
          if (!validationResult.isValid) {
            return SaveSubmitResult.failure(
              error: 'Data validation failed: ${validationResult.error}',
              errorCode: 'VALIDATION_ERROR',
            );
          }
        }

        // Perform save operation with optional transaction support
        final submissionId = enableTransactions
            ? await _saveWithTransaction(data, isFormGear)
            : await _saveWithoutTransaction(data, isFormGear);

        return SaveSubmitResult.success(
          submissionId: submissionId,
          metadata: {
            'database_type': database.type,
            'attempt_number': attempt,
            'transaction_used': enableTransactions,
            'validation_enabled': enableValidation,
            'is_form_gear': isFormGear,
          },
        );
      } catch (e, stackTrace) {
        FormGearLogger.sdkError(
          'DatabaseFormDataListener: Attempt $attempt failed for assignment ${data.assignmentId}: $e',
        );

        // Check if we should retry
        if (attempt < maxRetries && _isRetryableError(e)) {
          FormGearLogger.sdk(
            'DatabaseFormDataListener: Retrying in ${retryDelay.inMilliseconds}ms...',
          );
          await Future<void>.delayed(retryDelay);
          continue;
        }

        // Final attempt failed or non-retryable error
        return SaveSubmitResult.fromException(e, stackTrace);
      }
    }

    // Should never reach here, but just in case
    return SaveSubmitResult.failure(
      error: 'Max retry attempts exceeded',
      errorCode: 'MAX_RETRIES_EXCEEDED',
    );
  }

  /// Saves data using database transactions for atomicity
  Future<String> _saveWithTransaction(
    SaveSubmitData data,
    bool isFormGear,
  ) async {
    return database.runInTransaction(() async {
      // Update or insert assignment record
      final assignmentId = await database.upsertAssignment(
        assignmentId: data.assignmentId,
        templateId: data.templateId,
        surveyId: data.surveyId,
        status: data.flag,
        lastModified: DateTime.now(),
        config: data.config,
      );

      // Insert form response data
      final responseId = await database.insertFormResponse(
        assignmentId: assignmentId,
        formData: data.formData,
        engineType: data.engineType.displayName,
        timestamp: DateTime.now(),
        flag: data.flag,
      );

      // Insert additional data types
      await _insertAdditionalData(assignmentId, data, isFormGear);

      // Generate and return submission ID
      return _generateSubmissionId(data, responseId);
    });
  }

  /// Saves data without transactions (faster but less safe)
  Future<String> _saveWithoutTransaction(
    SaveSubmitData data,
    bool isFormGear,
  ) async {
    // Update or insert assignment record
    final assignmentId = await database.upsertAssignment(
      assignmentId: data.assignmentId,
      templateId: data.templateId,
      surveyId: data.surveyId,
      status: data.flag,
      lastModified: DateTime.now(),
      config: data.config,
    );

    // Insert form response data
    final responseId = await database.insertFormResponse(
      assignmentId: assignmentId,
      formData: data.formData,
      engineType: data.engineType.displayName,
      timestamp: DateTime.now(),
      flag: data.flag,
    );

    // Insert additional data types
    await _insertAdditionalData(assignmentId, data, isFormGear);

    // Generate and return submission ID
    return _generateSubmissionId(data, responseId);
  }

  /// Inserts additional data types (remark, principal, reference, media)
  Future<void> _insertAdditionalData(
    String assignmentId,
    SaveSubmitData data,
    bool isFormGear,
  ) async {
    // Insert remark data
    if (data.remark.isNotEmpty) {
      await database.insertRemark(
        assignmentId: assignmentId,
        remarkData: data.remark,
        timestamp: DateTime.now(),
      );
    }

    // Insert principal data
    if (data.principal.isNotEmpty) {
      await database.insertPrincipal(
        assignmentId: assignmentId,
        principalData: data.principal,
        timestamp: DateTime.now(),
      );
    }

    // Insert FormGear-specific data
    if (isFormGear) {
      if (data.reference?.isNotEmpty ?? false) {
        await database.insertReference(
          assignmentId: assignmentId,
          referenceData: data.reference!,
          timestamp: DateTime.now(),
        );
      }

      if (data.media?.isNotEmpty ?? false) {
        await database.insertMedia(
          assignmentId: assignmentId,
          mediaData: data.media!,
          timestamp: DateTime.now(),
        );
      }
    }
  }

  /// Validates save/submit data before processing
  ValidationResult _validateData(SaveSubmitData data) {
    // Check required fields
    if (data.assignmentId.isEmpty) {
      return const ValidationResult(
        isValid: false,
        error: 'Assignment ID is required',
      );
    }

    if (data.templateId.isEmpty) {
      return const ValidationResult(
        isValid: false,
        error: 'Template ID is required',
      );
    }

    if (data.formData.isEmpty) {
      return const ValidationResult(
        isValid: false,
        error: 'Form data is required',
      );
    }

    // Validate JSON format
    try {
      jsonDecode(data.formData);
    } catch (e) {
      return ValidationResult(
        isValid: false,
        error: 'Invalid JSON in form data: $e',
      );
    }

    // Additional validation for optional fields
    if (data.remark.isNotEmpty) {
      try {
        jsonDecode(data.remark);
      } catch (e) {
        return ValidationResult(
          isValid: false,
          error: 'Invalid JSON in remark data: $e',
        );
      }
    }

    if (data.principal.isNotEmpty) {
      try {
        jsonDecode(data.principal);
      } catch (e) {
        return ValidationResult(
          isValid: false,
          error: 'Invalid JSON in principal data: $e',
        );
      }
    }

    return const ValidationResult(isValid: true);
  }

  /// Checks if an error is retryable (transient failure vs permanent failure)
  bool _isRetryableError(Object error) {
    final errorString = error.toString().toLowerCase();

    // Network-related errors are typically retryable
    if (errorString.contains('connection') ||
        errorString.contains('timeout') ||
        errorString.contains('network')) {
      return true;
    }

    // Database lock errors are retryable
    if (errorString.contains('locked') ||
        errorString.contains('busy') ||
        errorString.contains('deadlock')) {
      return true;
    }

    // Temporary storage issues might be retryable
    if (errorString.contains('disk full') || errorString.contains('no space')) {
      return false; // Not retryable - need to free space first
    }

    // Permission errors are not retryable
    if (errorString.contains('permission') ||
        errorString.contains('access denied')) {
      return false;
    }

    // Default to not retryable for unknown errors
    return false;
  }

  /// Generates a unique submission ID
  String _generateSubmissionId(SaveSubmitData data, int responseId) {
    final timestamp = DateTime.now().millisecondsSinceEpoch;
    final prefix = data.isFormGear ? 'fg_db' : 'ff_db';
    final flag = data.flag.toLowerCase();

    return '${prefix}_${data.assignmentId}_${flag}_${responseId}_$timestamp';
  }

  /// Gets statistics about stored form data
  Future<Map<String, dynamic>> getStorageStatistics() async {
    try {
      return database.getStorageStatistics();
    } catch (e) {
      FormGearLogger.sdkError('Failed to get storage statistics: $e');
      return {'error': e.toString()};
    }
  }

  /// Exports assignment data for backup or transfer
  Future<Map<String, dynamic>?> exportAssignmentData(
    String assignmentId,
  ) async {
    try {
      return database.exportAssignment(assignmentId);
    } catch (e) {
      FormGearLogger.sdkError('Failed to export assignment $assignmentId: $e');
      return null;
    }
  }
}

/// Abstract interface for database operations
///
/// Implement this interface with your preferred database solution.
/// Examples: SQLite (sqflite), Hive, Isar, etc.
abstract class DatabaseInterface {
  /// Type of database (e.g., 'sqlite', 'hive', 'isar')
  String get type;

  /// Whether this database supports audit logging
  bool get supportsAuditLog => false;

  /// Runs multiple operations in a single transaction
  Future<T> runInTransaction<T>(Future<T> Function() operation);

  /// Updates or inserts assignment record
  Future<String> upsertAssignment({
    required String assignmentId,
    required String templateId,
    required String surveyId,
    required String status,
    required DateTime lastModified,
    required dynamic config,
  });

  /// Inserts form response data
  Future<int> insertFormResponse({
    required String assignmentId,
    required String formData,
    required String engineType,
    required DateTime timestamp,
    required String flag,
  });

  /// Inserts remark data
  Future<void> insertRemark({
    required String assignmentId,
    required String remarkData,
    required DateTime timestamp,
  });

  /// Inserts principal data
  Future<void> insertPrincipal({
    required String assignmentId,
    required String principalData,
    required DateTime timestamp,
  });

  /// Inserts reference data (FormGear only)
  Future<void> insertReference({
    required String assignmentId,
    required String referenceData,
    required DateTime timestamp,
  });

  /// Inserts media data (FormGear only)
  Future<void> insertMedia({
    required String assignmentId,
    required String mediaData,
    required DateTime timestamp,
  });

  /// Inserts error log entry
  Future<void> insertErrorLog({
    required String assignmentId,
    required String errorMessage,
    required DateTime timestamp,
    required String engineType,
    required String flag,
    String? stackTrace,
  });

  /// Inserts audit log entry (if supported)
  Future<void> insertAuditLog({
    required String assignmentId,
    required String operation,
    required DateTime timestamp,
    Map<String, dynamic>? metadata,
  });

  /// Gets storage statistics
  Future<Map<String, dynamic>> getStorageStatistics();

  /// Exports assignment data
  Future<Map<String, dynamic>> exportAssignment(String assignmentId);
}
