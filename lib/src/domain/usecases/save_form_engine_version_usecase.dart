import 'package:form_gear_engine_sdk/src/core/base/base_use_case.dart';
import 'package:form_gear_engine_sdk/src/core/base/result.dart';
import 'package:form_gear_engine_sdk/src/domain/repositories/version_repository.dart';
import 'package:injectable/injectable.dart';

/// Parameters for saving form engine version
class SaveFormEngineVersionParams {
  const SaveFormEngineVersionParams({
    required this.engineId,
    required this.version,
  });

  final String engineId;
  final String version;
}

@LazySingleton()
/// Use case for saving form engine version information
///
/// This use case handles saving version information for form engines
/// following FASIH patterns:
/// 1. Creates version.json file in FASIH format: {"version": "x.x.x"}
/// 2. Stores version in the correct form engine directory
/// 3. Follows FASIH directory structure: BPS/formengine/{engineId}/version.json
class SaveFormEngineVersionUseCase
    extends
        BaseUseCase<
          Result<void>,
          SaveFormEngineVersionParams,
          VersionRepository
        > {
  const SaveFormEngineVersionUseCase(super.repo);

  @override
  Future<Result<void>> call(SaveFormEngineVersionParams params) async {
    return repo.saveFormEngineVersion(params.engineId, params.version);
  }
}
