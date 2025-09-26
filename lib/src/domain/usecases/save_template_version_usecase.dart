import 'package:form_gear_engine_sdk/src/core/base/base_use_case.dart';
import 'package:form_gear_engine_sdk/src/core/base/result.dart';
import 'package:form_gear_engine_sdk/src/domain/repositories/version_repository.dart';
import 'package:injectable/injectable.dart';

/// Parameters for saving template version
class SaveTemplateVersionParams {
  const SaveTemplateVersionParams({
    required this.templateId,
    required this.version,
  });

  final String templateId;
  final String version;
}

@LazySingleton()
/// Use case for saving template version information
///
/// This use case handles saving version information for templates
/// following FASIH patterns:
/// 1. Creates {templateId}_template.json file in FASIH format with version info
/// 2. Stores version in the correct template directory
/// 3. Follows FASIH directory structure: BPS/Template/{templateId}/{templateId}_template.json
/// 4. Includes additional metadata like templateId and download timestamp
class SaveTemplateVersionUseCase
    extends
        BaseUseCase<
          Result<void>,
          SaveTemplateVersionParams,
          VersionRepository
        > {
  const SaveTemplateVersionUseCase(super.repo);

  @override
  Future<Result<void>> call(SaveTemplateVersionParams params) async {
    return repo.saveTemplateVersion(params.templateId, params.version);
  }
}
