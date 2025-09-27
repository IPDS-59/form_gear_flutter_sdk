import 'package:form_gear_engine_sdk/src/core/base/base_use_case.dart';
import 'package:form_gear_engine_sdk/src/core/base/result.dart';
import 'package:form_gear_engine_sdk/src/domain/repositories/form_data_repository.dart';

/// Use case for loading preset/pre-defined data
/// Encapsulates business logic for preset data retrieval
class GetPresetUseCase
    extends BaseUseCase<Result<String>, String, FormDataRepository> {
  const GetPresetUseCase(super.repo);

  @override
  Future<Result<String>> call(String assignmentId) async {
    if (assignmentId.isEmpty) {
      return const Failure('Assignment ID is required');
    }

    try {
      return await repo.getPreset(assignmentId);
    } on Exception catch (e) {
      return Failure('Failed to load preset: $e');
    }
  }
}
