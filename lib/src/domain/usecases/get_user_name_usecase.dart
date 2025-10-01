import 'package:form_gear_engine_sdk/src/core/base/base_use_case.dart';
import 'package:form_gear_engine_sdk/src/core/base/result.dart';
import 'package:form_gear_engine_sdk/src/domain/repositories/form_data_repository.dart';

/// Use case for getting current user name
/// Encapsulates business logic for user name retrieval
class GetUserNameUseCase
    extends BaseUseCase<Result<String>, void, FormDataRepository> {
  const GetUserNameUseCase(super.repo);

  @override
  Future<Result<String>> call([void _]) async {
    try {
      return await repo.getUserName();
    } on Exception catch (e) {
      return Failure('Failed to get user name: $e');
    }
  }
}
