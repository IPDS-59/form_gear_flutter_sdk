// This is a generated file - do not edit.
//
// Generated from template/component.proto.

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

@$core.Deprecated('Use componentDescriptor instead')
const Component$json = {
  '1': 'Component',
  '2': [
    {'1': 'label', '3': 1, '4': 1, '5': 9, '10': 'label'},
    {'1': 'data_key', '3': 2, '4': 1, '5': 9, '10': 'dataKey'},
    {'1': 'description', '3': 3, '4': 1, '5': 9, '10': 'description'},
    {'1': 'type', '3': 4, '4': 1, '5': 5, '10': 'type'},
    {'1': 'required', '3': 5, '4': 1, '5': 8, '10': 'required'},
    {
      '1': 'components',
      '3': 6,
      '4': 3,
      '5': 11,
      '6': '.formgear.template.ComponentSection',
      '10': 'components'
    },
    {'1': 'enable_condition', '3': 7, '4': 1, '5': 9, '10': 'enableCondition'},
    {'1': 'component_enable', '3': 8, '4': 3, '5': 9, '10': 'componentEnable'},
    {'1': 'rows', '3': 10, '4': 1, '5': 5, '10': 'rows'},
    {'1': 'cols', '3': 11, '4': 1, '5': 5, '10': 'cols'},
    {'1': 'decimal_length', '3': 12, '4': 1, '5': 5, '10': 'decimalLength'},
    {
      '1': 'options',
      '3': 13,
      '4': 3,
      '5': 11,
      '6': '.formgear.template.ComponentOption',
      '10': 'options'
    },
    {
      '1': 'size_input',
      '3': 14,
      '4': 3,
      '5': 11,
      '6': '.formgear.template.SizeConstraint',
      '10': 'sizeInput'
    },
  ],
};

/// Descriptor for `Component`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List componentDescriptor = $convert.base64Decode(
    'CglDb21wb25lbnQSFAoFbGFiZWwYASABKAlSBWxhYmVsEhkKCGRhdGFfa2V5GAIgASgJUgdkYX'
    'RhS2V5EiAKC2Rlc2NyaXB0aW9uGAMgASgJUgtkZXNjcmlwdGlvbhISCgR0eXBlGAQgASgFUgR0'
    'eXBlEhoKCHJlcXVpcmVkGAUgASgIUghyZXF1aXJlZBJDCgpjb21wb25lbnRzGAYgAygLMiMuZm'
    '9ybWdlYXIudGVtcGxhdGUuQ29tcG9uZW50U2VjdGlvblIKY29tcG9uZW50cxIpChBlbmFibGVf'
    'Y29uZGl0aW9uGAcgASgJUg9lbmFibGVDb25kaXRpb24SKQoQY29tcG9uZW50X2VuYWJsZRgIIA'
    'MoCVIPY29tcG9uZW50RW5hYmxlEhIKBHJvd3MYCiABKAVSBHJvd3MSEgoEY29scxgLIAEoBVIE'
    'Y29scxIlCg5kZWNpbWFsX2xlbmd0aBgMIAEoBVINZGVjaW1hbExlbmd0aBI8CgdvcHRpb25zGA'
    '0gAygLMiIuZm9ybWdlYXIudGVtcGxhdGUuQ29tcG9uZW50T3B0aW9uUgdvcHRpb25zEkAKCnNp'
    'emVfaW5wdXQYDiADKAsyIS5mb3JtZ2Vhci50ZW1wbGF0ZS5TaXplQ29uc3RyYWludFIJc2l6ZU'
    'lucHV0');

@$core.Deprecated('Use componentSectionDescriptor instead')
const ComponentSection$json = {
  '1': 'ComponentSection',
  '2': [
    {
      '1': 'components',
      '3': 1,
      '4': 3,
      '5': 11,
      '6': '.formgear.template.Component',
      '10': 'components'
    },
  ],
};

/// Descriptor for `ComponentSection`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List componentSectionDescriptor = $convert.base64Decode(
    'ChBDb21wb25lbnRTZWN0aW9uEjwKCmNvbXBvbmVudHMYASADKAsyHC5mb3JtZ2Vhci50ZW1wbG'
    'F0ZS5Db21wb25lbnRSCmNvbXBvbmVudHM=');
