import 'package:form_gear_engine_sdk/src/core/base/base_use_case.dart';
import 'package:form_gear_engine_sdk/src/core/base/result.dart';
import 'package:form_gear_engine_sdk/src/domain/repositories/form_data_repository.dart';

/// Parameters for SaveOrSubmitUseCase
class SaveOrSubmitParams {
  const SaveOrSubmitParams({
    required this.assignmentId,
    required this.data,
    required this.remark,
    required this.principal,
    required this.reference,
    required this.media,
    required this.flag,
  });

  final String assignmentId;
  final String data;
  final String remark;
  final String principal;
  final String reference;
  final String media;
  final String flag;
}

/// Use case for saving or submitting form response data
/// Encapsulates business logic for form data persistence
class SaveOrSubmitUseCase
    extends BaseUseCase<Result<bool>, SaveOrSubmitParams, FormDataRepository> {
  const SaveOrSubmitUseCase(super.repo);

  @override
  Future<Result<bool>> call(SaveOrSubmitParams params) async {
    if (params.assignmentId.isEmpty) {
      return const Failure('Assignment ID is required');
    }

    if (params.data.isEmpty) {
      return const Failure('Form data is required');
    }

    try {
      return await repo.saveOrSubmit(
        assignmentId: params.assignmentId,
        data: params.data,
        remark: params.remark,
        principal: params.principal,
        reference: params.reference,
        media: params.media,
        flag: params.flag,
      );
    } on Exception catch (e) {
      return Failure('Failed to save form: $e');
    }
  }
}
