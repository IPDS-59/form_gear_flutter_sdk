import 'package:form_gear_engine_sdk/src/core/base/base_use_case.dart';
import 'package:form_gear_engine_sdk/src/core/base/result.dart';
import 'package:form_gear_engine_sdk/src/domain/repositories/template_repository.dart';
import 'package:form_gear_engine_sdk/src/models/list_lookup_notif_response.dart';
import 'package:injectable/injectable.dart';

@LazySingleton()
/// Use case for getting lookup data by survey ID
class GetLookupDataUseCase
    extends
        BaseUseCase<
          Result<ListLookupNotifResponse>,
          String,
          TemplateRepository
        > {
  const GetLookupDataUseCase(super.repo);

  @override
  Future<Result<ListLookupNotifResponse>> call(String surveyId) async {
    return repo.getLookupData(surveyId);
  }
}
