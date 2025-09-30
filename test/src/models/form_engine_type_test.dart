import 'package:flutter_test/flutter_test.dart';
import 'package:form_gear_engine_sdk/src/models/form_engine_type.dart';

void main() {
  group('FormEngineType Tests', () {
    group('Enum Values', () {
      test('should have FormGear with ID 1', () {
        expect(FormEngineType.formGear.id, equals(1));
        expect(FormEngineType.formGear.displayName, equals('FormGear'));
      });

      test('should have FasihForm with ID 2', () {
        expect(FormEngineType.fasihForm.id, equals(2));
        expect(FormEngineType.fasihForm.displayName, equals('FasihForm'));
      });

      test('should have exactly two engine types', () {
        expect(FormEngineType.values.length, equals(2));
      });
    });

    group('fromId', () {
      test('should return FormGear for ID 1', () {
        final type = FormEngineType.fromId(1);

        expect(type, equals(FormEngineType.formGear));
      });

      test('should return FasihForm for ID 2', () {
        final type = FormEngineType.fromId(2);

        expect(type, equals(FormEngineType.fasihForm));
      });

      test('should return null for invalid ID', () {
        final type = FormEngineType.fromId(999);

        expect(type, isNull);
      });

      test('should return null for null ID', () {
        final type = FormEngineType.fromId(null);

        expect(type, isNull);
      });

      test('should return null for zero ID', () {
        final type = FormEngineType.fromId(0);

        expect(type, isNull);
      });

      test('should return null for negative ID', () {
        final type = FormEngineType.fromId(-1);

        expect(type, isNull);
      });
    });

    group('fromString', () {
      test('should return FormGear for string "1"', () {
        final type = FormEngineType.fromString('1');

        expect(type, equals(FormEngineType.formGear));
      });

      test('should return FasihForm for string "2"', () {
        final type = FormEngineType.fromString('2');

        expect(type, equals(FormEngineType.fasihForm));
      });

      test('should return null for invalid string', () {
        final type = FormEngineType.fromString('999');

        expect(type, isNull);
      });

      test('should return null for null string', () {
        final type = FormEngineType.fromString(null);

        expect(type, isNull);
      });

      test('should return null for empty string', () {
        final type = FormEngineType.fromString('');

        expect(type, isNull);
      });

      test('should return null for non-numeric string', () {
        final type = FormEngineType.fromString('abc');

        expect(type, isNull);
      });

      test('should handle leading/trailing whitespace', () {
        final type = FormEngineType.fromString(' 1 ');

        // int.tryParse handles whitespace correctly
        expect(type, equals(FormEngineType.formGear));
      });
    });

    group('toString', () {
      test('should return displayName for FormGear', () {
        final result = FormEngineType.formGear.toString();

        expect(result, equals('FormGear'));
      });

      test('should return displayName for FasihForm', () {
        final result = FormEngineType.fasihForm.toString();

        expect(result, equals('FasihForm'));
      });
    });

    group('FASIH Integration Scenarios', () {
      test('should identify FormGear engine from FASIH API response', () {
        // Simulate FASIH API returning engine ID 1
        const apiEngineId = 1;
        final engineType = FormEngineType.fromId(apiEngineId);

        expect(engineType, equals(FormEngineType.formGear));
        expect(engineType?.displayName, equals('FormGear'));
      });

      test('should identify FasihForm engine from FASIH API response', () {
        // Simulate FASIH API returning engine ID 2
        const apiEngineId = 2;
        final engineType = FormEngineType.fromId(apiEngineId);

        expect(engineType, equals(FormEngineType.fasihForm));
        expect(engineType?.displayName, equals('FasihForm'));
      });

      test('should parse engine ID from template metadata', () {
        // Simulate template metadata containing engine ID as string
        final templateMetadata = <String, dynamic>{
          'engine_id': '1',
          'template_name': 'Census 2024',
        };

        final engineType = FormEngineType.fromString(
          templateMetadata['engine_id'] as String?,
        );

        expect(engineType, equals(FormEngineType.formGear));
      });

      test('should handle engine selection for different surveys', () {
        // Business survey uses FormGear
        final businessEngineType = FormEngineType.fromId(1);
        expect(businessEngineType, equals(FormEngineType.formGear));

        // Population census uses FasihForm
        final censusEngineType = FormEngineType.fromId(2);
        expect(censusEngineType, equals(FormEngineType.fasihForm));
      });

      test('should provide display name for UI rendering', () {
        const engines = FormEngineType.values;

        for (final engine in engines) {
          expect(engine.displayName, isNotEmpty);
          expect(engine.toString(), equals(engine.displayName));
        }
      });
    });

    group('Edge Cases', () {
      test('should iterate through all engine types', () {
        const allTypes = FormEngineType.values;

        expect(allTypes, contains(FormEngineType.formGear));
        expect(allTypes, contains(FormEngineType.fasihForm));
      });

      test('should maintain unique IDs', () {
        final ids = FormEngineType.values.map((e) => e.id).toSet();

        expect(ids.length, equals(FormEngineType.values.length));
      });

      test('should maintain unique display names', () {
        final names = FormEngineType.values.map((e) => e.displayName).toSet();

        expect(names.length, equals(FormEngineType.values.length));
      });
    });
  });
}
