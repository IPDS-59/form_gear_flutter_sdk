import 'package:equatable/equatable.dart';
import 'package:json_annotation/json_annotation.dart';

part 'save_submit_result.g.dart';

/// Result model for save/submit operations returned by FormDataListener implementations
///
/// This class provides a structured way to communicate the success or failure
/// of save/submit operations back to the FormGear engines.
///
/// Based on FASIH analysis, the JavaScript engines expect:
/// - A submission ID string for successful operations
/// - Error information for failed operations
/// - Optional metadata for tracking and debugging
@JsonSerializable()
class SaveSubmitResult extends Equatable {
  const SaveSubmitResult({
    required this.isSuccess,
    this.submissionId,
    this.error,
    this.errorCode,
    this.metadata,
    this.timestamp,
  });

  /// Factory constructor from JSON
  factory SaveSubmitResult.fromJson(Map<String, dynamic> json) =>
      _$SaveSubmitResultFromJson(json);

  /// Create a successful result
  ///
  /// Usage:
  /// ```dart
  /// return SaveSubmitResult.success(
  ///   submissionId: 'form_12345_${DateTime.now().millisecondsSinceEpoch}',
  ///   metadata: {'saved_at': '/path/to/file', 'encrypted': true},
  /// );
  /// ```
  factory SaveSubmitResult.success({
    String? submissionId,
    Map<String, dynamic>? metadata,
  }) {
    return SaveSubmitResult(
      isSuccess: true,
      submissionId:
          submissionId ?? 'submission_${DateTime.now().millisecondsSinceEpoch}',
      metadata: metadata,
      timestamp: DateTime.now(),
    );
  }

  /// Create a failed result
  ///
  /// Usage:
  /// ```dart
  /// return SaveSubmitResult.failure(
  ///   error: 'Database connection failed',
  ///   errorCode: 'DB_ERROR',
  ///   metadata: {
  ///     'retry_count': 3,
  ///     'last_attempt': DateTime.now().toIso8601String()
  ///   },
  /// );
  /// ```
  factory SaveSubmitResult.failure({
    required String error,
    String? errorCode,
    Map<String, dynamic>? metadata,
  }) {
    return SaveSubmitResult(
      isSuccess: false,
      error: error,
      errorCode: errorCode,
      metadata: metadata,
      timestamp: DateTime.now(),
    );
  }

  /// Create a result from an exception
  ///
  /// Usage:
  /// ```dart
  /// try {
  ///   await saveToDatabase(data);
  ///   return SaveSubmitResult.success();
  /// } catch (e, stackTrace) {
  ///   return SaveSubmitResult.fromException(e, stackTrace);
  /// }
  /// ```
  factory SaveSubmitResult.fromException(
    Object exception, [
    StackTrace? stackTrace,
  ]) {
    return SaveSubmitResult(
      isSuccess: false,
      error: exception.toString(),
      errorCode: exception.runtimeType.toString(),
      metadata: {
        'exception_type': exception.runtimeType.toString(),
        if (stackTrace != null) 'stack_trace': stackTrace.toString(),
      },
      timestamp: DateTime.now(),
    );
  }

  /// Whether the save/submit operation was successful
  final bool isSuccess;

  /// Unique identifier for the successful submission
  ///
  /// This is returned to the JavaScript engine and can be used for:
  /// - Tracking submissions
  /// - Correlating with backend records
  /// - Generating user-friendly reference numbers
  ///
  /// Format suggestions:
  /// - 'form_{assignmentId}_{timestamp}'
  /// - 'fasih_form_{surveyId}_{sequence}'
  /// - Custom format based on your requirements
  final String? submissionId;

  /// Error message if the operation failed
  ///
  /// Should be user-friendly and descriptive, e.g.:
  /// - 'Network connection lost during save'
  /// - 'Insufficient storage space'
  /// - 'Data validation failed'
  final String? error;

  /// Error code for programmatic error handling
  ///
  /// Useful for categorizing errors and implementing retry logic:
  /// - 'NETWORK_ERROR': Network-related failures
  /// - 'STORAGE_ERROR': Storage/disk space issues
  /// - 'VALIDATION_ERROR': Data validation failures
  /// - 'PERMISSION_ERROR': File permission issues
  final String? errorCode;

  /// Additional metadata about the operation
  ///
  /// Can contain useful information for debugging and tracking:
  /// - File paths where data was saved
  /// - Database record IDs
  /// - Performance metrics
  /// - Encryption status
  /// - Retry attempts
  final Map<String, dynamic>? metadata;

  /// When this result was created
  final DateTime? timestamp;

  /// Whether the operation failed
  bool get isFailure => !isSuccess;

  /// Get the submission ID or a default value if null
  String getSubmissionId([String? defaultId]) {
    return submissionId ?? defaultId ?? 'unknown_submission';
  }

  /// Get the error message or a default value if null
  String getError([String? defaultError]) {
    return error ?? defaultError ?? 'Unknown error occurred';
  }

  /// Get a user-friendly display message
  String getDisplayMessage() {
    if (isSuccess) {
      return 'Successfully saved with ID: ${getSubmissionId()}';
    } else {
      return 'Save failed: ${getError()}';
    }
  }

  /// Get metadata value by key with optional default
  T? getMetadata<T>(String key, [T? defaultValue]) {
    final value = metadata?[key];
    if (value is T) {
      return value;
    }
    return defaultValue;
  }

  /// Check if this result indicates a retryable error
  ///
  /// Based on error codes, determines if the operation should be retried:
  /// - Network errors: retryable
  /// - Storage errors: potentially retryable
  /// - Validation errors: not retryable
  /// - Permission errors: not retryable
  bool get isRetryable {
    if (isSuccess) return false;

    final code = errorCode?.toUpperCase();
    if (code == null) return false;

    // Network issues are generally retryable
    if (code.contains('NETWORK') || code.contains('CONNECTION')) {
      return true;
    }

    // Temporary storage issues might be retryable
    if (code.contains('STORAGE') && !code.contains('FULL')) {
      return true;
    }

    // Timeout errors are retryable
    if (code.contains('TIMEOUT')) {
      return true;
    }

    // Other errors are generally not retryable
    return false;
  }

  /// Convert to JSON
  Map<String, dynamic> toJson() => _$SaveSubmitResultToJson(this);

  /// Create a copy with updated values
  SaveSubmitResult copyWith({
    bool? isSuccess,
    String? submissionId,
    String? error,
    String? errorCode,
    Map<String, dynamic>? metadata,
    DateTime? timestamp,
  }) {
    return SaveSubmitResult(
      isSuccess: isSuccess ?? this.isSuccess,
      submissionId: submissionId ?? this.submissionId,
      error: error ?? this.error,
      errorCode: errorCode ?? this.errorCode,
      metadata: metadata ?? this.metadata,
      timestamp: timestamp ?? this.timestamp,
    );
  }

  @override
  List<Object?> get props => [
    isSuccess,
    submissionId,
    error,
    errorCode,
    metadata,
    timestamp,
  ];

  @override
  String toString() {
    if (isSuccess) {
      return 'SaveSubmitResult.success(submissionId: $submissionId)';
    } else {
      return 'SaveSubmitResult.failure(error: $error, errorCode: $errorCode)';
    }
  }
}

/// Extension methods for working with SaveSubmitResult in collections
extension SaveSubmitResultExtensions on List<SaveSubmitResult> {
  /// Check if all results are successful
  bool get allSuccessful => every((result) => result.isSuccess);

  /// Check if any results failed
  bool get anyFailed => any((result) => result.isFailure);

  /// Get all successful results
  List<SaveSubmitResult> get successful =>
      where((result) => result.isSuccess).toList();

  /// Get all failed results
  List<SaveSubmitResult> get failed =>
      where((result) => result.isFailure).toList();

  /// Get all submission IDs from successful results
  List<String> get submissionIds =>
      successful.map((result) => result.getSubmissionId()).toList();

  /// Get all error messages from failed results
  List<String> get errorMessages =>
      failed.map((result) => result.getError()).toList();
}
