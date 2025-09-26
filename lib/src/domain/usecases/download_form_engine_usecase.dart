import 'package:form_gear_engine_sdk/src/core/base/base_use_case.dart';
import 'package:form_gear_engine_sdk/src/core/base/result.dart';
import 'package:form_gear_engine_sdk/src/domain/repositories/download_repository.dart'
    hide DownloadProgressCallback;
import 'package:form_gear_engine_sdk/src/models/models.dart';
import 'package:injectable/injectable.dart';

/// Parameters for downloading form engine
class DownloadFormEngineParams {
  const DownloadFormEngineParams({
    required this.engineId,
    required this.downloadUrl,
    this.onProgress,
  });

  final String engineId;
  final String downloadUrl;
  final DownloadProgressCallback? onProgress;
}

@LazySingleton()
/// Use case for downloading form engine ZIP files
///
/// This use case handles the download logic for form engines following
/// FASIH patterns:
/// 1. Downloads ZIP file from provided URL
/// 2. Validates download success
/// 3. Returns download result with local path
class DownloadFormEngineUseCase
    extends
        BaseUseCase<
          Result<DownloadResult>,
          DownloadFormEngineParams,
          DownloadRepository
        > {
  const DownloadFormEngineUseCase(super.repo);

  @override
  Future<Result<DownloadResult>> call(DownloadFormEngineParams params) async {
    try {
      // Build destination path for form engine
      final destinationPath = 'formengine/${params.engineId}';

      // Build FASIH-compatible headers
      final headers = repo.buildHeaders(url: params.downloadUrl);

      // Download form engine ZIP file
      final result = await repo.downloadFile(
        url: params.downloadUrl,
        destinationPath: destinationPath,
        headers: headers,
        onProgress: params.onProgress,
        timeout: const Duration(minutes: 5),
      );

      return result;
    } on Exception catch (e, stackTrace) {
      return Failure(e, stackTrace);
    }
  }
}
