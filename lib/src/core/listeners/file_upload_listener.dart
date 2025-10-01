import 'package:form_gear_engine_sdk/src/models/file_upload_data.dart';
import 'package:form_gear_engine_sdk/src/models/file_upload_result.dart';

/// Listener interface for handling file upload operations
///
/// Implement this interface to handle file uploads from FormGear/FasihForm.
/// The SDK will call [onFileUpload] when a file needs to be uploaded,
/// allowing the app to implement custom upload logic (S3, server, etc.).
///
/// Example implementation for FASIH app with S3:
/// ```dart
/// class FasihFileUploadListener implements FileUploadListener {
///   final AssignmentRepository repository;
///
///   @override
///   Future<FileUploadResult> onFileUpload(FileUploadData data) async {
///     try {
///       // Get pre-signed URL from FASIH API
///       final presignedUrl = await repository.getPresignedUrl(
///         assignmentId: data.assignmentId,
///         fileName: data.fileName,
///       );
///
///       // Upload to S3
///       final s3Url = await repository.uploadToS3(
///         presignedUrl: presignedUrl,
///         file: data.file,
///         onProgress: (sent, total) {
///           onUploadProgress(data.fileName, sent, total);
///         },
///       );
///
///       return FileUploadResult.success(uploadedUrl: s3Url);
///     } catch (e, st) {
///       onUploadError(data.fileName, e, st);
///       return FileUploadResult.failure(error: e.toString());
///     }
///   }
/// }
/// ```
abstract class FileUploadListener {
  /// Handle file upload request
  ///
  /// Called when a file needs to be uploaded from FormGear/FasihForm.
  /// Implement this method to upload the file to your backend
  /// (S3, server, etc.)
  ///
  /// Parameters:
  /// - [data]: Contains file information and upload context
  ///
  /// Returns:
  /// - [FileUploadResult.success] with uploaded URL if successful
  /// - [FileUploadResult.failure] with error message if failed
  Future<FileUploadResult> onFileUpload(FileUploadData data);

  /// Optional: Track upload progress
  ///
  /// Called periodically during file upload to report progress.
  /// Useful for showing upload progress bars or notifications.
  ///
  /// Parameters:
  /// - [fileName]: Name of the file being uploaded
  /// - [sent]: Number of bytes sent so far
  /// - [total]: Total file size in bytes
  void onUploadProgress(String fileName, int sent, int total) {}

  /// Optional: Upload completed successfully
  ///
  /// Called after a file upload completes successfully.
  /// Useful for cleanup, logging, or updating UI.
  ///
  /// Parameters:
  /// - [fileName]: Name of the uploaded file
  /// - [result]: The success result with uploaded URL
  Future<void> onUploadCompleted(
    String fileName,
    FileUploadResult result,
  ) async {}

  /// Optional: Upload error occurred
  ///
  /// Called when a file upload fails with an error.
  /// Useful for error logging, retry logic, or user notifications.
  ///
  /// Parameters:
  /// - [fileName]: Name of the file that failed to upload
  /// - [error]: The error that occurred
  /// - [stackTrace]: Stack trace for debugging
  Future<void> onUploadError(
    String fileName,
    Object error,
    StackTrace stackTrace,
  ) async {}
}
