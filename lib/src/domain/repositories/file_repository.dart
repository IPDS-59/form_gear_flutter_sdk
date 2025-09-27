import 'dart:io';

import 'package:form_gear_engine_sdk/src/core/base/result.dart';

/// Repository interface for file system operations
abstract class FileRepository {
  /// Check if a file exists at the given path
  Future<bool> fileExists(String filePath);

  /// Check if a directory exists at the given path
  Future<bool> directoryExists(String directoryPath);

  /// Create a directory at the given path
  Future<Result<void>> createDirectory(
    String directoryPath, {
    bool recursive = false,
  });

  /// Delete a file at the given path
  Future<Result<void>> deleteFile(String filePath);

  /// Delete a directory at the given path
  Future<Result<void>> deleteDirectory(
    String directoryPath, {
    bool recursive = false,
  });

  /// Copy a file from source to destination
  Future<Result<void>> copyFile(String sourcePath, String destinationPath);

  /// Move a file from source to destination
  Future<Result<void>> moveFile(String sourcePath, String destinationPath);

  /// Read string content from a file
  Future<Result<String>> readFileAsString(String filePath);

  /// Write string content to a file
  Future<Result<void>> writeFileAsString(String filePath, String content);

  /// Read bytes from a file
  Future<Result<List<int>>> readFileAsBytes(String filePath);

  /// Write bytes to a file
  Future<Result<void>> writeFileAsBytes(String filePath, List<int> bytes);

  /// Get file size in bytes
  Future<Result<int>> getFileSize(String filePath);

  /// List contents of a directory
  Future<Result<List<FileSystemEntity>>> listDirectory(String directoryPath);

  /// Get the parent directory of a path
  String getParentDirectory(String filePath);

  /// Join path components
  String joinPath(List<String> pathComponents);

  /// Get the filename from a path
  String getFileName(String filePath);

  /// Get the file extension from a path
  String getFileExtension(String filePath);
}
