// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'assignment_context.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AssignmentContext _$AssignmentContextFromJson(Map<String, dynamic> json) =>
    AssignmentContext(
      assignmentId: json['assignmentId'] as String,
      templateId: json['templateId'] as String,
      surveyId: json['surveyId'] as String,
      config: AssignmentConfig.fromJson(json['config'] as Map<String, dynamic>),
      data: AssignmentData.fromJson(json['data'] as Map<String, dynamic>),
      metadata: json['metadata'] as Map<String, dynamic>?,
      formEngineId: json['formEngineId'] as String?,
    );

Map<String, dynamic> _$AssignmentContextToJson(AssignmentContext instance) =>
    <String, dynamic>{
      'assignmentId': instance.assignmentId,
      'templateId': instance.templateId,
      'surveyId': instance.surveyId,
      'config': instance.config,
      'data': instance.data,
      'metadata': instance.metadata,
      'formEngineId': instance.formEngineId,
    };

AssignmentConfig _$AssignmentConfigFromJson(Map<String, dynamic> json) =>
    AssignmentConfig(
      lookupMode: $enumDecode(_$FormGearLookupModeEnumMap, json['lookupMode']),
      formMode: $enumDecode(_$FormGearFormModeEnumMap, json['formMode']),
      clientMode: $enumDecode(_$FormGearClientModeEnumMap, json['clientMode']),
      isEncrypted: json['isEncrypted'] as bool? ?? false,
      offlineCapable: json['offlineCapable'] as bool? ?? true,
      allowEdit: json['allowEdit'] as bool? ?? true,
      autoSave: json['autoSave'] as bool? ?? true,
      requireValidation: json['requireValidation'] as bool? ?? true,
    );

Map<String, dynamic> _$AssignmentConfigToJson(AssignmentConfig instance) =>
    <String, dynamic>{
      'lookupMode': _$FormGearLookupModeEnumMap[instance.lookupMode]!,
      'formMode': _$FormGearFormModeEnumMap[instance.formMode]!,
      'clientMode': _$FormGearClientModeEnumMap[instance.clientMode]!,
      'isEncrypted': instance.isEncrypted,
      'offlineCapable': instance.offlineCapable,
      'allowEdit': instance.allowEdit,
      'autoSave': instance.autoSave,
      'requireValidation': instance.requireValidation,
    };

const _$FormGearLookupModeEnumMap = {
  FormGearLookupMode.online: 'online',
  FormGearLookupMode.offline: 'offline',
  FormGearLookupMode.local: 'local',
};

const _$FormGearFormModeEnumMap = {
  FormGearFormMode.open: 'open',
  FormGearFormMode.rejected: 'rejected',
  FormGearFormMode.submitted: 'submitted',
  FormGearFormMode.approved: 'approved',
  FormGearFormMode.debug: 'debug',
};

const _$FormGearClientModeEnumMap = {
  FormGearClientMode.cawi: 'cawi',
  FormGearClientMode.capi: 'capi',
  FormGearClientMode.test: 'test',
};

AssignmentData _$AssignmentDataFromJson(Map<String, dynamic> json) =>
    AssignmentData(
      template: json['template'] as Map<String, dynamic>,
      response: json['response'] as Map<String, dynamic>,
      validation: json['validation'] as Map<String, dynamic>,
      reference: json['reference'] as Map<String, dynamic>,
      media: json['media'] as Map<String, dynamic>,
      remark: json['remark'] as Map<String, dynamic>,
      preset: json['preset'] as Map<String, dynamic>,
      principals: json['principals'] as List<dynamic>? ?? const [],
      userInfo: json['userInfo'] as Map<String, dynamic>?,
    );

Map<String, dynamic> _$AssignmentDataToJson(AssignmentData instance) =>
    <String, dynamic>{
      'template': instance.template,
      'response': instance.response,
      'validation': instance.validation,
      'reference': instance.reference,
      'media': instance.media,
      'remark': instance.remark,
      'preset': instance.preset,
      'principals': instance.principals,
      'userInfo': instance.userInfo,
    };
