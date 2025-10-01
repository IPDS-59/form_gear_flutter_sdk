import 'dart:convert';
import 'dart:io';

import 'package:form_gear_engine_sdk/src/utils/form_data_file_manager.dart';

/// FASIH-compatible media file management helper
/// Follows exact FASIH patterns for media storage and referencing
class FasihMediaHelper {
  /// Save media file following FASIH camera result pattern
  /// Copies file to assignment media directory and updates media.json
  static Future<bool> saveMediaFile({
    required String assignmentId,
    required File sourceFile,
    required String fileName,
    required String mediaType, // 'photo', 'audio', 'signature', 'document'
  }) async {
    try {
      // Get FASIH media directory
      final mediaDir = await FormDataFileManager.getMediaDirectory(
        assignmentId,
      );
      final targetPath = '${mediaDir.path}/$fileName';

      // Copy file to media directory (FASIH pattern)
      await sourceFile.copy(targetPath);

      // Update media.json with new file reference
      await _updateMediaJson(assignmentId, fileName, targetPath, mediaType);

      return true;
    } on Exception {
      return false;
    }
  }

  /// Generate FASIH-compatible file name for media
  /// Pattern: {type}_{timestamp}_{dataKey}.{extension}
  static String generateFileName({
    required String dataKey,
    required String mediaType,
    required String extension,
  }) {
    final timestamp = DateTime.now().millisecondsSinceEpoch;
    return '${mediaType}_${timestamp}_$dataKey.$extension';
  }

  /// Update media.json file following FASIH pattern
  static Future<void> _updateMediaJson(
    String assignmentId,
    String fileName,
    String filePath,
    String mediaType,
  ) async {
    try {
      // Load existing media.json
      final mediaJsonPath = await FormDataFileManager.getAssignmentMediaPath(
        assignmentId,
      );
      final existingContent = await FormDataFileManager.readFileContent(
        mediaJsonPath,
      );

      Map<String, dynamic> mediaData;
      if (existingContent != null && existingContent.isNotEmpty) {
        mediaData = jsonDecode(existingContent) as Map<String, dynamic>;
      } else {
        // Initialize with FASIH default structure
        mediaData = {
          'dataKey': '',
          'media': <Map<String, dynamic>>[],
        };
      }

      // Ensure media array exists
      final mediaList = mediaData['media'] as List<dynamic>? ?? <dynamic>[];

      // Add new media entry following FASIH structure
      final mediaEntry = {
        'fileName': fileName,
        'filePath': filePath,
        'type': mediaType,
        'timestamp': DateTime.now().toIso8601String(),
        'size': await File(filePath).length(),
      };

      mediaList.add(mediaEntry);
      mediaData['media'] = mediaList;

      // Save updated media.json
      final updatedContent = jsonEncode(mediaData);
      await FormDataFileManager.writeFileContent(mediaJsonPath, updatedContent);
    } on Exception {
      // Ignore media.json update errors - file is still saved
    }
  }

  /// Get media file path for a given assignment and file name
  static Future<String> getMediaFilePath(
    String assignmentId,
    String fileName,
  ) async {
    final mediaDir = await FormDataFileManager.getMediaDirectory(assignmentId);
    return '${mediaDir.path}/$fileName';
  }

  /// Load media references from media.json
  static Future<List<Map<String, dynamic>>> getMediaReferences(
    String assignmentId,
  ) async {
    try {
      final mediaJsonPath = await FormDataFileManager.getAssignmentMediaPath(
        assignmentId,
      );
      final content = await FormDataFileManager.readFileContent(mediaJsonPath);

      if (content != null && content.isNotEmpty) {
        final mediaData = jsonDecode(content) as Map<String, dynamic>;
        final mediaList = mediaData['media'] as List<dynamic>? ?? <dynamic>[];
        return mediaList
            .cast<Map<String, dynamic>>()
            .map(Map<String, dynamic>.from)
            .toList();
      }
    } on Exception {
      // Return empty list on error
    }

    return <Map<String, dynamic>>[];
  }

  /// Check if media file exists in assignment
  static Future<bool> mediaFileExists(
    String assignmentId,
    String fileName,
  ) async {
    try {
      final filePath = await getMediaFilePath(assignmentId, fileName);
      return File(filePath).existsSync();
    } on Exception {
      return false;
    }
  }

  /// Delete media file and update media.json
  static Future<bool> deleteMediaFile(
    String assignmentId,
    String fileName,
  ) async {
    try {
      // Delete physical file
      final filePath = await getMediaFilePath(assignmentId, fileName);
      final file = File(filePath);
      if (file.existsSync()) {
        await file.delete();
      }

      // Update media.json to remove reference
      await _removeFromMediaJson(assignmentId, fileName);

      return true;
    } on Exception {
      return false;
    }
  }

  /// Remove media reference from media.json
  static Future<void> _removeFromMediaJson(
    String assignmentId,
    String fileName,
  ) async {
    try {
      final mediaJsonPath = await FormDataFileManager.getAssignmentMediaPath(
        assignmentId,
      );
      final content = await FormDataFileManager.readFileContent(mediaJsonPath);

      if (content != null && content.isNotEmpty) {
        final mediaData = jsonDecode(content) as Map<String, dynamic>;
        final mediaList = mediaData['media'] as List<dynamic>? ?? <dynamic>[];

        // Remove media entry with matching fileName
        mediaList.removeWhere((item) {
          if (item is Map<String, dynamic>) {
            return item['fileName'] == fileName;
          }
          return false;
        });

        mediaData['media'] = mediaList;

        // Save updated media.json
        final updatedContent = jsonEncode(mediaData);
        await FormDataFileManager.writeFileContent(
          mediaJsonPath,
          updatedContent,
        );
      }
    } on Exception {
      // Ignore removal errors
    }
  }
}
