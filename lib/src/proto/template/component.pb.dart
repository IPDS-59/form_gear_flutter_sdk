// This is a generated file - do not edit.
//
// Generated from template/component.proto.

// @dart = 3.3

// ignore_for_file: annotate_overrides, camel_case_types, comment_references
// ignore_for_file: constant_identifier_names
// ignore_for_file: curly_braces_in_flow_control_structures
// ignore_for_file: deprecated_member_use_from_same_package, library_prefixes
// ignore_for_file: non_constant_identifier_names, prefer_relative_imports

import 'dart:core' as $core;

import 'package:protobuf/protobuf.dart' as $pb;

import 'component_option.pb.dart' as $0;
import 'size_constraint.pb.dart' as $1;

export 'package:protobuf/protobuf.dart' show GeneratedMessageGenericExtensions;

/// Individual form component
class Component extends $pb.GeneratedMessage {
  factory Component({
    $core.String? label,
    $core.String? dataKey,
    $core.String? description,
    $core.int? type,
    $core.bool? required,
    $core.Iterable<ComponentSection>? components,
    $core.String? enableCondition,
    $core.Iterable<$core.String>? componentEnable,
    $core.int? rows,
    $core.int? cols,
    $core.int? decimalLength,
    $core.Iterable<$0.ComponentOption>? options,
    $core.Iterable<$1.SizeConstraint>? sizeInput,
  }) {
    final result = create();
    if (label != null) result.label = label;
    if (dataKey != null) result.dataKey = dataKey;
    if (description != null) result.description = description;
    if (type != null) result.type = type;
    if (required != null) result.required = required;
    if (components != null) result.components.addAll(components);
    if (enableCondition != null) result.enableCondition = enableCondition;
    if (componentEnable != null) result.componentEnable.addAll(componentEnable);
    if (rows != null) result.rows = rows;
    if (cols != null) result.cols = cols;
    if (decimalLength != null) result.decimalLength = decimalLength;
    if (options != null) result.options.addAll(options);
    if (sizeInput != null) result.sizeInput.addAll(sizeInput);
    return result;
  }

  Component._();

  factory Component.fromBuffer($core.List<$core.int> data,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromBuffer(data, registry);
  factory Component.fromJson($core.String json,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromJson(json, registry);

  static final $pb.BuilderInfo _i = $pb.BuilderInfo(
      _omitMessageNames ? '' : 'Component',
      package:
          const $pb.PackageName(_omitMessageNames ? '' : 'formgear.template'),
      createEmptyInstance: create)
    ..aOS(1, _omitFieldNames ? '' : 'label')
    ..aOS(2, _omitFieldNames ? '' : 'dataKey')
    ..aOS(3, _omitFieldNames ? '' : 'description')
    ..aI(4, _omitFieldNames ? '' : 'type')
    ..aOB(5, _omitFieldNames ? '' : 'required')
    ..pPM<ComponentSection>(6, _omitFieldNames ? '' : 'components',
        subBuilder: ComponentSection.create)
    ..aOS(7, _omitFieldNames ? '' : 'enableCondition')
    ..pPS(8, _omitFieldNames ? '' : 'componentEnable')
    ..aI(10, _omitFieldNames ? '' : 'rows')
    ..aI(11, _omitFieldNames ? '' : 'cols')
    ..aI(12, _omitFieldNames ? '' : 'decimalLength')
    ..pPM<$0.ComponentOption>(13, _omitFieldNames ? '' : 'options',
        subBuilder: $0.ComponentOption.create)
    ..pPM<$1.SizeConstraint>(14, _omitFieldNames ? '' : 'sizeInput',
        subBuilder: $1.SizeConstraint.create)
    ..hasRequiredFields = false;

  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  Component clone() => deepCopy();
  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  Component copyWith(void Function(Component) updates) =>
      super.copyWith((message) => updates(message as Component)) as Component;

  @$core.override
  $pb.BuilderInfo get info_ => _i;

  @$core.pragma('dart2js:noInline')
  static Component create() => Component._();
  @$core.override
  Component createEmptyInstance() => create();
  @$core.pragma('dart2js:noInline')
  static Component getDefault() =>
      _defaultInstance ??= $pb.GeneratedMessage.$_defaultFor<Component>(create);
  static Component? _defaultInstance;

  @$pb.TagNumber(1)
  $core.String get label => $_getSZ(0);
  @$pb.TagNumber(1)
  set label($core.String value) => $_setString(0, value);
  @$pb.TagNumber(1)
  $core.bool hasLabel() => $_has(0);
  @$pb.TagNumber(1)
  void clearLabel() => $_clearField(1);

  @$pb.TagNumber(2)
  $core.String get dataKey => $_getSZ(1);
  @$pb.TagNumber(2)
  set dataKey($core.String value) => $_setString(1, value);
  @$pb.TagNumber(2)
  $core.bool hasDataKey() => $_has(1);
  @$pb.TagNumber(2)
  void clearDataKey() => $_clearField(2);

  @$pb.TagNumber(3)
  $core.String get description => $_getSZ(2);
  @$pb.TagNumber(3)
  set description($core.String value) => $_setString(2, value);
  @$pb.TagNumber(3)
  $core.bool hasDescription() => $_has(2);
  @$pb.TagNumber(3)
  void clearDescription() => $_clearField(3);

  @$pb.TagNumber(4)
  $core.int get type => $_getIZ(3);
  @$pb.TagNumber(4)
  set type($core.int value) => $_setSignedInt32(3, value);
  @$pb.TagNumber(4)
  $core.bool hasType() => $_has(3);
  @$pb.TagNumber(4)
  void clearType() => $_clearField(4);

  @$pb.TagNumber(5)
  $core.bool get required => $_getBF(4);
  @$pb.TagNumber(5)
  set required($core.bool value) => $_setBool(4, value);
  @$pb.TagNumber(5)
  $core.bool hasRequired() => $_has(4);
  @$pb.TagNumber(5)
  void clearRequired() => $_clearField(5);

  /// Nested components for sections
  @$pb.TagNumber(6)
  $pb.PbList<ComponentSection> get components => $_getList(5);

  /// Conditional rendering
  @$pb.TagNumber(7)
  $core.String get enableCondition => $_getSZ(6);
  @$pb.TagNumber(7)
  set enableCondition($core.String value) => $_setString(6, value);
  @$pb.TagNumber(7)
  $core.bool hasEnableCondition() => $_has(6);
  @$pb.TagNumber(7)
  void clearEnableCondition() => $_clearField(7);

  @$pb.TagNumber(8)
  $pb.PbList<$core.String> get componentEnable => $_getList(7);

  /// Input-specific properties
  @$pb.TagNumber(10)
  $core.int get rows => $_getIZ(8);
  @$pb.TagNumber(10)
  set rows($core.int value) => $_setSignedInt32(8, value);
  @$pb.TagNumber(10)
  $core.bool hasRows() => $_has(8);
  @$pb.TagNumber(10)
  void clearRows() => $_clearField(10);

  @$pb.TagNumber(11)
  $core.int get cols => $_getIZ(9);
  @$pb.TagNumber(11)
  set cols($core.int value) => $_setSignedInt32(9, value);
  @$pb.TagNumber(11)
  $core.bool hasCols() => $_has(9);
  @$pb.TagNumber(11)
  void clearCols() => $_clearField(11);

  @$pb.TagNumber(12)
  $core.int get decimalLength => $_getIZ(10);
  @$pb.TagNumber(12)
  set decimalLength($core.int value) => $_setSignedInt32(10, value);
  @$pb.TagNumber(12)
  $core.bool hasDecimalLength() => $_has(10);
  @$pb.TagNumber(12)
  void clearDecimalLength() => $_clearField(12);

  /// Options for select/radio/checkbox
  @$pb.TagNumber(13)
  $pb.PbList<$0.ComponentOption> get options => $_getList(11);

  /// Size constraints for CSV input
  @$pb.TagNumber(14)
  $pb.PbList<$1.SizeConstraint> get sizeInput => $_getList(12);
}

/// Forward declaration for circular dependency
class ComponentSection extends $pb.GeneratedMessage {
  factory ComponentSection({
    $core.Iterable<Component>? components,
  }) {
    final result = create();
    if (components != null) result.components.addAll(components);
    return result;
  }

  ComponentSection._();

  factory ComponentSection.fromBuffer($core.List<$core.int> data,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromBuffer(data, registry);
  factory ComponentSection.fromJson($core.String json,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromJson(json, registry);

  static final $pb.BuilderInfo _i = $pb.BuilderInfo(
      _omitMessageNames ? '' : 'ComponentSection',
      package:
          const $pb.PackageName(_omitMessageNames ? '' : 'formgear.template'),
      createEmptyInstance: create)
    ..pPM<Component>(1, _omitFieldNames ? '' : 'components',
        subBuilder: Component.create)
    ..hasRequiredFields = false;

  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  ComponentSection clone() => deepCopy();
  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  ComponentSection copyWith(void Function(ComponentSection) updates) =>
      super.copyWith((message) => updates(message as ComponentSection))
          as ComponentSection;

  @$core.override
  $pb.BuilderInfo get info_ => _i;

  @$core.pragma('dart2js:noInline')
  static ComponentSection create() => ComponentSection._();
  @$core.override
  ComponentSection createEmptyInstance() => create();
  @$core.pragma('dart2js:noInline')
  static ComponentSection getDefault() => _defaultInstance ??=
      $pb.GeneratedMessage.$_defaultFor<ComponentSection>(create);
  static ComponentSection? _defaultInstance;

  @$pb.TagNumber(1)
  $pb.PbList<Component> get components => $_getList(0);
}

const $core.bool _omitFieldNames =
    $core.bool.fromEnvironment('protobuf.omit_field_names');
const $core.bool _omitMessageNames =
    $core.bool.fromEnvironment('protobuf.omit_message_names');
