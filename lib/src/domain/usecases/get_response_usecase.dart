import 'package:form_gear_engine_sdk/src/core/base/base_use_case.dart';
import 'package:form_gear_engine_sdk/src/core/base/result.dart';
import 'package:form_gear_engine_sdk/src/domain/repositories/form_data_repository.dart';

/// Use case for loading previous response data
/// Encapsulates business logic for response retrieval
class GetResponseUseCase
    extends BaseUseCase<Result<String>, String, FormDataRepository> {
  const GetResponseUseCase(super.repo);

  @override
  Future<Result<String>> call(String assignmentId) async {
    if (assignmentId.isEmpty) {
      return const Failure('Assignment ID is required');
    }

    try {
      return await repo.getResponse(assignmentId);
    } on Exception catch (e) {
      return Failure('Failed to load response: $e');
    }
  }
}
