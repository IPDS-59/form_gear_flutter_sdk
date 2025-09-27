import 'package:form_gear_engine_sdk/src/core/base/base_use_case.dart';
import 'package:form_gear_engine_sdk/src/core/base/result.dart';
import 'package:form_gear_engine_sdk/src/core/constants/directory_constants.dart';
import 'package:form_gear_engine_sdk/src/domain/repositories/zip_repository.dart';
import 'package:injectable/injectable.dart';

/// Parameters for extracting template
class ExtractTemplateParams {
  const ExtractTemplateParams({
    required this.templateId,
    required this.zipFilePath,
    this.deleteZipAfterExtraction = true,
  });

  final String templateId;
  final String zipFilePath;
  final bool deleteZipAfterExtraction;
}

@LazySingleton()
/// Use case for extracting template ZIP files
///
/// This use case handles the extraction logic for templates following
/// FASIH patterns:
/// 1. Validates ZIP file exists and is valid
/// 2. Creates target directory if needed (Template/{templateId}/)
/// 3. Extracts ZIP contents to template directory
/// 4. Optionally cleans up ZIP file after extraction
/// 5. Follows FASIH directory structure: BPS/Template/{templateId}/
class ExtractTemplateUseCase
    extends BaseUseCase<Result<void>, ExtractTemplateParams, ZipRepository> {
  const ExtractTemplateUseCase(super.repo);

  @override
  Future<Result<void>> call(ExtractTemplateParams params) async {
    try {
      // Validate ZIP file exists and is valid
      final isValidZip = await repo.isZipFile(params.zipFilePath);
      if (!isValidZip) {
        return Failure(
          Exception('Invalid ZIP file: ${params.zipFilePath}'),
          StackTrace.current,
        );
      }

      // Get target directory for template following FASIH structure
      final templateDir = await DirectoryConstants.getTemplateDirectory(
        params.templateId,
      );

      // Extract ZIP file to template directory
      final result = await repo.extractZip(
        params.zipFilePath,
        templateDir.path,
        deleteZipAfterExtraction: params.deleteZipAfterExtraction,
      );

      return result;
    } on Exception catch (e, stackTrace) {
      return Failure(e, stackTrace);
    }
  }
}
