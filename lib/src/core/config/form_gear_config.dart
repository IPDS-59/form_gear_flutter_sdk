import 'package:equatable/equatable.dart';
import 'package:form_gear_engine_sdk/src/core/config/config.dart';
import 'package:form_gear_engine_sdk/src/models/bps_user.dart';
import 'package:json_annotation/json_annotation.dart';

part 'form_gear_config.g.dart';

/// Configuration class for FormGear WebView behavior and official
/// API integration
@JsonSerializable()
class FormGearConfig extends Equatable {
  const FormGearConfig({
    required this.clientMode,
    required this.lookupKey,
    required this.lookupValue,
    required this.lookupMode,
    required this.username,
    required this.formMode,
    required this.initialMode,
    required this.htmlLogPrefix,
    required this.sdkLogPrefix,
    required this.serverPort,
    required this.autoStartServer,
    this.bpsUser,
    this.apiConfig,
    this.preset,
    this.formResponse,
    this.validation,
    this.remark,
    this.isNewForm = true,
    this.enableLogging = true,
  });

  factory FormGearConfig.fromJson(Map<String, dynamic> json) =>
      _$FormGearConfigFromJson(json);
  // Official FormGear API Configuration Parameters
  /// Client mode: CAWI for web apps, CAPI for mobile apps
  final FormGearClientMode clientMode;

  /// Key parameter for lookup requests (default: 'key%5B%5D')
  final String lookupKey;

  /// Value parameter for lookup requests (default: 'value%5B%5D')
  final String lookupValue;

  /// Lookup mode: online from API or offline from local data
  final FormGearLookupMode lookupMode;

  /// Username for form submission and tracking
  final String username;

  /// Current form mode (open, rejected, submitted, approved)
  final FormGearFormMode formMode;

  /// Initial mode (initial creation or assignment)
  final FormGearInitialMode initialMode;

  // Flutter SDK Specific Configuration Parameters
  /// Visual indicator prefix for HTML/JS logs
  final String htmlLogPrefix;

  /// Visual indicator prefix for internal SDK logs
  final String sdkLogPrefix;

  /// Server port for the local FormGear server
  final int serverPort;

  /// Whether to automatically start the server during initialization
  final bool autoStartServer;

  /// BPS User from SSO authentication
  final BpsUser? bpsUser;

  /// API configuration for FormGear services
  final FormGearApiConfig? apiConfig;

  /// Form preset data
  final Map<String, dynamic>? preset;

  /// Form response data
  final Map<String, dynamic>? formResponse;

  /// Form validation rules
  final Map<String, dynamic>? validation;

  /// Form remark
  final String? remark;

  /// Whether this is a new form
  final bool isNewForm;

  /// Whether to enable logging for JS bridge
  final bool enableLogging;

  Map<String, dynamic> toJson() => _$FormGearConfigToJson(this);

  @override
  List<Object?> get props => [
    clientMode,
    lookupKey,
    lookupValue,
    lookupMode,
    username,
    formMode,
    initialMode,
    htmlLogPrefix,
    sdkLogPrefix,
    serverPort,
    autoStartServer,
    bpsUser,
    apiConfig,
    preset,
    formResponse,
    validation,
    remark,
    isNewForm,
    enableLogging,
  ];
}
