// This is a generated file - do not edit.
//
// Generated from validation/validation_rules.proto.

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

@$core.Deprecated('Use rangeValidationDescriptor instead')
const RangeValidation$json = {
  '1': 'RangeValidation',
  '2': [
    {'1': 'min', '3': 1, '4': 1, '5': 1, '10': 'min'},
    {'1': 'max', '3': 2, '4': 1, '5': 1, '10': 'max'},
    {'1': 'min_inclusive', '3': 3, '4': 1, '5': 8, '10': 'minInclusive'},
    {'1': 'max_inclusive', '3': 4, '4': 1, '5': 8, '10': 'maxInclusive'},
  ],
};

/// Descriptor for `RangeValidation`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List rangeValidationDescriptor = $convert.base64Decode(
    'Cg9SYW5nZVZhbGlkYXRpb24SEAoDbWluGAEgASgBUgNtaW4SEAoDbWF4GAIgASgBUgNtYXgSIw'
    'oNbWluX2luY2x1c2l2ZRgDIAEoCFIMbWluSW5jbHVzaXZlEiMKDW1heF9pbmNsdXNpdmUYBCAB'
    'KAhSDG1heEluY2x1c2l2ZQ==');

@$core.Deprecated('Use regexValidationDescriptor instead')
const RegexValidation$json = {
  '1': 'RegexValidation',
  '2': [
    {'1': 'pattern', '3': 1, '4': 1, '5': 9, '10': 'pattern'},
    {'1': 'flags', '3': 2, '4': 1, '5': 9, '10': 'flags'},
  ],
};

/// Descriptor for `RegexValidation`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List regexValidationDescriptor = $convert.base64Decode(
    'Cg9SZWdleFZhbGlkYXRpb24SGAoHcGF0dGVybhgBIAEoCVIHcGF0dGVybhIUCgVmbGFncxgCIA'
    'EoCVIFZmxhZ3M=');

@$core.Deprecated('Use dependencyValidationDescriptor instead')
const DependencyValidation$json = {
  '1': 'DependencyValidation',
  '2': [
    {'1': 'depends_on_field', '3': 1, '4': 1, '5': 9, '10': 'dependsOnField'},
    {
      '1': 'comparison_operator',
      '3': 2,
      '4': 1,
      '5': 9,
      '10': 'comparisonOperator'
    },
    {'1': 'expected_value', '3': 3, '4': 1, '5': 9, '10': 'expectedValue'},
  ],
};

/// Descriptor for `DependencyValidation`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List dependencyValidationDescriptor = $convert.base64Decode(
    'ChREZXBlbmRlbmN5VmFsaWRhdGlvbhIoChBkZXBlbmRzX29uX2ZpZWxkGAEgASgJUg5kZXBlbm'
    'RzT25GaWVsZBIvChNjb21wYXJpc29uX29wZXJhdG9yGAIgASgJUhJjb21wYXJpc29uT3BlcmF0'
    'b3ISJQoOZXhwZWN0ZWRfdmFsdWUYAyABKAlSDWV4cGVjdGVkVmFsdWU=');

@$core.Deprecated('Use lengthValidationDescriptor instead')
const LengthValidation$json = {
  '1': 'LengthValidation',
  '2': [
    {'1': 'min', '3': 1, '4': 1, '5': 5, '10': 'min'},
    {'1': 'max', '3': 2, '4': 1, '5': 5, '10': 'max'},
  ],
};

/// Descriptor for `LengthValidation`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List lengthValidationDescriptor = $convert.base64Decode(
    'ChBMZW5ndGhWYWxpZGF0aW9uEhAKA21pbhgBIAEoBVIDbWluEhAKA21heBgCIAEoBVIDbWF4');

@$core.Deprecated('Use customValidationDescriptor instead')
const CustomValidation$json = {
  '1': 'CustomValidation',
  '2': [
    {'1': 'expression', '3': 1, '4': 1, '5': 9, '10': 'expression'},
    {'1': 'error_message', '3': 2, '4': 1, '5': 9, '10': 'errorMessage'},
  ],
};

/// Descriptor for `CustomValidation`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List customValidationDescriptor = $convert.base64Decode(
    'ChBDdXN0b21WYWxpZGF0aW9uEh4KCmV4cHJlc3Npb24YASABKAlSCmV4cHJlc3Npb24SIwoNZX'
    'Jyb3JfbWVzc2FnZRgCIAEoCVIMZXJyb3JNZXNzYWdl');
