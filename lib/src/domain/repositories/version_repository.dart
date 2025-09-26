import 'package:form_gear_engine_sdk/src/core/base/result.dart';

/// Repository interface for version file management following FASIH patterns
abstract class VersionRepository {
  /// Save version information for a form engine
  ///
  /// Creates version.json file in FASIH format: {"version": "x.x.x"}
  ///
  /// Parameters:
  /// - [engineId]: Form engine identifier
  /// - [version]: Version string to save
  ///
  /// Returns Result<void> indicating success or failure
  Future<Result<void>> saveFormEngineVersion(String engineId, String version);

  /// Get local version of a form engine
  ///
  /// Reads version.json file and extracts version string
  /// Supports backward compatibility with plain text version files
  ///
  /// Parameters:
  /// - [engineId]: Form engine identifier
  ///
  /// Returns Result<String?> containing version string or null if not found
  Future<Result<String?>> getLocalFormEngineVersion(String engineId);

  /// Save version information for a template
  ///
  /// Creates {templateId}_template.json file in FASIH format with version info
  ///
  /// Parameters:
  /// - [templateId]: Template identifier
  /// - [version]: Version string to save
  ///
  /// Returns Result<void> indicating success or failure
  Future<Result<void>> saveTemplateVersion(String templateId, String version);

  /// Get local version of a template
  ///
  /// Reads {templateId}_template.json or version.json file to extract version
  ///
  /// Parameters:
  /// - [templateId]: Template identifier
  ///
  /// Returns Result<String?> containing version string or null if not found
  Future<Result<String?>> getLocalTemplateVersion(String templateId);

  /// Check if a form engine has any version saved locally
  ///
  /// Parameters:
  /// - [engineId]: Form engine identifier
  ///
  /// Returns true if version file exists
  Future<bool> hasFormEngineVersion(String engineId);

  /// Check if a template has any version saved locally
  ///
  /// Parameters:
  /// - [templateId]: Template identifier
  ///
  /// Returns true if version file exists
  Future<bool> hasTemplateVersion(String templateId);

  /// Delete version information for a form engine
  ///
  /// Parameters:
  /// - [engineId]: Form engine identifier
  ///
  /// Returns Result<void> indicating success or failure
  Future<Result<void>> deleteFormEngineVersion(String engineId);

  /// Delete version information for a template
  ///
  /// Parameters:
  /// - [templateId]: Template identifier
  ///
  /// Returns Result<void> indicating success or failure
  Future<Result<void>> deleteTemplateVersion(String templateId);

  /// Compare two version strings
  ///
  /// Returns:
  /// - negative value if version1 < version2
  /// - zero if version1 == version2
  /// - positive value if version1 > version2
  int compareVersions(String version1, String version2);

  /// Check if a local version is outdated compared to remote version
  ///
  /// Parameters:
  /// - [localVersion]: Current local version (can be null)
  /// - [remoteVersion]: Remote version to compare against
  ///
  /// Returns true if local version is outdated or missing
  bool isVersionOutdated(String? localVersion, String remoteVersion);
}
