// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'form_gear_api_config.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FormGearApiConfig _$FormGearApiConfigFromJson(Map<String, dynamic> json) =>
    FormGearApiConfig(
      baseUrl: json['baseUrl'] as String?,
      templateZipEndpoint: json['templateZipEndpoint'] as String?,
      formEngineEndpoint: json['formEngineEndpoint'] as String?,
      lookupEndpoint: json['lookupEndpoint'] as String?,
      authToken: json['authToken'] as String?,
      customHeaders:
          (json['customHeaders'] as Map<String, dynamic>?)?.map(
            (k, e) => MapEntry(k, e as String),
          ) ??
          const {},
      isProduction: json['isProduction'] as bool? ?? true,
    );

Map<String, dynamic> _$FormGearApiConfigToJson(FormGearApiConfig instance) =>
    <String, dynamic>{
      'baseUrl': instance.baseUrl,
      'templateZipEndpoint': instance.templateZipEndpoint,
      'formEngineEndpoint': instance.formEngineEndpoint,
      'lookupEndpoint': instance.lookupEndpoint,
      'authToken': instance.authToken,
      'customHeaders': instance.customHeaders,
      'isProduction': instance.isProduction,
    };
