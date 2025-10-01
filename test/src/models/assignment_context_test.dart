import 'package:flutter_test/flutter_test.dart';
import 'package:form_gear_engine_sdk/src/core/config/form_gear_client_mode.dart';
import 'package:form_gear_engine_sdk/src/core/config/form_gear_form_mode.dart';
import 'package:form_gear_engine_sdk/src/core/config/form_gear_lookup_mode.dart';
import 'package:form_gear_engine_sdk/src/models/assignment_context.dart';

void main() {
  group('AssignmentContext Tests', () {
    group('Construction', () {
      test('should create AssignmentContext with all parameters', () {
        final config = AssignmentConfig.capi();
        final data = AssignmentData.empty();
        final context = AssignmentContext(
          assignmentId: 'assignment-001',
          templateId: 'template-001',
          surveyId: 'survey-2024',
          config: config,
          data: data,
          metadata: const {'status': 'in_progress'},
        );

        expect(context.assignmentId, equals('assignment-001'));
        expect(context.templateId, equals('template-001'));
        expect(context.surveyId, equals('survey-2024'));
        expect(context.config, equals(config));
        expect(context.data, equals(data));
        expect(context.metadata, equals({'status': 'in_progress'}));
      });

      test('should create AssignmentContext with null metadata', () {
        final config = AssignmentConfig.capi();
        final data = AssignmentData.empty();
        final context = AssignmentContext(
          assignmentId: 'assignment-001',
          templateId: 'template-001',
          surveyId: 'survey-2024',
          config: config,
          data: data,
        );

        expect(context.metadata, isNull);
      });
    });

    group('copyWith', () {
      test('should create copy with modified assignmentId', () {
        final config = AssignmentConfig.capi();
        final data = AssignmentData.empty();
        final original = AssignmentContext(
          assignmentId: 'assignment-001',
          templateId: 'template-001',
          surveyId: 'survey-2024',
          config: config,
          data: data,
        );

        final copy = original.copyWith(assignmentId: 'assignment-002');

        expect(copy.assignmentId, equals('assignment-002'));
        expect(copy.templateId, equals(original.templateId));
        expect(copy.surveyId, equals(original.surveyId));
      });

      test('should create copy with modified config', () {
        final originalConfig = AssignmentConfig.capi();
        final newConfig = AssignmentConfig.cawi();
        final data = AssignmentData.empty();
        final original = AssignmentContext(
          assignmentId: 'assignment-001',
          templateId: 'template-001',
          surveyId: 'survey-2024',
          config: originalConfig,
          data: data,
        );

        final copy = original.copyWith(config: newConfig);

        expect(copy.config, equals(newConfig));
        expect(copy.assignmentId, equals(original.assignmentId));
      });
    });

    group('Equality', () {
      test('should be equal when all properties match', () {
        final config = AssignmentConfig.capi();
        final data = AssignmentData.empty();
        final context1 = AssignmentContext(
          assignmentId: 'assignment-001',
          templateId: 'template-001',
          surveyId: 'survey-2024',
          config: config,
          data: data,
        );
        final context2 = AssignmentContext(
          assignmentId: 'assignment-001',
          templateId: 'template-001',
          surveyId: 'survey-2024',
          config: config,
          data: data,
        );

        expect(context1, equals(context2));
      });

      test('should not be equal when assignmentId differs', () {
        final config = AssignmentConfig.capi();
        final data = AssignmentData.empty();
        final context1 = AssignmentContext(
          assignmentId: 'assignment-001',
          templateId: 'template-001',
          surveyId: 'survey-2024',
          config: config,
          data: data,
        );
        final context2 = AssignmentContext(
          assignmentId: 'assignment-002',
          templateId: 'template-001',
          surveyId: 'survey-2024',
          config: config,
          data: data,
        );

        expect(context1, isNot(equals(context2)));
      });
    });

    group('JSON Serialization', () {
      test('should serialize to JSON', () {
        final config = AssignmentConfig.capi();
        final data = AssignmentData.empty();
        final context = AssignmentContext(
          assignmentId: 'assignment-001',
          templateId: 'template-001',
          surveyId: 'survey-2024',
          config: config,
          data: data,
        );

        final json = context.toJson();

        expect(json['assignmentId'], equals('assignment-001'));
        expect(json['templateId'], equals('template-001'));
        expect(json['surveyId'], equals('survey-2024'));
        expect(json['config'], isNotNull);
        expect(json['data'], isNotNull);
      });

      test('should deserialize from JSON', () {
        final json = <String, dynamic>{
          'assignmentId': 'assignment-001',
          'templateId': 'template-001',
          'surveyId': 'survey-2024',
          'config': {
            'lookupMode': 'offline',
            'formMode': 'open',
            'clientMode': 'capi',
            'isEncrypted': false,
            'offlineCapable': true,
            'allowEdit': true,
            'autoSave': true,
            'requireValidation': true,
          },
          'data': {
            'template': <String, dynamic>{},
            'response': {
              'details': {'answers': <dynamic>[]},
            },
            'validation': {'testFunctions': <dynamic>[]},
            'reference': {'predata': <dynamic>[]},
            'media': {
              'details': {'media': <dynamic>[]},
            },
            'remark': {'dataKey': 'default_remark', 'notes': <dynamic>[]},
            'preset': <String, dynamic>{},
            'principals': <dynamic>[],
          },
        };

        final context = AssignmentContext.fromJson(json);

        expect(context.assignmentId, equals('assignment-001'));
        expect(context.templateId, equals('template-001'));
        expect(context.surveyId, equals('survey-2024'));
      });
    });
  });

  group('AssignmentConfig Tests', () {
    group('Factory Constructors', () {
      test('should create CAPI config with offline mode', () {
        final config = AssignmentConfig.capi();

        expect(config.clientMode, equals(FormGearClientMode.capi));
        expect(config.formMode, equals(FormGearFormMode.open));
        expect(config.lookupMode, equals(FormGearLookupMode.offline));
        expect(config.isEncrypted, isFalse);
        expect(config.offlineCapable, isTrue);
      });

      test('should create CAWI config with online mode', () {
        final config = AssignmentConfig.cawi();

        expect(config.clientMode, equals(FormGearClientMode.cawi));
        expect(config.formMode, equals(FormGearFormMode.open));
        expect(config.lookupMode, equals(FormGearLookupMode.online));
        expect(config.isEncrypted, isFalse);
        expect(config.offlineCapable, isFalse);
      });

      test('should create test config with local mode', () {
        final config = AssignmentConfig.test();

        expect(config.clientMode, equals(FormGearClientMode.test));
        expect(config.formMode, equals(FormGearFormMode.debug));
        expect(config.lookupMode, equals(FormGearLookupMode.local));
        expect(config.isEncrypted, isFalse);
        expect(config.autoSave, isFalse);
        expect(config.requireValidation, isFalse);
      });

      test('should allow custom lookup mode for CAPI', () {
        final config = AssignmentConfig.capi(
          lookupMode: FormGearLookupMode.online,
        );

        expect(config.lookupMode, equals(FormGearLookupMode.online));
        expect(config.clientMode, equals(FormGearClientMode.capi));
      });

      test('should allow encryption for CAWI', () {
        final config = AssignmentConfig.cawi(isEncrypted: true);

        expect(config.isEncrypted, isTrue);
        expect(config.clientMode, equals(FormGearClientMode.cawi));
      });
    });

    group('copyWith', () {
      test('should create copy with modified lookupMode', () {
        final original = AssignmentConfig.capi();

        final copy = original.copyWith(
          lookupMode: FormGearLookupMode.online,
        );

        expect(copy.lookupMode, equals(FormGearLookupMode.online));
        expect(copy.clientMode, equals(original.clientMode));
        expect(copy.formMode, equals(original.formMode));
      });

      test('should create copy with modified multiple properties', () {
        final original = AssignmentConfig.capi();

        final copy = original.copyWith(
          allowEdit: false,
          autoSave: false,
          requireValidation: false,
        );

        expect(copy.allowEdit, isFalse);
        expect(copy.autoSave, isFalse);
        expect(copy.requireValidation, isFalse);
      });
    });

    group('Equality', () {
      test('should be equal when all properties match', () {
        final config1 = AssignmentConfig.capi();
        final config2 = AssignmentConfig.capi();

        expect(config1, equals(config2));
      });

      test('should not be equal when lookupMode differs', () {
        final config1 = AssignmentConfig.capi();
        final config2 = AssignmentConfig.capi(
          lookupMode: FormGearLookupMode.online,
        );

        expect(config1, isNot(equals(config2)));
      });
    });

    group('JSON Serialization', () {
      test('should serialize to JSON', () {
        final config = AssignmentConfig.capi(isEncrypted: true);

        final json = config.toJson();

        expect(json['lookupMode'], isNotNull);
        expect(json['formMode'], isNotNull);
        expect(json['clientMode'], isNotNull);
        expect(json['isEncrypted'], isTrue);
      });

      test('should deserialize from JSON', () {
        final json = <String, dynamic>{
          'lookupMode': 'offline',
          'formMode': 'open',
          'clientMode': 'capi',
          'isEncrypted': true,
          'offlineCapable': true,
          'allowEdit': true,
          'autoSave': true,
          'requireValidation': true,
        };

        final config = AssignmentConfig.fromJson(json);

        expect(config.isEncrypted, isTrue);
        expect(config.offlineCapable, isTrue);
      });
    });
  });

  group('AssignmentData Tests', () {
    group('Factory Constructors', () {
      test('should create empty assignment data', () {
        final data = AssignmentData.empty();

        expect(data.template, isEmpty);
        expect(data.response, isNotEmpty);
        expect(data.response['details'], isNotNull);
        expect(data.validation, isNotEmpty);
        expect(data.reference, isNotEmpty);
        expect(data.media, isNotEmpty);
        expect(data.remark, isNotEmpty);
        expect(data.preset, isEmpty);
        expect(data.principals, isEmpty);
        expect(data.userInfo, isNull);
      });

      test('should create empty assignment data with correct structure', () {
        final data = AssignmentData.empty();

        expect(
          (data.response['details'] as Map<String, dynamic>)['answers'],
          isA<List<dynamic>>(),
        );
        expect(data.validation['testFunctions'], isA<List<dynamic>>());
        expect(data.reference['predata'], isA<List<dynamic>>());
        expect(
          (data.media['details'] as Map<String, dynamic>)['media'],
          isA<List<dynamic>>(),
        );
        expect(data.remark['dataKey'], equals('default_remark'));
      });
    });

    group('Construction', () {
      test('should create AssignmentData with all parameters', () {
        const data = AssignmentData(
          template: {'key': 'value'},
          response: {'answers': <dynamic>[]},
          validation: {'rules': <dynamic>[]},
          reference: {'lookup': <dynamic>[]},
          media: {'files': <dynamic>[]},
          remark: {'notes': 'test'},
          preset: {'predata': 'test'},
          principals: <Map<String, dynamic>>[
            {'name': 'user1'},
          ],
          userInfo: {'userId': '123'},
        );

        expect(data.template, equals(const {'key': 'value'}));
        expect(data.response, equals(const {'answers': <dynamic>[]}));
        expect(data.validation, equals(const {'rules': <dynamic>[]}));
        expect(data.reference, equals(const {'lookup': <dynamic>[]}));
        expect(data.media, equals(const {'files': <dynamic>[]}));
        expect(data.remark, equals(const {'notes': 'test'}));
        expect(data.preset, equals(const {'predata': 'test'}));
        expect(data.principals, hasLength(1));
        expect(data.userInfo, equals(const {'userId': '123'}));
      });
    });

    group('copyWith', () {
      test('should create copy with modified response', () {
        final original = AssignmentData.empty();
        final newResponse = {
          'answers': [1, 2, 3],
        };

        final copy = original.copyWith(response: newResponse);

        expect(copy.response, equals(newResponse));
        expect(copy.template, equals(original.template));
      });

      test('should create copy with modified userInfo', () {
        final original = AssignmentData.empty();
        final newUserInfo = {'userId': '123', 'name': 'Test User'};

        final copy = original.copyWith(userInfo: newUserInfo);

        expect(copy.userInfo, equals(newUserInfo));
        expect(copy.template, equals(original.template));
      });
    });

    group('Equality', () {
      test('should be equal when all properties match', () {
        final data1 = AssignmentData.empty();
        final data2 = AssignmentData.empty();

        expect(data1, equals(data2));
      });

      test('should not be equal when response differs', () {
        final data1 = AssignmentData.empty();
        final data2 = data1.copyWith(response: {'different': 'response'});

        expect(data1, isNot(equals(data2)));
      });
    });

    group('JSON Serialization', () {
      test('should serialize to JSON', () {
        final data = AssignmentData.empty();

        final json = data.toJson();

        expect(json['template'], isNotNull);
        expect(json['response'], isNotNull);
        expect(json['validation'], isNotNull);
        expect(json['reference'], isNotNull);
        expect(json['media'], isNotNull);
        expect(json['remark'], isNotNull);
        expect(json['preset'], isNotNull);
      });

      test('should deserialize from JSON', () {
        final json = <String, dynamic>{
          'template': <String, dynamic>{},
          'response': {
            'details': {'answers': <dynamic>[]},
          },
          'validation': {'testFunctions': <dynamic>[]},
          'reference': {'predata': <dynamic>[]},
          'media': {
            'details': {'media': <dynamic>[]},
          },
          'remark': {'dataKey': 'default_remark', 'notes': <dynamic>[]},
          'preset': <String, dynamic>{},
          'principals': <dynamic>[],
        };

        final data = AssignmentData.fromJson(json);

        expect(data.template, isEmpty);
        expect(data.response, isNotEmpty);
        expect(data.principals, isEmpty);
      });
    });
  });
}
