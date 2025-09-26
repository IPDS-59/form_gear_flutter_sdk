import 'package:flutter_test/flutter_test.dart';
import 'package:form_gear_engine_sdk/src/core/base/result.dart';
import 'package:form_gear_engine_sdk/src/core/download/form_gear_download_manager.dart';
import 'package:form_gear_engine_sdk/src/data/datasources/form_engine_remote_data_source.dart';
import 'package:form_gear_engine_sdk/src/data/repositories/form_engine_repository_impl.dart';
import 'package:form_gear_engine_sdk/src/domain/repositories/form_engine_repository.dart';
import 'package:form_gear_engine_sdk/src/models/models.dart';
import 'package:mocktail/mocktail.dart';

import '../../../fixtures/fixture.dart';

class MockFormEngineRemoteDataSource extends Mock
    implements FormEngineRemoteDataSource {}

class MockFormGearDownloadManager extends Mock
    implements FormGearDownloadManager {}

void main() {
  late FormEngineResponse responseData;
  late FormEngineRemoteDataSource mockRemoteDataSource;
  late FormGearDownloadManager mockDownloadManager;
  late FormEngineRepository repository;

  setUp(() {
    mockRemoteDataSource = MockFormEngineRemoteDataSource();
    mockDownloadManager = MockFormGearDownloadManager();
    repository = FormEngineRepositoryImpl(
      remoteDataSource: mockRemoteDataSource,
      downloadManager: mockDownloadManager,
    );
    final json = jsonFromFixture(Fixture.checkFormEngineVersion);
    responseData = FormEngineResponse.fromJson(json);
  });

  tearDown(() {
    reset(mockRemoteDataSource);
    reset(mockDownloadManager);
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
            final successResult = result as Success<FormEngineResponse>;
            expect(successResult.data, equals(responseData));
            verify(
              () => mockRemoteDataSource.checkFormEngineVersion(engineId),
            ).called(1);
          },
        );

        test('it should pass null engine ID to remote data source', () async {
          // Arrange
          when(
            () => mockRemoteDataSource.checkFormEngineVersion(null),
          ).thenAnswer((_) async => Success(responseData));

          // Act
          final result = await repository.checkFormEngineVersion();

          // Assert
          expect(result, isA<Success<FormEngineResponse>>());
          verify(
            () => mockRemoteDataSource.checkFormEngineVersion(null),
          ).called(1);
        });

        test('it should handle FormGear engine ID', () async {
          // Arrange
          const engineId = '1';
          when(
            () => mockRemoteDataSource.checkFormEngineVersion(engineId),
          ).thenAnswer((_) async => Success(responseData));

          // Act
          final result = await repository.checkFormEngineVersion(engineId);

          // Assert
          expect(result, isA<Success<FormEngineResponse>>());
          final successResult = result as Success<FormEngineResponse>;
          expect(successResult.data, equals(responseData));
          verify(
            () => mockRemoteDataSource.checkFormEngineVersion(engineId),
          ).called(1);
        });

        test('it should handle FasihForm engine ID', () async {
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
        });

        test(
          'it should handle explicit null engine ID',
          () async {
            // Arrange
            when(
              () => mockRemoteDataSource.checkFormEngineVersion(null),
            ).thenAnswer((_) async => Success(responseData));

            // Act
            final result = await repository.checkFormEngineVersion(null);

            // Assert
            expect(result, isA<Success<FormEngineResponse>>());
            verify(
              () => mockRemoteDataSource.checkFormEngineVersion(null),
            ).called(1);
          },
        );
      });

      group('when remote data source returns failure', () {
        test(
          'it should return Failure when remote data source fails',
          () async {
            // Arrange
            const engineId = '1';
            const errorMessage = 'Network error';
            const failure = Failure<FormEngineResponse>(errorMessage);
            when(
              () => mockRemoteDataSource.checkFormEngineVersion(engineId),
            ).thenAnswer((_) async => failure);

            // Act
            final result = await repository.checkFormEngineVersion(engineId);

            // Assert
            expect(result, isA<Failure<FormEngineResponse>>());
            final failureResult = result as Failure;
            expect(failureResult.error, equals(errorMessage));
            verify(
              () => mockRemoteDataSource.checkFormEngineVersion(engineId),
            ).called(1);
          },
        );

        test(
          'it should return Failure when remote data source throws exception',
          () async {
            // Arrange
            const engineId = '1';
            const errorMessage = 'Remote data source exception';
            when(
              () => mockRemoteDataSource.checkFormEngineVersion(engineId),
            ).thenThrow(Exception(errorMessage));

            // Act & Assert
            expect(
              () => repository.checkFormEngineVersion(engineId),
              throwsA(isA<Exception>()),
            );
            verify(
              () => mockRemoteDataSource.checkFormEngineVersion(engineId),
            ).called(1);
          },
        );

        test('it should handle server error responses', () async {
          // Arrange
          const engineId = '1';
          const serverError = 'Server returned 500';
          const failure = Failure<FormEngineResponse>(serverError);
          when(
            () => mockRemoteDataSource.checkFormEngineVersion(engineId),
          ).thenAnswer((_) async => failure);

          // Act
          final result = await repository.checkFormEngineVersion(engineId);

          // Assert
          expect(result, isA<Failure<FormEngineResponse>>());
          final failureResult = result as Failure;
          expect(failureResult.error, contains('Server returned 500'));
        });

        test('it should propagate network timeout failures', () async {
          // Arrange
          const engineId = '1';
          const timeoutError = 'Connection timeout';
          const failure = Failure<FormEngineResponse>(timeoutError);
          when(
            () => mockRemoteDataSource.checkFormEngineVersion(engineId),
          ).thenAnswer((_) async => failure);

          // Act
          final result = await repository.checkFormEngineVersion(engineId);

          // Assert
          expect(result, isA<Failure<FormEngineResponse>>());
          final failureResult = result as Failure;
          expect(failureResult.error, equals(timeoutError));
        });
      });

      group('parameter validation', () {
        test('it should handle empty string engine ID', () async {
          // Arrange
          const engineId = '';
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
        });

        test('it should handle whitespace-only engine ID', () async {
          // Arrange
          const engineId = '   ';
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
        });
      });
    });

    group('isFormEngineDownloaded', () {
      group('when download manager returns success', () {
        test('it should return true when engine is downloaded', () async {
          // Arrange
          const engineId = '1';
          when(
            () => mockDownloadManager.isEngineDownloaded(engineId),
          ).thenAnswer((_) async => true);

          // Act
          final result = await repository.isFormEngineDownloaded(engineId);

          // Assert
          expect(result, isTrue);
          verify(
            () => mockDownloadManager.isEngineDownloaded(engineId),
          ).called(1);
        });

        test('it should return false when engine is not downloaded', () async {
          // Arrange
          const engineId = '1';
          when(
            () => mockDownloadManager.isEngineDownloaded(engineId),
          ).thenAnswer((_) async => false);

          // Act
          final result = await repository.isFormEngineDownloaded(engineId);

          // Assert
          expect(result, isFalse);
          verify(
            () => mockDownloadManager.isEngineDownloaded(engineId),
          ).called(1);
        });

        test('it should handle different engine IDs', () async {
          // Arrange
          const formGearId = '1';
          const fasihFormId = '2';
          when(
            () => mockDownloadManager.isEngineDownloaded(formGearId),
          ).thenAnswer((_) async => true);
          when(
            () => mockDownloadManager.isEngineDownloaded(fasihFormId),
          ).thenAnswer((_) async => false);

          // Act
          final result1 = await repository.isFormEngineDownloaded(formGearId);
          final result2 = await repository.isFormEngineDownloaded(fasihFormId);

          // Assert
          expect(result1, isTrue);
          expect(result2, isFalse);
          verify(
            () => mockDownloadManager.isEngineDownloaded(formGearId),
          ).called(1);
          verify(
            () => mockDownloadManager.isEngineDownloaded(fasihFormId),
          ).called(1);
        });
      });

      group('when download manager returns failure', () {
        test(
          'it should throw exception when download manager throws',
          () async {
            // Arrange
            const engineId = '1';
            const errorMessage = 'Download manager error';
            when(
              () => mockDownloadManager.isEngineDownloaded(engineId),
            ).thenThrow(Exception(errorMessage));

            // Act & Assert
            expect(
              () => repository.isFormEngineDownloaded(engineId),
              throwsA(isA<Exception>()),
            );
            verify(
              () => mockDownloadManager.isEngineDownloaded(engineId),
            ).called(1);
          },
        );

        test('it should handle file system errors gracefully', () async {
          // Arrange
          const engineId = '1';
          const errorMessage = 'File system error';
          when(
            () => mockDownloadManager.isEngineDownloaded(engineId),
          ).thenThrow(Exception(errorMessage));

          // Act & Assert
          expect(
            () => repository.isFormEngineDownloaded(engineId),
            throwsA(isA<Exception>()),
          );
        });
      });

      group('parameter validation', () {
        test('it should handle empty string engine ID', () async {
          // Arrange
          const engineId = '';
          when(
            () => mockDownloadManager.isEngineDownloaded(engineId),
          ).thenAnswer((_) async => false);

          // Act
          final result = await repository.isFormEngineDownloaded(engineId);

          // Assert
          expect(result, isFalse);
          verify(
            () => mockDownloadManager.isEngineDownloaded(engineId),
          ).called(1);
        });

        test('it should handle special characters in engine ID', () async {
          // Arrange
          const engineId = 'engine@123';
          when(
            () => mockDownloadManager.isEngineDownloaded(engineId),
          ).thenAnswer((_) async => true);

          // Act
          final result = await repository.isFormEngineDownloaded(engineId);

          // Assert
          expect(result, isTrue);
          verify(
            () => mockDownloadManager.isEngineDownloaded(engineId),
          ).called(1);
        });
      });
    });

    group('integration behavior', () {
      test('it should maintain independence between method calls', () async {
        // Arrange
        const engineId = '1';
        when(
          () => mockRemoteDataSource.checkFormEngineVersion(engineId),
        ).thenAnswer((_) async => Success(responseData));
        when(
          () => mockDownloadManager.isEngineDownloaded(engineId),
        ).thenAnswer((_) async => true);

        // Act
        final versionResult = await repository.checkFormEngineVersion(engineId);
        final downloadResult = await repository.isFormEngineDownloaded(
          engineId,
        );

        // Assert
        expect(versionResult, isA<Success<FormEngineResponse>>());
        expect(downloadResult, isTrue);
        verify(
          () => mockRemoteDataSource.checkFormEngineVersion(engineId),
        ).called(1);
        verify(
          () => mockDownloadManager.isEngineDownloaded(engineId),
        ).called(1);
      });

      test('it should handle concurrent calls correctly', () async {
        // Arrange
        const engineId1 = '1';
        const engineId2 = '2';
        when(
          () => mockRemoteDataSource.checkFormEngineVersion(engineId1),
        ).thenAnswer((_) async => Success(responseData));
        when(
          () => mockRemoteDataSource.checkFormEngineVersion(engineId2),
        ).thenAnswer((_) async => Success(responseData));

        // Act
        final results = await Future.wait([
          repository.checkFormEngineVersion(engineId1),
          repository.checkFormEngineVersion(engineId2),
        ]);

        // Assert
        expect(results.length, equals(2));
        expect(results[0], isA<Success<FormEngineResponse>>());
        expect(results[1], isA<Success<FormEngineResponse>>());
        verify(
          () => mockRemoteDataSource.checkFormEngineVersion(engineId1),
        ).called(1);
        verify(
          () => mockRemoteDataSource.checkFormEngineVersion(engineId2),
        ).called(1);
      });

      test(
        'it should pass through repository dependencies correctly',
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
          final successResult = result as Success<FormEngineResponse>;
          expect(successResult.data, same(responseData));
        },
      );
    });
  });
}
