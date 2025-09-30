// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'save_submit_data.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SaveSubmitData _$SaveSubmitDataFromJson(Map<String, dynamic> json) =>
    SaveSubmitData(
      assignmentContext: AssignmentContext.fromJson(
        json['assignmentContext'] as Map<String, dynamic>,
      ),
      formData: json['formData'] as String,
      remark: json['remark'] as String,
      principal: json['principal'] as String,
      flag: json['flag'] as String,
      reference: json['reference'] as String?,
      media: json['media'] as String?,
      engineType:
          $enumDecodeNullable(
            _$SaveSubmitEngineTypeEnumMap,
            json['engineType'],
          ) ??
          SaveSubmitEngineType.formGear,
      timestamp: json['timestamp'] == null
          ? null
          : DateTime.parse(json['timestamp'] as String),
      metadata: json['metadata'] as Map<String, dynamic>?,
    );

Map<String, dynamic> _$SaveSubmitDataToJson(SaveSubmitData instance) =>
    <String, dynamic>{
      'assignmentContext': instance.assignmentContext,
      'formData': instance.formData,
      'remark': instance.remark,
      'principal': instance.principal,
      'reference': instance.reference,
      'media': instance.media,
      'flag': instance.flag,
      'engineType': _$SaveSubmitEngineTypeEnumMap[instance.engineType]!,
      'timestamp': instance.timestamp?.toIso8601String(),
      'metadata': instance.metadata,
    };

const _$SaveSubmitEngineTypeEnumMap = {
  SaveSubmitEngineType.formGear: 'formGear',
  SaveSubmitEngineType.fasihForm: 'fasihForm',
};
