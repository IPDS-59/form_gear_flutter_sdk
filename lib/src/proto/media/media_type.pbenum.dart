// This is a generated file - do not edit.
//
// Generated from media/media_type.proto.

// @dart = 3.3

// ignore_for_file: annotate_overrides, camel_case_types, comment_references
// ignore_for_file: constant_identifier_names
// ignore_for_file: curly_braces_in_flow_control_structures
// ignore_for_file: deprecated_member_use_from_same_package, library_prefixes
// ignore_for_file: non_constant_identifier_names, prefer_relative_imports

import 'dart:core' as $core;

import 'package:protobuf/protobuf.dart' as $pb;

/// Media type enumeration
class MediaType extends $pb.ProtobufEnum {
  static const MediaType UNKNOWN =
      MediaType._(0, _omitEnumNames ? '' : 'UNKNOWN');
  static const MediaType IMAGE = MediaType._(1, _omitEnumNames ? '' : 'IMAGE');
  static const MediaType AUDIO = MediaType._(2, _omitEnumNames ? '' : 'AUDIO');
  static const MediaType VIDEO = MediaType._(3, _omitEnumNames ? '' : 'VIDEO');
  static const MediaType GPS = MediaType._(4, _omitEnumNames ? '' : 'GPS');
  static const MediaType SIGNATURE =
      MediaType._(5, _omitEnumNames ? '' : 'SIGNATURE');
  static const MediaType FILE = MediaType._(6, _omitEnumNames ? '' : 'FILE');

  static const $core.List<MediaType> values = <MediaType>[
    UNKNOWN,
    IMAGE,
    AUDIO,
    VIDEO,
    GPS,
    SIGNATURE,
    FILE,
  ];

  static final $core.List<MediaType?> _byValue =
      $pb.ProtobufEnum.$_initByValueList(values, 6);
  static MediaType? valueOf($core.int value) =>
      value < 0 || value >= _byValue.length ? null : _byValue[value];

  const MediaType._(super.value, super.name);
}

const $core.bool _omitEnumNames =
    $core.bool.fromEnvironment('protobuf.omit_enum_names');
