// This is a generated file - do not edit.
//
// Generated from validation/validation_collection.proto.

// @dart = 3.3

// ignore_for_file: annotate_overrides, camel_case_types, comment_references
// ignore_for_file: constant_identifier_names
// ignore_for_file: curly_braces_in_flow_control_structures
// ignore_for_file: deprecated_member_use_from_same_package, library_prefixes
// ignore_for_file: non_constant_identifier_names, prefer_relative_imports

import 'dart:core' as $core;

import 'package:protobuf/protobuf.dart' as $pb;

import 'validation_rule.pb.dart' as $0;

export 'package:protobuf/protobuf.dart' show GeneratedMessageGenericExtensions;

/// Validation rules for a specific field
class FieldValidation extends $pb.GeneratedMessage {
  factory FieldValidation({
    $core.String? fieldDataKey,
    $core.Iterable<$0.ValidationRule>? rules,
  }) {
    final result = create();
    if (fieldDataKey != null) result.fieldDataKey = fieldDataKey;
    if (rules != null) result.rules.addAll(rules);
    return result;
  }

  FieldValidation._();

  factory FieldValidation.fromBuffer($core.List<$core.int> data,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromBuffer(data, registry);
  factory FieldValidation.fromJson($core.String json,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromJson(json, registry);

  static final $pb.BuilderInfo _i = $pb.BuilderInfo(
      _omitMessageNames ? '' : 'FieldValidation',
      package:
          const $pb.PackageName(_omitMessageNames ? '' : 'formgear.validation'),
      createEmptyInstance: create)
    ..aOS(1, _omitFieldNames ? '' : 'fieldDataKey')
    ..pPM<$0.ValidationRule>(2, _omitFieldNames ? '' : 'rules',
        subBuilder: $0.ValidationRule.create)
    ..hasRequiredFields = false;

  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  FieldValidation clone() => deepCopy();
  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  FieldValidation copyWith(void Function(FieldValidation) updates) =>
      super.copyWith((message) => updates(message as FieldValidation))
          as FieldValidation;

  @$core.override
  $pb.BuilderInfo get info_ => _i;

  @$core.pragma('dart2js:noInline')
  static FieldValidation create() => FieldValidation._();
  @$core.override
  FieldValidation createEmptyInstance() => create();
  @$core.pragma('dart2js:noInline')
  static FieldValidation getDefault() => _defaultInstance ??=
      $pb.GeneratedMessage.$_defaultFor<FieldValidation>(create);
  static FieldValidation? _defaultInstance;

  @$pb.TagNumber(1)
  $core.String get fieldDataKey => $_getSZ(0);
  @$pb.TagNumber(1)
  set fieldDataKey($core.String value) => $_setString(0, value);
  @$pb.TagNumber(1)
  $core.bool hasFieldDataKey() => $_has(0);
  @$pb.TagNumber(1)
  void clearFieldDataKey() => $_clearField(1);

  @$pb.TagNumber(2)
  $pb.PbList<$0.ValidationRule> get rules => $_getList(1);
}

/// Validation collection for a template
class ValidationCollection extends $pb.GeneratedMessage {
  factory ValidationCollection({
    $core.String? templateId,
    $core.Iterable<$core.MapEntry<$core.String, FieldValidation>>?
        fieldValidations,
  }) {
    final result = create();
    if (templateId != null) result.templateId = templateId;
    if (fieldValidations != null)
      result.fieldValidations.addEntries(fieldValidations);
    return result;
  }

  ValidationCollection._();

  factory ValidationCollection.fromBuffer($core.List<$core.int> data,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromBuffer(data, registry);
  factory ValidationCollection.fromJson($core.String json,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromJson(json, registry);

  static final $pb.BuilderInfo _i = $pb.BuilderInfo(
      _omitMessageNames ? '' : 'ValidationCollection',
      package:
          const $pb.PackageName(_omitMessageNames ? '' : 'formgear.validation'),
      createEmptyInstance: create)
    ..aOS(1, _omitFieldNames ? '' : 'templateId')
    ..m<$core.String, FieldValidation>(
        2, _omitFieldNames ? '' : 'fieldValidations',
        entryClassName: 'ValidationCollection.FieldValidationsEntry',
        keyFieldType: $pb.PbFieldType.OS,
        valueFieldType: $pb.PbFieldType.OM,
        valueCreator: FieldValidation.create,
        valueDefaultOrMaker: FieldValidation.getDefault,
        packageName: const $pb.PackageName('formgear.validation'))
    ..hasRequiredFields = false;

  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  ValidationCollection clone() => deepCopy();
  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  ValidationCollection copyWith(void Function(ValidationCollection) updates) =>
      super.copyWith((message) => updates(message as ValidationCollection))
          as ValidationCollection;

  @$core.override
  $pb.BuilderInfo get info_ => _i;

  @$core.pragma('dart2js:noInline')
  static ValidationCollection create() => ValidationCollection._();
  @$core.override
  ValidationCollection createEmptyInstance() => create();
  @$core.pragma('dart2js:noInline')
  static ValidationCollection getDefault() => _defaultInstance ??=
      $pb.GeneratedMessage.$_defaultFor<ValidationCollection>(create);
  static ValidationCollection? _defaultInstance;

  @$pb.TagNumber(1)
  $core.String get templateId => $_getSZ(0);
  @$pb.TagNumber(1)
  set templateId($core.String value) => $_setString(0, value);
  @$pb.TagNumber(1)
  $core.bool hasTemplateId() => $_has(0);
  @$pb.TagNumber(1)
  void clearTemplateId() => $_clearField(1);

  @$pb.TagNumber(2)
  $pb.PbMap<$core.String, FieldValidation> get fieldValidations => $_getMap(1);
}

const $core.bool _omitFieldNames =
    $core.bool.fromEnvironment('protobuf.omit_field_names');
const $core.bool _omitMessageNames =
    $core.bool.fromEnvironment('protobuf.omit_message_names');
