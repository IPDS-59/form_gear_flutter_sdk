// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'download_result.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

DownloadResult _$DownloadResultFromJson(Map<String, dynamic> json) =>
    DownloadResult(
      success: json['success'] as bool,
      error: json['error'] as String?,
      localPath: json['localPath'] as String?,
    );

Map<String, dynamic> _$DownloadResultToJson(DownloadResult instance) =>
    <String, dynamic>{
      'success': instance.success,
      'error': instance.error,
      'localPath': instance.localPath,
    };
