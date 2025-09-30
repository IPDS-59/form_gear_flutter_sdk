import 'package:flutter_test/flutter_test.dart';
import 'package:form_gear_engine_sdk/src/core/config/config.dart';
import 'package:form_gear_engine_sdk/src/models/bps_user.dart';

void main() {
  group('FormGearConfig Tests', () {
    group('Construction', () {
      test('should create config with all parameters', () {
        const bpsUser = BpsUser(
          nipBaru: '123456789',
          jabatan: 'ENUMERATOR',
          org: 'BPS Jawa Barat',
          eselon2: 'Provincial',
          eselon3: 'Regional',
        );

        const apiConfig = FormGearApiConfig(
          baseUrl: 'https://api.example.com',
          templateZipEndpoint: '/api/template/zip/{templateId}',
          formEngineEndpoint: '/api/form-engine',
          lookupEndpoint: '/api/lookup/{surveyId}',
        );

        const config = FormGearConfig(
          clientMode: FormGearClientMode.capi,
          lookupKey: 'key%5B%5D',
          lookupValue: 'value%5B%5D',
          lookupMode: FormGearLookupMode.online,
          username: 'test_user',
          formMode: FormGearFormMode.open,
          initialMode: FormGearInitialMode.initial,
          htmlLogPrefix: '[FormGear]',
          sdkLogPrefix: '[SDK]',
          serverPort: 3310,
          autoStartServer: true,
          bpsUser: bpsUser,
          apiConfig: apiConfig,
          preset: {'defaultValue': 'test'},
          formResponse: {'answer': 'test'},
          validation: {'required': true},
          remark: 'Test remark',
        );

        expect(config.clientMode, equals(FormGearClientMode.capi));
        expect(config.lookupKey, equals('key%5B%5D'));
        expect(config.lookupValue, equals('value%5B%5D'));
        expect(config.lookupMode, equals(FormGearLookupMode.online));
        expect(config.username, equals('test_user'));
        expect(config.formMode, equals(FormGearFormMode.open));
        expect(config.initialMode, equals(FormGearInitialMode.initial));
        expect(config.htmlLogPrefix, equals('[FormGear]'));
        expect(config.sdkLogPrefix, equals('[SDK]'));
        expect(config.serverPort, equals(3310));
        expect(config.autoStartServer, isTrue);
        expect(config.bpsUser, equals(bpsUser));
        expect(config.apiConfig, equals(apiConfig));
        expect(config.preset, equals(const {'defaultValue': 'test'}));
        expect(config.formResponse, equals(const {'answer': 'test'}));
        expect(config.validation, equals(const {'required': true}));
        expect(config.remark, equals('Test remark'));
        expect(config.isNewForm, isTrue);
        expect(config.enableLogging, isTrue);
      });

      test('should create config with default optional parameters', () {
        const config = FormGearConfig(
          clientMode: FormGearClientMode.capi,
          lookupKey: 'key%5B%5D',
          lookupValue: 'value%5B%5D',
          lookupMode: FormGearLookupMode.offline,
          username: 'user',
          formMode: FormGearFormMode.open,
          initialMode: FormGearInitialMode.initial,
          htmlLogPrefix: '[HTML]',
          sdkLogPrefix: '[SDK]',
          serverPort: 3310,
          autoStartServer: false,
        );

        expect(config.bpsUser, isNull);
        expect(config.apiConfig, isNull);
        expect(config.preset, isNull);
        expect(config.formResponse, isNull);
        expect(config.validation, isNull);
        expect(config.remark, isNull);
        expect(config.isNewForm, isTrue);
        expect(config.enableLogging, isTrue);
      });

      test('should create CAWI config for web apps', () {
        const config = FormGearConfig(
          clientMode: FormGearClientMode.cawi,
          lookupKey: 'key%5B%5D',
          lookupValue: 'value%5B%5D',
          lookupMode: FormGearLookupMode.online,
          username: 'web_user',
          formMode: FormGearFormMode.open,
          initialMode: FormGearInitialMode.initial,
          htmlLogPrefix: '[CAWI]',
          sdkLogPrefix: '[SDK]',
          serverPort: 3310,
          autoStartServer: true,
        );

        expect(config.clientMode, equals(FormGearClientMode.cawi));
        expect(config.lookupMode, equals(FormGearLookupMode.online));
      });

      test('should create CAPI config for mobile apps', () {
        const config = FormGearConfig(
          clientMode: FormGearClientMode.capi,
          lookupKey: 'key%5B%5D',
          lookupValue: 'value%5B%5D',
          lookupMode: FormGearLookupMode.offline,
          username: 'mobile_user',
          formMode: FormGearFormMode.open,
          initialMode: FormGearInitialMode.assign,
          htmlLogPrefix: '[CAPI]',
          sdkLogPrefix: '[SDK]',
          serverPort: 3310,
          autoStartServer: true,
        );

        expect(config.clientMode, equals(FormGearClientMode.capi));
        expect(config.initialMode, equals(FormGearInitialMode.assign));
      });
    });

    group('Equality', () {
      test('should be equal when all properties match', () {
        const config1 = FormGearConfig(
          clientMode: FormGearClientMode.capi,
          lookupKey: 'key%5B%5D',
          lookupValue: 'value%5B%5D',
          lookupMode: FormGearLookupMode.online,
          username: 'user',
          formMode: FormGearFormMode.open,
          initialMode: FormGearInitialMode.initial,
          htmlLogPrefix: '[HTML]',
          sdkLogPrefix: '[SDK]',
          serverPort: 3310,
          autoStartServer: true,
        );

        const config2 = FormGearConfig(
          clientMode: FormGearClientMode.capi,
          lookupKey: 'key%5B%5D',
          lookupValue: 'value%5B%5D',
          lookupMode: FormGearLookupMode.online,
          username: 'user',
          formMode: FormGearFormMode.open,
          initialMode: FormGearInitialMode.initial,
          htmlLogPrefix: '[HTML]',
          sdkLogPrefix: '[SDK]',
          serverPort: 3310,
          autoStartServer: true,
        );

        expect(config1, equals(config2));
        expect(config1.hashCode, equals(config2.hashCode));
      });

      test('should not be equal when clientMode differs', () {
        const config1 = FormGearConfig(
          clientMode: FormGearClientMode.capi,
          lookupKey: 'key%5B%5D',
          lookupValue: 'value%5B%5D',
          lookupMode: FormGearLookupMode.online,
          username: 'user',
          formMode: FormGearFormMode.open,
          initialMode: FormGearInitialMode.initial,
          htmlLogPrefix: '[HTML]',
          sdkLogPrefix: '[SDK]',
          serverPort: 3310,
          autoStartServer: true,
        );

        const config2 = FormGearConfig(
          clientMode: FormGearClientMode.cawi,
          lookupKey: 'key%5B%5D',
          lookupValue: 'value%5B%5D',
          lookupMode: FormGearLookupMode.online,
          username: 'user',
          formMode: FormGearFormMode.open,
          initialMode: FormGearInitialMode.initial,
          htmlLogPrefix: '[HTML]',
          sdkLogPrefix: '[SDK]',
          serverPort: 3310,
          autoStartServer: true,
        );

        expect(config1, isNot(equals(config2)));
      });

      test('should not be equal when username differs', () {
        const config1 = FormGearConfig(
          clientMode: FormGearClientMode.capi,
          lookupKey: 'key%5B%5D',
          lookupValue: 'value%5B%5D',
          lookupMode: FormGearLookupMode.online,
          username: 'user1',
          formMode: FormGearFormMode.open,
          initialMode: FormGearInitialMode.initial,
          htmlLogPrefix: '[HTML]',
          sdkLogPrefix: '[SDK]',
          serverPort: 3310,
          autoStartServer: true,
        );

        const config2 = FormGearConfig(
          clientMode: FormGearClientMode.capi,
          lookupKey: 'key%5B%5D',
          lookupValue: 'value%5B%5D',
          lookupMode: FormGearLookupMode.online,
          username: 'user2',
          formMode: FormGearFormMode.open,
          initialMode: FormGearInitialMode.initial,
          htmlLogPrefix: '[HTML]',
          sdkLogPrefix: '[SDK]',
          serverPort: 3310,
          autoStartServer: true,
        );

        expect(config1, isNot(equals(config2)));
      });
    });

    group('Form Modes', () {
      test('should configure open form', () {
        const config = FormGearConfig(
          clientMode: FormGearClientMode.capi,
          lookupKey: 'key%5B%5D',
          lookupValue: 'value%5B%5D',
          lookupMode: FormGearLookupMode.online,
          username: 'user',
          formMode: FormGearFormMode.open,
          initialMode: FormGearInitialMode.initial,
          htmlLogPrefix: '[HTML]',
          sdkLogPrefix: '[SDK]',
          serverPort: 3310,
          autoStartServer: true,
        );

        expect(config.formMode, equals(FormGearFormMode.open));
      });

      test('should configure rejected form', () {
        const config = FormGearConfig(
          clientMode: FormGearClientMode.capi,
          lookupKey: 'key%5B%5D',
          lookupValue: 'value%5B%5D',
          lookupMode: FormGearLookupMode.online,
          username: 'user',
          formMode: FormGearFormMode.rejected,
          initialMode: FormGearInitialMode.initial,
          htmlLogPrefix: '[HTML]',
          sdkLogPrefix: '[SDK]',
          serverPort: 3310,
          autoStartServer: true,
        );

        expect(config.formMode, equals(FormGearFormMode.rejected));
      });

      test('should configure submitted form', () {
        const config = FormGearConfig(
          clientMode: FormGearClientMode.capi,
          lookupKey: 'key%5B%5D',
          lookupValue: 'value%5B%5D',
          lookupMode: FormGearLookupMode.online,
          username: 'user',
          formMode: FormGearFormMode.submitted,
          initialMode: FormGearInitialMode.initial,
          htmlLogPrefix: '[HTML]',
          sdkLogPrefix: '[SDK]',
          serverPort: 3310,
          autoStartServer: true,
        );

        expect(config.formMode, equals(FormGearFormMode.submitted));
      });

      test('should configure approved form', () {
        const config = FormGearConfig(
          clientMode: FormGearClientMode.capi,
          lookupKey: 'key%5B%5D',
          lookupValue: 'value%5B%5D',
          lookupMode: FormGearLookupMode.online,
          username: 'user',
          formMode: FormGearFormMode.approved,
          initialMode: FormGearInitialMode.initial,
          htmlLogPrefix: '[HTML]',
          sdkLogPrefix: '[SDK]',
          serverPort: 3310,
          autoStartServer: true,
        );

        expect(config.formMode, equals(FormGearFormMode.approved));
      });
    });

    group('Lookup Modes', () {
      test('should configure online lookup', () {
        const config = FormGearConfig(
          clientMode: FormGearClientMode.capi,
          lookupKey: 'key%5B%5D',
          lookupValue: 'value%5B%5D',
          lookupMode: FormGearLookupMode.online,
          username: 'user',
          formMode: FormGearFormMode.open,
          initialMode: FormGearInitialMode.initial,
          htmlLogPrefix: '[HTML]',
          sdkLogPrefix: '[SDK]',
          serverPort: 3310,
          autoStartServer: true,
        );

        expect(config.lookupMode, equals(FormGearLookupMode.online));
      });

      test('should configure offline lookup', () {
        const config = FormGearConfig(
          clientMode: FormGearClientMode.capi,
          lookupKey: 'key%5B%5D',
          lookupValue: 'value%5B%5D',
          lookupMode: FormGearLookupMode.offline,
          username: 'user',
          formMode: FormGearFormMode.open,
          initialMode: FormGearInitialMode.initial,
          htmlLogPrefix: '[HTML]',
          sdkLogPrefix: '[SDK]',
          serverPort: 3310,
          autoStartServer: true,
        );

        expect(config.lookupMode, equals(FormGearLookupMode.offline));
      });
    });

    group('Server Configuration', () {
      test('should configure with auto-start enabled', () {
        const config = FormGearConfig(
          clientMode: FormGearClientMode.capi,
          lookupKey: 'key%5B%5D',
          lookupValue: 'value%5B%5D',
          lookupMode: FormGearLookupMode.online,
          username: 'user',
          formMode: FormGearFormMode.open,
          initialMode: FormGearInitialMode.initial,
          htmlLogPrefix: '[HTML]',
          sdkLogPrefix: '[SDK]',
          serverPort: 3310,
          autoStartServer: true,
        );

        expect(config.autoStartServer, isTrue);
        expect(config.serverPort, equals(3310));
      });

      test('should configure with auto-start disabled', () {
        const config = FormGearConfig(
          clientMode: FormGearClientMode.capi,
          lookupKey: 'key%5B%5D',
          lookupValue: 'value%5B%5D',
          lookupMode: FormGearLookupMode.online,
          username: 'user',
          formMode: FormGearFormMode.open,
          initialMode: FormGearInitialMode.initial,
          htmlLogPrefix: '[HTML]',
          sdkLogPrefix: '[SDK]',
          serverPort: 3310,
          autoStartServer: false,
        );

        expect(config.autoStartServer, isFalse);
      });

      test('should configure custom server port', () {
        const config = FormGearConfig(
          clientMode: FormGearClientMode.capi,
          lookupKey: 'key%5B%5D',
          lookupValue: 'value%5B%5D',
          lookupMode: FormGearLookupMode.online,
          username: 'user',
          formMode: FormGearFormMode.open,
          initialMode: FormGearInitialMode.initial,
          htmlLogPrefix: '[HTML]',
          sdkLogPrefix: '[SDK]',
          serverPort: 8080,
          autoStartServer: true,
        );

        expect(config.serverPort, equals(8080));
      });
    });

    group('Logging Configuration', () {
      test('should configure with logging enabled', () {
        const config = FormGearConfig(
          clientMode: FormGearClientMode.capi,
          lookupKey: 'key%5B%5D',
          lookupValue: 'value%5B%5D',
          lookupMode: FormGearLookupMode.online,
          username: 'user',
          formMode: FormGearFormMode.open,
          initialMode: FormGearInitialMode.initial,
          htmlLogPrefix: '[HTML]',
          sdkLogPrefix: '[SDK]',
          serverPort: 3310,
          autoStartServer: true,
        );

        expect(config.enableLogging, isTrue);
      });

      test('should configure with logging disabled', () {
        const config = FormGearConfig(
          clientMode: FormGearClientMode.capi,
          lookupKey: 'key%5B%5D',
          lookupValue: 'value%5B%5D',
          lookupMode: FormGearLookupMode.online,
          username: 'user',
          formMode: FormGearFormMode.open,
          initialMode: FormGearInitialMode.initial,
          htmlLogPrefix: '[HTML]',
          sdkLogPrefix: '[SDK]',
          serverPort: 3310,
          autoStartServer: true,
          enableLogging: false,
        );

        expect(config.enableLogging, isFalse);
      });

      test('should configure custom log prefixes', () {
        const config = FormGearConfig(
          clientMode: FormGearClientMode.capi,
          lookupKey: 'key%5B%5D',
          lookupValue: 'value%5B%5D',
          lookupMode: FormGearLookupMode.online,
          username: 'user',
          formMode: FormGearFormMode.open,
          initialMode: FormGearInitialMode.initial,
          htmlLogPrefix: '[CustomHTML]',
          sdkLogPrefix: '[CustomSDK]',
          serverPort: 3310,
          autoStartServer: true,
        );

        expect(config.htmlLogPrefix, equals('[CustomHTML]'));
        expect(config.sdkLogPrefix, equals('[CustomSDK]'));
      });
    });

    group('BPS User Integration', () {
      test('should configure with BPS user', () {
        const bpsUser = BpsUser(
          nipBaru: '123456789',
          jabatan: 'ENUMERATOR',
          org: 'BPS Jawa Barat',
        );

        const config = FormGearConfig(
          clientMode: FormGearClientMode.capi,
          lookupKey: 'key%5B%5D',
          lookupValue: 'value%5B%5D',
          lookupMode: FormGearLookupMode.online,
          username: 'john_doe',
          formMode: FormGearFormMode.open,
          initialMode: FormGearInitialMode.initial,
          htmlLogPrefix: '[HTML]',
          sdkLogPrefix: '[SDK]',
          serverPort: 3310,
          autoStartServer: true,
          bpsUser: bpsUser,
        );

        expect(config.bpsUser, isNotNull);
        expect(config.bpsUser?.nipBaru, equals('123456789'));
        expect(config.bpsUser?.org, equals('BPS Jawa Barat'));
        expect(config.bpsUser?.jabatan, equals('ENUMERATOR'));
      });

      test('should configure without BPS user', () {
        const config = FormGearConfig(
          clientMode: FormGearClientMode.capi,
          lookupKey: 'key%5B%5D',
          lookupValue: 'value%5B%5D',
          lookupMode: FormGearLookupMode.online,
          username: 'user',
          formMode: FormGearFormMode.open,
          initialMode: FormGearInitialMode.initial,
          htmlLogPrefix: '[HTML]',
          sdkLogPrefix: '[SDK]',
          serverPort: 3310,
          autoStartServer: true,
        );

        expect(config.bpsUser, isNull);
      });
    });

    group('Form Data', () {
      test('should configure with preset data', () {
        const config = FormGearConfig(
          clientMode: FormGearClientMode.capi,
          lookupKey: 'key%5B%5D',
          lookupValue: 'value%5B%5D',
          lookupMode: FormGearLookupMode.online,
          username: 'user',
          formMode: FormGearFormMode.open,
          initialMode: FormGearInitialMode.initial,
          htmlLogPrefix: '[HTML]',
          sdkLogPrefix: '[SDK]',
          serverPort: 3310,
          autoStartServer: true,
          preset: {'province': 'Jawa Barat', 'regency': 'Bandung'},
        );

        expect(config.preset, isNotNull);
        expect(config.preset?['province'], equals('Jawa Barat'));
        expect(config.preset?['regency'], equals('Bandung'));
      });

      test('should configure with form response', () {
        const config = FormGearConfig(
          clientMode: FormGearClientMode.capi,
          lookupKey: 'key%5B%5D',
          lookupValue: 'value%5B%5D',
          lookupMode: FormGearLookupMode.online,
          username: 'user',
          formMode: FormGearFormMode.open,
          initialMode: FormGearInitialMode.initial,
          htmlLogPrefix: '[HTML]',
          sdkLogPrefix: '[SDK]',
          serverPort: 3310,
          autoStartServer: true,
          formResponse: {'question1': 'answer1', 'question2': 'answer2'},
        );

        expect(config.formResponse, isNotNull);
        expect(config.formResponse?['question1'], equals('answer1'));
      });

      test('should configure with validation rules', () {
        const config = FormGearConfig(
          clientMode: FormGearClientMode.capi,
          lookupKey: 'key%5B%5D',
          lookupValue: 'value%5B%5D',
          lookupMode: FormGearLookupMode.online,
          username: 'user',
          formMode: FormGearFormMode.open,
          initialMode: FormGearInitialMode.initial,
          htmlLogPrefix: '[HTML]',
          sdkLogPrefix: '[SDK]',
          serverPort: 3310,
          autoStartServer: true,
          validation: {
            'field1': {'required': true, 'minLength': 5},
          },
        );

        expect(config.validation, isNotNull);
        expect(config.validation?['field1'], isNotNull);
      });

      test('should configure with remark', () {
        const config = FormGearConfig(
          clientMode: FormGearClientMode.capi,
          lookupKey: 'key%5B%5D',
          lookupValue: 'value%5B%5D',
          lookupMode: FormGearLookupMode.online,
          username: 'user',
          formMode: FormGearFormMode.open,
          initialMode: FormGearInitialMode.initial,
          htmlLogPrefix: '[HTML]',
          sdkLogPrefix: '[SDK]',
          serverPort: 3310,
          autoStartServer: true,
          remark: 'This is a test remark',
        );

        expect(config.remark, equals('This is a test remark'));
      });

      test('should configure with isNewForm flag', () {
        const config1 = FormGearConfig(
          clientMode: FormGearClientMode.capi,
          lookupKey: 'key%5B%5D',
          lookupValue: 'value%5B%5D',
          lookupMode: FormGearLookupMode.online,
          username: 'user',
          formMode: FormGearFormMode.open,
          initialMode: FormGearInitialMode.initial,
          htmlLogPrefix: '[HTML]',
          sdkLogPrefix: '[SDK]',
          serverPort: 3310,
          autoStartServer: true,
        );

        const config2 = FormGearConfig(
          clientMode: FormGearClientMode.capi,
          lookupKey: 'key%5B%5D',
          lookupValue: 'value%5B%5D',
          lookupMode: FormGearLookupMode.online,
          username: 'user',
          formMode: FormGearFormMode.open,
          initialMode: FormGearInitialMode.initial,
          htmlLogPrefix: '[HTML]',
          sdkLogPrefix: '[SDK]',
          serverPort: 3310,
          autoStartServer: true,
          isNewForm: false,
        );

        expect(config1.isNewForm, isTrue);
        expect(config2.isNewForm, isFalse);
      });
    });

    group('API Configuration', () {
      test('should configure with API config', () {
        const apiConfig = FormGearApiConfig(
          baseUrl: 'https://api.example.com',
          templateZipEndpoint: '/template/zip/{templateId}',
          formEngineEndpoint: '/form-engine',
          lookupEndpoint: '/lookup/{surveyId}',
        );

        const config = FormGearConfig(
          clientMode: FormGearClientMode.capi,
          lookupKey: 'key%5B%5D',
          lookupValue: 'value%5B%5D',
          lookupMode: FormGearLookupMode.online,
          username: 'user',
          formMode: FormGearFormMode.open,
          initialMode: FormGearInitialMode.initial,
          htmlLogPrefix: '[HTML]',
          sdkLogPrefix: '[SDK]',
          serverPort: 3310,
          autoStartServer: true,
          apiConfig: apiConfig,
        );

        expect(config.apiConfig, isNotNull);
        expect(config.apiConfig?.baseUrl, equals('https://api.example.com'));
      });

      test('should configure without API config', () {
        const config = FormGearConfig(
          clientMode: FormGearClientMode.capi,
          lookupKey: 'key%5B%5D',
          lookupValue: 'value%5B%5D',
          lookupMode: FormGearLookupMode.online,
          username: 'user',
          formMode: FormGearFormMode.open,
          initialMode: FormGearInitialMode.initial,
          htmlLogPrefix: '[HTML]',
          sdkLogPrefix: '[SDK]',
          serverPort: 3310,
          autoStartServer: true,
        );

        expect(config.apiConfig, isNull);
      });
    });

    group('FASIH Integration Scenarios', () {
      test('should configure for FASIH mobile app', () {
        const bpsUser = BpsUser(
          nipBaru: '123456789',
          jabatan: 'ENUMERATOR',
          org: 'BPS Provinsi Jawa Barat',
          kodeOrg: '32',
        );

        const apiConfig = FormGearApiConfig(
          baseUrl: 'https://fasih-api.bps.go.id',
          templateZipEndpoint: '/api/template/zip/{templateId}',
          formEngineEndpoint: '/api/form-engine',
        );

        const config = FormGearConfig(
          clientMode: FormGearClientMode.capi,
          lookupKey: 'key%5B%5D',
          lookupValue: 'value%5B%5D',
          lookupMode: FormGearLookupMode.offline,
          username: 'surveyor_123',
          formMode: FormGearFormMode.open,
          initialMode: FormGearInitialMode.assign,
          htmlLogPrefix: '[FASIH]',
          sdkLogPrefix: '[SDK]',
          serverPort: 3310,
          autoStartServer: true,
          bpsUser: bpsUser,
          apiConfig: apiConfig,
        );

        expect(config.clientMode, equals(FormGearClientMode.capi));
        expect(config.lookupMode, equals(FormGearLookupMode.offline));
        expect(config.initialMode, equals(FormGearInitialMode.assign));
        expect(config.bpsUser?.jabatan, equals('ENUMERATOR'));
      });

      test('should configure for FASIH web app', () {
        const apiConfig = FormGearApiConfig(
          baseUrl: 'https://fasih-web.bps.go.id',
          templateZipEndpoint: '/api/template/zip/{templateId}',
        );

        const config = FormGearConfig(
          clientMode: FormGearClientMode.cawi,
          lookupKey: 'key%5B%5D',
          lookupValue: 'value%5B%5D',
          lookupMode: FormGearLookupMode.online,
          username: 'respondent_001',
          formMode: FormGearFormMode.open,
          initialMode: FormGearInitialMode.initial,
          htmlLogPrefix: '[FASIH]',
          sdkLogPrefix: '[SDK]',
          serverPort: 3310,
          autoStartServer: true,
          apiConfig: apiConfig,
        );

        expect(config.clientMode, equals(FormGearClientMode.cawi));
        expect(config.lookupMode, equals(FormGearLookupMode.online));
      });
    });
  });
}
