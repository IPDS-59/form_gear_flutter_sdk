import 'package:form_gear_engine_sdk/src/core/base/base_use_case.dart';
import 'package:form_gear_engine_sdk/src/core/base/result.dart';
import 'package:form_gear_engine_sdk/src/domain/repositories/form_engine_repository.dart';
import 'package:form_gear_engine_sdk/src/models/form_engine_response.dart';
import 'package:form_gear_engine_sdk/src/models/form_engine_type.dart';
import 'package:injectable/injectable.dart';

@LazySingleton()
/// Use case for checking form engine version
class CheckFormEngineVersionUseCase
    extends
        BaseUseCase<Result<FormEngineResponse>, String?, FormEngineRepository> {
  const CheckFormEngineVersionUseCase(super.repo);

  @override
  Future<Result<FormEngineResponse>> call([String? formEngineId]) async {
    // Default to FormGear engine if no ID provided
    final engineId = formEngineId ?? FormEngineType.formGear.id.toString();
    return repo.checkFormEngineVersion(engineId);
  }
}
