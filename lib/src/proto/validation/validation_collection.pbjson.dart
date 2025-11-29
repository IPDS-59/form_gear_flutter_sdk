// This is a generated file - do not edit.
//
// Generated from validation/validation_collection.proto.

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

@$core.Deprecated('Use fieldValidationDescriptor instead')
const FieldValidation$json = {
  '1': 'FieldValidation',
  '2': [
    {'1': 'field_data_key', '3': 1, '4': 1, '5': 9, '10': 'fieldDataKey'},
    {
      '1': 'rules',
      '3': 2,
      '4': 3,
      '5': 11,
      '6': '.formgear.validation.ValidationRule',
      '10': 'rules'
    },
  ],
};

/// Descriptor for `FieldValidation`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List fieldValidationDescriptor = $convert.base64Decode(
    'Cg9GaWVsZFZhbGlkYXRpb24SJAoOZmllbGRfZGF0YV9rZXkYASABKAlSDGZpZWxkRGF0YUtleR'
    'I5CgVydWxlcxgCIAMoCzIjLmZvcm1nZWFyLnZhbGlkYXRpb24uVmFsaWRhdGlvblJ1bGVSBXJ1'
    'bGVz');

@$core.Deprecated('Use validationCollectionDescriptor instead')
const ValidationCollection$json = {
  '1': 'ValidationCollection',
  '2': [
    {'1': 'template_id', '3': 1, '4': 1, '5': 9, '10': 'templateId'},
    {
      '1': 'field_validations',
      '3': 2,
      '4': 3,
      '5': 11,
      '6': '.formgear.validation.ValidationCollection.FieldValidationsEntry',
      '10': 'fieldValidations'
    },
  ],
  '3': [ValidationCollection_FieldValidationsEntry$json],
};

@$core.Deprecated('Use validationCollectionDescriptor instead')
const ValidationCollection_FieldValidationsEntry$json = {
  '1': 'FieldValidationsEntry',
  '2': [
    {'1': 'key', '3': 1, '4': 1, '5': 9, '10': 'key'},
    {
      '1': 'value',
      '3': 2,
      '4': 1,
      '5': 11,
      '6': '.formgear.validation.FieldValidation',
      '10': 'value'
    },
  ],
  '7': {'7': true},
};

/// Descriptor for `ValidationCollection`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List validationCollectionDescriptor = $convert.base64Decode(
    'ChRWYWxpZGF0aW9uQ29sbGVjdGlvbhIfCgt0ZW1wbGF0ZV9pZBgBIAEoCVIKdGVtcGxhdGVJZB'
    'JsChFmaWVsZF92YWxpZGF0aW9ucxgCIAMoCzI/LmZvcm1nZWFyLnZhbGlkYXRpb24uVmFsaWRh'
    'dGlvbkNvbGxlY3Rpb24uRmllbGRWYWxpZGF0aW9uc0VudHJ5UhBmaWVsZFZhbGlkYXRpb25zGm'
    'kKFUZpZWxkVmFsaWRhdGlvbnNFbnRyeRIQCgNrZXkYASABKAlSA2tleRI6CgV2YWx1ZRgCIAEo'
    'CzIkLmZvcm1nZWFyLnZhbGlkYXRpb24uRmllbGRWYWxpZGF0aW9uUgV2YWx1ZToCOAE=');
