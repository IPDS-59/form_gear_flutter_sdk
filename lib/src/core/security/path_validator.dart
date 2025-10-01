import 'dart:io';

import 'package:path/path.dart' as p;

/// Security utility for validating file paths to prevent path traversal
/// and unauthorized file access.
///
/// This validator ensures that:
/// - Paths are within allowed directories (BPS directory structure)
/// - No path traversal attempts (../, symbolic links)
/// - Only allowed file extensions are accessed
/// - Paths are normalized and sanitized
class PathValidator {
  PathValidator._();

  /// Allowed base directories for file operations
  static final List<String> _allowedBaseDirs = [
    'BPS/formengine',
    'BPS/Template',
    'BPS/lookup',
    'BPS/assignments',
    'BPS/media',
  ];

  /// Allowed file extensions for different operations
  static final Map<PathValidationType, Set<String>> _allowedExtensions = {
    PathValidationType.template: {'.json', '.html', '.js', '.css'},
    PathValidationType.media: {
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.mp4',
      '.mp3',
      '.wav',
      '.pdf',
    },
    PathValidationType.data: {'.json', '.txt'},
    PathValidationType.archive: {'.zip', '.7z'},
  };

  /// Validates a file path against security policies.
  ///
  /// Returns [PathValidationResult] with validation status and sanitized path.
  ///
  /// Example:
  /// ```dart
  /// final result = PathValidator.validate(
  ///   '/storage/emulated/0/Android/data/app/files/BPS/Template/template1/data.json',
  ///   type: PathValidationType.data,
  /// );
  ///
  /// if (result.isValid) {
  ///   final file = File(result.sanitizedPath);
  ///   // Safe to use file
  /// } else {
  ///   print('Invalid path: ${result.error}');
  /// }
  /// ```
  static PathValidationResult validate(
    String path, {
    PathValidationType? type,
    bool checkExists = false,
  }) {
    // 1. Check for null or empty path
    if (path.isEmpty) {
      return PathValidationResult.invalid(
        'Path cannot be empty',
        originalPath: path,
      );
    }

    // 2. Normalize path (resolve .., ., etc.)
    final normalizedPath = p.normalize(path);

    // 3. Check for path traversal attempts
    if (_containsPathTraversal(path)) {
      return PathValidationResult.invalid(
        'Path traversal attempt detected: $path',
        originalPath: path,
      );
    }

    // 4. Check if path is within allowed directories
    if (!_isWithinAllowedDirectory(normalizedPath)) {
      return PathValidationResult.invalid(
        'Path is not within allowed directories: $normalizedPath',
        originalPath: path,
      );
    }

    // 5. Check file extension if type is specified
    if (type != null && !_hasAllowedExtension(normalizedPath, type)) {
      return PathValidationResult.invalid(
        'File extension not allowed for ${type.name}: $normalizedPath',
        originalPath: path,
      );
    }

    // 6. Check if file exists (optional)
    if (checkExists) {
      final file = File(normalizedPath);
      if (!file.existsSync()) {
        return PathValidationResult.invalid(
          'File does not exist: $normalizedPath',
          originalPath: path,
        );
      }

      // 7. Check if it's a symbolic link (security risk)
      if (_isSymbolicLink(file)) {
        return PathValidationResult.invalid(
          'Symbolic links are not allowed: $normalizedPath',
          originalPath: path,
        );
      }
    }

    return PathValidationResult.valid(normalizedPath);
  }

  /// Validates a directory path.
  static PathValidationResult validateDirectory(
    String path, {
    bool checkExists = false,
  }) {
    if (path.isEmpty) {
      return PathValidationResult.invalid(
        'Path cannot be empty',
        originalPath: path,
      );
    }

    final normalizedPath = p.normalize(path);

    if (_containsPathTraversal(path)) {
      return PathValidationResult.invalid(
        'Path traversal attempt detected: $path',
        originalPath: path,
      );
    }

    if (!_isWithinAllowedDirectory(normalizedPath)) {
      return PathValidationResult.invalid(
        'Path is not within allowed directories: $normalizedPath',
        originalPath: path,
      );
    }

    if (checkExists) {
      final dir = Directory(normalizedPath);
      if (!dir.existsSync()) {
        return PathValidationResult.invalid(
          'Directory does not exist: $normalizedPath',
          originalPath: path,
        );
      }
    }

    return PathValidationResult.valid(normalizedPath);
  }

  /// Sanitizes a filename by removing potentially dangerous characters.
  static String sanitizeFilename(String filename) {
    // Remove path separators
    var sanitized = filename.replaceAll(RegExp(r'[/\\]'), '_');

    // Remove hidden file prefix
    sanitized = sanitized.replaceAll(RegExp(r'^\.+'), '');

    // Remove null bytes
    sanitized = sanitized.replaceAll('\x00', '');

    // Remove control characters
    sanitized = sanitized.replaceAll(RegExp(r'[\x00-\x1f\x7f]'), '');

    // Limit length
    if (sanitized.length > 255) {
      final ext = p.extension(sanitized);
      final nameWithoutExt = p.basenameWithoutExtension(sanitized);
      sanitized = '${nameWithoutExt.substring(0, 255 - ext.length)}$ext';
    }

    return sanitized;
  }

  // Private helper methods

  static bool _containsPathTraversal(String path) {
    // Check for common path traversal patterns
    final patterns = [
      '../',
      r'..\',
      './',
      r'.\',
      '//',
      r'\\',
    ];

    for (final pattern in patterns) {
      if (path.contains(pattern)) {
        return true;
      }
    }

    return false;
  }

  static bool _isWithinAllowedDirectory(String path) {
    // Check if path contains any allowed base directory
    for (final allowedDir in _allowedBaseDirs) {
      if (path.contains(allowedDir)) {
        return true;
      }
    }

    return false;
  }

  static bool _hasAllowedExtension(String path, PathValidationType type) {
    final extension = p.extension(path).toLowerCase();
    final allowedExts = _allowedExtensions[type] ?? {};

    return allowedExts.contains(extension);
  }

  static bool _isSymbolicLink(File file) {
    try {
      final stat = file.statSync();
      return stat.type == FileSystemEntityType.link;
    } catch (e) {
      // If we can't determine, assume it's not a symlink
      return false;
    }
  }

  /// Gets the allowed extensions for a given validation type.
  static Set<String> getAllowedExtensions(PathValidationType type) {
    return Set.unmodifiable(_allowedExtensions[type] ?? {});
  }

  /// Checks if a file extension is allowed for a given type.
  static bool isExtensionAllowed(String extension, PathValidationType type) {
    final normalizedExt = extension.toLowerCase();
    if (!normalizedExt.startsWith('.')) {
      return _allowedExtensions[type]?.contains('.$normalizedExt') ?? false;
    }
    return _allowedExtensions[type]?.contains(normalizedExt) ?? false;
  }
}

/// Types of path validation for different operations.
enum PathValidationType {
  /// Template files (JSON, HTML, JS, CSS)
  template,

  /// Media files (images, audio, video)
  media,

  /// Data files (JSON, TXT)
  data,

  /// Archive files (ZIP, 7Z)
  archive,
}

/// Result of path validation.
class PathValidationResult {
  const PathValidationResult._({
    required this.isValid,
    required this.sanitizedPath,
    this.error,
    this.originalPath,
  });

  /// Creates a valid result with sanitized path.
  factory PathValidationResult.valid(String sanitizedPath) {
    return PathValidationResult._(
      isValid: true,
      sanitizedPath: sanitizedPath,
    );
  }

  /// Creates an invalid result with error message.
  factory PathValidationResult.invalid(
    String error, {
    required String originalPath,
  }) {
    return PathValidationResult._(
      isValid: false,
      sanitizedPath: '',
      error: error,
      originalPath: originalPath,
    );
  }

  /// Whether the path is valid.
  final bool isValid;

  /// Sanitized and normalized path (only available if valid).
  final String sanitizedPath;

  /// Error message (only available if invalid).
  final String? error;

  /// Original path that was validated.
  final String? originalPath;

  @override
  String toString() {
    if (isValid) {
      return 'PathValidationResult(valid: true, path: $sanitizedPath)';
    } else {
      return 'PathValidationResult(valid: false, error: $error, '
          'original: $originalPath)';
    }
  }
}

/// Exception thrown when path validation fails.
class PathValidationException implements Exception {
  const PathValidationException(this.message, {this.originalPath});

  final String message;
  final String? originalPath;

  @override
  String toString() {
    if (originalPath != null) {
      return 'PathValidationException: $message (path: $originalPath)';
    }
    return 'PathValidationException: $message';
  }
}

/// Extension methods for easier path validation.
extension PathValidationExtension on String {
  /// Validates this string as a file path.
  PathValidationResult validateAsPath({
    PathValidationType? type,
    bool checkExists = false,
  }) {
    return PathValidator.validate(
      this,
      type: type,
      checkExists: checkExists,
    );
  }

  /// Validates this string as a directory path.
  PathValidationResult validateAsDirectory({bool checkExists = false}) {
    return PathValidator.validateDirectory(this, checkExists: checkExists);
  }

  /// Sanitizes this string as a filename.
  String sanitizeAsFilename() {
    return PathValidator.sanitizeFilename(this);
  }
}
