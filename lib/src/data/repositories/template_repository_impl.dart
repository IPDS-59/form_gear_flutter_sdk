import 'dart:convert';
import 'dart:io';

import 'package:form_gear_engine_sdk/src/core/base/result.dart';
import 'package:form_gear_engine_sdk/src/data/datasources/template_remote_data_source.dart';
import 'package:form_gear_engine_sdk/src/domain/repositories/template_repository.dart';
import 'package:form_gear_engine_sdk/src/models/custom_data_template.dart';
import 'package:form_gear_engine_sdk/src/models/list_lookup_notif_response.dart';
import 'package:form_gear_engine_sdk/src/utils/form_data_file_manager.dart';
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
      // Load from local cache first
      final cachedResult = await _loadCachedTemplateData(templateId);
      if (cachedResult case Success<CustomDataTemplate>(:final data)) {
        return Success(data);
      }
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
    try {
      // Check if cached template file exists
      final cacheFilePath = await _getCacheFilePath(templateId);
      final cacheFile = File(cacheFilePath);

      if (!cacheFile.existsSync()) {
        return false;
      }

      // Also check if the cache is still valid (not too old)
      final lastModified = cacheFile.lastModifiedSync();
      final now = DateTime.now();
      final cacheAge = now.difference(lastModified);

      // Consider cache valid for 24 hours
      const maxCacheAge = Duration(hours: 24);

      return cacheAge < maxCacheAge;
    } on Exception {
      return false;
    }
  }

  @override
  Future<Result<void>> cacheTemplateData(
    String templateId,
    CustomDataTemplate templateData,
  ) async {
    try {
      // Get cache file path following FASIH directory structure
      final cacheFilePath = await _getCacheFilePath(templateId);
      final cacheFile = File(cacheFilePath);

      // Ensure parent directory exists
      final parentDir = cacheFile.parent;
      if (!parentDir.existsSync()) {
        parentDir.createSync(recursive: true);
      }

      // Serialize template data to JSON
      final jsonData = templateData.toJson();
      final jsonString = jsonEncode(jsonData);

      // Write to cache file
      await cacheFile.writeAsString(jsonString);

      return const Success(null);
    } on Exception catch (e, stackTrace) {
      return Failure(e, stackTrace);
    }
  }

  /// Load cached template data from local storage
  Future<Result<CustomDataTemplate>> _loadCachedTemplateData(
    String templateId,
  ) async {
    try {
      final cacheFilePath = await _getCacheFilePath(templateId);
      final cacheFile = File(cacheFilePath);

      if (!cacheFile.existsSync()) {
        return const Failure('Cache file not found');
      }

      final jsonString = await cacheFile.readAsString();
      final jsonData = jsonDecode(jsonString) as Map<String, dynamic>;
      final templateData = CustomDataTemplate.fromJson(jsonData);

      return Success(templateData);
    } on Exception catch (e, stackTrace) {
      return Failure(e, stackTrace);
    }
  }

  /// Get cache file path for template following FASIH directory structure
  Future<String> _getCacheFilePath(String templateId) async {
    // Use template directory from FormDataFileManager
    final templateDir = await FormDataFileManager.getTemplateDirectory(
      templateId,
    );
    return '${templateDir.path}/template_cache.json';
  }
}
