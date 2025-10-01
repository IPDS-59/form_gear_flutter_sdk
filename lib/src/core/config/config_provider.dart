import 'package:form_gear_engine_sdk/src/core/config/form_gear_api_config.dart';
import 'package:form_gear_engine_sdk/src/core/config/form_gear_config.dart';
import 'package:form_gear_engine_sdk/src/core/di/injection.dart';
import 'package:injectable/injectable.dart';

/// Interface for providing real-time access to current SDK configuration
/// This allows components like AuthInterceptor to get fresh config on each
/// request instead of holding stale references
abstract class ConfigProvider {
  /// Gets the current FormGearConfig, or null if not available
  FormGearConfig? get formGearConfig;

  /// Gets the current FormGearApiConfig, or null if not available
  FormGearApiConfig? get apiConfig;
}

/// Implementation that fetches fresh config from DI container on each access
/// This ensures AuthInterceptor always uses the latest configuration
@LazySingleton(as: ConfigProvider)
class FormGearConfigProvider implements ConfigProvider {
  const FormGearConfigProvider();

  @override
  FormGearConfig? get formGearConfig {
    try {
      // Always fetch fresh config from DI container
      if (getIt.isRegistered<FormGearConfig>()) {
        return getIt<FormGearConfig>();
      }
    } on Exception {
      // Return null if config not available - graceful degradation
    }
    return null;
  }

  @override
  FormGearApiConfig? get apiConfig {
    try {
      // Always fetch fresh API config from DI container
      if (getIt.isRegistered<FormGearApiConfig>()) {
        return getIt<FormGearApiConfig>();
      }
    } on Exception {
      // Return null if config not available - graceful degradation
    }
    return null;
  }
}
