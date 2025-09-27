// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'custom_data_template.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CustomDataTemplate _$CustomDataTemplateFromJson(Map<String, dynamic> json) =>
    CustomDataTemplate(
      success: json['success'] as bool?,
      errorCode: (json['errorCode'] as num?)?.toInt(),
      message: json['message'] as String?,
      data: json['data'] == null
          ? null
          : CustomDataTemplateEntity.fromJson(
              json['data'] as Map<String, dynamic>,
            ),
    );

Map<String, dynamic> _$CustomDataTemplateToJson(CustomDataTemplate instance) =>
    <String, dynamic>{
      'success': instance.success,
      'errorCode': instance.errorCode,
      'message': instance.message,
      'data': instance.data,
    };

CustomDataTemplateEntity _$CustomDataTemplateEntityFromJson(
  Map<String, dynamic> json,
) => CustomDataTemplateEntity(
  templateId: json['template_id'] as String?,
  templateName: json['template_name'] as String?,
  templateVersion: json['template_version'] as String?,
  templateData: json['template_data'] as Map<String, dynamic>?,
  lookupData: json['lookup_data'] as Map<String, dynamic>?,
  createdAt: json['created_at'] as String?,
  updatedAt: json['updated_at'] as String?,
  isActive: json['is_active'] as bool?,
);

Map<String, dynamic> _$CustomDataTemplateEntityToJson(
  CustomDataTemplateEntity instance,
) => <String, dynamic>{
  'template_id': instance.templateId,
  'template_name': instance.templateName,
  'template_version': instance.templateVersion,
  'template_data': instance.templateData,
  'lookup_data': instance.lookupData,
  'created_at': instance.createdAt,
  'updated_at': instance.updatedAt,
  'is_active': instance.isActive,
};
