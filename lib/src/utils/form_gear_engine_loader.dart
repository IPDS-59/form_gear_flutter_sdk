import 'dart:convert';

import 'package:flutter/services.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';

/// Utility class to load FormGear engine with proper setup
///
/// This handles loading the actual FormGear JavaScript engine
/// with all necessary dependencies and bridge setup.
class FormGearEngineLoader {
  /// Load FormGear engine HTML with injected dependencies
  static Future<InAppWebViewInitialData> loadEngine({
    required String enginePath,
    bool injectJQuery = true,
  }) async {
    // Load the engine HTML
    final htmlContent = await rootBundle.loadString(
      '$enginePath/index.html',
    );

    // Load CSS
    final cssContent = await rootBundle.loadString(
      '$enginePath/style.css',
    );

    // Load JS
    final jsContent = await rootBundle.loadString(
      '$enginePath/form-gear.es.js',
    );

    // Build complete HTML with injected dependencies
    final html = _buildEngineHtml(
      originalHtml: htmlContent,
      css: cssContent,
      js: jsContent,
      injectJQuery: injectJQuery,
    );

    return InAppWebViewInitialData(data: html);
  }

  /// Setup Android bridge handlers for FormGear engine
  static void setupAndroidBridge(
    InAppWebViewController controller, {
    required Future<String> Function() getTemplate,
    required Future<String> Function() getResponse,
    required Future<String> Function() getMedia,
    required Future<String> Function() getReference,
    required Future<String> Function() getValidation,
    required Future<String> Function() getRemark,
    required Future<String> Function() getPreset,
    String userName = 'demo_user',
    int formMode = 1,
    bool isNew = true,
    String rolePetugas = 'surveyor',
  }) {
    // Data getters
    controller.addJavaScriptHandler(
      handlerName: 'getTemplate',
      callback: (args) => getTemplate(),
    );

    controller.addJavaScriptHandler(
      handlerName: 'getResponse',
      callback: (args) => getResponse(),
    );

    controller.addJavaScriptHandler(
      handlerName: 'getMedia',
      callback: (args) => getMedia(),
    );

    controller.addJavaScriptHandler(
      handlerName: 'getReference',
      callback: (args) => getReference(),
    );

    controller.addJavaScriptHandler(
      handlerName: 'getValidation',
      callback: (args) => getValidation(),
    );

    controller.addJavaScriptHandler(
      handlerName: 'getRemark',
      callback: (args) => getRemark(),
    );

    controller.addJavaScriptHandler(
      handlerName: 'getPreset',
      callback: (args) => getPreset(),
    );

    // Configuration getters
    controller.addJavaScriptHandler(
      handlerName: 'getUserName',
      callback: (args) => userName,
    );

    controller.addJavaScriptHandler(
      handlerName: 'getFormMode',
      callback: (args) => formMode,
    );

    controller.addJavaScriptHandler(
      handlerName: 'getIsNew',
      callback: (args) => isNew,
    );

    controller.addJavaScriptHandler(
      handlerName: 'getPrincipalCollection',
      callback: (args) => '{}',
    );

    controller.addJavaScriptHandler(
      handlerName: 'getRolePetugas',
      callback: (args) => rolePetugas,
    );
  }

  /// Inject Android bridge mock into WebView
  static Future<void> injectAndroidBridge(
    InAppWebViewController controller,
  ) async {
    await controller.evaluateJavascript(
      source: '''
      window.Android = {
        getUserName: function() {
          return window.flutter_inappwebview.callHandler('getUserName');
        },
        getFormMode: function() {
          return window.flutter_inappwebview.callHandler('getFormMode');
        },
        getIsNew: function() {
          return window.flutter_inappwebview.callHandler('getIsNew');
        },
        getPrincipalCollection: function() {
          return window.flutter_inappwebview.callHandler('getPrincipalCollection');
        },
        getRolePetugas: function() {
          return window.flutter_inappwebview.callHandler('getRolePetugas');
        },
        action: function(type, param1, param2, param3) {
          console.log('Android.action called:', type, param1, param2, param3);
        },
        saveOrSubmit: function(response, remark, principal, reference, media, type) {
          console.log('Android.saveOrSubmit called:', type);
        }
      };

      // Override the data loading functions
      const callAndroidFunction = async (name) => {
        try {
          const result = await window.flutter_inappwebview.callHandler(name);
          if (!result) return {};
          return typeof result === 'string' ? JSON.parse(result) : result;
        } catch (e) {
          console.log(name + ' error:', e);
          return {};
        }
      };
    ''',
    );
  }

  static String _buildEngineHtml({
    required String originalHtml,
    required String css,
    required String js,
    bool injectJQuery = true,
  }) {
    // Replace style placeholder
    String html = originalHtml.replaceFirst(
      '/*style*/',
      css,
    );

    // Replace JS placeholder
    html = html.replaceFirst(
      '//formgear_js',
      js,
    );

    // Inject jQuery if needed
    if (injectJQuery) {
      // Use CDN jQuery instead of file
      html = html.replaceFirst(
        '<script src="file:///android_asset/asset/jquery-3.5.1.js"></script>',
        '<script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>',
      );
    }

    return html;
  }
}

/// Configuration for FormGear engine loader
class FormGearEngineConfig {
  final String Function() getTemplate;
  final String Function() getResponse;
  final String Function() getMedia;
  final String Function() getReference;
  final String Function() getValidation;
  final String Function() getRemark;
  final String Function() getPreset;
  final String userName;
  final int formMode;
  final bool isNew;
  final String rolePetugas;

  const FormGearEngineConfig({
    required this.getTemplate,
    required this.getResponse,
    required this.getMedia,
    required this.getReference,
    required this.getValidation,
    required this.getRemark,
    required this.getPreset,
    this.userName = 'demo_user',
    this.formMode = 1,
    this.isNew = true,
    this.rolePetugas = 'surveyor',
  });
}
