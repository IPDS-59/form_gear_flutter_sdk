import 'package:form_gear_engine_sdk/src/core/base/base_use_case.dart';
import 'package:form_gear_engine_sdk/src/core/base/result.dart';
import 'package:form_gear_engine_sdk/src/domain/repositories/form_data_repository.dart';

/// Use case for loading validation rules JSON data
/// Encapsulates business logic for validation retrieval
class GetValidationUseCase
    extends BaseUseCase<Result<String>, String, FormDataRepository> {
  const GetValidationUseCase(super.repo);

  @override
  Future<Result<String>> call(String templateId) async {
    if (templateId.isEmpty) {
      return const Failure('Template ID is required');
    }

    try {
      return await repo.getValidation(templateId);
    } on Exception catch (e) {
      return Failure('Failed to load validation: $e');
    }
  }
}
