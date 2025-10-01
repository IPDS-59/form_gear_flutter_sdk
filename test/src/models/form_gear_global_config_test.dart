import 'package:flutter_test/flutter_test.dart';
import 'package:form_gear_engine_sdk/src/core/config/form_gear_api_config.dart';
import 'package:form_gear_engine_sdk/src/core/config/form_gear_client_mode.dart';
import 'package:form_gear_engine_sdk/src/core/config/form_gear_form_mode.dart';
import 'package:form_gear_engine_sdk/src/core/config/form_gear_lookup_mode.dart';
import 'package:form_gear_engine_sdk/src/models/assignment_context.dart';
import 'package:form_gear_engine_sdk/src/models/bps_user.dart';
import 'package:form_gear_engine_sdk/src/models/form_gear_global_config.dart';

void main() {
  group('FormGearGlobalConfig Tests', () {
    group('Construction', () {
      test('should create config with all parameters', () {
        const apiConfig = FormGearApiConfig(
          baseUrl: 'https://api.example.com',
        );
        const bpsUser = BpsUser(nipBaru: '123456789');
        final assignmentConfig = AssignmentConfig.capi();

        final config = FormGearGlobalConfig(
          apiConfig: apiConfig,
          bpsUser: bpsUser,
          username: 'testuser',
          serverPort: 8080,
          enableDebugMode: true,
          enableLogging: false,
          defaultAssignmentConfig: assignmentConfig,
        );

        expect(config.apiConfig, equals(apiConfig));
        expect(config.bpsUser, equals(bpsUser));
        expect(config.username, equals('testuser'));
        expect(config.autoStartServer, isTrue);
        expect(config.serverPort, equals(8080));
        expect(config.enableDebugMode, isTrue);
        expect(config.enableLogging, isFalse);
        expect(config.defaultAssignmentConfig, equals(assignmentConfig));
      });

      test('should create config with default values', () {
        const config = FormGearGlobalConfig(
          apiConfig: FormGearApiConfig(),
        );

        expect(config.apiConfig, isNotNull);
        expect(config.bpsUser, isNull);
        expect(config.username, isNull);
        expect(config.autoStartServer, isTrue);
        expect(config.serverPort, equals(3310));
        expect(config.enableDebugMode, isFalse);
        expect(config.enableLogging, isTrue);
        expect(config.defaultAssignmentConfig, isNull);
      });
    });

    group('Factory Constructors', () {
      test('should create FASIH config with debug disabled', () {
        const apiConfig = FormGearApiConfig(
          baseUrl: 'https://fasih.bps.go.id',
        );
        const bpsUser = BpsUser(
          nipBaru: '123456789',
          jabatan: 'ENUMERATOR',
        );

        final config = FormGearGlobalConfig.fasih(
          apiConfig: apiConfig,
          bpsUser: bpsUser,
        );

        expect(config.apiConfig, equals(apiConfig));
        expect(config.bpsUser, equals(bpsUser));
        expect(config.username, equals(bpsUser.name));
        expect(config.enableDebugMode, isFalse);
        expect(config.enableLogging, isTrue);
        expect(config.defaultAssignmentConfig, isA<AssignmentConfig>());
        expect(
          config.defaultAssignmentConfig?.clientMode,
          equals(FormGearClientMode.capi),
        );
      });

      test('should create FASIH config with debug enabled', () {
        const apiConfig = FormGearApiConfig(
          baseUrl: 'https://fasih.bps.go.id',
        );
        const bpsUser = BpsUser(nipBaru: '123456789');

        final config = FormGearGlobalConfig.fasih(
          apiConfig: apiConfig,
          bpsUser: bpsUser,
          enableDebugMode: true,
        );

        expect(config.enableDebugMode, isTrue);
        expect(config.enableLogging, isFalse); // Disabled in production
      });

      test('should create FASIH config with custom username', () {
        const apiConfig = FormGearApiConfig(
          baseUrl: 'https://fasih.bps.go.id',
        );
        const bpsUser = BpsUser(nipBaru: '123456789');

        final config = FormGearGlobalConfig.fasih(
          apiConfig: apiConfig,
          bpsUser: bpsUser,
          username: 'custom_user',
        );

        expect(config.username, equals('custom_user'));
      });

      test('should create development config', () {
        final config = FormGearGlobalConfig.development();

        expect(config.apiConfig, isNull);
        expect(config.bpsUser, isNull);
        expect(config.username, equals('Developer'));
        expect(config.enableDebugMode, isTrue);
        expect(config.defaultAssignmentConfig, isA<AssignmentConfig>());
        expect(
          config.defaultAssignmentConfig?.clientMode,
          equals(FormGearClientMode.test),
        );
      });

      test('should create development config with custom values', () {
        const apiConfig = FormGearApiConfig(
          baseUrl: 'http://localhost:8080',
        );
        const bpsUser = BpsUser(nipBaru: 'DEV123');

        final config = FormGearGlobalConfig.development(
          apiConfig: apiConfig,
          bpsUser: bpsUser,
          username: 'TestDeveloper',
        );

        expect(config.apiConfig, equals(apiConfig));
        expect(config.bpsUser, equals(bpsUser));
        expect(config.username, equals('TestDeveloper'));
      });
    });

    group('copyWith', () {
      test('should create copy with modified apiConfig', () {
        const originalApiConfig = FormGearApiConfig(
          baseUrl: 'https://api1.example.com',
        );
        const newApiConfig = FormGearApiConfig(
          baseUrl: 'https://api2.example.com',
        );

        const original = FormGearGlobalConfig(apiConfig: originalApiConfig);
        final copy = original.copyWith(apiConfig: newApiConfig);

        expect(copy.apiConfig, equals(newApiConfig));
        expect(copy.apiConfig, isNot(equals(originalApiConfig)));
      });

      test('should create copy with modified bpsUser', () {
        const originalUser = BpsUser(nipBaru: '111111111');
        const newUser = BpsUser(nipBaru: '222222222');

        const original = FormGearGlobalConfig(
          apiConfig: FormGearApiConfig(),
          bpsUser: originalUser,
        );
        final copy = original.copyWith(bpsUser: newUser);

        expect(copy.bpsUser, equals(newUser));
      });

      test('should create copy with modified server settings', () {
        const original = FormGearGlobalConfig(
          apiConfig: FormGearApiConfig(),
        );

        final copy = original.copyWith(
          autoStartServer: false,
          serverPort: 8080,
        );

        expect(copy.autoStartServer, isFalse);
        expect(copy.serverPort, equals(8080));
      });

      test('should keep original values when not specified', () {
        const apiConfig = FormGearApiConfig(
          baseUrl: 'https://api.example.com',
        );
        const bpsUser = BpsUser(nipBaru: '123456789');
        final assignmentConfig = AssignmentConfig.capi();

        final original = FormGearGlobalConfig(
          apiConfig: apiConfig,
          bpsUser: bpsUser,
          username: 'original',
          defaultAssignmentConfig: assignmentConfig,
        );

        final copy = original.copyWith(username: 'updated');

        expect(copy.apiConfig, equals(original.apiConfig));
        expect(copy.bpsUser, equals(original.bpsUser));
        expect(copy.username, equals('updated'));
        expect(copy.serverPort, equals(original.serverPort));
        expect(
          copy.defaultAssignmentConfig,
          equals(original.defaultAssignmentConfig),
        );
      });
    });

    group('toLegacyConfig', () {
      test('should convert to legacy config with default assignment', () {
        const apiConfig = FormGearApiConfig(
          baseUrl: 'https://api.example.com',
        );
        const bpsUser = BpsUser(nipBaru: '123456789');
        final assignmentConfig = AssignmentConfig.capi();

        final globalConfig = FormGearGlobalConfig(
          apiConfig: apiConfig,
          bpsUser: bpsUser,
          username: 'testuser',
          serverPort: 8080,
          defaultAssignmentConfig: assignmentConfig,
        );

        final legacyConfig = globalConfig.toLegacyConfig();

        expect(legacyConfig.apiConfig, equals(apiConfig));
        expect(legacyConfig.bpsUser, equals(bpsUser));
        expect(legacyConfig.username, equals('testuser'));
        expect(legacyConfig.autoStartServer, isTrue);
        expect(legacyConfig.serverPort, equals(8080));
        expect(legacyConfig.lookupMode, equals(FormGearLookupMode.offline));
        expect(legacyConfig.formMode, equals(FormGearFormMode.open));
        expect(legacyConfig.clientMode, equals(FormGearClientMode.capi));
      });

      test('should convert with custom assignment config', () {
        const globalConfig = FormGearGlobalConfig(
          apiConfig: FormGearApiConfig(),
          username: 'testuser',
        );

        final customAssignment = AssignmentConfig.cawi();
        final legacyConfig = globalConfig.toLegacyConfig(
          assignmentConfig: customAssignment,
        );

        expect(legacyConfig.lookupMode, equals(FormGearLookupMode.online));
        expect(legacyConfig.formMode, equals(FormGearFormMode.open));
        expect(legacyConfig.clientMode, equals(FormGearClientMode.cawi));
      });

      test('should use defaults when no assignment config provided', () {
        const globalConfig = FormGearGlobalConfig(
          apiConfig: FormGearApiConfig(),
        );

        final legacyConfig = globalConfig.toLegacyConfig();

        expect(legacyConfig.username, equals('DefaultUser'));
        expect(legacyConfig.lookupMode, equals(FormGearLookupMode.offline));
        expect(legacyConfig.formMode, equals(FormGearFormMode.open));
        expect(legacyConfig.clientMode, equals(FormGearClientMode.capi));
        expect(legacyConfig.lookupKey, equals('key%5B%5D'));
        expect(legacyConfig.lookupValue, equals('value%5B%5D'));
        expect(legacyConfig.htmlLogPrefix, equals('FORMGEAR_HTML'));
        expect(legacyConfig.sdkLogPrefix, equals('FORMGEAR_SDK'));
      });
    });

    group('Equality', () {
      test('should be equal when all properties match', () {
        const apiConfig = FormGearApiConfig(
          baseUrl: 'https://api.example.com',
        );
        const bpsUser = BpsUser(nipBaru: '123456789');

        const config1 = FormGearGlobalConfig(
          apiConfig: apiConfig,
          bpsUser: bpsUser,
          username: 'testuser',
        );
        const config2 = FormGearGlobalConfig(
          apiConfig: apiConfig,
          bpsUser: bpsUser,
          username: 'testuser',
        );

        expect(config1, equals(config2));
      });

      test('should not be equal when apiConfig differs', () {
        const apiConfig1 = FormGearApiConfig(
          baseUrl: 'https://api1.example.com',
        );
        const apiConfig2 = FormGearApiConfig(
          baseUrl: 'https://api2.example.com',
        );

        const config1 = FormGearGlobalConfig(apiConfig: apiConfig1);
        const config2 = FormGearGlobalConfig(apiConfig: apiConfig2);

        expect(config1, isNot(equals(config2)));
      });

      test('should not be equal when bpsUser differs', () {
        const user1 = BpsUser(nipBaru: '111111111');
        const user2 = BpsUser(nipBaru: '222222222');

        const config1 = FormGearGlobalConfig(
          apiConfig: FormGearApiConfig(),
          bpsUser: user1,
        );
        const config2 = FormGearGlobalConfig(
          apiConfig: FormGearApiConfig(),
          bpsUser: user2,
        );

        expect(config1, isNot(equals(config2)));
      });
    });

    group('JSON Serialization', () {
      test('should serialize to JSON', () {
        const apiConfig = FormGearApiConfig(
          baseUrl: 'https://api.example.com',
        );
        const bpsUser = BpsUser(nipBaru: '123456789');

        const config = FormGearGlobalConfig(
          apiConfig: apiConfig,
          bpsUser: bpsUser,
          username: 'testuser',
          autoStartServer: false,
          serverPort: 8080,
          enableDebugMode: true,
        );

        final json = config.toJson();

        expect(json['apiConfig'], isNotNull);
        expect(json['bpsUser'], isNotNull);
        expect(json['username'], equals('testuser'));
        expect(json['autoStartServer'], isFalse);
        expect(json['serverPort'], equals(8080));
        expect(json['enableDebugMode'], isTrue);
      });

      test('should deserialize from JSON', () {
        final json = <String, dynamic>{
          'apiConfig': <String, dynamic>{
            'baseUrl': 'https://api.example.com',
            'isProduction': true,
            'customHeaders': <String, dynamic>{},
          },
          'bpsUser': <String, dynamic>{
            'id': 12345,
            'nipBaru': '123456789',
            'jabatan': 'ENUMERATOR',
          },
          'username': 'testuser',
          'autoStartServer': false,
          'serverPort': 8080,
          'enableDebugMode': true,
          'enableLogging': false,
        };

        final config = FormGearGlobalConfig.fromJson(json);

        expect(config.apiConfig?.baseUrl, equals('https://api.example.com'));
        expect(config.bpsUser?.nipBaru, equals('123456789'));
        expect(config.username, equals('testuser'));
        expect(config.autoStartServer, isFalse);
        expect(config.serverPort, equals(8080));
        expect(config.enableDebugMode, isTrue);
        expect(config.enableLogging, isFalse);
      });
    });

    group('FASIH Integration Scenarios', () {
      test('should configure for FASIH production environment', () {
        const apiConfig = FormGearApiConfig(
          baseUrl: 'https://fasih-api.bps.go.id',
          authToken: 'prod-token',
        );
        const bpsUser = BpsUser(
          bpsUserId: 1001,
          nipBaru: '199012345678',
          jabatan: 'ENUMERATOR',
          org: 'BPS Provinsi Jawa Barat',
        );

        final config = FormGearGlobalConfig.fasih(
          apiConfig: apiConfig,
          bpsUser: bpsUser,
        );

        expect(config.apiConfig?.baseUrl, contains('fasih-api.bps.go.id'));
        expect(config.apiConfig?.isProduction, isTrue);
        expect(config.bpsUser?.position, equals('ENUMERATOR'));
        expect(config.enableDebugMode, isFalse);
        expect(config.enableLogging, isTrue);
      });

      test('should configure for FASIH development/staging', () {
        const apiConfig = FormGearApiConfig(
          baseUrl: 'https://fasih-staging.bps.go.id',
          isProduction: false,
        );
        const bpsUser = BpsUser(
          nipBaru: 'DEV123',
          jabatan: 'DEVELOPER',
        );

        final config = FormGearGlobalConfig.fasih(
          apiConfig: apiConfig,
          bpsUser: bpsUser,
          enableDebugMode: true,
        );

        expect(config.apiConfig?.isProduction, isFalse);
        expect(config.enableDebugMode, isTrue);
        expect(config.enableLogging, isFalse); // Disabled when debug is on
      });

      test('should support local development without backend', () {
        final config = FormGearGlobalConfig.development(
          username: 'LocalDev',
        );

        expect(config.apiConfig, isNull);
        expect(config.bpsUser, isNull);
        expect(config.enableDebugMode, isTrue);
        expect(
          config.defaultAssignmentConfig?.clientMode,
          equals(FormGearClientMode.test),
        );
      });
    });
  });
}
