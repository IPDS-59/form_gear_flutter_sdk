import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:form_gear_engine_sdk/form_gear_engine_sdk.dart';
import 'package:form_gear_engine_sdk/src/core/config/form_config.dart';
import 'package:form_gear_engine_sdk/src/core/di/injection.dart';
import 'package:form_gear_engine_sdk/src/core/engine/engine_asset_loader.dart';
import 'package:form_gear_engine_sdk/src/core/engine/handler_factory.dart';
import 'package:form_gear_engine_sdk/src/core/engine/webview_builder.dart';
import 'package:form_gear_engine_sdk/src/core/server/form_gear_server.dart';
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
  PreparedEngine? _currentPreparedEngine;
  FormEngineType? _currentEngineType;

  // Current assignment context (new assignment-based system)
  AssignmentContext? _currentAssignment;

  /// Gets the current assignment context
  AssignmentContext? get currentAssignment => _currentAssignment;

  // FormDataListener for save/submit operations
  FormDataListener? _formDataListener;

  // FileUploadListener for file upload operations
  FileUploadListener? _fileUploadListener;

  // Version manager
  late FormGearVersionManager _versionManager;

  // Engine asset loader
  final EngineAssetLoader _assetLoader = EngineAssetLoader();

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
  /// Now accepts only FormEngineType enum for cleaner API
  /// Internal method - use openFormWithAssignment instead
  Future<PreparedEngine> _prepareEngine({
    required FormEngineType engineType,
    String? baseUrl,
    String? historyUrl,
    void Function(int received, int total)? onProgress,
  }) async {
    if (!_isInitialized) {
      throw Exception('FormGear SDK not initialized. Call initialize() first.');
    }

    FormGearLogger.sdk(
      'Preparing engine: ${engineType.displayName} (ID: ${engineType.id})',
    );

    try {
      // Load engine assets using the asset loader
      final engineAssets = await _assetLoader.loadEngineAssets(
        engineType,
        onProgress: onProgress,
      );

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
      processedHtml = _assetLoader.fixAssetPaths(processedHtml);

      // Inject actual vendor asset content into placeholders
      processedHtml = await _assetLoader.injectVendorAssets(processedHtml);

      final preparedEngine = PreparedEngine(
        html: processedHtml,
        baseUrl: baseUrl ?? 'about:blank',
        historyUrl: historyUrl,
      );

      _currentPreparedEngine = preparedEngine;
      _currentEngineType = engineType;
      FormGearLogger.sdk(
        'Engine ${engineType.displayName} prepared successfully with '
        '${processedHtml.length} chars HTML',
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

  /// Sets the FormDataListener for handling save/submit operations
  ///
  /// The FormDataListener provides a comprehensive interface for handling
  /// save and submit operations from both FormGear (engine ID: 1) and
  /// FasihForm (engine ID: 2) engines.
  ///
  /// Usage:
  /// ```dart
  /// class MyFormDataListener extends BaseFormDataListener {
  ///   @override
  ///   Future<SaveSubmitResult> onSaveOrSubmit(SaveSubmitData data) async {
  ///     // Handle FormGear (engine ID: 1) save/submit
  ///     await myDatabase.saveFormData(data);
  ///     return SaveSubmitResult.success(
  ///       submissionId: 'form_${data.assignmentId}',
  ///     );
  ///   }
  ///
  ///   @override
  ///   Future<SaveSubmitResult> onSaveOrSubmitFasihForm(
  ///     SaveSubmitData data,
  ///   ) async {
  ///     // Handle FasihForm (engine ID: 2) save/submit
  ///     await myDatabase.saveFasihFormData(data);
  ///     return SaveSubmitResult.success(
  ///       submissionId: 'fasih_${data.assignmentId}',
  ///     );
  ///   }
  /// }
  ///
  /// FormGearSDK.instance.setFormDataListener(MyFormDataListener());
  /// ```
  void setFormDataListener(FormDataListener? listener) {
    _formDataListener = listener;

    if (listener != null) {
      FormGearLogger.sdk(
        'FormDataListener registered: ${listener.runtimeType}',
      );
    } else {
      FormGearLogger.sdk('FormDataListener removed');
    }
  }

  /// Gets the currently registered FormDataListener
  ///
  /// Returns null if no listener is registered.
  FormDataListener? get formDataListener => _formDataListener;

  /// Checks if a FormDataListener is currently registered
  bool get hasFormDataListener => _formDataListener != null;

  /// Removes the currently registered FormDataListener
  ///
  /// After calling this method, save/submit operations will fall back
  /// to legacy callback behavior or default implementations.
  void removeFormDataListener() {
    setFormDataListener(null);
  }

  /// Sets the FileUploadListener for handling file upload operations
  ///
  /// Register a custom listener to handle file uploads to your backend.
  /// The listener will be called when files need to be uploaded from
  /// FormGear/FasihForm.
  ///
  /// Example:
  /// ```dart
  /// class MyFileUploadListener implements FileUploadListener {
  ///   @override
  ///   Future<FileUploadResult> onFileUpload(FileUploadData data) async {
  ///     // Upload to S3, server, etc.
  ///     final url = await uploadToBackend(data.file);
  ///     return FileUploadResult.success(uploadedUrl: url);
  ///   }
  /// }
  ///
  /// FormGearSDK.instance.setFileUploadListener(MyFileUploadListener());
  /// ```
  void setFileUploadListener(FileUploadListener? listener) {
    _fileUploadListener = listener;

    if (listener != null) {
      FormGearLogger.sdk(
        'FileUploadListener registered: ${listener.runtimeType}',
      );
    } else {
      FormGearLogger.sdk('FileUploadListener removed');
    }
  }

  /// Gets the currently registered FileUploadListener
  ///
  /// Returns null if no listener is registered.
  FileUploadListener? get fileUploadListener => _fileUploadListener;

  /// Checks if a FileUploadListener is currently registered
  bool get hasFileUploadListener => _fileUploadListener != null;

  /// Removes the currently registered FileUploadListener
  ///
  /// After calling this method, file upload operations will fall back
  /// to default behavior (local file verification only).
  void removeFileUploadListener() {
    setFileUploadListener(null);
  }

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
          formDataListener: _formDataListener,
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

      // Process the HTML through vendor asset injection to replace jQuery
      // placeholder
      final processedHtml = await _assetLoader.injectVendorAssets(htmlContent);
      return processedHtml;
    } on Exception catch (e) {
      FormGearLogger.sdkError('Failed to load debug bridge test HTML: $e');
      return null;
    }
  }

  /// Determines the FormEngineType based on template ID
  FormEngineType _determineEngineTypeFromTemplate(String templateId) {
    // Check if template ID indicates FasihForm usage
    if (templateId.startsWith('fasih') ||
        templateId.contains('fasih') ||
        templateId.startsWith('survey')) {
      return FormEngineType.fasihForm;
    }

    // Default to FormGear for other templates
    return FormEngineType.formGear;
  }

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
      formDataListener: _formDataListener,
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
