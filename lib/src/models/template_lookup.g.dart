// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'template_lookup.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

TemplateLookup _$TemplateLookupFromJson(Map<String, dynamic> json) =>
    TemplateLookup(
      templateId: json['templateId'] as String,
      templateVersion: json['templateVersion'] as String,
      formEngineId: (json['formEngineId'] as num).toInt(),
      formEngineBrandName: json['formEngineBrandName'] as String,
      lookups:
          (json['lookups'] as List<dynamic>?)
              ?.map((e) => Lookup.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
    );

Map<String, dynamic> _$TemplateLookupToJson(TemplateLookup instance) =>
    <String, dynamic>{
      'templateId': instance.templateId,
      'templateVersion': instance.templateVersion,
      'formEngineId': instance.formEngineId,
      'formEngineBrandName': instance.formEngineBrandName,
      'lookups': instance.lookups,
    };
