import 'dart:io';
import 'dart:typed_data';

import 'package:archive/archive.dart';
import 'package:form_gear_engine_sdk/src/utils/form_gear_logger.dart';

/// ZIP file extraction utility inspired by FASIH's ZipHelper
/// Provides functionality for extracting ZIP files with error handling and
/// logging
class ZipHelper {
  ZipHelper._();

  /// Extracts a ZIP file to the specified directory
  ///
  /// Parameters:
  /// - [zipFilePath]: Path to the ZIP file to extract
  /// - [extractToPath]: Directory path where contents should be extracted
  /// - [deleteZipAfterExtraction]: Whether to delete the ZIP file after
  ///   successful extraction
  ///
  /// Returns:
  /// - `true` if extraction was successful
  /// - `false` if extraction failed
  ///
  /// Example:
  /// ```dart
  /// final success = await ZipHelper.extractZip(
  ///   '/path/to/template.zip',
  ///   '/path/to/extract/directory',
  ///   deleteZipAfterExtraction: true,
  /// );
  /// ```
  static Future<bool> extractZip(
    String zipFilePath,
    String extractToPath, {
    bool deleteZipAfterExtraction = false,
  }) async {
    try {
      FormGearLogger.sdk(
        'Starting ZIP extraction: $zipFilePath -> $extractToPath',
      );

      final zipFile = File(zipFilePath);
      if (!zipFile.existsSync()) {
        FormGearLogger.sdkError('ZIP file not found: $zipFilePath');
        return false;
      }

      // Read ZIP file bytes
      final zipBytes = zipFile.readAsBytesSync();

      // Decode the ZIP archive
      final archive = ZipDecoder().decodeBytes(zipBytes);

      // Create extraction directory if it doesn't exist
      final extractDir = Directory(extractToPath);
      if (!extractDir.existsSync()) {
        extractDir.createSync(recursive: true);
        FormGearLogger.sdk('Created extraction directory: $extractToPath');
      }

      // Detect if all files are under a single root directory (FASIH pattern)
      String? commonRootDir;
      var hasCommonRoot = true;

      // First pass: detect common root directory
      for (final file in archive) {
        // Skip directory entries themselves
        if (file.isDirectory) continue;

        if (file.name.contains('/')) {
          final rootDir = file.name.split('/').first;
          if (commonRootDir == null) {
            commonRootDir = rootDir;
          } else if (commonRootDir != rootDir) {
            hasCommonRoot = false;
            break;
          }
        } else {
          // File at root level, no common directory
          hasCommonRoot = false;
          break;
        }
      }

      // Extract all files from the archive
      var extractedCount = 0;
      for (final file in archive) {
        // Skip the root directory entry itself BEFORE processing
        if (hasCommonRoot &&
            commonRootDir != null &&
            file.name == '$commonRootDir/') {
          continue;
        }

        var filename = file.name;

        // Strip common root directory if detected (FASIH pattern)
        if (hasCommonRoot && commonRootDir != null) {
          if (filename.startsWith('$commonRootDir/')) {
            filename = filename.substring(commonRootDir.length + 1);
          }
        }

        // Skip empty filenames after stripping
        if (filename.isEmpty) continue;

        final filePath = '$extractToPath${Platform.pathSeparator}$filename';

        if (file.isFile) {
          // Extract file
          final outFile = File(filePath);

          // Create parent directories if they don't exist
          final parentDir = outFile.parent;
          if (!parentDir.existsSync()) {
            parentDir.createSync(recursive: true);
          }

          // Write file content
          outFile.writeAsBytesSync(file.content as List<int>);
          extractedCount++;
        } else if (file.isDirectory) {
          // Only create subdirectories AFTER stripping root
          if (filename.isNotEmpty) {
            final dir = Directory(filePath);
            if (!dir.existsSync()) {
              dir.createSync(recursive: true);
            }
          }
        }
      }

      FormGearLogger.sdk(
        'ZIP extraction completed successfully. Extracted '
        '$extractedCount files '
        'from $zipFilePath',
      );

      // Delete ZIP file if requested
      if (deleteZipAfterExtraction) {
        try {
          zipFile.deleteSync();
          FormGearLogger.sdk('Deleted ZIP file after extraction: $zipFilePath');
        } on Exception catch (deleteError) {
          FormGearLogger.sdkError(
            'Failed to delete ZIP file after extraction: $deleteError',
          );
          // Don't fail the extraction because of delete failure
        }
      }

      return true;
    } on Exception catch (e) {
      FormGearLogger.sdkError(
        'Failed to extract ZIP file $zipFilePath: $e',
      );
      return false;
    }
  }

  /// Extracts a ZIP file from bytes to the specified directory
  ///
  /// Parameters:
  /// - [zipBytes]: ZIP file content as bytes
  /// - [extractToPath]: Directory path where contents should be extracted
  ///
  /// Returns:
  /// - `true` if extraction was successful
  /// - `false` if extraction failed
  static Future<bool> extractZipFromBytes(
    Uint8List zipBytes,
    String extractToPath,
  ) async {
    try {
      FormGearLogger.sdk(
        'Starting ZIP extraction from bytes -> $extractToPath',
      );

      // Decode the ZIP archive
      final archive = ZipDecoder().decodeBytes(zipBytes);

      // Create extraction directory if it doesn't exist
      final extractDir = Directory(extractToPath);
      if (!extractDir.existsSync()) {
        extractDir.createSync(recursive: true);
        FormGearLogger.sdk('Created extraction directory: $extractToPath');
      }

      // Detect if all files are under a single root directory (FASIH pattern)
      String? commonRootDir;
      var hasCommonRoot = true;

      // First pass: detect common root directory
      for (final file in archive) {
        // Skip directory entries themselves
        if (file.isDirectory) continue;

        if (file.name.contains('/')) {
          final rootDir = file.name.split('/').first;
          if (commonRootDir == null) {
            commonRootDir = rootDir;
          } else if (commonRootDir != rootDir) {
            hasCommonRoot = false;
            break;
          }
        } else {
          // File at root level, no common directory
          hasCommonRoot = false;
          break;
        }
      }

      // Extract all files from the archive
      var extractedCount = 0;
      for (final file in archive) {
        // Skip the root directory entry itself BEFORE processing
        if (hasCommonRoot &&
            commonRootDir != null &&
            file.name == '$commonRootDir/') {
          continue;
        }

        var filename = file.name;

        // Strip common root directory if detected (FASIH pattern)
        if (hasCommonRoot && commonRootDir != null) {
          if (filename.startsWith('$commonRootDir/')) {
            filename = filename.substring(commonRootDir.length + 1);
          }
        }

        // Skip empty filenames after stripping
        if (filename.isEmpty) continue;

        final filePath = '$extractToPath${Platform.pathSeparator}$filename';

        if (file.isFile) {
          // Extract file
          final outFile = File(filePath);

          // Create parent directories if they don't exist
          final parentDir = outFile.parent;
          if (!parentDir.existsSync()) {
            parentDir.createSync(recursive: true);
          }

          // Write file content
          outFile.writeAsBytesSync(file.content as List<int>);
          extractedCount++;
        } else if (file.isDirectory) {
          // Only create subdirectories AFTER stripping root
          if (filename.isNotEmpty) {
            final dir = Directory(filePath);
            if (!dir.existsSync()) {
              dir.createSync(recursive: true);
            }
          }
        }
      }

      FormGearLogger.sdk(
        'ZIP extraction from bytes completed successfully. Extracted '
        '$extractedCount files',
      );

      return true;
    } on Exception catch (e) {
      FormGearLogger.sdkError(
        'Failed to extract ZIP from bytes: $e',
      );
      return false;
    }
  }

  /// Validates if a file is a valid ZIP archive
  ///
  /// Parameters:
  /// - [filePath]: Path to the file to validate
  ///
  /// Returns:
  /// - `true` if the file is a valid ZIP archive
  /// - `false` if the file is not a valid ZIP archive or doesn't exist
  static Future<bool> isValidZipFile(String filePath) async {
    try {
      final file = File(filePath);
      if (!file.existsSync()) {
        return false;
      }

      final bytes = file.readAsBytesSync();
      final archive = ZipDecoder().decodeBytes(bytes);

      // If we can decode it without errors, it's valid
      return archive.isNotEmpty;
    } on Exception catch (e) {
      FormGearLogger.sdkError('Invalid ZIP file: $filePath - $e');
      return false;
    }
  }

  /// Lists contents of a ZIP file without extracting
  ///
  /// Parameters:
  /// - [zipFilePath]: Path to the ZIP file
  ///
  /// Returns:
  /// - List of file names in the ZIP archive
  /// - Empty list if the ZIP file is invalid or doesn't exist
  static Future<List<String>> listZipContents(String zipFilePath) async {
    try {
      final zipFile = File(zipFilePath);
      if (!zipFile.existsSync()) {
        return [];
      }

      final zipBytes = zipFile.readAsBytesSync();
      final archive = ZipDecoder().decodeBytes(zipBytes);

      return archive.map((file) => file.name).toList();
    } on Exception catch (e) {
      FormGearLogger.sdkError('Failed to list ZIP contents: $zipFilePath - $e');
      return [];
    }
  }

  /// Creates a ZIP file from a directory
  ///
  /// Parameters:
  /// - [sourceDirectory]: Directory to compress
  /// - [outputZipPath]: Path for the output ZIP file
  ///
  /// Returns:
  /// - `true` if compression was successful
  /// - `false` if compression failed
  static Future<bool> createZipFromDirectory(
    String sourceDirectory,
    String outputZipPath,
  ) async {
    try {
      FormGearLogger.sdk('Creating ZIP: $sourceDirectory -> $outputZipPath');

      final sourceDir = Directory(sourceDirectory);
      if (!sourceDir.existsSync()) {
        FormGearLogger.sdkError('Source directory not found: $sourceDirectory');
        return false;
      }

      final archive = Archive();

      // Add all files from directory to archive
      for (final entity in sourceDir.listSync(recursive: true)) {
        if (entity is File) {
          final relativePath = entity.path.replaceFirst(
            '$sourceDirectory/',
            '',
          );
          final fileBytes = entity.readAsBytesSync();

          final archiveFile = ArchiveFile(
            relativePath,
            fileBytes.length,
            fileBytes,
          );
          archive.addFile(archiveFile);

          FormGearLogger.sdk('Added to ZIP: $relativePath');
        }
      }

      // Encode and save ZIP
      final zipBytes = ZipEncoder().encode(archive);
      final outputFile = File(outputZipPath);
      outputFile.writeAsBytesSync(zipBytes);

      FormGearLogger.sdk('ZIP created successfully: $outputZipPath');
      return true;
    } on Exception catch (e) {
      FormGearLogger.sdkError(
        'Failed to create ZIP: $e',
      );
      return false;
    }
  }
}
