import 'dart:io';

import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:form_gear_engine_sdk/form_gear_engine_sdk.dart';
import 'package:form_gear_engine_sdk/src/core/config/form_config.dart';
import 'package:form_gear_engine_sdk/src/core/di/injection.dart';
import 'package:form_gear_engine_sdk/src/core/engine/handler_factory.dart';
import 'package:form_gear_engine_sdk/src/core/engine/webview_builder.dart';
import 'package:form_gear_engine_sdk/src/core/server/form_gear_server.dart';
import 'package:form_gear_engine_sdk/src/core/services/services.dart';
import 'package:form_gear_engine_sdk/src/core/version/form_gear_version_manager.dart';
import 'package:form_gear_engine_sdk/src/domain/usecases/is_form_engine_downloaded_usecase.dart';
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
  FormGearGlobalConfig? _globalConfig;
  FormGearServer? _server;
  bool _isInitialized = false;

  // Current form configuration (legacy)
  FormConfig? _currentFormConfig;
  late PreparedEngine? _currentPreparedEngine;
  FormEngineType? _currentEngineType;

  // Current assignment context (new assignment-based system)
  AssignmentContext? _currentAssignment;

  /// Gets the current assignment context
  AssignmentContext? get currentAssignment => _currentAssignment;

  // Version manager
  late FormGearVersionManager _versionManager;

  // Services
  final ListenerRegistry _listenerRegistry = ListenerRegistry();
  final EnginePreparationService _engineService = EnginePreparationService();

  /// Initializes the FormGear SDK with global configuration
  /// This is the new assignment-based initialization method
  Future<void> initializeGlobal(
    FormGearGlobalConfig globalConfig, {
    List<Interceptor>? dioInterceptors,
    String? userAgent,
  }) async {
    // Store global configuration
    _globalConfig = globalConfig;

    // Convert to legacy config for compatibility
    _config = globalConfig.toLegacyConfig();

    // Always call configureDependencies - it will handle updates
    // The DI container now checks if ConfigProvider is already registered
    await configureDependencies(
      apiConfig: globalConfig.apiConfig,
      formGearConfig: _config,
      additionalInterceptors: dioInterceptors,
    );

    // Initialize version manager (or get existing instance)
    _versionManager = getIt<FormGearVersionManager>();

    if (!_isInitialized) {
      FormGearLogger.sdk('FormGear SDK initialized with global configuration');
    } else {
      FormGearLogger.sdk(
        'FormGear SDK global configuration updated successfully',
      );
    }

    _isInitialized = true;
  }

  /// Initializes the FormGear SDK with configuration (legacy method)
  /// For backward compatibility - use initializeGlobal for new projects
  Future<void> initialize(
    FormGearConfig config, {
    List<Interceptor>? dioInterceptors,
    String? userAgent,
  }) async {
    // Allow re-initialization to update configuration
    _config = config;

    // Always call configureDependencies - it will handle updates
    // The DI container now checks if ConfigProvider is already registered
    await configureDependencies(
      apiConfig: config.apiConfig,
      formGearConfig: config,
      additionalInterceptors: dioInterceptors,
    );

    // Initialize version manager (or get existing instance)
    _versionManager = getIt<FormGearVersionManager>();

    // Note: Dio interceptors are now configured in the DI container
    // AliceDioAdapter (if present) is automatically added last to capture
    // all modifications

    // Note: Server is now started on-demand when WebView is opened
    // to reduce resource usage when not needed

    if (!_isInitialized) {
      FormGearLogger.sdk('FormGear SDK initialized successfully (legacy mode)');
    } else {
      FormGearLogger.sdk(
        'FormGear SDK configuration updated successfully - '
        'AuthInterceptor will use new tokens on next request',
      );
    }

    _isInitialized = true;
  }

  /// Prepares the form engine by loading HTML, JS, and CSS assets internally
  Future<PreparedEngine> _prepareEngine({
    required FormEngineType engineType,
    String? baseUrl,
    String? historyUrl,
    void Function(int received, int total)? onProgress,
  }) async {
    if (!_isInitialized) {
      throw Exception('FormGear SDK not initialized. Call initialize() first.');
    }

    return _engineService.prepareEngine(
      engineType: engineType,
      baseUrl: baseUrl,
      historyUrl: historyUrl,
      onProgress: onProgress,
    );
  }

  /// Loads form configuration (validation, template, etc.)
  void loadFormConfig(FormConfig formConfig) {
    if (!_isInitialized) {
      throw Exception('FormGear SDK not initialized. Call initialize() first.');
    }

    _currentFormConfig = formConfig;
    FormGearLogger.sdk('Form config loaded for form: ${formConfig.formId}');
  }

  /// Sets the FormDataListener for handling save/submit operations
  void setFormDataListener(FormDataListener? listener) =>
      _listenerRegistry.setFormDataListener(listener);

  /// Gets the currently registered FormDataListener
  FormDataListener? get formDataListener => _listenerRegistry.formDataListener;

  /// Checks if a FormDataListener is currently registered
  bool get hasFormDataListener => _listenerRegistry.hasFormDataListener;

  /// Removes the currently registered FormDataListener
  void removeFormDataListener() => _listenerRegistry.removeFormDataListener();

  /// Sets the FileUploadListener for handling file upload operations
  void setFileUploadListener(FileUploadListener? listener) =>
      _listenerRegistry.setFileUploadListener(listener);

  /// Gets the currently registered FileUploadListener
  FileUploadListener? get fileUploadListener =>
      _listenerRegistry.fileUploadListener;

  /// Checks if a FileUploadListener is currently registered
  bool get hasFileUploadListener => _listenerRegistry.hasFileUploadListener;

  /// Removes the currently registered FileUploadListener
  void removeFileUploadListener() =>
      _listenerRegistry.removeFileUploadListener();

  /// Opens form with assignment context (new assignment-based method)
  /// This method uses dynamic configuration based on assignment context
  Future<void> openFormWithAssignment({
    required BuildContext context,
    required AssignmentContext assignment,
    String? title,
    void Function(int received, int total)? onProgress,
  }) async {
    if (!_isInitialized) {
      throw Exception(
        'FormGear SDK not initialized. Call initializeGlobal() first.',
      );
    }

    // Store current assignment context
    _currentAssignment = assignment;

    // Update legacy config with assignment-specific settings for compatibility
    if (_globalConfig != null) {
      _config = _globalConfig!.toLegacyConfig(
        assignmentConfig: assignment.config,
      );
    }

    // Prepare engine based on explicit engine ID or determine from template
    final engineType = assignment.formEngineId != null
        ? FormEngineType.fromId(int.tryParse(assignment.formEngineId!))
        : _determineEngineTypeFromTemplate(assignment.templateId);

    if (engineType == null) {
      throw Exception(
        'Invalid form engine ID: ${assignment.formEngineId}. '
        'Valid IDs are: 1 (FormGear), 2 (FasihForm)',
      );
    }

    final preparedEngine = await _prepareEngine(
      engineType: engineType,
      onProgress: onProgress,
    );
    _currentPreparedEngine = preparedEngine;
    _currentEngineType = engineType;

    // Load form configuration from assignment data
    loadFormConfig(
      FormConfig(
        formId: assignment.assignmentId,
        template: assignment.data.template,
        validation: assignment.data.validation,
        response: assignment.data.response,
        media: assignment.data.media,
        reference: assignment.data.reference,
        remark: assignment.data.remark,
        preset: assignment.data.preset,
        principals: assignment.data.principals,
      ),
    );

    // Start server if configured to auto-start
    await _startServerIfNeeded();

    // iOS: Set dynamic HTML on server and get URL for loading
    // iOS WKWebView has issues with loadData() for large HTML content
    var engineToUse = preparedEngine;
    if (Platform.isIOS && _server != null && _server!.isRunning) {
      _server!.setDynamicHtmlContent(preparedEngine.html);
      final serverUrl = _server!.dynamicHtmlUrl;
      if (serverUrl != null) {
        engineToUse = preparedEngine.withServerUrl(serverUrl);
        FormGearLogger.sdk(
          'iOS: Using server URL for HTML loading: $serverUrl',
        );
      }
    }
    _currentPreparedEngine = engineToUse;

    // Create WebView with assignment-specific handlers
    final webView = _createWebViewWithAssignment(assignment);

    try {
      // Check if context is still mounted before navigation
      if (!context.mounted) return;

      // Navigate to a full-screen page with the WebView
      await Navigator.of(context).push<void>(
        MaterialPageRoute(
          builder: (context) => WebViewBuilder.createFormGearEnginePage(
            title: title ?? 'FormGear - ${assignment.templateId}',
            webView: webView,
          ),
        ),
      );
    } finally {
      // Clear assignment context and stop server when done
      _currentAssignment = null;
      if (_server != null && _server!.isRunning) {
        // Clear dynamic HTML content on iOS
        if (Platform.isIOS) {
          _server!.clearDynamicHtmlContent();
        }
        await _server!.stop();
        FormGearLogger.sdk('FormGear server stopped - Assignment completed');
      }
    }
  }

  /// Creates debug-only WebView for testing bridge functionality
  /// **DEBUG/TESTING ONLY** - Not for production use
  /// Use openFormWithAssignment for production forms
  @Deprecated('Only for testing - use openFormWithAssignment for production')
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
      jsHandlers: [
        ...HandlerFactory.createRequiredHandlers(
          currentFormConfig: _currentFormConfig,
          config: _config,
          getCurrentAssignment: () => _currentAssignment,
          formDataListener: _listenerRegistry.formDataListener,
        ),
        ...customHandlers,
      ],
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

      // Process the HTML through vendor asset injection
      return _engineService.assetLoader.injectVendorAssets(htmlContent);
    } on Exception catch (e) {
      FormGearLogger.sdkError('Failed to load debug bridge test HTML: $e');
      return null;
    }
  }

  /// Determines the FormEngineType based on template ID
  FormEngineType _determineEngineTypeFromTemplate(String templateId) =>
      _engineService.determineEngineTypeFromTemplate(templateId);

  /// Starts server if needed based on global configuration
  Future<void> _startServerIfNeeded() async {
    final shouldStartServer = _globalConfig?.autoStartServer ?? true;

    if (shouldStartServer && _server?.isRunning != true) {
      await _startServer();
    }
  }

  /// Creates WebView with assignment-specific handlers
  FormGearWebView _createWebViewWithAssignment(AssignmentContext assignment) {
    return WebViewBuilder.createWebViewWithAssignment(
      assignment: assignment,
      preparedEngine: _currentPreparedEngine!,
      currentEngineType: _currentEngineType,
      currentFormConfig: _currentFormConfig,
      config: _config,
      getCurrentAssignment: () => _currentAssignment,
      formDataListener: _listenerRegistry.formDataListener,
    );
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

  /// Checks if form engine is downloaded locally
  ///
  /// Returns true if engine directory exists with version.json file
  Future<bool> isFormEngineDownloaded(String engineId) async {
    if (!_isInitialized) {
      throw Exception('FormGear SDK not initialized. Call initialize() first.');
    }

    final useCase = getIt<IsFormEngineDownloadedUseCase>();
    return useCase(engineId);
  }

  /// Gets the current configuration
  FormGearConfig? get config => _config;

  /// Checks if the SDK is initialized
  bool get isInitialized => _isInitialized;
}
