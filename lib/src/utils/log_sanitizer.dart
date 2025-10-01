/// Utility for sanitizing sensitive data from log messages to prevent PII leakage.
///
/// This class provides methods to redact personally identifiable information (PII)
/// and sensitive data from log messages before they are written to logs.
///
/// Use this in production to prevent sensitive information from appearing in
/// crash reports, analytics, or log aggregation services.
class LogSanitizer {
  /// Patterns for detecting sensitive data in log messages.
  static final Map<String, RegExp> _sensitivePatterns = {
    // Indonesian identity numbers (NIK - 16 digits)
    'nik': RegExp(r'\b\d{16}\b'),

    // Phone numbers (various formats)
    'phone': RegExp(
      r'\b(?:\+62|62|0)(?:\d{2,3})[-\s]?\d{3,4}[-\s]?\d{3,4}\b',
    ),

    // Email addresses
    'email': RegExp(
      r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
    ),

    // Credit card numbers (basic pattern)
    'creditCard': RegExp(r'\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b'),

    // Passport numbers (various formats)
    'passport': RegExp(r'\b[A-Z]{1,2}\d{6,9}\b'),

    // IP addresses
    'ip': RegExp(r'\b(?:\d{1,3}\.){3}\d{1,3}\b'),

    // JWT tokens (basic pattern)
    'jwt': RegExp(
      r'eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+',
    ),

    // API keys (common patterns)
    'apiKey': RegExp(r'\b[A-Za-z0-9]{32,}\b'),

    // Passwords in URLs or JSON
    'password': RegExp(
      r'(?:password|pwd|pass)["\s:=]+[^\s&"]+',
      caseSensitive: false,
    ),

    // Authorization headers
    'authHeader': RegExp(r'(?:Bearer|Basic)\s+[A-Za-z0-9+/=]+'),
  };

  /// Fields that should always be redacted in JSON/form data.
  static final Set<String> _sensitiveFields = {
    'password',
    'pwd',
    'pass',
    'secret',
    'token',
    'apiKey',
    'api_key',
    'auth',
    'authorization',
    'nik',
    'ktp',
    'identity',
    'identityNumber',
    'identitas',
    'phone',
    'phoneNumber',
    'telp',
    'telepon',
    'email',
    'emailAddress',
    'address',
    'alamat',
    'name',
    'nama',
    'namaLengkap',
    'fullName',
    'creditCard',
    'cardNumber',
    'cvv',
    'pin',
    'passport',
    'paspor',
    'latitude',
    'longitude',
    'lat',
    'lng',
    'location',
    'lokasi',
  };

  /// Sanitizes a log message by redacting sensitive information.
  ///
  /// Example:
  /// ```dart
  /// final sanitized = LogSanitizer.sanitize(
  ///   'User NIK: 1234567890123456, Phone: +62812345678',
  /// );
  /// // Output: "User NIK: [REDACTED_NIK], Phone: [REDACTED_PHONE]"
  /// ```
  static String sanitize(String message, {bool enableInDebug = false}) {
    // In debug mode, optionally allow unsanitized logs for development
    if (!enableInDebug && _isDebugMode()) {
      return message;
    }

    var sanitized = message;

    // Apply pattern-based redaction
    _sensitivePatterns.forEach((type, pattern) {
      sanitized = sanitized.replaceAllMapped(
        pattern,
        (match) => '[REDACTED_${type.toUpperCase()}]',
      );
    });

    return sanitized;
  }

  /// Sanitizes a Map (e.g., JSON data, form data) by redacting sensitive fields.
  ///
  /// Example:
  /// ```dart
  /// final data = {'name': 'John', 'nik': '1234567890123456', 'age': 30};
  /// final sanitized = LogSanitizer.sanitizeMap(data);
  /// // Output: {'name': '[REDACTED]', 'nik': '[REDACTED]', 'age': 30}
  /// ```
  static Map<String, dynamic> sanitizeMap(
    Map<String, dynamic> data, {
    bool enableInDebug = false,
  }) {
    if (!enableInDebug && _isDebugMode()) {
      return data;
    }

    final sanitized = <String, dynamic>{};

    data.forEach((key, value) {
      final lowerKey = key.toLowerCase();

      // Check if field name is sensitive
      if (_sensitiveFields.any(lowerKey.contains)) {
        sanitized[key] = '[REDACTED]';
      } else if (value is Map<String, dynamic>) {
        // Recursively sanitize nested maps
        sanitized[key] = sanitizeMap(value, enableInDebug: enableInDebug);
      } else if (value is List) {
        // Sanitize lists
        sanitized[key] = _sanitizeList(value, enableInDebug: enableInDebug);
      } else if (value is String) {
        // Sanitize string values with pattern matching
        sanitized[key] = sanitize(value, enableInDebug: enableInDebug);
      } else {
        // Keep non-sensitive values as-is
        sanitized[key] = value;
      }
    });

    return sanitized;
  }

  /// Sanitizes a List by recursively sanitizing its elements.
  static List<dynamic> _sanitizeList(
    List<dynamic> list, {
    required bool enableInDebug,
  }) {
    return list.map((item) {
      if (item is Map<String, dynamic>) {
        return sanitizeMap(item, enableInDebug: enableInDebug);
      } else if (item is List) {
        return _sanitizeList(item, enableInDebug: enableInDebug);
      } else if (item is String) {
        return sanitize(item, enableInDebug: enableInDebug);
      } else {
        return item;
      }
    }).toList();
  }

  /// Checks if currently running in debug mode.
  static bool _isDebugMode() {
    var isDebug = false;
    assert(() {
      isDebug = true;
      return true;
    }());
    return isDebug;
  }

  /// Adds a custom sensitive pattern for redaction.
  ///
  /// Useful for application-specific sensitive data patterns.
  ///
  /// Example:
  /// ```dart
  /// LogSanitizer.addSensitivePattern(
  ///   'customId',
  ///   RegExp(r'CUSTOM-\d{8}'),
  /// );
  /// ```
  static void addSensitivePattern(String name, RegExp pattern) {
    _sensitivePatterns[name] = pattern;
  }

  /// Adds a custom sensitive field name for map redaction.
  ///
  /// Example:
  /// ```dart
  /// LogSanitizer.addSensitiveField('socialSecurityNumber');
  /// ```
  static void addSensitiveField(String fieldName) {
    _sensitiveFields.add(fieldName.toLowerCase());
  }

  /// Removes a sensitive pattern.
  static void removeSensitivePattern(String name) {
    _sensitivePatterns.remove(name);
  }

  /// Removes a sensitive field name.
  static void removeSensitiveField(String fieldName) {
    _sensitiveFields.remove(fieldName.toLowerCase());
  }

  /// Gets all registered sensitive patterns.
  static Map<String, RegExp> get sensitivePatterns =>
      Map.unmodifiable(_sensitivePatterns);

  /// Gets all registered sensitive field names.
  static Set<String> get sensitiveFields => Set.unmodifiable(_sensitiveFields);

  /// Sanitizes an error message and stack trace.
  ///
  /// Example:
  /// ```dart
  /// try {
  ///   // code that throws
  /// } catch (e, stackTrace) {
  ///   final sanitized = LogSanitizer.sanitizeError(e.toString(), stackTrace);
  ///   logger.error(sanitized.message, stackTrace: sanitized.stackTrace);
  /// }
  /// ```
  static SanitizedError sanitizeError(
    String errorMessage,
    StackTrace? stackTrace, {
    bool enableInDebug = false,
  }) {
    final sanitizedMessage = sanitize(
      errorMessage,
      enableInDebug: enableInDebug,
    );

    String? sanitizedStackTrace;
    if (stackTrace != null) {
      sanitizedStackTrace = sanitize(
        stackTrace.toString(),
        enableInDebug: enableInDebug,
      );
    }

    return SanitizedError(
      message: sanitizedMessage,
      stackTrace: sanitizedStackTrace,
    );
  }

  /// Partially redacts a value, showing only first/last characters.
  ///
  /// Useful for debugging while still protecting sensitive data.
  ///
  /// Example:
  /// ```dart
  /// LogSanitizer.partialRedact('1234567890123456', showFirst: 4, showLast: 4);
  /// // Output: "1234********3456"
  /// ```
  static String partialRedact(
    String value, {
    int showFirst = 4,
    int showLast = 4,
    String redactionChar = '*',
  }) {
    if (value.length <= showFirst + showLast) {
      return redactionChar * value.length;
    }

    final first = value.substring(0, showFirst);
    final last = value.substring(value.length - showLast);
    final middleLength = value.length - showFirst - showLast;
    final middle = redactionChar * middleLength;

    return '$first$middle$last';
  }
}

/// Result of error sanitization containing sanitized message and stack trace.
class SanitizedError {
  const SanitizedError({
    required this.message,
    this.stackTrace,
  });

  final String message;
  final String? stackTrace;

  @override
  String toString() {
    if (stackTrace != null) {
      return '$message\nStack trace:\n$stackTrace';
    }
    return message;
  }
}
