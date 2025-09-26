import 'dart:convert';

import 'package:form_gear_engine_sdk/src/core/base/result.dart';
import 'package:form_gear_engine_sdk/src/core/constants/directory_constants.dart';
import 'package:form_gear_engine_sdk/src/domain/repositories/file_repository.dart';
import 'package:form_gear_engine_sdk/src/domain/repositories/version_repository.dart';
import 'package:form_gear_engine_sdk/src/utils/form_gear_logger.dart';
import 'package:injectable/injectable.dart';
import 'package:path/path.dart' as path;

@LazySingleton(as: VersionRepository)
/// Implementation of VersionRepository for version file management
class VersionRepositoryImpl implements VersionRepository {
  const VersionRepositoryImpl({
    required FileRepository fileRepository,
  }) : _fileRepository = fileRepository;

  final FileRepository _fileRepository;

  @override
  Future<Result<void>> saveFormEngineVersion(
    String engineId,
    String version,
  ) async {
    try {
      final versionFile = await DirectoryConstants.getFormEngineVersionFile(
        engineId,
      );
      final versionData = {'version': version};
      final jsonContent = jsonEncode(versionData);

      final writeResult = await _fileRepository.writeFileAsString(
        versionFile.path,
        jsonContent,
      );
      if (writeResult case Failure(:final error, :final stackTrace)) {
        return Failure(error, stackTrace);
      }

      FormGearLogger.sdk(
        'Saved version $version for form engine $engineId in JSON format',
      );
      return const Success(null);
    } on Exception catch (e, stackTrace) {
      FormGearLogger.sdkError(
        'Failed to save version for form engine $engineId: $e',
      );
      return Failure(e, stackTrace);
    }
  }

  @override
  Future<Result<String?>> getLocalFormEngineVersion(String engineId) async {
    try {
      final versionFile = await DirectoryConstants.getFormEngineVersionFile(
        engineId,
      );

      final existsResult = await _fileRepository.fileExists(versionFile.path);
      if (!existsResult) {
        return const Success(null);
      }

      final readResult = await _fileRepository.readFileAsString(
        versionFile.path,
      );
      if (readResult case Failure(:final error, :final stackTrace)) {
        return Failure(error, stackTrace);
      }

      final content = (readResult as Success<String>).data.trim();

      // Try to parse as JSON first (FASIH format)
      try {
        final versionJson = jsonDecode(content) as Map<String, dynamic>;
        final version = versionJson['version'] as String?;
        return Success(version);
      } on Exception catch (e) {
        // Fallback to plain text for backward compatibility
        FormGearLogger.sdk(
          'Using plain text version format for backward compatibility',
        );
        return Success(content.isEmpty ? null : content);
      }
    } on Exception catch (e, stackTrace) {
      FormGearLogger.sdkError(
        'Failed to read form engine $engineId version: $e',
      );
      return Failure(e, stackTrace);
    }
  }

  @override
  Future<Result<void>> saveTemplateVersion(
    String templateId,
    String version,
  ) async {
    try {
      final templateDir = await DirectoryConstants.getTemplateDirectory(
        templateId,
      );

      // Save in FASIH format: {templateId}_template.json
      final templateMetadataPath = path.join(
        templateDir.path,
        '${templateId}_template.json',
      );

      final templateData = {
        'version': version,
        'templateId': templateId,
        'downloadedAt': DateTime.now().toIso8601String(),
      };

      final jsonContent = jsonEncode(templateData);
      final writeResult = await _fileRepository.writeFileAsString(
        templateMetadataPath,
        jsonContent,
      );
      if (writeResult case Failure(:final error, :final stackTrace)) {
        return Failure(error, stackTrace);
      }

      FormGearLogger.sdk(
        'Saved template version $version for template $templateId',
      );
      return const Success(null);
    } on Exception catch (e, stackTrace) {
      FormGearLogger.sdkError(
        'Failed to save template version for $templateId: $e',
      );
      return Failure(e, stackTrace);
    }
  }

  @override
  Future<Result<String?>> getLocalTemplateVersion(String templateId) async {
    try {
      final templateDir = await DirectoryConstants.getTemplateDirectory(
        templateId,
      );

      // Check FASIH-style template metadata file first
      final templateMetadataPath = path.join(
        templateDir.path,
        '${templateId}_template.json',
      );

      var versionFileExists = await _fileRepository.fileExists(
        templateMetadataPath,
      );
      var versionFilePath = templateMetadataPath;

      if (!versionFileExists) {
        // Fallback to version.json
        versionFilePath = path.join(templateDir.path, 'version.json');
        versionFileExists = await _fileRepository.fileExists(versionFilePath);
      }

      if (!versionFileExists) {
        return const Success(null);
      }

      final readResult = await _fileRepository.readFileAsString(
        versionFilePath,
      );
      if (readResult case Failure(:final error, :final stackTrace)) {
        return Failure(error, stackTrace);
      }

      final content = (readResult as Success<String>).data;
      final version = _extractVersionFromJson(content);

      return Success(version);
    } on Exception catch (e, stackTrace) {
      FormGearLogger.sdkError('Error reading template version: $e');
      return Failure(e, stackTrace);
    }
  }

  @override
  Future<bool> hasFormEngineVersion(String engineId) async {
    try {
      final versionFile = await DirectoryConstants.getFormEngineVersionFile(
        engineId,
      );
      return await _fileRepository.fileExists(versionFile.path);
    } on Exception {
      return false;
    }
  }

  @override
  Future<bool> hasTemplateVersion(String templateId) async {
    try {
      final templateDir = await DirectoryConstants.getTemplateDirectory(
        templateId,
      );

      // Check for FASIH-style template metadata file
      final templateMetadataPath = path.join(
        templateDir.path,
        '${templateId}_template.json',
      );

      final exists = await _fileRepository.fileExists(templateMetadataPath);
      if (exists) return true;

      // Check for version.json fallback
      final versionPath = path.join(templateDir.path, 'version.json');
      return await _fileRepository.fileExists(versionPath);
    } on Exception {
      return false;
    }
  }

  @override
  Future<Result<void>> deleteFormEngineVersion(String engineId) async {
    try {
      final versionFile = await DirectoryConstants.getFormEngineVersionFile(
        engineId,
      );
      final deleteResult = await _fileRepository.deleteFile(versionFile.path);

      if (deleteResult case Success()) {
        FormGearLogger.sdk('Deleted version file for form engine $engineId');
      }

      return deleteResult;
    } on Exception catch (e, stackTrace) {
      FormGearLogger.sdkError('Failed to delete form engine version: $e');
      return Failure(e, stackTrace);
    }
  }

  @override
  Future<Result<void>> deleteTemplateVersion(String templateId) async {
    try {
      final templateDir = await DirectoryConstants.getTemplateDirectory(
        templateId,
      );

      // Delete FASIH-style template metadata file
      final templateMetadataPath = path.join(
        templateDir.path,
        '${templateId}_template.json',
      );

      final deleteResult = await _fileRepository.deleteFile(
        templateMetadataPath,
      );

      // Also delete version.json if exists
      final versionPath = path.join(templateDir.path, 'version.json');
      final deleteVersionResult = await _fileRepository.deleteFile(versionPath);

      // Return success if at least one deletion succeeded or no files existed
      if (deleteResult case Success()) {
        FormGearLogger.sdk('Deleted version files for template $templateId');
        return const Success(null);
      }

      if (deleteVersionResult case Success()) {
        FormGearLogger.sdk('Deleted version files for template $templateId');
        return const Success(null);
      }

      return deleteResult; // Return the first error
    } on Exception catch (e, stackTrace) {
      FormGearLogger.sdkError('Failed to delete template version: $e');
      return Failure(e, stackTrace);
    }
  }

  @override
  int compareVersions(String version1, String version2) {
    // Simple string comparison for now
    // This can be enhanced to support semantic versioning if needed
    return version1.compareTo(version2);
  }

  @override
  bool isVersionOutdated(String? localVersion, String remoteVersion) {
    // If no local version, it's outdated
    if (localVersion == null || localVersion.isEmpty) {
      return true;
    }

    // Compare versions
    return compareVersions(localVersion, remoteVersion) != 0;
  }

  /// Extract version from JSON content using regex
  String? _extractVersionFromJson(String jsonContent) {
    try {
      final versionMatch = RegExp(
        r'"version"\s*:\s*"([^"]+)"',
      ).firstMatch(jsonContent);
      return versionMatch?.group(1);
    } on Exception catch (e) {
      FormGearLogger.sdkError('Error extracting version from JSON: $e');
      return null;
    }
  }
}
