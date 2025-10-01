import 'package:flutter_test/flutter_test.dart';
import 'package:form_gear_engine_sdk/src/core/security/path_validator.dart';

void main() {
  group('PathValidator Tests', () {
    group('validate()', () {
      test('should validate valid BPS template path', () {
        const path = '/data/BPS/Template/template1/data.json';

        final result = PathValidator.validate(
          path,
          type: PathValidationType.data,
        );

        expect(result.isValid, isTrue);
        expect(result.error, isNull);
        expect(result.sanitizedPath, isNotEmpty);
      });

      test('should reject empty path', () {
        const path = '';

        final result = PathValidator.validate(path);

        expect(result.isValid, isFalse);
        expect(result.error, contains('cannot be empty'));
      });

      test('should reject path traversal with ../', () {
        const path = '/data/BPS/Template/../../../etc/passwd';

        final result = PathValidator.validate(path);

        expect(result.isValid, isFalse);
        expect(result.error, contains('traversal'));
      });

      test(r'should reject path traversal with ..\', () {
        const path = r'/data/BPS/Template/..\..\..\etc\passwd';

        final result = PathValidator.validate(path);

        expect(result.isValid, isFalse);
        expect(result.error, contains('traversal'));
      });

      test('should reject path outside allowed directories', () {
        const path = '/data/user/documents/secret.json';

        final result = PathValidator.validate(path);

        expect(result.isValid, isFalse);
        expect(result.error, contains('not within allowed'));
      });

      test('should reject invalid file extension for template type', () {
        const path = '/data/BPS/Template/template1/data.exe';

        final result = PathValidator.validate(
          path,
          type: PathValidationType.template,
        );

        expect(result.isValid, isFalse);
        expect(result.error, contains('not allowed'));
      });

      test('should accept valid media file extensions', () {
        final validExtensions = ['.jpg', '.png', '.mp4', '.mp3', '.pdf'];

        for (final ext in validExtensions) {
          final path = '/data/BPS/media/file$ext';

          final result = PathValidator.validate(
            path,
            type: PathValidationType.media,
          );

          expect(
            result.isValid,
            isTrue,
            reason: 'Extension $ext should be valid for media',
          );
        }
      });

      test('should reject double slashes', () {
        const path = '/data/BPS//Template/template1/data.json';

        final result = PathValidator.validate(path);

        expect(result.isValid, isFalse);
        expect(result.error, contains('traversal'));
      });

      test('should accept formengine path', () {
        const path = '/data/BPS/formengine/1/version.json';

        final result = PathValidator.validate(
          path,
          type: PathValidationType.data,
        );

        expect(result.isValid, isTrue);
      });

      test('should accept lookup path', () {
        const path = '/data/BPS/lookup/survey123/lookup.json';

        final result = PathValidator.validate(
          path,
          type: PathValidationType.data,
        );

        expect(result.isValid, isTrue);
      });

      test('should accept assignment path', () {
        const path = '/data/BPS/assignments/assignment123/data.json';

        final result = PathValidator.validate(
          path,
          type: PathValidationType.data,
        );

        expect(result.isValid, isTrue);
      });

      test('should accept archive files with correct type', () {
        const path = '/data/BPS/Template/template1/template.zip';

        final result = PathValidator.validate(
          path,
          type: PathValidationType.archive,
        );

        expect(result.isValid, isTrue);
      });

      test('should reject archive files without correct type', () {
        const path = '/data/BPS/Template/template1/template.zip';

        final result = PathValidator.validate(
          path,
          type: PathValidationType.data,
        );

        expect(result.isValid, isFalse);
        expect(result.error, contains('not allowed'));
      });
    });

    group('validateDirectory()', () {
      test('should validate valid BPS directory path', () {
        const path = '/data/BPS/Template/template1';

        final result = PathValidator.validateDirectory(path);

        expect(result.isValid, isTrue);
        expect(result.error, isNull);
      });

      test('should reject empty directory path', () {
        const path = '';

        final result = PathValidator.validateDirectory(path);

        expect(result.isValid, isFalse);
        expect(result.error, contains('cannot be empty'));
      });

      test('should reject directory path with traversal', () {
        const path = '/data/BPS/Template/../../etc';

        final result = PathValidator.validateDirectory(path);

        expect(result.isValid, isFalse);
        expect(result.error, contains('traversal'));
      });

      test('should reject directory outside allowed paths', () {
        const path = '/data/user/documents';

        final result = PathValidator.validateDirectory(path);

        expect(result.isValid, isFalse);
        expect(result.error, contains('not within allowed'));
      });
    });

    group('sanitizeFilename()', () {
      test('should remove path separators', () {
        const filename = 'path/to/file.txt';

        final sanitized = PathValidator.sanitizeFilename(filename);

        expect(sanitized, equals('path_to_file.txt'));
        expect(sanitized, isNot(contains('/')));
      });

      test('should remove backslashes', () {
        const filename = r'path\to\file.txt';

        final sanitized = PathValidator.sanitizeFilename(filename);

        expect(sanitized, equals('path_to_file.txt'));
        expect(sanitized, isNot(contains(r'\')));
      });

      test('should remove leading dots', () {
        const filename = '...hidden.txt';

        final sanitized = PathValidator.sanitizeFilename(filename);

        expect(sanitized, equals('hidden.txt'));
        expect(sanitized, isNot(startsWith('.')));
      });

      test('should remove null bytes', () {
        const filename = 'file\x00name.txt';

        final sanitized = PathValidator.sanitizeFilename(filename);

        expect(sanitized, equals('filename.txt'));
        expect(sanitized, isNot(contains('\x00')));
      });

      test('should remove control characters', () {
        const filename = 'file\x01\x02name.txt';

        final sanitized = PathValidator.sanitizeFilename(filename);

        expect(sanitized, equals('filename.txt'));
      });

      test('should truncate long filenames preserving extension', () {
        final longName = 'a' * 300;
        final filename = '$longName.json';

        final sanitized = PathValidator.sanitizeFilename(filename);

        expect(sanitized.length, lessThanOrEqualTo(255));
        expect(sanitized, endsWith('.json'));
      });

      test('should handle already safe filenames', () {
        const filename = 'safe_filename.txt';

        final sanitized = PathValidator.sanitizeFilename(filename);

        expect(sanitized, equals(filename));
      });
    });

    group('getAllowedExtensions()', () {
      test('should return template extensions', () {
        final extensions = PathValidator.getAllowedExtensions(
          PathValidationType.template,
        );

        expect(extensions, contains('.json'));
        expect(extensions, contains('.html'));
        expect(extensions, contains('.js'));
        expect(extensions, contains('.css'));
      });

      test('should return media extensions', () {
        final extensions = PathValidator.getAllowedExtensions(
          PathValidationType.media,
        );

        expect(extensions, contains('.jpg'));
        expect(extensions, contains('.png'));
        expect(extensions, contains('.mp4'));
        expect(extensions, contains('.mp3'));
      });

      test('should return data extensions', () {
        final extensions = PathValidator.getAllowedExtensions(
          PathValidationType.data,
        );

        expect(extensions, contains('.json'));
        expect(extensions, contains('.txt'));
      });

      test('should return archive extensions', () {
        final extensions = PathValidator.getAllowedExtensions(
          PathValidationType.archive,
        );

        expect(extensions, contains('.zip'));
        expect(extensions, contains('.7z'));
      });
    });

    group('isExtensionAllowed()', () {
      test('should check extension with dot prefix', () {
        final isAllowed = PathValidator.isExtensionAllowed(
          '.json',
          PathValidationType.data,
        );

        expect(isAllowed, isTrue);
      });

      test('should check extension without dot prefix', () {
        final isAllowed = PathValidator.isExtensionAllowed(
          'json',
          PathValidationType.data,
        );

        expect(isAllowed, isTrue);
      });

      test('should be case insensitive', () {
        final isAllowed = PathValidator.isExtensionAllowed(
          '.JSON',
          PathValidationType.data,
        );

        expect(isAllowed, isTrue);
      });

      test('should return false for disallowed extension', () {
        final isAllowed = PathValidator.isExtensionAllowed(
          '.exe',
          PathValidationType.data,
        );

        expect(isAllowed, isFalse);
      });
    });

    group('Extension Methods', () {
      test('validateAsPath should work on String', () {
        const path = '/data/BPS/Template/template1/data.json';

        final result = path.validateAsPath(type: PathValidationType.data);

        expect(result.isValid, isTrue);
      });

      test('validateAsDirectory should work on String', () {
        const path = '/data/BPS/Template/template1';

        final result = path.validateAsDirectory();

        expect(result.isValid, isTrue);
      });

      test('sanitizeAsFilename should work on String', () {
        const filename = 'path/to/file.txt';

        final sanitized = filename.sanitizeAsFilename();

        expect(sanitized, equals('path_to_file.txt'));
      });
    });

    group('PathValidationResult', () {
      test('toString should show valid result', () {
        final result = PathValidationResult.valid('/data/BPS/test.json');

        final string = result.toString();

        expect(string, contains('valid: true'));
        expect(string, contains('/data/BPS/test.json'));
      });

      test('toString should show invalid result with error', () {
        final result = PathValidationResult.invalid(
          'Test error',
          originalPath: '/bad/path',
        );

        final string = result.toString();

        expect(string, contains('valid: false'));
        expect(string, contains('Test error'));
        expect(string, contains('/bad/path'));
      });
    });

    group('PathValidationException', () {
      test('toString should include message', () {
        const exception = PathValidationException('Test error');

        final string = exception.toString();

        expect(string, contains('PathValidationException'));
        expect(string, contains('Test error'));
      });

      test('toString should include original path if provided', () {
        const exception = PathValidationException(
          'Test error',
          originalPath: '/bad/path',
        );

        final string = exception.toString();

        expect(string, contains('Test error'));
        expect(string, contains('/bad/path'));
      });
    });
  });
}
