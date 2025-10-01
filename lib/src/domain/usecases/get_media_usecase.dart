import 'package:form_gear_engine_sdk/src/core/base/base_use_case.dart';
import 'package:form_gear_engine_sdk/src/core/base/result.dart';
import 'package:form_gear_engine_sdk/src/domain/repositories/form_data_repository.dart';

/// Use case for loading media file references
/// Encapsulates business logic for media metadata retrieval
class GetMediaUseCase
    extends BaseUseCase<Result<String>, String, FormDataRepository> {
  const GetMediaUseCase(super.repo);

  @override
  Future<Result<String>> call(String assignmentId) async {
    if (assignmentId.isEmpty) {
      return const Failure('Assignment ID is required');
    }

    try {
      return await repo.getMedia(assignmentId);
    } on Exception catch (e) {
      return Failure('Failed to load media: $e');
    }
  }
}
