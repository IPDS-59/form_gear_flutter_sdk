import 'package:form_gear_engine_sdk/src/core/base/base_use_case.dart';
import 'package:form_gear_engine_sdk/src/core/base/result.dart';
import 'package:form_gear_engine_sdk/src/domain/repositories/form_data_repository.dart';
import 'package:form_gear_engine_sdk/src/models/assignment.dart';
import 'package:injectable/injectable.dart';

/// Use case for updating assignment
/// Encapsulates business logic for assignment updates
@lazySingleton
class UpdateAssignmentUseCase
    extends BaseUseCase<Result<bool>, Assignment, FormDataRepository> {
  const UpdateAssignmentUseCase(super.repo);

  @override
  Future<Result<bool>> call(Assignment assignment) async {
    if (assignment.id.isEmpty) {
      return const Failure('Assignment ID is required');
    }

    try {
      return await repo.updateAssignment(assignment);
    } on Exception catch (e) {
      return Failure('Failed to update assignment: $e');
    }
  }
}
