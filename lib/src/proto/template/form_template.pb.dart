// This is a generated file - do not edit.
//
// Generated from template/form_template.proto.

// @dart = 3.3

// ignore_for_file: annotate_overrides, camel_case_types, comment_references
// ignore_for_file: constant_identifier_names
// ignore_for_file: curly_braces_in_flow_control_structures
// ignore_for_file: deprecated_member_use_from_same_package, library_prefixes
// ignore_for_file: non_constant_identifier_names, prefer_relative_imports

import 'dart:core' as $core;

import 'package:protobuf/protobuf.dart' as $pb;

import 'component.pb.dart' as $0;

export 'package:protobuf/protobuf.dart' show GeneratedMessageGenericExtensions;

/// Main form template structure
class FormTemplate extends $pb.GeneratedMessage {
  factory FormTemplate({
    $core.String? description,
    $core.String? dataKey,
    $core.String? title,
    $core.String? acronym,
    $core.String? version,
    $core.Iterable<$0.ComponentSection>? components,
  }) {
    final result = create();
    if (description != null) result.description = description;
    if (dataKey != null) result.dataKey = dataKey;
    if (title != null) result.title = title;
    if (acronym != null) result.acronym = acronym;
    if (version != null) result.version = version;
    if (components != null) result.components.addAll(components);
    return result;
  }

  FormTemplate._();

  factory FormTemplate.fromBuffer($core.List<$core.int> data,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromBuffer(data, registry);
  factory FormTemplate.fromJson($core.String json,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromJson(json, registry);

  static final $pb.BuilderInfo _i = $pb.BuilderInfo(
      _omitMessageNames ? '' : 'FormTemplate',
      package:
          const $pb.PackageName(_omitMessageNames ? '' : 'formgear.template'),
      createEmptyInstance: create)
    ..aOS(1, _omitFieldNames ? '' : 'description')
    ..aOS(2, _omitFieldNames ? '' : 'dataKey')
    ..aOS(3, _omitFieldNames ? '' : 'title')
    ..aOS(4, _omitFieldNames ? '' : 'acronym')
    ..aOS(5, _omitFieldNames ? '' : 'version')
    ..pPM<$0.ComponentSection>(6, _omitFieldNames ? '' : 'components',
        subBuilder: $0.ComponentSection.create)
    ..hasRequiredFields = false;

  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  FormTemplate clone() => deepCopy();
  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  FormTemplate copyWith(void Function(FormTemplate) updates) =>
      super.copyWith((message) => updates(message as FormTemplate))
          as FormTemplate;

  @$core.override
  $pb.BuilderInfo get info_ => _i;

  @$core.pragma('dart2js:noInline')
  static FormTemplate create() => FormTemplate._();
  @$core.override
  FormTemplate createEmptyInstance() => create();
  @$core.pragma('dart2js:noInline')
  static FormTemplate getDefault() => _defaultInstance ??=
      $pb.GeneratedMessage.$_defaultFor<FormTemplate>(create);
  static FormTemplate? _defaultInstance;

  @$pb.TagNumber(1)
  $core.String get description => $_getSZ(0);
  @$pb.TagNumber(1)
  set description($core.String value) => $_setString(0, value);
  @$pb.TagNumber(1)
  $core.bool hasDescription() => $_has(0);
  @$pb.TagNumber(1)
  void clearDescription() => $_clearField(1);

  @$pb.TagNumber(2)
  $core.String get dataKey => $_getSZ(1);
  @$pb.TagNumber(2)
  set dataKey($core.String value) => $_setString(1, value);
  @$pb.TagNumber(2)
  $core.bool hasDataKey() => $_has(1);
  @$pb.TagNumber(2)
  void clearDataKey() => $_clearField(2);

  @$pb.TagNumber(3)
  $core.String get title => $_getSZ(2);
  @$pb.TagNumber(3)
  set title($core.String value) => $_setString(2, value);
  @$pb.TagNumber(3)
  $core.bool hasTitle() => $_has(2);
  @$pb.TagNumber(3)
  void clearTitle() => $_clearField(3);

  @$pb.TagNumber(4)
  $core.String get acronym => $_getSZ(3);
  @$pb.TagNumber(4)
  set acronym($core.String value) => $_setString(3, value);
  @$pb.TagNumber(4)
  $core.bool hasAcronym() => $_has(3);
  @$pb.TagNumber(4)
  void clearAcronym() => $_clearField(4);

  @$pb.TagNumber(5)
  $core.String get version => $_getSZ(4);
  @$pb.TagNumber(5)
  set version($core.String value) => $_setString(4, value);
  @$pb.TagNumber(5)
  $core.bool hasVersion() => $_has(4);
  @$pb.TagNumber(5)
  void clearVersion() => $_clearField(5);

  @$pb.TagNumber(6)
  $pb.PbList<$0.ComponentSection> get components => $_getList(5);
}

const $core.bool _omitFieldNames =
    $core.bool.fromEnvironment('protobuf.omit_field_names');
const $core.bool _omitMessageNames =
    $core.bool.fromEnvironment('protobuf.omit_message_names');
