import 'dart:io';

import 'package:archive/archive.dart';
import 'package:form_gear_engine_sdk/src/core/base/result.dart';
import 'package:form_gear_engine_sdk/src/domain/repositories/file_repository.dart';
import 'package:form_gear_engine_sdk/src/domain/repositories/zip_repository.dart';
import 'package:form_gear_engine_sdk/src/utils/form_gear_logger.dart';
import 'package:injectable/injectable.dart';
import 'package:path/path.dart' as path;

@LazySingleton(as: ZipRepository)
/// Implementation of ZipRepository for ZIP file operations
class ZipRepositoryImpl implements ZipRepository {
  const ZipRepositoryImpl({
    required FileRepository fileRepository,
  }) : _fileRepository = fileRepository;

  final FileRepository _fileRepository;

  @override
  Future<Result<void>> extractZip(
    String zipFilePath,
    String extractToPath, {
    bool deleteZipAfterExtraction = false,
  }) async {
    try {
      FormGearLogger.sdk('Extracting ZIP file: $zipFilePath to $extractToPath');

      // Read ZIP file bytes
      final bytesResult = await _fileRepository.readFileAsBytes(zipFilePath);
      if (bytesResult case Failure(:final error, :final stackTrace)) {
        return Failure(error, stackTrace);
      }
      final bytes = (bytesResult as Success<List<int>>).data;

      // Decode ZIP archive
      final archive = ZipDecoder().decodeBytes(bytes);

      // Ensure target directory exists
      final createDirResult = await _fileRepository.createDirectory(
        extractToPath,
        recursive: true,
      );
      if (createDirResult case Failure(:final error, :final stackTrace)) {
        return Failure(error, stackTrace);
      }

      // Extract all files
      for (final file in archive) {
        final filename = file.name;
        final filePath = path.join(extractToPath, filename);

        if (file.isFile) {
          // Extract file
          final fileContent = file.content as List<int>;
          final writeResult = await _fileRepository.writeFileAsBytes(
            filePath,
            fileContent,
          );
          if (writeResult case Failure(:final error, :final stackTrace)) {
            FormGearLogger.sdkError('Failed to extract file $filename: $error');
            return Failure(error, stackTrace);
          }
        } else {
          // Create directory
          final createResult = await _fileRepository.createDirectory(
            filePath,
            recursive: true,
          );
          if (createResult case Failure(:final error, :final stackTrace)) {
            FormGearLogger.sdkError(
              'Failed to create directory $filename: $error',
            );
            return Failure(error, stackTrace);
          }
        }
      }

      FormGearLogger.sdk(
        'Successfully extracted ${archive.length} items from ZIP',
      );

      // Delete ZIP file if requested
      if (deleteZipAfterExtraction) {
        final deleteResult = await _fileRepository.deleteFile(zipFilePath);
        if (deleteResult case Failure(:final error)) {
          FormGearLogger.sdkError('Failed to delete ZIP file: $error');
          // Don't return error here as extraction was successful
        } else {
          FormGearLogger.sdk('Deleted ZIP file after extraction: $zipFilePath');
        }
      }

      return const Success(null);
    } catch (e, stackTrace) {
      FormGearLogger.sdkError('ZIP extraction failed: $e');
      return Failure(e, stackTrace);
    }
  }

  @override
  Future<bool> isZipFile(String filePath) async {
    try {
      // Check if file exists
      final exists = await _fileRepository.fileExists(filePath);
      if (!exists) {
        return false;
      }

      // Read first few bytes to check ZIP signature
      final file = File(filePath);
      final bytes = await file.openRead(0, 4).toList();
      if (bytes.isEmpty || bytes[0].length < 2) {
        return false;
      }

      final signature = bytes[0];
      // ZIP files start with "PK" (0x504B)
      return signature[0] == 0x50 && signature[1] == 0x4B;
    } catch (e) {
      FormGearLogger.sdkError('Error checking ZIP file validity: $e');
      return false;
    }
  }

  @override
  Future<Result<List<String>>> listZipContents(String zipFilePath) async {
    try {
      // Read ZIP file bytes
      final bytesResult = await _fileRepository.readFileAsBytes(zipFilePath);
      if (bytesResult case Failure(:final error, :final stackTrace)) {
        return Failure(error, stackTrace);
      }
      final bytes = (bytesResult as Success<List<int>>).data;

      // Decode ZIP archive
      final archive = ZipDecoder().decodeBytes(bytes);

      // Extract file paths
      final filePaths = archive.map((file) => file.name).toList();

      return Success(filePaths);
    } catch (e, stackTrace) {
      FormGearLogger.sdkError('Failed to list ZIP contents: $e');
      return Failure(e, stackTrace);
    }
  }

  @override
  Future<Result<void>> extractSpecificFile(
    String zipFilePath,
    String fileInZip,
    String extractToPath,
  ) async {
    try {
      // Read ZIP file bytes
      final bytesResult = await _fileRepository.readFileAsBytes(zipFilePath);
      if (bytesResult case Failure(:final error, :final stackTrace)) {
        return Failure(error, stackTrace);
      }
      final bytes = (bytesResult as Success<List<int>>).data;

      // Decode ZIP archive
      final archive = ZipDecoder().decodeBytes(bytes);

      // Find the specific file
      final targetFile = archive.firstWhere(
        (file) => file.name == fileInZip,
        orElse: () => throw Exception('File not found in ZIP: $fileInZip'),
      );

      if (!targetFile.isFile) {
        return Failure(
          Exception('Target is not a file: $fileInZip'),
          StackTrace.current,
        );
      }

      // Extract the specific file
      final fileContent = targetFile.content as List<int>;
      final writeResult = await _fileRepository.writeFileAsBytes(
        extractToPath,
        fileContent,
      );

      return writeResult;
    } catch (e, stackTrace) {
      FormGearLogger.sdkError('Failed to extract specific file: $e');
      return Failure(e, stackTrace);
    }
  }

  @override
  Future<Result<int>> getUncompressedSize(String zipFilePath) async {
    try {
      // Read ZIP file bytes
      final bytesResult = await _fileRepository.readFileAsBytes(zipFilePath);
      if (bytesResult case Failure(:final error, :final stackTrace)) {
        return Failure(error, stackTrace);
      }
      final bytes = (bytesResult as Success<List<int>>).data;

      // Decode ZIP archive
      final archive = ZipDecoder().decodeBytes(bytes);

      // Calculate total uncompressed size
      var totalSize = 0;
      for (final file in archive) {
        if (file.isFile) {
          totalSize += file.size;
        }
      }

      return Success(totalSize);
    } catch (e, stackTrace) {
      FormGearLogger.sdkError('Failed to get uncompressed size: $e');
      return Failure(e, stackTrace);
    }
  }
}
