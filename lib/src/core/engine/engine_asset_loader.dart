import 'dart:io';

import 'package:flutter/services.dart';
import 'package:form_gear_engine_sdk/src/core/constants/directory_constants.dart';
import 'package:form_gear_engine_sdk/src/models/form_engine_type.dart';
import 'package:form_gear_engine_sdk/src/utils/form_gear_logger.dart';

/// Service for loading and processing FormGear engine assets
class EngineAssetLoader {
  /// Loads engine assets from local storage or falls back to bundle assets
  Future<EngineAssets> loadEngineAssets(
    FormEngineType engineType, {
    void Function(int received, int total)? onProgress,
  }) async {
    try {
      // Try to load from downloaded engine files first
      final engineAssets = await _loadEngineFromLocal(
        engineType,
        onProgress: onProgress,
      );
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
  Future<EngineAssets?> _loadEngineFromLocal(
    FormEngineType engineType, {
    void Function(int received, int total)? onProgress,
  }) async {
    try {
      final engineId = engineType.id.toString();
      final engineDir = await DirectoryConstants.getFormEngineDirectory(
        engineId,
      );

      // Check if engine files exist locally
      final htmlFile = File('${engineDir.path}/index.html');
      if (!htmlFile.existsSync()) {
        FormGearLogger.sdkError(
          'Engine files not found locally for engine ID: $engineId. '
          'Please ensure engine is downloaded before opening forms.',
        );
        return null;
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
        'Loaded local engine files: HTML(${htmlTemplate.length}), '
        'JS(${jsContent.length}), CSS(${cssContent.length})',
      );

      return EngineAssets(
        htmlTemplate: htmlTemplate,
        jsContent: jsContent,
        cssContent: cssContent,
      );
    } on Exception catch (e) {
      FormGearLogger.sdkError('Error loading engine from local: $e');
      return null;
    }
  }

  /// Loads engine assets from bundle assets (fallback)
  Future<EngineAssets> _loadEngineFromAssets(FormEngineType engineType) async {
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
      } on Exception {
        // Try alternative JS file names
        final alternativeJsFiles = _getAlternativeJSFileNames(engineType);
        for (final altJsFileName in alternativeJsFiles) {
          try {
            jsContent = await rootBundle.loadString(
              'assets/formengine/$engineId/$altJsFileName',
            );
            break;
          } on Exception {
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
      } on Exception {
        // CSS is optional, continue without it
        FormGearLogger.sdk('No CSS file found for ${engineType.displayName}');
      }

      FormGearLogger.sdk(
        'Loaded asset files: HTML(${htmlTemplate.length}), '
        'JS(${jsContent.length}), CSS(${cssContent.length})',
      );

      return EngineAssets(
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
  String fixAssetPaths(String htmlContent) {
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
  Future<String> injectVendorAssets(String htmlContent) async {
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
      } on Exception catch (e) {
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
}

/// Internal class to hold engine assets (HTML, JS, CSS)
class EngineAssets {
  const EngineAssets({
    required this.htmlTemplate,
    required this.jsContent,
    required this.cssContent,
  });

  final String htmlTemplate;
  final String jsContent;
  final String cssContent;
}
