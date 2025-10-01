import 'dart:convert';
import 'dart:io';

import 'package:alice/alice.dart';
import 'package:alice/model/alice_configuration.dart';
import 'package:alice_dio/alice_dio_adapter.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:form_gear_engine_sdk/form_gear_engine_sdk.dart';
import 'package:path_provider/path_provider.dart';

import 'env/env.dart';
import 'screens/home_screen.dart';

// Global Alice instance for HTTP inspection
late Alice alice;
late AliceDioAdapter dioAdapter;
void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Alice for HTTP inspection
  alice = Alice(configuration: AliceConfiguration(showNotification: true));

  dioAdapter = AliceDioAdapter();

  alice.addAdapter(dioAdapter);

  // Copy bundled assets to local storage on first launch
  await _initializeAssets();

  // Initialize FormGear SDK (legacy mode for backward compatibility)
  await initializeFormGearSDK();

  runApp(const MyApp());
}

/// Copy bundled form engines and templates from assets to local BPS directory
Future<void> _initializeAssets() async {
  try {
    // Use the same directory logic as DirectoryConstants to ensure consistency
    Directory baseDir;
    if (Platform.isAndroid) {
      try {
        final externalDir = await getExternalStorageDirectory();
        baseDir = externalDir != null
            ? Directory('${externalDir.path}/BPS')
            : Directory(
                '${(await getApplicationDocumentsDirectory()).path}/BPS',
              );
      } catch (e) {
        baseDir = Directory(
          '${(await getApplicationDocumentsDirectory()).path}/BPS',
        );
      }
    } else {
      baseDir = Directory(
        '${(await getApplicationDocumentsDirectory()).path}/BPS',
      );
    }
    final bpsDir = baseDir;

    // Check if already initialized and engines exist
    final initMarker = File('${bpsDir.path}/.initialized');
    final engine1Dir = Directory('${bpsDir.path}/formengine/1');
    final engine2Dir = Directory('${bpsDir.path}/formengine/2');

    // Only skip if marker exists AND both engines are present
    if (await initMarker.exists() &&
        await engine1Dir.exists() &&
        await engine2Dir.exists()) {
      debugPrint('Assets already initialized and engines present, skipping...');
      return;
    }

    // If marker exists but engines missing, delete marker and re-initialize
    if (await initMarker.exists()) {
      debugPrint('Marker exists but engines missing, re-initializing...');
      await initMarker.delete();
    }

    debugPrint('Initializing bundled assets to local storage...');

    // Copy form engines (FormGear and FasihForm)
    await _copyAssetDirectory('assets/formengine', '${bpsDir.path}/formengine');

    // Copy templates
    await _copyAssetDirectory('assets/Template', '${bpsDir.path}/Template');

    // Copy lookup data if exists
    try {
      await _copyAssetDirectory('assets/lookup', '${bpsDir.path}/lookup');
    } catch (e) {
      debugPrint('No lookup assets found (this is optional): $e');
    }

    // Create initialization marker
    await bpsDir.create(recursive: true);
    await initMarker.writeAsString(DateTime.now().toIso8601String());

    debugPrint('✓ Assets initialized successfully');
  } catch (e, stackTrace) {
    debugPrint('Error initializing assets: $e');
    debugPrint('StackTrace: $stackTrace');
  }
}

/// Recursively copy directory from assets to local storage
Future<void> _copyAssetDirectory(String assetPath, String targetPath) async {
  try {
    // List all files in the asset directory
    final manifestContent = await rootBundle.loadString('AssetManifest.json');
    final Map<String, dynamic> manifestMap = Map<String, dynamic>.from(
      json.decode(manifestContent) as Map,
    );

    // Filter assets that start with our path and skip system files
    final assetFiles = manifestMap.keys.where((key) {
      if (!key.startsWith(assetPath)) return false;

      // Skip macOS system files
      final fileName = key.split('/').last;
      if (fileName == '.DS_Store') return false;
      if (fileName.startsWith('._')) return false;

      return true;
    }).toList();

    if (assetFiles.isEmpty) {
      debugPrint('No assets found in $assetPath');
      return;
    }

    debugPrint('Copying ${assetFiles.length} files from $assetPath...');

    for (final assetFile in assetFiles) {
      try {
        // Calculate relative path and target file path
        final relativePath = assetFile.substring(assetPath.length);
        final targetFile = File('$targetPath$relativePath');

        // Create parent directory
        await targetFile.parent.create(recursive: true);

        // Copy file from assets
        final data = await rootBundle.load(assetFile);
        final bytes = data.buffer.asUint8List();
        await targetFile.writeAsBytes(bytes);

        debugPrint('  ✓ Copied: ${targetFile.path}');
      } catch (e) {
        debugPrint('  ✗ Failed to copy $assetFile: $e');
        // Continue with other files instead of failing completely
      }
    }

    debugPrint('✓ Completed copying $assetPath');
  } catch (e, stackTrace) {
    debugPrint('Error copying asset directory $assetPath: $e');
    debugPrint('StackTrace: $stackTrace');
    rethrow;
  }
}

Future<void> initializeFormGearSDK() async {
  final apiConfig = FormGearApiConfig(
    baseUrl: Env.baseUrl,
    formEngineEndpoint: Env.endpointVerifyVersion,
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
