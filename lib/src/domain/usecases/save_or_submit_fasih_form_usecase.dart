import 'package:form_gear_engine_sdk/src/core/base/base_use_case.dart';
import 'package:form_gear_engine_sdk/src/core/base/result.dart';
import 'package:form_gear_engine_sdk/src/domain/repositories/form_data_repository.dart';

/// Parameters for SaveOrSubmitFasihFormUseCase
class SaveOrSubmitFasihFormParams {
  const SaveOrSubmitFasihFormParams({
    required this.assignmentId,
    required this.data,
    required this.remark,
    required this.principal,
    required this.flag,
  });

  final String assignmentId;
  final String data;
  final String remark;
  final String principal;
  final String flag;
}

/// Use case for saving FASIH form data (simplified version)
/// Encapsulates business logic for FASIH form persistence
class SaveOrSubmitFasihFormUseCase
    extends
        BaseUseCase<
          Result<bool>,
          SaveOrSubmitFasihFormParams,
          FormDataRepository
        > {
  const SaveOrSubmitFasihFormUseCase(super.repo);

  @override
  Future<Result<bool>> call(SaveOrSubmitFasihFormParams params) async {
    if (params.assignmentId.isEmpty) {
      return const Failure('Assignment ID is required');
    }

    if (params.data.isEmpty) {
      return const Failure('Form data is required');
    }

    try {
      return await repo.saveOrSubmitFasihForm(
        assignmentId: params.assignmentId,
        data: params.data,
        remark: params.remark,
        principal: params.principal,
        flag: params.flag,
      );
    } on Exception catch (e) {
      return Failure('Failed to save FASIH form: $e');
    }
  }
}
