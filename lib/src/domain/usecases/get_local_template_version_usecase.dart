import 'package:form_gear_engine_sdk/src/core/base/base_use_case.dart';
import 'package:form_gear_engine_sdk/src/core/base/result.dart';
import 'package:form_gear_engine_sdk/src/domain/repositories/version_repository.dart';
import 'package:injectable/injectable.dart';

@LazySingleton()
/// Use case for getting local template version
///
/// This use case handles reading version information for templates
/// following FASIH patterns:
/// 1. Reads {templateId}_template.json file from template directory
/// 2. Falls back to version.json if template-specific file not found
/// 3. Parses JSON format and extracts version string
/// 4. Returns null if no version file exists
/// 5. Follows FASIH directory structure: BPS/Template/{templateId}/
class GetLocalTemplateVersionUseCase
    extends BaseUseCase<Result<String?>, String, VersionRepository> {
  const GetLocalTemplateVersionUseCase(super.repo);

  @override
  Future<Result<String?>> call(String templateId) async {
    return repo.getLocalTemplateVersion(templateId);
  }
}
