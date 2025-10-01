import 'dart:async';

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:form_gear_engine_sdk/src/core/base/result.dart';
import 'package:form_gear_engine_sdk/src/core/constants/directory_constants.dart';
import 'package:form_gear_engine_sdk/src/domain/usecases/check_form_engine_version_usecase.dart';
import 'package:form_gear_engine_sdk/src/domain/usecases/get_local_form_engine_version_usecase.dart';
import 'package:form_gear_engine_sdk/src/domain/usecases/is_form_engine_downloaded_usecase.dart';
import 'package:form_gear_engine_sdk/src/models/models.dart';
import 'package:form_gear_engine_sdk/src/presentation/screens/form_engine_update_screen.dart';
import 'package:form_gear_engine_sdk/src/utils/form_gear_logger.dart';
import 'package:form_gear_engine_sdk/src/utils/zip_helper.dart';
import 'package:injectable/injectable.dart';
import 'package:path/path.dart' as path;

/// Manages form engine version checking and download notifications
@LazySingleton()
class FormGearVersionManager {
  const FormGearVersionManager(
    this._checkFormEngineVersionUseCase,
    this._isFormEngineDownloadedUseCase,
    this._getLocalFormEngineVersionUseCase,
    this._dio,
  );

  final CheckFormEngineVersionUseCase _checkFormEngineVersionUseCase;
  final IsFormEngineDownloadedUseCase _isFormEngineDownloadedUseCase;
  final GetLocalFormEngineVersionUseCase _getLocalFormEngineVersionUseCase;
  final Dio _dio;

  /// Checks form engine version and returns result with state information
  Future<VersionCheckResult?> checkFormEngineVersion({
    String? engineId,
    bool showNotifications = true,
    BuildContext? context,
  }) async {
    try {
      final result = await _checkFormEngineVersionUseCase(engineId);

      return await result.fold(
        (failure) async {
          FormGearLogger.sdkError('Form engine version check failed: $failure');
          if (showNotifications && context != null) {
            _showErrorNotification(
              context,
              'Failed to check form engine version: $failure',
            );
          }
          return null;
        },
        (FormEngineResponse response) async {
          final formEngine = response.data;

          if (formEngine == null) {
            if (showNotifications && context != null) {
              _showErrorNotification(
                context,
                'Failed to check form engine version',
              );
            }
            return null;
          }

          // Determine version state using 3-state logic
          final versionResult = await _determineVersionState(
            formEngine,
            engineId,
          );

          // Show update screen if needed and context is available
          if (versionResult.needsDownload &&
              (showNotifications || versionResult.isForced) &&
              context != null) {
            _showVersionUpdateScreen(context, versionResult);
          }

          return versionResult;
        },
      );
    } on Exception catch (e) {
      FormGearLogger.sdkError('Form engine version check failed: $e');
      if (showNotifications && context != null) {
        _showErrorNotification(
          context,
          'Failed to check form engine version: $e',
        );
      }
      return null;
    }
  }

  /// Determines the version state using FASIH's 3-state logic
  Future<VersionCheckResult> _determineVersionState(
    FormEngineEntity formEngine,
    String? engineId,
  ) async {
    final formEngineIdStr =
        formEngine.formEngineId?.toString() ??
        engineId ??
        FormEngineType.formGear.id.toString();

    final isEngineDownloaded = await _isFormEngineDownloadedUseCase(
      formEngineIdStr,
    );
    final remoteVersion = formEngine.version;

    // STATE 1: Missing - Form engine not downloaded locally
    if (!isEngineDownloaded) {
      FormGearLogger.sdk(
        'Form engine $formEngineIdStr not found locally - STATE: MISSING',
      );
      return VersionCheckResult(
        state: VersionState.missing,
        formEngine: formEngine,
        remoteVersion: remoteVersion,
      );
    }

    // Get local version for comparison
    final localVersionResult = await _getLocalFormEngineVersionUseCase(
      formEngineIdStr,
    );
    final localVersion = localVersionResult is Success<String?>
        ? localVersionResult.data
        : null;

    // STATE 2: Missing version file (treat as missing)
    if (localVersion == null) {
      FormGearLogger.sdkError(
        'Local engine $formEngineIdStr exists but no version file found - '
        'STATE: MISSING',
      );
      return VersionCheckResult(
        state: VersionState.missing,
        formEngine: formEngine,
        remoteVersion: remoteVersion,
      );
    }

    // STATE 3: Outdated - Version mismatch
    if (remoteVersion != null && localVersion != remoteVersion) {
      FormGearLogger.sdk(
        'Version mismatch - Local: $localVersion, Remote: $remoteVersion - '
        'STATE: OUTDATED',
      );
      return VersionCheckResult(
        state: VersionState.outdated,
        formEngine: formEngine,
        localVersion: localVersion,
        remoteVersion: remoteVersion,
      );
    }

    // STATE 4: Current - Up to date
    FormGearLogger.sdk(
      'Form engine $formEngineIdStr is up to date (v$localVersion) - '
      'STATE: CURRENT',
    );
    return VersionCheckResult(
      state: VersionState.current,
      formEngine: formEngine,
      localVersion: localVersion,
      remoteVersion: remoteVersion,
    );
  }

  /// Shows version update screen instead of dialog
  void _showVersionUpdateScreen(
    BuildContext context,
    VersionCheckResult result,
  ) {
    unawaited(
      FormEngineUpdateScreen.show(
        context: context,
        versionResult: result,
        onDownload: (onProgress) => _performFormEngineDownload(
          context,
          result.formEngine,
          result.formEngine.formEngineId?.toString() ??
              FormEngineType.formGear.id.toString(),
          onProgress: onProgress,
        ),
      ),
    );
  }

  /// Shows error notification
  void _showErrorNotification(BuildContext context, String message) {
    unawaited(
      showDialog<void>(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text('Error'),
          content: Text(message),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('OK'),
            ),
          ],
        ),
      ),
    );
  }

  /// Performs the actual form engine download and ZIP extraction
  /// Following FASIH's workflow: download ZIP -> extract -> save version
  Future<void> _performFormEngineDownload(
    BuildContext context,
    FormEngineEntity formEngine,
    String engineId, {
    void Function(int progress)? onProgress,
  }) async {
    try {
      FormGearLogger.sdk('Starting form engine download for ID: $engineId');

      // Step 1: Download ZIP file with progress tracking
      final zipFilePath = await _downloadFormEngineZip(
        formEngine,
        engineId,
        onProgress: onProgress,
      );
      if (zipFilePath == null) {
        _handleDownloadError(
          context,
          'Failed to download form engine ZIP file',
        );
        return;
      }

      // Step 2: Extract ZIP to form engine directory
      final engineDir = await DirectoryConstants.getFormEngineDirectory(
        engineId,
      );
      final extractSuccess = await ZipHelper.extractZip(
        zipFilePath,
        engineDir.path,
        deleteZipAfterExtraction: true, // Clean up ZIP after extraction
      );

      if (!extractSuccess) {
        _handleDownloadError(context, 'Failed to extract form engine files');
        return;
      }

      // Step 3: Save version information
      if (formEngine.version != null) {
        await _saveFormEngineVersion(engineId, formEngine.version!);
      }

      // Step 4: Verify extraction success
      final isNowDownloaded = await _isFormEngineDownloadedUseCase(engineId);

      if (isNowDownloaded) {
        _handleDownloadSuccess(context, formEngine);
        FormGearLogger.sdk(
          'Form engine $engineId downloaded and extracted successfully',
        );
      } else {
        _handleDownloadError(
          context,
          'Download completed but verification failed',
        );
      }
    } on Exception catch (e) {
      FormGearLogger.sdkError('Form engine download failed: $e');
      _handleDownloadError(context, 'Download failed: $e');
    }
  }

  /// Downloads form engine ZIP file to temporary location
  /// Returns the path to the downloaded ZIP file, or null if download failed
  Future<String?> _downloadFormEngineZip(
    FormEngineEntity formEngine,
    String engineId, {
    void Function(int progress)? onProgress,
  }) async {
    try {
      final downloadUrl = formEngine.linkDownload;
      if (downloadUrl == null || downloadUrl.isEmpty) {
        FormGearLogger.sdkError(
          'No download URL available for form engine $engineId',
        );
        return null;
      }

      FormGearLogger.sdk('Downloading from URL: $downloadUrl');

      // Create temporary directory for ZIP download
      final engineDir = await DirectoryConstants.getFormEngineDirectory(
        engineId,
      );
      final zipFileName = '${engineId}_formengine.zip';
      final zipFilePath = path.join(engineDir.path, zipFileName);

      // Download the ZIP file using injected Dio with progress tracking
      final response = await _dio.download(
        downloadUrl,
        zipFilePath,
        options: Options(
          responseType: ResponseType.bytes,
          followRedirects: true,
          validateStatus: (status) => status! < 500,
        ),
        onReceiveProgress: (received, total) {
          if (onProgress != null && total > 0) {
            final progress = ((received / total) * 100).round();
            onProgress(progress);
          }
        },
      );

      if (response.statusCode == 200) {
        FormGearLogger.sdk('ZIP file downloaded to: $zipFilePath');
        return zipFilePath;
      } else {
        FormGearLogger.sdkError(
          'HTTP ${response.statusCode}: Failed to download form engine ZIP',
        );
        return null;
      }
    } on Exception catch (e) {
      FormGearLogger.sdkError('Error downloading form engine ZIP: $e');
      return null;
    }
  }

  /// Saves form engine version to version.json file
  Future<void> _saveFormEngineVersion(String engineId, String version) async {
    try {
      final versionFile = await DirectoryConstants.getFormEngineVersionFile(
        engineId,
      );
      final versionData = {'version': version};
      final versionJson = _jsonEncode(versionData);

      await versionFile.writeAsString(versionJson);
      FormGearLogger.sdk('Saved version $version for engine $engineId');
    } on Exception catch (e) {
      FormGearLogger.sdkError(
        'Failed to save version for engine $engineId: $e',
      );
    }
  }

  /// JSON encoder helper (avoiding dart:convert import for minimal
  /// dependencies)
  String _jsonEncode(Map<String, dynamic> data) {
    final buffer = StringBuffer();
    buffer.write('{');

    final entries = data.entries.toList();
    for (var i = 0; i < entries.length; i++) {
      final entry = entries[i];
      buffer.write('"${entry.key}":"${entry.value}"');
      if (i < entries.length - 1) {
        buffer.write(',');
      }
    }

    buffer.write('}');
    return buffer.toString();
  }

  /// Handles successful download completion
  void _handleDownloadSuccess(
    BuildContext context,
    FormEngineEntity formEngine,
  ) {
    // Removed Navigator.pop() - let update screen handle its own UI state
    // The update screen manages its own navigation and progress display

    final engineName = formEngine.formEngineId == FormEngineType.formGear.id
        ? 'FormGear'
        : 'FasihForm';

    // Success dialog removed - let calling code handle UI feedback
    // The download/update screen and engine selection screen will handle
    // showing appropriate success feedback to users
    FormGearLogger.sdk(
      '$engineName Engine has been downloaded and installed successfully!',
    );
  }

  /// Handles download errors
  /// Error display is handled by the update screen's BLoC state
  void _handleDownloadError(BuildContext context, String error) {
    FormGearLogger.sdkError('Download error: $error');
    // Error is already propagated through BLoC state via onDownload callback
    // The update screen will display error in modern UI
  }
}
