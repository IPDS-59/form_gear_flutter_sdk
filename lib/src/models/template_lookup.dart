import 'package:equatable/equatable.dart';
import 'package:form_gear_engine_sdk/src/models/lookup.dart';
import 'package:json_annotation/json_annotation.dart';

part 'template_lookup.g.dart';

/// Template lookup configuration matching FASIH domain structure
@JsonSerializable()
class TemplateLookup extends Equatable {
  const TemplateLookup({
    required this.templateId,
    required this.templateVersion,
    required this.formEngineId,
    required this.formEngineBrandName,
    this.lookups = const [],
  });

  factory TemplateLookup.fromJson(Map<String, dynamic> json) =>
      _$TemplateLookupFromJson(json);

  final String templateId;
  final String templateVersion;
  final int formEngineId;
  final String formEngineBrandName;
  final List<Lookup> lookups;

  Map<String, dynamic> toJson() => _$TemplateLookupToJson(this);

  @override
  List<Object?> get props => [
    templateId,
    templateVersion,
    formEngineId,
    formEngineBrandName,
    lookups,
  ];

  TemplateLookup copyWith({
    String? templateId,
    String? templateVersion,
    int? formEngineId,
    String? formEngineBrandName,
    List<Lookup>? lookups,
  }) {
    return TemplateLookup(
      templateId: templateId ?? this.templateId,
      templateVersion: templateVersion ?? this.templateVersion,
      formEngineId: formEngineId ?? this.formEngineId,
      formEngineBrandName: formEngineBrandName ?? this.formEngineBrandName,
      lookups: lookups ?? this.lookups,
    );
  }

  @override
  String toString() {
    return 'TemplateLookup(templateId: $templateId, '
        'templateVersion: $templateVersion, formEngineId: $formEngineId, '
        'formEngineBrandName: $formEngineBrandName, lookups: $lookups)';
  }
}
