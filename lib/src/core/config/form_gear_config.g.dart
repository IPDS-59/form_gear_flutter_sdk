// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'form_gear_config.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FormGearConfig _$FormGearConfigFromJson(
  Map<String, dynamic> json,
) => FormGearConfig(
  clientMode: $enumDecode(_$FormGearClientModeEnumMap, json['clientMode']),
  lookupKey: json['lookupKey'] as String,
  lookupValue: json['lookupValue'] as String,
  lookupMode: $enumDecode(_$FormGearLookupModeEnumMap, json['lookupMode']),
  username: json['username'] as String,
  formMode: $enumDecode(_$FormGearFormModeEnumMap, json['formMode']),
  initialMode: $enumDecode(_$FormGearInitialModeEnumMap, json['initialMode']),
  htmlLogPrefix: json['htmlLogPrefix'] as String,
  sdkLogPrefix: json['sdkLogPrefix'] as String,
  serverPort: (json['serverPort'] as num).toInt(),
  autoStartServer: json['autoStartServer'] as bool,
  bpsUser: json['bpsUser'] == null
      ? null
      : BpsUser.fromJson(json['bpsUser'] as Map<String, dynamic>),
  apiConfig: json['apiConfig'] == null
      ? null
      : FormGearApiConfig.fromJson(json['apiConfig'] as Map<String, dynamic>),
  preset: json['preset'] as Map<String, dynamic>?,
  formResponse: json['formResponse'] as Map<String, dynamic>?,
  validation: json['validation'] as Map<String, dynamic>?,
  remark: json['remark'] as String?,
  isNewForm: json['isNewForm'] as bool? ?? true,
  enableLogging: json['enableLogging'] as bool? ?? true,
);

Map<String, dynamic> _$FormGearConfigToJson(FormGearConfig instance) =>
    <String, dynamic>{
      'clientMode': _$FormGearClientModeEnumMap[instance.clientMode]!,
      'lookupKey': instance.lookupKey,
      'lookupValue': instance.lookupValue,
      'lookupMode': _$FormGearLookupModeEnumMap[instance.lookupMode]!,
      'username': instance.username,
      'formMode': _$FormGearFormModeEnumMap[instance.formMode]!,
      'initialMode': _$FormGearInitialModeEnumMap[instance.initialMode]!,
      'htmlLogPrefix': instance.htmlLogPrefix,
      'sdkLogPrefix': instance.sdkLogPrefix,
      'serverPort': instance.serverPort,
      'autoStartServer': instance.autoStartServer,
      'bpsUser': instance.bpsUser,
      'apiConfig': instance.apiConfig,
      'preset': instance.preset,
      'formResponse': instance.formResponse,
      'validation': instance.validation,
      'remark': instance.remark,
      'isNewForm': instance.isNewForm,
      'enableLogging': instance.enableLogging,
    };

const _$FormGearClientModeEnumMap = {
  FormGearClientMode.cawi: 'cawi',
  FormGearClientMode.capi: 'capi',
};

const _$FormGearLookupModeEnumMap = {
  FormGearLookupMode.online: 'online',
  FormGearLookupMode.offline: 'offline',
};

const _$FormGearFormModeEnumMap = {
  FormGearFormMode.open: 'open',
  FormGearFormMode.rejected: 'rejected',
  FormGearFormMode.submitted: 'submitted',
  FormGearFormMode.approved: 'approved',
};

const _$FormGearInitialModeEnumMap = {
  FormGearInitialMode.initial: 'initial',
  FormGearInitialMode.assign: 'assign',
};
