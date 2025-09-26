import 'package:json_annotation/json_annotation.dart';

/// Represents the different states of form engine version
@JsonEnum()
enum VersionState {
  /// Form engine is not downloaded locally
  @JsonValue('missing')
  missing('Form engine is not available on your device'),

  /// Form engine is downloaded but outdated
  @JsonValue('outdated')
  outdated('Form engine on your device is not the latest version'),

  /// Form engine is up to date
  @JsonValue('current')
  current('Form engine on your device is the latest version');

  const VersionState(this.description);

  /// Human-readable description of the state
  final String description;

  /// Returns true if the version state requires a download
  bool get needsDownload =>
      this == VersionState.missing || this == VersionState.outdated;
}
