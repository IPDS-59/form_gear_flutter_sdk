import 'package:flutter_test/flutter_test.dart';
import 'package:form_gear_engine_sdk/src/models/form_engine_entity.dart';
import 'package:form_gear_engine_sdk/src/models/form_engine_response.dart';
import 'package:form_gear_engine_sdk/src/models/form_engine_type.dart';

void main() {
  group('FormEngineResponse Tests', () {
    group('Construction', () {
      test('should create response with all parameters', () {
        const entity = FormEngineEntity(
          formEngineId: 1,
          version: '1.0.0',
        );

        const response = FormEngineResponse(
          success: true,
          errorCode: 200,
          message: 'Success',
          data: entity,
        );

        expect(response.success, isTrue);
        expect(response.errorCode, equals(200));
        expect(response.message, equals('Success'));
        expect(response.data, equals(entity));
      });

      test('should create response with null values', () {
        const response = FormEngineResponse();

        expect(response.success, isNull);
        expect(response.errorCode, isNull);
        expect(response.message, isNull);
        expect(response.data, isNull);
      });
    });

    group('Equality', () {
      test('should be equal when all properties match', () {
        const entity = FormEngineEntity(formEngineId: 1);

        const response1 = FormEngineResponse(
          success: true,
          message: 'Success',
          data: entity,
        );
        const response2 = FormEngineResponse(
          success: true,
          message: 'Success',
          data: entity,
        );

        expect(response1, equals(response2));
      });

      test('should not be equal when success differs', () {
        const response1 = FormEngineResponse(success: true);
        const response2 = FormEngineResponse(success: false);

        expect(response1, isNot(equals(response2)));
      });

      test('should not be equal when message differs', () {
        const response1 = FormEngineResponse(message: 'Success');
        const response2 = FormEngineResponse(message: 'Error');

        expect(response1, isNot(equals(response2)));
      });
    });

    group('JSON Serialization', () {
      test('should serialize to JSON', () {
        const entity = FormEngineEntity(
          formEngineId: 1,
          version: '1.0.0',
          linkDownload: 'https://example.com/download',
        );

        const response = FormEngineResponse(
          success: true,
          errorCode: 200,
          message: 'Success',
          data: entity,
        );

        final json = response.toJson();

        expect(json['success'], isTrue);
        expect(json['errorCode'], equals(200));
        expect(json['message'], equals('Success'));
        expect(json['data'], isNotNull);
        expect(
          (json['data'] as Map<String, dynamic>)['formEngineId'],
          equals(1),
        );
      });

      test('should deserialize from JSON', () {
        final json = <String, dynamic>{
          'success': true,
          'errorCode': 200,
          'message': 'Engine available',
          'data': <String, dynamic>{
            'formEngineId': 2,
            'version': '2.0.0',
            'linkDownload': 'https://fasih.bps.go.id/engine/2',
            'isForce': true,
            'isDefault': false,
          },
        };

        final response = FormEngineResponse.fromJson(json);

        expect(response.success, isTrue);
        expect(response.errorCode, equals(200));
        expect(response.message, equals('Engine available'));
        expect(response.data?.formEngineId, equals(2));
        expect(response.data?.version, equals('2.0.0'));
        expect(response.data?.isForce, isTrue);
      });
    });

    group('FASIH Integration Scenarios', () {
      test('should handle successful engine check response', () {
        final json = <String, dynamic>{
          'success': true,
          'errorCode': 200,
          'message': 'FormGear engine is up to date',
          'data': <String, dynamic>{
            'formEngineId': 1,
            'version': '3.5.0',
            'linkDownload':
                'https://fasih-api.bps.go.id/engines/formgear-3.5.0.zip',
            'isForce': false,
            'isDefault': true,
          },
        };

        final response = FormEngineResponse.fromJson(json);

        expect(response.success, isTrue);
        expect(response.data?.formEngineId, equals(1));
        expect(response.data?.engineType, equals(FormEngineType.formGear));
        expect(response.data?.isForce, isFalse);
      });

      test('should handle force update response', () {
        final json = <String, dynamic>{
          'success': true,
          'errorCode': 200,
          'message': 'Update required',
          'data': <String, dynamic>{
            'formEngineId': 2,
            'version': '4.0.0',
            'linkDownload':
                'https://fasih-api.bps.go.id/engines/fasihform-4.0.0.zip',
            'isForce': true,
            'message': 'Critical security update available',
          },
        };

        final response = FormEngineResponse.fromJson(json);

        expect(response.data?.isForce, isTrue);
        expect(response.data?.engineType, equals(FormEngineType.fasihForm));
        expect(response.data?.message, contains('security'));
      });

      test('should handle error response from API', () {
        final json = <String, dynamic>{
          'success': false,
          'errorCode': 404,
          'message': 'Engine not found',
          'data': null,
        };

        final response = FormEngineResponse.fromJson(json);

        expect(response.success, isFalse);
        expect(response.errorCode, equals(404));
        expect(response.message, equals('Engine not found'));
        expect(response.data, isNull);
      });
    });
  });

  group('FormEngineEntity Tests', () {
    group('Construction', () {
      test('should create entity with all parameters', () {
        const entity = FormEngineEntity(
          isForce: true,
          formEngineId: 1,
          userIds: <Object>[123, 456],
          linkDownload: 'https://example.com/download',
          modifiedBy: 'admin',
          basePath: '/engines/formgear',
          id: 'engine-001',
          message: 'Update available',
          isDefault: true,
          version: '3.5.0',
        );

        expect(entity.isForce, isTrue);
        expect(entity.formEngineId, equals(1));
        expect(entity.userIds, hasLength(2));
        expect(entity.linkDownload, equals('https://example.com/download'));
        expect(entity.modifiedBy, equals('admin'));
        expect(entity.basePath, equals('/engines/formgear'));
        expect(entity.id, equals('engine-001'));
        expect(entity.message, equals('Update available'));
        expect(entity.isDefault, isTrue);
        expect(entity.version, equals('3.5.0'));
      });

      test('should create entity with null values', () {
        const entity = FormEngineEntity();

        expect(entity.isForce, isNull);
        expect(entity.formEngineId, isNull);
        expect(entity.userIds, isNull);
        expect(entity.linkDownload, isNull);
        expect(entity.version, isNull);
      });
    });

    group('engineType', () {
      test('should return FormGear for engine ID 1', () {
        const entity = FormEngineEntity(formEngineId: 1);

        expect(entity.engineType, equals(FormEngineType.formGear));
      });

      test('should return FasihForm for engine ID 2', () {
        const entity = FormEngineEntity(formEngineId: 2);

        expect(entity.engineType, equals(FormEngineType.fasihForm));
      });

      test('should return null for invalid engine ID', () {
        const entity = FormEngineEntity(formEngineId: 999);

        expect(entity.engineType, isNull);
      });

      test('should return null when formEngineId is null', () {
        const entity = FormEngineEntity();

        expect(entity.engineType, isNull);
      });
    });

    group('copyWith', () {
      test('should create copy with modified values', () {
        const original = FormEngineEntity(
          formEngineId: 1,
          version: '1.0.0',
          isForce: false,
        );

        final copy = original.copyWith(
          version: '2.0.0',
          isForce: true,
        );

        expect(copy.formEngineId, equals(original.formEngineId));
        expect(copy.version, equals('2.0.0'));
        expect(copy.isForce, isTrue);
      });

      test('should keep original values when not specified', () {
        const original = FormEngineEntity(
          formEngineId: 1,
          version: '1.0.0',
          linkDownload: 'https://example.com',
          isForce: false,
        );

        final copy = original.copyWith(version: '2.0.0');

        expect(copy.formEngineId, equals(original.formEngineId));
        expect(copy.linkDownload, equals(original.linkDownload));
        expect(copy.isForce, equals(original.isForce));
        expect(copy.version, equals('2.0.0'));
      });
    });

    group('toString', () {
      test('should return formatted string representation', () {
        const entity = FormEngineEntity(
          formEngineId: 1,
          version: '1.0.0',
          isForce: true,
        );

        final str = entity.toString();

        expect(str, contains('FormEngineEntity'));
        expect(str, contains('formEngineId: 1'));
        expect(str, contains('version: 1.0.0'));
        expect(str, contains('isForce: true'));
      });
    });

    group('Equality', () {
      test('should be equal when all properties match', () {
        const entity1 = FormEngineEntity(
          formEngineId: 1,
          version: '1.0.0',
        );
        const entity2 = FormEngineEntity(
          formEngineId: 1,
          version: '1.0.0',
        );

        expect(entity1, equals(entity2));
      });

      test('should not be equal when formEngineId differs', () {
        const entity1 = FormEngineEntity(formEngineId: 1);
        const entity2 = FormEngineEntity(formEngineId: 2);

        expect(entity1, isNot(equals(entity2)));
      });

      test('should not be equal when version differs', () {
        const entity1 = FormEngineEntity(
          formEngineId: 1,
          version: '1.0.0',
        );
        const entity2 = FormEngineEntity(
          formEngineId: 1,
          version: '2.0.0',
        );

        expect(entity1, isNot(equals(entity2)));
      });
    });

    group('JSON Serialization', () {
      test('should serialize to JSON', () {
        const entity = FormEngineEntity(
          formEngineId: 1,
          version: '3.5.0',
          linkDownload: 'https://example.com/download',
          isForce: true,
          isDefault: false,
        );

        final json = entity.toJson();

        expect(json['formEngineId'], equals(1));
        expect(json['version'], equals('3.5.0'));
        expect(json['linkDownload'], equals('https://example.com/download'));
        expect(json['isForce'], isTrue);
        expect(json['isDefault'], isFalse);
      });

      test('should deserialize from JSON', () {
        final json = <String, dynamic>{
          'formEngineId': 2,
          'version': '4.0.0',
          'linkDownload': 'https://fasih.bps.go.id/engine',
          'isForce': false,
          'isDefault': true,
          'userIds': <Object>[1, 2, 3],
          'modifiedBy': 'system',
          'basePath': '/var/engines',
          'id': 'eng-002',
          'message': 'Latest version',
        };

        final entity = FormEngineEntity.fromJson(json);

        expect(entity.formEngineId, equals(2));
        expect(entity.version, equals('4.0.0'));
        expect(entity.isForce, isFalse);
        expect(entity.isDefault, isTrue);
        expect(entity.userIds, hasLength(3));
        expect(entity.modifiedBy, equals('system'));
      });
    });
  });
}
