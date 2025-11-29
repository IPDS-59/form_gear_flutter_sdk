// This is a generated file - do not edit.
//
// Generated from validation/validation_rule.proto.

// @dart = 3.3

// ignore_for_file: annotate_overrides, camel_case_types, comment_references
// ignore_for_file: constant_identifier_names
// ignore_for_file: curly_braces_in_flow_control_structures
// ignore_for_file: deprecated_member_use_from_same_package, library_prefixes
// ignore_for_file: non_constant_identifier_names, prefer_relative_imports

import 'dart:core' as $core;

import 'package:protobuf/protobuf.dart' as $pb;

import 'validation_rules.pb.dart' as $0;
import 'validation_type.pbenum.dart' as $1;

export 'package:protobuf/protobuf.dart' show GeneratedMessageGenericExtensions;

enum ValidationRule_Condition {
  range,
  regex,
  dependency,
  length,
  custom,
  notSet
}

/// Validation rule
class ValidationRule extends $pb.GeneratedMessage {
  factory ValidationRule({
    $core.String? ruleId,
    $1.ValidationType? type,
    $core.String? errorMessage,
    $0.RangeValidation? range,
    $0.RegexValidation? regex,
    $0.DependencyValidation? dependency,
    $0.LengthValidation? length,
    $0.CustomValidation? custom,
  }) {
    final result = create();
    if (ruleId != null) result.ruleId = ruleId;
    if (type != null) result.type = type;
    if (errorMessage != null) result.errorMessage = errorMessage;
    if (range != null) result.range = range;
    if (regex != null) result.regex = regex;
    if (dependency != null) result.dependency = dependency;
    if (length != null) result.length = length;
    if (custom != null) result.custom = custom;
    return result;
  }

  ValidationRule._();

  factory ValidationRule.fromBuffer($core.List<$core.int> data,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromBuffer(data, registry);
  factory ValidationRule.fromJson($core.String json,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromJson(json, registry);

  static const $core.Map<$core.int, ValidationRule_Condition>
      _ValidationRule_ConditionByTag = {
    10: ValidationRule_Condition.range,
    11: ValidationRule_Condition.regex,
    12: ValidationRule_Condition.dependency,
    13: ValidationRule_Condition.length,
    14: ValidationRule_Condition.custom,
    0: ValidationRule_Condition.notSet
  };
  static final $pb.BuilderInfo _i = $pb.BuilderInfo(
      _omitMessageNames ? '' : 'ValidationRule',
      package:
          const $pb.PackageName(_omitMessageNames ? '' : 'formgear.validation'),
      createEmptyInstance: create)
    ..oo(0, [10, 11, 12, 13, 14])
    ..aOS(1, _omitFieldNames ? '' : 'ruleId')
    ..aE<$1.ValidationType>(2, _omitFieldNames ? '' : 'type',
        enumValues: $1.ValidationType.values)
    ..aOS(3, _omitFieldNames ? '' : 'errorMessage')
    ..aOM<$0.RangeValidation>(10, _omitFieldNames ? '' : 'range',
        subBuilder: $0.RangeValidation.create)
    ..aOM<$0.RegexValidation>(11, _omitFieldNames ? '' : 'regex',
        subBuilder: $0.RegexValidation.create)
    ..aOM<$0.DependencyValidation>(12, _omitFieldNames ? '' : 'dependency',
        subBuilder: $0.DependencyValidation.create)
    ..aOM<$0.LengthValidation>(13, _omitFieldNames ? '' : 'length',
        subBuilder: $0.LengthValidation.create)
    ..aOM<$0.CustomValidation>(14, _omitFieldNames ? '' : 'custom',
        subBuilder: $0.CustomValidation.create)
    ..hasRequiredFields = false;

  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  ValidationRule clone() => deepCopy();
  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  ValidationRule copyWith(void Function(ValidationRule) updates) =>
      super.copyWith((message) => updates(message as ValidationRule))
          as ValidationRule;

  @$core.override
  $pb.BuilderInfo get info_ => _i;

  @$core.pragma('dart2js:noInline')
  static ValidationRule create() => ValidationRule._();
  @$core.override
  ValidationRule createEmptyInstance() => create();
  @$core.pragma('dart2js:noInline')
  static ValidationRule getDefault() => _defaultInstance ??=
      $pb.GeneratedMessage.$_defaultFor<ValidationRule>(create);
  static ValidationRule? _defaultInstance;

  @$pb.TagNumber(10)
  @$pb.TagNumber(11)
  @$pb.TagNumber(12)
  @$pb.TagNumber(13)
  @$pb.TagNumber(14)
  ValidationRule_Condition whichCondition() =>
      _ValidationRule_ConditionByTag[$_whichOneof(0)]!;
  @$pb.TagNumber(10)
  @$pb.TagNumber(11)
  @$pb.TagNumber(12)
  @$pb.TagNumber(13)
  @$pb.TagNumber(14)
  void clearCondition() => $_clearField($_whichOneof(0));

  @$pb.TagNumber(1)
  $core.String get ruleId => $_getSZ(0);
  @$pb.TagNumber(1)
  set ruleId($core.String value) => $_setString(0, value);
  @$pb.TagNumber(1)
  $core.bool hasRuleId() => $_has(0);
  @$pb.TagNumber(1)
  void clearRuleId() => $_clearField(1);

  @$pb.TagNumber(2)
  $1.ValidationType get type => $_getN(1);
  @$pb.TagNumber(2)
  set type($1.ValidationType value) => $_setField(2, value);
  @$pb.TagNumber(2)
  $core.bool hasType() => $_has(1);
  @$pb.TagNumber(2)
  void clearType() => $_clearField(2);

  @$pb.TagNumber(3)
  $core.String get errorMessage => $_getSZ(2);
  @$pb.TagNumber(3)
  set errorMessage($core.String value) => $_setString(2, value);
  @$pb.TagNumber(3)
  $core.bool hasErrorMessage() => $_has(2);
  @$pb.TagNumber(3)
  void clearErrorMessage() => $_clearField(3);

  @$pb.TagNumber(10)
  $0.RangeValidation get range => $_getN(3);
  @$pb.TagNumber(10)
  set range($0.RangeValidation value) => $_setField(10, value);
  @$pb.TagNumber(10)
  $core.bool hasRange() => $_has(3);
  @$pb.TagNumber(10)
  void clearRange() => $_clearField(10);
  @$pb.TagNumber(10)
  $0.RangeValidation ensureRange() => $_ensure(3);

  @$pb.TagNumber(11)
  $0.RegexValidation get regex => $_getN(4);
  @$pb.TagNumber(11)
  set regex($0.RegexValidation value) => $_setField(11, value);
  @$pb.TagNumber(11)
  $core.bool hasRegex() => $_has(4);
  @$pb.TagNumber(11)
  void clearRegex() => $_clearField(11);
  @$pb.TagNumber(11)
  $0.RegexValidation ensureRegex() => $_ensure(4);

  @$pb.TagNumber(12)
  $0.DependencyValidation get dependency => $_getN(5);
  @$pb.TagNumber(12)
  set dependency($0.DependencyValidation value) => $_setField(12, value);
  @$pb.TagNumber(12)
  $core.bool hasDependency() => $_has(5);
  @$pb.TagNumber(12)
  void clearDependency() => $_clearField(12);
  @$pb.TagNumber(12)
  $0.DependencyValidation ensureDependency() => $_ensure(5);

  @$pb.TagNumber(13)
  $0.LengthValidation get length => $_getN(6);
  @$pb.TagNumber(13)
  set length($0.LengthValidation value) => $_setField(13, value);
  @$pb.TagNumber(13)
  $core.bool hasLength() => $_has(6);
  @$pb.TagNumber(13)
  void clearLength() => $_clearField(13);
  @$pb.TagNumber(13)
  $0.LengthValidation ensureLength() => $_ensure(6);

  @$pb.TagNumber(14)
  $0.CustomValidation get custom => $_getN(7);
  @$pb.TagNumber(14)
  set custom($0.CustomValidation value) => $_setField(14, value);
  @$pb.TagNumber(14)
  $core.bool hasCustom() => $_has(7);
  @$pb.TagNumber(14)
  void clearCustom() => $_clearField(14);
  @$pb.TagNumber(14)
  $0.CustomValidation ensureCustom() => $_ensure(7);
}

const $core.bool _omitFieldNames =
    $core.bool.fromEnvironment('protobuf.omit_field_names');
const $core.bool _omitMessageNames =
    $core.bool.fromEnvironment('protobuf.omit_message_names');
