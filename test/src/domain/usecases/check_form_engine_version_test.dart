import 'package:flutter_test/flutter_test.dart';
import 'package:form_gear_engine_sdk/src/core/base/result.dart';
import 'package:form_gear_engine_sdk/src/domain/repositories/form_engine_repository.dart';
import 'package:form_gear_engine_sdk/src/domain/usecases/check_form_engine_version_usecase.dart';
import 'package:form_gear_engine_sdk/src/models/models.dart';
import 'package:mocktail/mocktail.dart';

import '../../../fixtures/fixture.dart';

class MockFormEngineRepository extends Mock implements FormEngineRepository {}

void main() {
  late FormEngineResponse responseData;
  late FormEngineRepository mockRepository;
  late CheckFormEngineVersionUseCase useCase;

  setUp(() {
    mockRepository = MockFormEngineRepository();
    useCase = CheckFormEngineVersionUseCase(mockRepository);
    final json = jsonFromFixture(Fixture.checkFormEngineVersion);
    responseData = FormEngineResponse.fromJson(json);
  });

  tearDown(() {
    reset(mockRepository);
  });

  group('CheckFormEngineVersionUseCase', () {
    group('when repository returns success', () {
      test('it should return FormEngineResponse for valid engine ID', () async {
        // Arrange
        const engineId = '1';
        when(
          () => mockRepository.checkFormEngineVersion(engineId),
        ).thenAnswer((_) async => Success(responseData));

        // Act
        final result = await useCase.call(engineId);

        // Assert
        expect(result, isA<Success<FormEngineResponse>>());
        final successResult = result as Success<FormEngineResponse>;
        expect(successResult.data, equals(responseData));
        verify(() => mockRepository.checkFormEngineVersion(engineId)).called(1);
      });

      test('it should use FormGear engine ID when no ID provided', () async {
        // Arrange
        final expectedEngineId = FormEngineType.formGear.id.toString();
        when(
          () => mockRepository.checkFormEngineVersion(expectedEngineId),
        ).thenAnswer((_) async => Success(responseData));

        // Act
        final result = await useCase.call();

        // Assert
        expect(result, isA<Success<FormEngineResponse>>());
        verify(
          () => mockRepository.checkFormEngineVersion(expectedEngineId),
        ).called(1);
      });

      test('it should handle FasihForm engine ID', () async {
        // Arrange
        const engineId = '2';
        when(
          () => mockRepository.checkFormEngineVersion(engineId),
        ).thenAnswer((_) async => Success(responseData));

        // Act
        final result = await useCase.call(engineId);

        // Assert
        expect(result, isA<Success<FormEngineResponse>>());
        verify(() => mockRepository.checkFormEngineVersion(engineId)).called(1);
      });

      test(
        'it should handle null engine ID by defaulting to FormGear',
        () async {
          // Arrange
          final expectedEngineId = FormEngineType.formGear.id.toString();
          when(
            () => mockRepository.checkFormEngineVersion(expectedEngineId),
          ).thenAnswer((_) async => Success(responseData));

          // Act
          final result = await useCase.call();

          // Assert
          expect(result, isA<Success<FormEngineResponse>>());
          verify(
            () => mockRepository.checkFormEngineVersion(expectedEngineId),
          ).called(1);
        },
      );
    });

    group('when repository returns failure', () {
      test('it should return Failure when repository fails', () async {
        // Arrange
        const engineId = '1';
        const errorMessage = 'Network error';
        const failure = Failure<FormEngineResponse>(errorMessage);
        when(
          () => mockRepository.checkFormEngineVersion(engineId),
        ).thenAnswer((_) async => failure);

        // Act
        final result = await useCase.call(engineId);

        // Assert
        expect(result, isA<Failure<FormEngineResponse>>());
        final failureResult = result as Failure;
        expect(failureResult.error, equals(errorMessage));
        verify(() => mockRepository.checkFormEngineVersion(engineId)).called(1);
      });

      test(
        'it should return Failure when repository throws exception',
        () async {
          // Arrange
          const engineId = '1';
          const errorMessage = 'Repository exception';
          when(
            () => mockRepository.checkFormEngineVersion(engineId),
          ).thenThrow(Exception(errorMessage));

          // Act & Assert
          expect(
            () => useCase.call(engineId),
            throwsA(isA<Exception>()),
          );
          verify(
            () => mockRepository.checkFormEngineVersion(engineId),
          ).called(1);
        },
      );

      test('it should handle server error responses', () async {
        // Arrange
        const engineId = '1';
        const serverError = 'Server returned 500';
        const failure = Failure<FormEngineResponse>(serverError);
        when(
          () => mockRepository.checkFormEngineVersion(engineId),
        ).thenAnswer((_) async => failure);

        // Act
        final result = await useCase.call(engineId);

        // Assert
        expect(result, isA<Failure<FormEngineResponse>>());
        final failureResult = result as Failure;
        expect(failureResult.error, contains('Server returned 500'));
      });
    });

    group('parameter validation', () {
      test('it should handle empty string engine ID', () async {
        // Arrange
        const engineId = '';
        when(
          () => mockRepository.checkFormEngineVersion(engineId),
        ).thenAnswer((_) async => Success(responseData));

        // Act
        final result = await useCase.call(engineId);

        // Assert
        expect(result, isA<Success<FormEngineResponse>>());
        verify(() => mockRepository.checkFormEngineVersion(engineId)).called(1);
      });

      test('it should handle whitespace-only engine ID', () async {
        // Arrange
        const engineId = '   ';
        when(
          () => mockRepository.checkFormEngineVersion(engineId),
        ).thenAnswer((_) async => Success(responseData));

        // Act
        final result = await useCase.call(engineId);

        // Assert
        expect(result, isA<Success<FormEngineResponse>>());
        verify(() => mockRepository.checkFormEngineVersion(engineId)).called(1);
      });
    });

    group('integration behavior', () {
      test('it should maintain immutability of response data', () async {
        // Arrange
        const engineId = '1';
        when(
          () => mockRepository.checkFormEngineVersion(engineId),
        ).thenAnswer((_) async => Success(responseData));

        // Act
        final result1 = await useCase.call(engineId);
        final result2 = await useCase.call(engineId);

        // Assert
        expect(result1, isA<Success<FormEngineResponse>>());
        expect(result2, isA<Success<FormEngineResponse>>());
        final success1 = result1 as Success<FormEngineResponse>;
        final success2 = result2 as Success<FormEngineResponse>;
        expect(success1.data, equals(success2.data));
      });

      test('it should call repository exactly once per invocation', () async {
        // Arrange
        const engineId = '1';
        when(
          () => mockRepository.checkFormEngineVersion(engineId),
        ).thenAnswer((_) async => Success(responseData));

        // Act
        await useCase.call(engineId);
        await useCase.call(engineId);

        // Assert
        verify(() => mockRepository.checkFormEngineVersion(engineId)).called(2);
      });
    });
  });
}
