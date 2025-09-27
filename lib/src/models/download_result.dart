import 'package:equatable/equatable.dart';
import 'package:json_annotation/json_annotation.dart';

part 'download_result.g.dart';

/// Download result containing success status and optional error message
@JsonSerializable()
class DownloadResult extends Equatable {
  const DownloadResult({
    required this.success,
    this.error,
    this.localPath,
  });

  factory DownloadResult.fromJson(Map<String, dynamic> json) =>
      _$DownloadResultFromJson(json);

  final bool success;
  final String? error;
  final String? localPath;

  Map<String, dynamic> toJson() => _$DownloadResultToJson(this);

  @override
  List<Object?> get props => [success, error, localPath];

  @override
  String toString() {
    return 'DownloadResult(success: $success, error: $error, '
        'localPath: $localPath)';
  }
}
