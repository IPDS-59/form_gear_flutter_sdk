import 'package:flutter_test/flutter_test.dart';
import 'package:form_gear_engine_sdk/src/models/custom_data_template.dart';
import 'package:form_gear_engine_sdk/src/models/list_lookup_notif_response.dart';
import 'package:form_gear_engine_sdk/src/models/lookup.dart';
import 'package:form_gear_engine_sdk/src/models/template_lookup.dart';

void main() {
  group('Lookup Tests', () {
    group('Construction', () {
      test('should create lookup with id and version', () {
        const lookup = Lookup(
          id: 'lookup_001',
          version: '1.0.0',
        );

        expect(lookup.id, equals('lookup_001'));
        expect(lookup.version, equals('1.0.0'));
      });

      test('should create lookup with id only', () {
        const lookup = Lookup(id: 'lookup_002');

        expect(lookup.id, equals('lookup_002'));
        expect(lookup.version, isNull);
      });
    });

    group('copyWith', () {
      test('should create copy with modified id', () {
        const original = Lookup(id: 'lookup_001', version: '1.0.0');
        final copied = original.copyWith(id: 'lookup_002');

        expect(copied.id, equals('lookup_002'));
        expect(copied.version, equals('1.0.0'));
      });

      test('should create copy with modified version', () {
        const original = Lookup(id: 'lookup_001', version: '1.0.0');
        final copied = original.copyWith(version: '2.0.0');

        expect(copied.id, equals('lookup_001'));
        expect(copied.version, equals('2.0.0'));
      });

      test('should keep original values when not specified', () {
        const original = Lookup(id: 'lookup_001', version: '1.0.0');
        final copied = original.copyWith();

        expect(copied, equals(original));
      });
    });

    group('Equality', () {
      test('should be equal when all properties match', () {
        const lookup1 = Lookup(id: 'lookup_001', version: '1.0.0');
        const lookup2 = Lookup(id: 'lookup_001', version: '1.0.0');

        expect(lookup1, equals(lookup2));
        expect(lookup1.hashCode, equals(lookup2.hashCode));
      });

      test('should not be equal when id differs', () {
        const lookup1 = Lookup(id: 'lookup_001');
        const lookup2 = Lookup(id: 'lookup_002');

        expect(lookup1, isNot(equals(lookup2)));
      });

      test('should not be equal when version differs', () {
        const lookup1 = Lookup(id: 'lookup_001', version: '1.0.0');
        const lookup2 = Lookup(id: 'lookup_001', version: '2.0.0');

        expect(lookup1, isNot(equals(lookup2)));
      });
    });

    group('toString', () {
      test('should have readable string representation', () {
        const lookup = Lookup(id: 'lookup_001', version: '1.0.0');

        final str = lookup.toString();
        expect(str, contains('Lookup'));
        expect(str, contains('lookup_001'));
        expect(str, contains('1.0.0'));
      });
    });

    group('JSON Serialization', () {
      test('should serialize to JSON', () {
        const lookup = Lookup(id: 'lookup_001', version: '1.0.0');

        final json = lookup.toJson();
        expect(json['id'], equals('lookup_001'));
        expect(json['version'], equals('1.0.0'));
      });

      test('should deserialize from JSON', () {
        final json = {'id': 'lookup_001', 'version': '1.0.0'};

        final lookup = Lookup.fromJson(json);
        expect(lookup.id, equals('lookup_001'));
        expect(lookup.version, equals('1.0.0'));
      });
    });
  });

  group('TemplateLookup Tests', () {
    group('Construction', () {
      test('should create template lookup with all parameters', () {
        const lookups = [
          Lookup(id: 'lookup_001', version: '1.0.0'),
          Lookup(id: 'lookup_002', version: '1.0.0'),
        ];

        const templateLookup = TemplateLookup(
          templateId: 'template_001',
          templateVersion: '2.0.0',
          formEngineId: 1,
          formEngineBrandName: 'FormGear',
          lookups: lookups,
        );

        expect(templateLookup.templateId, equals('template_001'));
        expect(templateLookup.templateVersion, equals('2.0.0'));
        expect(templateLookup.formEngineId, equals(1));
        expect(templateLookup.formEngineBrandName, equals('FormGear'));
        expect(templateLookup.lookups, equals(lookups));
      });

      test('should create template lookup with empty lookups', () {
        const templateLookup = TemplateLookup(
          templateId: 'template_002',
          templateVersion: '1.0.0',
          formEngineId: 2,
          formEngineBrandName: 'FasihForm',
        );

        expect(templateLookup.lookups, isEmpty);
      });
    });

    group('copyWith', () {
      test('should create copy with modified templateId', () {
        const original = TemplateLookup(
          templateId: 'template_001',
          templateVersion: '1.0.0',
          formEngineId: 1,
          formEngineBrandName: 'FormGear',
        );

        final copied = original.copyWith(templateId: 'template_002');
        expect(copied.templateId, equals('template_002'));
        expect(copied.templateVersion, equals('1.0.0'));
      });

      test('should create copy with modified formEngineId', () {
        const original = TemplateLookup(
          templateId: 'template_001',
          templateVersion: '1.0.0',
          formEngineId: 1,
          formEngineBrandName: 'FormGear',
        );

        final copied = original.copyWith(formEngineId: 2);
        expect(copied.formEngineId, equals(2));
      });

      test('should create copy with modified lookups', () {
        const original = TemplateLookup(
          templateId: 'template_001',
          templateVersion: '1.0.0',
          formEngineId: 1,
          formEngineBrandName: 'FormGear',
        );

        final newLookups = [const Lookup(id: 'lookup_001')];
        final copied = original.copyWith(lookups: newLookups);
        expect(copied.lookups, equals(newLookups));
      });
    });

    group('Equality', () {
      test('should be equal when all properties match', () {
        const templateLookup1 = TemplateLookup(
          templateId: 'template_001',
          templateVersion: '1.0.0',
          formEngineId: 1,
          formEngineBrandName: 'FormGear',
        );

        const templateLookup2 = TemplateLookup(
          templateId: 'template_001',
          templateVersion: '1.0.0',
          formEngineId: 1,
          formEngineBrandName: 'FormGear',
        );

        expect(templateLookup1, equals(templateLookup2));
        expect(templateLookup1.hashCode, equals(templateLookup2.hashCode));
      });

      test('should not be equal when templateId differs', () {
        const templateLookup1 = TemplateLookup(
          templateId: 'template_001',
          templateVersion: '1.0.0',
          formEngineId: 1,
          formEngineBrandName: 'FormGear',
        );

        const templateLookup2 = TemplateLookup(
          templateId: 'template_002',
          templateVersion: '1.0.0',
          formEngineId: 1,
          formEngineBrandName: 'FormGear',
        );

        expect(templateLookup1, isNot(equals(templateLookup2)));
      });
    });

    group('toString', () {
      test('should have readable string representation', () {
        const templateLookup = TemplateLookup(
          templateId: 'template_001',
          templateVersion: '1.0.0',
          formEngineId: 1,
          formEngineBrandName: 'FormGear',
        );

        final str = templateLookup.toString();
        expect(str, contains('TemplateLookup'));
        expect(str, contains('template_001'));
        expect(str, contains('FormGear'));
      });
    });

    group('JSON Serialization', () {
      test('should serialize to JSON', () {
        const templateLookup = TemplateLookup(
          templateId: 'template_001',
          templateVersion: '1.0.0',
          formEngineId: 1,
          formEngineBrandName: 'FormGear',
        );

        final json = templateLookup.toJson();
        expect(json['templateId'], equals('template_001'));
        expect(json['formEngineId'], equals(1));
        expect(json['formEngineBrandName'], equals('FormGear'));
      });

      test('should deserialize from JSON', () {
        final json = {
          'templateId': 'template_001',
          'templateVersion': '1.0.0',
          'formEngineId': 1,
          'formEngineBrandName': 'FormGear',
          'lookups': [],
        };

        final templateLookup = TemplateLookup.fromJson(json);
        expect(templateLookup.templateId, equals('template_001'));
        expect(templateLookup.formEngineId, equals(1));
      });
    });
  });

  group('CustomDataTemplate Tests', () {
    group('Construction', () {
      test('should create successful response', () {
        const entity = CustomDataTemplateEntity(
          templateId: 'template_001',
          templateName: 'Survey Template',
          templateVersion: '1.0.0',
        );

        const response = CustomDataTemplate(
          success: true,
          message: 'Success',
          data: entity,
        );

        expect(response.success, isTrue);
        expect(response.errorCode, isNull);
        expect(response.message, equals('Success'));
        expect(response.data, equals(entity));
      });

      test('should create failed response', () {
        const response = CustomDataTemplate(
          success: false,
          errorCode: 404,
          message: 'Template not found',
        );

        expect(response.success, isFalse);
        expect(response.errorCode, equals(404));
        expect(response.message, equals('Template not found'));
        expect(response.data, isNull);
      });
    });

    group('Equality', () {
      test('should be equal when all properties match', () {
        const response1 = CustomDataTemplate(
          success: true,
          message: 'Success',
        );

        const response2 = CustomDataTemplate(
          success: true,
          message: 'Success',
        );

        expect(response1, equals(response2));
        expect(response1.hashCode, equals(response2.hashCode));
      });
    });

    group('JSON Serialization', () {
      test('should serialize to JSON', () {
        const response = CustomDataTemplate(
          success: true,
          message: 'Success',
        );

        final json = response.toJson();
        expect(json['success'], isTrue);
        expect(json['message'], equals('Success'));
      });

      test('should deserialize from JSON', () {
        final json = {
          'success': true,
          'errorCode': null,
          'message': 'Success',
          'data': null,
        };

        final response = CustomDataTemplate.fromJson(json);
        expect(response.success, isTrue);
        expect(response.message, equals('Success'));
      });
    });
  });

  group('CustomDataTemplateEntity Tests', () {
    group('Construction', () {
      test('should create entity with all parameters', () {
        const entity = CustomDataTemplateEntity(
          templateId: 'template_001',
          templateName: 'Survey Template',
          templateVersion: '1.0.0',
          templateData: {'fields': []},
          lookupData: {'lookups': []},
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
          isActive: true,
        );

        expect(entity.templateId, equals('template_001'));
        expect(entity.templateName, equals('Survey Template'));
        expect(entity.templateVersion, equals('1.0.0'));
        expect(entity.templateData, isNotNull);
        expect(entity.lookupData, isNotNull);
        expect(entity.isActive, isTrue);
      });
    });

    group('Equality', () {
      test('should be equal when all properties match', () {
        const entity1 = CustomDataTemplateEntity(
          templateId: 'template_001',
          templateName: 'Survey',
        );

        const entity2 = CustomDataTemplateEntity(
          templateId: 'template_001',
          templateName: 'Survey',
        );

        expect(entity1, equals(entity2));
        expect(entity1.hashCode, equals(entity2.hashCode));
      });
    });

    group('JSON Serialization', () {
      test('should serialize to JSON with snake_case', () {
        const entity = CustomDataTemplateEntity(
          templateId: 'template_001',
          templateName: 'Survey',
          isActive: true,
        );

        final json = entity.toJson();
        expect(json['template_id'], equals('template_001'));
        expect(json['template_name'], equals('Survey'));
        expect(json['is_active'], isTrue);
      });

      test('should deserialize from JSON with snake_case', () {
        final json = {
          'template_id': 'template_001',
          'template_name': 'Survey',
          'template_version': '1.0.0',
          'is_active': true,
        };

        final entity = CustomDataTemplateEntity.fromJson(json);
        expect(entity.templateId, equals('template_001'));
        expect(entity.templateName, equals('Survey'));
        expect(entity.isActive, isTrue);
      });
    });
  });

  group('ListLookupNotifResponse Tests', () {
    group('Construction', () {
      test('should create successful response with data', () {
        const lookupList = [
          TemplateLookupList(
            surveyId: 'survey_001',
            templateId: 'template_001',
            lookupType: 'region',
            lookupCode: 'code_001',
          ),
        ];

        const response = ListLookupNotifResponse(
          success: true,
          message: 'Success',
          data: lookupList,
        );

        expect(response.success, isTrue);
        expect(response.message, equals('Success'));
        expect(response.data, equals(lookupList));
      });

      test('should create failed response', () {
        const response = ListLookupNotifResponse(
          success: false,
          errorCode: 500,
          message: 'Server error',
        );

        expect(response.success, isFalse);
        expect(response.errorCode, equals(500));
        expect(response.data, isNull);
      });
    });

    group('JSON Serialization', () {
      test('should serialize to JSON', () {
        const response = ListLookupNotifResponse(
          success: true,
          message: 'Success',
        );

        final json = response.toJson();
        expect(json['success'], isTrue);
        expect(json['message'], equals('Success'));
      });

      test('should deserialize from JSON', () {
        final json = {
          'success': true,
          'errorCode': null,
          'message': 'Success',
          'data': [],
        };

        final response = ListLookupNotifResponse.fromJson(json);
        expect(response.success, isTrue);
        expect(response.data, isEmpty);
      });
    });
  });

  group('TemplateLookupList Tests', () {
    group('Construction', () {
      test('should create lookup list with all parameters', () {
        const lookupList = TemplateLookupList(
          surveyId: 'survey_001',
          templateId: 'template_001',
          lookupType: 'region',
          lookupCode: 'code_001',
          lookupName: 'Province',
          lookupValue: {'id': '32', 'name': 'Jawa Barat'},
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
        );

        expect(lookupList.surveyId, equals('survey_001'));
        expect(lookupList.templateId, equals('template_001'));
        expect(lookupList.lookupType, equals('region'));
        expect(lookupList.lookupCode, equals('code_001'));
        expect(lookupList.lookupName, equals('Province'));
        expect(lookupList.lookupValue, isNotNull);
        expect(lookupList.isActive, isTrue);
      });
    });

    group('Equality', () {
      test('should be equal when all properties match', () {
        const lookupList1 = TemplateLookupList(
          surveyId: 'survey_001',
          templateId: 'template_001',
        );

        const lookupList2 = TemplateLookupList(
          surveyId: 'survey_001',
          templateId: 'template_001',
        );

        expect(lookupList1, equals(lookupList2));
        expect(lookupList1.hashCode, equals(lookupList2.hashCode));
      });
    });

    group('JSON Serialization', () {
      test('should serialize to JSON with snake_case', () {
        const lookupList = TemplateLookupList(
          surveyId: 'survey_001',
          templateId: 'template_001',
          lookupType: 'region',
          isActive: true,
        );

        final json = lookupList.toJson();
        expect(json['survey_id'], equals('survey_001'));
        expect(json['template_id'], equals('template_001'));
        expect(json['lookup_type'], equals('region'));
        expect(json['is_active'], isTrue);
      });

      test('should deserialize from JSON with snake_case', () {
        final json = {
          'survey_id': 'survey_001',
          'template_id': 'template_001',
          'lookup_type': 'region',
          'lookup_code': 'code_001',
          'is_active': true,
        };

        final lookupList = TemplateLookupList.fromJson(json);
        expect(lookupList.surveyId, equals('survey_001'));
        expect(lookupList.lookupType, equals('region'));
        expect(lookupList.isActive, isTrue);
      });

      test('should handle dynamic lookupValue', () {
        final json = {
          'survey_id': 'survey_001',
          'template_id': 'template_001',
          'lookup_value': {'id': '32', 'name': 'Jawa Barat'},
        };

        final lookupList = TemplateLookupList.fromJson(json);
        expect(lookupList.lookupValue, isA<Map>());
        expect((lookupList.lookupValue as Map)['name'], equals('Jawa Barat'));
      });
    });
  });
}
