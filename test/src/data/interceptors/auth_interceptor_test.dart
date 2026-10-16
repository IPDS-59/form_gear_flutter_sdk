import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:form_gear_engine_sdk/form_gear_engine_sdk.dart';
import 'package:form_gear_engine_sdk/src/core/config/config_provider.dart';
import 'package:form_gear_engine_sdk/src/data/inteceptors/auth_interceptor.dart';
import 'package:mocktail/mocktail.dart';

class _MockConfigProvider extends Mock implements ConfigProvider {}

class _MockFormGearConfig extends Mock implements FormGearConfig {}

void main() {
  late _MockConfigProvider provider;
  late AuthInterceptor interceptor;

  setUp(() {
    provider = _MockConfigProvider();
    interceptor = AuthInterceptor(configProvider: provider);
  });

  Future<String?> authHeader({
    String? apiToken,
    BpsUser? user,
    String? preset,
  }) async {
    final config = _MockFormGearConfig();
    when(() => config.bpsUser).thenReturn(user);
    when(() => provider.formGearConfig).thenReturn(config);
    when(() => provider.apiConfig).thenReturn(
      apiToken == null ? null : FormGearApiConfig(authToken: apiToken),
    );
    final options = RequestOptions(
      headers: preset == null ? null : {'Authorization': preset},
    );
    final handler = RequestInterceptorHandler();
    interceptor.onRequest(options, handler);
    return options.headers['Authorization'] as String?;
  }

  group('AuthInterceptor', () {
    test('sends no Authorization header when no token is configured', () async {
      expect(await authHeader(), isNull);
      expect(await authHeader(user: const BpsUser()), isNull);
    });

    test('sends no Authorization header for an empty token', () async {
      expect(await authHeader(apiToken: ''), isNull);
    });

    test('prefixes a raw API token with Bearer once', () async {
      expect(await authHeader(apiToken: 'abc'), 'Bearer abc');
    });

    test('does not double prefix a token that starts with Bearer', () async {
      expect(await authHeader(apiToken: 'Bearer abc'), 'Bearer abc');
    });

    test('falls back to the BPS user session token', () async {
      expect(
        await authHeader(user: const BpsUser(sessionToken: 'sess')),
        'Bearer sess',
      );
      expect(
        await authHeader(user: const BpsUser(authToken: 'auth')),
        'Bearer auth',
      );
    });

    test('keeps an Authorization header the caller already set', () async {
      expect(
        await authHeader(apiToken: 'abc', preset: 'Bearer own'),
        'Bearer own',
      );
    });
  });
}
