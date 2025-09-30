import 'package:dio/dio.dart';
import 'package:form_gear_engine_sdk/src/core/config/config_provider.dart';
import 'package:form_gear_engine_sdk/src/utils/utils.dart';

class AuthInterceptor extends Interceptor {
  const AuthInterceptor({
    required this.configProvider,
  });

  final ConfigProvider configProvider;

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    try {
      if (!options.headers.containsKey('Authorization')) {
        // Get fresh config on each request to ensure we use updated tokens
        final apiConfig = configProvider.apiConfig;
        final formGearConfig = configProvider.formGearConfig;

        // Priority: API config auth token > BPS user session token
        var authToken = apiConfig?.authToken;

        // Fallback to BPS user session if no API token
        if (authToken == null && formGearConfig != null) {
          final token =
              formGearConfig.bpsUser?.sessionToken ??
              formGearConfig.bpsUser?.authToken;
          authToken = 'Bearer $token';
        }

        if (authToken != null) {
          // FASIH uses direct session string without Bearer prefix
          // for most endpoints
          options.headers['Authorization'] = 'Bearer $authToken';
        }
      }
    } on Exception catch (e) {
      FormGearLogger.error('AuthInterceptor error: $e');
    }

    handler.next(options);
  }
}
