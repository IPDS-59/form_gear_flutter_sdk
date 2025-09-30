import 'package:flutter_test/flutter_test.dart';
import 'package:form_gear_engine_sdk/src/core/config/form_config.dart';

void main() {
  group('FormConfig Tests', () {
    group('Construction', () {
      test('should create form config with required parameters', () {
        const config = FormConfig(formId: 'form_001');

        expect(config.formId, equals('form_001'));
        expect(config.template, isNull);
        expect(config.validation, isNull);
        expect(config.preset, isNull);
        expect(config.response, isNull);
        expect(config.media, isNull);
        expect(config.reference, isNull);
        expect(config.remark, isNull);
        expect(config.formMode, equals(1));
        expect(config.isNew, equals(1));
        expect(config.principals, isNull);
        expect(config.additionalData, isEmpty);
      });

      test('should create form config with all parameters', () {
        const template = <String, dynamic>{'fields': []};
        const validation = <String, dynamic>{'rules': []};
        const preset = <String, dynamic>{'defaultValue': 'test'};
        const response = <String, dynamic>{'answers': []};
        const media = <String, dynamic>{'photos': []};
        const reference = <String, dynamic>{'lookup': []};
        const remark = <String, dynamic>{'notes': 'test note'};
        const principals = <Map<String, dynamic>>[
          {'name': 'user1'},
        ];
        const additionalData = <String, dynamic>{'custom': 'data'};

        const config = FormConfig(
          formId: 'form_001',
          template: template,
          validation: validation,
          preset: preset,
          response: response,
          media: media,
          reference: reference,
          remark: remark,
          formMode: 2,
          isNew: 0,
          principals: principals,
          additionalData: additionalData,
        );

        expect(config.formId, equals('form_001'));
        expect(config.template, equals(template));
        expect(config.validation, equals(validation));
        expect(config.preset, equals(preset));
        expect(config.response, equals(response));
        expect(config.media, equals(media));
        expect(config.reference, equals(reference));
        expect(config.remark, equals(remark));
        expect(config.formMode, equals(2));
        expect(config.isNew, equals(0));
        expect(config.principals, equals(principals));
        expect(config.additionalData, equals(additionalData));
      });
    });

    group('copyWith', () {
      test('should create copy with modified formId', () {
        const original = FormConfig(formId: 'form_001');

        final copy = original.copyWith(formId: 'form_002');

        expect(copy.formId, equals('form_002'));
        expect(copy.formMode, equals(original.formMode));
        expect(copy.isNew, equals(original.isNew));
      });

      test('should create copy with modified template', () {
        const original = FormConfig(
          formId: 'form_001',
          template: <String, dynamic>{'old': 'template'},
        );

        final copy = original.copyWith(
          template: const <String, dynamic>{'new': 'template'},
        );

        expect(
          copy.template,
          equals(const <String, dynamic>{'new': 'template'}),
        );
        expect(copy.formId, equals(original.formId));
      });

      test('should create copy with modified formMode and isNew', () {
        const original = FormConfig(
          formId: 'form_001',
          formMode: 1,
          isNew: 1,
        );

        final copy = original.copyWith(
          formMode: 2,
          isNew: 0,
        );

        expect(copy.formMode, equals(2));
        expect(copy.isNew, equals(0));
        expect(copy.formId, equals(original.formId));
      });

      test('should keep original values when not specified', () {
        const original = FormConfig(
          formId: 'form_001',
          template: <String, dynamic>{'fields': []},
          validation: <String, dynamic>{'rules': []},
          formMode: 2,
          isNew: 0,
        );

        final copy = original.copyWith(
          response: const <String, dynamic>{'answers': []},
        );

        expect(copy.formId, equals(original.formId));
        expect(copy.template, equals(original.template));
        expect(copy.validation, equals(original.validation));
        expect(copy.formMode, equals(original.formMode));
        expect(copy.isNew, equals(original.isNew));
        expect(copy.response, equals(const <String, dynamic>{'answers': []}));
      });
    });

    group('Equality', () {
      test('should be equal when all properties match', () {
        const config1 = FormConfig(
          formId: 'form_001',
          template: <String, dynamic>{'fields': []},
          formMode: 1,
        );
        const config2 = FormConfig(
          formId: 'form_001',
          template: <String, dynamic>{'fields': []},
          formMode: 1,
        );

        expect(config1, equals(config2));
        expect(config1.hashCode, equals(config2.hashCode));
      });

      test('should not be equal when formId differs', () {
        const config1 = FormConfig(formId: 'form_001');
        const config2 = FormConfig(formId: 'form_002');

        expect(config1, isNot(equals(config2)));
      });

      test('should not be equal when template differs', () {
        const config1 = FormConfig(
          formId: 'form_001',
          template: <String, dynamic>{'a': 1},
        );
        const config2 = FormConfig(
          formId: 'form_001',
          template: <String, dynamic>{'b': 2},
        );

        expect(config1, isNot(equals(config2)));
      });

      test('should not be equal when formMode differs', () {
        const config1 = FormConfig(
          formId: 'form_001',
          formMode: 1,
        );
        const config2 = FormConfig(
          formId: 'form_001',
          formMode: 2,
        );

        expect(config1, isNot(equals(config2)));
      });
    });

    group('Form States', () {
      test('should represent new form state', () {
        const config = FormConfig(
          formId: 'form_001',
          formMode: 1,
          isNew: 1,
        );

        expect(config.isNew, equals(1));
        expect(config.formMode, equals(1));
      });

      test('should represent existing form in edit mode', () {
        const config = FormConfig(
          formId: 'form_001',
          formMode: 2,
          isNew: 0,
          response: <String, dynamic>{'existing': 'data'},
        );

        expect(config.isNew, equals(0));
        expect(config.formMode, equals(2));
        expect(config.response, isNotNull);
      });

      test('should represent form with validation rules', () {
        const config = FormConfig(
          formId: 'form_001',
          validation: <String, dynamic>{
            'rules': [
              {'field': 'name', 'required': true},
            ],
          },
        );

        expect(config.validation, isNotNull);
        expect(config.validation?['rules'], isA<List>());
      });

      test('should represent form with preset values', () {
        const config = FormConfig(
          formId: 'form_001',
          preset: <String, dynamic>{
            'country': 'Indonesia',
            'province': 'Jawa Barat',
          },
        );

        expect(config.preset, isNotNull);
        expect(config.preset?['country'], equals('Indonesia'));
      });
    });

    group('FASIH Integration Scenarios', () {
      test('should configure for new FASIH form entry', () {
        const config = FormConfig(
          formId: 'assignment_12345',
          template: <String, dynamic>{
            'template_id': 'census_2024',
            'version': '1.0.0',
          },
          validation: <String, dynamic>{
            'rules': [],
          },
          reference: <String, dynamic>{
            'lookup_data': [],
          },
          formMode: 1,
          isNew: 1,
        );

        expect(config.formId, equals('assignment_12345'));
        expect(config.isNew, equals(1));
        expect(config.template?['template_id'], equals('census_2024'));
        expect(config.reference, isNotNull);
      });

      test('should configure for editing existing FASIH response', () {
        const config = FormConfig(
          formId: 'assignment_12345',
          template: <String, dynamic>{'template_id': 'census_2024'},
          response: <String, dynamic>{
            'household_size': 4,
            'income_level': 'medium',
          },
          media: <String, dynamic>{
            'photos': ['photo1.jpg', 'photo2.jpg'],
          },
          remark: <String, dynamic>{
            'notes': 'Follow-up required',
            'status': 'in_progress',
          },
          formMode: 2,
          isNew: 0,
        );

        expect(config.isNew, equals(0));
        expect(config.formMode, equals(2));
        expect(config.response?['household_size'], equals(4));
        expect(config.media?['photos'], hasLength(2));
      });

      test('should configure with principal/enumerator data', () {
        const config = FormConfig(
          formId: 'assignment_12345',
          principals: <Map<String, dynamic>>[
            {
              'nip': '123456789',
              'name': 'John Doe',
              'role': 'ENUMERATOR',
            },
            {
              'nip': '987654321',
              'name': 'Jane Smith',
              'role': 'SUPERVISOR',
            },
          ],
          additionalData: <String, dynamic>{
            'survey_id': 'census_2024',
            'region_code': '3200',
          },
        );

        expect(config.principals, hasLength(2));
        expect(config.principals?[0]['role'], equals('ENUMERATOR'));
        expect(config.additionalData['survey_id'], equals('census_2024'));
      });

      test('should support offline data collection with reference data', () {
        const config = FormConfig(
          formId: 'offline_form_001',
          template: <String, dynamic>{'offline_mode': true},
          reference: <String, dynamic>{
            'villages': [
              {'code': '001', 'name': 'Village A'},
              {'code': '002', 'name': 'Village B'},
            ],
            'occupations': [
              {'code': '01', 'name': 'Farmer'},
              {'code': '02', 'name': 'Teacher'},
            ],
          },
          formMode: 1,
        );

        expect(config.reference?['villages'], hasLength(2));
        expect(config.reference?['occupations'], hasLength(2));
      });
    });

    group('Data Composition', () {
      test('should handle complex nested data structures', () {
        const config = FormConfig(
          formId: 'complex_form',
          template: <String, dynamic>{
            'sections': [
              {
                'id': 'section1',
                'fields': [
                  {'name': 'field1', 'type': 'text'},
                  {'name': 'field2', 'type': 'number'},
                ],
              },
            ],
          },
          response: <String, dynamic>{
            'section1': {
              'field1': 'Answer 1',
              'field2': 42,
            },
          },
        );

        expect(config.template?['sections'], isA<List>());
        expect(config.response?['section1'], isA<Map>());
      });

      test('should handle empty optional fields', () {
        const config = FormConfig(formId: 'minimal_form');

        expect(config.template, isNull);
        expect(config.validation, isNull);
        expect(config.preset, isNull);
        expect(config.response, isNull);
        expect(config.media, isNull);
        expect(config.reference, isNull);
        expect(config.remark, isNull);
        expect(config.principals, isNull);
      });
    });
  });
}
