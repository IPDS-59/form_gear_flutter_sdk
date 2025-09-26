import 'package:equatable/equatable.dart';
import 'package:form_gear_engine_sdk/src/models/form_engine_type.dart';
import 'package:json_annotation/json_annotation.dart';

part 'form_engine_entity.g.dart';

/// FormGear engine entity matching FASIH data structure
@JsonSerializable()
class FormEngineEntity extends Equatable {
  const FormEngineEntity({
    this.isForce,
    this.formEngineId,
    this.userIds,
    this.linkDownload,
    this.modifiedBy,
    this.basePath,
    this.id,
    this.message,
    this.isDefault,
    this.version,
  });

  factory FormEngineEntity.fromJson(Map<String, dynamic> json) =>
      _$FormEngineEntityFromJson(json);

  @JsonKey(name: 'isForce')
  final bool? isForce;

  @JsonKey(name: 'formEngineId')
  final int? formEngineId;

  @JsonKey(name: 'userIds')
  final List<Object>? userIds;

  @JsonKey(name: 'linkDownload')
  final String? linkDownload;

  @JsonKey(name: 'modifiedBy')
  final String? modifiedBy;

  @JsonKey(name: 'basePath')
  final String? basePath;

  @JsonKey(name: 'id')
  final String? id;

  @JsonKey(name: 'message')
  final String? message;

  @JsonKey(name: 'isDefault')
  final bool? isDefault;

  final String? version;

  Map<String, dynamic> toJson() => _$FormEngineEntityToJson(this);

  /// Get the FormEngineType from formEngineId
  FormEngineType? get engineType => FormEngineType.fromId(formEngineId);

  @override
  List<Object?> get props => [
    isForce,
    formEngineId,
    userIds,
    linkDownload,
    modifiedBy,
    basePath,
    id,
    message,
    isDefault,
    version,
  ];

  FormEngineEntity copyWith({
    bool? isForce,
    int? formEngineId,
    List<Object>? userIds,
    String? linkDownload,
    String? modifiedBy,
    String? basePath,
    String? id,
    String? message,
    bool? isDefault,
    String? version,
  }) {
    return FormEngineEntity(
      isForce: isForce ?? this.isForce,
      formEngineId: formEngineId ?? this.formEngineId,
      userIds: userIds ?? this.userIds,
      linkDownload: linkDownload ?? this.linkDownload,
      modifiedBy: modifiedBy ?? this.modifiedBy,
      basePath: basePath ?? this.basePath,
      id: id ?? this.id,
      message: message ?? this.message,
      isDefault: isDefault ?? this.isDefault,
      version: version ?? this.version,
    );
  }

  @override
  String toString() {
    return 'FormEngineEntity(isForce: $isForce, formEngineId: $formEngineId, '
        'userIds: $userIds, linkDownload: $linkDownload, '
        'modifiedBy: $modifiedBy, basePath: $basePath, id: $id, '
        'message: $message, isDefault: $isDefault, version: $version)';
  }
}
