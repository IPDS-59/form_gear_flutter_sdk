import 'dart:io';
import 'package:path_provider/path_provider.dart';

/// Directory constants matching FASIH's native Android implementation
/// FASIH uses: {external_files_dir}/BPS/formengine/{formEngineId}/
class DirectoryConstants {
  DirectoryConstants._();

  /// Base BPS directory name (matches FASIH)
  static const String bpsDirectoryName = 'BPS';

  /// Form engine subdirectory name (matches FASIH)
  static const String formEngineDirectory = 'formengine';

  /// Template subdirectory name (matches FASIH: Template/ not templates/)
  static const String templatesDirectory = 'Template';

  /// Lookup data subdirectory name
  static const String lookupDirectory = 'lookup';

  /// Version file name with JSON extension (matches FASIH)
  static const String versionFileName = 'version.json';

  /// Gets the base BPS directory following FASIH's pattern
  /// On Android: {external_files_dir}/BPS/
  /// On iOS: {documents_dir}/BPS/
  /// Results are cached for sync access
  static Future<Directory> getBpsDirectory() async {
    // Return cached directory if available
    if (_cachedBpsDirectory != null && _cachedBpsDirectory!.existsSync()) {
      return _cachedBpsDirectory!;
    }

    Directory baseDir;

    if (Platform.isAndroid) {
      // Use external storage directory on Android to match FASIH
      try {
        final externalDir = await getExternalStorageDirectory();
        if (externalDir != null) {
          baseDir = Directory('${externalDir.path}/$bpsDirectoryName');
        } else {
          // Fallback to app documents if external storage is not available
          final documentsDir = await getApplicationDocumentsDirectory();
          baseDir = Directory('${documentsDir.path}/$bpsDirectoryName');
        }
      } on Exception {
        // Fallback to app documents directory
        final documentsDir = await getApplicationDocumentsDirectory();
        baseDir = Directory('${documentsDir.path}/$bpsDirectoryName');
      }
    } else {
      // iOS and other platforms use documents directory
      final documentsDir = await getApplicationDocumentsDirectory();
      baseDir = Directory('${documentsDir.path}/$bpsDirectoryName');
    }

    if (!baseDir.existsSync()) {
      baseDir.createSync(recursive: true);
    }

    // Cache the directory for sync access
    _cachedBpsDirectory = baseDir;

    return baseDir;
  }

  /// Gets the form engine directory path
  /// Returns: {bps_dir}/formengine/{engineId}/
  static Future<Directory> getFormEngineDirectory(String engineId) async {
    final bpsDir = await getBpsDirectory();
    final engineDir = Directory(
      '${bpsDir.path}/$formEngineDirectory/$engineId',
    );

    if (!engineDir.existsSync()) {
      engineDir.createSync(recursive: true);
    }

    return engineDir;
  }

  /// Gets the template directory path (FASIH-compatible)
  /// Returns: {bps_dir}/Template/{templateId}/
  static Future<Directory> getTemplateDirectory(String templateId) async {
    final bpsDir = await getBpsDirectory();
    final templateDir = Directory(
      '${bpsDir.path}/$templatesDirectory/$templateId',
    );

    if (!templateDir.existsSync()) {
      templateDir.createSync(recursive: true);
    }

    return templateDir;
  }

  // Cache for BPS directory to avoid repeated async calls
  static Directory? _cachedBpsDirectory;

  /// Initializes the BPS directory cache
  /// Should be called during SDK initialization to ensure sync methods work
  static Future<void> initialize() async {
    await getBpsDirectory();
  }

  /// Clears the cached BPS directory
  /// Useful for testing or when directory structure changes
  static void clearCache() {
    _cachedBpsDirectory = null;
  }

  /// Gets the template directory path synchronously (FASIH-compatible)
  /// Returns: {bps_dir}/Template/{templateId}/
  /// Note: This requires getBpsDirectory() to have been called first
  /// Throws StateError if BPS directory hasn't been initialized
  static Directory getTemplateDirectorySync(String templateId) {
    if (_cachedBpsDirectory == null) {
      throw StateError(
        'BPS directory not initialized. Call getBpsDirectory() first.',
      );
    }

    final templateDir = Directory(
      '${_cachedBpsDirectory!.path}/$templatesDirectory/$templateId',
    );

    if (!templateDir.existsSync()) {
      templateDir.createSync(recursive: true);
    }

    return templateDir;
  }

  /// Gets the lookup directory path
  /// Returns: {bps_dir}/lookup/{lookupId}/
  static Future<Directory> getLookupDirectory(String lookupId) async {
    final bpsDir = await getBpsDirectory();
    final lookupDir = Directory('${bpsDir.path}/$lookupDirectory/$lookupId');

    if (!lookupDir.existsSync()) {
      lookupDir.createSync(recursive: true);
    }

    return lookupDir;
  }

  /// Gets the media directory path for assignments (FASIH pattern)
  /// Returns: {bps_dir}/assignments/{assignmentId}/media/
  static Future<Directory> getMediaDirectory(String assignmentId) async {
    final bpsDir = await getBpsDirectory();
    final mediaDir = Directory(
      '${bpsDir.path}/assignments/$assignmentId/media',
    );

    if (!mediaDir.existsSync()) {
      await mediaDir.create(recursive: true);
    }

    return mediaDir;
  }

  /// Gets the version file path for a form engine
  /// Returns: {bps_dir}/formengine/{engineId}/version.json
  static Future<File> getFormEngineVersionFile(String engineId) async {
    final engineDir = await getFormEngineDirectory(engineId);
    return File('${engineDir.path}/$versionFileName');
  }

  /// Builds the full path structure matching FASIH
  /// Example: /storage/emulated/0/Android/data/com.example.app/files/BPS/formengine/1/
  static Future<String> getFormEngineFullPath(String engineId) async {
    final engineDir = await getFormEngineDirectory(engineId);
    return engineDir.path;
  }

  /// Gets the legacy FormGear data directory (for migration)
  /// This is the old path we were using: {documents_dir}/formgear_data/
  static Future<Directory> getLegacyFormGearDirectory() async {
    final documentsDir = await getApplicationDocumentsDirectory();
    return Directory('${documentsDir.path}/formgear_data');
  }

  /// Checks if migration from legacy to BPS directory is needed
  static Future<bool> needsMigration() async {
    final legacyDir = await getLegacyFormGearDirectory();
    final bpsDir = await getBpsDirectory();

    // Check if legacy directory exists and has content
    if (legacyDir.existsSync()) {
      final legacyFormEngineDir = Directory(
        '${legacyDir.path}/$formEngineDirectory',
      );
      if (legacyFormEngineDir.existsSync()) {
        // Check if BPS directory is empty or doesn't exist
        final bpsFormEngineDir = Directory(
          '${bpsDir.path}/$formEngineDirectory',
        );
        return !bpsFormEngineDir.existsSync();
      }
    }

    return false;
  }

  /// Migrates data from legacy directory to BPS directory
  static Future<void> migrateFromLegacy() async {
    final needsMigrationFlag = await needsMigration();
    if (!needsMigrationFlag) return;

    final legacyDir = await getLegacyFormGearDirectory();
    final bpsDir = await getBpsDirectory();

    // Copy all contents from legacy to BPS directory
    _copyDirectorySync(legacyDir, bpsDir);

    // Optionally delete legacy directory after successful migration
    // await legacyDir.delete(recursive: true);
  }

  /// Helper function to copy directory contents synchronously
  static void _copyDirectorySync(
    Directory source,
    Directory destination,
  ) {
    if (!source.existsSync()) return;

    if (!destination.existsSync()) {
      destination.createSync(recursive: true);
    }

    for (final entity in source.listSync()) {
      if (entity is Directory) {
        final newDir = Directory(
          '${destination.path}/${entity.path.split('/').last}',
        );
        _copyDirectorySync(entity, newDir);
      } else if (entity is File) {
        entity.copySync('${destination.path}/${entity.path.split('/').last}');
      }
    }
  }
}
