import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:archive/archive.dart';
import 'package:dio/dio.dart';
import 'package:flutter/services.dart';
import 'package:form_gear_engine_sdk/src/core/config/config.dart';
import 'package:form_gear_engine_sdk/src/core/constants/directory_constants.dart';
import 'package:form_gear_engine_sdk/src/models/models.dart';
import 'package:form_gear_engine_sdk/src/utils/form_gear_logger.dart';
import 'package:injectable/injectable.dart';
import 'package:path/path.dart' as path;
import 'package:path_provider/path_provider.dart';

/// Manages downloading and local storage of FormGear templates and lookup data
/// Supports both local asset copying and remote download with authentication
@LazySingleton()
class FormGearDownloadManager {
  FormGearDownloadManager(this._dio);
  final Dio _dio;

  /// Remote server configuration
  FormGearApiConfig? _apiConfig;
  String? _authToken;
  bool _useRemoteDownload = false;
  int _maxRetries = 3;
  Duration _downloadTimeout = const Duration(minutes: 5);

  /// Active downloads tracking
  final Map<String, CancelToken> _activeDownloads = {};

  /// Configure remote download settings with API configuration
  void configureRemoteDownload({
    FormGearApiConfig? apiConfig,
    String? baseUrl, // Deprecated: use apiConfig instead
    String? authToken,
    BpsUser? user,
    Map<String, String>? customHeaders,
    int maxRetries = 3,
    Duration? downloadTimeout,
  }) {
    _apiConfig = apiConfig;
    _authToken = authToken;
    _useRemoteDownload = true;
    _maxRetries = maxRetries;
    _downloadTimeout = downloadTimeout ?? const Duration(minutes: 5);

    FormGearLogger.sdk(
      'Remote download configured with API config: '
      'templateZipEndpoint=${_apiConfig?.templateZipEndpoint}, '
      'formEngineBaseUrl=${_apiConfig?.formEngineEndpoint}, '
      'hasToken=${_authToken != null}, user=${user?.username}',
    );
  }

  // Manual header building removed - Dio interceptors handle this automatically

  /// Gets the local documents directory for FormGear data
  /// Now uses FASIH-compatible BPS directory structure
  Future<Directory> getFormGearDataDirectory() async {
    // Use the new BPS directory structure
    return DirectoryConstants.getBpsDirectory();
  }

  /// Downloads a template from remote server or copies from assets
  Future<bool> downloadTemplate(
    String templateId, {
    DownloadProgressCallback? onProgress,
  }) async {
    if (_useRemoteDownload && _apiConfig?.getTemplateZipUrl('test') != null) {
      return _downloadTemplateFromRemote(templateId, onProgress: onProgress);
    }
    return _downloadTemplateFromAssets(templateId);
  }

  /// Downloads template from remote server using Template API
  Future<bool> _downloadTemplateFromRemote(
    String templateId, {
    DownloadProgressCallback? onProgress,
  }) async {
    try {
      final templateUrl = _apiConfig?.getTemplateZipUrl(templateId);
      if (templateUrl == null) {
        throw Exception('Template API configuration not available');
      }

      final result = await _downloadFile(
        url: templateUrl,
        destinationPath: 'templates/$templateId',
        onProgress: onProgress,
        autoDetectType: true, // Auto-detect if ZIP or JSON based on response
      );

      if (result.success) {
        FormGearLogger.sdk(
          'Template $templateId downloaded from FASIH Template API '
          'successfully',
        );
      }
      return result.success;
    } on Exception catch (e) {
      FormGearLogger.sdkError(
        'Failed to download template $templateId from FASIH API: $e',
      );
      return false;
    }
  }

  /// Downloads template from local assets
  Future<bool> _downloadTemplateFromAssets(String templateId) async {
    try {
      // Use FASIH-compatible directory structure
      final templateDir = await DirectoryConstants.getTemplateDirectory(
        templateId,
      );

      if (!templateDir.existsSync()) {
        templateDir.createSync(recursive: true);
      }

      // Copy template files from assets
      final assetPaths = [
        'assets/Template/$templateId/${templateId}_template.json',
        'assets/Template/$templateId/${templateId}_validation.json',
      ];

      for (final assetPath in assetPaths) {
        try {
          final content = await rootBundle.loadString(assetPath);
          final fileName = assetPath.split('/').last;
          final localFile = File('${templateDir.path}/$fileName');
          localFile.writeAsStringSync(content);

          FormGearLogger.sdk(
            'Downloaded template file: $fileName for template $templateId',
          );
        } on Exception catch (e) {
          FormGearLogger.sdkError('Failed to download $assetPath: $e');
        }
      }

      FormGearLogger.sdk('Template $templateId downloaded successfully');
      return true;
    } on Exception catch (e) {
      FormGearLogger.sdkError('Failed to download template $templateId: $e');
      return false;
    }
  }

  /// Simulates downloading lookup data by copying from assets to local storage
  Future<bool> downloadLookupData(String lookupId, String version) async {
    try {
      // Use FASIH-compatible directory structure
      final lookupDir = await DirectoryConstants.getLookupDirectory(lookupId);

      if (!lookupDir.existsSync()) {
        lookupDir.createSync(recursive: true);
      }

      // Try different version formats
      final possibleAssetPaths = [
        'assets/lookup/$lookupId/$version.json',
        'assets/lookup/$lookupId/v$version.json',
      ];

      for (final assetPath in possibleAssetPaths) {
        try {
          final content = await rootBundle.loadString(assetPath);
          final localFile = File('${lookupDir.path}/$version.json');
          localFile.writeAsStringSync(content);

          FormGearLogger.sdk('Downloaded lookup data: $lookupId v$version');
          return true;
        } on Exception {
          // Continue to next path
        }
      }

      FormGearLogger.sdkError('No lookup data found for $lookupId v$version');
      return false;
    } on Exception catch (e) {
      FormGearLogger.sdkError(
        'Failed to download lookup $lookupId v$version: $e',
      );
      return false;
    }
  }

  /// Downloads FormGear engine files from remote URL or local assets
  ///
  /// FASIH Pattern:
  /// 1. Check version via FormEngineService endpoint
  /// 2. Get download URL from FormEngineEntity.url
  /// 3. Download and extract ZIP file using KDownloader pattern
  Future<bool> downloadFormEngine(
    String engineId, {
    String? downloadUrl,
    DownloadProgressCallback? onProgress,
  }) async {
    if (_useRemoteDownload && downloadUrl != null) {
      return _downloadFormEngineFromRemote(
        engineId,
        downloadUrl,
        onProgress: onProgress,
      );
    }
    return _downloadFormEngineFromAssets(engineId);
  }

  /// Downloads form engine from remote URL (FASIH pattern)
  Future<bool> _downloadFormEngineFromRemote(
    String engineId,
    String downloadUrl, {
    DownloadProgressCallback? onProgress,
  }) async {
    try {
      final result = await _downloadFile(
        url: downloadUrl,
        destinationPath: '${DirectoryConstants.formEngineDirectory}/$engineId',
        onProgress: onProgress,
        autoDetectType: true, // ZIP files will be auto-extracted
      );

      if (result.success) {
        FormGearLogger.sdk(
          'FormGear engine $engineId downloaded from remote successfully',
        );
      }
      return result.success;
    } on Exception catch (e) {
      FormGearLogger.sdkError(
        'Failed to download engine $engineId from remote: $e',
      );
      return false;
    }
  }

  /// Downloads FormGear engine files from local assets (fallback)
  Future<bool> _downloadFormEngineFromAssets(String engineId) async {
    try {
      // Use FASIH-compatible directory structure
      final engineDir = await DirectoryConstants.getFormEngineDirectory(
        engineId,
      );

      // Ensure engine directory exists
      if (!engineDir.existsSync()) {
        engineDir.createSync(recursive: true);
      }

      // Copy engine files from assets - include all required files
      final assetPaths = [
        'assets/formengine/$engineId/index.html',
        'assets/formengine/$engineId/form-gear.es.js',
        'assets/formengine/$engineId/form-gear.umd.js',
        'assets/formengine/$engineId/style.css',
        'assets/formengine/$engineId/version.json',
      ];

      var filesDownloaded = 0;
      for (final assetPath in assetPaths) {
        try {
          final content = await rootBundle.loadString(assetPath);
          final fileName = assetPath.split('/').last;
          final localFile = File('${engineDir.path}/$fileName');
          localFile.writeAsStringSync(content);
          filesDownloaded++;

          FormGearLogger.sdk(
            'Downloaded engine file: $fileName for engine $engineId '
            '(${content.length} chars)',
          );
        } on Exception catch (e) {
          final fileName = assetPath.split('/').last;
          // CSS and version.json are optional files
          if (fileName == 'style.css' ||
              fileName == 'version.json') {
            FormGearLogger.sdk(
              'Optional file $fileName not found for engine $engineId '
              '(skipped)',
            );
          } else {
            FormGearLogger.sdkError(
              'Failed to download required file $assetPath: $e',
            );
          }
        }
      }

      FormGearLogger.sdk(
        'FormGear engine $engineId downloaded successfully '
        '($filesDownloaded files)',
      );
      return true;
    } on Exception catch (e) {
      FormGearLogger.sdkError('Failed to download engine $engineId: $e');
      return false;
    }
  }

  /// Checks if template exists locally
  Future<bool> isTemplateDownloaded(String templateId) async {
    final templateDir = await DirectoryConstants.getTemplateDirectory(
      templateId,
    );
    final templateFile = File('${templateDir.path}/template.json');
    return templateFile.existsSync();
  }

  /// Checks if lookup data exists locally
  Future<bool> isLookupDownloaded(String lookupId, String version) async {
    final lookupDir = await DirectoryConstants.getLookupDirectory(lookupId);
    final lookupFile = File('${lookupDir.path}/$version.json');
    return lookupFile.existsSync();
  }

  /// Checks if FormGear engine exists locally
  Future<bool> isEngineDownloaded(String engineId) async {
    final engineDir = await DirectoryConstants.getFormEngineDirectory(engineId);
    final engineFile = File('${engineDir.path}/index.html');
    return engineFile.existsSync();
  }

  /// Gets the local version of a form engine
  Future<String?> getLocalFormEngineVersion(String engineId) async {
    try {
      final dataDir = await getFormGearDataDirectory();
      final versionFile = File('${dataDir.path}/formengine/$engineId/version');

      if (versionFile.existsSync()) {
        final versionContent = versionFile.readAsStringSync();
        return versionContent.trim();
      }
      return null;
    } on Exception catch (e) {
      FormGearLogger.sdkError('Failed to read engine $engineId version: $e');
      return null;
    }
  }

  /// Loads template data from local storage using FASIH-compliant directory
  Future<Map<String, dynamic>?> loadLocalTemplate(String templateId) async {
    try {
      // Use FASIH-compliant directory structure
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

  /// Loads validation data from local storage using FASIH-compliant directory
  Future<Map<String, dynamic>?> loadLocalValidation(String templateId) async {
    try {
      // Use FASIH-compliant directory structure
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

  /// Loads lookup data from local storage
  Future<Map<String, dynamic>?> loadLocalLookup(
    String lookupId,
    String version,
  ) async {
    try {
      final lookupDir = await DirectoryConstants.getLookupDirectory(lookupId);
      final lookupFile = File('${lookupDir.path}/$version.json');

      if (lookupFile.existsSync()) {
        final content = lookupFile.readAsStringSync();
        return jsonDecode(content) as Map<String, dynamic>;
      }
      return null;
    } on Exception catch (e) {
      FormGearLogger.sdkError(
        'Failed to load local lookup $lookupId v$version: $e',
      );
      return null;
    }
  }

  /// Gets the local path for a FormGear engine file
  Future<String?> getLocalEnginePath(String engineId, String fileName) async {
    try {
      final engineDir = await DirectoryConstants.getFormEngineDirectory(
        engineId,
      );
      final engineFile = File('${engineDir.path}/$fileName');

      if (engineFile.existsSync()) {
        return engineFile.path;
      }
      return null;
    } on Exception catch (e) {
      FormGearLogger.sdkError(
        'Failed to get local engine path $engineId/$fileName: $e',
      );
      return null;
    }
  }

  /// Lists all downloaded templates using FASIH-compliant directory structure
  Future<List<String>> getDownloadedTemplates() async {
    try {
      // Use FASIH-compliant directory structure
      // (same as TemplateDownloadManager)
      final bpsDir = await DirectoryConstants.getBpsDirectory();
      final templatesDir = Directory(
        '${bpsDir.path}/${DirectoryConstants.templatesDirectory}',
      );

      if (!templatesDir.existsSync()) {
        return [];
      }

      final templateDirs = templatesDir
          .listSync()
          .whereType<Directory>()
          .toList();

      return templateDirs.map((dir) => dir.path.split('/').last).toList();
    } on Exception catch (e) {
      FormGearLogger.sdkError('Failed to list downloaded templates: $e');
      return [];
    }
  }

  /// Clears all downloaded data (for testing/cleanup)
  Future<void> clearAllData() async {
    try {
      // Cancel any active downloads
      for (final cancelToken in _activeDownloads.values) {
        if (!cancelToken.isCancelled) {
          cancelToken.cancel('Manager disposing');
        }
      }
      _activeDownloads.clear();

      final dataDir = await getFormGearDataDirectory();
      if (dataDir.existsSync()) {
        dataDir.deleteSync(recursive: true);
        FormGearLogger.sdk('All FormGear data cleared');
      }
    } on Exception catch (e) {
      FormGearLogger.sdkError('Failed to clear FormGear data: $e');
    }
  }

  /// Core download method with retry logic and progress tracking using Dio
  /// Matches FASIH download patterns with KDownloader-like behavior
  Future<DownloadResult> _downloadFile({
    required String url,
    required String destinationPath,
    DownloadProgressCallback? onProgress,
    bool isZipped = false,
    bool autoDetectType = false,
  }) async {
    final dataDir = await getFormGearDataDirectory();
    final tempDir = await getTemporaryDirectory();
    final tempFile = File(
      '${tempDir.path}/formgear_temp_${DateTime.now().millisecondsSinceEpoch}',
    );

    for (var attempt = 1; attempt <= _maxRetries; attempt++) {
      CancelToken? cancelToken;
      try {
        FormGearLogger.sdk(
          'Downloading from $url (attempt $attempt/$_maxRetries)',
        );

        // Create cancel token for this download
        cancelToken = CancelToken();
        _activeDownloads[url] = cancelToken;

        // Download with injected Dio - interceptors handle all headers
        // automatically
        final response = await _dio.download(
          url,
          tempFile.path,
          cancelToken: cancelToken,
          options: Options(
            responseType: ResponseType.bytes,
            followRedirects: true,
            validateStatus: (status) => status! < 500,
            sendTimeout: _downloadTimeout,
            receiveTimeout: _downloadTimeout,
          ),
          onReceiveProgress: onProgress,
        );

        // Remove from active downloads on success
        _activeDownloads.remove(url);

        if (response.statusCode != 200) {
          throw DioException(
            requestOptions: response.requestOptions,
            response: response,
            message: 'HTTP ${response.statusCode}: Failed to download file',
          );
        }

        // Get content type from response headers for processing
        final contentType = response.headers.value('content-type') ?? '';

        // Auto-detect file type if requested
        var shouldExtract = isZipped;
        if (autoDetectType) {
          shouldExtract = _shouldExtractFile(tempFile, contentType, url);
        }

        // Process downloaded file following FASIH pattern
        if (shouldExtract) {
          // Extract ZIP file like FASIH does
          await _extractZipFile(
            tempFile,
            Directory('${dataDir.path}/$destinationPath'),
          );
        } else {
          // Move file to destination like FASIH lookup handling
          final destFile = File('${dataDir.path}/$destinationPath');
          final destDir = destFile.parent;
          if (!destDir.existsSync()) {
            destDir.createSync(recursive: true);
          }
          tempFile.copySync(destFile.path);
        }

        // Clean up temp file
        if (tempFile.existsSync()) {
          tempFile.deleteSync();
        }

        return DownloadResult(
          success: true,
          localPath: '${dataDir.path}/$destinationPath',
        );
      } on DioException catch (e) {
        FormGearLogger.sdkError(
          'Download failed on attempt $attempt: ${e.message}',
        );

        if (e.type == DioExceptionType.cancel) {
          return const DownloadResult(
            success: false,
            error: 'Download was cancelled',
          );
        }

        if (attempt == _maxRetries) {
          return DownloadResult(
            success: false,
            error: 'Download failed after $_maxRetries attempts: ${e.message}',
          );
        }
        // Wait before retry with exponential backoff
        await Future<void>.delayed(Duration(seconds: attempt * 2));
      } on Exception catch (e) {
        FormGearLogger.sdkError(
          'Download failed on attempt $attempt: $e',
        );
        if (attempt == _maxRetries) {
          return DownloadResult(
            success: false,
            error: 'Download failed after $_maxRetries attempts: $e',
          );
        }
        // Wait before retry
        await Future<void>.delayed(Duration(seconds: attempt * 2));
      } finally {
        // Remove from active downloads
        _activeDownloads.remove(url);

        // Clean up temp file on failure
        if (tempFile.existsSync()) {
          try {
            tempFile.deleteSync();
          } on Exception {
            // Ignore cleanup errors
          }
        }
      }
    }

    return DownloadResult(
      success: false,
      error: 'Download failed after $_maxRetries attempts',
    );
  }

  /// Extracts a ZIP file to the specified directory
  /// Follows FASIH ZipHelper.unZip pattern
  /// After extraction, creates/updates version.json file if version info is available
  Future<void> _extractZipFile(
    File zipFile,
    Directory targetDir, {
    String? version,
  }) async {
    try {
      final bytes = zipFile.readAsBytesSync();
      final archive = ZipDecoder().decodeBytes(bytes);

      if (!targetDir.existsSync()) {
        targetDir.createSync(recursive: true);
      }

      String? detectedVersion;

      for (final file in archive) {
        final filename = file.name;
        final filePath = path.join(targetDir.path, filename);

        if (file.isFile) {
          final outFile = File(filePath);
          outFile.parent.createSync(recursive: true);
          outFile.writeAsBytesSync(file.content as List<int>);

          // Try to detect version from existing version.json in archive
          if (filename == DirectoryConstants.versionFileName ||
              filename.endsWith('/version.json')) {
            try {
              final content = String.fromCharCodes(file.content as List<int>);
              final versionJson = jsonDecode(content) as Map<String, dynamic>;
              detectedVersion = versionJson['version'] as String?;
            } on Exception catch (_) {
              // Ignore parsing errors
            }
          }
        } else {
          Directory(filePath).createSync(recursive: true);
        }
      }

      // Create version.json if not present or update with provided version
      final versionToWrite = version ?? detectedVersion;
      if (versionToWrite != null) {
        await _saveEngineVersion(
          targetDir.path.split('/').last,
          versionToWrite,
        );
      }

      FormGearLogger.sdk('Extracted ZIP to ${targetDir.path}');
    } on Exception catch (e) {
      FormGearLogger.sdkError('Failed to extract ZIP file: $e');
      rethrow;
    }
  }

  /// Saves engine version in FASIH-compatible JSON format
  /// Creates version.json with {"version": "x.x.x"} structure
  Future<void> _saveEngineVersion(String engineId, String version) async {
    try {
      final versionFile = await DirectoryConstants.getFormEngineVersionFile(
        engineId,
      );
      final versionData = {'version': version};
      versionFile.writeAsStringSync(jsonEncode(versionData));

      FormGearLogger.sdk(
        'Saved version $version for engine $engineId in JSON format',
      );
    } on Exception catch (e) {
      FormGearLogger.sdkError(
        'Failed to save version for engine $engineId: $e',
      );
    }
  }

  /// Cancels a specific download
  Future<void> cancelDownload(String url) async {
    final cancelToken = _activeDownloads[url];
    if (cancelToken != null && !cancelToken.isCancelled) {
      cancelToken.cancel('Download cancelled by user');
      _activeDownloads.remove(url);
      FormGearLogger.sdk('Cancelled download: $url');
    }
  }

  /// Checks if remote download is configured
  bool get isRemoteConfigured =>
      _useRemoteDownload && _apiConfig?.getTemplateZipUrl('test') != null;

  /// Gets the configured API configuration
  FormGearApiConfig? get apiConfig => _apiConfig;

  /// Determines if a file should be extracted based on content type,
  /// URL, and file content
  bool _shouldExtractFile(File file, String contentType, String url) {
    // Check content type first
    if (contentType.contains('application/zip') ||
        contentType.contains('application/x-zip-compressed')) {
      return true;
    }

    // Check URL extension
    if (url.toLowerCase().endsWith('.zip')) {
      return true;
    }

    // Check file magic bytes (ZIP signature: PK)
    try {
      final bytes = file.readAsBytesSync();
      if (bytes.length >= 2 && bytes[0] == 0x50 && bytes[1] == 0x4B) {
        return true;
      }
    } on Exception catch (e) {
      FormGearLogger.sdkError('Error reading file for type detection: $e');
    }

    return false;
  }

  /// Disposes resources
  Future<void> dispose() async {
    for (final cancelToken in _activeDownloads.values) {
      if (!cancelToken.isCancelled) {
        cancelToken.cancel('Manager disposing');
      }
    }
    _activeDownloads.clear();
  }
}
