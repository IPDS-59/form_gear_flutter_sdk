import 'package:form_gear_engine_sdk/src/core/base/result.dart';

/// Repository interface for ZIP file operations
abstract class ZipRepository {
  /// Extract a ZIP file to the specified directory
  ///
  /// Parameters:
  /// - [zipFilePath]: Path to the ZIP file to extract
  /// - [extractToPath]: Directory to extract files to
  /// - [deleteZipAfterExtraction]: Whether to delete ZIP file after
  ///   successful extraction
  ///
  /// Returns `Result<void>` indicating success or failure
  Future<Result<void>> extractZip(
    String zipFilePath,
    String extractToPath, {
    bool deleteZipAfterExtraction = false,
  });

  /// Check if a file is a valid ZIP file by examining its content
  ///
  /// Parameters:
  /// - [filePath]: Path to the file to check
  ///
  /// Returns true if the file is a valid ZIP file
  Future<bool> isZipFile(String filePath);

  /// Get the list of files in a ZIP archive without extracting
  ///
  /// Parameters:
  /// - [zipFilePath]: Path to the ZIP file
  ///
  /// Returns Result containing list of file paths in the ZIP
  Future<Result<List<String>>> listZipContents(String zipFilePath);

  /// Extract a specific file from a ZIP archive
  ///
  /// Parameters:
  /// - [zipFilePath]: Path to the ZIP file
  /// - [fileInZip]: Path of the file inside the ZIP to extract
  /// - [extractToPath]: Path where to extract the specific file
  ///
  /// Returns `Result<void>` indicating success or failure
  Future<Result<void>> extractSpecificFile(
    String zipFilePath,
    String fileInZip,
    String extractToPath,
  );

  /// Get the size of an uncompressed ZIP archive
  ///
  /// Parameters:
  /// - [zipFilePath]: Path to the ZIP file
  ///
  /// Returns Result containing the uncompressed size in bytes
  Future<Result<int>> getUncompressedSize(String zipFilePath);
}
