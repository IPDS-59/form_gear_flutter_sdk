// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'version_check_result.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

VersionCheckResult _$VersionCheckResultFromJson(Map<String, dynamic> json) =>
    VersionCheckResult(
      state: $enumDecode(_$VersionStateEnumMap, json['state']),
      formEngine: FormEngineEntity.fromJson(
        json['formEngine'] as Map<String, dynamic>,
      ),
      localVersion: json['localVersion'] as String?,
      remoteVersion: json['remoteVersion'] as String?,
    );

Map<String, dynamic> _$VersionCheckResultToJson(VersionCheckResult instance) =>
    <String, dynamic>{
      'state': _$VersionStateEnumMap[instance.state]!,
      'formEngine': instance.formEngine,
      'localVersion': instance.localVersion,
      'remoteVersion': instance.remoteVersion,
    };

const _$VersionStateEnumMap = {
  VersionState.missing: 'missing',
  VersionState.outdated: 'outdated',
  VersionState.current: 'current',
};
