import 'package:envied/envied.dart';

part 'env.g.dart';

@Envied(path: '.env')
abstract class Env {
  @EnviedField(varName: 'BASE_URL')
  static const String baseUrl = _Env.baseUrl;

  @EnviedField(varName: 'ENDPOINT_VERIFY_VERSION')
  static const String endpointVerifyVersion = _Env.endpointVerifyVersion;

  @EnviedField(varName: 'WILKERSTAT_BPS_KEY')
  static const String wilkerstatBpsKey = _Env.wilkerstatBpsKey;

  @EnviedField(varName: 'WILKERSTAT_TOKEN')
  static const String wilkerstatToken = _Env.wilkerstatToken;

  // Computed properties for FormGearApiConfig
  static String get templateApiBaseUrl => baseUrl;
  static String get formEngineApiBaseUrl => baseUrl;
  static String get authApiBaseUrl => baseUrl;
  static String get authToken => wilkerstatToken;
  static const bool isProduction = false;
}
