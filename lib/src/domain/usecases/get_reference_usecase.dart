import 'package:form_gear_engine_sdk/src/core/base/base_use_case.dart';
import 'package:form_gear_engine_sdk/src/core/base/result.dart';
import 'package:form_gear_engine_sdk/src/domain/repositories/form_data_repository.dart';

/// Use case for loading reference/lookup data
/// Encapsulates business logic for reference data retrieval
class GetReferenceUseCase
    extends BaseUseCase<Result<String>, String, FormDataRepository> {
  const GetReferenceUseCase(super.repo);

  @override
  Future<Result<String>> call(String assignmentId) async {
    if (assignmentId.isEmpty) {
      return const Failure('Assignment ID is required');
    }

    try {
      return await repo.getReference(assignmentId);
    } on Exception catch (e) {
      return Failure('Failed to load reference: $e');
    }
  }
}
