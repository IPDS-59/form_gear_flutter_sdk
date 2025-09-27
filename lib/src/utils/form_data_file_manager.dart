import 'dart:io';

import 'package:form_gear_engine_sdk/src/core/constants/directory_constants.dart';

/// File management utilities for FormGear data operations
/// Handles FASIH-compatible directory structure and file operations
class FormDataFileManager {
  /// Get assignment directory following FASIH structure
  /// Pattern: {external_files_dir}/BPS/assignments/{assignmentId}/
  static Future<Directory> getAssignmentDirectory(String assignmentId) async {
    final bpsDir = await DirectoryConstants.getBpsDirectory();
    final assignmentDir = Directory('${bpsDir.path}/assignments/$assignmentId');

    if (!assignmentDir.existsSync()) {
      assignmentDir.createSync(recursive: true);
    }

    return assignmentDir;
  }

  /// Get template directory following FASIH structure
  /// Pattern: {external_files_dir}/BPS/Template/{templateId}/
  static Future<Directory> getTemplateDirectory(String templateId) async {
    final bpsDir = await DirectoryConstants.getBpsDirectory();
    final templateDir = Directory('${bpsDir.path}/Template/$templateId');

    if (!templateDir.existsSync()) {
      templateDir.createSync(recursive: true);
    }

    return templateDir;
  }

  /// Get media directory for assignment
  /// Pattern: {external_files_dir}/BPS/assignments/{assignmentId}/media/
  static Future<Directory> getMediaDirectory(String assignmentId) async {
    final assignmentDir = await getAssignmentDirectory(assignmentId);
    final mediaDir = Directory('${assignmentDir.path}/media');

    if (!mediaDir.existsSync()) {
      mediaDir.createSync(recursive: true);
    }

    return mediaDir;
  }

  /// Get lookup directory following FASIH structure
  /// Pattern: {external_files_dir}/BPS/lookup/{surveyId}/
  static Future<Directory> getLookupDirectory(String surveyId) async {
    final bpsDir = await DirectoryConstants.getBpsDirectory();
    final lookupDir = Directory('${bpsDir.path}/lookup/$surveyId');

    if (!lookupDir.existsSync()) {
      lookupDir.createSync(recursive: true);
    }

    return lookupDir;
  }

  /// Read file content safely with error handling
  static Future<String?> readFileContent(String filePath) async {
    try {
      final file = File(filePath);
      if (!file.existsSync()) {
        return null;
      }
      return await file.readAsString();
    } on Exception {
      return null;
    }
  }

  /// Write file content safely with directory creation
  static Future<bool> writeFileContent(
    String filePath,
    String content,
  ) async {
    try {
      final file = File(filePath);

      // Create parent directory if it doesn't exist
      final parentDir = file.parent;
      if (!parentDir.existsSync()) {
        parentDir.createSync(recursive: true);
      }

      await file.writeAsString(content);
      return true;
    } on Exception {
      return false;
    }
  }

  /// Check if file exists
  static Future<bool> fileExists(String filePath) async {
    try {
      return File(filePath).existsSync();
    } on Exception {
      return false;
    }
  }

  /// Get template file path
  static Future<String> getTemplateFilePath(String templateId) async {
    final templateDir = await getTemplateDirectory(templateId);
    return '${templateDir.path}/template.json';
  }

  /// Get validation file path
  static Future<String> getValidationFilePath(String templateId) async {
    final templateDir = await getTemplateDirectory(templateId);
    return '${templateDir.path}/validation.json';
  }

  /// Get assignment data file path
  static Future<String> getAssignmentDataPath(String assignmentId) async {
    final assignmentDir = await getAssignmentDirectory(assignmentId);
    return '${assignmentDir.path}/data.json';
  }

  /// Get assignment media file path
  static Future<String> getAssignmentMediaPath(String assignmentId) async {
    final assignmentDir = await getAssignmentDirectory(assignmentId);
    return '${assignmentDir.path}/media.json';
  }

  /// Get assignment principal file path
  static Future<String> getAssignmentPrincipalPath(String assignmentId) async {
    final assignmentDir = await getAssignmentDirectory(assignmentId);
    return '${assignmentDir.path}/principal.json';
  }

  /// Get assignment remark file path
  static Future<String> getAssignmentRemarkPath(String assignmentId) async {
    final assignmentDir = await getAssignmentDirectory(assignmentId);
    return '${assignmentDir.path}/remark.json';
  }

  /// Get assignment reference file path
  static Future<String> getAssignmentReferencePath(String assignmentId) async {
    final assignmentDir = await getAssignmentDirectory(assignmentId);
    return '${assignmentDir.path}/reference.json';
  }
}
