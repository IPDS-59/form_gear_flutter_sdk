// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'assignment.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Assignment _$AssignmentFromJson(Map<String, dynamic> json) => Assignment(
  id: json['id'] as String,
  surveyId: json['surveyId'] as String,
  periodeId: json['periodeId'] as String,
  templateId: json['templateId'] as String,
  currentUserId: json['currentUserId'] as String,
  preDefinedData: json['preDefinedData'] as String?,
  isEncrypt: json['isEncrypt'] as bool? ?? false,
  offlineSend: json['offlineSend'] as bool? ?? false,
  latitude: (json['latitude'] as num?)?.toDouble(),
  longitude: (json['longitude'] as num?)?.toDouble(),
  accuracy: (json['accuracy'] as num?)?.toDouble(),
  assignmentStatusId: (json['assignmentStatusId'] as num?)?.toInt(),
  isDone: json['isDone'] as bool?,
  createdAt: json['createdAt'] == null
      ? null
      : DateTime.parse(json['createdAt'] as String),
  updatedAt: json['updatedAt'] == null
      ? null
      : DateTime.parse(json['updatedAt'] as String),
);

Map<String, dynamic> _$AssignmentToJson(Assignment instance) =>
    <String, dynamic>{
      'id': instance.id,
      'surveyId': instance.surveyId,
      'periodeId': instance.periodeId,
      'templateId': instance.templateId,
      'currentUserId': instance.currentUserId,
      'preDefinedData': instance.preDefinedData,
      'isEncrypt': instance.isEncrypt,
      'offlineSend': instance.offlineSend,
      'latitude': instance.latitude,
      'longitude': instance.longitude,
      'accuracy': instance.accuracy,
      'assignmentStatusId': instance.assignmentStatusId,
      'isDone': instance.isDone,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
    };
