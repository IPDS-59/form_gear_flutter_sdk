import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:flutter/services.dart';
import 'package:form_gear_engine_sdk/src/core/base/result.dart';
import 'package:form_gear_engine_sdk/src/core/config/form_gear_api_config.dart';
import 'package:form_gear_engine_sdk/src/core/constants/directory_constants.dart';
import 'package:form_gear_engine_sdk/src/data/repositories/download_repository_impl.dart';
import 'package:form_gear_engine_sdk/src/domain/usecases/download_template_usecase.dart';
import 'package:form_gear_engine_sdk/src/domain/usecases/extract_template_usecase.dart';
import 'package:form_gear_engine_sdk/src/domain/usecases/get_local_template_version_usecase.dart';
import 'package:form_gear_engine_sdk/src/domain/usecases/save_template_version_usecase.dart';
import 'package:form_gear_engine_sdk/src/models/bps_user.dart';
import 'package:form_gear_engine_sdk/src/models/download_progress_callback.dart';
import 'package:form_gear_engine_sdk/src/models/template_download_result.dart';
import 'package:form_gear_engine_sdk/src/utils/form_gear_logger.dart';
import 'package:injectable/injectable.dart';

/// Template download manager following clean architecture principles
/// Acts as a service that orchestrates download, extraction, and version
/// management
@LazySingleton()
class TemplateDownloadManager {
  const TemplateDownloadManager(
    this._downloadTemplateUseCase,
    this._extractTemplateUseCase,
    this._saveTemplateVersionUseCase,
    this._getLocalTemplateVersionUseCase,
  );

  /// Use case dependencies - injected via constructor
  final DownloadTemplateUseCase _downloadTemplateUseCase;
  final ExtractTemplateUseCase _extractTemplateUseCase;
  final SaveTemplateVersionUseCase _saveTemplateVersionUseCase;
  final GetLocalTemplateVersionUseCase _getLocalTemplateVersionUseCase;

  /// Configure remote download settings with API configuration
  void configureRemoteDownload({
    FormGearApiConfig? apiConfig,
    String? authToken,
    BpsUser? user,
    Map<String, String>? customHeaders,
    int maxRetries = 3,
    Duration? downloadTimeout,
  }) {
    // Delegate configuration to download repository
    DownloadRepositoryImpl.configure(
      apiConfig: apiConfig,
      authToken: authToken,
      user: user,
      customHeaders: customHeaders,
    );

    FormGearLogger.sdk(
      'Template remote download configured with API config: '
      'templateZipEndpoint=${apiConfig?.templateZipEndpoint}, '
      'hasToken=${authToken != null}, user=${user?.username}',
    );
  }

  /// Downloads a template from remote URL or local assets
  /// Following clean architecture: orchestrates use cases
  Future<TemplateDownloadResult> downloadTemplate(
    String templateId, {
    String? downloadUrl,
    String? templateVersion,
    String? validationVersion,
    DownloadProgressCallback? onProgress,
  }) async {
    try {
      FormGearLogger.sdk('Starting template download for: $templateId');

      // Check if remote download is configured and URL is provided
      if (downloadUrl != null) {
        return await _downloadTemplateFromRemote(
          templateId,
          downloadUrl,
          templateVersion: templateVersion,
          validationVersion: validationVersion,
          onProgress: onProgress,
        );
      }

      // Fallback to asset-based download
      return await _downloadTemplateFromAssets(templateId);
    } on Exception catch (e) {
      FormGearLogger.sdkError('Template download failed: $e');
      return TemplateDownloadResult.failure(error: e.toString());
    }
  }

  /// Downloads and extracts template from remote URL
  /// Combines download, extraction, and version saving in a single flow
  Future<TemplateDownloadResult> _downloadTemplateFromRemote(
    String templateId,
    String downloadUrl, {
    String? templateVersion,
    String? validationVersion,
    DownloadProgressCallback? onProgress,
  }) async {
    try {
      FormGearLogger.sdk('Downloading template from remote: $downloadUrl');

      // Download template ZIP
      final downloadResult = await _downloadTemplateUseCase(
        DownloadTemplateParams(
          templateId: templateId,
          downloadUrl: downloadUrl,
          templateVersion: templateVersion,
          validationVersion: validationVersion,
          onProgress: onProgress,
        ),
      );

      final downloadData = switch (downloadResult) {
        Success(:final data) when data.success => data,
        Success(:final data) => throw Exception(
          data.error ?? 'Download failed',
        ),
        Failure(:final error) => throw Exception(error.toString()),
      };

      final zipFilePath = downloadData.localPath;
      if (zipFilePath == null) {
        throw Exception('No download file path returned');
      }

      // Extract ZIP file
      final extractResult = await _extractTemplateUseCase(
        ExtractTemplateParams(
          templateId: templateId,
          zipFilePath: zipFilePath,
        ),
      );

      if (extractResult case Failure(:final error)) {
        throw Exception('Extraction failed: $error');
      }

      // Save version information if provided (non-critical operation)
      if (templateVersion != null) {
        final saveResult = await _saveTemplateVersionUseCase(
          SaveTemplateVersionParams(
            templateId: templateId,
            version: templateVersion,
          ),
        );

        if (saveResult case Failure(:final error)) {
          FormGearLogger.sdkError('Failed to save version: $error');
        } else {
          FormGearLogger.sdk(
            'Saved version $templateVersion for template $templateId',
          );
        }
      }

      // Get template directory path
      final templateDir = await DirectoryConstants.getTemplateDirectory(
        templateId,
      );

      FormGearLogger.sdk(
        'Template $templateId downloaded and extracted successfully',
      );

      return TemplateDownloadResult.success(
        localPath: templateDir.path,
        version: templateVersion,
      );
    } on Exception catch (e) {
      FormGearLogger.sdkError('Remote download error: $e');
      return TemplateDownloadResult.failure(error: e.toString());
    }
  }

  /// Downloads template from local assets (fallback)
  /// This is the legacy approach for backward compatibility
  Future<TemplateDownloadResult> _downloadTemplateFromAssets(
    String templateId,
  ) async {
    try {
      FormGearLogger.sdk('Downloading template from assets: $templateId');

      // Use FASIH-compatible directory structure
      final templateDir = await DirectoryConstants.getTemplateDirectory(
        templateId,
      );

      if (!templateDir.existsSync()) {
        templateDir.createSync(recursive: true);
      }

      // Try to copy FASIH-style template files from assets
      final assetPaths = [
        'assets/Template/$templateId/${templateId}_template.json',
        'assets/Template/$templateId/${templateId}_validation.json',
        'assets/Template/$templateId/$templateId.json',
        'assets/Template/$templateId/version.json',
      ];

      var filesDownloaded = 0;
      String? version;

      for (final assetPath in assetPaths) {
        try {
          final content = await rootBundle.loadString(assetPath);
          final fileName = assetPath.split('/').last;
          final localFile = File('${templateDir.path}/$fileName');
          localFile.writeAsStringSync(content);

          // Try to extract version from template metadata
          if (fileName.endsWith('_template.json') ||
              fileName == 'version.json') {
            version ??= _extractVersionFromJson(content);
          }

          filesDownloaded++;
          FormGearLogger.sdk(
            'Downloaded template file: $fileName for template $templateId',
          );
        } on Exception catch (e) {
          FormGearLogger.sdkError('Failed to download $assetPath: $e');
          // Continue with other files
        }
      }

      if (filesDownloaded == 0) {
        FormGearLogger.sdkError(
          'No template files found in assets for $templateId',
        );
        return const TemplateDownloadResult.failure(
          error: 'No template files found in assets',
        );
      }

      FormGearLogger.sdk(
        'Template $templateId downloaded from assets successfully '
        '($filesDownloaded files)',
      );

      return TemplateDownloadResult.success(
        localPath: templateDir.path,
        version: version,
      );
    } on Exception catch (e) {
      FormGearLogger.sdkError('Asset download error: $e');
      return TemplateDownloadResult.failure(error: e.toString());
    }
  }

  /// Gets the local version of a template
  Future<String?> getLocalTemplateVersion(String templateId) async {
    try {
      final result = await _getLocalTemplateVersionUseCase(templateId);
      return switch (result) {
        Success(:final data) => data,
        Failure(:final error) => () {
          FormGearLogger.sdkError(
            'Failed to get template version: $error',
          );
          return null;
        }(),
      };
    } on Exception catch (e) {
      FormGearLogger.sdkError('Error getting template version: $e');
      return null;
    }
  }

  /// Checks if template is downloaded locally
  Future<bool> isTemplateDownloaded(String templateId) async {
    try {
      return await _hasTemplateFiles(templateId);
    } on Exception catch (e) {
      FormGearLogger.sdkError('Error checking template download status: $e');
      return false;
    }
  }

  /// Gets list of downloaded templates
  Future<List<String>> getDownloadedTemplates() async {
    try {
      final bpsDir = await DirectoryConstants.getBpsDirectory();
      final templatesDir = Directory(
        '${bpsDir.path}/${DirectoryConstants.templatesDirectory}',
      );

      if (!templatesDir.existsSync()) {
        return [];
      }

      final templateDirs = await templatesDir
          .list(followLinks: false)
          .where((entity) => entity is Directory)
          .cast<Directory>()
          .toList();

      final templateIds = <String>[];
      for (final dir in templateDirs) {
        final templateId = dir.path.split('/').last;

        // Verify template has required files
        final hasTemplateFiles = await _hasTemplateFiles(templateId);
        if (hasTemplateFiles) {
          templateIds.add(templateId);
        }
      }

      return templateIds;
    } on Exception catch (e) {
      FormGearLogger.sdkError('Error getting downloaded templates: $e');
      return [];
    }
  }

  /// Loads template data from local storage
  Future<Map<String, dynamic>?> loadLocalTemplate(String templateId) async {
    try {
      final templateDir = await DirectoryConstants.getTemplateDirectory(
        templateId,
      );
      final templateFile = File(
        '${templateDir.path}/${templateId}_template.json',
      );

      if (templateFile.existsSync()) {
        final content = templateFile.readAsStringSync();
        return jsonDecode(content) as Map<String, dynamic>;
      }
      return null;
    } on Exception catch (e) {
      FormGearLogger.sdkError('Failed to load local template $templateId: $e');
      return null;
    }
  }

  /// Loads validation data from local storage
  Future<Map<String, dynamic>?> loadLocalValidation(String templateId) async {
    try {
      final templateDir = await DirectoryConstants.getTemplateDirectory(
        templateId,
      );
      final validationFile = File(
        '${templateDir.path}/${templateId}_validation.json',
      );

      if (validationFile.existsSync()) {
        final content = validationFile.readAsStringSync();
        return jsonDecode(content) as Map<String, dynamic>;
      }
      return null;
    } on Exception catch (e) {
      FormGearLogger.sdkError(
        'Failed to load local validation $templateId: $e',
      );
      return null;
    }
  }

  /// Deletes a template from local storage
  Future<bool> deleteTemplate(String templateId) async {
    try {
      final templateDir = await DirectoryConstants.getTemplateDirectory(
        templateId,
      );

      if (templateDir.existsSync()) {
        templateDir.deleteSync(recursive: true);
        FormGearLogger.sdk('Deleted template: $templateId');
        return true;
      }

      return false;
    } on Exception catch (e) {
      FormGearLogger.sdkError('Error deleting template $templateId: $e');
      return false;
    }
  }

  /// Clears all downloaded templates
  Future<void> clearAllTemplates() async {
    try {
      final bpsDir = await DirectoryConstants.getBpsDirectory();
      final templatesDir = Directory(
        '${bpsDir.path}/${DirectoryConstants.templatesDirectory}',
      );

      if (templatesDir.existsSync()) {
        templatesDir.deleteSync(recursive: true);
        FormGearLogger.sdk('Cleared all templates');
      }
    } on Exception catch (e) {
      FormGearLogger.sdkError('Error clearing all templates: $e');
    }
  }

  /// Helper methods

  /// Checks if template directory has required FASIH files
  Future<bool> _hasTemplateFiles(String templateId) async {
    try {
      final templateDir = await DirectoryConstants.getTemplateDirectory(
        templateId,
      );

      // Check for FASIH-style files
      final templateMetadataFile = File(
        '${templateDir.path}/${templateId}_template.json',
      );
      final validationFile = File(
        '${templateDir.path}/${templateId}_validation.json',
      );
      final formDefinitionFile = File('${templateDir.path}/$templateId.json');
      final versionFile = File('${templateDir.path}/version.json');

      return templateMetadataFile.existsSync() ||
          validationFile.existsSync() ||
          formDefinitionFile.existsSync() ||
          versionFile.existsSync();
    } on Exception {
      return false;
    }
  }

  /// Extracts version from JSON content using regex
  String? _extractVersionFromJson(String jsonContent) {
    try {
      final versionMatch = RegExp(
        r'"version"\s*:\s*"([^"]+)"',
      ).firstMatch(jsonContent);
      return versionMatch?.group(1);
    } on Exception catch (e) {
      FormGearLogger.sdkError('Error extracting version from JSON: $e');
      return null;
    }
  }
}
