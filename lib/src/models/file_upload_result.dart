import 'package:equatable/equatable.dart';

/// Result model for file upload operations
///
/// Represents the outcome of a file upload request with either success
/// or failure information. Used by FileUploadListener to communicate upload
/// results back to the SDK.
class FileUploadResult extends Equatable {
  /// Creates a new [FileUploadResult] instance
  const FileUploadResult({
    required this.isSuccess,
    this.uploadedUrl,
    this.error,
    this.metadata,
  }) : assert(
         isSuccess && uploadedUrl != null || !isSuccess && error != null,
         'Success requires uploadedUrl, failure requires error',
       );

  /// Creates a successful upload result
  const FileUploadResult.success({
    required String uploadedUrl,
    Map<String, dynamic>? metadata,
  }) : this(
         isSuccess: true,
         uploadedUrl: uploadedUrl,
         metadata: metadata,
       );

  /// Creates a failed upload result
  const FileUploadResult.failure({
    required String error,
    Map<String, dynamic>? metadata,
  }) : this(
         isSuccess: false,
         error: error,
         metadata: metadata,
       );

  /// Whether the upload was successful
  final bool isSuccess;

  /// The URL of the uploaded file (S3 URL, server URL, etc.)
  /// Required when [isSuccess] is true
  final String? uploadedUrl;

  /// Error message if upload failed
  /// Required when [isSuccess] is false
  final String? error;

  /// Optional metadata about the upload result
  /// Can include: upload duration, file size, checksum, etc.
  final Map<String, dynamic>? metadata;

  @override
  List<Object?> get props => [isSuccess, uploadedUrl, error, metadata];

  @override
  String toString() {
    return isSuccess
        ? 'FileUploadResult.success(uploadedUrl: $uploadedUrl)'
        : 'FileUploadResult.failure(error: $error)';
  }

  /// Create a copy with modified fields
  FileUploadResult copyWith({
    bool? isSuccess,
    String? uploadedUrl,
    String? error,
    Map<String, dynamic>? metadata,
  }) {
    return FileUploadResult(
      isSuccess: isSuccess ?? this.isSuccess,
      uploadedUrl: uploadedUrl ?? this.uploadedUrl,
      error: error ?? this.error,
      metadata: metadata ?? this.metadata,
    );
  }
}
