import 'package:flutter/material.dart';
import 'package:form_gear_engine_sdk/src/core/download/template_download_manager.dart';
import 'package:form_gear_engine_sdk/src/models/models.dart';
import 'package:form_gear_engine_sdk/src/presentation/screens/template_update_screen.dart';
import 'package:form_gear_engine_sdk/src/utils/form_gear_logger.dart';
import 'package:injectable/injectable.dart';

/// Template version states following FASIH's 3-state logic
enum TemplateVersionState {
  /// Template is not available locally
  missing,

  /// Template exists but is not the latest version
  outdated,

  /// Template is up to date
  current,
}

/// Result of template version check
class TemplateVersionCheckResult {
  const TemplateVersionCheckResult({
    required this.state,
    required this.templateId,
    this.localVersion,
    this.remoteVersion,
    this.customData,
  });

  final TemplateVersionState state;
  final String templateId;
  final String? localVersion;
  final String? remoteVersion;
  final Map<String, dynamic>? customData;

  /// Whether the template needs to be downloaded
  bool get needsDownload =>
      state == TemplateVersionState.missing ||
      state == TemplateVersionState.outdated;

  /// Display name for the template
  String get templateDisplayName => 'Template $templateId';
}

/// Manages template version checking and download notifications
/// Following FASIH's template management workflow
@LazySingleton()
class TemplateVersionManager {
  const TemplateVersionManager(this._templateDownloadManager);

  final TemplateDownloadManager _templateDownloadManager;

  /// Checks template version and returns result with state information
  ///
  /// Parameters:
  /// - [templateId]: Template identifier to check
  /// - [remoteVersion]: Expected remote version (from API)
  /// - [showNotifications]: Whether to show UI dialogs
  /// - [context]: BuildContext for showing dialogs
  ///
  /// Returns:
  /// - [TemplateVersionCheckResult] with version state information
  /// - `null` if check failed
  Future<TemplateVersionCheckResult?> checkTemplateVersion({
    required String templateId,
    String? remoteVersion,
    bool showNotifications = true,
    BuildContext? context,
  }) async {
    try {
      FormGearLogger.sdk('Checking template version for: $templateId');

      // Determine version state using FASIH's 3-state logic
      final versionResult = await _determineTemplateVersionState(
        templateId,
        remoteVersion,
      );

      // Show template update screen if needed and context is available
      if (versionResult.needsDownload && showNotifications && context != null) {
        _showTemplateUpdateScreen(context, versionResult);
      }

      return versionResult;
    } on Exception catch (e) {
      FormGearLogger.sdkError(
        'Template version check failed: $e',
      );
      if (showNotifications && context != null) {
        _showErrorNotification(
          context,
          'Failed to check template version: $e',
        );
      }
      return null;
    }
  }

  /// Determines the template version state using FASIH's 3-state logic
  Future<TemplateVersionCheckResult> _determineTemplateVersionState(
    String templateId,
    String? remoteVersion,
  ) async {
    // Check if template exists locally
    final isDownloaded = await isTemplateDownloaded(templateId);

    // STATE 1: Missing - Template not downloaded locally
    if (!isDownloaded) {
      FormGearLogger.sdk(
        'Template $templateId not found locally - STATE: MISSING',
      );
      return TemplateVersionCheckResult(
        state: TemplateVersionState.missing,
        templateId: templateId,
        remoteVersion: remoteVersion,
      );
    }

    // Get local version for comparison
    final localVersion = await getLocalTemplateVersion(templateId);

    // STATE 2: Missing version file (treat as missing)
    if (localVersion == null) {
      FormGearLogger.sdkError(
        'Local template $templateId exists but no version file found - '
        'STATE: MISSING',
      );
      return TemplateVersionCheckResult(
        state: TemplateVersionState.missing,
        templateId: templateId,
        remoteVersion: remoteVersion,
      );
    }

    // STATE 3: Outdated - Version mismatch
    if (remoteVersion != null && localVersion != remoteVersion) {
      FormGearLogger.sdk(
        'Template version mismatch - Local: $localVersion, Remote: '
        '$remoteVersion - STATE: OUTDATED',
      );
      return TemplateVersionCheckResult(
        state: TemplateVersionState.outdated,
        templateId: templateId,
        localVersion: localVersion,
        remoteVersion: remoteVersion,
      );
    }

    // STATE 4: Current - Up to date
    FormGearLogger.sdk(
      'Template $templateId is up to date (v$localVersion) - STATE: CURRENT',
    );
    return TemplateVersionCheckResult(
      state: TemplateVersionState.current,
      templateId: templateId,
      localVersion: localVersion,
      remoteVersion: remoteVersion,
    );
  }

  /// Checks if a template is downloaded locally
  /// Delegates to TemplateDownloadManager for consistency
  Future<bool> isTemplateDownloaded(String templateId) async {
    return _templateDownloadManager.isTemplateDownloaded(templateId);
  }

  /// Gets the local template version from the template metadata file
  /// Delegates to TemplateDownloadManager for consistency
  Future<String?> getLocalTemplateVersion(String templateId) async {
    return _templateDownloadManager.getLocalTemplateVersion(templateId);
  }

  /// Shows template update screen instead of dialog
  void _showTemplateUpdateScreen(
    BuildContext context,
    TemplateVersionCheckResult result,
  ) {
    // Convert to VersionCheckResult format for the screen
    final versionResult = _convertToVersionCheckResult(result);

    TemplateUpdateScreen.show(
      context: context,
      versionResult: versionResult,
      templateName: result.templateDisplayName,
      onDownload: () => _performTemplateDownload(context, result),
    );
  }

  /// Converts TemplateVersionCheckResult to VersionCheckResult
  VersionCheckResult _convertToVersionCheckResult(
    TemplateVersionCheckResult result,
  ) {
    // Convert template states to version states
    VersionState versionState;
    switch (result.state) {
      case TemplateVersionState.missing:
        versionState = VersionState.missing;
      case TemplateVersionState.outdated:
        versionState = VersionState.outdated;
      case TemplateVersionState.current:
        versionState = VersionState.current;
    }

    // Create a mock FormEngineEntity for templates (templates aren't forced)
    final mockFormEngine = FormEngineEntity(
      formEngineId: 1, // Default to FormGear
      id: result.templateId,
      version: result.remoteVersion,
      isForce: false, // Templates are not forced downloads
      message: 'Template download',
    );

    return VersionCheckResult(
      state: versionState,
      formEngine: mockFormEngine,
      localVersion: result.localVersion,
      remoteVersion: result.remoteVersion,
    );
  }

  /// Shows error notification
  void _showErrorNotification(BuildContext context, String message) {
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
    );
  }

  /// Performs the actual template download and ZIP extraction
  /// Following FASIH's workflow: download ZIP -> extract -> save version
  Future<void> _performTemplateDownload(
    BuildContext context,
    TemplateVersionCheckResult result,
  ) async {
    try {
      final templateId = result.templateId;
      FormGearLogger.sdk('Starting template download for ID: $templateId');

      // Use TemplateDownloadManager for actual download
      final downloadResult = await _templateDownloadManager.downloadTemplate(
        templateId,
        templateVersion: result.remoteVersion,
      );

      if (downloadResult.success) {
        _handleDownloadSuccess(context, result);
        FormGearLogger.sdk(
          'Template $templateId download completed successfully',
        );
      } else {
        throw Exception(
          downloadResult.error ?? 'Unknown download error',
        );
      }
    } on Exception catch (e) {
      FormGearLogger.sdkError(
        'Template download failed: $e',
      );
      _handleDownloadError(context, 'Download failed: $e');
    }
  }

  /// Handles successful download completion
  void _handleDownloadSuccess(
    BuildContext context,
    TemplateVersionCheckResult result,
  ) {
    Navigator.of(context).pop(); // Close progress dialog

    showDialog<void>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Download Complete'),
        content: Text(
          '${result.templateDisplayName} has been downloaded successfully!',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  /// Handles download errors
  void _handleDownloadError(BuildContext context, String error) {
    Navigator.of(context).pop(); // Close progress dialog

    showDialog<void>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Download Failed'),
        content: Text(error),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }
}
