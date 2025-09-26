import 'package:form_gear_engine_sdk/src/core/base/base_use_case.dart';
import 'package:form_gear_engine_sdk/src/core/base/result.dart';
import 'package:form_gear_engine_sdk/src/domain/repositories/download_repository.dart'
    hide DownloadProgressCallback;
import 'package:form_gear_engine_sdk/src/models/models.dart';
import 'package:injectable/injectable.dart';

/// Parameters for downloading template
class DownloadTemplateParams {
  const DownloadTemplateParams({
    required this.templateId,
    required this.downloadUrl,
    this.templateVersion,
    this.validationVersion,
    this.onProgress,
  });

  final String templateId;
  final String downloadUrl;
  final String? templateVersion;
  final String? validationVersion;
  final DownloadProgressCallback? onProgress;
}

@LazySingleton()
/// Use case for downloading template ZIP files
///
/// This use case handles the download logic for templates following FASIH patterns:
/// 1. Downloads ZIP file from provided URL (usually template ZIP endpoint)
/// 2. Validates download success
/// 3. Returns download result with local path
/// 4. Supports version parameters for template and validation
class DownloadTemplateUseCase
    extends
        BaseUseCase<
          Result<DownloadResult>,
          DownloadTemplateParams,
          DownloadRepository
        > {
  const DownloadTemplateUseCase(super.repo);

  @override
  Future<Result<DownloadResult>> call(DownloadTemplateParams params) async {
    try {
      // Build destination path for template following FASIH structure
      // FASIH uses Template/ (singular, capitalized) directory
      final destinationPath = 'Template/${params.templateId}';

      // Build FASIH-compatible headers
      final headers = repo.buildHeaders(url: params.downloadUrl);

      // Download template ZIP file
      final result = await repo.downloadFile(
        url: params.downloadUrl,
        destinationPath: destinationPath,
        headers: headers,
        onProgress: params.onProgress,
        timeout: const Duration(minutes: 5),
      );

      return result;
    } catch (e, stackTrace) {
      return Failure(e, stackTrace);
    }
  }
}
