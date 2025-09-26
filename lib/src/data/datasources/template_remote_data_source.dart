import 'package:dio/dio.dart';
import 'package:form_gear_engine_sdk/src/core/base/failure.dart';
import 'package:form_gear_engine_sdk/src/core/base/result.dart';
import 'package:form_gear_engine_sdk/src/core/config/form_gear_api_config.dart';
import 'package:form_gear_engine_sdk/src/models/custom_data_template.dart';
import 'package:form_gear_engine_sdk/src/models/list_lookup_notif_response.dart';
import 'package:injectable/injectable.dart';

/// Abstract interface for template remote data source
abstract class TemplateRemoteDataSource {
  /// Get custom template data by template ID and version
  Future<Result<CustomDataTemplate>> getCustomTemplateData(
    String templateId,
    String templateVersion,
  );

  /// Get lookup data by survey ID
  Future<Result<ListLookupNotifResponse>> getLookupData(String surveyId);
}

@LazySingleton(as: TemplateRemoteDataSource)
/// Implementation of template remote data source using Dio
class TemplateRemoteDataSourceImpl implements TemplateRemoteDataSource {
  TemplateRemoteDataSourceImpl({
    required FormGearApiConfig apiConfig,
    required Dio dio,
  }) : _apiConfig = apiConfig,
       _dio = dio;

  final FormGearApiConfig _apiConfig;
  final Dio _dio;

  @override
  Future<Result<CustomDataTemplate>> getCustomTemplateData(
    String templateId,
    String templateVersion,
  ) async {
    try {
      if (_apiConfig.templateZipEndpoint == null) {
        return const Failure(
          ServerFailure('Template endpoint not configured'),
        );
      }

      final endpoint = _apiConfig.templateZipEndpoint!.replaceAll(
        '{templateId}',
        templateId,
      );

      final response = await _dio.get<Map<String, dynamic>>(
        endpoint,
        queryParameters: {'templateVersion': templateVersion},
      );

      final customDataTemplate = CustomDataTemplate.fromJson(response.data!);

      return Success(customDataTemplate);
    } on DioException catch (e, stackTrace) {
      return Failure(_mapDioException(e), stackTrace);
    } catch (e, stackTrace) {
      return Failure(UnknownFailure(e.toString()), stackTrace);
    }
  }

  @override
  Future<Result<ListLookupNotifResponse>> getLookupData(
    String surveyId,
  ) async {
    try {
      if (_apiConfig.lookupEndpoint == null) {
        return const Failure(
          ServerFailure('Lookup endpoint not configured'),
        );
      }

      final response = await _dio.get<Map<String, dynamic>>(
        _apiConfig.lookupEndpoint!,
        queryParameters: {'surveyId': surveyId},
      );

      final lookupResponse = ListLookupNotifResponse.fromJson(response.data!);

      return Success(lookupResponse);
    } on DioException catch (e, stackTrace) {
      return Failure(_mapDioException(e), stackTrace);
    } catch (e, stackTrace) {
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
