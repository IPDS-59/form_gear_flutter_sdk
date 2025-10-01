import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:form_gear_engine_sdk/src/core/base/result.dart';
import 'package:form_gear_engine_sdk/src/data/datasources/form_engine_remote_data_source.dart';
import 'package:form_gear_engine_sdk/src/data/repositories/form_engine_repository_impl.dart';
import 'package:form_gear_engine_sdk/src/domain/repositories/form_engine_repository.dart';
import 'package:form_gear_engine_sdk/src/models/models.dart';
import 'package:mocktail/mocktail.dart';
import 'package:path_provider_platform_interface/path_provider_platform_interface.dart';

import '../../../fixtures/fixture.dart';
import '../../../helpers/test_path_provider_platform.dart';

class MockFormEngineRemoteDataSource extends Mock
    implements FormEngineRemoteDataSource {}

void main() {
  late FormEngineResponse responseData;
  late FormEngineRemoteDataSource mockRemoteDataSource;
  late FormEngineRepository repository;

  setUp(() {
    mockRemoteDataSource = MockFormEngineRemoteDataSource();
    repository = FormEngineRepositoryImpl(
      remoteDataSource: mockRemoteDataSource,
    );
    final json = jsonFromFixture(Fixture.checkFormEngineVersion);
    responseData = FormEngineResponse.fromJson(json);
  });

  tearDown(() {
    reset(mockRemoteDataSource);
  });

  group('FormEngineRepositoryImpl', () {
    group('checkFormEngineVersion', () {
      group('when remote data source returns success', () {
        test(
          'it should return FormEngineResponse for valid engine ID',
          () async {
            // Arrange
            const engineId = '1';
            when(
              () => mockRemoteDataSource.checkFormEngineVersion(engineId),
            ).thenAnswer((_) async => Success(responseData));

            // Act
            final result = await repository.checkFormEngineVersion(engineId);

            // Assert
            expect(result, isA<Success<FormEngineResponse>>());
            expect((result as Success).data, equals(responseData));
            verify(
              () => mockRemoteDataSource.checkFormEngineVersion(engineId),
            ).called(1);
          },
        );

        test(
          'it should use FormGear engine ID (1) when no ID provided',
          () async {
            // Arrange
            when(
              () => mockRemoteDataSource.checkFormEngineVersion(),
            ).thenAnswer((_) async => Success(responseData));

            // Act
            final result = await repository.checkFormEngineVersion();

            // Assert
            expect(result, isA<Success<FormEngineResponse>>());
            verify(
              () => mockRemoteDataSource.checkFormEngineVersion(),
            ).called(1);
          },
        );

        test(
          'it should handle FasihForm engine ID (2)',
          () async {
            // Arrange
            const engineId = '2';
            when(
              () => mockRemoteDataSource.checkFormEngineVersion(engineId),
            ).thenAnswer((_) async => Success(responseData));

            // Act
            final result = await repository.checkFormEngineVersion(engineId);

            // Assert
            expect(result, isA<Success<FormEngineResponse>>());
            verify(
              () => mockRemoteDataSource.checkFormEngineVersion(engineId),
            ).called(1);
          },
        );
      });

      group('when remote data source returns failure', () {
        test(
          'it should return Failure when repository fails',
          () async {
            // Arrange
            const engineId = '1';
            const error = 'Network error';
            when(
              () => mockRemoteDataSource.checkFormEngineVersion(engineId),
            ).thenAnswer((_) async => const Failure<FormEngineResponse>(error));

            // Act
            final result = await repository.checkFormEngineVersion(engineId);

            // Assert
            expect(result, isA<Failure<FormEngineResponse>>());
            expect((result as Failure).error, equals(error));
            verify(
              () => mockRemoteDataSource.checkFormEngineVersion(engineId),
            ).called(1);
          },
        );
      });
    });

    group('isFormEngineDownloaded', () {
      TestWidgetsFlutterBinding.ensureInitialized();

      setUpAll(() {
        PathProviderPlatform.instance = TestPathProviderPlatform();
      });

      test(
        'should return true when engine directory and version file exist',
        () async {
          // Arrange
          const engineId = '1';
          final testDir = Directory.systemTemp.createTempSync('test_engine_');
          final engineDir = Directory(
            '${testDir.path}/BPS/formengine/$engineId',
          );
          await engineDir.create(recursive: true);
          final versionFile = File('${engineDir.path}/version.json');
          await versionFile.writeAsString('{"version": "1.0.0"}');

          // Override getApplicationDocumentsDirectory to return our test directory
          PathProviderPlatform.instance = TestPathProviderPlatform(
            applicationDocumentsPath: testDir.path,
          );

          // Act
          final result = await repository.isFormEngineDownloaded(engineId);

          // Assert
          expect(result, isTrue);

          // Cleanup
          await testDir.delete(recursive: true);
        },
      );

      test(
        'should return false when engine directory does not exist',
        () async {
          // Arrange
          const engineId = '999';
          final testDir = Directory.systemTemp.createTempSync('test_engine_');

          // Override getApplicationDocumentsDirectory
          PathProviderPlatform.instance = TestPathProviderPlatform(
            applicationDocumentsPath: testDir.path,
          );

          // Act
          final result = await repository.isFormEngineDownloaded(engineId);

          // Assert
          expect(result, isFalse);

          // Cleanup
          await testDir.delete(recursive: true);
        },
      );

      test(
        'should return false when version file does not exist',
        () async {
          // Arrange
          const engineId = '2';
          final testDir = Directory.systemTemp.createTempSync('test_engine_');
          final engineDir = Directory(
            '${testDir.path}/BPS/formengine/$engineId',
          );
          await engineDir.create(recursive: true);

          // Override getApplicationDocumentsDirectory
          PathProviderPlatform.instance = TestPathProviderPlatform(
            applicationDocumentsPath: testDir.path,
          );

          // Act
          final result = await repository.isFormEngineDownloaded(engineId);

          // Assert
          expect(result, isFalse);

          // Cleanup
          await testDir.delete(recursive: true);
        },
      );

      test(
        'should return false when an error occurs',
        () async {
          // Arrange
          const engineId = '1';

          // Set invalid path to force an error
          PathProviderPlatform.instance = TestPathProviderPlatform(
            applicationDocumentsPath: '',
          );

          // Act
          final result = await repository.isFormEngineDownloaded(engineId);

          // Assert
          expect(result, isFalse);
        },
      );
    });
  });
}
