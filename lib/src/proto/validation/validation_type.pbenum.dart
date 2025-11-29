// This is a generated file - do not edit.
//
// Generated from validation/validation_type.proto.

// @dart = 3.3

// ignore_for_file: annotate_overrides, camel_case_types, comment_references
// ignore_for_file: constant_identifier_names
// ignore_for_file: curly_braces_in_flow_control_structures
// ignore_for_file: deprecated_member_use_from_same_package, library_prefixes
// ignore_for_file: non_constant_identifier_names, prefer_relative_imports

import 'dart:core' as $core;

import 'package:protobuf/protobuf.dart' as $pb;

/// Validation type enumeration
class ValidationType extends $pb.ProtobufEnum {
  static const ValidationType REQUIRED =
      ValidationType._(0, _omitEnumNames ? '' : 'REQUIRED');
  static const ValidationType RANGE =
      ValidationType._(1, _omitEnumNames ? '' : 'RANGE');
  static const ValidationType PATTERN =
      ValidationType._(2, _omitEnumNames ? '' : 'PATTERN');
  static const ValidationType CROSS_FIELD =
      ValidationType._(3, _omitEnumNames ? '' : 'CROSS_FIELD');
  static const ValidationType MIN_LENGTH =
      ValidationType._(4, _omitEnumNames ? '' : 'MIN_LENGTH');
  static const ValidationType MAX_LENGTH =
      ValidationType._(5, _omitEnumNames ? '' : 'MAX_LENGTH');
  static const ValidationType EMAIL =
      ValidationType._(6, _omitEnumNames ? '' : 'EMAIL');
  static const ValidationType PHONE =
      ValidationType._(7, _omitEnumNames ? '' : 'PHONE');
  static const ValidationType CUSTOM =
      ValidationType._(99, _omitEnumNames ? '' : 'CUSTOM');

  static const $core.List<ValidationType> values = <ValidationType>[
    REQUIRED,
    RANGE,
    PATTERN,
    CROSS_FIELD,
    MIN_LENGTH,
    MAX_LENGTH,
    EMAIL,
    PHONE,
    CUSTOM,
  ];

  static final $core.Map<$core.int, ValidationType> _byValue =
      $pb.ProtobufEnum.initByValue(values);
  static ValidationType? valueOf($core.int value) => _byValue[value];

  const ValidationType._(super.value, super.name);
}

const $core.bool _omitEnumNames =
    $core.bool.fromEnvironment('protobuf.omit_enum_names');
