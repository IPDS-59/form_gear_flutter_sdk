import 'package:equatable/equatable.dart';
import 'package:json_annotation/json_annotation.dart';

part 'list_lookup_notif_response.g.dart';

/// List lookup notification response matching FASIH BaseResponse structure
@JsonSerializable()
class ListLookupNotifResponse extends Equatable {
  const ListLookupNotifResponse({
    this.success,
    this.errorCode,
    this.message,
    this.data,
  });

  factory ListLookupNotifResponse.fromJson(Map<String, dynamic> json) =>
      _$ListLookupNotifResponseFromJson(json);

  /// Whether the request was successful
  final bool? success;

  /// Error code if request failed
  final int? errorCode;

  /// Response message
  final String? message;

  /// Template lookup list data
  final List<TemplateLookupList>? data;

  Map<String, dynamic> toJson() => _$ListLookupNotifResponseToJson(this);

  @override
  List<Object?> get props => [success, errorCode, message, data];
}

/// Template lookup list entity matching FASIH TemplateLookupList
@JsonSerializable()
class TemplateLookupList extends Equatable {
  const TemplateLookupList({
    this.surveyId,
    this.templateId,
    this.lookupType,
    this.lookupCode,
    this.lookupName,
    this.lookupValue,
    this.isActive,
    this.createdAt,
    this.updatedAt,
  });

  factory TemplateLookupList.fromJson(Map<String, dynamic> json) =>
      _$TemplateLookupListFromJson(json);

  @JsonKey(name: 'survey_id')
  final String? surveyId;

  @JsonKey(name: 'template_id')
  final String? templateId;

  @JsonKey(name: 'lookup_type')
  final String? lookupType;

  @JsonKey(name: 'lookup_code')
  final String? lookupCode;

  @JsonKey(name: 'lookup_name')
  final String? lookupName;

  @JsonKey(name: 'lookup_value')
  final dynamic lookupValue;

  @JsonKey(name: 'is_active')
  final bool? isActive;

  @JsonKey(name: 'created_at')
  final String? createdAt;

  @JsonKey(name: 'updated_at')
  final String? updatedAt;

  Map<String, dynamic> toJson() => _$TemplateLookupListToJson(this);

  @override
  List<Object?> get props => [
    surveyId,
    templateId,
    lookupType,
    lookupCode,
    lookupName,
    lookupValue,
    isActive,
    createdAt,
    updatedAt,
  ];
}
