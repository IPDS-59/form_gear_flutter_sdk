// This is a generated file - do not edit.
//
// Generated from response/field_response.proto.

// @dart = 3.3

// ignore_for_file: annotate_overrides, camel_case_types, comment_references
// ignore_for_file: constant_identifier_names
// ignore_for_file: curly_braces_in_flow_control_structures
// ignore_for_file: deprecated_member_use_from_same_package, library_prefixes
// ignore_for_file: non_constant_identifier_names, prefer_relative_imports

import 'dart:core' as $core;

import 'package:protobuf/protobuf.dart' as $pb;
import 'package:protobuf/well_known_types/google/protobuf/any.pb.dart' as $0;

import 'response_value_type.pbenum.dart' as $1;

export 'package:protobuf/protobuf.dart' show GeneratedMessageGenericExtensions;

/// Array value wrapper
class ArrayValue extends $pb.GeneratedMessage {
  factory ArrayValue({
    $core.Iterable<$0.Any>? items,
  }) {
    final result = create();
    if (items != null) result.items.addAll(items);
    return result;
  }

  ArrayValue._();

  factory ArrayValue.fromBuffer($core.List<$core.int> data,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromBuffer(data, registry);
  factory ArrayValue.fromJson($core.String json,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromJson(json, registry);

  static final $pb.BuilderInfo _i = $pb.BuilderInfo(
      _omitMessageNames ? '' : 'ArrayValue',
      package:
          const $pb.PackageName(_omitMessageNames ? '' : 'formgear.response'),
      createEmptyInstance: create)
    ..pPM<$0.Any>(1, _omitFieldNames ? '' : 'items', subBuilder: $0.Any.create)
    ..hasRequiredFields = false;

  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  ArrayValue clone() => deepCopy();
  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  ArrayValue copyWith(void Function(ArrayValue) updates) =>
      super.copyWith((message) => updates(message as ArrayValue)) as ArrayValue;

  @$core.override
  $pb.BuilderInfo get info_ => _i;

  @$core.pragma('dart2js:noInline')
  static ArrayValue create() => ArrayValue._();
  @$core.override
  ArrayValue createEmptyInstance() => create();
  @$core.pragma('dart2js:noInline')
  static ArrayValue getDefault() => _defaultInstance ??=
      $pb.GeneratedMessage.$_defaultFor<ArrayValue>(create);
  static ArrayValue? _defaultInstance;

  @$pb.TagNumber(1)
  $pb.PbList<$0.Any> get items => $_getList(0);
}

/// Object value wrapper
class ObjectValue extends $pb.GeneratedMessage {
  factory ObjectValue({
    $core.Iterable<$core.MapEntry<$core.String, $0.Any>>? fields,
  }) {
    final result = create();
    if (fields != null) result.fields.addEntries(fields);
    return result;
  }

  ObjectValue._();

  factory ObjectValue.fromBuffer($core.List<$core.int> data,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromBuffer(data, registry);
  factory ObjectValue.fromJson($core.String json,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromJson(json, registry);

  static final $pb.BuilderInfo _i = $pb.BuilderInfo(
      _omitMessageNames ? '' : 'ObjectValue',
      package:
          const $pb.PackageName(_omitMessageNames ? '' : 'formgear.response'),
      createEmptyInstance: create)
    ..m<$core.String, $0.Any>(1, _omitFieldNames ? '' : 'fields',
        entryClassName: 'ObjectValue.FieldsEntry',
        keyFieldType: $pb.PbFieldType.OS,
        valueFieldType: $pb.PbFieldType.OM,
        valueCreator: $0.Any.create,
        valueDefaultOrMaker: $0.Any.getDefault,
        packageName: const $pb.PackageName('formgear.response'))
    ..hasRequiredFields = false;

  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  ObjectValue clone() => deepCopy();
  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  ObjectValue copyWith(void Function(ObjectValue) updates) =>
      super.copyWith((message) => updates(message as ObjectValue))
          as ObjectValue;

  @$core.override
  $pb.BuilderInfo get info_ => _i;

  @$core.pragma('dart2js:noInline')
  static ObjectValue create() => ObjectValue._();
  @$core.override
  ObjectValue createEmptyInstance() => create();
  @$core.pragma('dart2js:noInline')
  static ObjectValue getDefault() => _defaultInstance ??=
      $pb.GeneratedMessage.$_defaultFor<ObjectValue>(create);
  static ObjectValue? _defaultInstance;

  @$pb.TagNumber(1)
  $pb.PbMap<$core.String, $0.Any> get fields => $_getMap(0);
}

enum FieldResponse_Value {
  stringValue,
  numberValue,
  booleanValue,
  arrayValue,
  objectValue,
  notSet
}

/// Individual field response
class FieldResponse extends $pb.GeneratedMessage {
  factory FieldResponse({
    $core.String? dataKey,
    $1.ResponseValueType? type,
    $core.String? stringValue,
    $core.double? numberValue,
    $core.bool? booleanValue,
    ArrayValue? arrayValue,
    ObjectValue? objectValue,
  }) {
    final result = create();
    if (dataKey != null) result.dataKey = dataKey;
    if (type != null) result.type = type;
    if (stringValue != null) result.stringValue = stringValue;
    if (numberValue != null) result.numberValue = numberValue;
    if (booleanValue != null) result.booleanValue = booleanValue;
    if (arrayValue != null) result.arrayValue = arrayValue;
    if (objectValue != null) result.objectValue = objectValue;
    return result;
  }

  FieldResponse._();

  factory FieldResponse.fromBuffer($core.List<$core.int> data,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromBuffer(data, registry);
  factory FieldResponse.fromJson($core.String json,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromJson(json, registry);

  static const $core.Map<$core.int, FieldResponse_Value>
      _FieldResponse_ValueByTag = {
    3: FieldResponse_Value.stringValue,
    4: FieldResponse_Value.numberValue,
    5: FieldResponse_Value.booleanValue,
    6: FieldResponse_Value.arrayValue,
    7: FieldResponse_Value.objectValue,
    0: FieldResponse_Value.notSet
  };
  static final $pb.BuilderInfo _i = $pb.BuilderInfo(
      _omitMessageNames ? '' : 'FieldResponse',
      package:
          const $pb.PackageName(_omitMessageNames ? '' : 'formgear.response'),
      createEmptyInstance: create)
    ..oo(0, [3, 4, 5, 6, 7])
    ..aOS(1, _omitFieldNames ? '' : 'dataKey')
    ..aE<$1.ResponseValueType>(2, _omitFieldNames ? '' : 'type',
        enumValues: $1.ResponseValueType.values)
    ..aOS(3, _omitFieldNames ? '' : 'stringValue')
    ..aD(4, _omitFieldNames ? '' : 'numberValue')
    ..aOB(5, _omitFieldNames ? '' : 'booleanValue')
    ..aOM<ArrayValue>(6, _omitFieldNames ? '' : 'arrayValue',
        subBuilder: ArrayValue.create)
    ..aOM<ObjectValue>(7, _omitFieldNames ? '' : 'objectValue',
        subBuilder: ObjectValue.create)
    ..hasRequiredFields = false;

  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  FieldResponse clone() => deepCopy();
  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  FieldResponse copyWith(void Function(FieldResponse) updates) =>
      super.copyWith((message) => updates(message as FieldResponse))
          as FieldResponse;

  @$core.override
  $pb.BuilderInfo get info_ => _i;

  @$core.pragma('dart2js:noInline')
  static FieldResponse create() => FieldResponse._();
  @$core.override
  FieldResponse createEmptyInstance() => create();
  @$core.pragma('dart2js:noInline')
  static FieldResponse getDefault() => _defaultInstance ??=
      $pb.GeneratedMessage.$_defaultFor<FieldResponse>(create);
  static FieldResponse? _defaultInstance;

  @$pb.TagNumber(3)
  @$pb.TagNumber(4)
  @$pb.TagNumber(5)
  @$pb.TagNumber(6)
  @$pb.TagNumber(7)
  FieldResponse_Value whichValue() =>
      _FieldResponse_ValueByTag[$_whichOneof(0)]!;
  @$pb.TagNumber(3)
  @$pb.TagNumber(4)
  @$pb.TagNumber(5)
  @$pb.TagNumber(6)
  @$pb.TagNumber(7)
  void clearValue() => $_clearField($_whichOneof(0));

  @$pb.TagNumber(1)
  $core.String get dataKey => $_getSZ(0);
  @$pb.TagNumber(1)
  set dataKey($core.String value) => $_setString(0, value);
  @$pb.TagNumber(1)
  $core.bool hasDataKey() => $_has(0);
  @$pb.TagNumber(1)
  void clearDataKey() => $_clearField(1);

  @$pb.TagNumber(2)
  $1.ResponseValueType get type => $_getN(1);
  @$pb.TagNumber(2)
  set type($1.ResponseValueType value) => $_setField(2, value);
  @$pb.TagNumber(2)
  $core.bool hasType() => $_has(1);
  @$pb.TagNumber(2)
  void clearType() => $_clearField(2);

  @$pb.TagNumber(3)
  $core.String get stringValue => $_getSZ(2);
  @$pb.TagNumber(3)
  set stringValue($core.String value) => $_setString(2, value);
  @$pb.TagNumber(3)
  $core.bool hasStringValue() => $_has(2);
  @$pb.TagNumber(3)
  void clearStringValue() => $_clearField(3);

  @$pb.TagNumber(4)
  $core.double get numberValue => $_getN(3);
  @$pb.TagNumber(4)
  set numberValue($core.double value) => $_setDouble(3, value);
  @$pb.TagNumber(4)
  $core.bool hasNumberValue() => $_has(3);
  @$pb.TagNumber(4)
  void clearNumberValue() => $_clearField(4);

  @$pb.TagNumber(5)
  $core.bool get booleanValue => $_getBF(4);
  @$pb.TagNumber(5)
  set booleanValue($core.bool value) => $_setBool(4, value);
  @$pb.TagNumber(5)
  $core.bool hasBooleanValue() => $_has(4);
  @$pb.TagNumber(5)
  void clearBooleanValue() => $_clearField(5);

  @$pb.TagNumber(6)
  ArrayValue get arrayValue => $_getN(5);
  @$pb.TagNumber(6)
  set arrayValue(ArrayValue value) => $_setField(6, value);
  @$pb.TagNumber(6)
  $core.bool hasArrayValue() => $_has(5);
  @$pb.TagNumber(6)
  void clearArrayValue() => $_clearField(6);
  @$pb.TagNumber(6)
  ArrayValue ensureArrayValue() => $_ensure(5);

  @$pb.TagNumber(7)
  ObjectValue get objectValue => $_getN(6);
  @$pb.TagNumber(7)
  set objectValue(ObjectValue value) => $_setField(7, value);
  @$pb.TagNumber(7)
  $core.bool hasObjectValue() => $_has(6);
  @$pb.TagNumber(7)
  void clearObjectValue() => $_clearField(7);
  @$pb.TagNumber(7)
  ObjectValue ensureObjectValue() => $_ensure(6);
}

const $core.bool _omitFieldNames =
    $core.bool.fromEnvironment('protobuf.omit_field_names');
const $core.bool _omitMessageNames =
    $core.bool.fromEnvironment('protobuf.omit_message_names');
