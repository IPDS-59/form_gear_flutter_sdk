import 'dart:async';

import 'package:flutter/material.dart';
import 'package:form_gear_engine_sdk/src/core/base/failure.dart';
import 'package:form_gear_engine_sdk/src/core/base/result.dart';
import 'package:form_gear_engine_sdk/src/core/version/form_engine_update_handler.dart';
import 'package:form_gear_engine_sdk/src/domain/usecases/check_form_engine_version_usecase.dart';
import 'package:form_gear_engine_sdk/src/domain/usecases/get_local_form_engine_version_usecase.dart';
import 'package:form_gear_engine_sdk/src/domain/usecases/install_form_engine_usecase.dart';
import 'package:form_gear_engine_sdk/src/domain/usecases/is_form_engine_downloaded_usecase.dart';
import 'package:form_gear_engine_sdk/src/models/models.dart';
import 'package:form_gear_engine_sdk/src/presentation/screens/form_engine_update_screen.dart';
import 'package:form_gear_engine_sdk/src/utils/form_gear_logger.dart';
import 'package:injectable/injectable.dart';

/// Manages form engine version checking and download notifications
@LazySingleton()
class FormGearVersionManager {
  const FormGearVersionManager(
    this._checkFormEngineVersionUseCase,
    this._isFormEngineDownloadedUseCase,
    this._getLocalFormEngineVersionUseCase,
    this._installFormEngineUseCase,
  );

  final CheckFormEngineVersionUseCase _checkFormEngineVersionUseCase;
  final IsFormEngineDownloadedUseCase _isFormEngineDownloadedUseCase;
  final GetLocalFormEngineVersionUseCase _getLocalFormEngineVersionUseCase;
  final InstallFormEngineUseCase _installFormEngineUseCase;

  /// Checks form engine version and returns result with state information
  Future<VersionCheckResult?> checkFormEngineVersion({
    String? engineId,
    bool showNotifications = true,
    BuildContext? context,
    FormEngineUpdateHandler? updateHandler,
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
        (response) async {
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
            _showVersionUpdateScreen(context, versionResult, updateHandler);
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

  /// Downloads the engine described by [result]; no UI.
  Future<Result<void>> _download(
    VersionCheckResult result, {
    void Function(int progress)? onProgress,
  }) => _installFormEngineUseCase(
    result.formEngine,
    result.formEngine.formEngineId?.toString() ??
        FormEngineType.formGear.id.toString(),
    onProgress: onProgress,
  );

  /// Looks up engine [engineId] on the server, then downloads it; no UI.
  Future<Result<void>> downloadFormEngine(
    String engineId, {
    void Function(int progress)? onProgress,
  }) async {
    final response = await _checkFormEngineVersionUseCase(engineId);
    final formEngine = response.dataOrNull?.data;
    if (formEngine == null) {
      return Failure(
        response.errorOrNull ??
            const DataFailure('Form engine not found', 'engine_not_found'),
      );
    }
    return await _installFormEngineUseCase(
      formEngine,
      engineId,
      onProgress: onProgress,
    );
  }

  /// Shows the host's [handler] UI, or the built-in update screen.
  void _showVersionUpdateScreen(
    BuildContext context,
    VersionCheckResult result,
    FormEngineUpdateHandler? handler,
  ) {
    if (handler != null) {
      unawaited(
        handler
            .onUpdateRequired(
              context,
              result,
              ({onProgress}) => _download(result, onProgress: onProgress),
            )
            .catchError(
              (Object e) =>
                  FormGearLogger.sdkError('Form engine update handler: $e'),
            ),
      );
      return;
    }
    unawaited(
      FormEngineUpdateScreen.show(
        context: context,
        versionResult: result,
        // Built-in screen reads progress only; failures are logged.
        onDownload: (onProgress) async {
          await _download(result, onProgress: onProgress);
        },
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
}
