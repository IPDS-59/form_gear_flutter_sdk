import 'package:form_gear_engine_sdk/src/core/base/base_use_case.dart';
import 'package:form_gear_engine_sdk/src/core/base/result.dart';
import 'package:form_gear_engine_sdk/src/domain/repositories/form_data_repository.dart';

/// Use case for loading remarks/comments data
/// Encapsulates business logic for remark retrieval
class GetRemarkUseCase
    extends BaseUseCase<Result<String>, String, FormDataRepository> {
  const GetRemarkUseCase(super.repo);

  @override
  Future<Result<String>> call(String assignmentId) async {
    if (assignmentId.isEmpty) {
      return const Failure('Assignment ID is required');
    }

    try {
      return await repo.getRemark(assignmentId);
    } on Exception catch (e) {
      return Failure('Failed to load remark: $e');
    }
  }
}
