// This is a generated file - do not edit.
//
// Generated from response/form_response.proto.

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

@$core.Deprecated('Use formResponseDescriptor instead')
const FormResponse$json = {
  '1': 'FormResponse',
  '2': [
    {'1': 'template_id', '3': 1, '4': 1, '5': 9, '10': 'templateId'},
    {'1': 'assignment_id', '3': 2, '4': 1, '5': 9, '10': 'assignmentId'},
    {'1': 'timestamp', '3': 3, '4': 1, '5': 3, '10': 'timestamp'},
    {
      '1': 'responses',
      '3': 4,
      '4': 3,
      '5': 11,
      '6': '.formgear.response.FieldResponse',
      '10': 'responses'
    },
    {'1': 'user_id', '3': 5, '4': 1, '5': 9, '10': 'userId'},
    {'1': 'start_time', '3': 6, '4': 1, '5': 3, '10': 'startTime'},
    {'1': 'end_time', '3': 7, '4': 1, '5': 3, '10': 'endTime'},
    {'1': 'is_completed', '3': 8, '4': 1, '5': 8, '10': 'isCompleted'},
  ],
};

/// Descriptor for `FormResponse`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List formResponseDescriptor = $convert.base64Decode(
    'CgxGb3JtUmVzcG9uc2USHwoLdGVtcGxhdGVfaWQYASABKAlSCnRlbXBsYXRlSWQSIwoNYXNzaW'
    'dubWVudF9pZBgCIAEoCVIMYXNzaWdubWVudElkEhwKCXRpbWVzdGFtcBgDIAEoA1IJdGltZXN0'
    'YW1wEj4KCXJlc3BvbnNlcxgEIAMoCzIgLmZvcm1nZWFyLnJlc3BvbnNlLkZpZWxkUmVzcG9uc2'
    'VSCXJlc3BvbnNlcxIXCgd1c2VyX2lkGAUgASgJUgZ1c2VySWQSHQoKc3RhcnRfdGltZRgGIAEo'
    'A1IJc3RhcnRUaW1lEhkKCGVuZF90aW1lGAcgASgDUgdlbmRUaW1lEiEKDGlzX2NvbXBsZXRlZB'
    'gIIAEoCFILaXNDb21wbGV0ZWQ=');
