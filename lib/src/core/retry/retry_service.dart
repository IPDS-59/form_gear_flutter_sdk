import 'dart:async';

import 'package:form_gear_engine_sdk/src/core/errors/errors.dart';
import 'package:injectable/injectable.dart';

/// Service for handling automatic retries of failed operations
/// Implements exponential backoff strategy following FASIH reliability patterns
@LazySingleton()
class RetryService {
  /// Executes an operation with automatic retry logic
  ///
  /// [operation] - The async function to execute
  /// [maxAttempts] - Maximum number of retry attempts (default: 3)
  /// [initialDelay] - Initial delay before first retry (default: 1 second)
  /// [maxDelay] - Maximum delay between retries (default: 30 seconds)
  /// [backoffMultiplier] - Multiplier for exponential backoff (default: 2.0)
  /// [retryIf] - Optional predicate to determine if error should trigger retry
  Future<T> execute<T>({
    required Future<T> Function() operation,
    int maxAttempts = 3,
    Duration initialDelay = const Duration(seconds: 1),
    Duration maxDelay = const Duration(seconds: 30),
    double backoffMultiplier = 2.0,
    bool Function(Object error)? retryIf,
  }) async {
    var attempt = 0;
    var delay = initialDelay;

    while (true) {
      try {
        return await operation();
      } catch (e) {
        attempt++;

        // Check if we should retry this error
        final shouldRetry = retryIf?.call(e) ?? true;

        // Stop if max attempts reached or error should not be retried
        if (attempt >= maxAttempts || !shouldRetry) {
          throw RetryException(
            'Operation failed after $attempt attempt(s)',
            lastError: e,
            attempts: attempt,
          );
        }

        // Wait before next retry with exponential backoff
        await Future<void>.delayed(delay);

        // Calculate next delay with exponential backoff
        delay = Duration(
          milliseconds: (delay.inMilliseconds * backoffMultiplier).toInt(),
        );

        // Cap delay at maximum
        if (delay > maxDelay) {
          delay = maxDelay;
        }
      }
    }
  }

  /// Executes an operation with linear retry delays (no exponential backoff)
  Future<T> executeWithLinearBackoff<T>({
    required Future<T> Function() operation,
    int maxAttempts = 3,
    Duration delay = const Duration(seconds: 2),
    bool Function(Object error)? retryIf,
  }) async {
    var attempt = 0;

    while (true) {
      try {
        return await operation();
      } catch (e) {
        attempt++;

        final shouldRetry = retryIf?.call(e) ?? true;

        if (attempt >= maxAttempts || !shouldRetry) {
          throw RetryException(
            'Operation failed after $attempt attempt(s)',
            lastError: e,
            attempts: attempt,
          );
        }

        await Future<void>.delayed(delay);
      }
    }
  }

  /// Executes an operation with custom delay calculation
  Future<T> executeWithCustomBackoff<T>({
    required Future<T> Function() operation,
    required Duration Function(int attempt) delayCalculator,
    int maxAttempts = 3,
    bool Function(Object error)? retryIf,
  }) async {
    var attempt = 0;

    while (true) {
      try {
        return await operation();
      } catch (e) {
        attempt++;

        final shouldRetry = retryIf?.call(e) ?? true;

        if (attempt >= maxAttempts || !shouldRetry) {
          throw RetryException(
            'Operation failed after $attempt attempt(s)',
            lastError: e,
            attempts: attempt,
          );
        }

        final delay = delayCalculator(attempt);
        await Future<void>.delayed(delay);
      }
    }
  }

  /// Common retry predicate for network errors
  bool isNetworkError(Object error) {
    final errorString = error.toString().toLowerCase();
    return errorString.contains('socket') ||
        errorString.contains('network') ||
        errorString.contains('timeout') ||
        errorString.contains('connection');
  }

  /// Common retry predicate for temporary errors (5xx status codes)
  bool isTemporaryError(Object error) {
    final errorString = error.toString();
    return errorString.contains('500') ||
        errorString.contains('502') ||
        errorString.contains('503') ||
        errorString.contains('504');
  }

  /// Combines multiple retry predicates with OR logic
  bool Function(Object) anyOf(List<bool Function(Object)> predicates) {
    return (error) => predicates.any((predicate) => predicate(error));
  }

  /// Combines multiple retry predicates with AND logic
  bool Function(Object) allOf(List<bool Function(Object)> predicates) {
    return (error) => predicates.every((predicate) => predicate(error));
  }
}
