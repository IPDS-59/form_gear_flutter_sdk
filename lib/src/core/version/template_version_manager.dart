import 'package:flutter/material.dart';
import 'package:form_gear_engine_sdk/src/core/download/template_download_manager.dart';
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

      // Show dialog if needed and context is available
      if (versionResult.needsDownload && showNotifications && context != null) {
        _showTemplateVersionDialog(context, versionResult);
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

  /// Shows template version dialog based on state
  void _showTemplateVersionDialog(
    BuildContext context,
    TemplateVersionCheckResult result,
  ) {
    final templateName = result.templateDisplayName;

    String title;
    String content;
    String actionText;

    switch (result.state) {
      case TemplateVersionState.missing:
        title = 'Template Required';
        content = '$templateName is not available on your device.';

        if (result.remoteVersion != null) {
          content += ' Version ${result.remoteVersion} needs to be downloaded.';
        }

        content += '\n\nWould you like to download it now?';
        actionText = 'Download';

      case TemplateVersionState.outdated:
        title = 'Template Update Available';
        content =
            '$templateName on your device is not the latest version.\n\n'
            'Current version: v${result.localVersion}\n'
            'Latest version: v${result.remoteVersion}';

        content += '\n\nWould you like to update now?';
        actionText = 'Update';

      case TemplateVersionState.current:
        title = 'Re-download Template';
        content =
            '$templateName on your device is the latest version '
            '(v${result.localVersion}).\n\n'
            'Would you like to re-download it anyway?';
        actionText = 'Re-download';
    }

    showDialog<void>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(title),
        content: Text(content),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pop();
              _downloadTemplate(context, result);
            },
            child: Text(actionText),
          ),
        ],
      ),
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

  /// Initiates template download with ZIP extraction
  void _downloadTemplate(
    BuildContext context,
    TemplateVersionCheckResult result,
  ) {
    // Show progress dialog
    showDialog<void>(
      context: context,
      barrierDismissible: false,
      builder: (context) => const AlertDialog(
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            CircularProgressIndicator(),
            SizedBox(height: 16),
            Text('Downloading template...'),
          ],
        ),
      ),
    );

    // Perform actual download with ZIP extraction
    _performTemplateDownload(context, result);
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
