// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'save_submit_result.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SaveSubmitResult _$SaveSubmitResultFromJson(Map<String, dynamic> json) =>
    SaveSubmitResult(
      isSuccess: json['isSuccess'] as bool,
      submissionId: json['submissionId'] as String?,
      error: json['error'] as String?,
      errorCode: json['errorCode'] as String?,
      metadata: json['metadata'] as Map<String, dynamic>?,
      timestamp: json['timestamp'] == null
          ? null
          : DateTime.parse(json['timestamp'] as String),
    );

Map<String, dynamic> _$SaveSubmitResultToJson(SaveSubmitResult instance) =>
    <String, dynamic>{
      'isSuccess': instance.isSuccess,
      'submissionId': instance.submissionId,
      'error': instance.error,
      'errorCode': instance.errorCode,
      'metadata': instance.metadata,
      'timestamp': instance.timestamp?.toIso8601String(),
    };
