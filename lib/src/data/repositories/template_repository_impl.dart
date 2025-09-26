import 'package:form_gear_engine_sdk/src/core/base/result.dart';
import 'package:form_gear_engine_sdk/src/data/datasources/template_remote_data_source.dart';
import 'package:form_gear_engine_sdk/src/domain/repositories/template_repository.dart';
import 'package:form_gear_engine_sdk/src/models/custom_data_template.dart';
import 'package:form_gear_engine_sdk/src/models/list_lookup_notif_response.dart';
import 'package:injectable/injectable.dart';

@LazySingleton(as: TemplateRepository)
/// Implementation of TemplateRepository
class TemplateRepositoryImpl implements TemplateRepository {
  const TemplateRepositoryImpl({
    required TemplateRemoteDataSource remoteDataSource,
  }) : _remoteDataSource = remoteDataSource;

  final TemplateRemoteDataSource _remoteDataSource;

  @override
  Future<Result<CustomDataTemplate>> getCustomTemplateData(
    String templateId,
    String templateVersion,
  ) async {
    // First check if data is available offline
    final isOfflineAvailable = await isTemplateDataAvailable(templateId);

    if (isOfflineAvailable) {
      // TODO(sdk): Implement offline data retrieval from local storage
      // For now, always fetch from remote
    }

    // Fetch from remote data source
    final result = await _remoteDataSource.getCustomTemplateData(
      templateId,
      templateVersion,
    );

    // Cache the data if successful
    if (result case Success<CustomDataTemplate>(:final data)) {
      await cacheTemplateData(templateId, data);
    }

    return result;
  }

  @override
  Future<Result<ListLookupNotifResponse>> getLookupData(String surveyId) {
    return _remoteDataSource.getLookupData(surveyId);
  }

  @override
  Future<bool> isTemplateDataAvailable(String templateId) async {
    // TODO(sdk): Implement offline availability check
    // Check if template data exists in local storage/cache
    return false;
  }

  @override
  Future<Result<void>> cacheTemplateData(
    String templateId,
    CustomDataTemplate templateData,
  ) async {
    try {
      // TODO(sdk): Implement caching to local storage
      // This could use SharedPreferences, SQLite, Hive, etc.
      return const Success(null);
    } catch (e, stackTrace) {
      return Failure(e, stackTrace);
    }
  }
}
