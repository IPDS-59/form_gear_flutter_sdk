import 'package:flutter_test/flutter_test.dart';
import 'package:form_gear_engine_sdk/src/core/listeners/save_submit_data.dart';
import 'package:form_gear_engine_sdk/src/models/assignment_context.dart';

void main() {
  group('SaveSubmitData Tests', () {
    late AssignmentContext testContext;

    setUp(() {
      testContext = AssignmentContext(
        assignmentId: 'assignment_001',
        templateId: 'template_001',
        surveyId: 'survey_2024',
        config: AssignmentConfig.capi(),
        data: AssignmentData.empty(),
      );
    });

    group('Factory Constructors', () {
      test('should create FormGear data with all parameters', () {
        final data = SaveSubmitData.formGear(
          assignmentContext: testContext,
          formData: '{"answer": "test"}',
          remark: '{"note": "test note"}',
          principal: '{"user": "test"}',
          reference: '{"lookup": []}',
          media: '{"photos": []}',
          flag: 'save',
        );

        expect(data.engineType, SaveSubmitEngineType.formGear);
        expect(data.isFormGear, isTrue);
        expect(data.isFasihForm, isFalse);
        expect(data.reference, isNotNull);
        expect(data.media, isNotNull);
      });

      test('should create FasihForm data without reference and media', () {
        final data = SaveSubmitData.fasihForm(
          assignmentContext: testContext,
          formData: '{"answer": "test"}',
          remark: '{"note": "test note"}',
          principal: '{"user": "test"}',
          flag: 'submit',
        );

        expect(data.engineType, SaveSubmitEngineType.fasihForm);
        expect(data.isFasihForm, isTrue);
        expect(data.isFormGear, isFalse);
        expect(data.reference, isNull);
        expect(data.media, isNull);
      });
    });

    group('Convenience Getters', () {
      test('should provide assignment context shortcuts', () {
        final data = SaveSubmitData.formGear(
          assignmentContext: testContext,
          formData: '{}',
          remark: '{}',
          principal: '{}',
          reference: '{}',
          media: '{}',
          flag: 'save',
        );

        expect(data.assignmentId, 'assignment_001');
        expect(data.templateId, 'template_001');
        expect(data.surveyId, 'survey_2024');
        expect(data.config, testContext.config);
      });
    });

    group('Operation Flags', () {
      test('should identify save operations', () {
        final saveData = SaveSubmitData.formGear(
          assignmentContext: testContext,
          formData: '{}',
          remark: '{}',
          principal: '{}',
          reference: '{}',
          media: '{}',
          flag: 'save',
        );

        final draftData = saveData.copyWith(flag: 'draft');

        expect(saveData.isSave, isTrue);
        expect(saveData.isSubmit, isFalse);
        expect(draftData.isSave, isTrue);
      });

      test('should identify submit operations', () {
        final submitData = SaveSubmitData.formGear(
          assignmentContext: testContext,
          formData: '{}',
          remark: '{}',
          principal: '{}',
          reference: '{}',
          media: '{}',
          flag: 'submit',
        );

        final finalData = submitData.copyWith(flag: 'final');

        expect(submitData.isSubmit, isTrue);
        expect(submitData.isSave, isFalse);
        expect(finalData.isSubmit, isTrue);
      });

      test('should handle case-insensitive flags', () {
        final data = SaveSubmitData.formGear(
          assignmentContext: testContext,
          formData: '{}',
          remark: '{}',
          principal: '{}',
          reference: '{}',
          media: '{}',
          flag: 'SAVE',
        );

        expect(data.isSave, isTrue);
      });
    });

    group('getFileData', () {
      test('should return all files for FormGear', () {
        final data = SaveSubmitData.formGear(
          assignmentContext: testContext,
          formData: '{"test": 1}',
          remark: '{"note": "test"}',
          principal: '{"user": "test"}',
          reference: '{"lookup": []}',
          media: '{"photos": []}',
          flag: 'save',
        );

        final files = data.getFileData();

        expect(files, hasLength(5));
        expect(files['data.json'], '{"test": 1}');
        expect(files['remark.json'], '{"note": "test"}');
        expect(files['principal.json'], '{"user": "test"}');
        expect(files['reference.json'], '{"lookup": []}');
        expect(files['media.json'], '{"photos": []}');
      });

      test('should return only required files for FasihForm', () {
        final data = SaveSubmitData.fasihForm(
          assignmentContext: testContext,
          formData: '{"test": 1}',
          remark: '{"note": "test"}',
          principal: '{"user": "test"}',
          flag: 'save',
        );

        final files = data.getFileData();

        expect(files, hasLength(3));
        expect(files['data.json'], isNotNull);
        expect(files['remark.json'], isNotNull);
        expect(files['principal.json'], isNotNull);
        expect(files.containsKey('reference.json'), isFalse);
        expect(files.containsKey('media.json'), isFalse);
      });
    });

    group('getFasihDirectoryPath', () {
      test('should return FASIH-compatible path', () {
        final data = SaveSubmitData.formGear(
          assignmentContext: testContext,
          formData: '{}',
          remark: '{}',
          principal: '{}',
          reference: '{}',
          media: '{}',
          flag: 'save',
        );

        final path = data.getFasihDirectoryPath();

        expect(path, 'BPS/assignments/assignment_001/');
      });
    });

    group('copyWith', () {
      test('should create copy with modified flag', () {
        final original = SaveSubmitData.formGear(
          assignmentContext: testContext,
          formData: '{}',
          remark: '{}',
          principal: '{}',
          reference: '{}',
          media: '{}',
          flag: 'save',
        );

        final copy = original.copyWith(flag: 'submit');

        expect(copy.flag, 'submit');
        expect(copy.formData, original.formData);
      });
    });

    group('toString', () {
      test('should provide readable string representation', () {
        final data = SaveSubmitData.formGear(
          assignmentContext: testContext,
          formData: '{}',
          remark: '{}',
          principal: '{}',
          reference: '{}',
          media: '{}',
          flag: 'save',
        );

        final str = data.toString();

        expect(str, contains('assignment_001'));
        expect(str, contains('template_001'));
        expect(str, contains('save'));
      });
    });
  });

  group('SaveSubmitEngineType Tests', () {
    test('should have correct display names', () {
      expect(
        SaveSubmitEngineType.formGear.displayName,
        'FormGear (ID: 1)',
      );
      expect(
        SaveSubmitEngineType.fasihForm.displayName,
        'FasihForm (ID: 2)',
      );
    });

    test('should have correct engine IDs', () {
      expect(SaveSubmitEngineType.formGear.engineId, '1');
      expect(SaveSubmitEngineType.fasihForm.engineId, '2');
    });
  });
}
