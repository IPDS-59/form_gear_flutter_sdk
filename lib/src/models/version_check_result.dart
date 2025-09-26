import 'package:equatable/equatable.dart';
import 'package:form_gear_engine_sdk/src/models/form_engine_entity.dart';
import 'package:form_gear_engine_sdk/src/models/version_state.dart';
import 'package:json_annotation/json_annotation.dart';

part 'version_check_result.g.dart';

/// Result of version checking operation
@JsonSerializable()
class VersionCheckResult extends Equatable {
  const VersionCheckResult({
    required this.state,
    required this.formEngine,
    this.localVersion,
    this.remoteVersion,
  });

  /// Factory constructor for JSON deserialization
  factory VersionCheckResult.fromJson(Map<String, dynamic> json) =>
      _$VersionCheckResultFromJson(json);

  /// The version state (missing, outdated, or current)
  final VersionState state;

  /// The form engine entity from the API response
  final FormEngineEntity formEngine;

  /// The locally installed version (null if not installed)
  final String? localVersion;

  /// The remote version from the server
  final String? remoteVersion;

  /// Returns true if download is needed (missing or outdated)
  bool get needsDownload => state.needsDownload;

  /// Returns true if this is a forced update
  bool get isForced => formEngine.isForce ?? false;

  /// Returns true if this is an update (not a fresh install)
  bool get isUpdate => state == VersionState.outdated;

  /// Returns the engine type with fallback to FormGear
  String get engineDisplayName {
    final engineType = formEngine.engineType;
    return engineType?.displayName ?? 'FormGear';
  }

  /// JSON serialization
  Map<String, dynamic> toJson() => _$VersionCheckResultToJson(this);

  @override
  List<Object?> get props => [
    state,
    formEngine,
    localVersion,
    remoteVersion,
  ];

  /// Creates a copy with updated properties
  VersionCheckResult copyWith({
    VersionState? state,
    FormEngineEntity? formEngine,
    String? localVersion,
    String? remoteVersion,
  }) {
    return VersionCheckResult(
      state: state ?? this.state,
      formEngine: formEngine ?? this.formEngine,
      localVersion: localVersion ?? this.localVersion,
      remoteVersion: remoteVersion ?? this.remoteVersion,
    );
  }

  @override
  String toString() {
    return 'VersionCheckResult('
        'state: $state, '
        'formEngine: ${formEngine.formEngineId}, '
        'localVersion: $localVersion, '
        'remoteVersion: $remoteVersion'
        ')';
  }
}
