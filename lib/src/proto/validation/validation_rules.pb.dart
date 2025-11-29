// This is a generated file - do not edit.
//
// Generated from validation/validation_rules.proto.

// @dart = 3.3

// ignore_for_file: annotate_overrides, camel_case_types, comment_references
// ignore_for_file: constant_identifier_names
// ignore_for_file: curly_braces_in_flow_control_structures
// ignore_for_file: deprecated_member_use_from_same_package, library_prefixes
// ignore_for_file: non_constant_identifier_names, prefer_relative_imports

import 'dart:core' as $core;

import 'package:protobuf/protobuf.dart' as $pb;

export 'package:protobuf/protobuf.dart' show GeneratedMessageGenericExtensions;

/// Range validation
class RangeValidation extends $pb.GeneratedMessage {
  factory RangeValidation({
    $core.double? min,
    $core.double? max,
    $core.bool? minInclusive,
    $core.bool? maxInclusive,
  }) {
    final result = create();
    if (min != null) result.min = min;
    if (max != null) result.max = max;
    if (minInclusive != null) result.minInclusive = minInclusive;
    if (maxInclusive != null) result.maxInclusive = maxInclusive;
    return result;
  }

  RangeValidation._();

  factory RangeValidation.fromBuffer($core.List<$core.int> data,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromBuffer(data, registry);
  factory RangeValidation.fromJson($core.String json,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromJson(json, registry);

  static final $pb.BuilderInfo _i = $pb.BuilderInfo(
      _omitMessageNames ? '' : 'RangeValidation',
      package:
          const $pb.PackageName(_omitMessageNames ? '' : 'formgear.validation'),
      createEmptyInstance: create)
    ..aD(1, _omitFieldNames ? '' : 'min')
    ..aD(2, _omitFieldNames ? '' : 'max')
    ..aOB(3, _omitFieldNames ? '' : 'minInclusive')
    ..aOB(4, _omitFieldNames ? '' : 'maxInclusive')
    ..hasRequiredFields = false;

  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  RangeValidation clone() => deepCopy();
  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  RangeValidation copyWith(void Function(RangeValidation) updates) =>
      super.copyWith((message) => updates(message as RangeValidation))
          as RangeValidation;

  @$core.override
  $pb.BuilderInfo get info_ => _i;

  @$core.pragma('dart2js:noInline')
  static RangeValidation create() => RangeValidation._();
  @$core.override
  RangeValidation createEmptyInstance() => create();
  @$core.pragma('dart2js:noInline')
  static RangeValidation getDefault() => _defaultInstance ??=
      $pb.GeneratedMessage.$_defaultFor<RangeValidation>(create);
  static RangeValidation? _defaultInstance;

  @$pb.TagNumber(1)
  $core.double get min => $_getN(0);
  @$pb.TagNumber(1)
  set min($core.double value) => $_setDouble(0, value);
  @$pb.TagNumber(1)
  $core.bool hasMin() => $_has(0);
  @$pb.TagNumber(1)
  void clearMin() => $_clearField(1);

  @$pb.TagNumber(2)
  $core.double get max => $_getN(1);
  @$pb.TagNumber(2)
  set max($core.double value) => $_setDouble(1, value);
  @$pb.TagNumber(2)
  $core.bool hasMax() => $_has(1);
  @$pb.TagNumber(2)
  void clearMax() => $_clearField(2);

  @$pb.TagNumber(3)
  $core.bool get minInclusive => $_getBF(2);
  @$pb.TagNumber(3)
  set minInclusive($core.bool value) => $_setBool(2, value);
  @$pb.TagNumber(3)
  $core.bool hasMinInclusive() => $_has(2);
  @$pb.TagNumber(3)
  void clearMinInclusive() => $_clearField(3);

  @$pb.TagNumber(4)
  $core.bool get maxInclusive => $_getBF(3);
  @$pb.TagNumber(4)
  set maxInclusive($core.bool value) => $_setBool(3, value);
  @$pb.TagNumber(4)
  $core.bool hasMaxInclusive() => $_has(3);
  @$pb.TagNumber(4)
  void clearMaxInclusive() => $_clearField(4);
}

/// Pattern (regex) validation
class RegexValidation extends $pb.GeneratedMessage {
  factory RegexValidation({
    $core.String? pattern,
    $core.String? flags,
  }) {
    final result = create();
    if (pattern != null) result.pattern = pattern;
    if (flags != null) result.flags = flags;
    return result;
  }

  RegexValidation._();

  factory RegexValidation.fromBuffer($core.List<$core.int> data,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromBuffer(data, registry);
  factory RegexValidation.fromJson($core.String json,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromJson(json, registry);

  static final $pb.BuilderInfo _i = $pb.BuilderInfo(
      _omitMessageNames ? '' : 'RegexValidation',
      package:
          const $pb.PackageName(_omitMessageNames ? '' : 'formgear.validation'),
      createEmptyInstance: create)
    ..aOS(1, _omitFieldNames ? '' : 'pattern')
    ..aOS(2, _omitFieldNames ? '' : 'flags')
    ..hasRequiredFields = false;

  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  RegexValidation clone() => deepCopy();
  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  RegexValidation copyWith(void Function(RegexValidation) updates) =>
      super.copyWith((message) => updates(message as RegexValidation))
          as RegexValidation;

  @$core.override
  $pb.BuilderInfo get info_ => _i;

  @$core.pragma('dart2js:noInline')
  static RegexValidation create() => RegexValidation._();
  @$core.override
  RegexValidation createEmptyInstance() => create();
  @$core.pragma('dart2js:noInline')
  static RegexValidation getDefault() => _defaultInstance ??=
      $pb.GeneratedMessage.$_defaultFor<RegexValidation>(create);
  static RegexValidation? _defaultInstance;

  @$pb.TagNumber(1)
  $core.String get pattern => $_getSZ(0);
  @$pb.TagNumber(1)
  set pattern($core.String value) => $_setString(0, value);
  @$pb.TagNumber(1)
  $core.bool hasPattern() => $_has(0);
  @$pb.TagNumber(1)
  void clearPattern() => $_clearField(1);

  @$pb.TagNumber(2)
  $core.String get flags => $_getSZ(1);
  @$pb.TagNumber(2)
  set flags($core.String value) => $_setString(1, value);
  @$pb.TagNumber(2)
  $core.bool hasFlags() => $_has(1);
  @$pb.TagNumber(2)
  void clearFlags() => $_clearField(2);
}

/// Cross-field dependency validation
class DependencyValidation extends $pb.GeneratedMessage {
  factory DependencyValidation({
    $core.String? dependsOnField,
    $core.String? comparisonOperator,
    $core.String? expectedValue,
  }) {
    final result = create();
    if (dependsOnField != null) result.dependsOnField = dependsOnField;
    if (comparisonOperator != null)
      result.comparisonOperator = comparisonOperator;
    if (expectedValue != null) result.expectedValue = expectedValue;
    return result;
  }

  DependencyValidation._();

  factory DependencyValidation.fromBuffer($core.List<$core.int> data,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromBuffer(data, registry);
  factory DependencyValidation.fromJson($core.String json,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromJson(json, registry);

  static final $pb.BuilderInfo _i = $pb.BuilderInfo(
      _omitMessageNames ? '' : 'DependencyValidation',
      package:
          const $pb.PackageName(_omitMessageNames ? '' : 'formgear.validation'),
      createEmptyInstance: create)
    ..aOS(1, _omitFieldNames ? '' : 'dependsOnField')
    ..aOS(2, _omitFieldNames ? '' : 'comparisonOperator')
    ..aOS(3, _omitFieldNames ? '' : 'expectedValue')
    ..hasRequiredFields = false;

  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  DependencyValidation clone() => deepCopy();
  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  DependencyValidation copyWith(void Function(DependencyValidation) updates) =>
      super.copyWith((message) => updates(message as DependencyValidation))
          as DependencyValidation;

  @$core.override
  $pb.BuilderInfo get info_ => _i;

  @$core.pragma('dart2js:noInline')
  static DependencyValidation create() => DependencyValidation._();
  @$core.override
  DependencyValidation createEmptyInstance() => create();
  @$core.pragma('dart2js:noInline')
  static DependencyValidation getDefault() => _defaultInstance ??=
      $pb.GeneratedMessage.$_defaultFor<DependencyValidation>(create);
  static DependencyValidation? _defaultInstance;

  @$pb.TagNumber(1)
  $core.String get dependsOnField => $_getSZ(0);
  @$pb.TagNumber(1)
  set dependsOnField($core.String value) => $_setString(0, value);
  @$pb.TagNumber(1)
  $core.bool hasDependsOnField() => $_has(0);
  @$pb.TagNumber(1)
  void clearDependsOnField() => $_clearField(1);

  @$pb.TagNumber(2)
  $core.String get comparisonOperator => $_getSZ(1);
  @$pb.TagNumber(2)
  set comparisonOperator($core.String value) => $_setString(1, value);
  @$pb.TagNumber(2)
  $core.bool hasComparisonOperator() => $_has(1);
  @$pb.TagNumber(2)
  void clearComparisonOperator() => $_clearField(2);

  @$pb.TagNumber(3)
  $core.String get expectedValue => $_getSZ(2);
  @$pb.TagNumber(3)
  set expectedValue($core.String value) => $_setString(2, value);
  @$pb.TagNumber(3)
  $core.bool hasExpectedValue() => $_has(2);
  @$pb.TagNumber(3)
  void clearExpectedValue() => $_clearField(3);
}

/// Length validation
class LengthValidation extends $pb.GeneratedMessage {
  factory LengthValidation({
    $core.int? min,
    $core.int? max,
  }) {
    final result = create();
    if (min != null) result.min = min;
    if (max != null) result.max = max;
    return result;
  }

  LengthValidation._();

  factory LengthValidation.fromBuffer($core.List<$core.int> data,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromBuffer(data, registry);
  factory LengthValidation.fromJson($core.String json,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromJson(json, registry);

  static final $pb.BuilderInfo _i = $pb.BuilderInfo(
      _omitMessageNames ? '' : 'LengthValidation',
      package:
          const $pb.PackageName(_omitMessageNames ? '' : 'formgear.validation'),
      createEmptyInstance: create)
    ..aI(1, _omitFieldNames ? '' : 'min')
    ..aI(2, _omitFieldNames ? '' : 'max')
    ..hasRequiredFields = false;

  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  LengthValidation clone() => deepCopy();
  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  LengthValidation copyWith(void Function(LengthValidation) updates) =>
      super.copyWith((message) => updates(message as LengthValidation))
          as LengthValidation;

  @$core.override
  $pb.BuilderInfo get info_ => _i;

  @$core.pragma('dart2js:noInline')
  static LengthValidation create() => LengthValidation._();
  @$core.override
  LengthValidation createEmptyInstance() => create();
  @$core.pragma('dart2js:noInline')
  static LengthValidation getDefault() => _defaultInstance ??=
      $pb.GeneratedMessage.$_defaultFor<LengthValidation>(create);
  static LengthValidation? _defaultInstance;

  @$pb.TagNumber(1)
  $core.int get min => $_getIZ(0);
  @$pb.TagNumber(1)
  set min($core.int value) => $_setSignedInt32(0, value);
  @$pb.TagNumber(1)
  $core.bool hasMin() => $_has(0);
  @$pb.TagNumber(1)
  void clearMin() => $_clearField(1);

  @$pb.TagNumber(2)
  $core.int get max => $_getIZ(1);
  @$pb.TagNumber(2)
  set max($core.int value) => $_setSignedInt32(1, value);
  @$pb.TagNumber(2)
  $core.bool hasMax() => $_has(1);
  @$pb.TagNumber(2)
  void clearMax() => $_clearField(2);
}

/// Custom validation rule
class CustomValidation extends $pb.GeneratedMessage {
  factory CustomValidation({
    $core.String? expression,
    $core.String? errorMessage,
  }) {
    final result = create();
    if (expression != null) result.expression = expression;
    if (errorMessage != null) result.errorMessage = errorMessage;
    return result;
  }

  CustomValidation._();

  factory CustomValidation.fromBuffer($core.List<$core.int> data,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromBuffer(data, registry);
  factory CustomValidation.fromJson($core.String json,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromJson(json, registry);

  static final $pb.BuilderInfo _i = $pb.BuilderInfo(
      _omitMessageNames ? '' : 'CustomValidation',
      package:
          const $pb.PackageName(_omitMessageNames ? '' : 'formgear.validation'),
      createEmptyInstance: create)
    ..aOS(1, _omitFieldNames ? '' : 'expression')
    ..aOS(2, _omitFieldNames ? '' : 'errorMessage')
    ..hasRequiredFields = false;

  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  CustomValidation clone() => deepCopy();
  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  CustomValidation copyWith(void Function(CustomValidation) updates) =>
      super.copyWith((message) => updates(message as CustomValidation))
          as CustomValidation;

  @$core.override
  $pb.BuilderInfo get info_ => _i;

  @$core.pragma('dart2js:noInline')
  static CustomValidation create() => CustomValidation._();
  @$core.override
  CustomValidation createEmptyInstance() => create();
  @$core.pragma('dart2js:noInline')
  static CustomValidation getDefault() => _defaultInstance ??=
      $pb.GeneratedMessage.$_defaultFor<CustomValidation>(create);
  static CustomValidation? _defaultInstance;

  @$pb.TagNumber(1)
  $core.String get expression => $_getSZ(0);
  @$pb.TagNumber(1)
  set expression($core.String value) => $_setString(0, value);
  @$pb.TagNumber(1)
  $core.bool hasExpression() => $_has(0);
  @$pb.TagNumber(1)
  void clearExpression() => $_clearField(1);

  @$pb.TagNumber(2)
  $core.String get errorMessage => $_getSZ(1);
  @$pb.TagNumber(2)
  set errorMessage($core.String value) => $_setString(1, value);
  @$pb.TagNumber(2)
  $core.bool hasErrorMessage() => $_has(1);
  @$pb.TagNumber(2)
  void clearErrorMessage() => $_clearField(2);
}

const $core.bool _omitFieldNames =
    $core.bool.fromEnvironment('protobuf.omit_field_names');
const $core.bool _omitMessageNames =
    $core.bool.fromEnvironment('protobuf.omit_message_names');
