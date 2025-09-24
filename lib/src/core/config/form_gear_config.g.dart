// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'form_gear_config.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FormGearConfig _$FormGearConfigFromJson(Map<String, dynamic> json) =>
    FormGearConfig(
      clientMode: $enumDecode(_$FormGearClientModeEnumMap, json['clientMode']),
      lookupKey: json['lookupKey'] as String,
      lookupValue: json['lookupValue'] as String,
      lookupMode: $enumDecode(_$FormGearLookupModeEnumMap, json['lookupMode']),
      username: json['username'] as String,
      formMode: $enumDecode(_$FormGearFormModeEnumMap, json['formMode']),
      initialMode: $enumDecode(
        _$FormGearInitialModeEnumMap,
        json['initialMode'],
      ),
      enableConsoleLogForwarding: json['enableConsoleLogForwarding'] as bool,
      enableDebugLogging: json['enableDebugLogging'] as bool,
      htmlLogPrefix: json['htmlLogPrefix'] as String,
      sdkLogPrefix: json['sdkLogPrefix'] as String,
      serverPort: (json['serverPort'] as num).toInt(),
      autoStartServer: json['autoStartServer'] as bool,
      authToken: json['authToken'] as String?,
      baseUrl: json['baseUrl'] as String?,
      fasihUser: json['fasihUser'] == null
          ? null
          : FasihUser.fromJson(json['fasihUser'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$FormGearConfigToJson(FormGearConfig instance) =>
    <String, dynamic>{
      'clientMode': _$FormGearClientModeEnumMap[instance.clientMode]!,
      'authToken': instance.authToken,
      'baseUrl': instance.baseUrl,
      'lookupKey': instance.lookupKey,
      'lookupValue': instance.lookupValue,
      'lookupMode': _$FormGearLookupModeEnumMap[instance.lookupMode]!,
      'username': instance.username,
      'formMode': _$FormGearFormModeEnumMap[instance.formMode]!,
      'initialMode': _$FormGearInitialModeEnumMap[instance.initialMode]!,
      'enableConsoleLogForwarding': instance.enableConsoleLogForwarding,
      'enableDebugLogging': instance.enableDebugLogging,
      'htmlLogPrefix': instance.htmlLogPrefix,
      'sdkLogPrefix': instance.sdkLogPrefix,
      'serverPort': instance.serverPort,
      'autoStartServer': instance.autoStartServer,
      'fasihUser': instance.fasihUser,
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
