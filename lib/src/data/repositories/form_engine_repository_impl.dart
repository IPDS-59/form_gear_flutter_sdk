import 'package:form_gear_engine_sdk/src/core/base/result.dart';
import 'package:form_gear_engine_sdk/src/core/download/form_gear_download_manager.dart';
import 'package:form_gear_engine_sdk/src/data/datasources/form_engine_remote_data_source.dart';
import 'package:form_gear_engine_sdk/src/domain/repositories/form_engine_repository.dart';
import 'package:form_gear_engine_sdk/src/models/form_engine_response.dart';
import 'package:injectable/injectable.dart';

@LazySingleton(as: FormEngineRepository)
/// Implementation of FormEngineRepository
class FormEngineRepositoryImpl implements FormEngineRepository {
  const FormEngineRepositoryImpl({
    required FormEngineRemoteDataSource remoteDataSource,
    required FormGearDownloadManager downloadManager,
  }) : _remoteDataSource = remoteDataSource,
       _downloadManager = downloadManager;

  final FormEngineRemoteDataSource _remoteDataSource;
  final FormGearDownloadManager _downloadManager;

  @override
  Future<Result<FormEngineResponse>> checkFormEngineVersion([
    String? formEngineId,
  ]) {
    return _remoteDataSource.checkFormEngineVersion(formEngineId);
  }

  @override
  Future<bool> isFormEngineDownloaded(String engineId) {
    return _downloadManager.isEngineDownloaded(engineId);
  }
}
