// This is a generated file - do not edit.
//
// Generated from engine/engine_assets.proto.

// @dart = 3.3

// ignore_for_file: annotate_overrides, camel_case_types, comment_references
// ignore_for_file: constant_identifier_names
// ignore_for_file: curly_braces_in_flow_control_structures
// ignore_for_file: deprecated_member_use_from_same_package, library_prefixes
// ignore_for_file: non_constant_identifier_names, prefer_relative_imports

import 'dart:core' as $core;

import 'package:protobuf/protobuf.dart' as $pb;

import 'engine_type.pbenum.dart' as $1;
import 'engine_version.pb.dart' as $0;

export 'package:protobuf/protobuf.dart' show GeneratedMessageGenericExtensions;

/// Engine assets bundle
class EngineAssets extends $pb.GeneratedMessage {
  factory EngineAssets({
    $1.FormEngineType? engineType,
    $core.String? htmlTemplate,
    $core.String? jsContent,
    $core.String? cssContent,
    $0.EngineVersion? version,
    $core.Iterable<$core.MapEntry<$core.String, $core.bool>>? featureFlags,
  }) {
    final result = create();
    if (engineType != null) result.engineType = engineType;
    if (htmlTemplate != null) result.htmlTemplate = htmlTemplate;
    if (jsContent != null) result.jsContent = jsContent;
    if (cssContent != null) result.cssContent = cssContent;
    if (version != null) result.version = version;
    if (featureFlags != null) result.featureFlags.addEntries(featureFlags);
    return result;
  }

  EngineAssets._();

  factory EngineAssets.fromBuffer($core.List<$core.int> data,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromBuffer(data, registry);
  factory EngineAssets.fromJson($core.String json,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromJson(json, registry);

  static final $pb.BuilderInfo _i = $pb.BuilderInfo(
      _omitMessageNames ? '' : 'EngineAssets',
      package:
          const $pb.PackageName(_omitMessageNames ? '' : 'formgear.engine'),
      createEmptyInstance: create)
    ..aE<$1.FormEngineType>(1, _omitFieldNames ? '' : 'engineType',
        enumValues: $1.FormEngineType.values)
    ..aOS(2, _omitFieldNames ? '' : 'htmlTemplate')
    ..aOS(3, _omitFieldNames ? '' : 'jsContent')
    ..aOS(4, _omitFieldNames ? '' : 'cssContent')
    ..aOM<$0.EngineVersion>(5, _omitFieldNames ? '' : 'version',
        subBuilder: $0.EngineVersion.create)
    ..m<$core.String, $core.bool>(6, _omitFieldNames ? '' : 'featureFlags',
        entryClassName: 'EngineAssets.FeatureFlagsEntry',
        keyFieldType: $pb.PbFieldType.OS,
        valueFieldType: $pb.PbFieldType.OB,
        packageName: const $pb.PackageName('formgear.engine'))
    ..hasRequiredFields = false;

  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  EngineAssets clone() => deepCopy();
  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  EngineAssets copyWith(void Function(EngineAssets) updates) =>
      super.copyWith((message) => updates(message as EngineAssets))
          as EngineAssets;

  @$core.override
  $pb.BuilderInfo get info_ => _i;

  @$core.pragma('dart2js:noInline')
  static EngineAssets create() => EngineAssets._();
  @$core.override
  EngineAssets createEmptyInstance() => create();
  @$core.pragma('dart2js:noInline')
  static EngineAssets getDefault() => _defaultInstance ??=
      $pb.GeneratedMessage.$_defaultFor<EngineAssets>(create);
  static EngineAssets? _defaultInstance;

  @$pb.TagNumber(1)
  $1.FormEngineType get engineType => $_getN(0);
  @$pb.TagNumber(1)
  set engineType($1.FormEngineType value) => $_setField(1, value);
  @$pb.TagNumber(1)
  $core.bool hasEngineType() => $_has(0);
  @$pb.TagNumber(1)
  void clearEngineType() => $_clearField(1);

  @$pb.TagNumber(2)
  $core.String get htmlTemplate => $_getSZ(1);
  @$pb.TagNumber(2)
  set htmlTemplate($core.String value) => $_setString(1, value);
  @$pb.TagNumber(2)
  $core.bool hasHtmlTemplate() => $_has(1);
  @$pb.TagNumber(2)
  void clearHtmlTemplate() => $_clearField(2);

  @$pb.TagNumber(3)
  $core.String get jsContent => $_getSZ(2);
  @$pb.TagNumber(3)
  set jsContent($core.String value) => $_setString(2, value);
  @$pb.TagNumber(3)
  $core.bool hasJsContent() => $_has(2);
  @$pb.TagNumber(3)
  void clearJsContent() => $_clearField(3);

  @$pb.TagNumber(4)
  $core.String get cssContent => $_getSZ(3);
  @$pb.TagNumber(4)
  set cssContent($core.String value) => $_setString(3, value);
  @$pb.TagNumber(4)
  $core.bool hasCssContent() => $_has(3);
  @$pb.TagNumber(4)
  void clearCssContent() => $_clearField(4);

  @$pb.TagNumber(5)
  $0.EngineVersion get version => $_getN(4);
  @$pb.TagNumber(5)
  set version($0.EngineVersion value) => $_setField(5, value);
  @$pb.TagNumber(5)
  $core.bool hasVersion() => $_has(4);
  @$pb.TagNumber(5)
  void clearVersion() => $_clearField(5);
  @$pb.TagNumber(5)
  $0.EngineVersion ensureVersion() => $_ensure(4);

  /// Feature flags for engine capabilities
  @$pb.TagNumber(6)
  $pb.PbMap<$core.String, $core.bool> get featureFlags => $_getMap(5);
}

const $core.bool _omitFieldNames =
    $core.bool.fromEnvironment('protobuf.omit_field_names');
const $core.bool _omitMessageNames =
    $core.bool.fromEnvironment('protobuf.omit_message_names');
