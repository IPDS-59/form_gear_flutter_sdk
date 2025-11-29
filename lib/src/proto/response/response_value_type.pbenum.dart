// This is a generated file - do not edit.
//
// Generated from response/response_value_type.proto.

// @dart = 3.3

// ignore_for_file: annotate_overrides, camel_case_types, comment_references
// ignore_for_file: constant_identifier_names
// ignore_for_file: curly_braces_in_flow_control_structures
// ignore_for_file: deprecated_member_use_from_same_package, library_prefixes
// ignore_for_file: non_constant_identifier_names, prefer_relative_imports

import 'dart:core' as $core;

import 'package:protobuf/protobuf.dart' as $pb;

/// Response value types
class ResponseValueType extends $pb.ProtobufEnum {
  static const ResponseValueType STRING =
      ResponseValueType._(0, _omitEnumNames ? '' : 'STRING');
  static const ResponseValueType NUMBER =
      ResponseValueType._(1, _omitEnumNames ? '' : 'NUMBER');
  static const ResponseValueType BOOLEAN =
      ResponseValueType._(2, _omitEnumNames ? '' : 'BOOLEAN');
  static const ResponseValueType ARRAY =
      ResponseValueType._(3, _omitEnumNames ? '' : 'ARRAY');
  static const ResponseValueType OBJECT =
      ResponseValueType._(4, _omitEnumNames ? '' : 'OBJECT');

  static const $core.List<ResponseValueType> values = <ResponseValueType>[
    STRING,
    NUMBER,
    BOOLEAN,
    ARRAY,
    OBJECT,
  ];

  static final $core.List<ResponseValueType?> _byValue =
      $pb.ProtobufEnum.$_initByValueList(values, 4);
  static ResponseValueType? valueOf($core.int value) =>
      value < 0 || value >= _byValue.length ? null : _byValue[value];

  const ResponseValueType._(super.value, super.name);
}

const $core.bool _omitEnumNames =
    $core.bool.fromEnvironment('protobuf.omit_enum_names');
