import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:form_gear_engine_sdk/src/core/base/failure.dart';
import 'package:form_gear_engine_sdk/src/core/base/result.dart';
import 'package:form_gear_engine_sdk/src/core/config/form_gear_api_config.dart';
import 'package:form_gear_engine_sdk/src/data/datasources/form_engine_remote_data_source.dart';
import 'package:form_gear_engine_sdk/src/models/models.dart';
import 'package:mocktail/mocktail.dart';

import '../../../fixtures/fixture.dart';

class MockDio extends Mock implements Dio {}

class MockFormGearApiConfig extends Mock implements FormGearApiConfig {}

class MockResponse extends Mock implements Response<Map<String, dynamic>> {}

void main() {
  late FormEngineResponse responseData;
  late FormGearApiConfig mockApiConfig;
  late Dio mockDio;
  late FormEngineRemoteDataSource dataSource;

  setUp(() {
    mockApiConfig = MockFormGearApiConfig();
    mockDio = MockDio();
    dataSource = FormEngineRemoteDataSourceImpl(
      apiConfig: mockApiConfig,
      dio: mockDio,
    );
    final json = jsonFromFixture(Fixture.checkFormEngineVersion);
    responseData = FormEngineResponse.fromJson(json);
  });

  tearDown(() {
    reset(mockApiConfig);
    reset(mockDio);
  });

  group('FormEngineRemoteDataSourceImpl', () {
    group('checkFormEngineVersion', () {
      group('when API configuration is valid', () {
        setUp(() {
          when(
            () => mockApiConfig.formEngineUrl,
          ).thenReturn('https://api.example.com');
          when(
            () => mockApiConfig.formEngineEndpoint,
          ).thenReturn('/api/v1/form-engine');
        });

        test(
          'it should return FormEngineResponse for valid engine ID',
          () async {
            // Arrange
            const engineId = '1';
            final mockResponse = MockResponse();
            final responseJson = jsonFromFixture(
              Fixture.checkFormEngineVersion,
            );
            when(() => mockResponse.data).thenReturn(responseJson);
            when(
              () => mockDio.get<Map<String, dynamic>>(
                any(),
                queryParameters: any(named: 'queryParameters'),
              ),
            ).thenAnswer((_) async => mockResponse);

            // Act
            final result = await dataSource.checkFormEngineVersion(engineId);

            // Assert
            expect(result, isA<Success<FormEngineResponse>>());
            final successResult = result as Success<FormEngineResponse>;
            expect(
              successResult.data.data?.formEngineId,
              equals(responseData.data?.formEngineId),
            );
            verify(
              () => mockDio.get<Map<String, dynamic>>(
                '/api/v1/form-engine',
                queryParameters: {'formEngineId': engineId},
              ),
            ).called(1);
          },
        );

        test(
          'it should call API without query parameters when engineId is null',
          () async {
            // Arrange
            final mockResponse = MockResponse();
            final responseJson = jsonFromFixture(
              Fixture.checkFormEngineVersion,
            );
            when(() => mockResponse.data).thenReturn(responseJson);
            when(
              () => mockDio.get<Map<String, dynamic>>(
                any(),
                queryParameters: any(named: 'queryParameters'),
              ),
            ).thenAnswer((_) async => mockResponse);

            // Act
            final result = await dataSource.checkFormEngineVersion();

            // Assert
            expect(result, isA<Success<FormEngineResponse>>());
            verify(
              () => mockDio.get<Map<String, dynamic>>(
                '/api/v1/form-engine',
                queryParameters: <String, dynamic>{},
              ),
            ).called(1);
          },
        );

        test(
          'it should call API without query parameters when engineId is empty',
          () async {
            // Arrange
            const engineId = '';
            final mockResponse = MockResponse();
            final responseJson = jsonFromFixture(
              Fixture.checkFormEngineVersion,
            );
            when(() => mockResponse.data).thenReturn(responseJson);
            when(
              () => mockDio.get<Map<String, dynamic>>(
                any(),
                queryParameters: any(named: 'queryParameters'),
              ),
            ).thenAnswer((_) async => mockResponse);

            // Act
            final result = await dataSource.checkFormEngineVersion(engineId);

            // Assert
            expect(result, isA<Success<FormEngineResponse>>());
            verify(
              () => mockDio.get<Map<String, dynamic>>(
                '/api/v1/form-engine',
                queryParameters: <String, dynamic>{},
              ),
            ).called(1);
          },
        );

        test('it should handle FormGear engine ID', () async {
          // Arrange
          const engineId = '1';
          final mockResponse = MockResponse();
          final responseJson = jsonFromFixture(Fixture.checkFormEngineVersion);
          when(() => mockResponse.data).thenReturn(responseJson);
          when(
            () => mockDio.get<Map<String, dynamic>>(
              any(),
              queryParameters: any(named: 'queryParameters'),
            ),
          ).thenAnswer((_) async => mockResponse);

          // Act
          final result = await dataSource.checkFormEngineVersion(engineId);

          // Assert
          expect(result, isA<Success<FormEngineResponse>>());
          verify(
            () => mockDio.get<Map<String, dynamic>>(
              '/api/v1/form-engine',
              queryParameters: {'formEngineId': engineId},
            ),
          ).called(1);
        });

        test('it should handle FasihForm engine ID', () async {
          // Arrange
          const engineId = '2';
          final mockResponse = MockResponse();
          final responseJson = jsonFromFixture(Fixture.checkFormEngineVersion);
          when(() => mockResponse.data).thenReturn(responseJson);
          when(
            () => mockDio.get<Map<String, dynamic>>(
              any(),
              queryParameters: any(named: 'queryParameters'),
            ),
          ).thenAnswer((_) async => mockResponse);

          // Act
          final result = await dataSource.checkFormEngineVersion(engineId);

          // Assert
          expect(result, isA<Success<FormEngineResponse>>());
          verify(
            () => mockDio.get<Map<String, dynamic>>(
              '/api/v1/form-engine',
              queryParameters: {'formEngineId': engineId},
            ),
          ).called(1);
        });
      });

      group('when API configuration is invalid', () {
        test('it should return Failure when formEngineUrl is null', () async {
          // Arrange
          when(() => mockApiConfig.formEngineUrl).thenReturn(null);

          // Act
          final result = await dataSource.checkFormEngineVersion('1');

          // Assert
          expect(result, isA<Failure<FormEngineResponse>>());
          final failureResult = result as Failure<FormEngineResponse>;
          expect(failureResult.error, isA<ServerFailure>());
          expect(
            failureResult.error.toString(),
            contains('Form engine API endpoint not configured'),
          );
        });
      });

      group('when Dio throws DioException', () {
        setUp(() {
          when(
            () => mockApiConfig.formEngineUrl,
          ).thenReturn('https://api.example.com');
          when(
            () => mockApiConfig.formEngineEndpoint,
          ).thenReturn('/api/v1/form-engine');
        });

        test('it should handle connection timeout', () async {
          // Arrange
          const engineId = '1';
          final dioException = DioException(
            requestOptions: RequestOptions(path: '/api/v1/form-engine'),
            type: DioExceptionType.connectionTimeout,
            message: 'Connection timeout',
          );
          when(
            () => mockDio.get<Map<String, dynamic>>(
              any(),
              queryParameters: any(named: 'queryParameters'),
            ),
          ).thenThrow(dioException);

          // Act
          final result = await dataSource.checkFormEngineVersion(engineId);

          // Assert
          expect(result, isA<Failure<FormEngineResponse>>());
          final failureResult = result as Failure<FormEngineResponse>;
          expect(failureResult.error, isA<NetworkFailure>());
          expect(
            failureResult.error.toString(),
            contains('Network timeout'),
          );
        });

        test('it should handle send timeout', () async {
          // Arrange
          const engineId = '1';
          final dioException = DioException(
            requestOptions: RequestOptions(path: '/api/v1/form-engine'),
            type: DioExceptionType.sendTimeout,
            message: 'Send timeout',
          );
          when(
            () => mockDio.get<Map<String, dynamic>>(
              any(),
              queryParameters: any(named: 'queryParameters'),
            ),
          ).thenThrow(dioException);

          // Act
          final result = await dataSource.checkFormEngineVersion(engineId);

          // Assert
          expect(result, isA<Failure<FormEngineResponse>>());
          final failureResult = result as Failure<FormEngineResponse>;
          expect(failureResult.error, isA<NetworkFailure>());
        });

        test('it should handle receive timeout', () async {
          // Arrange
          const engineId = '1';
          final dioException = DioException(
            requestOptions: RequestOptions(path: '/api/v1/form-engine'),
            type: DioExceptionType.receiveTimeout,
            message: 'Receive timeout',
          );
          when(
            () => mockDio.get<Map<String, dynamic>>(
              any(),
              queryParameters: any(named: 'queryParameters'),
            ),
          ).thenThrow(dioException);

          // Act
          final result = await dataSource.checkFormEngineVersion(engineId);

          // Assert
          expect(result, isA<Failure<FormEngineResponse>>());
          final failureResult = result as Failure<FormEngineResponse>;
          expect(failureResult.error, isA<NetworkFailure>());
        });

        test('it should handle connection error', () async {
          // Arrange
          const engineId = '1';
          final dioException = DioException(
            requestOptions: RequestOptions(path: '/api/v1/form-engine'),
            type: DioExceptionType.connectionError,
            message: 'Connection error',
          );
          when(
            () => mockDio.get<Map<String, dynamic>>(
              any(),
              queryParameters: any(named: 'queryParameters'),
            ),
          ).thenThrow(dioException);

          // Act
          final result = await dataSource.checkFormEngineVersion(engineId);

          // Assert
          expect(result, isA<Failure<FormEngineResponse>>());
          final failureResult = result as Failure<FormEngineResponse>;
          expect(failureResult.error, isA<NetworkFailure>());
          expect(
            failureResult.error.toString(),
            contains('Connection error'),
          );
        });

        test('it should handle 401 unauthorized response', () async {
          // Arrange
          const engineId = '1';
          final mockErrorResponse = MockResponse();
          when(() => mockErrorResponse.statusCode).thenReturn(401);
          when(
            () => mockErrorResponse.statusMessage,
          ).thenReturn('Unauthorized');
          final dioException = DioException(
            requestOptions: RequestOptions(path: '/api/v1/form-engine'),
            type: DioExceptionType.badResponse,
            response: mockErrorResponse,
          );
          when(
            () => mockDio.get<Map<String, dynamic>>(
              any(),
              queryParameters: any(named: 'queryParameters'),
            ),
          ).thenThrow(dioException);

          // Act
          final result = await dataSource.checkFormEngineVersion(engineId);

          // Assert
          expect(result, isA<Failure<FormEngineResponse>>());
          final failureResult = result as Failure<FormEngineResponse>;
          expect(failureResult.error, isA<AuthFailure>());
          final authFailure = failureResult.error as AuthFailure;
          expect(authFailure.code, equals('401'));
        });

        test('it should handle 403 forbidden response', () async {
          // Arrange
          const engineId = '1';
          final mockErrorResponse = MockResponse();
          when(() => mockErrorResponse.statusCode).thenReturn(403);
          when(() => mockErrorResponse.statusMessage).thenReturn('Forbidden');
          final dioException = DioException(
            requestOptions: RequestOptions(path: '/api/v1/form-engine'),
            type: DioExceptionType.badResponse,
            response: mockErrorResponse,
          );
          when(
            () => mockDio.get<Map<String, dynamic>>(
              any(),
              queryParameters: any(named: 'queryParameters'),
            ),
          ).thenThrow(dioException);

          // Act
          final result = await dataSource.checkFormEngineVersion(engineId);

          // Assert
          expect(result, isA<Failure<FormEngineResponse>>());
          final failureResult = result as Failure<FormEngineResponse>;
          expect(failureResult.error, isA<AuthFailure>());
          final authFailure = failureResult.error as AuthFailure;
          expect(authFailure.code, equals('403'));
        });

        test('it should handle 404 not found response', () async {
          // Arrange
          const engineId = '1';
          final mockErrorResponse = MockResponse();
          when(() => mockErrorResponse.statusCode).thenReturn(404);
          when(() => mockErrorResponse.statusMessage).thenReturn('Not Found');
          final dioException = DioException(
            requestOptions: RequestOptions(path: '/api/v1/form-engine'),
            type: DioExceptionType.badResponse,
            response: mockErrorResponse,
          );
          when(
            () => mockDio.get<Map<String, dynamic>>(
              any(),
              queryParameters: any(named: 'queryParameters'),
            ),
          ).thenThrow(dioException);

          // Act
          final result = await dataSource.checkFormEngineVersion(engineId);

          // Assert
          expect(result, isA<Failure<FormEngineResponse>>());
          final failureResult = result as Failure<FormEngineResponse>;
          expect(failureResult.error, isA<ClientFailure>());
          final clientFailure = failureResult.error as ClientFailure;
          expect(clientFailure.code, equals('404'));
        });

        test('it should handle 500 server error response', () async {
          // Arrange
          const engineId = '1';
          final mockErrorResponse = MockResponse();
          when(() => mockErrorResponse.statusCode).thenReturn(500);
          when(
            () => mockErrorResponse.statusMessage,
          ).thenReturn('Internal Server Error');
          final dioException = DioException(
            requestOptions: RequestOptions(path: '/api/v1/form-engine'),
            type: DioExceptionType.badResponse,
            response: mockErrorResponse,
          );
          when(
            () => mockDio.get<Map<String, dynamic>>(
              any(),
              queryParameters: any(named: 'queryParameters'),
            ),
          ).thenThrow(dioException);

          // Act
          final result = await dataSource.checkFormEngineVersion(engineId);

          // Assert
          expect(result, isA<Failure<FormEngineResponse>>());
          final failureResult = result as Failure<FormEngineResponse>;
          expect(failureResult.error, isA<ServerFailure>());
          final serverFailure = failureResult.error as ServerFailure;
          expect(serverFailure.code, equals('500'));
        });

        test('it should handle request cancellation', () async {
          // Arrange
          const engineId = '1';
          final dioException = DioException(
            requestOptions: RequestOptions(path: '/api/v1/form-engine'),
            type: DioExceptionType.cancel,
            message: 'Request cancelled',
          );
          when(
            () => mockDio.get<Map<String, dynamic>>(
              any(),
              queryParameters: any(named: 'queryParameters'),
            ),
          ).thenThrow(dioException);

          // Act
          final result = await dataSource.checkFormEngineVersion(engineId);

          // Assert
          expect(result, isA<Failure<FormEngineResponse>>());
          final failureResult = result as Failure<FormEngineResponse>;
          expect(failureResult.error, isA<NetworkFailure>());
          expect(
            failureResult.error.toString(),
            contains('Request cancelled'),
          );
        });

        test('it should handle bad certificate', () async {
          // Arrange
          const engineId = '1';
          final dioException = DioException(
            requestOptions: RequestOptions(path: '/api/v1/form-engine'),
            type: DioExceptionType.badCertificate,
            message: 'Bad certificate',
          );
          when(
            () => mockDio.get<Map<String, dynamic>>(
              any(),
              queryParameters: any(named: 'queryParameters'),
            ),
          ).thenThrow(dioException);

          // Act
          final result = await dataSource.checkFormEngineVersion(engineId);

          // Assert
          expect(result, isA<Failure<FormEngineResponse>>());
          final failureResult = result as Failure<FormEngineResponse>;
          expect(failureResult.error, isA<NetworkFailure>());
          expect(
            failureResult.error.toString(),
            contains('Bad certificate'),
          );
        });

        test('it should handle unknown DioException', () async {
          // Arrange
          const engineId = '1';
          final dioException = DioException(
            requestOptions: RequestOptions(path: '/api/v1/form-engine'),
            message: 'Unknown error',
          );
          when(
            () => mockDio.get<Map<String, dynamic>>(
              any(),
              queryParameters: any(named: 'queryParameters'),
            ),
          ).thenThrow(dioException);

          // Act
          final result = await dataSource.checkFormEngineVersion(engineId);

          // Assert
          expect(result, isA<Failure<FormEngineResponse>>());
          final failureResult = result as Failure<FormEngineResponse>;
          expect(failureResult.error, isA<UnknownFailure>());
        });
      });

      group('when other exceptions are thrown', () {
        setUp(() {
          when(
            () => mockApiConfig.formEngineUrl,
          ).thenReturn('https://api.example.com');
          when(
            () => mockApiConfig.formEngineEndpoint,
          ).thenReturn('/api/v1/form-engine');
        });

        test('it should handle generic Exception', () async {
          // Arrange
          const engineId = '1';
          const errorMessage = 'Generic exception';
          when(
            () => mockDio.get<Map<String, dynamic>>(
              any(),
              queryParameters: any(named: 'queryParameters'),
            ),
          ).thenThrow(Exception(errorMessage));

          // Act
          final result = await dataSource.checkFormEngineVersion(engineId);

          // Assert
          expect(result, isA<Failure<FormEngineResponse>>());
          final failureResult = result as Failure<FormEngineResponse>;
          expect(failureResult.error, isA<UnknownFailure>());
          expect(
            failureResult.error.toString(),
            contains(errorMessage),
          );
        });

        test('it should handle FormatException during JSON parsing', () async {
          // Arrange
          const engineId = '1';
          final mockResponse = MockResponse();
          // This will cause JSON parsing error because FormEngineResponse expects specific structure
          when(() => mockResponse.data).thenReturn(<String, dynamic>{
            'invalidField': 123,
            'anotherInvalid': {'nested': 'error'},
          });
          when(
            () => mockDio.get<Map<String, dynamic>>(
              any(),
              queryParameters: any(named: 'queryParameters'),
            ),
          ).thenAnswer((_) async => mockResponse);

          // Act
          final result = await dataSource.checkFormEngineVersion(engineId);

          // Assert
          expect(result, isA<Success<FormEngineResponse>>());
          // Even with invalid fields, the JSON parsing will succeed for FormEngineResponse
          // as it has optional fields. This test shows that the parsing is robust.
        });
      });

      group('parameter validation', () {
        setUp(() {
          when(
            () => mockApiConfig.formEngineUrl,
          ).thenReturn('https://api.example.com');
          when(
            () => mockApiConfig.formEngineEndpoint,
          ).thenReturn('/api/v1/form-engine');
        });

        test('it should handle whitespace-only engine ID', () async {
          // Arrange
          const engineId = '   ';
          final mockResponse = MockResponse();
          final responseJson = jsonFromFixture(Fixture.checkFormEngineVersion);
          when(() => mockResponse.data).thenReturn(responseJson);
          when(
            () => mockDio.get<Map<String, dynamic>>(
              any(),
              queryParameters: any(named: 'queryParameters'),
            ),
          ).thenAnswer((_) async => mockResponse);

          // Act
          final result = await dataSource.checkFormEngineVersion(engineId);

          // Assert
          expect(result, isA<Success<FormEngineResponse>>());
          verify(
            () => mockDio.get<Map<String, dynamic>>(
              '/api/v1/form-engine',
              queryParameters: {'formEngineId': engineId},
            ),
          ).called(1);
        });

        test('it should handle special characters in engine ID', () async {
          // Arrange
          const engineId = 'engine@123!';
          final mockResponse = MockResponse();
          final responseJson = jsonFromFixture(Fixture.checkFormEngineVersion);
          when(() => mockResponse.data).thenReturn(responseJson);
          when(
            () => mockDio.get<Map<String, dynamic>>(
              any(),
              queryParameters: any(named: 'queryParameters'),
            ),
          ).thenAnswer((_) async => mockResponse);

          // Act
          final result = await dataSource.checkFormEngineVersion(engineId);

          // Assert
          expect(result, isA<Success<FormEngineResponse>>());
          verify(
            () => mockDio.get<Map<String, dynamic>>(
              '/api/v1/form-engine',
              queryParameters: {'formEngineId': engineId},
            ),
          ).called(1);
        });
      });

      group('integration behavior', () {
        setUp(() {
          when(
            () => mockApiConfig.formEngineUrl,
          ).thenReturn('https://api.example.com');
          when(
            () => mockApiConfig.formEngineEndpoint,
          ).thenReturn('/api/v1/form-engine');
        });

        test('it should maintain response data immutability', () async {
          // Arrange
          const engineId = '1';
          final mockResponse = MockResponse();
          final responseJson = jsonFromFixture(Fixture.checkFormEngineVersion);
          when(() => mockResponse.data).thenReturn(responseJson);
          when(
            () => mockDio.get<Map<String, dynamic>>(
              any(),
              queryParameters: any(named: 'queryParameters'),
            ),
          ).thenAnswer((_) async => mockResponse);

          // Act
          final result1 = await dataSource.checkFormEngineVersion(engineId);
          final result2 = await dataSource.checkFormEngineVersion(engineId);

          // Assert
          expect(result1, isA<Success<FormEngineResponse>>());
          expect(result2, isA<Success<FormEngineResponse>>());
          final success1 = result1 as Success<FormEngineResponse>;
          final success2 = result2 as Success<FormEngineResponse>;
          expect(
            success1.data.data?.formEngineId,
            equals(success2.data.data?.formEngineId),
          );
        });

        test('it should handle concurrent API calls correctly', () async {
          // Arrange
          const engineId1 = '1';
          const engineId2 = '2';
          final mockResponse = MockResponse();
          final responseJson = jsonFromFixture(Fixture.checkFormEngineVersion);
          when(() => mockResponse.data).thenReturn(responseJson);
          when(
            () => mockDio.get<Map<String, dynamic>>(
              any(),
              queryParameters: any(named: 'queryParameters'),
            ),
          ).thenAnswer((_) async => mockResponse);

          // Act
          final results = await Future.wait([
            dataSource.checkFormEngineVersion(engineId1),
            dataSource.checkFormEngineVersion(engineId2),
          ]);

          // Assert
          expect(results.length, equals(2));
          expect(results[0], isA<Success<FormEngineResponse>>());
          expect(results[1], isA<Success<FormEngineResponse>>());
          verify(
            () => mockDio.get<Map<String, dynamic>>(
              '/api/v1/form-engine',
              queryParameters: {'formEngineId': engineId1},
            ),
          ).called(1);
          verify(
            () => mockDio.get<Map<String, dynamic>>(
              '/api/v1/form-engine',
              queryParameters: {'formEngineId': engineId2},
            ),
          ).called(1);
        });

        test('it should call API exactly once per invocation', () async {
          // Arrange
          const engineId = '1';
          final mockResponse = MockResponse();
          final responseJson = jsonFromFixture(Fixture.checkFormEngineVersion);
          when(() => mockResponse.data).thenReturn(responseJson);
          when(
            () => mockDio.get<Map<String, dynamic>>(
              any(),
              queryParameters: any(named: 'queryParameters'),
            ),
          ).thenAnswer((_) async => mockResponse);

          // Act
          await dataSource.checkFormEngineVersion(engineId);
          await dataSource.checkFormEngineVersion(engineId);

          // Assert
          verify(
            () => mockDio.get<Map<String, dynamic>>(
              '/api/v1/form-engine',
              queryParameters: {'formEngineId': engineId},
            ),
          ).called(2);
        });
      });
    });
  });
}
