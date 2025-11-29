// This is a generated file - do not edit.
//
// Generated from media/media_item.proto.

// @dart = 3.3

// ignore_for_file: annotate_overrides, camel_case_types, comment_references
// ignore_for_file: constant_identifier_names
// ignore_for_file: curly_braces_in_flow_control_structures
// ignore_for_file: deprecated_member_use_from_same_package, library_prefixes
// ignore_for_file: non_constant_identifier_names, prefer_relative_imports

import 'dart:core' as $core;

import 'package:fixnum/fixnum.dart' as $fixnum;
import 'package:protobuf/protobuf.dart' as $pb;

import 'location.pb.dart' as $0;
import 'media_type.pbenum.dart' as $1;

export 'package:protobuf/protobuf.dart' show GeneratedMessageGenericExtensions;

enum MediaItem_Data { thumbnail, gpsData, duration, notSet }

/// Media item
class MediaItem extends $pb.GeneratedMessage {
  factory MediaItem({
    $core.String? mediaId,
    $1.MediaType? type,
    $core.String? filePath,
    $fixnum.Int64? fileSize,
    $fixnum.Int64? timestamp,
    $core.List<$core.int>? thumbnail,
    $0.Location? gpsData,
    $fixnum.Int64? duration,
    $core.Iterable<$core.MapEntry<$core.String, $core.String>>? metadata,
  }) {
    final result = create();
    if (mediaId != null) result.mediaId = mediaId;
    if (type != null) result.type = type;
    if (filePath != null) result.filePath = filePath;
    if (fileSize != null) result.fileSize = fileSize;
    if (timestamp != null) result.timestamp = timestamp;
    if (thumbnail != null) result.thumbnail = thumbnail;
    if (gpsData != null) result.gpsData = gpsData;
    if (duration != null) result.duration = duration;
    if (metadata != null) result.metadata.addEntries(metadata);
    return result;
  }

  MediaItem._();

  factory MediaItem.fromBuffer($core.List<$core.int> data,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromBuffer(data, registry);
  factory MediaItem.fromJson($core.String json,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromJson(json, registry);

  static const $core.Map<$core.int, MediaItem_Data> _MediaItem_DataByTag = {
    10: MediaItem_Data.thumbnail,
    11: MediaItem_Data.gpsData,
    12: MediaItem_Data.duration,
    0: MediaItem_Data.notSet
  };
  static final $pb.BuilderInfo _i = $pb.BuilderInfo(
      _omitMessageNames ? '' : 'MediaItem',
      package: const $pb.PackageName(_omitMessageNames ? '' : 'formgear.media'),
      createEmptyInstance: create)
    ..oo(0, [10, 11, 12])
    ..aOS(1, _omitFieldNames ? '' : 'mediaId')
    ..aE<$1.MediaType>(2, _omitFieldNames ? '' : 'type',
        enumValues: $1.MediaType.values)
    ..aOS(3, _omitFieldNames ? '' : 'filePath')
    ..aInt64(4, _omitFieldNames ? '' : 'fileSize')
    ..aInt64(5, _omitFieldNames ? '' : 'timestamp')
    ..a<$core.List<$core.int>>(
        10, _omitFieldNames ? '' : 'thumbnail', $pb.PbFieldType.OY)
    ..aOM<$0.Location>(11, _omitFieldNames ? '' : 'gpsData',
        subBuilder: $0.Location.create)
    ..aInt64(12, _omitFieldNames ? '' : 'duration')
    ..m<$core.String, $core.String>(20, _omitFieldNames ? '' : 'metadata',
        entryClassName: 'MediaItem.MetadataEntry',
        keyFieldType: $pb.PbFieldType.OS,
        valueFieldType: $pb.PbFieldType.OS,
        packageName: const $pb.PackageName('formgear.media'))
    ..hasRequiredFields = false;

  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  MediaItem clone() => deepCopy();
  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  MediaItem copyWith(void Function(MediaItem) updates) =>
      super.copyWith((message) => updates(message as MediaItem)) as MediaItem;

  @$core.override
  $pb.BuilderInfo get info_ => _i;

  @$core.pragma('dart2js:noInline')
  static MediaItem create() => MediaItem._();
  @$core.override
  MediaItem createEmptyInstance() => create();
  @$core.pragma('dart2js:noInline')
  static MediaItem getDefault() =>
      _defaultInstance ??= $pb.GeneratedMessage.$_defaultFor<MediaItem>(create);
  static MediaItem? _defaultInstance;

  @$pb.TagNumber(10)
  @$pb.TagNumber(11)
  @$pb.TagNumber(12)
  MediaItem_Data whichData() => _MediaItem_DataByTag[$_whichOneof(0)]!;
  @$pb.TagNumber(10)
  @$pb.TagNumber(11)
  @$pb.TagNumber(12)
  void clearData() => $_clearField($_whichOneof(0));

  @$pb.TagNumber(1)
  $core.String get mediaId => $_getSZ(0);
  @$pb.TagNumber(1)
  set mediaId($core.String value) => $_setString(0, value);
  @$pb.TagNumber(1)
  $core.bool hasMediaId() => $_has(0);
  @$pb.TagNumber(1)
  void clearMediaId() => $_clearField(1);

  @$pb.TagNumber(2)
  $1.MediaType get type => $_getN(1);
  @$pb.TagNumber(2)
  set type($1.MediaType value) => $_setField(2, value);
  @$pb.TagNumber(2)
  $core.bool hasType() => $_has(1);
  @$pb.TagNumber(2)
  void clearType() => $_clearField(2);

  @$pb.TagNumber(3)
  $core.String get filePath => $_getSZ(2);
  @$pb.TagNumber(3)
  set filePath($core.String value) => $_setString(2, value);
  @$pb.TagNumber(3)
  $core.bool hasFilePath() => $_has(2);
  @$pb.TagNumber(3)
  void clearFilePath() => $_clearField(3);

  @$pb.TagNumber(4)
  $fixnum.Int64 get fileSize => $_getI64(3);
  @$pb.TagNumber(4)
  set fileSize($fixnum.Int64 value) => $_setInt64(3, value);
  @$pb.TagNumber(4)
  $core.bool hasFileSize() => $_has(3);
  @$pb.TagNumber(4)
  void clearFileSize() => $_clearField(4);

  @$pb.TagNumber(5)
  $fixnum.Int64 get timestamp => $_getI64(4);
  @$pb.TagNumber(5)
  set timestamp($fixnum.Int64 value) => $_setInt64(4, value);
  @$pb.TagNumber(5)
  $core.bool hasTimestamp() => $_has(4);
  @$pb.TagNumber(5)
  void clearTimestamp() => $_clearField(5);

  @$pb.TagNumber(10)
  $core.List<$core.int> get thumbnail => $_getN(5);
  @$pb.TagNumber(10)
  set thumbnail($core.List<$core.int> value) => $_setBytes(5, value);
  @$pb.TagNumber(10)
  $core.bool hasThumbnail() => $_has(5);
  @$pb.TagNumber(10)
  void clearThumbnail() => $_clearField(10);

  @$pb.TagNumber(11)
  $0.Location get gpsData => $_getN(6);
  @$pb.TagNumber(11)
  set gpsData($0.Location value) => $_setField(11, value);
  @$pb.TagNumber(11)
  $core.bool hasGpsData() => $_has(6);
  @$pb.TagNumber(11)
  void clearGpsData() => $_clearField(11);
  @$pb.TagNumber(11)
  $0.Location ensureGpsData() => $_ensure(6);

  @$pb.TagNumber(12)
  $fixnum.Int64 get duration => $_getI64(7);
  @$pb.TagNumber(12)
  set duration($fixnum.Int64 value) => $_setInt64(7, value);
  @$pb.TagNumber(12)
  $core.bool hasDuration() => $_has(7);
  @$pb.TagNumber(12)
  void clearDuration() => $_clearField(12);

  /// Metadata
  @$pb.TagNumber(20)
  $pb.PbMap<$core.String, $core.String> get metadata => $_getMap(8);
}

const $core.bool _omitFieldNames =
    $core.bool.fromEnvironment('protobuf.omit_field_names');
const $core.bool _omitMessageNames =
    $core.bool.fromEnvironment('protobuf.omit_message_names');
