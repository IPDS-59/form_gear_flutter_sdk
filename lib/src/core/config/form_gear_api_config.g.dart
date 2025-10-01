// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'form_gear_api_config.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FormGearApiConfig _$FormGearApiConfigFromJson(Map<String, dynamic> json) =>
    FormGearApiConfig(
      baseUrl: json['baseUrl'] as String?,
      formEngineEndpoint: json['formEngineEndpoint'] as String?,
      authToken: json['authToken'] as String?,
      customHeaders:
          (json['customHeaders'] as Map<String, dynamic>?)?.map(
            (k, e) => MapEntry(k, e as String),
          ) ??
          const {},
      isProduction: json['isProduction'] as bool? ?? true,
      pinnedCertificates: (json['pinnedCertificates'] as Map<String, dynamic>?)
          ?.map(
            (k, e) => MapEntry(
              k,
              (e as List<dynamic>).map((e) => e as String).toList(),
            ),
          ),
    );

Map<String, dynamic> _$FormGearApiConfigToJson(FormGearApiConfig instance) =>
    <String, dynamic>{
      'baseUrl': instance.baseUrl,
      'formEngineEndpoint': instance.formEngineEndpoint,
      'authToken': instance.authToken,
      'customHeaders': instance.customHeaders,
      'isProduction': instance.isProduction,
      'pinnedCertificates': instance.pinnedCertificates,
    };
