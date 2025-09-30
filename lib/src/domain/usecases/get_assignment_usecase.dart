import 'package:form_gear_engine_sdk/src/core/base/base_use_case.dart';
import 'package:form_gear_engine_sdk/src/core/base/result.dart';
import 'package:form_gear_engine_sdk/src/domain/repositories/form_data_repository.dart';
import 'package:form_gear_engine_sdk/src/models/assignment.dart';
import 'package:injectable/injectable.dart';

/// Use case for getting assignment by ID
/// Encapsulates business logic for assignment retrieval
@lazySingleton
class GetAssignmentUseCase
    extends BaseUseCase<Result<Assignment>, String, FormDataRepository> {
  const GetAssignmentUseCase(super.repo);

  @override
  Future<Result<Assignment>> call(String assignmentId) async {
    if (assignmentId.isEmpty) {
      return const Failure('Assignment ID is required');
    }

    try {
      return await repo.getAssignment(assignmentId);
    } on Exception catch (e) {
      return Failure('Failed to get assignment: $e');
    }
  }
}
