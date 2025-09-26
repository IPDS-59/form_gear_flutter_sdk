// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'list_lookup_notif_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ListLookupNotifResponse _$ListLookupNotifResponseFromJson(
  Map<String, dynamic> json,
) => ListLookupNotifResponse(
  success: json['success'] as bool?,
  errorCode: (json['errorCode'] as num?)?.toInt(),
  message: json['message'] as String?,
  data: (json['data'] as List<dynamic>?)
      ?.map((e) => TemplateLookupList.fromJson(e as Map<String, dynamic>))
      .toList(),
);

Map<String, dynamic> _$ListLookupNotifResponseToJson(
  ListLookupNotifResponse instance,
) => <String, dynamic>{
  'success': instance.success,
  'errorCode': instance.errorCode,
  'message': instance.message,
  'data': instance.data,
};

TemplateLookupList _$TemplateLookupListFromJson(Map<String, dynamic> json) =>
    TemplateLookupList(
      surveyId: json['survey_id'] as String?,
      templateId: json['template_id'] as String?,
      lookupType: json['lookup_type'] as String?,
      lookupCode: json['lookup_code'] as String?,
      lookupName: json['lookup_name'] as String?,
      lookupValue: json['lookup_value'],
      isActive: json['is_active'] as bool?,
      createdAt: json['created_at'] as String?,
      updatedAt: json['updated_at'] as String?,
    );

Map<String, dynamic> _$TemplateLookupListToJson(TemplateLookupList instance) =>
    <String, dynamic>{
      'survey_id': instance.surveyId,
      'template_id': instance.templateId,
      'lookup_type': instance.lookupType,
      'lookup_code': instance.lookupCode,
      'lookup_name': instance.lookupName,
      'lookup_value': instance.lookupValue,
      'is_active': instance.isActive,
      'created_at': instance.createdAt,
      'updated_at': instance.updatedAt,
    };
