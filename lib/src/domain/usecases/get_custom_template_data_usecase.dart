import 'package:form_gear_engine_sdk/src/core/base/base_use_case.dart';
import 'package:form_gear_engine_sdk/src/core/base/result.dart';
import 'package:form_gear_engine_sdk/src/domain/repositories/template_repository.dart';
import 'package:form_gear_engine_sdk/src/models/custom_data_template.dart';
import 'package:injectable/injectable.dart';

/// Parameters for GetCustomTemplateDataUseCase
class GetCustomTemplateDataParams {
  const GetCustomTemplateDataParams({
    required this.templateId,
    required this.templateVersion,
  });

  final String templateId;
  final String templateVersion;
}

@LazySingleton()
/// Use case for getting custom template data
class GetCustomTemplateDataUseCase
    extends
        BaseUseCase<
          Result<CustomDataTemplate>,
          GetCustomTemplateDataParams,
          TemplateRepository
        > {
  const GetCustomTemplateDataUseCase(super.repo);

  @override
  Future<Result<CustomDataTemplate>> call(
    GetCustomTemplateDataParams param,
  ) async {
    return repo.getCustomTemplateData(
      param.templateId,
      param.templateVersion,
    );
  }
}
