import 'package:form_gear_engine_sdk/src/core/base/base_use_case.dart';
import 'package:form_gear_engine_sdk/src/core/base/result.dart';
import 'package:form_gear_engine_sdk/src/domain/repositories/form_data_repository.dart';

/// Use case for getting current user role
class GetUserRoleUseCase
    extends BaseUseCase<Result<String>, void, FormDataRepository> {
  const GetUserRoleUseCase(super.repo);

  @override
  Future<Result<String>> call([void _]) async {
    try {
      return await repo.getUserRole();
    } on Exception catch (e) {
      return Failure('Failed to get user role: $e');
    }
  }
}

/// Use case for getting form mode
class GetFormModeUseCase
    extends BaseUseCase<Result<String>, void, FormDataRepository> {
  const GetFormModeUseCase(super.repo);

  @override
  Future<Result<String>> call([void _]) async {
    try {
      return await repo.getFormMode();
    } on Exception catch (e) {
      return Failure('Failed to get form mode: $e');
    }
  }
}

/// Use case for getting whether this is a new form
class GetIsNewUseCase
    extends BaseUseCase<Result<String>, void, FormDataRepository> {
  const GetIsNewUseCase(super.repo);

  @override
  Future<Result<String>> call([void _]) async {
    try {
      return await repo.getIsNew();
    } on Exception catch (e) {
      return Failure('Failed to get isNew status: $e');
    }
  }
}

/// Use case for getting principal collection data
class GetPrincipalCollectionUseCase
    extends BaseUseCase<Result<String>, void, FormDataRepository> {
  const GetPrincipalCollectionUseCase(super.repo);

  @override
  Future<Result<String>> call([void _]) async {
    try {
      return await repo.getPrincipalCollection();
    } on Exception catch (e) {
      return Failure('Failed to get principal collection: $e');
    }
  }
}

/// Use case for getting user role for petugas
class GetRolePetugasUseCase
    extends BaseUseCase<Result<String>, void, FormDataRepository> {
  const GetRolePetugasUseCase(super.repo);

  @override
  Future<Result<String>> call([void _]) async {
    try {
      return await repo.getRolePetugas();
    } on Exception catch (e) {
      return Failure('Failed to get role petugas: $e');
    }
  }
}
