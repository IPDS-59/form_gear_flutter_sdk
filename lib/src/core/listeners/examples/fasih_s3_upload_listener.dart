import 'dart:io';

import 'package:form_gear_engine_sdk/form_gear_engine_sdk.dart';
import 'package:form_gear_engine_sdk/src/utils/form_gear_logger.dart';

/// Example FileUploadListener implementation for FASIH app with S3 upload
///
/// This example demonstrates how to implement file uploads using the
/// FASIH backend API for pre-signed URLs and AWS S3 for file storage.
///
/// **Note**: This is a template/example. You need to:
/// 1. Replace `AssignmentRepository` with your actual repository
/// 2. Implement actual S3 upload logic
/// 3. Add error handling and retry logic
/// 4. Handle progress tracking
///
/// Usage in FASIH app:
/// ```dart
/// final repository = getIt<AssignmentRepository>();
/// FormGearSDK.instance.setFileUploadListener(
///   FasihS3UploadListener(repository: repository),
/// );
/// ```
class FasihS3UploadListener implements FileUploadListener {
  /// Creates a FASIH S3 upload listener
  const FasihS3UploadListener({
    required this.repository,
    this.onProgressCallback,
  });

  /// Repository for API calls (pre-signed URLs, etc.)
  /// Replace with your actual repository type
  final dynamic repository;

  /// Optional callback for upload progress updates
  final void Function(String fileName, int sent, int total)? onProgressCallback;

  @override
  Future<FileUploadResult> onFileUpload(FileUploadData data) async {
    try {
      // Step 1: Get pre-signed URL from FASIH API
      // Replace with your actual API call
      final presignedUrl = await _getPresignedUrl(
        assignmentId: data.assignmentId,
        fileName: data.fileName,
      );

      // Step 2: Upload file to S3 using pre-signed URL
      final s3Url = await _uploadToS3(
        presignedUrl: presignedUrl,
        file: data.file,
        onProgress: (sent, total) {
          onUploadProgress(data.fileName, sent, total);
        },
      );

      // Step 3: Return success with S3 URL
      return FileUploadResult.success(
        uploadedUrl: s3Url,
        metadata: {
          'assignmentId': data.assignmentId,
          'templateId': data.templateId,
          'dataKey': data.dataKey,
          'uploadedAt': DateTime.now().toIso8601String(),
        },
      );
    } on Exception catch (e, st) {
      // Notify error
      await onUploadError(data.fileName, e, st);

      // Return failure
      return FileUploadResult.failure(
        error: 'Failed to upload ${data.fileName}: $e',
        metadata: {
          'assignmentId': data.assignmentId,
          'fileName': data.fileName,
          'errorType': e.runtimeType.toString(),
        },
      );
    }
  }

  @override
  void onUploadProgress(String fileName, int sent, int total) {
    final progress = (sent / total * 100).toInt();
    FormGearLogger.webview(
      'Upload progress: $fileName - $progress% ($sent/$total bytes)',
    );

    // Call optional callback
    onProgressCallback?.call(fileName, sent, total);
  }

  @override
  Future<void> onUploadCompleted(
    String fileName,
    FileUploadResult result,
  ) async {
    FormGearLogger.webview(
      'File upload completed: $fileName -> ${result.uploadedUrl}',
    );

    // You can add additional logic here:
    // - Update local database
    // - Send analytics event
    // - Show notification
    // - etc.
  }

  @override
  Future<void> onUploadError(
    String fileName,
    Object error,
    StackTrace stackTrace,
  ) async {
    FormGearLogger.webviewError(
      'File upload error: $fileName - $error\n$stackTrace',
    );

    // You can add additional logic here:
    // - Log to crash reporting service
    // - Queue for retry
    // - Show error notification
    // - etc.
  }

  /// Get pre-signed URL from FASIH API
  ///
  /// **TODO**: Replace with actual implementation
  Future<String> _getPresignedUrl({
    required String assignmentId,
    required String fileName,
  }) async {
    // Example implementation:
    // final response = await repository.getPresignedUrl(
    //   assignmentId: assignmentId,
    //   fileName: fileName,
    // );
    // return response.presignedUrl;

    throw UnimplementedError(
      'Implement FASIH API call to get pre-signed URL',
    );
  }

  /// Upload file to S3 using pre-signed URL
  ///
  /// **TODO**: Replace with actual implementation
  Future<String> _uploadToS3({
    required String presignedUrl,
    required File file,
    required void Function(int sent, int total)? onProgress,
  }) async {
    // Example implementation using Dio:
    // final dio = Dio();
    // final fileLength = await file.length();
    //
    // await dio.put(
    //   presignedUrl,
    //   data: file.openRead(),
    //   options: Options(
    //     headers: {
    //       'Content-Type': 'application/octet-stream',
    //       'Content-Length': fileLength,
    //     },
    //   ),
    //   onSendProgress: onProgress,
    // );
    //
    // // Extract S3 URL from pre-signed URL (remove query params)
    // final uri = Uri.parse(presignedUrl);
    // return uri.replace(query: '').toString();

    throw UnimplementedError(
      'Implement S3 upload using pre-signed URL',
    );
  }
}
