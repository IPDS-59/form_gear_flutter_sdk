// Generic catches intentional for error handler utility
// ignore_for_file: avoid_catches_without_on_clauses

import 'dart:async';

import 'package:form_gear_engine_sdk/src/core/listeners/save_submit_data.dart';
import 'package:form_gear_engine_sdk/src/core/listeners/save_submit_result.dart';
import 'package:form_gear_engine_sdk/src/utils/form_gear_logger.dart';

/// Comprehensive error handling utilities for FormDataListener implementations
///
/// This class provides robust error handling patterns specifically designed
/// for save/submit operations in FormGear SDK. It includes retry logic,
/// error categorization, and recovery strategies.
class FormDataErrorHandler {
  FormDataErrorHandler({
    this.maxRetries = 3,
    this.baseDelay = const Duration(seconds: 1),
    this.maxDelay = const Duration(seconds: 30),
    this.backoffMultiplier = 2.0,
    this.enableJitter = true,
  });

  /// Maximum number of retry attempts
  final int maxRetries;

  /// Base delay between retry attempts
  final Duration baseDelay;

  /// Maximum delay between retry attempts
  final Duration maxDelay;

  /// Multiplier for exponential backoff
  final double backoffMultiplier;

  /// Whether to add random jitter to delay times
  final bool enableJitter;

  /// Executes a save/submit operation with automatic retry logic
  ///
  /// Usage:
  /// ```dart
  /// final errorHandler = FormDataErrorHandler();
  ///
  /// final result = await errorHandler.executeWithRetry(
  ///   data,
  ///   () async {
  ///     // Your save/submit logic here
  ///     await myDatabase.saveFormData(data);
  ///     return 'submission_123';
  ///   },
  /// );
  /// ```
  Future<SaveSubmitResult> executeWithRetry(
    SaveSubmitData data,
    Future<String> Function() operation,
  ) async {
    var lastError = Exception('Unknown error') as Object;
    StackTrace? lastStackTrace;

    for (var attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        FormGearLogger.sdk(
          'FormDataErrorHandler: Attempt $attempt/$maxRetries for assignment ${data.assignmentId}',
        );

        final submissionId = await operation();

        if (attempt > 1) {
          FormGearLogger.sdk(
            'FormDataErrorHandler: Operation succeeded on attempt '
            '$attempt for assignment ${data.assignmentId}',
          );
        }

        return SaveSubmitResult.success(
          submissionId: submissionId,
          metadata: {
            'retry_attempt': attempt,
            'total_attempts': maxRetries,
            'recovered': attempt > 1,
          },
        );
      } catch (e, stackTrace) {
        lastError = e;
        lastStackTrace = stackTrace;

        final errorInfo = categorizeError(e);

        FormGearLogger.sdkError(
          'FormDataErrorHandler: Attempt $attempt failed for '
          'assignment ${data.assignmentId}: ${errorInfo.category.name} - $e',
        );

        // Check if we should retry
        if (attempt < maxRetries && errorInfo.isRetryable) {
          final delay = _calculateDelay(attempt);
          FormGearLogger.sdk(
            'FormDataErrorHandler: Retrying in ${delay.inMilliseconds}ms '
            '(error category: ${errorInfo.category.name})',
          );

          await Future<void>.delayed(delay);
          continue;
        }

        // Log final failure
        if (attempt == maxRetries) {
          FormGearLogger.sdkError(
            'FormDataErrorHandler: All retry attempts exhausted for '
            'assignment ${data.assignmentId}',
          );
        } else {
          FormGearLogger.sdkError(
            'FormDataErrorHandler: Non-retryable error for '
            'assignment ${data.assignmentId}: ${errorInfo.category.name}',
          );
        }

        break;
      }
    }

    // Create failure result with error categorization
    final errorInfo = categorizeError(lastError);

    return SaveSubmitResult.failure(
      error: lastError.toString(),
      errorCode: errorInfo.code,
      metadata: {
        'error_category': errorInfo.category.name,
        'is_retryable': errorInfo.isRetryable,
        'suggested_action': errorInfo.suggestedAction,
        'total_attempts': maxRetries,
        'final_attempt_failed': true,
        'stack_trace': lastStackTrace?.toString(),
      },
    );
  }

  /// Executes an operation with timeout and proper error handling
  Future<SaveSubmitResult> executeWithTimeout(
    SaveSubmitData data,
    Future<String> Function() operation, {
    Duration timeout = const Duration(minutes: 5),
  }) async {
    try {
      final submissionId = await operation().timeout(timeout);

      return SaveSubmitResult.success(
        submissionId: submissionId,
        metadata: {
          'timeout_seconds': timeout.inSeconds,
          'completed_in_time': true,
        },
      );
    } on TimeoutException {
      FormGearLogger.sdkError(
        'FormDataErrorHandler: Operation timed out after '
        '${timeout.inSeconds}s for assignment ${data.assignmentId}',
      );

      return SaveSubmitResult.failure(
        error: 'Operation timed out after ${timeout.inSeconds} seconds',
        errorCode: 'TIMEOUT_ERROR',
        metadata: {
          'timeout_seconds': timeout.inSeconds,
          'assignment_id': data.assignmentId,
        },
      );
    } catch (e, stackTrace) {
      FormGearLogger.sdkError(
        'FormDataErrorHandler: Operation failed for '
        'assignment ${data.assignmentId}: $e',
      );

      return SaveSubmitResult.fromException(e, stackTrace);
    }
  }

  /// Combines retry logic with timeout handling
  Future<SaveSubmitResult> executeWithRetryAndTimeout(
    SaveSubmitData data,
    Future<String> Function() operation, {
    Duration timeout = const Duration(minutes: 2),
  }) async {
    return executeWithRetry(
      data,
      () => operation().timeout(timeout),
    );
  }

  /// Categorizes errors to determine retry strategy and user messaging
  ErrorInfo categorizeError(Object error) {
    final errorString = error.toString().toLowerCase();

    // Network errors - usually retryable
    if (errorString.contains('connection') ||
        errorString.contains('network') ||
        errorString.contains('socket')) {
      return const ErrorInfo(
        category: ErrorCategory.network,
        code: 'NETWORK_ERROR',
        isRetryable: true,
        suggestedAction: 'Check internet connection and retry',
      );
    }

    // Timeout errors - retryable
    if (errorString.contains('timeout') || errorString.contains('timed out')) {
      return const ErrorInfo(
        category: ErrorCategory.timeout,
        code: 'TIMEOUT_ERROR',
        isRetryable: true,
        suggestedAction:
            'Operation took too long, retrying with longer timeout',
      );
    }

    // Storage/disk errors - may be retryable
    if (errorString.contains('disk') ||
        errorString.contains('storage') ||
        errorString.contains('space')) {
      final isRetryable =
          !errorString.contains('full') && !errorString.contains('no space');
      return ErrorInfo(
        category: ErrorCategory.storage,
        code: 'STORAGE_ERROR',
        isRetryable: isRetryable,
        suggestedAction: isRetryable
            ? 'Temporary storage issue, retrying'
            : 'Free up storage space and try again',
      );
    }

    // Permission errors - not retryable
    if (errorString.contains('permission') ||
        errorString.contains('access denied') ||
        errorString.contains('unauthorized')) {
      return const ErrorInfo(
        category: ErrorCategory.permission,
        code: 'PERMISSION_ERROR',
        isRetryable: false,
        suggestedAction: 'Check file permissions or app permissions',
      );
    }

    // Database errors - may be retryable
    if (errorString.contains('database') ||
        errorString.contains('sql') ||
        errorString.contains('locked') ||
        errorString.contains('busy')) {
      final isRetryable =
          errorString.contains('locked') || errorString.contains('busy');
      return ErrorInfo(
        category: ErrorCategory.database,
        code: 'DATABASE_ERROR',
        isRetryable: isRetryable,
        suggestedAction: isRetryable
            ? 'Database temporarily busy, retrying'
            : 'Database error, check data integrity',
      );
    }

    // Validation errors - not retryable
    if (errorString.contains('validation') ||
        errorString.contains('invalid') ||
        errorString.contains('malformed')) {
      return const ErrorInfo(
        category: ErrorCategory.validation,
        code: 'VALIDATION_ERROR',
        isRetryable: false,
        suggestedAction: 'Fix data validation errors and try again',
      );
    }

    // Encryption errors - not retryable
    if (errorString.contains('encrypt') ||
        errorString.contains('decrypt') ||
        errorString.contains('cipher')) {
      return const ErrorInfo(
        category: ErrorCategory.encryption,
        code: 'ENCRYPTION_ERROR',
        isRetryable: false,
        suggestedAction: 'Check encryption configuration',
      );
    }

    // Unknown errors - not retryable by default for safety
    return const ErrorInfo(
      category: ErrorCategory.unknown,
      code: 'UNKNOWN_ERROR',
      isRetryable: false,
      suggestedAction: 'Unknown error occurred, check logs for details',
    );
  }

  /// Calculates delay for exponential backoff with optional jitter
  Duration _calculateDelay(int attempt) {
    // Calculate exponential backoff delay
    var delay =
        baseDelay.inMilliseconds * (backoffMultiplier * (attempt - 1)).round();

    // Apply maximum delay limit
    if (delay > maxDelay.inMilliseconds) {
      delay = maxDelay.inMilliseconds;
    }

    // Add jitter to avoid thundering herd problem
    if (enableJitter) {
      final jitter =
          (delay * 0.1 * (DateTime.now().millisecondsSinceEpoch % 100) / 100)
              .round();
      delay += jitter;
    }

    return Duration(milliseconds: delay);
  }

  /// Creates a circuit breaker pattern for preventing cascade failures
  CircuitBreaker createCircuitBreaker({
    int failureThreshold = 5,
    Duration timeout = const Duration(minutes: 1),
  }) {
    return CircuitBreaker(
      failureThreshold: failureThreshold,
      timeout: timeout,
    );
  }
}

/// Information about an error including categorization and retry strategy
class ErrorInfo {
  const ErrorInfo({
    required this.category,
    required this.code,
    required this.isRetryable,
    required this.suggestedAction,
  });

  final ErrorCategory category;
  final String code;
  final bool isRetryable;
  final String suggestedAction;
}

/// Categories of errors for proper handling
enum ErrorCategory {
  network,
  timeout,
  storage,
  permission,
  database,
  validation,
  encryption,
  unknown,
}

/// Simple circuit breaker implementation to prevent cascade failures
class CircuitBreaker {
  CircuitBreaker({
    required this.failureThreshold,
    required this.timeout,
  });

  final int failureThreshold;
  final Duration timeout;

  int _failureCount = 0;
  DateTime? _lastFailureTime;
  bool _isOpen = false;

  /// Executes operation with circuit breaker protection
  Future<T> execute<T>(Future<T> Function() operation) async {
    // Check if circuit is open and should remain open
    if (_isOpen) {
      if (_lastFailureTime != null &&
          DateTime.now().difference(_lastFailureTime!) < timeout) {
        throw Exception('Circuit breaker is open - too many recent failures');
      } else {
        // Try to close circuit (half-open state)
        _isOpen = false;
        FormGearLogger.sdk('Circuit breaker moving to half-open state');
      }
    }

    try {
      final result = await operation();

      // Success - reset failure count
      if (_failureCount > 0) {
        _failureCount = 0;
        FormGearLogger.sdk('Circuit breaker reset - operation succeeded');
      }

      return result;
    } catch (e) {
      _failureCount++;
      _lastFailureTime = DateTime.now();

      // Open circuit if failure threshold reached
      if (_failureCount >= failureThreshold) {
        _isOpen = true;
        FormGearLogger.sdkError(
          'Circuit breaker opened - failure threshold '
          '($failureThreshold) reached',
        );
      }

      rethrow;
    }
  }

  /// Checks if circuit breaker is currently open
  bool get isOpen => _isOpen;

  /// Gets current failure count
  int get failureCount => _failureCount;

  /// Manually resets the circuit breaker
  void reset() {
    _failureCount = 0;
    _lastFailureTime = null;
    _isOpen = false;
    FormGearLogger.sdk('Circuit breaker manually reset');
  }
}
