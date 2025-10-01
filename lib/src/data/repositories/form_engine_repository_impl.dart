import 'dart:io';

import 'package:form_gear_engine_sdk/src/core/base/result.dart';
import 'package:form_gear_engine_sdk/src/core/constants/directory_constants.dart';
import 'package:form_gear_engine_sdk/src/data/datasources/form_engine_remote_data_source.dart';
import 'package:form_gear_engine_sdk/src/domain/repositories/form_engine_repository.dart';
import 'package:form_gear_engine_sdk/src/models/form_engine_response.dart';
import 'package:injectable/injectable.dart';

@LazySingleton(as: FormEngineRepository)

/// Implementation of FormEngineRepository
class FormEngineRepositoryImpl implements FormEngineRepository {
  const FormEngineRepositoryImpl({
    required FormEngineRemoteDataSource remoteDataSource,
  }) : _remoteDataSource = remoteDataSource;

  final FormEngineRemoteDataSource _remoteDataSource;

  @override
  Future<Result<FormEngineResponse>> checkFormEngineVersion([
    String? formEngineId,
  ]) {
    return _remoteDataSource.checkFormEngineVersion(formEngineId);
  }

  @override
  Future<bool> isFormEngineDownloaded(String engineId) async {
    try {
      final engineDir = await DirectoryConstants.getFormEngineDirectory(engineId);
      final versionFile = File('${engineDir.path}/version.json');

      // Check if engine directory exists and contains version file
      final exists = await engineDir.exists() && await versionFile.exists();
      return exists;
    } catch (e) {
      return false;
    }
  }
}
