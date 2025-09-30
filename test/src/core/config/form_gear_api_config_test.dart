import 'package:flutter_test/flutter_test.dart';
import 'package:form_gear_engine_sdk/src/core/config/form_gear_api_config.dart';

void main() {
  group('FormGearApiConfig Tests', () {
    group('Construction', () {
      test('should create config with all parameters', () {
        const config = FormGearApiConfig(
          baseUrl: 'https://api.example.com',
          templateZipEndpoint: '/api/template/zip/{templateId}',
          formEngineEndpoint: '/api/engine/version',
          lookupEndpoint: '/api/lookup/{surveyId}',
          authToken: 'test-token',
          customHeaders: {'X-Custom': 'value'},
        );

        expect(config.baseUrl, equals('https://api.example.com'));
        expect(
          config.templateZipEndpoint,
          equals('/api/template/zip/{templateId}'),
        );
        expect(config.formEngineEndpoint, equals('/api/engine/version'));
        expect(config.lookupEndpoint, equals('/api/lookup/{surveyId}'));
        expect(config.authToken, equals('test-token'));
        expect(config.customHeaders, equals({'X-Custom': 'value'}));
        expect(config.isProduction, isTrue);
      });

      test('should create config with default values', () {
        const config = FormGearApiConfig();

        expect(config.baseUrl, isNull);
        expect(config.templateZipEndpoint, isNull);
        expect(config.formEngineEndpoint, isNull);
        expect(config.lookupEndpoint, isNull);
        expect(config.authToken, isNull);
        expect(config.customHeaders, isEmpty);
        expect(config.isProduction, isTrue);
      });
    });

    group('URL Builders', () {
      test('should build template ZIP URL correctly', () {
        const config = FormGearApiConfig(
          baseUrl: 'https://api.example.com',
          templateZipEndpoint: '/api/template/zip/{templateId}',
        );

        final url = config.getTemplateZipUrl('template-123');

        expect(
          url,
          equals('https://api.example.com/api/template/zip/template-123'),
        );
      });

      test('should return null for template ZIP URL when baseUrl is null', () {
        const config = FormGearApiConfig(
          templateZipEndpoint: '/api/template/zip/{templateId}',
        );

        final url = config.getTemplateZipUrl('template-123');

        expect(url, isNull);
      });

      test('should return null for template ZIP URL when endpoint is null', () {
        const config = FormGearApiConfig(
          baseUrl: 'https://api.example.com',
        );

        final url = config.getTemplateZipUrl('template-123');

        expect(url, isNull);
      });

      test('should build form engine URL correctly', () {
        const config = FormGearApiConfig(
          baseUrl: 'https://api.example.com',
          formEngineEndpoint: '/api/engine/version',
        );

        final url = config.formEngineUrl;

        expect(url, equals('https://api.example.com/api/engine/version'));
      });

      test('should return null for form engine URL when baseUrl is null', () {
        const config = FormGearApiConfig(
          formEngineEndpoint: '/api/engine/version',
        );

        final url = config.formEngineUrl;

        expect(url, isNull);
      });

      test('should return null for form engine URL when endpoint is null', () {
        const config = FormGearApiConfig(
          baseUrl: 'https://api.example.com',
        );

        final url = config.formEngineUrl;

        expect(url, isNull);
      });

      test('should build lookup URL correctly', () {
        const config = FormGearApiConfig(
          baseUrl: 'https://api.example.com',
          lookupEndpoint: '/api/lookup/{surveyId}',
        );

        final url = config.lookupUrl;

        expect(url, equals('https://api.example.com/api/lookup/{surveyId}'));
      });

      test('should return null for lookup URL when baseUrl is null', () {
        const config = FormGearApiConfig(
          lookupEndpoint: '/api/lookup/{surveyId}',
        );

        final url = config.lookupUrl;

        expect(url, isNull);
      });

      test('should return null for lookup URL when endpoint is null', () {
        const config = FormGearApiConfig(
          baseUrl: 'https://api.example.com',
        );

        final url = config.lookupUrl;

        expect(url, isNull);
      });
    });

    group('Feature Support', () {
      test('should support form engine download when URLs are provided', () {
        const config = FormGearApiConfig(
          baseUrl: 'https://api.example.com',
          formEngineEndpoint: '/api/engine/version',
        );

        expect(config.supportsFormEngineDownload, isTrue);
      });

      test(
        'should not support form engine download when baseUrl is missing',
        () {
          const config = FormGearApiConfig(
            formEngineEndpoint: '/api/engine/version',
          );

          expect(config.supportsFormEngineDownload, isFalse);
        },
      );

      test(
        'should not support form engine download when endpoint is missing',
        () {
          const config = FormGearApiConfig(
            baseUrl: 'https://api.example.com',
          );

          expect(config.supportsFormEngineDownload, isFalse);
        },
      );
    });

    group('copyWith', () {
      test('should create copy with modified baseUrl', () {
        const original = FormGearApiConfig(
          baseUrl: 'https://api.example.com',
          authToken: 'token',
        );

        final copy = original.copyWith(baseUrl: 'https://new-api.example.com');

        expect(copy.baseUrl, equals('https://new-api.example.com'));
        expect(copy.authToken, equals('token'));
      });

      test('should create copy with modified authToken', () {
        const original = FormGearApiConfig(
          baseUrl: 'https://api.example.com',
          authToken: 'old-token',
        );

        final copy = original.copyWith(authToken: 'new-token');

        expect(copy.baseUrl, equals('https://api.example.com'));
        expect(copy.authToken, equals('new-token'));
      });

      test('should create copy with modified customHeaders', () {
        const original = FormGearApiConfig(
          customHeaders: {'X-Old': 'value'},
        );

        final copy = original.copyWith(
          customHeaders: {'X-New': 'value'},
        );

        expect(copy.customHeaders, equals({'X-New': 'value'}));
      });

      test('should keep original values when not specified', () {
        const original = FormGearApiConfig(
          baseUrl: 'https://api.example.com',
          templateZipEndpoint: '/api/template/zip/{templateId}',
          formEngineEndpoint: '/api/engine/version',
          lookupEndpoint: '/api/lookup/{surveyId}',
          authToken: 'token',
          customHeaders: {'X-Custom': 'value'},
        );

        final copy = original.copyWith(authToken: 'new-token');

        expect(copy.baseUrl, equals(original.baseUrl));
        expect(copy.templateZipEndpoint, equals(original.templateZipEndpoint));
        expect(copy.formEngineEndpoint, equals(original.formEngineEndpoint));
        expect(copy.lookupEndpoint, equals(original.lookupEndpoint));
        expect(copy.authToken, equals('new-token'));
        expect(copy.customHeaders, equals(original.customHeaders));
        expect(copy.isProduction, equals(original.isProduction));
      });
    });

    group('Equality', () {
      test('should be equal when all properties match', () {
        const config1 = FormGearApiConfig(
          baseUrl: 'https://api.example.com',
          authToken: 'token',
        );
        const config2 = FormGearApiConfig(
          baseUrl: 'https://api.example.com',
          authToken: 'token',
        );

        expect(config1, equals(config2));
      });

      test('should not be equal when baseUrl differs', () {
        const config1 = FormGearApiConfig(
          baseUrl: 'https://api1.example.com',
          authToken: 'token',
        );
        const config2 = FormGearApiConfig(
          baseUrl: 'https://api2.example.com',
          authToken: 'token',
        );

        expect(config1, isNot(equals(config2)));
      });

      test('should not be equal when authToken differs', () {
        const config1 = FormGearApiConfig(
          baseUrl: 'https://api.example.com',
          authToken: 'token1',
        );
        const config2 = FormGearApiConfig(
          baseUrl: 'https://api.example.com',
          authToken: 'token2',
        );

        expect(config1, isNot(equals(config2)));
      });
    });

    group('JSON Serialization', () {
      test('should serialize to JSON', () {
        const config = FormGearApiConfig(
          baseUrl: 'https://api.example.com',
          templateZipEndpoint: '/api/template/zip/{templateId}',
          authToken: 'test-token',
        );

        final json = config.toJson();

        expect(json['baseUrl'], equals('https://api.example.com'));
        expect(
          json['templateZipEndpoint'],
          equals('/api/template/zip/{templateId}'),
        );
        expect(json['authToken'], equals('test-token'));
      });

      test('should deserialize from JSON', () {
        final json = <String, dynamic>{
          'baseUrl': 'https://api.example.com',
          'templateZipEndpoint': '/api/template/zip/{templateId}',
          'formEngineEndpoint': '/api/engine/version',
          'authToken': 'test-token',
          'isProduction': true,
        };

        final config = FormGearApiConfig.fromJson(json);

        expect(config.baseUrl, equals('https://api.example.com'));
        expect(
          config.templateZipEndpoint,
          equals('/api/template/zip/{templateId}'),
        );
        expect(config.formEngineEndpoint, equals('/api/engine/version'));
        expect(config.authToken, equals('test-token'));
        expect(config.isProduction, isTrue);
      });
    });
  });
}
