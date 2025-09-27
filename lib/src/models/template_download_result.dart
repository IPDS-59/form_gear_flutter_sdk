import 'package:equatable/equatable.dart';

/// Result of template download operation
class TemplateDownloadResult extends Equatable {
  const TemplateDownloadResult({
    required this.success,
    this.error,
    this.localPath,
    this.version,
  });

  /// Creates a successful download result
  const TemplateDownloadResult.success({
    required String localPath,
    String? version,
  }) : this(
         success: true,
         localPath: localPath,
         version: version,
       );

  /// Creates a failed download result
  const TemplateDownloadResult.failure({
    required String error,
  }) : this(
         success: false,
         error: error,
       );

  /// Whether the download was successful
  final bool success;

  /// Error message if download failed
  final String? error;

  /// Local path where template was downloaded
  final String? localPath;

  /// Version of the downloaded template
  final String? version;

  @override
  List<Object?> get props => [success, error, localPath, version];

  @override
  String toString() {
    return 'TemplateDownloadResult(success: $success, error: $error, '
        'localPath: $localPath, version: $version)';
  }
}
