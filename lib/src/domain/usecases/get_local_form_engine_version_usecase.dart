import 'package:form_gear_engine_sdk/src/core/base/base_use_case.dart';
import 'package:form_gear_engine_sdk/src/core/base/result.dart';
import 'package:form_gear_engine_sdk/src/domain/repositories/version_repository.dart';
import 'package:injectable/injectable.dart';

@LazySingleton()
/// Use case for getting local form engine version
///
/// This use case handles reading version information for form engines following FASIH patterns:
/// 1. Reads version.json file from form engine directory
/// 2. Parses JSON format: {"version": "x.x.x"}
/// 3. Supports backward compatibility with plain text version files
/// 4. Returns null if no version file exists
class GetLocalFormEngineVersionUseCase
    extends BaseUseCase<Result<String?>, String, VersionRepository> {
  const GetLocalFormEngineVersionUseCase(super.repo);

  @override
  Future<Result<String?>> call(String engineId) async {
    return repo.getLocalFormEngineVersion(engineId);
  }
}
