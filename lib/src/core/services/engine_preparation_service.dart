import 'package:form_gear_engine_sdk/src/core/engine/engine_asset_loader.dart';
import 'package:form_gear_engine_sdk/src/models/models.dart';
import 'package:form_gear_engine_sdk/src/utils/utils.dart';

/// Service responsible for preparing form engines
///
/// Handles loading HTML, JS, and CSS assets and preparing them for WebView
class EnginePreparationService {
  EnginePreparationService({EngineAssetLoader? assetLoader})
    : _assetLoader = assetLoader ?? EngineAssetLoader();

  final EngineAssetLoader _assetLoader;

  /// Prepares the form engine by loading and processing assets
  Future<PreparedEngine> prepareEngine({
    required FormEngineType engineType,
    String? baseUrl,
    String? historyUrl,
    void Function(int received, int total)? onProgress,
  }) async {
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

      // Replace JS placeholder (Don't wrap in IIFE as it's an ES module)
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

  /// Determines the FormEngineType based on template ID
  FormEngineType determineEngineTypeFromTemplate(String templateId) {
    // Check if template ID indicates FasihForm usage
    if (templateId.startsWith('fasih') ||
        templateId.contains('fasih') ||
        templateId.startsWith('survey')) {
      return FormEngineType.fasihForm;
    }

    // Default to FormGear for other templates
    return FormEngineType.formGear;
  }

  /// Gets the asset loader for vendor asset injection
  EngineAssetLoader get assetLoader => _assetLoader;
}
