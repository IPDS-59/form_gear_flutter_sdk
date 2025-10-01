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

    group('shouldEncrypt Getter', () {
      test('should return true when config has encryption enabled', () {
        final encryptedContext = AssignmentContext(
          assignmentId: 'assignment_001',
          templateId: 'template_001',
          surveyId: 'survey_2024',
          config: AssignmentConfig.capi(isEncrypted: true),
          data: AssignmentData.empty(),
        );

        final data = SaveSubmitData.formGear(
          assignmentContext: encryptedContext,
          formData: '{}',
          remark: '{}',
          principal: '{}',
          reference: '{}',
          media: '{}',
          flag: 'submit',
        );

        expect(data.shouldEncrypt, isTrue);
      });

      test('should return false when config has encryption disabled', () {
        final unencryptedContext = AssignmentContext(
          assignmentId: 'assignment_001',
          templateId: 'template_001',
          surveyId: 'survey_2024',
          config: AssignmentConfig.capi(),
          data: AssignmentData.empty(),
        );

        final data = SaveSubmitData.formGear(
          assignmentContext: unencryptedContext,
          formData: '{}',
          remark: '{}',
          principal: '{}',
          reference: '{}',
          media: '{}',
          flag: 'submit',
        );

        expect(data.shouldEncrypt, isFalse);
      });

      test('should return encryption status from assignment config', () {
        final encryptedContext = AssignmentContext(
          assignmentId: 'assignment_001',
          templateId: 'template_001',
          surveyId: 'survey_2024',
          config: AssignmentConfig.cawi(isEncrypted: true),
          data: AssignmentData.empty(),
        );

        final data1 = SaveSubmitData.fasihForm(
          assignmentContext: encryptedContext,
          formData: '{}',
          remark: '{}',
          principal: '{}',
          flag: 'save',
        );

        final data2 = SaveSubmitData.fasihForm(
          assignmentContext: testContext,
          formData: '{}',
          remark: '{}',
          principal: '{}',
          flag: 'submit',
        );

        expect(data1.shouldEncrypt, isTrue);
        expect(data2.shouldEncrypt, isFalse);
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

      test('should handle null reference and media for FormGear', () {
        final data = SaveSubmitData(
          assignmentContext: testContext,
          formData: '{"test": 1}',
          remark: '{"note": "test"}',
          principal: '{"user": "test"}',
          flag: 'save',
        );

        final files = data.getFileData();

        expect(files, hasLength(3));
        expect(files.containsKey('data.json'), isTrue);
        expect(files.containsKey('remark.json'), isTrue);
        expect(files.containsKey('principal.json'), isTrue);
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

    group('JSON Serialization', () {
      test('should serialize FormGear data to JSON', () {
        final data = SaveSubmitData.formGear(
          assignmentContext: testContext,
          formData: '{"test": 1}',
          remark: '{"note": "test"}',
          principal: '{"user": "test"}',
          reference: '{"lookup": []}',
          media: '{"photos": []}',
          flag: 'save',
        );

        final json = data.toJson();

        expect(json['formData'], '{"test": 1}');
        expect(json['remark'], '{"note": "test"}');
        expect(json['principal'], '{"user": "test"}');
        expect(json['reference'], '{"lookup": []}');
        expect(json['media'], '{"photos": []}');
        expect(json['flag'], 'save');
        expect(json['engineType'], 'formGear');
        expect(json.containsKey('assignmentContext'), isTrue);
        expect(json.containsKey('timestamp'), isTrue);
      });

      test('should serialize FasihForm data to JSON', () {
        final data = SaveSubmitData.fasihForm(
          assignmentContext: testContext,
          formData: '{"test": 1}',
          remark: '{"note": "test"}',
          principal: '{"user": "test"}',
          flag: 'submit',
        );

        final json = data.toJson();

        expect(json['formData'], '{"test": 1}');
        expect(json['remark'], '{"note": "test"}');
        expect(json['principal'], '{"user": "test"}');
        expect(json['reference'], isNull);
        expect(json['media'], isNull);
        expect(json['flag'], 'submit');
        expect(json['engineType'], 'fasihForm');
        expect(json.containsKey('assignmentContext'), isTrue);
      });

      test('should include metadata in JSON serialization', () {
        final metadata = <String, dynamic>{'deviceId': 'device123'};
        final data = SaveSubmitData.formGear(
          assignmentContext: testContext,
          formData: '{}',
          remark: '{}',
          principal: '{}',
          reference: '{}',
          media: '{}',
          flag: 'save',
          metadata: metadata,
        );

        final json = data.toJson();

        expect(json['metadata'], equals(metadata));
      });

      test('should handle null optional fields in JSON', () {
        final data = SaveSubmitData.fasihForm(
          assignmentContext: testContext,
          formData: '{}',
          remark: '{}',
          principal: '{}',
          flag: 'save',
        );

        final json = data.toJson();

        expect(json['reference'], isNull);
        expect(json['media'], isNull);
        expect(json['metadata'], isNull);
      });
    });

    group('Timestamp Handling', () {
      test('should include timestamp in FormGear data', () {
        final beforeCreation = DateTime.now().subtract(
          const Duration(seconds: 1),
        );
        final data = SaveSubmitData.formGear(
          assignmentContext: testContext,
          formData: '{}',
          remark: '{}',
          principal: '{}',
          reference: '{}',
          media: '{}',
          flag: 'save',
        );
        final afterCreation = DateTime.now().add(const Duration(seconds: 1));

        expect(data.timestamp, isNotNull);
        expect(
          data.timestamp!.isAfter(beforeCreation) ||
              data.timestamp!.isAtSameMomentAs(beforeCreation),
          isTrue,
        );
        expect(
          data.timestamp!.isBefore(afterCreation) ||
              data.timestamp!.isAtSameMomentAs(afterCreation),
          isTrue,
        );
      });

      test('should include timestamp in FasihForm data', () {
        final beforeCreation = DateTime.now().subtract(
          const Duration(seconds: 1),
        );
        final data = SaveSubmitData.fasihForm(
          assignmentContext: testContext,
          formData: '{}',
          remark: '{}',
          principal: '{}',
          flag: 'submit',
        );
        final afterCreation = DateTime.now().add(const Duration(seconds: 1));

        expect(data.timestamp, isNotNull);
        expect(
          data.timestamp!.isAfter(beforeCreation) ||
              data.timestamp!.isAtSameMomentAs(beforeCreation),
          isTrue,
        );
        expect(
          data.timestamp!.isBefore(afterCreation) ||
              data.timestamp!.isAtSameMomentAs(afterCreation),
          isTrue,
        );
      });

      test('should preserve custom timestamp', () {
        final customTimestamp = DateTime(2024, 1, 15, 10, 30);
        final data = SaveSubmitData(
          assignmentContext: testContext,
          formData: '{}',
          remark: '{}',
          principal: '{}',
          flag: 'save',
          timestamp: customTimestamp,
        );

        expect(data.timestamp, equals(customTimestamp));
      });
    });

    group('Metadata Handling', () {
      test('should store and retrieve metadata', () {
        final metadata = <String, dynamic>{
          'deviceId': 'device123',
          'appVersion': '1.0.0',
          'platform': 'android',
        };

        final data = SaveSubmitData.formGear(
          assignmentContext: testContext,
          formData: '{}',
          remark: '{}',
          principal: '{}',
          reference: '{}',
          media: '{}',
          flag: 'save',
          metadata: metadata,
        );

        expect(data.metadata, isNotNull);
        expect(data.metadata!['deviceId'], 'device123');
        expect(data.metadata!['appVersion'], '1.0.0');
        expect(data.metadata!['platform'], 'android');
      });

      test('should handle null metadata', () {
        final data = SaveSubmitData.formGear(
          assignmentContext: testContext,
          formData: '{}',
          remark: '{}',
          principal: '{}',
          reference: '{}',
          media: '{}',
          flag: 'save',
        );

        expect(data.metadata, isNull);
      });

      test('should preserve metadata in copyWith', () {
        final metadata = <String, dynamic>{'key': 'value'};
        final original = SaveSubmitData.formGear(
          assignmentContext: testContext,
          formData: '{}',
          remark: '{}',
          principal: '{}',
          reference: '{}',
          media: '{}',
          flag: 'save',
          metadata: metadata,
        );

        final copy = original.copyWith(flag: 'submit');

        expect(copy.metadata, equals(metadata));
      });

      test('should update metadata in copyWith', () {
        final metadata1 = <String, dynamic>{'key': 'value1'};
        final metadata2 = <String, dynamic>{'key': 'value2'};

        final original = SaveSubmitData.formGear(
          assignmentContext: testContext,
          formData: '{}',
          remark: '{}',
          principal: '{}',
          reference: '{}',
          media: '{}',
          flag: 'save',
          metadata: metadata1,
        );

        final copy = original.copyWith(metadata: metadata2);

        expect(copy.metadata!['key'], 'value2');
        expect(original.metadata!['key'], 'value1');
      });
    });

    group('Equality', () {
      test('should be equal with same properties and timestamp', () {
        final timestamp = DateTime(2024, 1, 15, 10, 30);

        final data1 = SaveSubmitData(
          assignmentContext: testContext,
          formData: '{"test": 1}',
          remark: '{}',
          principal: '{}',
          reference: '{}',
          media: '{}',
          flag: 'save',
          timestamp: timestamp,
        );

        final data2 = SaveSubmitData(
          assignmentContext: testContext,
          formData: '{"test": 1}',
          remark: '{}',
          principal: '{}',
          reference: '{}',
          media: '{}',
          flag: 'save',
          timestamp: timestamp,
        );

        expect(data1, equals(data2));
      });

      test('should not be equal with different flags', () {
        final data1 = SaveSubmitData.formGear(
          assignmentContext: testContext,
          formData: '{}',
          remark: '{}',
          principal: '{}',
          reference: '{}',
          media: '{}',
          flag: 'save',
        );

        final data2 = data1.copyWith(flag: 'submit');

        expect(data1, isNot(equals(data2)));
      });

      test('should not be equal with different engine types', () {
        final data1 = SaveSubmitData.formGear(
          assignmentContext: testContext,
          formData: '{}',
          remark: '{}',
          principal: '{}',
          reference: '{}',
          media: '{}',
          flag: 'save',
        );

        final data2 = SaveSubmitData.fasihForm(
          assignmentContext: testContext,
          formData: '{}',
          remark: '{}',
          principal: '{}',
          flag: 'save',
        );

        expect(data1, isNot(equals(data2)));
      });

      test('should have consistent hashCode', () {
        final timestamp = DateTime(2024, 1, 15, 10, 30);

        final data1 = SaveSubmitData(
          assignmentContext: testContext,
          formData: '{"test": 1}',
          remark: '{}',
          principal: '{}',
          reference: '{}',
          media: '{}',
          flag: 'save',
          timestamp: timestamp,
        );

        final data2 = SaveSubmitData(
          assignmentContext: testContext,
          formData: '{"test": 1}',
          remark: '{}',
          principal: '{}',
          reference: '{}',
          media: '{}',
          flag: 'save',
          timestamp: timestamp,
        );

        expect(data1.hashCode, equals(data2.hashCode));
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

      test('should show engine type in string representation', () {
        final formGearData = SaveSubmitData.formGear(
          assignmentContext: testContext,
          formData: '{}',
          remark: '{}',
          principal: '{}',
          reference: '{}',
          media: '{}',
          flag: 'save',
        );

        final fasihFormData = SaveSubmitData.fasihForm(
          assignmentContext: testContext,
          formData: '{}',
          remark: '{}',
          principal: '{}',
          flag: 'save',
        );

        expect(formGearData.toString(), contains('formGear'));
        expect(fasihFormData.toString(), contains('fasihForm'));
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
