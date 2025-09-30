// ignore_for_file: lines_longer_than_80_chars, avoid_catches_without_on_clauses

import 'dart:convert';
import 'dart:io';

import 'package:form_gear_engine_sdk/src/core/listeners/form_data_listener.dart';
import 'package:form_gear_engine_sdk/src/core/listeners/save_submit_data.dart';
import 'package:form_gear_engine_sdk/src/core/listeners/save_submit_result.dart';
import 'package:form_gear_engine_sdk/src/utils/form_gear_logger.dart';

/// Simple example FormDataListener implementation for getting started
///
/// This is a minimal implementation that demonstrates the basic patterns
/// for handling save/submit operations. It's perfect for:
/// - Learning how FormDataListener works
/// - Quick prototyping and testing
/// - Simple applications with basic storage needs
///
/// Features:
/// - Unified handling for both FormGear and FasihForm
/// - Basic logging and error handling
/// - Simple JSON file storage for testing
/// - Customizable success/failure behavior
///
/// Usage:
/// ```dart
/// // Basic usage - just log operations
/// final listener = SimpleFormDataListener();
/// FormGearSDK.instance.setFormDataListener(listener);
///
/// // With custom handlers
/// final listener = SimpleFormDataListener(
///   onDataReceived: (data) async {
///     print('Received data for assignment: ${data.assignmentId}');
///     // Your custom logic here
///   },
///   simulateFailure: false, // Set to true to test error handling
/// );
/// FormGearSDK.instance.setFormDataListener(listener);
/// ```
class SimpleFormDataListener extends UnifiedFormDataListener {
  SimpleFormDataListener({
    this.onDataReceived,
    this.simulateFailure = false,
    this.enableFileStorage = false,
    this.storageDirectory,
  });

  /// Optional callback for when data is received
  final Future<void> Function(SaveSubmitData data)? onDataReceived;

  /// Whether to simulate failures for testing error handling
  final bool simulateFailure;

  /// Whether to save data to simple JSON files
  final bool enableFileStorage;

  /// Directory for storing JSON files (optional)
  final Directory? storageDirectory;

  @override
  Future<SaveSubmitResult> handleSaveOrSubmit(SaveSubmitData data) async {
    FormGearLogger.sdk(
      'SimpleFormDataListener: Processing ${data.engineType.displayName} '
      'save/submit for assignment ${data.assignmentId}',
    );

    try {
      // Call custom callback if provided
      if (onDataReceived != null) {
        await onDataReceived!(data);
      }

      // Simulate failure for testing
      if (simulateFailure) {
        throw Exception('Simulated failure for testing');
      }

      // Log basic information about the data
      _logDataInfo(data);

      // Optionally save to file for inspection
      if (enableFileStorage) {
        await _saveToFile(data);
      }

      // Generate a simple submission ID
      final submissionId = _generateSubmissionId(data);

      FormGearLogger.sdk(
        'SimpleFormDataListener: Successfully processed assignment ${data.assignmentId}',
      );

      return SaveSubmitResult.success(
        submissionId: submissionId,
        metadata: {
          'processor': 'SimpleFormDataListener',
          'timestamp': DateTime.now().toIso8601String(),
          'assignment_id': data.assignmentId,
          'engine_type': data.engineType.displayName,
          'flag': data.flag,
          'file_saved': enableFileStorage,
        },
      );
    } catch (e, stackTrace) {
      FormGearLogger.sdkError(
        'SimpleFormDataListener: Failed to process assignment ${data.assignmentId}: $e',
      );

      return SaveSubmitResult.fromException(e, stackTrace);
    }
  }

  @override
  Future<void> onSaveOrSubmitError(
    SaveSubmitData data,
    Object error,
    StackTrace? stackTrace,
  ) async {
    FormGearLogger.sdkError(
      'SimpleFormDataListener: Error processing assignment ${data.assignmentId}: $error',
    );

    // You can add custom error handling here, such as:
    // - Sending error reports to a crash reporting service
    // - Queuing the data for retry
    // - Showing user-friendly error messages
  }

  @override
  Future<void> onSaveOrSubmitStarted(SaveSubmitData data) async {
    FormGearLogger.sdk(
      'SimpleFormDataListener: Started processing assignment ${data.assignmentId} '
      '(${data.flag} operation)',
    );

    // You can add custom logic here, such as:
    // - Showing loading indicators
    // - Analytics tracking
    // - Pre-processing validation
  }

  @override
  Future<void> onSaveOrSubmitCompleted(
    SaveSubmitData data,
    SaveSubmitResult result,
  ) async {
    if (result.isSuccess) {
      FormGearLogger.sdk(
        'SimpleFormDataListener: Successfully completed assignment ${data.assignmentId} '
        'with submission ID: ${result.submissionId}',
      );
    } else {
      FormGearLogger.sdk(
        'SimpleFormDataListener: Failed to complete assignment ${data.assignmentId}: '
        '${result.error}',
      );
    }

    // You can add custom completion logic here, such as:
    // - Hiding loading indicators
    // - Showing success/error messages
    // - Triggering follow-up actions
  }

  /// Logs basic information about the received data
  void _logDataInfo(SaveSubmitData data) {
    FormGearLogger.sdk('Assignment Details:');
    FormGearLogger.sdk('  - Assignment ID: ${data.assignmentId}');
    FormGearLogger.sdk('  - Template ID: ${data.templateId}');
    FormGearLogger.sdk('  - Survey ID: ${data.surveyId}');
    FormGearLogger.sdk('  - Engine Type: ${data.engineType.displayName}');
    FormGearLogger.sdk('  - Operation Flag: ${data.flag}');
    FormGearLogger.sdk('  - Is Save: ${data.isSave}');
    FormGearLogger.sdk('  - Is Submit: ${data.isSubmit}');
    FormGearLogger.sdk('  - Should Encrypt: ${data.shouldEncrypt}');

    FormGearLogger.sdk('Data Sizes:');
    FormGearLogger.sdk('  - Form Data: ${data.formData.length} characters');
    FormGearLogger.sdk('  - Remark: ${data.remark.length} characters');
    FormGearLogger.sdk('  - Principal: ${data.principal.length} characters');

    if (data.isFormGear) {
      FormGearLogger.sdk(
        '  - Reference: ${data.reference?.length ?? 0} characters',
      );
      FormGearLogger.sdk('  - Media: ${data.media?.length ?? 0} characters');
    }

    FormGearLogger.sdk('Configuration:');
    FormGearLogger.sdk('  - Lookup Mode: ${data.config.lookupMode.name}');
    FormGearLogger.sdk('  - Form Mode: ${data.config.formMode.name}');
    FormGearLogger.sdk('  - Client Mode: ${data.config.clientMode.name}');
    FormGearLogger.sdk('  - Encrypted: ${data.config.isEncrypted}');
    FormGearLogger.sdk('  - Offline Capable: ${data.config.offlineCapable}');
  }

  /// Saves data to a simple JSON file for inspection
  Future<void> _saveToFile(SaveSubmitData data) async {
    try {
      // Determine storage directory
      Directory directory;
      if (storageDirectory != null) {
        directory = storageDirectory!;
      } else {
        // Use a temporary directory
        directory = Directory.systemTemp;
      }

      // Create filename with timestamp
      final timestamp = DateTime.now().millisecondsSinceEpoch;
      final filename =
          'formgear_${data.assignmentId}_${data.flag}_$timestamp.json';
      final file = File('${directory.path}/$filename');

      // Create JSON representation of the data
      final jsonData = {
        'assignment_id': data.assignmentId,
        'template_id': data.templateId,
        'survey_id': data.surveyId,
        'engine_type': data.engineType.displayName,
        'flag': data.flag,
        'timestamp': data.timestamp?.toIso8601String(),
        'config': {
          'lookup_mode': data.config.lookupMode.name,
          'form_mode': data.config.formMode.name,
          'client_mode': data.config.clientMode.name,
          'is_encrypted': data.config.isEncrypted,
          'offline_capable': data.config.offlineCapable,
        },
        'data': {
          'form_data': _tryParseJson(data.formData),
          'remark': _tryParseJson(data.remark),
          'principal': _tryParseJson(data.principal),
          if (data.reference != null)
            'reference': _tryParseJson(data.reference!),
          if (data.media != null) 'media': _tryParseJson(data.media!),
        },
        'metadata': data.metadata,
      };

      // Write to file with pretty formatting
      final prettyJson = const JsonEncoder.withIndent('  ').convert(jsonData);
      await file.writeAsString(prettyJson);

      FormGearLogger.sdk('SimpleFormDataListener: Saved data to ${file.path}');
    } catch (e) {
      FormGearLogger.sdkError(
        'SimpleFormDataListener: Failed to save to file: $e',
      );
    }
  }

  /// Tries to parse JSON string, returns original string if parsing fails
  dynamic _tryParseJson(String jsonString) {
    if (jsonString.isEmpty) return null;

    try {
      return jsonDecode(jsonString);
    } catch (e) {
      // Return original string if JSON parsing fails
      return jsonString;
    }
  }

  /// Generates a simple submission ID
  String _generateSubmissionId(SaveSubmitData data) {
    final timestamp = DateTime.now().millisecondsSinceEpoch;
    final prefix = data.isFormGear ? 'simple_fg' : 'simple_ff';
    final flag = data.flag.toLowerCase();

    return '${prefix}_${data.assignmentId}_${flag}_$timestamp';
  }
}

/// Even simpler listener that just logs everything
///
/// Perfect for debugging and understanding what data is being sent
/// from the form engines.
class LoggingOnlyFormDataListener extends UnifiedFormDataListener {
  const LoggingOnlyFormDataListener();

  @override
  Future<SaveSubmitResult> handleSaveOrSubmit(SaveSubmitData data) async {
    FormGearLogger.sdk('=== FormGear Save/Submit Data ===');
    FormGearLogger.sdk('Assignment: ${data.assignmentId}');
    FormGearLogger.sdk('Template: ${data.templateId}');
    FormGearLogger.sdk('Engine: ${data.engineType.displayName}');
    FormGearLogger.sdk('Flag: ${data.flag}');
    FormGearLogger.sdk('Form Data Length: ${data.formData.length}');
    FormGearLogger.sdk('Remark Length: ${data.remark.length}');
    FormGearLogger.sdk('Principal Length: ${data.principal.length}');

    if (data.isFormGear) {
      FormGearLogger.sdk('Reference Length: ${data.reference?.length ?? 0}');
      FormGearLogger.sdk('Media Length: ${data.media?.length ?? 0}');
    }

    FormGearLogger.sdk('================================');

    // Always return success with a simple ID
    return SaveSubmitResult.success(
      submissionId: 'logged_${DateTime.now().millisecondsSinceEpoch}',
    );
  }
}

/// Minimal listener that always fails (for testing error handling)
class FailingFormDataListener extends UnifiedFormDataListener {
  const FailingFormDataListener({
    this.errorMessage = 'Intentional failure for testing',
    this.errorCode = 'TEST_ERROR',
  });

  final String errorMessage;
  final String errorCode;

  @override
  Future<SaveSubmitResult> handleSaveOrSubmit(SaveSubmitData data) async {
    FormGearLogger.sdk(
      'FailingFormDataListener: Intentionally failing for testing',
    );

    return SaveSubmitResult.failure(
      error: errorMessage,
      errorCode: errorCode,
      metadata: {
        'assignment_id': data.assignmentId,
        'engine_type': data.engineType.displayName,
        'intentional_failure': true,
      },
    );
  }
}
