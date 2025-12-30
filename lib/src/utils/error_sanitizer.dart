/// Utility for sanitizing error messages before returning to JavaScript.
///
/// This prevents leaking internal implementation details like:
/// - File system paths
/// - Internal class/package names
/// - Stack traces
/// - Platform-specific error codes
class ErrorSanitizer {
  ErrorSanitizer._();

  /// Patterns that indicate internal implementation details
  static final List<RegExp> _internalPatterns = [
    // File paths (Unix and Windows)
    RegExp(r'/[a-zA-Z0-9_\-./]+\.(dart|java|swift|kt|m)'),
    RegExp(r'[A-Z]:\\[^:]+'),
    RegExp(r'/data/[^\s]+'),
    RegExp(r'/storage/[^\s]+'),
    RegExp(r'/Users/[^\s]+'),
    RegExp(r'/home/[^\s]+'),

    // Package names and class references
    RegExp(r'package:[^\s]+'),
    RegExp(r'at [a-zA-Z0-9_.]+\([^)]+\)'),

    // Stack trace line references
    RegExp(r'#\d+\s+[^\n]+'),
    RegExp(r':\d+:\d+'),

    // Platform-specific error codes
    RegExp(r'PlatformException\([^)]+\)'),
    RegExp(r'errno = \d+'),
    RegExp(r'OSError: [^\n]+'),
  ];

  /// Common error type prefixes to simplify
  static final Map<RegExp, String> _errorTypeReplacements = {
    RegExp(r'^FileSystemException:\s*'): 'File error: ',
    RegExp(r'^SocketException:\s*'): 'Network error: ',
    RegExp(r'^HttpException:\s*'): 'Network error: ',
    RegExp(r'^FormatException:\s*'): 'Invalid format: ',
    RegExp(r'^TimeoutException:\s*'): 'Operation timed out: ',
    RegExp(r'^StateError:\s*'): 'Invalid state: ',
    RegExp(r'^RangeError:\s*'): 'Invalid value: ',
    RegExp(r'^ArgumentError:\s*'): 'Invalid argument: ',
    RegExp(r'^PlatformException:\s*'): 'Platform error: ',
    RegExp(r'^MissingPluginException:\s*'): 'Feature not available: ',
    RegExp(r'^Exception:\s*'): '',
    RegExp(r'^_Exception:\s*'): '',
  };

  /// Sanitizes an error message for safe return to JavaScript.
  ///
  /// Example:
  /// ```dart
  /// try {
  ///   // code that throws
  /// } catch (e) {
  ///   final safeMessage = ErrorSanitizer.sanitize(e.toString());
  ///   return ActionInfoJs(success: false, error: safeMessage);
  /// }
  /// ```
  static String sanitize(String errorMessage) {
    var sanitized = errorMessage;

    // Remove internal patterns
    for (final pattern in _internalPatterns) {
      sanitized = sanitized.replaceAll(pattern, '');
    }

    // Simplify error type prefixes
    for (final entry in _errorTypeReplacements.entries) {
      sanitized = sanitized.replaceFirst(entry.key, entry.value);
    }

    // Clean up multiple spaces and trim
    sanitized = sanitized.replaceAll(RegExp(r'\s+'), ' ').trim();

    // If the message is empty or too short after sanitization,
    // return a generic message
    if (sanitized.isEmpty || sanitized.length < 5) {
      return 'An error occurred';
    }

    // Limit message length
    if (sanitized.length > 200) {
      sanitized = '${sanitized.substring(0, 197)}...';
    }

    return sanitized;
  }

  /// Creates a sanitized error message with a context prefix.
  ///
  /// Example:
  /// ```dart
  /// catch (e) {
  ///   return ActionInfoJs(
  ///     success: false,
  ///     error: ErrorSanitizer.sanitizeWithContext('Camera', e.toString()),
  ///   );
  /// }
  /// // Returns: "Camera error: Unable to access camera"
  /// ```
  static String sanitizeWithContext(String context, String errorMessage) {
    final sanitized = sanitize(errorMessage);
    return '$context error: $sanitized';
  }

  /// Maps common exception types to user-friendly messages.
  ///
  /// Returns null if no mapping is found (use sanitize() as fallback).
  static String? mapToFriendlyMessage(Object error) {
    final errorString = error.toString().toLowerCase();

    if (errorString.contains('permission')) {
      return 'Permission denied';
    }

    if (errorString.contains('timeout') || errorString.contains('timed out')) {
      return 'Operation timed out';
    }

    if (errorString.contains('network') ||
        errorString.contains('socket') ||
        errorString.contains('connection')) {
      return 'Network error';
    }

    if (errorString.contains('not found') ||
        errorString.contains('no such file')) {
      return 'Resource not found';
    }

    if (errorString.contains('cancelled') || errorString.contains('canceled')) {
      return 'Operation cancelled';
    }

    if (errorString.contains('disk') ||
        errorString.contains('storage') ||
        errorString.contains('space')) {
      return 'Storage error';
    }

    return null;
  }
}
