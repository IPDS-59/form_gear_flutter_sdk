// ignore_for_file: lines_longer_than_80_chars, avoid_catches_without_on_clauses

import 'dart:convert';
import 'dart:io';

import 'package:form_gear_engine_sdk/src/core/listeners/form_data_listener.dart';
import 'package:form_gear_engine_sdk/src/core/listeners/save_submit_data.dart';
import 'package:form_gear_engine_sdk/src/core/listeners/save_submit_result.dart';
import 'package:form_gear_engine_sdk/src/utils/form_gear_logger.dart';
import 'package:path_provider/path_provider.dart';

/// Example FormDataListener implementation that saves data to the local file system
///
/// This implementation follows FASIH's file structure patterns and demonstrates
/// how to handle save/submit operations with proper file management, encryption,
/// and error handling.
///
/// Features:
/// - FASIH-compatible directory structure (BPS/assignments/{assignmentId}/)
/// - Separate files for each data type (data.json, remark.json, etc.)
/// - Optional encryption support based on assignment configuration
/// - Proper error handling and logging
/// - File backup and versioning for safety
///
/// Usage:
/// ```dart
/// final listener = FileSystemFormDataListener(
///   enableEncryption: true,
///   enableBackups: true,
///   baseDirectory: await getApplicationDocumentsDirectory(),
/// );
///
/// FormGearSDK.instance.setFormDataListener(listener);
/// ```
class FileSystemFormDataListener extends UnifiedFormDataListener {
  FileSystemFormDataListener({
    Directory? baseDirectory,
    this.enableEncryption = false,
    this.enableBackups = true,
    this.maxBackups = 5,
    this.compressionLevel = 6,
  }) : _baseDirectory = baseDirectory;

  /// Base directory for storing form data
  /// If null, will use application documents directory
  Directory? _baseDirectory;

  /// Whether to encrypt sensitive data based on assignment configuration
  final bool enableEncryption;

  /// Whether to create backup files before overwriting
  final bool enableBackups;

  /// Maximum number of backup files to keep
  final int maxBackups;

  /// Compression level for JSON files (0-9, where 9 is max compression)
  final int compressionLevel;

  /// Cache for base directory to avoid repeated async calls
  Directory? _cachedBaseDirectory;

  @override
  Future<SaveSubmitResult> handleSaveOrSubmit(SaveSubmitData data) async {
    try {
      FormGearLogger.sdk(
        'FileSystemFormDataListener: Handling ${data.engineType.displayName} '
        'save/submit for assignment ${data.assignmentId} (flag: ${data.flag})',
      );

      // Get base directory
      final baseDir = await _getBaseDirectory();

      // Create assignment directory following FASIH structure
      final assignmentDir = Directory(
        '${baseDir.path}/${data.getFasihDirectoryPath()}',
      );
      if (!assignmentDir.existsSync()) {
        assignmentDir.createSync(recursive: true);
        FormGearLogger.sdk(
          'Created assignment directory: ${assignmentDir.path}',
        );
      }

      // Save all data files
      final savedFiles = <String>[];
      final fileData = data.getFileData();

      for (final entry in fileData.entries) {
        final fileName = entry.key;
        final fileContent = entry.value;

        try {
          final filePath = await _saveDataFile(
            assignmentDir,
            fileName,
            fileContent,
            data,
          );
          savedFiles.add(filePath);
          FormGearLogger.sdk('Saved $fileName to $filePath');
        } catch (e) {
          FormGearLogger.sdkError('Failed to save $fileName: $e');
          // Continue saving other files even if one fails
        }
      }

      // Save metadata
      await _saveMetadata(assignmentDir, data, savedFiles);

      // Generate submission ID
      final submissionId = _generateSubmissionId(data);

      FormGearLogger.sdk(
        'FileSystemFormDataListener: Successfully saved ${savedFiles.length} files '
        'for assignment ${data.assignmentId}',
      );

      return SaveSubmitResult.success(
        submissionId: submissionId,
        metadata: {
          'saved_files': savedFiles,
          'assignment_directory': assignmentDir.path,
          'encryption_enabled': enableEncryption && data.shouldEncrypt,
          'backup_enabled': enableBackups,
          'total_files': savedFiles.length,
        },
      );
    } catch (e, stackTrace) {
      FormGearLogger.sdkError(
        'FileSystemFormDataListener: Failed to save data for assignment ${data.assignmentId}: $e',
      );
      return SaveSubmitResult.fromException(e, stackTrace);
    }
  }

  @override
  Future<void> onSaveOrSubmitError(
    SaveSubmitData data,
    Object error,
    StackTrace? stackTrace,
  ) async {
    FormGearLogger.sdkError(
      'FileSystemFormDataListener: Error occurred for assignment ${data.assignmentId}: $error',
    );

    // Log additional context for debugging
    FormGearLogger.sdkError(
      'Assignment context: templateId=${data.templateId}, '
      'surveyId=${data.surveyId}, flag=${data.flag}, '
      'engineType=${data.engineType.displayName}',
    );

    if (stackTrace != null) {
      FormGearLogger.sdkError('Stack trace: $stackTrace');
    }
  }

  @override
  Future<void> onSaveOrSubmitStarted(SaveSubmitData data) async {
    FormGearLogger.sdk(
      'FileSystemFormDataListener: Starting save/submit for assignment ${data.assignmentId}',
    );
  }

  @override
  Future<void> onSaveOrSubmitCompleted(
    SaveSubmitData data,
    SaveSubmitResult result,
  ) async {
    if (result.isSuccess) {
      FormGearLogger.sdk(
        'FileSystemFormDataListener: Completed save/submit for assignment ${data.assignmentId} '
        'with submission ID: ${result.submissionId}',
      );
    } else {
      FormGearLogger.sdkError(
        'FileSystemFormDataListener: Save/submit failed for assignment ${data.assignmentId}: '
        '${result.error}',
      );
    }
  }

  /// Gets the base directory for storing form data
  Future<Directory> _getBaseDirectory() async {
    if (_cachedBaseDirectory != null) {
      return _cachedBaseDirectory!;
    }

    if (_baseDirectory != null) {
      _cachedBaseDirectory = _baseDirectory;
    } else {
      // Use application documents directory as default
      _cachedBaseDirectory = await getApplicationDocumentsDirectory();
    }

    return _cachedBaseDirectory!;
  }

  /// Saves a data file with optional encryption and backup
  Future<String> _saveDataFile(
    Directory assignmentDir,
    String fileName,
    String content,
    SaveSubmitData data,
  ) async {
    final filePath = '${assignmentDir.path}/$fileName';
    final file = File(filePath);

    // Create backup if enabled and file exists
    if (enableBackups && file.existsSync()) {
      await _createBackup(file, data);
    }

    // Process content (encryption, compression, etc.)
    var processedContent = content;

    if (enableEncryption &&
        data.shouldEncrypt &&
        _shouldEncryptFile(fileName)) {
      // Note: In a real implementation, you would use proper encryption
      // This is just a placeholder for demonstration
      processedContent = _encryptContent(content, data);
    }

    // Optionally format JSON for readability
    if (fileName.endsWith('.json')) {
      try {
        final jsonData = jsonDecode(processedContent);
        processedContent = const JsonEncoder.withIndent('  ').convert(jsonData);
      } catch (e) {
        // If JSON parsing fails, use original content
        FormGearLogger.sdkError('Failed to format JSON for $fileName: $e');
      }
    }

    // Write to file
    await file.writeAsString(processedContent);

    return filePath;
  }

  /// Creates a backup of an existing file
  Future<void> _createBackup(File originalFile, SaveSubmitData data) async {
    try {
      final timestamp = DateTime.now().millisecondsSinceEpoch;
      final backupPath = '${originalFile.path}.backup.$timestamp';
      await originalFile.copy(backupPath);

      // Clean up old backups
      await _cleanupOldBackups(originalFile.parent, originalFile.path);

      FormGearLogger.sdk('Created backup: $backupPath');
    } catch (e) {
      FormGearLogger.sdkError(
        'Failed to create backup for ${originalFile.path}: $e',
      );
      // Don't fail the main operation if backup fails
    }
  }

  /// Cleans up old backup files to maintain the maxBackups limit
  Future<void> _cleanupOldBackups(
    Directory directory,
    String originalFilePath,
  ) async {
    try {
      final backupFiles = directory
          .listSync()
          .whereType<File>()
          .where((file) => file.path.startsWith('$originalFilePath.backup.'))
          .toList();

      if (backupFiles.length > maxBackups) {
        // Sort by creation time (oldest first) and delete excess files
        backupFiles.sort(
          (a, b) => a.statSync().modified.compareTo(b.statSync().modified),
        );

        final filesToDelete = backupFiles.take(backupFiles.length - maxBackups);
        for (final file in filesToDelete) {
          await file.delete();
          FormGearLogger.sdk('Deleted old backup: ${file.path}');
        }
      }
    } catch (e) {
      FormGearLogger.sdkError('Failed to cleanup old backups: $e');
    }
  }

  /// Saves metadata about the save/submit operation
  Future<void> _saveMetadata(
    Directory assignmentDir,
    SaveSubmitData data,
    List<String> savedFiles,
  ) async {
    try {
      final metadata = {
        'assignment_id': data.assignmentId,
        'template_id': data.templateId,
        'survey_id': data.surveyId,
        'engine_type': data.engineType.displayName,
        'flag': data.flag,
        'timestamp':
            data.timestamp?.toIso8601String() ??
            DateTime.now().toIso8601String(),
        'saved_files': savedFiles,
        'encryption_enabled': enableEncryption && data.shouldEncrypt,
        'backup_enabled': enableBackups,
        'config': {
          'lookup_mode': data.config.lookupMode.name,
          'form_mode': data.config.formMode.name,
          'client_mode': data.config.clientMode.name,
          'is_encrypted': data.config.isEncrypted,
          'offline_capable': data.config.offlineCapable,
        },
        'custom_metadata': data.metadata,
      };

      final metadataFile = File('${assignmentDir.path}/metadata.json');
      final metadataJson = const JsonEncoder.withIndent('  ').convert(metadata);
      await metadataFile.writeAsString(metadataJson);

      FormGearLogger.sdk('Saved metadata to ${metadataFile.path}');
    } catch (e) {
      FormGearLogger.sdkError('Failed to save metadata: $e');
    }
  }

  /// Determines if a file should be encrypted based on its type
  bool _shouldEncryptFile(String fileName) {
    // Typically, data.json and principal.json contain sensitive information
    const sensitiveFiles = ['data.json', 'principal.json'];
    return sensitiveFiles.contains(fileName);
  }

  /// Encrypts content (placeholder implementation)
  String _encryptContent(String content, SaveSubmitData data) {
    // In a real implementation, you would use proper encryption algorithms
    // This is just a placeholder for demonstration purposes
    FormGearLogger.sdk(
      'Encrypting content for assignment ${data.assignmentId}',
    );

    // Placeholder: Base64 encoding (NOT real encryption!)
    final bytes = utf8.encode(content);
    return base64Encode(bytes);
  }

  /// Generates a unique submission ID
  String _generateSubmissionId(SaveSubmitData data) {
    final timestamp = DateTime.now().millisecondsSinceEpoch;
    final prefix = data.isFormGear ? 'fg' : 'ff';
    final flag = data.flag.toLowerCase();

    return '${prefix}_${data.assignmentId}_${flag}_$timestamp';
  }

  /// Sets a custom base directory for storing form data
  void setBaseDirectory(Directory directory) {
    _baseDirectory = directory;
    _cachedBaseDirectory = null; // Clear cache to force recomputation
  }

  /// Gets statistics about stored form data
  Future<Map<String, dynamic>> getStorageStatistics() async {
    try {
      final baseDir = await _getBaseDirectory();
      final bpsDir = Directory('${baseDir.path}/BPS/assignments');

      if (!bpsDir.existsSync()) {
        return {
          'total_assignments': 0,
          'total_files': 0,
          'total_size_bytes': 0,
        };
      }

      var totalAssignments = 0;
      var totalFiles = 0;
      var totalSizeBytes = 0;

      await for (final entity in bpsDir.list(recursive: true)) {
        if (entity is Directory) {
          // Check if this is an assignment directory (contains assignment files)
          final hasAssignmentFiles = entity.listSync().whereType<File>().any(
            (file) => file.path.endsWith('.json'),
          );

          if (hasAssignmentFiles) {
            totalAssignments++;
          }
        } else if (entity is File) {
          totalFiles++;
          totalSizeBytes += entity.lengthSync();
        }
      }

      return {
        'total_assignments': totalAssignments,
        'total_files': totalFiles,
        'total_size_bytes': totalSizeBytes,
        'base_directory': baseDir.path,
      };
    } catch (e) {
      FormGearLogger.sdkError('Failed to get storage statistics: $e');
      return {'error': e.toString()};
    }
  }

  /// Cleans up old assignment data based on age or assignment status
  Future<void> cleanupOldData({
    Duration? olderThan,
    List<String>? excludeAssignmentIds,
  }) async {
    try {
      final baseDir = await _getBaseDirectory();
      final bpsDir = Directory('${baseDir.path}/BPS/assignments');

      if (!bpsDir.existsSync()) {
        return;
      }

      final cutoffTime = olderThan != null
          ? DateTime.now().subtract(olderThan)
          : null;

      var deletedAssignments = 0;
      var deletedFiles = 0;

      await for (final entity in bpsDir.list()) {
        if (entity is Directory) {
          final assignmentId = entity.path.split('/').last;

          // Skip excluded assignments
          if (excludeAssignmentIds?.contains(assignmentId) ?? false) {
            continue;
          }

          // Check if directory is old enough to delete
          final stat = entity.statSync();
          if (cutoffTime != null && stat.modified.isAfter(cutoffTime)) {
            continue;
          }

          // Delete the assignment directory
          final filesInDir = entity.listSync().length;
          await entity.delete(recursive: true);

          deletedAssignments++;
          deletedFiles += filesInDir;

          FormGearLogger.sdk('Deleted old assignment data: $assignmentId');
        }
      }

      FormGearLogger.sdk(
        'Cleanup completed: deleted $deletedAssignments assignments, $deletedFiles files',
      );
    } catch (e) {
      FormGearLogger.sdkError('Failed to cleanup old data: $e');
    }
  }
}
