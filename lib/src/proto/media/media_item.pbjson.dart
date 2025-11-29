// This is a generated file - do not edit.
//
// Generated from media/media_item.proto.

// @dart = 3.3

// ignore_for_file: annotate_overrides, camel_case_types, comment_references
// ignore_for_file: constant_identifier_names
// ignore_for_file: curly_braces_in_flow_control_structures
// ignore_for_file: deprecated_member_use_from_same_package, library_prefixes
// ignore_for_file: non_constant_identifier_names, prefer_relative_imports
// ignore_for_file: unused_import

import 'dart:convert' as $convert;
import 'dart:core' as $core;
import 'dart:typed_data' as $typed_data;

@$core.Deprecated('Use mediaItemDescriptor instead')
const MediaItem$json = {
  '1': 'MediaItem',
  '2': [
    {'1': 'media_id', '3': 1, '4': 1, '5': 9, '10': 'mediaId'},
    {
      '1': 'type',
      '3': 2,
      '4': 1,
      '5': 14,
      '6': '.formgear.media.MediaType',
      '10': 'type'
    },
    {'1': 'file_path', '3': 3, '4': 1, '5': 9, '10': 'filePath'},
    {'1': 'file_size', '3': 4, '4': 1, '5': 3, '10': 'fileSize'},
    {'1': 'timestamp', '3': 5, '4': 1, '5': 3, '10': 'timestamp'},
    {'1': 'thumbnail', '3': 10, '4': 1, '5': 12, '9': 0, '10': 'thumbnail'},
    {
      '1': 'gps_data',
      '3': 11,
      '4': 1,
      '5': 11,
      '6': '.formgear.media.Location',
      '9': 0,
      '10': 'gpsData'
    },
    {'1': 'duration', '3': 12, '4': 1, '5': 3, '9': 0, '10': 'duration'},
    {
      '1': 'metadata',
      '3': 20,
      '4': 3,
      '5': 11,
      '6': '.formgear.media.MediaItem.MetadataEntry',
      '10': 'metadata'
    },
  ],
  '3': [MediaItem_MetadataEntry$json],
  '8': [
    {'1': 'data'},
  ],
};

@$core.Deprecated('Use mediaItemDescriptor instead')
const MediaItem_MetadataEntry$json = {
  '1': 'MetadataEntry',
  '2': [
    {'1': 'key', '3': 1, '4': 1, '5': 9, '10': 'key'},
    {'1': 'value', '3': 2, '4': 1, '5': 9, '10': 'value'},
  ],
  '7': {'7': true},
};

/// Descriptor for `MediaItem`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List mediaItemDescriptor = $convert.base64Decode(
    'CglNZWRpYUl0ZW0SGQoIbWVkaWFfaWQYASABKAlSB21lZGlhSWQSLQoEdHlwZRgCIAEoDjIZLm'
    'Zvcm1nZWFyLm1lZGlhLk1lZGlhVHlwZVIEdHlwZRIbCglmaWxlX3BhdGgYAyABKAlSCGZpbGVQ'
    'YXRoEhsKCWZpbGVfc2l6ZRgEIAEoA1IIZmlsZVNpemUSHAoJdGltZXN0YW1wGAUgASgDUgl0aW'
    '1lc3RhbXASHgoJdGh1bWJuYWlsGAogASgMSABSCXRodW1ibmFpbBI1CghncHNfZGF0YRgLIAEo'
    'CzIYLmZvcm1nZWFyLm1lZGlhLkxvY2F0aW9uSABSB2dwc0RhdGESHAoIZHVyYXRpb24YDCABKA'
    'NIAFIIZHVyYXRpb24SQwoIbWV0YWRhdGEYFCADKAsyJy5mb3JtZ2Vhci5tZWRpYS5NZWRpYUl0'
    'ZW0uTWV0YWRhdGFFbnRyeVIIbWV0YWRhdGEaOwoNTWV0YWRhdGFFbnRyeRIQCgNrZXkYASABKA'
    'lSA2tleRIUCgV2YWx1ZRgCIAEoCVIFdmFsdWU6AjgBQgYKBGRhdGE=');
