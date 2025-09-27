import 'package:form_gear_engine_sdk/src/core/base/base_use_case.dart';
import 'package:form_gear_engine_sdk/src/domain/repositories/form_engine_repository.dart';
import 'package:injectable/injectable.dart';

@LazySingleton()
/// Use case for checking if form engine is downloaded
class IsFormEngineDownloadedUseCase
    extends BaseUseCase<bool, String, FormEngineRepository> {
  const IsFormEngineDownloadedUseCase(super.repo);

  @override
  Future<bool> call(String engineId) async {
    return repo.isFormEngineDownloaded(engineId);
  }
}
