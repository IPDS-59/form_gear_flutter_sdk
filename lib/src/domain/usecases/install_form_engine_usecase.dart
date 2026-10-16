import 'dart:convert';

import 'package:dio/dio.dart';
import 'package:form_gear_engine_sdk/src/core/base/failure.dart';
import 'package:form_gear_engine_sdk/src/core/base/result.dart';
import 'package:form_gear_engine_sdk/src/core/constants/directory_constants.dart';
import 'package:form_gear_engine_sdk/src/domain/usecases/is_form_engine_downloaded_usecase.dart';
import 'package:form_gear_engine_sdk/src/models/models.dart';
import 'package:form_gear_engine_sdk/src/utils/form_gear_logger.dart';
import 'package:form_gear_engine_sdk/src/utils/zip_helper.dart';
import 'package:injectable/injectable.dart';
import 'package:path/path.dart' as path;

/// Installs a form engine: downloads its ZIP, extracts it and saves its
/// version.
///
/// Follows FASIH's workflow: download ZIP -> extract -> save version ->
/// verify. It has no UI, so hosts can show their own progress.
@LazySingleton()
class InstallFormEngineUseCase {
  const InstallFormEngineUseCase(this._dio, this._isDownloaded);

  final Dio _dio;
  final IsFormEngineDownloadedUseCase _isDownloaded;

  /// Installs [formEngine] as engine [engineId].
  ///
  /// [onProgress] gets whole percents (0-100) while the ZIP downloads.
  /// Returns `Success` once the engine is installed and verified, otherwise
  /// a `Failure` holding an `AppFailure` (`NetworkFailure`, `ServerFailure`
  /// or `DataFailure`).
  Future<Result<void>> call(
    FormEngineEntity formEngine,
    String engineId, {
    void Function(int progress)? onProgress,
  }) async {
    try {
      FormGearLogger.sdk('Starting form engine download for ID: $engineId');

      final url = formEngine.linkDownload;
      if (url == null || url.isEmpty) {
        return const Failure(
          DataFailure('No download URL for form engine', 'no_download_url'),
        );
      }

      final engineDir = await DirectoryConstants.getFormEngineDirectory(
        engineId,
      );
      final zipPath = path.join(engineDir.path, '${engineId}_formengine.zip');

      final response = await _dio.download(
        url,
        zipPath,
        options: Options(
          responseType: ResponseType.bytes,
          followRedirects: true,
          validateStatus: (status) => status! < 500,
        ),
        onReceiveProgress: (received, total) {
          if (onProgress != null && total > 0) {
            onProgress(((received / total) * 100).round());
          }
        },
      );
      if (response.statusCode != 200) {
        return Failure(
          ServerFailure(
            'HTTP ${response.statusCode}: Failed to download form engine ZIP',
            'http_${response.statusCode}',
          ),
        );
      }

      final extracted = await ZipHelper.extractZip(
        zipPath,
        engineDir.path,
        deleteZipAfterExtraction: true,
      );
      if (!extracted) {
        return const Failure(
          DataFailure('Failed to extract form engine files', 'extract_failed'),
        );
      }

      if (formEngine.version != null) {
        await _saveVersion(engineId, formEngine.version!);
      }

      if (!await _isDownloaded(engineId)) {
        return const Failure(
          DataFailure(
            'Download completed but verification failed',
            'verification_failed',
          ),
        );
      }

      FormGearLogger.sdk(
        'Form engine $engineId downloaded and extracted successfully',
      );
      return const Success(null);
    } on Exception catch (e, s) {
      FormGearLogger.sdkError('Form engine download failed: $e');
      return Failure(
        NetworkFailure('Download failed: $e', 'download_failed'),
        s,
      );
    }
  }

  Future<void> _saveVersion(String engineId, String version) async {
    try {
      final file = await DirectoryConstants.getFormEngineVersionFile(engineId);
      await file.writeAsString(jsonEncode({'version': version}));
      FormGearLogger.sdk('Saved version $version for engine $engineId');
    } on Exception catch (e) {
      FormGearLogger.sdkError(
        'Failed to save version for engine $engineId: $e',
      );
    }
  }
}
