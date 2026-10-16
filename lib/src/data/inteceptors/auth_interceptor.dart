import 'package:dio/dio.dart';
import 'package:form_gear_engine_sdk/src/core/config/config_provider.dart';
import 'package:form_gear_engine_sdk/src/utils/utils.dart';

class AuthInterceptor extends Interceptor {
  const AuthInterceptor({required this.configProvider});

  final ConfigProvider configProvider;

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    try {
      if (!options.headers.containsKey('Authorization')) {
        // Get fresh config on each request to ensure we use updated tokens
        final apiConfig = configProvider.apiConfig;
        final formGearConfig = configProvider.formGearConfig;

        // Priority: API config auth token > BPS user session token
        final token =
            _nonEmpty(apiConfig?.authToken) ??
            _nonEmpty(formGearConfig?.bpsUser?.sessionToken) ??
            _nonEmpty(formGearConfig?.bpsUser?.authToken);

        // No token means no header, and a token that already carries the
        // scheme is sent as is, never "Bearer Bearer ..." or "Bearer null".
        if (token != null) {
          options.headers['Authorization'] = token.startsWith('Bearer ')
              ? token
              : 'Bearer $token';
        }
      }
    } on Exception catch (e) {
      FormGearLogger.error('AuthInterceptor error: $e');
    }

    handler.next(options);
  }

  static String? _nonEmpty(String? value) =>
      value == null || value.trim().isEmpty ? null : value.trim();
}
