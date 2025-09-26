import 'package:dio/dio.dart';
import 'package:form_gear_engine_sdk/src/core/config/form_gear_api_config.dart';
import 'package:form_gear_engine_sdk/src/core/config/form_gear_config.dart';
import 'package:form_gear_engine_sdk/src/utils/utils.dart';

class AuthInterceptor extends Interceptor {
  const AuthInterceptor({
    this.formGearConfig,
    this.apiConfig,
  });

  final FormGearConfig? formGearConfig;
  final FormGearApiConfig? apiConfig;

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    try {
      if (!options.headers.containsKey('Authorization')) {
        // Priority: API config auth token > BPS user session token
        var authToken = apiConfig?.authToken;

        // Fallback to BPS user session if no API token
        if (authToken == null && formGearConfig != null) {
          authToken =
              formGearConfig!.bpsUser?.sessionToken ??
              formGearConfig!.bpsUser?.authToken;
        }

        if (authToken != null) {
          // FASIH uses direct session string without Bearer prefix
          // for most endpoints
          options.headers['Authorization'] = authToken;
        }
      }
    } on Exception catch (e) {
      FormGearLogger.error('AuthInterceptor error: $e');
    }

    handler.next(options);
  }
}
