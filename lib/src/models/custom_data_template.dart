import 'package:equatable/equatable.dart';
import 'package:json_annotation/json_annotation.dart';

part 'custom_data_template.g.dart';

/// Custom data template response matching FASIH BaseResponse structure
@JsonSerializable()
class CustomDataTemplate extends Equatable {
  const CustomDataTemplate({
    this.success,
    this.errorCode,
    this.message,
    this.data,
  });

  factory CustomDataTemplate.fromJson(Map<String, dynamic> json) =>
      _$CustomDataTemplateFromJson(json);

  /// Whether the request was successful
  final bool? success;

  /// Error code if request failed
  final int? errorCode;

  /// Response message
  final String? message;

  /// Custom data template entity
  final CustomDataTemplateEntity? data;

  Map<String, dynamic> toJson() => _$CustomDataTemplateToJson(this);

  @override
  List<Object?> get props => [success, errorCode, message, data];
}

/// Template entity data structure matching FASIH CustomDataTemplateEntity
@JsonSerializable()
class CustomDataTemplateEntity extends Equatable {
  const CustomDataTemplateEntity({
    this.templateId,
    this.templateName,
    this.templateVersion,
    this.templateData,
    this.lookupData,
    this.createdAt,
    this.updatedAt,
    this.isActive,
  });

  factory CustomDataTemplateEntity.fromJson(Map<String, dynamic> json) =>
      _$CustomDataTemplateEntityFromJson(json);

  @JsonKey(name: 'template_id')
  final String? templateId;

  @JsonKey(name: 'template_name')
  final String? templateName;

  @JsonKey(name: 'template_version')
  final String? templateVersion;

  @JsonKey(name: 'template_data')
  final Map<String, dynamic>? templateData;

  @JsonKey(name: 'lookup_data')
  final Map<String, dynamic>? lookupData;

  @JsonKey(name: 'created_at')
  final String? createdAt;

  @JsonKey(name: 'updated_at')
  final String? updatedAt;

  @JsonKey(name: 'is_active')
  final bool? isActive;

  Map<String, dynamic> toJson() => _$CustomDataTemplateEntityToJson(this);

  @override
  List<Object?> get props => [
    templateId,
    templateName,
    templateVersion,
    templateData,
    lookupData,
    createdAt,
    updatedAt,
    isActive,
  ];
}
