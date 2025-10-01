// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'form_gear_global_config.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FormGearGlobalConfig _$FormGearGlobalConfigFromJson(
  Map<String, dynamic> json,
) => FormGearGlobalConfig(
  apiConfig: json['apiConfig'] == null
      ? null
      : FormGearApiConfig.fromJson(json['apiConfig'] as Map<String, dynamic>),
  bpsUser: json['bpsUser'] == null
      ? null
      : BpsUser.fromJson(json['bpsUser'] as Map<String, dynamic>),
  username: json['username'] as String?,
  autoStartServer: json['autoStartServer'] as bool? ?? true,
  serverPort: (json['serverPort'] as num?)?.toInt() ?? 3310,
  enableDebugMode: json['enableDebugMode'] as bool? ?? false,
  enableLogging: json['enableLogging'] as bool? ?? true,
  defaultAssignmentConfig: json['defaultAssignmentConfig'] == null
      ? null
      : AssignmentConfig.fromJson(
          json['defaultAssignmentConfig'] as Map<String, dynamic>,
        ),
);

Map<String, dynamic> _$FormGearGlobalConfigToJson(
  FormGearGlobalConfig instance,
) => <String, dynamic>{
  'apiConfig': instance.apiConfig,
  'bpsUser': instance.bpsUser,
  'username': instance.username,
  'autoStartServer': instance.autoStartServer,
  'serverPort': instance.serverPort,
  'enableDebugMode': instance.enableDebugMode,
  'enableLogging': instance.enableLogging,
  'defaultAssignmentConfig': instance.defaultAssignmentConfig,
};
