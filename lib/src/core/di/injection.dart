import 'package:dio/dio.dart';
import 'package:form_gear_engine_sdk/src/core/config/config_provider.dart';
import 'package:form_gear_engine_sdk/src/core/config/form_gear_api_config.dart';
import 'package:form_gear_engine_sdk/src/core/config/form_gear_config.dart';
import 'package:form_gear_engine_sdk/src/core/di/injection.config.dart';
import 'package:form_gear_engine_sdk/src/data/inteceptors/auth_interceptor.dart';
import 'package:form_gear_engine_sdk/src/data/inteceptors/general_fasih_header_interceptor.dart';
import 'package:get_it/get_it.dart';
import 'package:injectable/injectable.dart';

/// Isolated GetIt instance for FormGear SDK to prevent conflicts
/// with client's GetIt
final getIt = GetIt.asNewInstance();

@InjectableInit(
  initializerName: r'$initGetIt',
  preferRelativeImports: false,
  asExtension: false,
)
Future<void> configureDependencies({
  FormGearApiConfig? apiConfig,
  FormGearConfig? formGearConfig,
  List<Interceptor>? additionalInterceptors,
}) async {
  // ConfigProvider is now registered via @LazySingleton annotation

  // Register API config if provided (or update existing)
  if (apiConfig != null) {
    if (getIt.isRegistered<FormGearApiConfig>()) {
      getIt.unregister<FormGearApiConfig>();
    }
    getIt.registerSingleton<FormGearApiConfig>(apiConfig);
  }

  // Register FormGearConfig if provided (or update existing)
  if (formGearConfig != null) {
    if (getIt.isRegistered<FormGearConfig>()) {
      getIt.unregister<FormGearConfig>();
    }
    getIt.registerSingleton<FormGearConfig>(formGearConfig);
  }

  // Register additional interceptors if provided
  if (additionalInterceptors != null && additionalInterceptors.isNotEmpty) {
    if (getIt.isRegistered<List<Interceptor>>()) {
      getIt.unregister<List<Interceptor>>();
    }
    getIt.registerSingleton<List<Interceptor>>(additionalInterceptors);
  }

  // Configure other dependencies only if not already initialized
  // This prevents re-registering singletons like ConfigProvider
  if (!getIt.isRegistered<ConfigProvider>()) {
    $initGetIt(getIt);
  }
}

/// Clean up the SDK's isolated GetIt instance
/// Call this when the SDK is disposed or no longer needed
Future<void> cleanupDependencies() async {
  await getIt.reset();
}

/// Module for registering dependencies
@module
abstract class RegisterModule {
  /// Register Dio instance with interceptors
  @lazySingleton
  Dio dio(ConfigProvider configProvider) {
    final dio = Dio();

    // Get initial API config for base URL setup
    final apiConfig = configProvider.apiConfig;
    if (apiConfig?.baseUrl != null) {
      dio.options.baseUrl = apiConfig!.baseUrl!;
    }

    // Set default timeouts
    dio.options.connectTimeout = const Duration(seconds: 30);
    dio.options.receiveTimeout = const Duration(seconds: 30);
    dio.options.sendTimeout = const Duration(seconds: 30);

    // Collect all interceptors that need to be added
    final interceptors = <Interceptor>[];
    final aliceInterceptors = <Interceptor>[];

    // Add FASIH header interceptor
    interceptors.add(const GeneralFasihHeaderInterceptor());

    // Add auth interceptor with ConfigProvider for real-time config access
    interceptors.add(
      AuthInterceptor(
        configProvider: configProvider,
      ),
    );

    // Add logging in debug mode
    interceptors.add(
      LogInterceptor(
        requestBody: true,
        responseBody: true,
      ),
    );

    // Process additional interceptors if they were registered
    if (getIt.isRegistered<List<Interceptor>>()) {
      final additionalInterceptors = getIt<List<Interceptor>>();

      // Separate Alice interceptors from other interceptors
      // Alice interceptors must be added LAST to capture all request/response modifications
      for (final interceptor in additionalInterceptors) {
        // Check if this is an Alice interceptor by runtime type name
        if (interceptor.runtimeType.toString().contains('Alice')) {
          // Store Alice interceptors to add them last
          aliceInterceptors.add(interceptor);
        } else {
          // Add other interceptors in their original order
          interceptors.add(interceptor);
        }
      }
    }

    // Add all non-Alice interceptors first
    dio.interceptors.addAll(interceptors);

    // Add Alice interceptors LAST if they exist
    // This ensures Alice can capture the final request/response after all modifications
    // by other interceptors (auth, headers, etc.)
    if (aliceInterceptors.isNotEmpty) {
      dio.interceptors.addAll(aliceInterceptors);
    }

    return dio;
  }
}
