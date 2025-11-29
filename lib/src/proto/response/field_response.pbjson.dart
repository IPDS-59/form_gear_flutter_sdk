// This is a generated file - do not edit.
//
// Generated from response/field_response.proto.

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

@$core.Deprecated('Use arrayValueDescriptor instead')
const ArrayValue$json = {
  '1': 'ArrayValue',
  '2': [
    {
      '1': 'items',
      '3': 1,
      '4': 3,
      '5': 11,
      '6': '.google.protobuf.Any',
      '10': 'items'
    },
  ],
};

/// Descriptor for `ArrayValue`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List arrayValueDescriptor = $convert.base64Decode(
    'CgpBcnJheVZhbHVlEioKBWl0ZW1zGAEgAygLMhQuZ29vZ2xlLnByb3RvYnVmLkFueVIFaXRlbX'
    'M=');

@$core.Deprecated('Use objectValueDescriptor instead')
const ObjectValue$json = {
  '1': 'ObjectValue',
  '2': [
    {
      '1': 'fields',
      '3': 1,
      '4': 3,
      '5': 11,
      '6': '.formgear.response.ObjectValue.FieldsEntry',
      '10': 'fields'
    },
  ],
  '3': [ObjectValue_FieldsEntry$json],
};

@$core.Deprecated('Use objectValueDescriptor instead')
const ObjectValue_FieldsEntry$json = {
  '1': 'FieldsEntry',
  '2': [
    {'1': 'key', '3': 1, '4': 1, '5': 9, '10': 'key'},
    {
      '1': 'value',
      '3': 2,
      '4': 1,
      '5': 11,
      '6': '.google.protobuf.Any',
      '10': 'value'
    },
  ],
  '7': {'7': true},
};

/// Descriptor for `ObjectValue`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List objectValueDescriptor = $convert.base64Decode(
    'CgtPYmplY3RWYWx1ZRJCCgZmaWVsZHMYASADKAsyKi5mb3JtZ2Vhci5yZXNwb25zZS5PYmplY3'
    'RWYWx1ZS5GaWVsZHNFbnRyeVIGZmllbGRzGk8KC0ZpZWxkc0VudHJ5EhAKA2tleRgBIAEoCVID'
    'a2V5EioKBXZhbHVlGAIgASgLMhQuZ29vZ2xlLnByb3RvYnVmLkFueVIFdmFsdWU6AjgB');

@$core.Deprecated('Use fieldResponseDescriptor instead')
const FieldResponse$json = {
  '1': 'FieldResponse',
  '2': [
    {'1': 'data_key', '3': 1, '4': 1, '5': 9, '10': 'dataKey'},
    {
      '1': 'type',
      '3': 2,
      '4': 1,
      '5': 14,
      '6': '.formgear.response.ResponseValueType',
      '10': 'type'
    },
    {'1': 'string_value', '3': 3, '4': 1, '5': 9, '9': 0, '10': 'stringValue'},
    {'1': 'number_value', '3': 4, '4': 1, '5': 1, '9': 0, '10': 'numberValue'},
    {
      '1': 'boolean_value',
      '3': 5,
      '4': 1,
      '5': 8,
      '9': 0,
      '10': 'booleanValue'
    },
    {
      '1': 'array_value',
      '3': 6,
      '4': 1,
      '5': 11,
      '6': '.formgear.response.ArrayValue',
      '9': 0,
      '10': 'arrayValue'
    },
    {
      '1': 'object_value',
      '3': 7,
      '4': 1,
      '5': 11,
      '6': '.formgear.response.ObjectValue',
      '9': 0,
      '10': 'objectValue'
    },
  ],
  '8': [
    {'1': 'value'},
  ],
};

/// Descriptor for `FieldResponse`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List fieldResponseDescriptor = $convert.base64Decode(
    'Cg1GaWVsZFJlc3BvbnNlEhkKCGRhdGFfa2V5GAEgASgJUgdkYXRhS2V5EjgKBHR5cGUYAiABKA'
    '4yJC5mb3JtZ2Vhci5yZXNwb25zZS5SZXNwb25zZVZhbHVlVHlwZVIEdHlwZRIjCgxzdHJpbmdf'
    'dmFsdWUYAyABKAlIAFILc3RyaW5nVmFsdWUSIwoMbnVtYmVyX3ZhbHVlGAQgASgBSABSC251bW'
    'JlclZhbHVlEiUKDWJvb2xlYW5fdmFsdWUYBSABKAhIAFIMYm9vbGVhblZhbHVlEkAKC2FycmF5'
    'X3ZhbHVlGAYgASgLMh0uZm9ybWdlYXIucmVzcG9uc2UuQXJyYXlWYWx1ZUgAUgphcnJheVZhbH'
    'VlEkMKDG9iamVjdF92YWx1ZRgHIAEoCzIeLmZvcm1nZWFyLnJlc3BvbnNlLk9iamVjdFZhbHVl'
    'SABSC29iamVjdFZhbHVlQgcKBXZhbHVl');
