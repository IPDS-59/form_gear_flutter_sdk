import 'package:equatable/equatable.dart';
import 'package:form_gear_engine_sdk/src/core/config/form_gear_api_config.dart';
import 'package:form_gear_engine_sdk/src/core/config/form_gear_client_mode.dart';
import 'package:form_gear_engine_sdk/src/core/config/form_gear_config.dart';
import 'package:form_gear_engine_sdk/src/core/config/form_gear_form_mode.dart';
import 'package:form_gear_engine_sdk/src/core/config/form_gear_initial_mode.dart';
import 'package:form_gear_engine_sdk/src/core/config/form_gear_lookup_mode.dart';
import 'package:form_gear_engine_sdk/src/models/assignment_context.dart';
import 'package:form_gear_engine_sdk/src/models/bps_user.dart';
import 'package:json_annotation/json_annotation.dart';

part 'form_gear_global_config.g.dart';

/// Global SDK configuration that applies to all assignments
/// This separates global settings (user auth, API endpoints) from
/// assignment-specific settings (lookup mode, form mode, etc.)
@JsonSerializable()
class FormGearGlobalConfig extends Equatable {
  const FormGearGlobalConfig({
    required this.apiConfig,
    this.bpsUser,
    this.username,
    this.autoStartServer = true,
    this.serverPort = 3310,
    this.enableDebugMode = false,
    this.enableLogging = true,
    this.defaultAssignmentConfig,
  });

  /// Factory constructor from JSON
  factory FormGearGlobalConfig.fromJson(Map<String, dynamic> json) =>
      _$FormGearGlobalConfigFromJson(json);

  /// Create default configuration for FASIH integration
  factory FormGearGlobalConfig.fasih({
    required FormGearApiConfig apiConfig,
    required BpsUser bpsUser,
    String? username,
    bool enableDebugMode = false,
  }) {
    return FormGearGlobalConfig(
      apiConfig: apiConfig,
      bpsUser: bpsUser,
      username: username ?? bpsUser.name,
      enableDebugMode: enableDebugMode,
      enableLogging: !enableDebugMode, // Disable logging in production
      defaultAssignmentConfig: AssignmentConfig.capi(),
    );
  }

  /// Create default configuration for development/testing
  factory FormGearGlobalConfig.development({
    FormGearApiConfig? apiConfig,
    BpsUser? bpsUser,
    String username = 'Developer',
  }) {
    return FormGearGlobalConfig(
      apiConfig: apiConfig,
      bpsUser: bpsUser,
      username: username,
      enableDebugMode: true,
      defaultAssignmentConfig: AssignmentConfig.test(),
    );
  }

  /// API configuration for FASIH backend
  final FormGearApiConfig? apiConfig;

  /// BPS user information (from SSO)
  final BpsUser? bpsUser;

  /// Username for the current session
  final String? username;

  /// Whether to auto-start the local server
  final bool autoStartServer;

  /// Port for the local server
  final int serverPort;

  /// Whether debug mode is enabled
  final bool enableDebugMode;

  /// Whether logging is enabled
  final bool enableLogging;

  /// Default assignment configuration to use when none specified
  final AssignmentConfig? defaultAssignmentConfig;

  /// Convert to JSON
  Map<String, dynamic> toJson() => _$FormGearGlobalConfigToJson(this);

  /// Create a copy with updated values
  FormGearGlobalConfig copyWith({
    FormGearApiConfig? apiConfig,
    BpsUser? bpsUser,
    String? username,
    bool? autoStartServer,
    int? serverPort,
    bool? enableDebugMode,
    bool? enableLogging,
    AssignmentConfig? defaultAssignmentConfig,
  }) {
    return FormGearGlobalConfig(
      apiConfig: apiConfig ?? this.apiConfig,
      bpsUser: bpsUser ?? this.bpsUser,
      username: username ?? this.username,
      autoStartServer: autoStartServer ?? this.autoStartServer,
      serverPort: serverPort ?? this.serverPort,
      enableDebugMode: enableDebugMode ?? this.enableDebugMode,
      enableLogging: enableLogging ?? this.enableLogging,
      defaultAssignmentConfig:
          defaultAssignmentConfig ?? this.defaultAssignmentConfig,
    );
  }

  /// Convert to legacy FormGearConfig for backward compatibility
  FormGearConfig toLegacyConfig({AssignmentConfig? assignmentConfig}) {
    final config = assignmentConfig ?? defaultAssignmentConfig;

    return FormGearConfig(
      apiConfig: apiConfig,
      bpsUser: bpsUser,
      username: username ?? 'DefaultUser',
      autoStartServer: autoStartServer,
      serverPort: serverPort,
      lookupMode: config?.lookupMode ?? FormGearLookupMode.offline,
      formMode: config?.formMode ?? FormGearFormMode.open,
      clientMode: config?.clientMode ?? FormGearClientMode.capi,
      initialMode: FormGearInitialMode.initial,
      // Add required parameters with defaults
      lookupKey: 'key%5B%5D',
      lookupValue: 'value%5B%5D',
      htmlLogPrefix: 'FORMGEAR_HTML',
      sdkLogPrefix: 'FORMGEAR_SDK',
    );
  }

  @override
  List<Object?> get props => [
    apiConfig,
    bpsUser,
    username,
    autoStartServer,
    serverPort,
    enableDebugMode,
    enableLogging,
    defaultAssignmentConfig,
  ];
}
