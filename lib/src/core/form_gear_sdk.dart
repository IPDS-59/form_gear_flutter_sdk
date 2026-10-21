import 'dart:io';

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:form_gear_engine_sdk/form_gear_engine_sdk.dart';
import 'package:form_gear_engine_sdk/src/core/config/form_config.dart';
import 'package:form_gear_engine_sdk/src/core/di/injection.dart';
import 'package:form_gear_engine_sdk/src/core/engine/handler_factory.dart';
import 'package:form_gear_engine_sdk/src/core/engine/page_prelude.dart';
import 'package:form_gear_engine_sdk/src/core/engine/webview_builder.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/js_executor_service.dart';
import 'package:form_gear_engine_sdk/src/core/server/form_gear_server.dart';
import 'package:form_gear_engine_sdk/src/core/services/services.dart';
import 'package:form_gear_engine_sdk/src/core/version/form_gear_version_manager.dart';
import 'package:form_gear_engine_sdk/src/domain/usecases/is_form_engine_downloaded_usecase.dart';
import 'package:form_gear_engine_sdk/src/models/models.dart';
import 'package:form_gear_engine_sdk/src/utils/fasih_form_notifier.dart';
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

    return await _engineService.prepareEngine(
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

  /// Listener for `dispatchFinalResult`, `connectorApi` and `sendEvent`
  /// (set `null` to remove it).
  FormEngineEventListener? get formEngineEventListener =>
      _listenerRegistry.formEngineEventListener;
  set formEngineEventListener(FormEngineEventListener? listener) =>
      _listenerRegistry.formEngineEventListener = listener;

  /// Host UI for engine downloads and updates. When set,
  /// [checkFormEngineVersion] calls it instead of showing the built-in update
  /// screen, including for forced updates. `null` keeps the built-in screen.
  FormEngineUpdateHandler? get formEngineUpdateHandler =>
      _listenerRegistry.formEngineUpdateHandler;
  set formEngineUpdateHandler(FormEngineUpdateHandler? handler) =>
      _listenerRegistry.formEngineUpdateHandler = handler;

  /// Every JS bridge event of the open form (calls from the page, JavaScript
  /// run by the host, console, lifecycle). Broadcast; costs nothing while
  /// nobody listens. For debuggers.
  Stream<FormGearBridgeEvent> get bridgeEvents =>
      FormGearBridgeObserver.instance.events;

  /// Masks payloads before they are published (see
  /// [FormGearBridgeObserver.redactSecrets]). Null publishes raw payloads.
  FormGearBridgeRedactor? get bridgeRedactor =>
      FormGearBridgeObserver.instance.redactor;
  set bridgeRedactor(FormGearBridgeRedactor? redactor) =>
      FormGearBridgeObserver.instance.redactor = redactor;

  /// Runs [source] in the open form's WebView and returns the result as
  /// text, or null when no form is open. For debuggers only.
  Future<String?> evaluateJavascript(String source) =>
      JSExecutorService().evaluate(source);

  /// Host UI for the loader, exit dialog and errors around a form, and the
  /// edge-to-edge setting. Null keeps the built-in UI.
  FormGearUiHandler? get uiHandler => _listenerRegistry.uiHandler;
  set uiHandler(FormGearUiHandler? handler) =>
      _listenerRegistry.uiHandler = handler;

  /// The host's device capabilities (photo, file pick, scan). Null keeps the
  /// built-in camera and file picker while they exist.
  FormGearCapabilities? get capabilities => _listenerRegistry.capabilities;
  set capabilities(FormGearCapabilities? value) =>
      _listenerRegistry.capabilities = value;

  /// Opens form with assignment context (new assignment-based method)
  /// This method uses dynamic configuration based on assignment context
  ///
  /// Throws [DataFailure] (code `invalid_template`) when the template has no
  /// renderable components.
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

    // Refuse data the engine cannot start with, instead of a blank WebView.
    if (!assignment.data.hasRenderableTemplate) {
      throw DataFailure(
        'Template ${assignment.templateId} for assignment '
            '${assignment.assignmentId} is missing or has no components; '
            'it may be corrupt or not fully downloaded.',
        'invalid_template',
      );
    }
    final current = assignment.copyWith(
      data: assignment.data.normalizedForEngine(),
    );

    // Store current assignment context
    _currentAssignment = current;

    // Update legacy config with assignment-specific settings for compatibility
    if (_globalConfig != null) {
      _config = _globalConfig!.toLegacyConfig(assignmentConfig: current.config);
    }

    // Prepare engine based on explicit engine ID or determine from template
    final engineType = current.formEngineId != null
        ? FormEngineType.fromId(int.tryParse(current.formEngineId!))
        : _determineEngineTypeFromTemplate(current.templateId);

    if (engineType == null) {
      throw Exception(
        'Invalid form engine ID: ${current.formEngineId}. '
        'Valid IDs are: 1 (FormGear), 2 (FasihForm)',
      );
    }

    final preparedEngine = await _prepareEngine(
      engineType: engineType,
      onProgress: onProgress,
    );

    // Load form configuration from assignment data
    loadFormConfig(
      FormConfig(
        formId: current.assignmentId,
        template: current.data.template,
        validation: current.data.validation,
        response: current.data.response,
        media: current.data.media,
        reference: current.data.reference,
        remark: current.data.remark,
        preset: current.data.preset,
        principals: current.data.principals,
      ),
    );

    // Start server if configured to auto-start
    await _startServerIfNeeded();

    // One handler set serves both the sync window.Android shim and the
    // async callHandler bridge, so the two can never disagree.
    final jsHandlers = HandlerFactory.createAssignmentAwareHandlers(
      assignment: current,
      currentFormConfig: _currentFormConfig,
      config: _config,
      formDataListener: _listenerRegistry.formDataListener,
      getCurrentAssignment: () => _currentAssignment,
    );
    // The stock pages hardcode the lookup server at :3310; point them at the
    // port actually bound (it moves when 3310 is taken, e.g. by native FASIH).
    final serverBase = _server?.baseUrl;
    if (serverBase == null) {
      FormGearLogger.sdkError('Lookup server not running; lookups will fail');
    }
    final pageHtml = serverBase == null
        ? preparedEngine.html
        : preparedEngine.html.replaceAll(
            RegExp(r'http://(localhost|127\.0\.0\.1):3310\b'),
            serverBase,
          );
    final html = PagePrelude.inject(pageHtml, [
      PagePrelude.bridgePolyfill,
      PagePrelude.errorForwarder,
      if (engineType == FormEngineType.fasihForm)
        await PagePrelude.fasihAndroidShim(jsHandlers),
    ]);

    // iOS: Set dynamic HTML on server and get URL for loading
    // iOS WKWebView has issues with loadData() for large HTML content
    var engineToUse = PreparedEngine(
      html: html,
      baseUrl: preparedEngine.baseUrl,
      historyUrl: preparedEngine.historyUrl,
    );
    if (Platform.isIOS && _server != null && _server!.isRunning) {
      _server!.setDynamicHtmlContent(html);
      final serverUrl = _server!.dynamicHtmlUrl;
      if (serverUrl != null) {
        // Unique per open so WKWebView never reuses an older form's page.
        engineToUse = engineToUse.withServerUrl(serverUrl);
        FormGearLogger.sdk(
          'iOS: Using server URL for HTML loading: $serverUrl',
        );
      }
    }

    final webView = WebViewBuilder.createWebViewWithAssignment(
      assignment: current,
      preparedEngine: engineToUse,
      currentEngineType: engineType,
      jsHandlers: jsHandlers,
      uiHandler: _listenerRegistry.uiHandler,
    );

    try {
      // Check if context is still mounted before navigation
      if (!context.mounted) return;

      final observer = FormGearBridgeObserver.instance
        ..assignmentId = current.assignmentId
        ..sessionId = DateTime.now().microsecondsSinceEpoch.toRadixString(36);
      observer.emit(
        direction: FormGearBridgeDirection.local,
        kind: FormGearBridgeKind.lifecycle,
        channel: 'lifecycle',
        method: 'formOpened',
        args: {'templateId': current.templateId, 'engineType': engineType.id},
      );

      // Navigate to a full-screen page with the WebView
      await Navigator.of(context).push<void>(
        MaterialPageRoute(
          builder: (context) => WebViewBuilder.createFormGearEnginePage(
            title: title ?? 'FormGear - ${current.templateId}',
            webView: webView,
            uiHandler: _listenerRegistry.uiHandler,
          ),
        ),
      );
    } finally {
      FormGearBridgeObserver.instance.emit(
        direction: FormGearBridgeDirection.local,
        kind: FormGearBridgeKind.lifecycle,
        channel: 'lifecycle',
        method: 'formClosed',
      );
      FormGearBridgeObserver.instance
        ..assignmentId = null
        ..sessionId = null;
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
    return await _versionManager.checkFormEngineVersion(
      engineId: engineId,
      showNotifications: showNotifications,
      context: context,
      updateHandler: _listenerRegistry.formEngineUpdateHandler,
      uiHandler: _listenerRegistry.uiHandler,
    );
  }

  /// Downloads and installs a form engine without any UI.
  ///
  /// Looks up the engine on the server, then downloads, extracts and
  /// verifies it. [onProgress] gets whole percents (0-100). Returns `Success`
  /// when the engine is installed, otherwise a `Failure` holding an
  /// `AppFailure`. Use it to build your own update screen.
  Future<Result<void>> downloadFormEngine(
    String engineId, {
    void Function(int progress)? onProgress,
  }) {
    if (!_isInitialized) {
      throw Exception('FormGear SDK not initialized. Call initialize() first.');
    }
    return _versionManager.downloadFormEngine(engineId, onProgress: onProgress);
  }

  /// Checks if form engine is downloaded locally
  ///
  /// Returns true if engine directory exists with version.json file
  Future<bool> isFormEngineDownloaded(String engineId) async {
    if (!_isInitialized) {
      throw Exception('FormGear SDK not initialized. Call initialize() first.');
    }

    final useCase = getIt<IsFormEngineDownloadedUseCase>();
    return await useCase(engineId);
  }

  /// Finalizes the open form, like native FASIH's approval button. FasihForm
  /// (engine 2) gets `trigger-finalize`; FormGear (engine 1) has no in-page
  /// finalize (native shows its own approval dialog), so returns false.
  /// The page answers via [FormEngineEventListener.onFinalResult].
  Future<bool> finalizeForm() async {
    final engineId = JSExecutorService().formEngineId;
    if (engineId != FormEngineType.fasihForm.id.toString()) {
      FormGearLogger.sdk('finalizeForm: no finalize for engine $engineId');
      return false;
    }
    await FasihFormNotifier.triggerFinalize();
    return true;
  }

  /// Gets the current configuration
  FormGearConfig? get config => _config;

  /// Checks if the SDK is initialized
  bool get isInitialized => _isInitialized;
}
