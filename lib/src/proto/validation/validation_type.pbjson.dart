// This is a generated file - do not edit.
//
// Generated from validation/validation_type.proto.

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

@$core.Deprecated('Use validationTypeDescriptor instead')
const ValidationType$json = {
  '1': 'ValidationType',
  '2': [
    {'1': 'REQUIRED', '2': 0},
    {'1': 'RANGE', '2': 1},
    {'1': 'PATTERN', '2': 2},
    {'1': 'CROSS_FIELD', '2': 3},
    {'1': 'MIN_LENGTH', '2': 4},
    {'1': 'MAX_LENGTH', '2': 5},
    {'1': 'EMAIL', '2': 6},
    {'1': 'PHONE', '2': 7},
    {'1': 'CUSTOM', '2': 99},
  ],
};

/// Descriptor for `ValidationType`. Decode as a `google.protobuf.EnumDescriptorProto`.
final $typed_data.Uint8List validationTypeDescriptor = $convert.base64Decode(
    'Cg5WYWxpZGF0aW9uVHlwZRIMCghSRVFVSVJFRBAAEgkKBVJBTkdFEAESCwoHUEFUVEVSThACEg'
    '8KC0NST1NTX0ZJRUxEEAMSDgoKTUlOX0xFTkdUSBAEEg4KCk1BWF9MRU5HVEgQBRIJCgVFTUFJ'
    'TBAGEgkKBVBIT05FEAcSCgoGQ1VTVE9NEGM=');
