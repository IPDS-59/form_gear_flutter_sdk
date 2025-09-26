import 'package:dio/dio.dart';
import 'package:form_gear_engine_sdk/src/core/config/form_gear_api_config.dart';
import 'package:form_gear_engine_sdk/src/core/config/form_gear_config.dart';
import 'package:form_gear_engine_sdk/src/core/di/injection.config.dart';
import 'package:form_gear_engine_sdk/src/data/inteceptors/auth_interceptor.dart';
import 'package:form_gear_engine_sdk/src/data/inteceptors/general_fasih_header_interceptor.dart';
import 'package:get_it/get_it.dart';
import 'package:injectable/injectable.dart';

/// Isolated GetIt instance for FormGear SDK to prevent conflicts with client's GetIt
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
  // Register API config first if provided
  if (apiConfig != null) {
    getIt.registerSingleton<FormGearApiConfig>(apiConfig);
  }

  // Register FormGearConfig if provided
  if (formGearConfig != null) {
    getIt.registerSingleton<FormGearConfig>(formGearConfig);
  }

  // Register additional interceptors if provided
  if (additionalInterceptors != null && additionalInterceptors.isNotEmpty) {
    getIt.registerSingleton<List<Interceptor>>(additionalInterceptors);
  }

  // Configure other dependencies
  $initGetIt(getIt);
}

/// Clean up the SDK's isolated GetIt instance
/// Call this when the SDK is disposed or no longer needed
Future<void> cleanupDependencies() async {
  await getIt.reset();
}

/// Module for registering dependencies
@module
abstract class RegisterModule {
  /// Register Dio instance with API config and interceptors
  @lazySingleton
  Dio dio(FormGearApiConfig apiConfig) {
    final dio = Dio();

    // Configure base URL from API config
    if (apiConfig.baseUrl != null) {
      dio.options.baseUrl = apiConfig.baseUrl!;
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

    // Add auth interceptor with both configs if available
    final formConfig = getIt.isRegistered<FormGearConfig>()
        ? getIt<FormGearConfig>()
        : null;
    interceptors.add(
      AuthInterceptor(
        formGearConfig: formConfig,
        apiConfig: apiConfig,
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
