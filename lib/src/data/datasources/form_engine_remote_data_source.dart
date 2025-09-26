import 'package:dio/dio.dart';
import 'package:form_gear_engine_sdk/src/core/base/failure.dart';
import 'package:form_gear_engine_sdk/src/core/base/result.dart';
import 'package:form_gear_engine_sdk/src/core/config/form_gear_api_config.dart';
import 'package:form_gear_engine_sdk/src/models/form_engine_response.dart';
import 'package:injectable/injectable.dart';

/// Abstract interface for form engine remote data source
abstract class FormEngineRemoteDataSource {
  /// Check form engine version from FASIH API
  Future<Result<FormEngineResponse>> checkFormEngineVersion([
    String? formEngineId,
  ]);
}

@LazySingleton(as: FormEngineRemoteDataSource)
/// Implementation of form engine remote data source using Dio
class FormEngineRemoteDataSourceImpl implements FormEngineRemoteDataSource {
  FormEngineRemoteDataSourceImpl({
    required FormGearApiConfig apiConfig,
    required Dio dio,
  }) : _apiConfig = apiConfig,
       _dio = dio;

  final FormGearApiConfig _apiConfig;
  final Dio _dio;

  @override
  Future<Result<FormEngineResponse>> checkFormEngineVersion([
    String? formEngineId,
  ]) async {
    try {
      final formEngineUrl = _apiConfig.formEngineUrl;
      if (formEngineUrl == null) {
        return const Failure(
          ServerFailure('Form engine API endpoint not configured'),
        );
      }

      // Add formEngineId query parameter as required by FASIH API
      final queryParameters = <String, dynamic>{};
      if (formEngineId != null && formEngineId.isNotEmpty) {
        queryParameters['formEngineId'] = formEngineId;
      }

      final response = await _dio.get<Map<String, dynamic>>(
        _apiConfig.formEngineEndpoint!,
        queryParameters: queryParameters,
      );

      final formEngineResponse = FormEngineResponse.fromJson(response.data!);

      return Success(formEngineResponse);
    } on DioException catch (e, stackTrace) {
      return Failure(_mapDioException(e), stackTrace);
    } on Exception catch (e, stackTrace) {
      return Failure(UnknownFailure(e.toString()), stackTrace);
    }
  }

  /// Maps Dio exceptions to appropriate failure types
  AppFailure _mapDioException(DioException exception) {
    switch (exception.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return NetworkFailure(
          'Network timeout: ${exception.message}',
          exception.type.name,
        );

      case DioExceptionType.connectionError:
        return NetworkFailure(
          'Connection error: ${exception.message}',
          exception.type.name,
        );

      case DioExceptionType.badResponse:
        final statusCode = exception.response?.statusCode;
        final message = exception.response?.statusMessage ?? 'Bad response';

        if (statusCode != null) {
          if (statusCode >= 400 && statusCode < 500) {
            if (statusCode == 401 || statusCode == 403) {
              return AuthFailure(message, statusCode.toString());
            }
            return ClientFailure(message, statusCode.toString());
          } else if (statusCode >= 500) {
            return ServerFailure(message, statusCode.toString());
          }
        }
        return ServerFailure(message, statusCode?.toString());

      case DioExceptionType.cancel:
        return NetworkFailure('Request cancelled', exception.type.name);

      case DioExceptionType.badCertificate:
        return NetworkFailure(
          'Bad certificate: ${exception.message}',
          exception.type.name,
        );

      case DioExceptionType.unknown:
        return UnknownFailure(
          exception.message ?? 'Unknown error occurred',
          exception.type.name,
        );
    }
  }
}
