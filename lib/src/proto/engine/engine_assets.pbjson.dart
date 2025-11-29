// This is a generated file - do not edit.
//
// Generated from engine/engine_assets.proto.

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

@$core.Deprecated('Use engineAssetsDescriptor instead')
const EngineAssets$json = {
  '1': 'EngineAssets',
  '2': [
    {
      '1': 'engine_type',
      '3': 1,
      '4': 1,
      '5': 14,
      '6': '.formgear.engine.FormEngineType',
      '10': 'engineType'
    },
    {'1': 'html_template', '3': 2, '4': 1, '5': 9, '10': 'htmlTemplate'},
    {'1': 'js_content', '3': 3, '4': 1, '5': 9, '10': 'jsContent'},
    {'1': 'css_content', '3': 4, '4': 1, '5': 9, '10': 'cssContent'},
    {
      '1': 'version',
      '3': 5,
      '4': 1,
      '5': 11,
      '6': '.formgear.engine.EngineVersion',
      '10': 'version'
    },
    {
      '1': 'feature_flags',
      '3': 6,
      '4': 3,
      '5': 11,
      '6': '.formgear.engine.EngineAssets.FeatureFlagsEntry',
      '10': 'featureFlags'
    },
  ],
  '3': [EngineAssets_FeatureFlagsEntry$json],
};

@$core.Deprecated('Use engineAssetsDescriptor instead')
const EngineAssets_FeatureFlagsEntry$json = {
  '1': 'FeatureFlagsEntry',
  '2': [
    {'1': 'key', '3': 1, '4': 1, '5': 9, '10': 'key'},
    {'1': 'value', '3': 2, '4': 1, '5': 8, '10': 'value'},
  ],
  '7': {'7': true},
};

/// Descriptor for `EngineAssets`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List engineAssetsDescriptor = $convert.base64Decode(
    'CgxFbmdpbmVBc3NldHMSQAoLZW5naW5lX3R5cGUYASABKA4yHy5mb3JtZ2Vhci5lbmdpbmUuRm'
    '9ybUVuZ2luZVR5cGVSCmVuZ2luZVR5cGUSIwoNaHRtbF90ZW1wbGF0ZRgCIAEoCVIMaHRtbFRl'
    'bXBsYXRlEh0KCmpzX2NvbnRlbnQYAyABKAlSCWpzQ29udGVudBIfCgtjc3NfY29udGVudBgEIA'
    'EoCVIKY3NzQ29udGVudBI4Cgd2ZXJzaW9uGAUgASgLMh4uZm9ybWdlYXIuZW5naW5lLkVuZ2lu'
    'ZVZlcnNpb25SB3ZlcnNpb24SVAoNZmVhdHVyZV9mbGFncxgGIAMoCzIvLmZvcm1nZWFyLmVuZ2'
    'luZS5FbmdpbmVBc3NldHMuRmVhdHVyZUZsYWdzRW50cnlSDGZlYXR1cmVGbGFncxo/ChFGZWF0'
    'dXJlRmxhZ3NFbnRyeRIQCgNrZXkYASABKAlSA2tleRIUCgV2YWx1ZRgCIAEoCFIFdmFsdWU6Aj'
    'gB');
