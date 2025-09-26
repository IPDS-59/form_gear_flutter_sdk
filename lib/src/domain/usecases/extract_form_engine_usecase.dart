import 'package:form_gear_engine_sdk/src/core/base/base_use_case.dart';
import 'package:form_gear_engine_sdk/src/core/base/result.dart';
import 'package:form_gear_engine_sdk/src/core/constants/directory_constants.dart';
import 'package:form_gear_engine_sdk/src/domain/repositories/zip_repository.dart';
import 'package:injectable/injectable.dart';

/// Parameters for extracting form engine
class ExtractFormEngineParams {
  const ExtractFormEngineParams({
    required this.engineId,
    required this.zipFilePath,
    this.deleteZipAfterExtraction = true,
  });

  final String engineId;
  final String zipFilePath;
  final bool deleteZipAfterExtraction;
}

@LazySingleton()
/// Use case for extracting form engine ZIP files
///
/// This use case handles the extraction logic for form engines following
/// FASIH patterns:
/// 1. Validates ZIP file exists and is valid
/// 2. Creates target directory if needed
/// 3. Extracts ZIP contents to form engine directory
/// 4. Optionally cleans up ZIP file after extraction
class ExtractFormEngineUseCase
    extends BaseUseCase<Result<void>, ExtractFormEngineParams, ZipRepository> {
  const ExtractFormEngineUseCase(super.repo);

  @override
  Future<Result<void>> call(ExtractFormEngineParams params) async {
    try {
      // Validate ZIP file exists and is valid
      final isValidZip = await repo.isZipFile(params.zipFilePath);
      if (!isValidZip) {
        return Failure(
          Exception('Invalid ZIP file: ${params.zipFilePath}'),
          StackTrace.current,
        );
      }

      // Get target directory for form engine following FASIH structure
      final engineDir = await DirectoryConstants.getFormEngineDirectory(
        params.engineId,
      );

      // Extract ZIP file to form engine directory
      final result = await repo.extractZip(
        params.zipFilePath,
        engineDir.path,
        deleteZipAfterExtraction: params.deleteZipAfterExtraction,
      );

      return result;
    } on Exception catch (e, stackTrace) {
      return Failure(e, stackTrace);
    }
  }
}
