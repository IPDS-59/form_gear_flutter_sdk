// This is a generated file - do not edit.
//
// Generated from validation/validation_rule.proto.

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

@$core.Deprecated('Use validationRuleDescriptor instead')
const ValidationRule$json = {
  '1': 'ValidationRule',
  '2': [
    {'1': 'rule_id', '3': 1, '4': 1, '5': 9, '10': 'ruleId'},
    {
      '1': 'type',
      '3': 2,
      '4': 1,
      '5': 14,
      '6': '.formgear.validation.ValidationType',
      '10': 'type'
    },
    {'1': 'error_message', '3': 3, '4': 1, '5': 9, '10': 'errorMessage'},
    {
      '1': 'range',
      '3': 10,
      '4': 1,
      '5': 11,
      '6': '.formgear.validation.RangeValidation',
      '9': 0,
      '10': 'range'
    },
    {
      '1': 'regex',
      '3': 11,
      '4': 1,
      '5': 11,
      '6': '.formgear.validation.RegexValidation',
      '9': 0,
      '10': 'regex'
    },
    {
      '1': 'dependency',
      '3': 12,
      '4': 1,
      '5': 11,
      '6': '.formgear.validation.DependencyValidation',
      '9': 0,
      '10': 'dependency'
    },
    {
      '1': 'length',
      '3': 13,
      '4': 1,
      '5': 11,
      '6': '.formgear.validation.LengthValidation',
      '9': 0,
      '10': 'length'
    },
    {
      '1': 'custom',
      '3': 14,
      '4': 1,
      '5': 11,
      '6': '.formgear.validation.CustomValidation',
      '9': 0,
      '10': 'custom'
    },
  ],
  '8': [
    {'1': 'condition'},
  ],
};

/// Descriptor for `ValidationRule`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List validationRuleDescriptor = $convert.base64Decode(
    'Cg5WYWxpZGF0aW9uUnVsZRIXCgdydWxlX2lkGAEgASgJUgZydWxlSWQSNwoEdHlwZRgCIAEoDj'
    'IjLmZvcm1nZWFyLnZhbGlkYXRpb24uVmFsaWRhdGlvblR5cGVSBHR5cGUSIwoNZXJyb3JfbWVz'
    'c2FnZRgDIAEoCVIMZXJyb3JNZXNzYWdlEjwKBXJhbmdlGAogASgLMiQuZm9ybWdlYXIudmFsaW'
    'RhdGlvbi5SYW5nZVZhbGlkYXRpb25IAFIFcmFuZ2USPAoFcmVnZXgYCyABKAsyJC5mb3JtZ2Vh'
    'ci52YWxpZGF0aW9uLlJlZ2V4VmFsaWRhdGlvbkgAUgVyZWdleBJLCgpkZXBlbmRlbmN5GAwgAS'
    'gLMikuZm9ybWdlYXIudmFsaWRhdGlvbi5EZXBlbmRlbmN5VmFsaWRhdGlvbkgAUgpkZXBlbmRl'
    'bmN5Ej8KBmxlbmd0aBgNIAEoCzIlLmZvcm1nZWFyLnZhbGlkYXRpb24uTGVuZ3RoVmFsaWRhdG'
    'lvbkgAUgZsZW5ndGgSPwoGY3VzdG9tGA4gASgLMiUuZm9ybWdlYXIudmFsaWRhdGlvbi5DdXN0'
    'b21WYWxpZGF0aW9uSABSBmN1c3RvbUILCgljb25kaXRpb24=');
