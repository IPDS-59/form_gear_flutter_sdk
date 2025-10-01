import 'dart:io';

import 'package:equatable/equatable.dart';

/// Data model for file upload operations
///
/// Contains all necessary information for uploading a file to a backend
/// service. Used by FileUploadListener to handle file upload requests.
class FileUploadData extends Equatable {
  /// Creates a new [FileUploadData] instance
  const FileUploadData({
    required this.assignmentId,
    required this.templateId,
    required this.dataKey,
    required this.file,
    required this.fileName,
    required this.fileUri,
    this.metadata,
  });

  /// The assignment ID this file belongs to
  final String assignmentId;

  /// The template ID for the form
  final String templateId;

  /// The data key/field name for this file in the form
  final String dataKey;

  /// The actual file to upload
  final File file;

  /// The original file name
  final String fileName;

  /// The file URI (file:// path)
  final String fileUri;

  /// Optional metadata about the file (MIME type, size, etc.)
  final Map<String, dynamic>? metadata;

  @override
  List<Object?> get props => [
    assignmentId,
    templateId,
    dataKey,
    file,
    fileName,
    fileUri,
    metadata,
  ];

  @override
  String toString() {
    return 'FileUploadData('
        'assignmentId: $assignmentId, '
        'templateId: $templateId, '
        'dataKey: $dataKey, '
        'fileName: $fileName, '
        'fileUri: $fileUri'
        ')';
  }

  /// Create a copy with modified fields
  FileUploadData copyWith({
    String? assignmentId,
    String? templateId,
    String? dataKey,
    File? file,
    String? fileName,
    String? fileUri,
    Map<String, dynamic>? metadata,
  }) {
    return FileUploadData(
      assignmentId: assignmentId ?? this.assignmentId,
      templateId: templateId ?? this.templateId,
      dataKey: dataKey ?? this.dataKey,
      file: file ?? this.file,
      fileName: fileName ?? this.fileName,
      fileUri: fileUri ?? this.fileUri,
      metadata: metadata ?? this.metadata,
    );
  }
}
