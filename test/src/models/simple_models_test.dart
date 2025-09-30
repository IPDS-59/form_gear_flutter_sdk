import 'package:flutter_test/flutter_test.dart';
import 'package:form_gear_engine_sdk/src/models/download_result.dart';
import 'package:form_gear_engine_sdk/src/models/prepared_engine.dart';
import 'package:form_gear_engine_sdk/src/models/validation_result.dart';
import 'package:form_gear_engine_sdk/src/models/version_state.dart';

void main() {
  group('DownloadResult Tests', () {
    group('Construction', () {
      test('should create successful result', () {
        const result = DownloadResult(
          success: true,
          localPath: '/path/to/downloaded/file',
        );

        expect(result.success, isTrue);
        expect(result.error, isNull);
        expect(result.localPath, equals('/path/to/downloaded/file'));
      });

      test('should create failed result with error', () {
        const result = DownloadResult(
          success: false,
          error: 'Network timeout',
        );

        expect(result.success, isFalse);
        expect(result.error, equals('Network timeout'));
        expect(result.localPath, isNull);
      });

      test('should create result with all parameters', () {
        const result = DownloadResult(
          success: true,
          error: null,
          localPath: '/storage/downloads/template.zip',
        );

        expect(result.success, isTrue);
        expect(result.error, isNull);
        expect(result.localPath, equals('/storage/downloads/template.zip'));
      });
    });

    group('Equality', () {
      test('should be equal when all properties match', () {
        const result1 = DownloadResult(
          success: true,
          localPath: '/path/file.zip',
        );
        const result2 = DownloadResult(
          success: true,
          localPath: '/path/file.zip',
        );

        expect(result1, equals(result2));
        expect(result1.hashCode, equals(result2.hashCode));
      });

      test('should not be equal when success differs', () {
        const result1 = DownloadResult(success: true);
        const result2 = DownloadResult(success: false);

        expect(result1, isNot(equals(result2)));
      });

      test('should not be equal when error differs', () {
        const result1 = DownloadResult(
          success: false,
          error: 'Error 1',
        );
        const result2 = DownloadResult(
          success: false,
          error: 'Error 2',
        );

        expect(result1, isNot(equals(result2)));
      });

      test('should not be equal when localPath differs', () {
        const result1 = DownloadResult(
          success: true,
          localPath: '/path1',
        );
        const result2 = DownloadResult(
          success: true,
          localPath: '/path2',
        );

        expect(result1, isNot(equals(result2)));
      });
    });

    group('toString', () {
      test('should have readable string representation', () {
        const result = DownloadResult(
          success: true,
          error: null,
          localPath: '/downloads/file.zip',
        );

        final str = result.toString();
        expect(str, contains('DownloadResult'));
        expect(str, contains('success: true'));
        expect(str, contains('error: null'));
        expect(str, contains('localPath: /downloads/file.zip'));
      });

      test('should include error in string when present', () {
        const result = DownloadResult(
          success: false,
          error: 'Connection failed',
        );

        final str = result.toString();
        expect(str, contains('success: false'));
        expect(str, contains('error: Connection failed'));
      });
    });

    group('JSON Serialization', () {
      test('should serialize to JSON', () {
        const result = DownloadResult(
          success: true,
          localPath: '/path/file.zip',
        );

        final json = result.toJson();
        expect(json['success'], isTrue);
        expect(json['localPath'], equals('/path/file.zip'));
      });

      test('should deserialize from JSON', () {
        final json = {
          'success': true,
          'error': null,
          'localPath': '/path/file.zip',
        };

        final result = DownloadResult.fromJson(json);
        expect(result.success, isTrue);
        expect(result.error, isNull);
        expect(result.localPath, equals('/path/file.zip'));
      });

      test('should handle missing optional fields in JSON', () {
        final json = {'success': false};

        final result = DownloadResult.fromJson(json);
        expect(result.success, isFalse);
        expect(result.error, isNull);
        expect(result.localPath, isNull);
      });
    });
  });

  group('PreparedEngine Tests', () {
    group('Construction', () {
      test('should create prepared engine with required fields', () {
        const engine = PreparedEngine(
          html: '<html><body>Test</body></html>',
          baseUrl: 'http://localhost:3310',
        );

        expect(engine.html, equals('<html><body>Test</body></html>'));
        expect(engine.baseUrl, equals('http://localhost:3310'));
        expect(engine.historyUrl, isNull);
      });

      test('should create prepared engine with all fields', () {
        const engine = PreparedEngine(
          html: '<html><body>FormGear</body></html>',
          baseUrl: 'http://localhost:3310/formgear',
          historyUrl: 'http://localhost:3310/formgear/history',
        );

        expect(engine.html, contains('FormGear'));
        expect(engine.baseUrl, equals('http://localhost:3310/formgear'));
        expect(
          engine.historyUrl,
          equals('http://localhost:3310/formgear/history'),
        );
      });

      test('should create engine with complex HTML', () {
        const complexHtml = '''
<!DOCTYPE html>
<html>
<head>
  <title>FormGear</title>
  <script src="formgear.js"></script>
</head>
<body>
  <div id="root"></div>
</body>
</html>
''';

        const engine = PreparedEngine(
          html: complexHtml,
          baseUrl: 'http://localhost:3310',
        );

        expect(engine.html, contains('<!DOCTYPE html>'));
        expect(engine.html, contains('formgear.js'));
      });
    });

    group('Equality', () {
      test('should be equal when all properties match', () {
        const engine1 = PreparedEngine(
          html: '<html></html>',
          baseUrl: 'http://localhost:3310',
        );
        const engine2 = PreparedEngine(
          html: '<html></html>',
          baseUrl: 'http://localhost:3310',
        );

        expect(engine1, equals(engine2));
        expect(engine1.hashCode, equals(engine2.hashCode));
      });

      test('should not be equal when html differs', () {
        const engine1 = PreparedEngine(
          html: '<html>A</html>',
          baseUrl: 'http://localhost:3310',
        );
        const engine2 = PreparedEngine(
          html: '<html>B</html>',
          baseUrl: 'http://localhost:3310',
        );

        expect(engine1, isNot(equals(engine2)));
      });

      test('should not be equal when baseUrl differs', () {
        const engine1 = PreparedEngine(
          html: '<html></html>',
          baseUrl: 'http://localhost:3310',
        );
        const engine2 = PreparedEngine(
          html: '<html></html>',
          baseUrl: 'http://localhost:8080',
        );

        expect(engine1, isNot(equals(engine2)));
      });

      test('should not be equal when historyUrl differs', () {
        const engine1 = PreparedEngine(
          html: '<html></html>',
          baseUrl: 'http://localhost:3310',
          historyUrl: '/history1',
        );
        const engine2 = PreparedEngine(
          html: '<html></html>',
          baseUrl: 'http://localhost:3310',
          historyUrl: '/history2',
        );

        expect(engine1, isNot(equals(engine2)));
      });
    });
  });

  group('ValidationResult Tests', () {
    group('Construction', () {
      test('should create valid result', () {
        const result = ValidationResult(isValid: true);

        expect(result.isValid, isTrue);
        expect(result.error, isNull);
      });

      test('should create invalid result with error', () {
        const result = ValidationResult(
          isValid: false,
          error: 'Field is required',
        );

        expect(result.isValid, isFalse);
        expect(result.error, equals('Field is required'));
      });

      test('should create result with custom error messages', () {
        const result = ValidationResult(
          isValid: false,
          error: 'Age must be between 18 and 100',
        );

        expect(result.isValid, isFalse);
        expect(result.error, contains('18 and 100'));
      });
    });

    group('Equality', () {
      test('should be equal when all properties match', () {
        const result1 = ValidationResult(isValid: true);
        const result2 = ValidationResult(isValid: true);

        expect(result1, equals(result2));
        expect(result1.hashCode, equals(result2.hashCode));
      });

      test('should not be equal when isValid differs', () {
        const result1 = ValidationResult(isValid: true);
        const result2 = ValidationResult(isValid: false);

        expect(result1, isNot(equals(result2)));
      });

      test('should not be equal when error differs', () {
        const result1 = ValidationResult(
          isValid: false,
          error: 'Error 1',
        );
        const result2 = ValidationResult(
          isValid: false,
          error: 'Error 2',
        );

        expect(result1, isNot(equals(result2)));
      });
    });

    group('Validation Scenarios', () {
      test('should validate empty field', () {
        const result = ValidationResult(
          isValid: false,
          error: 'This field cannot be empty',
        );

        expect(result.isValid, isFalse);
        expect(result.error, isNotNull);
      });

      test('should validate email format', () {
        const result = ValidationResult(
          isValid: false,
          error: 'Invalid email format',
        );

        expect(result.isValid, isFalse);
        expect(result.error, contains('email'));
      });

      test('should validate successful input', () {
        const result = ValidationResult(isValid: true);

        expect(result.isValid, isTrue);
        expect(result.error, isNull);
      });
    });
  });

  group('VersionState Tests', () {
    group('Enum Values', () {
      test('should have correct enum values', () {
        expect(VersionState.values.length, equals(3));
        expect(VersionState.values, contains(VersionState.missing));
        expect(VersionState.values, contains(VersionState.outdated));
        expect(VersionState.values, contains(VersionState.current));
      });

      test('should have correct descriptions', () {
        expect(
          VersionState.missing.description,
          equals('Form engine is not available on your device'),
        );
        expect(
          VersionState.outdated.description,
          equals('Form engine on your device is not the latest version'),
        );
        expect(
          VersionState.current.description,
          equals('Form engine on your device is the latest version'),
        );
      });
    });

    group('needsDownload getter', () {
      test('should return true for missing state', () {
        expect(VersionState.missing.needsDownload, isTrue);
      });

      test('should return true for outdated state', () {
        expect(VersionState.outdated.needsDownload, isTrue);
      });

      test('should return false for current state', () {
        expect(VersionState.current.needsDownload, isFalse);
      });
    });

    group('Switch Statements', () {
      test('should be usable in switch statements', () {
        String getAction(VersionState state) {
          switch (state) {
            case VersionState.missing:
              return 'Download required';
            case VersionState.outdated:
              return 'Update available';
            case VersionState.current:
              return 'Up to date';
          }
        }

        expect(getAction(VersionState.missing), equals('Download required'));
        expect(getAction(VersionState.outdated), equals('Update available'));
        expect(getAction(VersionState.current), equals('Up to date'));
      });
    });

    group('Equality', () {
      test('should support equality comparisons', () {
        const state1 = VersionState.missing;
        const state2 = VersionState.missing;
        const state3 = VersionState.current;

        expect(state1, equals(state2));
        expect(state1, isNot(equals(state3)));
      });
    });

    group('Real-world Scenarios', () {
      test('should determine download requirement for new installation', () {
        const state = VersionState.missing;

        expect(state.needsDownload, isTrue);
        expect(state.description, contains('not available'));
      });

      test('should determine update requirement for outdated version', () {
        const state = VersionState.outdated;

        expect(state.needsDownload, isTrue);
        expect(state.description, contains('not the latest'));
      });

      test('should confirm current version is up to date', () {
        const state = VersionState.current;

        expect(state.needsDownload, isFalse);
        expect(state.description, contains('latest version'));
      });
    });
  });
}
