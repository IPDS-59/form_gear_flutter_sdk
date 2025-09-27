import 'package:equatable/equatable.dart';
import 'package:form_gear_engine_sdk/src/models/form_engine_entity.dart';
import 'package:json_annotation/json_annotation.dart';

part 'form_engine_response.g.dart';

/// Form engine response matching FASIH BaseResponse structure
@JsonSerializable()
class FormEngineResponse extends Equatable {
  const FormEngineResponse({
    this.success,
    this.errorCode,
    this.message,
    this.data,
  });

  factory FormEngineResponse.fromJson(Map<String, dynamic> json) =>
      _$FormEngineResponseFromJson(json);

  /// Whether the request was successful
  final bool? success;

  /// Error code if request failed
  final int? errorCode;

  /// Response message
  final String? message;

  /// Form engine data
  final FormEngineEntity? data;

  Map<String, dynamic> toJson() => _$FormEngineResponseToJson(this);

  @override
  List<Object?> get props => [success, errorCode, message, data];
}
