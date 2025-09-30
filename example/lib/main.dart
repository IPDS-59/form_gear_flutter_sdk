import 'package:alice/model/alice_configuration.dart';
import 'package:alice_dio/alice_dio_adapter.dart';
import 'package:flutter/material.dart';
import 'package:form_gear_engine_sdk/form_gear_engine_sdk.dart';
import 'package:alice/alice.dart';
import 'screens/home_screen.dart';
import 'env/env.dart';

// Global Alice instance for HTTP inspection
late Alice alice;
late AliceDioAdapter dioAdapter;
void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Alice for HTTP inspection
  alice = Alice(configuration: AliceConfiguration(showNotification: true));

  dioAdapter = AliceDioAdapter();

  alice.addAdapter(dioAdapter);

  // Initialize FormGear SDK (legacy mode for backward compatibility)
  await initializeFormGearSDK();

  runApp(const MyApp());
}

Future<void> initializeFormGearSDK() async {
  final apiConfig = FormGearApiConfig(
    baseUrl: Env.baseUrl,
    templateZipEndpoint: Env.endpointTemplateDownload,
    formEngineEndpoint: Env.endpointVerifyVersion,
    lookupEndpoint: Env.endpointLookup,
    authToken: Env.wilkerstatBearerToken,
    isProduction: Env.isProduction,
  );

  final config = FormGearConfig(
    clientMode: FormGearClientMode.capi,
    lookupKey: 'key%5B%5D',
    lookupValue: 'value%5B%5D',
    lookupMode: FormGearLookupMode.offline,
    username: 'example_user',
    formMode: FormGearFormMode.open,
    initialMode: FormGearInitialMode.initial,
    htmlLogPrefix: '🌐 HTML:',
    sdkLogPrefix: '📱 SDK:',
    serverPort: 3310,
    autoStartServer: true,
    enableLogging: true,
    bpsUser: const BpsUser(),
    apiConfig: apiConfig,
  );

  await FormGearSDK.instance.initialize(config, dioInterceptors: [dioAdapter]);
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      navigatorKey: alice.getNavigatorKey(),
      title: 'Form Gear SDK Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF1E88E5), // FormGear blue
          brightness: Brightness.light,
        ),
        useMaterial3: true,
        appBarTheme: AppBarTheme(
          backgroundColor: const Color(0xFF1E88E5),
          foregroundColor: Colors.white,
          elevation: 2,
          shadowColor: const Color(0xFF1E88E5).withValues(alpha: 0.3),
          titleTextStyle: const TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w600,
            color: Colors.white,
          ),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            elevation: 2,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
        ),
        cardTheme: CardThemeData(
          elevation: 4,
          shadowColor: Colors.black.withValues(alpha: 0.1),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
        floatingActionButtonTheme: const FloatingActionButtonThemeData(
          elevation: 6,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.all(Radius.circular(28)),
          ),
        ),
      ),
      home: const HomeScreen(),
    );
  }
}
