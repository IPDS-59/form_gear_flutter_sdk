// This is a generated file - do not edit.
//
// Generated from response/form_response.proto.

// @dart = 3.3

// ignore_for_file: annotate_overrides, camel_case_types, comment_references
// ignore_for_file: constant_identifier_names
// ignore_for_file: curly_braces_in_flow_control_structures
// ignore_for_file: deprecated_member_use_from_same_package, library_prefixes
// ignore_for_file: non_constant_identifier_names, prefer_relative_imports

import 'dart:core' as $core;

import 'package:fixnum/fixnum.dart' as $fixnum;
import 'package:protobuf/protobuf.dart' as $pb;

import 'field_response.pb.dart' as $0;

export 'package:protobuf/protobuf.dart' show GeneratedMessageGenericExtensions;

/// Complete form response
class FormResponse extends $pb.GeneratedMessage {
  factory FormResponse({
    $core.String? templateId,
    $core.String? assignmentId,
    $fixnum.Int64? timestamp,
    $core.Iterable<$0.FieldResponse>? responses,
    $core.String? userId,
    $fixnum.Int64? startTime,
    $fixnum.Int64? endTime,
    $core.bool? isCompleted,
  }) {
    final result = create();
    if (templateId != null) result.templateId = templateId;
    if (assignmentId != null) result.assignmentId = assignmentId;
    if (timestamp != null) result.timestamp = timestamp;
    if (responses != null) result.responses.addAll(responses);
    if (userId != null) result.userId = userId;
    if (startTime != null) result.startTime = startTime;
    if (endTime != null) result.endTime = endTime;
    if (isCompleted != null) result.isCompleted = isCompleted;
    return result;
  }

  FormResponse._();

  factory FormResponse.fromBuffer($core.List<$core.int> data,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromBuffer(data, registry);
  factory FormResponse.fromJson($core.String json,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromJson(json, registry);

  static final $pb.BuilderInfo _i = $pb.BuilderInfo(
      _omitMessageNames ? '' : 'FormResponse',
      package:
          const $pb.PackageName(_omitMessageNames ? '' : 'formgear.response'),
      createEmptyInstance: create)
    ..aOS(1, _omitFieldNames ? '' : 'templateId')
    ..aOS(2, _omitFieldNames ? '' : 'assignmentId')
    ..aInt64(3, _omitFieldNames ? '' : 'timestamp')
    ..pPM<$0.FieldResponse>(4, _omitFieldNames ? '' : 'responses',
        subBuilder: $0.FieldResponse.create)
    ..aOS(5, _omitFieldNames ? '' : 'userId')
    ..aInt64(6, _omitFieldNames ? '' : 'startTime')
    ..aInt64(7, _omitFieldNames ? '' : 'endTime')
    ..aOB(8, _omitFieldNames ? '' : 'isCompleted')
    ..hasRequiredFields = false;

  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  FormResponse clone() => deepCopy();
  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  FormResponse copyWith(void Function(FormResponse) updates) =>
      super.copyWith((message) => updates(message as FormResponse))
          as FormResponse;

  @$core.override
  $pb.BuilderInfo get info_ => _i;

  @$core.pragma('dart2js:noInline')
  static FormResponse create() => FormResponse._();
  @$core.override
  FormResponse createEmptyInstance() => create();
  @$core.pragma('dart2js:noInline')
  static FormResponse getDefault() => _defaultInstance ??=
      $pb.GeneratedMessage.$_defaultFor<FormResponse>(create);
  static FormResponse? _defaultInstance;

  @$pb.TagNumber(1)
  $core.String get templateId => $_getSZ(0);
  @$pb.TagNumber(1)
  set templateId($core.String value) => $_setString(0, value);
  @$pb.TagNumber(1)
  $core.bool hasTemplateId() => $_has(0);
  @$pb.TagNumber(1)
  void clearTemplateId() => $_clearField(1);

  @$pb.TagNumber(2)
  $core.String get assignmentId => $_getSZ(1);
  @$pb.TagNumber(2)
  set assignmentId($core.String value) => $_setString(1, value);
  @$pb.TagNumber(2)
  $core.bool hasAssignmentId() => $_has(1);
  @$pb.TagNumber(2)
  void clearAssignmentId() => $_clearField(2);

  @$pb.TagNumber(3)
  $fixnum.Int64 get timestamp => $_getI64(2);
  @$pb.TagNumber(3)
  set timestamp($fixnum.Int64 value) => $_setInt64(2, value);
  @$pb.TagNumber(3)
  $core.bool hasTimestamp() => $_has(2);
  @$pb.TagNumber(3)
  void clearTimestamp() => $_clearField(3);

  @$pb.TagNumber(4)
  $pb.PbList<$0.FieldResponse> get responses => $_getList(3);

  /// Response metadata
  @$pb.TagNumber(5)
  $core.String get userId => $_getSZ(4);
  @$pb.TagNumber(5)
  set userId($core.String value) => $_setString(4, value);
  @$pb.TagNumber(5)
  $core.bool hasUserId() => $_has(4);
  @$pb.TagNumber(5)
  void clearUserId() => $_clearField(5);

  @$pb.TagNumber(6)
  $fixnum.Int64 get startTime => $_getI64(5);
  @$pb.TagNumber(6)
  set startTime($fixnum.Int64 value) => $_setInt64(5, value);
  @$pb.TagNumber(6)
  $core.bool hasStartTime() => $_has(5);
  @$pb.TagNumber(6)
  void clearStartTime() => $_clearField(6);

  @$pb.TagNumber(7)
  $fixnum.Int64 get endTime => $_getI64(6);
  @$pb.TagNumber(7)
  set endTime($fixnum.Int64 value) => $_setInt64(6, value);
  @$pb.TagNumber(7)
  $core.bool hasEndTime() => $_has(6);
  @$pb.TagNumber(7)
  void clearEndTime() => $_clearField(7);

  @$pb.TagNumber(8)
  $core.bool get isCompleted => $_getBF(7);
  @$pb.TagNumber(8)
  set isCompleted($core.bool value) => $_setBool(7, value);
  @$pb.TagNumber(8)
  $core.bool hasIsCompleted() => $_has(7);
  @$pb.TagNumber(8)
  void clearIsCompleted() => $_clearField(8);
}

const $core.bool _omitFieldNames =
    $core.bool.fromEnvironment('protobuf.omit_field_names');
const $core.bool _omitMessageNames =
    $core.bool.fromEnvironment('protobuf.omit_message_names');
