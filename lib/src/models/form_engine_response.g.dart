// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'form_engine_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FormEngineResponse _$FormEngineResponseFromJson(Map<String, dynamic> json) =>
    FormEngineResponse(
      success: json['success'] as bool?,
      errorCode: (json['errorCode'] as num?)?.toInt(),
      message: json['message'] as String?,
      data: json['data'] == null
          ? null
          : FormEngineEntity.fromJson(json['data'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$FormEngineResponseToJson(FormEngineResponse instance) =>
    <String, dynamic>{
      'success': instance.success,
      'errorCode': instance.errorCode,
      'message': instance.message,
      'data': instance.data?.toJson(),
    };
