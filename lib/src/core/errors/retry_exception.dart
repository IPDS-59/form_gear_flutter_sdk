/// Exception thrown when retry logic exhausts all attempts
class RetryException implements Exception {
  const RetryException(
    this.message, {
    required this.lastError,
    required this.attempts,
  });

  final String message;
  final Object lastError;
  final int attempts;

  @override
  String toString() =>
      'RetryException: $message (Last error: $lastError, Attempts: $attempts)';
}
