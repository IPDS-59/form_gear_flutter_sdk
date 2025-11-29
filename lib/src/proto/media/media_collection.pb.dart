// This is a generated file - do not edit.
//
// Generated from media/media_collection.proto.

// @dart = 3.3

// ignore_for_file: annotate_overrides, camel_case_types, comment_references
// ignore_for_file: constant_identifier_names
// ignore_for_file: curly_braces_in_flow_control_structures
// ignore_for_file: deprecated_member_use_from_same_package, library_prefixes
// ignore_for_file: non_constant_identifier_names, prefer_relative_imports

import 'dart:core' as $core;

import 'package:protobuf/protobuf.dart' as $pb;

import 'media_item.pb.dart' as $0;

export 'package:protobuf/protobuf.dart' show GeneratedMessageGenericExtensions;

/// Media collection for a form
class MediaCollection extends $pb.GeneratedMessage {
  factory MediaCollection({
    $core.String? assignmentId,
    $core.Iterable<$0.MediaItem>? items,
  }) {
    final result = create();
    if (assignmentId != null) result.assignmentId = assignmentId;
    if (items != null) result.items.addAll(items);
    return result;
  }

  MediaCollection._();

  factory MediaCollection.fromBuffer($core.List<$core.int> data,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromBuffer(data, registry);
  factory MediaCollection.fromJson($core.String json,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromJson(json, registry);

  static final $pb.BuilderInfo _i = $pb.BuilderInfo(
      _omitMessageNames ? '' : 'MediaCollection',
      package: const $pb.PackageName(_omitMessageNames ? '' : 'formgear.media'),
      createEmptyInstance: create)
    ..aOS(1, _omitFieldNames ? '' : 'assignmentId')
    ..pPM<$0.MediaItem>(2, _omitFieldNames ? '' : 'items',
        subBuilder: $0.MediaItem.create)
    ..hasRequiredFields = false;

  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  MediaCollection clone() => deepCopy();
  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  MediaCollection copyWith(void Function(MediaCollection) updates) =>
      super.copyWith((message) => updates(message as MediaCollection))
          as MediaCollection;

  @$core.override
  $pb.BuilderInfo get info_ => _i;

  @$core.pragma('dart2js:noInline')
  static MediaCollection create() => MediaCollection._();
  @$core.override
  MediaCollection createEmptyInstance() => create();
  @$core.pragma('dart2js:noInline')
  static MediaCollection getDefault() => _defaultInstance ??=
      $pb.GeneratedMessage.$_defaultFor<MediaCollection>(create);
  static MediaCollection? _defaultInstance;

  @$pb.TagNumber(1)
  $core.String get assignmentId => $_getSZ(0);
  @$pb.TagNumber(1)
  set assignmentId($core.String value) => $_setString(0, value);
  @$pb.TagNumber(1)
  $core.bool hasAssignmentId() => $_has(0);
  @$pb.TagNumber(1)
  void clearAssignmentId() => $_clearField(1);

  @$pb.TagNumber(2)
  $pb.PbList<$0.MediaItem> get items => $_getList(1);
}

const $core.bool _omitFieldNames =
    $core.bool.fromEnvironment('protobuf.omit_field_names');
const $core.bool _omitMessageNames =
    $core.bool.fromEnvironment('protobuf.omit_message_names');
