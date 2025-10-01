import 'package:flutter_test/flutter_test.dart';
import 'package:form_gear_engine_sdk/src/core/config/form_gear_api_config.dart';

void main() {
  group('FormGearApiConfig Tests', () {
    group('Construction', () {
      test('should create config with all parameters', () {
        const config = FormGearApiConfig(
          baseUrl: 'https://api.example.com',
          formEngineEndpoint: '/api/engine/version',
          authToken: 'test-token',
          customHeaders: {'X-Custom': 'value'},
        );

        expect(config.baseUrl, equals('https://api.example.com'));
        expect(config.formEngineEndpoint, equals('/api/engine/version'));
        expect(config.authToken, equals('test-token'));
        expect(config.customHeaders, equals({'X-Custom': 'value'}));
        expect(config.isProduction, isTrue);
      });

      test('should create config with default values', () {
        const config = FormGearApiConfig();

        expect(config.baseUrl, isNull);
        expect(config.formEngineEndpoint, isNull);
        expect(config.authToken, isNull);
        expect(config.customHeaders, isEmpty);
        expect(config.isProduction, isTrue);
      });
    });

    group('Form Engine URL', () {
      test('should build form engine URL correctly', () {
        const config = FormGearApiConfig(
          baseUrl: 'https://api.example.com',
          formEngineEndpoint: '/api/engine/version',
        );

        final url = config.formEngineUrl;

        expect(url, equals('https://api.example.com/api/engine/version'));
      });

      test('should return null when base URL is missing', () {
        const config = FormGearApiConfig(
          formEngineEndpoint: '/api/engine/version',
        );

        expect(config.formEngineUrl, isNull);
      });

      test('should return null when endpoint is missing', () {
        const config = FormGearApiConfig(
          baseUrl: 'https://api.example.com',
        );

        expect(config.formEngineUrl, isNull);
      });
    });

    group('Version Check Support', () {
      test(
        'should support version check when both URL and endpoint are present',
        () {
          const config = FormGearApiConfig(
            baseUrl: 'https://api.example.com',
            formEngineEndpoint: '/api/engine/version',
          );

          expect(config.supportsFormEngineVersionCheck, isTrue);
        },
      );

      test('should not support version check without base URL', () {
        const config = FormGearApiConfig(
          formEngineEndpoint: '/api/engine/version',
        );

        expect(config.supportsFormEngineVersionCheck, isFalse);
      });

      test('should not support version check without endpoint', () {
        const config = FormGearApiConfig(
          baseUrl: 'https://api.example.com',
        );

        expect(config.supportsFormEngineVersionCheck, isFalse);
      });
    });

    group('JSON Serialization', () {
      test('should serialize to JSON correctly', () {
        const config = FormGearApiConfig(
          baseUrl: 'https://api.example.com',
          formEngineEndpoint: '/api/engine/version',
          authToken: 'test-token',
          customHeaders: {'X-Custom': 'value'},
          isProduction: false,
        );

        final json = config.toJson();

        expect(json['baseUrl'], equals('https://api.example.com'));
        expect(json['formEngineEndpoint'], equals('/api/engine/version'));
        expect(json['authToken'], equals('test-token'));
        expect(json['customHeaders'], equals({'X-Custom': 'value'}));
        expect(json['isProduction'], isFalse);
      });

      test('should deserialize from JSON correctly', () {
        final json = {
          'baseUrl': 'https://api.example.com',
          'formEngineEndpoint': '/api/engine/version',
          'authToken': 'test-token',
          'customHeaders': {'X-Custom': 'value'},
          'isProduction': false,
        };

        final config = FormGearApiConfig.fromJson(json);

        expect(config.baseUrl, equals('https://api.example.com'));
        expect(config.formEngineEndpoint, equals('/api/engine/version'));
        expect(config.authToken, equals('test-token'));
        expect(config.customHeaders, equals({'X-Custom': 'value'}));
        expect(config.isProduction, isFalse);
      });

      test('should handle null values in JSON', () {
        final json = <String, dynamic>{};
        final config = FormGearApiConfig.fromJson(json);

        expect(config.baseUrl, isNull);
        expect(config.formEngineEndpoint, isNull);
        expect(config.authToken, isNull);
      });
    });

    group('Equality', () {
      test('should be equal when all properties are the same', () {
        const config1 = FormGearApiConfig(
          baseUrl: 'https://api.example.com',
          formEngineEndpoint: '/api/engine/version',
          authToken: 'test-token',
        );

        const config2 = FormGearApiConfig(
          baseUrl: 'https://api.example.com',
          formEngineEndpoint: '/api/engine/version',
          authToken: 'test-token',
        );

        expect(config1, equals(config2));
        expect(config1.hashCode, equals(config2.hashCode));
      });

      test('should not be equal when properties differ', () {
        const config1 = FormGearApiConfig(
          baseUrl: 'https://api.example.com',
          formEngineEndpoint: '/api/engine/version',
        );

        const config2 = FormGearApiConfig(
          baseUrl: 'https://api.example.com',
          formEngineEndpoint: '/api/different/endpoint',
        );

        expect(config1, isNot(equals(config2)));
      });
    });

    group('CopyWith', () {
      test('should create a copy with updated fields', () {
        const original = FormGearApiConfig(
          baseUrl: 'https://api.example.com',
          formEngineEndpoint: '/api/engine/version',
          authToken: 'old-token',
        );

        final updated = original.copyWith(
          authToken: 'new-token',
        );

        expect(updated.baseUrl, equals(original.baseUrl));
        expect(updated.formEngineEndpoint, equals(original.formEngineEndpoint));
        expect(updated.authToken, equals('new-token'));
      });

      test('should preserve original fields when not specified', () {
        const original = FormGearApiConfig(
          baseUrl: 'https://api.example.com',
          formEngineEndpoint: '/api/engine/version',
          authToken: 'test-token',
          customHeaders: {'X-Custom': 'value'},
        );

        final updated = original.copyWith();

        expect(updated, equals(original));
      });
    });

    group('Certificate Pinning', () {
      test('should support certificate pinning configuration', () {
        const pinnedCerts = {
          'api.example.com': [
            'sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
            'sha256/BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB=',
          ],
        };

        const config = FormGearApiConfig(
          baseUrl: 'https://api.example.com',
          pinnedCertificates: pinnedCerts,
        );

        expect(config.pinnedCertificates, equals(pinnedCerts));
      });

      test('should handle null pinned certificates', () {
        const config = FormGearApiConfig(
          baseUrl: 'https://api.example.com',
        );

        expect(config.pinnedCertificates, isNull);
      });
    });
  });
}
