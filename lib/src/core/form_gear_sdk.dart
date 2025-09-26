import 'dart:io';

import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:form_gear_engine_sdk/form_gear_engine_sdk.dart';
import 'package:form_gear_engine_sdk/src/core/constants/directory_constants.dart';
import 'package:form_gear_engine_sdk/src/core/server/form_gear_server.dart';
import 'package:form_gear_engine_sdk/src/core/version/form_gear_version_manager.dart';
import 'package:form_gear_engine_sdk/src/models/models.dart';
import 'package:form_gear_engine_sdk/src/presentation/presentation.dart';
import 'package:form_gear_engine_sdk/src/utils/utils.dart';

/// Main FormGear SDK class - single entry point for all FormGear functionality
class FormGearSDK {
  FormGearSDK._internal();
  static final FormGearSDK _instance = FormGearSDK._internal();

  /// Singleton instance
  static FormGearSDK get instance => _instance;

  FormGearConfig? _config;
  FormGearServer? _server;
  bool _isInitialized = false;

  // Current form configuration
  FormConfig? _currentFormConfig;
  PreparedEngine? _currentPreparedEngine;

  // Version manager
  late FormGearVersionManager _versionManager;

  /// Initializes the FormGear SDK with configuration
  Future<void> initialize(
    FormGearConfig config, {
    List<Interceptor>? dioInterceptors,
    String? userAgent,
  }) async {
    // Allow re-initialization to update configuration
    _config = config;

    if (!_isInitialized) {
      // Configure dependency injection with config
      await configureDependencies(
        apiConfig: config.apiConfig,
        additionalInterceptors: dioInterceptors,
      );
    }

    // Initialize version manager
    _versionManager = getIt<FormGearVersionManager>();

    // Note: Dio interceptors are now configured in the DI container
    // AliceDioAdapter (if present) is automatically added last to capture all modifications

    // Note: Server is now started on-demand when WebView is opened
    // to reduce resource usage when not needed

    if (!_isInitialized) {
      FormGearLogger.sdk('FormGear SDK initialized successfully');
    } else {
      FormGearLogger.sdk('FormGear SDK configuration updated successfully');
    }

    _isInitialized = true;
  }

  /// Prepares the form engine by loading HTML, JS, and CSS assets internally
  /// Now accepts only FormEngineType enum for cleaner API
  Future<PreparedEngine> prepareEngine({
    required FormEngineType engineType,
    String? baseUrl,
    String? historyUrl,
  }) async {
    if (!_isInitialized) {
      throw Exception('FormGear SDK not initialized. Call initialize() first.');
    }

    FormGearLogger.sdk(
      'Preparing engine: ${engineType.displayName} (ID: ${engineType.id})',
    );

    try {
      // Load engine assets internally based on FormEngineType
      final engineAssets = await _loadEngineAssets(engineType);

      // Inject CSS and JS into HTML template
      var processedHtml = engineAssets.htmlTemplate;

      // Replace CSS placeholder
      processedHtml = processedHtml.replaceAll(
        '/*style*/',
        engineAssets.cssContent,
      );

      // Replace JS placeholder
      // Note: Don't wrap in IIFE as it's an ES module
      processedHtml = processedHtml.replaceAll(
        '//formgear_js',
        engineAssets.jsContent,
      );

      // Fix hardcoded Android asset paths by replacing with placeholders
      processedHtml = _fixAssetPaths(processedHtml);

      // Inject actual vendor asset content into placeholders
      processedHtml = await _injectVendorAssets(processedHtml);

      final preparedEngine = PreparedEngine(
        html: processedHtml,
        baseUrl: baseUrl ?? 'about:blank',
        historyUrl: historyUrl,
      );

      _currentPreparedEngine = preparedEngine;
      FormGearLogger.sdk(
        'Engine ${engineType.displayName} prepared successfully with ${processedHtml.length} chars HTML',
      );

      return preparedEngine;
    } catch (e) {
      FormGearLogger.sdkError(
        'Failed to prepare engine ${engineType.displayName}: $e',
      );
      rethrow;
    }
  }

  /// Loads form configuration (validation, template, etc.)
  void loadFormConfig(FormConfig formConfig) {
    if (!_isInitialized) {
      throw Exception('FormGear SDK not initialized. Call initialize() first.');
    }

    _currentFormConfig = formConfig;
    FormGearLogger.sdk('Form config loaded for form: ${formConfig.formId}');
  }

  /// Launches the prepared engine in a WebView page
  Future<void> launchPreparedEngine(
    BuildContext context, {
    String? title,
  }) async {
    if (!_isInitialized) {
      throw Exception('FormGear SDK not initialized. Call initialize() first.');
    }

    if (_currentPreparedEngine == null) {
      throw Exception('No engine prepared. Call prepareEngine() first.');
    }

    // Start server for lookup requests (FasihForm uses http://localhost:3310/lookup)
    // Note: HTML/CSS/JS are loaded directly inline, but server is needed for API calls
    if (_server?.isRunning != true) {
      await _startServer();
    }

    final webView = _createWebViewFromPreparedEngine();

    try {
      // Check if context is still mounted before navigation
      if (!context.mounted) return;

      // Navigate to a full-screen page with the WebView
      await Navigator.of(context).push<void>(
        MaterialPageRoute(
          builder: (context) => _FormGearEnginePage(
            title: title ?? 'FormGear Engine',
            webView: webView,
          ),
        ),
      );
    } finally {
      // Stop server when page is disposed to free resources
      if (_server != null && _server!.isRunning) {
        await _server!.stop();
        FormGearLogger.sdk('FormGear server stopped - WebView closed');
      }
    }
  }

  /// Creates WebView from prepared engine
  FormGearWebView _createWebViewFromPreparedEngine() {
    final preparedEngine = _currentPreparedEngine!;

    return FormGearWebView(
      url: 'about:blank',
      htmlContent: preparedEngine.html,
      jsHandlers: _createRequiredHandlers(),
      onWebViewCreated: (controller) {
        // WebView created - ready for JS bridge
      },
    );
  }

  /// Creates debug-only WebView for testing bridge functionality
  /// (DEBUG MODE ONLY)
  Future<FormGearWebView?> createDebugBridgeTest({
    List<JSHandler<dynamic>> customHandlers = const [],
    void Function(InAppWebViewController controller)? onWebViewCreated,
    void Function(InAppWebViewController controller, String url)? onLoadStart,
    void Function(InAppWebViewController controller, String url)? onLoadStop,
    void Function(
      InAppWebViewController controller,
      String url,
      int code,
      String message,
    )?
    onLoadError,
    void Function(
      InAppWebViewController controller,
      ConsoleMessage consoleMessage,
    )?
    onConsoleMessage,
  }) async {
    if (!kDebugMode) {
      FormGearLogger.sdkError('Debug bridge test only available in DEBUG mode');
      return null;
    }

    if (!_isInitialized) {
      throw Exception('FormGear SDK not initialized. Call initialize() first.');
    }

    // Load the debug bridge test HTML from SDK assets
    final bridgeTestHtml = await _loadDebugBridgeTestHtml();
    if (bridgeTestHtml == null) {
      FormGearLogger.sdkError('Could not load debug bridge test HTML');
      return null;
    }

    return FormGearWebView(
      url: 'about:blank',
      htmlContent: bridgeTestHtml,
      jsHandlers: [..._createRequiredHandlers(), ...customHandlers],
      onWebViewCreated: onWebViewCreated,
      onLoadStart: onLoadStart,
      onLoadStop: onLoadStop,
      onLoadError: onLoadError,
      onConsoleMessage: onConsoleMessage,
    );
  }

  /// Loads the debug bridge test HTML from package assets (DEBUG MODE ONLY)
  Future<String?> _loadDebugBridgeTestHtml() async {
    if (!kDebugMode) {
      return null;
    }

    try {
      const assetPath =
          'packages/form_gear_engine_sdk/assets/test/bridge_test.html';
      final htmlContent = await rootBundle.loadString(assetPath);

      // Process the HTML through vendor asset injection to replace jQuery placeholder
      final processedHtml = await _injectVendorAssets(htmlContent);
      return processedHtml;
    } on Exception catch (e) {
      FormGearLogger.sdkError('Failed to load debug bridge test HTML: $e');
      return null;
    }
  }

  /// Creates required handlers for FormGear and FasihForm compatibility
  List<JSHandler<dynamic>> _createRequiredHandlers() {
    final dataHandler = AndroidDataHandler(
      onGetReference: () async =>
          _currentFormConfig?.reference ??
          {
            'details': <dynamic>[],
            'sidebar': <dynamic>[],
          },
      onGetTemplate: () async =>
          _currentFormConfig?.template ??
          {
            'components': <dynamic>[<dynamic>[]],
          },
      onGetPreset: () async =>
          _currentFormConfig?.preset ??
          {
            'description': 'Default Preset',
            'dataKey': 'default_preset',
            'predata': <dynamic>[],
          },
      onGetResponse: () async =>
          _currentFormConfig?.response ??
          {
            'details': {'answers': <dynamic>[]},
          },
      onGetValidation: () async =>
          _currentFormConfig?.validation ??
          {
            'testFunctions': <dynamic>[],
          },
      onGetMedia: () async =>
          _currentFormConfig?.media ??
          {
            'details': {'media': <dynamic>[]},
          },
      onGetRemark: () async =>
          _currentFormConfig?.remark ??
          {
            'dataKey': 'default_remark',
            'notes': <dynamic>[],
          },
      onGetUserName: () async => _config?.username ?? 'Default User',
      onGetFormMode: () async => _currentFormConfig?.formMode ?? 1,
      onGetIsNew: () async => _currentFormConfig?.isNew ?? 1,
      onGetPrincipalCollection: () async =>
          _currentFormConfig?.principals ?? [],
      onGetRolePetugas: () async => _config?.bpsUser?.jabatan ?? 'USER',
      onGetUserRole: () async => _config?.bpsUser?.jabatan ?? 'USER',
    );

    final actionHandler = AndroidActionHandler(
      onAction: (action, dataKey, data, customData) async {
        FormGearLogger.webview(
          'FormGear fallback Action: $action, DataKey: $dataKey',
        );
        return 'Fallback action $action completed';
      },
      onExecute: (action, dataKey, data) async {
        FormGearLogger.webview(
          'FasihForm fallback Execute: $action, DataKey: $dataKey',
        );
        return 'Fallback execute $action completed';
      },
      onSaveOrSubmit:
          (response, remark, principal, reference, media, action) async {
            FormGearLogger.webview('FormGear SaveOrSubmit: $action');
            return 'form_${DateTime.now().millisecondsSinceEpoch}';
          },
      onSaveOrSubmitFasihForm: (response, remark, principal, action) async {
        FormGearLogger.webview('FasihForm SaveOrSubmit: $action');
        return 'fasih_form_${DateTime.now().millisecondsSinceEpoch}';
      },
    );

    // Individual action handlers following web_view pattern
    final actionCameraHandler = ActionHandler();
    final executeHandler = ExecuteHandler();

    // Get only save/submit handlers from the factory
    final saveSubmitHandlers = actionHandler
        .createHandlers()
        .where(
          (handler) =>
              handler.handlerName == 'saveOrSubmit' ||
              handler.handlerName == 'saveOrSubmitFasihForm',
        )
        .toList();

    return [
      ...dataHandler.createHandlers(),
      actionCameraHandler, // Individual action handler
      executeHandler, // Individual execute handler
      ...saveSubmitHandlers,
    ];
  }

  // Engine asset loading methods

  /// Loads engine assets from local storage or falls back to bundle assets
  Future<_EngineAssets> _loadEngineAssets(FormEngineType engineType) async {
    try {
      // Try to load from downloaded engine files first (using DirectoryConstants)
      final engineAssets = await _loadEngineFromLocal(engineType);
      if (engineAssets != null) {
        FormGearLogger.sdk(
          'Loaded ${engineType.displayName} engine from local storage',
        );
        return engineAssets;
      }
    } on Exception catch (e) {
      FormGearLogger.sdkError(
        'Failed to load ${engineType.displayName} from local storage: $e',
      );
    }

    // Fallback to bundle assets
    FormGearLogger.sdk(
      'Loading ${engineType.displayName} engine from bundle assets (fallback)',
    );
    return _loadEngineFromAssets(engineType);
  }

  /// Loads engine assets from local downloaded files using DirectoryConstants
  Future<_EngineAssets?> _loadEngineFromLocal(FormEngineType engineType) async {
    try {
      final engineId = engineType.id.toString();
      final engineDir = await DirectoryConstants.getFormEngineDirectory(
        engineId,
      );

      // Check if engine files exist locally
      final htmlFile = File('${engineDir.path}/index.html');
      if (!htmlFile.existsSync()) {
        // Try to download/copy engine files from assets first
        FormGearLogger.sdk(
          'Engine files not found locally, copying from assets...',
        );
        final downloadManager = getIt<FormGearDownloadManager>();
        final downloaded = await downloadManager.downloadFormEngine(engineId);

        if (!downloaded) {
          FormGearLogger.sdkError('Failed to copy engine files from assets');
          return null;
        }

        // Check again after download
        if (!htmlFile.existsSync()) {
          return null;
        }
      }

      // Load HTML template
      final htmlTemplate = htmlFile.readAsStringSync();

      // Load JS file based on engine type
      var jsContent = '';
      final jsFileName = _getJSFileName(engineType);
      final jsFile = File('${engineDir.path}/$jsFileName');

      if (jsFile.existsSync()) {
        jsContent = jsFile.readAsStringSync();
      } else {
        // Try alternative JS file names
        final alternativeJsFiles = _getAlternativeJSFileNames(engineType);
        for (final altJsFileName in alternativeJsFiles) {
          final altJsFile = File('${engineDir.path}/$altJsFileName');
          if (altJsFile.existsSync()) {
            jsContent = altJsFile.readAsStringSync();
            break;
          }
        }
      }

      // Load CSS content (optional)
      var cssContent = '';
      final cssFile = File('${engineDir.path}/style.css');
      if (cssFile.existsSync()) {
        cssContent = cssFile.readAsStringSync();
      }

      FormGearLogger.sdk(
        'Loaded local engine files: HTML(${htmlTemplate.length}), JS(${jsContent.length}), CSS(${cssContent.length})',
      );

      return _EngineAssets(
        htmlTemplate: htmlTemplate,
        jsContent: jsContent,
        cssContent: cssContent,
      );
    } catch (e) {
      FormGearLogger.sdkError('Error loading engine from local: $e');
      return null;
    }
  }

  /// Loads engine assets from bundle assets (fallback)
  Future<_EngineAssets> _loadEngineFromAssets(FormEngineType engineType) async {
    final engineId = engineType.id.toString();

    try {
      // Load HTML template from assets
      final htmlTemplate = await rootBundle.loadString(
        'assets/formengine/$engineId/index.html',
      );

      // Load JS file based on engine type
      var jsContent = '';
      final jsFileName = _getJSFileName(engineType);

      try {
        jsContent = await rootBundle.loadString(
          'assets/formengine/$engineId/$jsFileName',
        );
      } catch (e) {
        // Try alternative JS file names
        final alternativeJsFiles = _getAlternativeJSFileNames(engineType);
        for (final altJsFileName in alternativeJsFiles) {
          try {
            jsContent = await rootBundle.loadString(
              'assets/formengine/$engineId/$altJsFileName',
            );
            break;
          } catch (altE) {
            // Continue to next alternative
          }
        }

        if (jsContent.isEmpty) {
          throw Exception(
            'No valid JS file found for ${engineType.displayName}',
          );
        }
      }

      // Load CSS content (optional)
      var cssContent = '';
      try {
        cssContent = await rootBundle.loadString(
          'assets/formengine/$engineId/style.css',
        );
      } catch (e) {
        // CSS is optional, continue without it
        FormGearLogger.sdk('No CSS file found for ${engineType.displayName}');
      }

      FormGearLogger.sdk(
        'Loaded asset files: HTML(${htmlTemplate.length}), '
        'JS(${jsContent.length}), CSS(${cssContent.length})',
      );

      return _EngineAssets(
        htmlTemplate: htmlTemplate,
        jsContent: jsContent,
        cssContent: cssContent,
      );
    } catch (e) {
      throw Exception(
        'Failed to load ${engineType.displayName} from assets: $e',
      );
    }
  }

  /// Gets the primary JS file name for the engine type
  String _getJSFileName(FormEngineType engineType) {
    switch (engineType) {
      case FormEngineType.formGear:
        return 'form-gear.es.js';
      case FormEngineType.fasihForm:
        return 'fasih-form.es.js';
    }
  }

  /// Gets alternative JS file names to try if primary fails
  List<String> _getAlternativeJSFileNames(FormEngineType engineType) {
    switch (engineType) {
      case FormEngineType.formGear:
        return [
          'form-gear.umd.js',
          'formgear.js',
          'main.js',
          'index.js',
        ];
      case FormEngineType.fasihForm:
        return [
          'fasih-form.umd.js',
          'fasihform.js',
          'main.js',
          'index.js',
        ];
    }
  }

  /// Fixes hardcoded Android asset paths by injecting content directly
  /// Processes HTML content at runtime to replace server-provided script tags
  /// with inline content from SDK assets
  String _fixAssetPaths(String htmlContent) {
    var fixedHtml = htmlContent;
    var replacementCount = 0;

    // Order matters: Do specific replacements before generic ones

    // 1. Fix jQuery - inject directly from SDK assets
    const jqueryOriginal =
        '<script src="file:///android_asset/asset/jquery-3.5.1.js"></script>';
    if (fixedHtml.contains(jqueryOriginal)) {
      // Replace with inline script tag containing jQuery content
      fixedHtml = fixedHtml.replaceAll(
        jqueryOriginal,
        '<!-- jQuery injected by FormGear SDK -->\n<script>/*JQUERY_CONTENT*/</script>',
      );
      replacementCount++;
      FormGearLogger.sdk('Marked jQuery for inline injection');
    }

    // 2. Fix other specific vendor library asset paths (Bootstrap, etc.)
    const vendorAssetPaths = [
      'file:///android_asset/asset/bootstrap.js',
      'file:///android_asset/asset/bootstrap.css',
      'file:///android_asset/asset/bootstrap.min.js',
      'file:///android_asset/asset/bootstrap.min.css',
    ];

    for (final originalPath in vendorAssetPaths) {
      if (fixedHtml.contains(originalPath)) {
        final fileName = originalPath.split('/').last;
        final fixedPath =
            'https://formgear.assets/assets/packages/form_gear_engine_sdk/assets/vendor/$fileName';
        fixedHtml = fixedHtml.replaceAll(originalPath, fixedPath);
        replacementCount++;
        FormGearLogger.sdk('Fixed vendor asset: $fileName');
      }
    }

    // 3. Fix remaining generic asset directory paths (after specific ones)
    // Only replace if not already replaced by specific rules above
    const assetDirOriginal = 'file:///android_asset/asset/';
    const assetDirFixed =
        'https://formgear.assets/assets/packages/form_gear_engine_sdk/assets/vendor/';
    if (fixedHtml.contains(assetDirOriginal)) {
      // Skip if this would double-replace already fixed URLs
      if (!fixedHtml.contains(
        'https://formgear.assets/assets/packages/form_gear_engine_sdk/assets/vendor/https://formgear.assets',
      )) {
        final beforeCount = assetDirOriginal.allMatches(fixedHtml).length;
        fixedHtml = fixedHtml.replaceAll(assetDirOriginal, assetDirFixed);
        replacementCount += beforeCount;
        FormGearLogger.sdk('Fixed $beforeCount generic asset directory paths');
      }
    }

    // 4. Fix generic Android asset root paths (most generic, do last)
    // Only replace remaining file:///android_asset/ that haven't been fixed
    const androidAssetOriginal = 'file:///android_asset/';
    if (fixedHtml.contains(androidAssetOriginal)) {
      // Only replace paths that haven't been handled by more specific rules
      final remainingMatches = RegExp(
        'file:///android_asset/(?!asset/)',
      ).allMatches(fixedHtml);
      if (remainingMatches.isNotEmpty) {
        const fixedPath = 'https://formgear.assets/assets/';
        fixedHtml = fixedHtml.replaceAll(
          RegExp('file:///android_asset/(?!asset/)'),
          fixedPath,
        );
        replacementCount += remainingMatches.length;
        FormGearLogger.sdk(
          'Fixed ${remainingMatches.length} generic Android asset paths',
        );
      }
    }

    // CSS and JS placeholders are handled by prepareEngine direct injection
    if (fixedHtml.contains('/*style*/')) {
      FormGearLogger.sdk(
        'CSS placeholder detected - will be injected directly',
      );
    }
    if (fixedHtml.contains('//formgear_js')) {
      FormGearLogger.sdk('JS placeholder detected - will be injected directly');
    }

    if (replacementCount > 0) {
      FormGearLogger.sdk(
        'Fixed $replacementCount asset paths in HTML template',
      );
    } else {
      FormGearLogger.sdk('No asset paths needed fixing in HTML template');
    }

    return fixedHtml;
  }

  /// Inject actual jQuery content into HTML placeholders
  Future<String> _injectVendorAssets(String htmlContent) async {
    var processedHtml = htmlContent;

    // Inject jQuery content if placeholder exists
    if (processedHtml.contains('/*JQUERY_CONTENT*/')) {
      try {
        const jqueryAssetPath =
            'packages/form_gear_engine_sdk/assets/vendor/jquery-3.5.1.js';
        final jqueryContent = await rootBundle.loadString(jqueryAssetPath);
        processedHtml = processedHtml.replaceAll(
          '/*JQUERY_CONTENT*/',
          jqueryContent,
        );
        FormGearLogger.sdk(
          '✅ jQuery content injected (${jqueryContent.length} chars)',
        );
      } catch (e) {
        FormGearLogger.sdkError('❌ Failed to load jQuery: $e');
        // Fallback: remove the broken script tag
        processedHtml = processedHtml.replaceAll(
          '<script>/*JQUERY_CONTENT*/</script>',
          '<!-- jQuery injection failed -->',
        );
      }
    }

    return processedHtml;
  }

  Future<void> _startServer() async {
    try {
      final port = _config?.serverPort ?? 3310;
      _server = FormGearServer(port: port);
      final serverUrl = await _server!.start();

      if (serverUrl != null) {
        FormGearLogger.sdk('HTTP server started on $serverUrl');
      } else {
        FormGearLogger.sdkError('Failed to start HTTP server');
      }
    } on Exception catch (e) {
      FormGearLogger.sdkError('HTTP server startup failed: $e');
    }
  }

  /// Disposes of the SDK and cleans up resources
  Future<void> dispose() async {
    await _server?.stop();
    _server = null;
    _config = null;
    _isInitialized = false;

    // Clean up isolated GetIt instance
    await cleanupDependencies();

    FormGearLogger.sdk('FormGear SDK disposed');
  }

  /// Checks form engine version using 3-state logic (missing/outdated/current)
  /// and shows appropriate notification dialogs
  ///
  /// Returns [VersionCheckResult] containing:
  /// - [VersionState] (missing, outdated, or current)
  /// - Local and remote version information
  /// - Whether download is needed or forced
  /// - The form engine entity from API response
  Future<VersionCheckResult?> checkFormEngineVersion({
    required BuildContext? context,
    String? engineId,
    bool showNotifications = true,
  }) async {
    if (!_isInitialized) {
      throw Exception('FormGear SDK not initialized. Call initialize() first.');
    }

    // Delegate to version manager - returns full result with rich context
    return _versionManager.checkFormEngineVersion(
      engineId: engineId,
      showNotifications: showNotifications,
      context: context,
    );
  }

  /// Gets the current configuration
  FormGearConfig? get config => _config;

  /// Checks if the SDK is initialized
  bool get isInitialized => _isInitialized;
}

/// Internal page widget for displaying FormGear engine
class _FormGearEnginePage extends StatelessWidget {
  const _FormGearEnginePage({
    required this.title,
    required this.webView,
  });

  final String title;
  final FormGearWebView webView;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: webView,
    );
  }
}

/// Internal class to hold engine assets (HTML, JS, CSS)
class _EngineAssets {
  const _EngineAssets({
    required this.htmlTemplate,
    required this.jsContent,
    required this.cssContent,
  });

  final String htmlTemplate;
  final String jsContent;
  final String cssContent;
}
