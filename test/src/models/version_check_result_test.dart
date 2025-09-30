import 'package:flutter_test/flutter_test.dart';
import 'package:form_gear_engine_sdk/src/models/form_engine_entity.dart';
import 'package:form_gear_engine_sdk/src/models/version_check_result.dart';
import 'package:form_gear_engine_sdk/src/models/version_state.dart';

void main() {
  group('VersionCheckResult Tests', () {
    group('Construction', () {
      test('should create result with all parameters', () {
        const formEngine = FormEngineEntity(
          formEngineId: 1,
          version: '2.0.0',
        );

        const result = VersionCheckResult(
          state: VersionState.outdated,
          formEngine: formEngine,
          localVersion: '1.0.0',
          remoteVersion: '2.0.0',
        );

        expect(result.state, equals(VersionState.outdated));
        expect(result.formEngine, equals(formEngine));
        expect(result.localVersion, equals('1.0.0'));
        expect(result.remoteVersion, equals('2.0.0'));
      });

      test('should create result with missing state', () {
        const formEngine = FormEngineEntity(
          formEngineId: 1,
          version: '1.0.0',
        );

        const result = VersionCheckResult(
          state: VersionState.missing,
          formEngine: formEngine,
          remoteVersion: '1.0.0',
        );

        expect(result.state, equals(VersionState.missing));
        expect(result.localVersion, isNull);
        expect(result.remoteVersion, equals('1.0.0'));
      });

      test('should create result with current state', () {
        const formEngine = FormEngineEntity(
          formEngineId: 1,
          version: '1.0.0',
        );

        const result = VersionCheckResult(
          state: VersionState.current,
          formEngine: formEngine,
          localVersion: '1.0.0',
          remoteVersion: '1.0.0',
        );

        expect(result.state, equals(VersionState.current));
        expect(result.localVersion, equals('1.0.0'));
        expect(result.remoteVersion, equals('1.0.0'));
      });
    });

    group('needsDownload getter', () {
      test('should return true for missing state', () {
        const formEngine = FormEngineEntity(formEngineId: 1);
        const result = VersionCheckResult(
          state: VersionState.missing,
          formEngine: formEngine,
        );

        expect(result.needsDownload, isTrue);
      });

      test('should return true for outdated state', () {
        const formEngine = FormEngineEntity(formEngineId: 1);
        const result = VersionCheckResult(
          state: VersionState.outdated,
          formEngine: formEngine,
          localVersion: '1.0.0',
          remoteVersion: '2.0.0',
        );

        expect(result.needsDownload, isTrue);
      });

      test('should return false for current state', () {
        const formEngine = FormEngineEntity(formEngineId: 1);
        const result = VersionCheckResult(
          state: VersionState.current,
          formEngine: formEngine,
          localVersion: '1.0.0',
          remoteVersion: '1.0.0',
        );

        expect(result.needsDownload, isFalse);
      });
    });

    group('isForced getter', () {
      test('should return true when formEngine.isForce is true', () {
        const formEngine = FormEngineEntity(
          formEngineId: 1,
          isForce: true,
        );
        const result = VersionCheckResult(
          state: VersionState.outdated,
          formEngine: formEngine,
        );

        expect(result.isForced, isTrue);
      });

      test('should return false when formEngine.isForce is false', () {
        const formEngine = FormEngineEntity(
          formEngineId: 1,
          isForce: false,
        );
        const result = VersionCheckResult(
          state: VersionState.outdated,
          formEngine: formEngine,
        );

        expect(result.isForced, isFalse);
      });

      test('should return false when formEngine.isForce is null', () {
        const formEngine = FormEngineEntity(formEngineId: 1);
        const result = VersionCheckResult(
          state: VersionState.outdated,
          formEngine: formEngine,
        );

        expect(result.isForced, isFalse);
      });
    });

    group('isUpdate getter', () {
      test('should return true for outdated state', () {
        const formEngine = FormEngineEntity(formEngineId: 1);
        const result = VersionCheckResult(
          state: VersionState.outdated,
          formEngine: formEngine,
        );

        expect(result.isUpdate, isTrue);
      });

      test('should return false for missing state', () {
        const formEngine = FormEngineEntity(formEngineId: 1);
        const result = VersionCheckResult(
          state: VersionState.missing,
          formEngine: formEngine,
        );

        expect(result.isUpdate, isFalse);
      });

      test('should return false for current state', () {
        const formEngine = FormEngineEntity(formEngineId: 1);
        const result = VersionCheckResult(
          state: VersionState.current,
          formEngine: formEngine,
        );

        expect(result.isUpdate, isFalse);
      });
    });

    group('engineDisplayName getter', () {
      test('should return FormGear for engine ID 1', () {
        const formEngine = FormEngineEntity(
          formEngineId: 1,
        );
        const result = VersionCheckResult(
          state: VersionState.current,
          formEngine: formEngine,
        );

        expect(result.engineDisplayName, equals('FormGear'));
      });

      test('should return FasihForm for engine ID 2', () {
        const formEngine = FormEngineEntity(
          formEngineId: 2,
        );
        const result = VersionCheckResult(
          state: VersionState.current,
          formEngine: formEngine,
        );

        expect(result.engineDisplayName, equals('FasihForm'));
      });

      test('should return FormGear as fallback when engineType is null', () {
        const formEngine = FormEngineEntity(
          formEngineId: null,
        );
        const result = VersionCheckResult(
          state: VersionState.current,
          formEngine: formEngine,
        );

        expect(result.engineDisplayName, equals('FormGear'));
      });
    });

    group('copyWith', () {
      test('should create copy with modified state', () {
        const formEngine = FormEngineEntity(formEngineId: 1);
        const original = VersionCheckResult(
          state: VersionState.outdated,
          formEngine: formEngine,
          localVersion: '1.0.0',
        );

        final copied = original.copyWith(state: VersionState.current);

        expect(copied.state, equals(VersionState.current));
        expect(copied.formEngine, equals(formEngine));
        expect(copied.localVersion, equals('1.0.0'));
      });

      test('should create copy with modified formEngine', () {
        const formEngine1 = FormEngineEntity(formEngineId: 1);
        const formEngine2 = FormEngineEntity(formEngineId: 2);
        const original = VersionCheckResult(
          state: VersionState.current,
          formEngine: formEngine1,
        );

        final copied = original.copyWith(formEngine: formEngine2);

        expect(copied.formEngine, equals(formEngine2));
        expect(copied.state, equals(VersionState.current));
      });

      test('should create copy with modified versions', () {
        const formEngine = FormEngineEntity(formEngineId: 1);
        const original = VersionCheckResult(
          state: VersionState.outdated,
          formEngine: formEngine,
          localVersion: '1.0.0',
          remoteVersion: '2.0.0',
        );

        final copied = original.copyWith(
          localVersion: '1.5.0',
          remoteVersion: '2.5.0',
        );

        expect(copied.localVersion, equals('1.5.0'));
        expect(copied.remoteVersion, equals('2.5.0'));
      });

      test('should keep original values when not specified', () {
        const formEngine = FormEngineEntity(formEngineId: 1);
        const original = VersionCheckResult(
          state: VersionState.outdated,
          formEngine: formEngine,
          localVersion: '1.0.0',
        );

        final copied = original.copyWith();

        expect(copied, equals(original));
      });
    });

    group('Equality', () {
      test('should be equal when all properties match', () {
        const formEngine = FormEngineEntity(formEngineId: 1, version: '1.0.0');
        const result1 = VersionCheckResult(
          state: VersionState.current,
          formEngine: formEngine,
          localVersion: '1.0.0',
        );
        const result2 = VersionCheckResult(
          state: VersionState.current,
          formEngine: formEngine,
          localVersion: '1.0.0',
        );

        expect(result1, equals(result2));
        expect(result1.hashCode, equals(result2.hashCode));
      });

      test('should not be equal when state differs', () {
        const formEngine = FormEngineEntity(formEngineId: 1);
        const result1 = VersionCheckResult(
          state: VersionState.current,
          formEngine: formEngine,
        );
        const result2 = VersionCheckResult(
          state: VersionState.outdated,
          formEngine: formEngine,
        );

        expect(result1, isNot(equals(result2)));
      });

      test('should not be equal when localVersion differs', () {
        const formEngine = FormEngineEntity(formEngineId: 1);
        const result1 = VersionCheckResult(
          state: VersionState.current,
          formEngine: formEngine,
          localVersion: '1.0.0',
        );
        const result2 = VersionCheckResult(
          state: VersionState.current,
          formEngine: formEngine,
          localVersion: '2.0.0',
        );

        expect(result1, isNot(equals(result2)));
      });
    });

    group('toString', () {
      test('should have readable string representation', () {
        const formEngine = FormEngineEntity(
          formEngineId: 1,
          version: '2.0.0',
        );
        const result = VersionCheckResult(
          state: VersionState.outdated,
          formEngine: formEngine,
          localVersion: '1.0.0',
          remoteVersion: '2.0.0',
        );

        final str = result.toString();
        expect(str, contains('VersionCheckResult'));
        expect(str, contains('outdated'));
        expect(str, contains('1.0.0'));
        expect(str, contains('2.0.0'));
      });
    });

    group('JSON Serialization', () {
      test('should serialize to JSON', () {
        const formEngine = FormEngineEntity(
          formEngineId: 1,
          version: '1.0.0',
        );
        const result = VersionCheckResult(
          state: VersionState.current,
          formEngine: formEngine,
          localVersion: '1.0.0',
          remoteVersion: '1.0.0',
        );

        final json = result.toJson();
        expect(json['state'], equals('current'));
        expect(json['formEngine'], isNotNull);
        expect(json['localVersion'], equals('1.0.0'));
        expect(json['remoteVersion'], equals('1.0.0'));
      });

      test('should deserialize from JSON', () {
        final json = {
          'state': 'outdated',
          'formEngine': {
            'formEngineId': 1,
            'version': '2.0.0',
          },
          'localVersion': '1.0.0',
          'remoteVersion': '2.0.0',
        };

        final result = VersionCheckResult.fromJson(json);
        expect(result.state, equals(VersionState.outdated));
        expect(result.formEngine.formEngineId, equals(1));
        expect(result.localVersion, equals('1.0.0'));
        expect(result.remoteVersion, equals('2.0.0'));
      });
    });

    group('Real-world Scenarios', () {
      test('should handle fresh installation scenario', () {
        const formEngine = FormEngineEntity(
          formEngineId: 1,
          version: '1.0.0',
          isForce: false,
        );
        const result = VersionCheckResult(
          state: VersionState.missing,
          formEngine: formEngine,
          remoteVersion: '1.0.0',
        );

        expect(result.needsDownload, isTrue);
        expect(result.isUpdate, isFalse);
        expect(result.isForced, isFalse);
        expect(result.localVersion, isNull);
        expect(result.engineDisplayName, equals('FormGear'));
      });

      test('should handle forced update scenario', () {
        const formEngine = FormEngineEntity(
          formEngineId: 1,
          version: '2.0.0',
          isForce: true,
        );
        const result = VersionCheckResult(
          state: VersionState.outdated,
          formEngine: formEngine,
          localVersion: '1.0.0',
          remoteVersion: '2.0.0',
        );

        expect(result.needsDownload, isTrue);
        expect(result.isUpdate, isTrue);
        expect(result.isForced, isTrue);
        expect(result.state.description, contains('not the latest'));
      });

      test('should handle up-to-date scenario', () {
        const formEngine = FormEngineEntity(
          formEngineId: 2,
          version: '1.5.0',
        );
        const result = VersionCheckResult(
          state: VersionState.current,
          formEngine: formEngine,
          localVersion: '1.5.0',
          remoteVersion: '1.5.0',
        );

        expect(result.needsDownload, isFalse);
        expect(result.isUpdate, isFalse);
        expect(result.isForced, isFalse);
        expect(result.engineDisplayName, equals('FasihForm'));
      });

      test('should handle optional update scenario', () {
        const formEngine = FormEngineEntity(
          formEngineId: 1,
          version: '1.2.0',
          isForce: false,
        );
        const result = VersionCheckResult(
          state: VersionState.outdated,
          formEngine: formEngine,
          localVersion: '1.0.0',
          remoteVersion: '1.2.0',
        );

        expect(result.needsDownload, isTrue);
        expect(result.isUpdate, isTrue);
        expect(result.isForced, isFalse);
      });

      test('should determine download action based on state', () {
        const formEngine = FormEngineEntity(formEngineId: 1);

        const missingResult = VersionCheckResult(
          state: VersionState.missing,
          formEngine: formEngine,
        );
        const outdatedResult = VersionCheckResult(
          state: VersionState.outdated,
          formEngine: formEngine,
        );
        const currentResult = VersionCheckResult(
          state: VersionState.current,
          formEngine: formEngine,
        );

        expect(missingResult.needsDownload, isTrue);
        expect(outdatedResult.needsDownload, isTrue);
        expect(currentResult.needsDownload, isFalse);
      });
    });
  });
}
