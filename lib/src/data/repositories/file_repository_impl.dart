import 'dart:io';

import 'package:form_gear_engine_sdk/src/core/base/result.dart';
import 'package:form_gear_engine_sdk/src/domain/repositories/file_repository.dart';
import 'package:injectable/injectable.dart';
import 'package:path/path.dart' as path;

@LazySingleton(as: FileRepository)
/// Implementation of FileRepository for file system operations
class FileRepositoryImpl implements FileRepository {
  @override
  Future<bool> fileExists(String filePath) async {
    try {
      final file = File(filePath);
      return file.existsSync();
    } on Exception {
      return false;
    }
  }

  @override
  Future<bool> directoryExists(String directoryPath) async {
    try {
      final directory = Directory(directoryPath);
      return directory.existsSync();
    } on Exception {
      return false;
    }
  }

  @override
  Future<Result<void>> createDirectory(
    String directoryPath, {
    bool recursive = false,
  }) async {
    try {
      final directory = Directory(directoryPath);
      directory.createSync(recursive: recursive);
      return const Success(null);
    } on Exception catch (e, stackTrace) {
      return Failure(e, stackTrace);
    }
  }

  @override
  Future<Result<void>> deleteFile(String filePath) async {
    try {
      final file = File(filePath);
      if (file.existsSync()) {
        file.deleteSync();
      }
      return const Success(null);
    } on Exception catch (e, stackTrace) {
      return Failure(e, stackTrace);
    }
  }

  @override
  Future<Result<void>> deleteDirectory(
    String directoryPath, {
    bool recursive = false,
  }) async {
    try {
      final directory = Directory(directoryPath);
      if (directory.existsSync()) {
        directory.deleteSync(recursive: recursive);
      }
      return const Success(null);
    } on Exception catch (e, stackTrace) {
      return Failure(e, stackTrace);
    }
  }

  @override
  Future<Result<void>> copyFile(
    String sourcePath,
    String destinationPath,
  ) async {
    try {
      final sourceFile = File(sourcePath);
      final destinationFile = File(destinationPath);

      // Ensure destination directory exists
      final destinationDir = destinationFile.parent;
      if (!destinationDir.existsSync()) {
        destinationDir.createSync(recursive: true);
      }

      sourceFile.copySync(destinationPath);
      return const Success(null);
    } on Exception catch (e, stackTrace) {
      return Failure(e, stackTrace);
    }
  }

  @override
  Future<Result<void>> moveFile(
    String sourcePath,
    String destinationPath,
  ) async {
    try {
      final sourceFile = File(sourcePath);
      final destinationFile = File(destinationPath);

      // Ensure destination directory exists
      final destinationDir = destinationFile.parent;
      if (!destinationDir.existsSync()) {
        destinationDir.createSync(recursive: true);
      }

      sourceFile.renameSync(destinationPath);
      return const Success(null);
    } on Exception catch (e, stackTrace) {
      return Failure(e, stackTrace);
    }
  }

  @override
  Future<Result<String>> readFileAsString(String filePath) async {
    try {
      final file = File(filePath);
      final content = file.readAsStringSync();
      return Success(content);
    } on Exception catch (e, stackTrace) {
      return Failure(e, stackTrace);
    }
  }

  @override
  Future<Result<void>> writeFileAsString(
    String filePath,
    String content,
  ) async {
    try {
      final file = File(filePath);

      // Ensure parent directory exists
      final parentDir = file.parent;
      if (!parentDir.existsSync()) {
        parentDir.createSync(recursive: true);
      }

      file.writeAsStringSync(content);
      return const Success(null);
    } on Exception catch (e, stackTrace) {
      return Failure(e, stackTrace);
    }
  }

  @override
  Future<Result<List<int>>> readFileAsBytes(String filePath) async {
    try {
      final file = File(filePath);
      final bytes = file.readAsBytesSync();
      return Success(bytes);
    } on Exception catch (e, stackTrace) {
      return Failure(e, stackTrace);
    }
  }

  @override
  Future<Result<void>> writeFileAsBytes(
    String filePath,
    List<int> bytes,
  ) async {
    try {
      final file = File(filePath);

      // Ensure parent directory exists
      final parentDir = file.parent;
      if (!parentDir.existsSync()) {
        parentDir.createSync(recursive: true);
      }

      file.writeAsBytesSync(bytes);
      return const Success(null);
    } on Exception catch (e, stackTrace) {
      return Failure(e, stackTrace);
    }
  }

  @override
  Future<Result<int>> getFileSize(String filePath) async {
    try {
      final file = File(filePath);
      final stat = file.statSync();
      return Success(stat.size);
    } on Exception catch (e, stackTrace) {
      return Failure(e, stackTrace);
    }
  }

  @override
  Future<Result<List<FileSystemEntity>>> listDirectory(
    String directoryPath,
  ) async {
    try {
      final directory = Directory(directoryPath);
      final entities = directory.listSync();
      return Success(entities);
    } on Exception catch (e, stackTrace) {
      return Failure(e, stackTrace);
    }
  }

  @override
  String getParentDirectory(String filePath) {
    return path.dirname(filePath);
  }

  @override
  String joinPath(List<String> pathComponents) {
    return path.joinAll(pathComponents);
  }

  @override
  String getFileName(String filePath) {
    return path.basename(filePath);
  }

  @override
  String getFileExtension(String filePath) {
    return path.extension(filePath);
  }
}
