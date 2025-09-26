// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'form_engine_entity.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FormEngineEntity _$FormEngineEntityFromJson(Map<String, dynamic> json) =>
    FormEngineEntity(
      isForce: json['isForce'] as bool?,
      formEngineId: (json['formEngineId'] as num?)?.toInt(),
      userIds: (json['userIds'] as List<dynamic>?)
          ?.map((e) => e as Object)
          .toList(),
      linkDownload: json['linkDownload'] as String?,
      modifiedBy: json['modifiedBy'] as String?,
      basePath: json['basePath'] as String?,
      id: json['id'] as String?,
      message: json['message'] as String?,
      isDefault: json['isDefault'] as bool?,
      version: json['version'] as String?,
    );

Map<String, dynamic> _$FormEngineEntityToJson(FormEngineEntity instance) =>
    <String, dynamic>{
      'isForce': instance.isForce,
      'formEngineId': instance.formEngineId,
      'userIds': instance.userIds,
      'linkDownload': instance.linkDownload,
      'modifiedBy': instance.modifiedBy,
      'basePath': instance.basePath,
      'id': instance.id,
      'message': instance.message,
      'isDefault': instance.isDefault,
      'version': instance.version,
    };
