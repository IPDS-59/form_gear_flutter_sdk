import 'package:equatable/equatable.dart';
import 'package:form_gear_engine_sdk/src/core/config/config.dart';
import 'package:form_gear_engine_sdk/src/models/fasih_user.dart';
import 'package:json_annotation/json_annotation.dart';

part 'form_gear_config.g.dart';

/// Configuration class for FormGear WebView behavior and official API integration
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
    required this.enableConsoleLogForwarding,
    required this.enableDebugLogging,
    required this.htmlLogPrefix,
    required this.sdkLogPrefix,
    required this.serverPort,
    required this.autoStartServer,
    this.authToken,
    this.baseUrl,
    this.fasihUser,
  });

  factory FormGearConfig.fromJson(Map<String, dynamic> json) =>
      _$FormGearConfigFromJson(json);
  // Official FormGear API Configuration Parameters
  /// Client mode: CAWI for web apps, CAPI for mobile apps
  final FormGearClientMode clientMode;

  /// Authentication token for API requests (Bearer token)
  final String? authToken;

  /// Base URL for data lookup API endpoints
  final String? baseUrl;

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
  /// Whether to enable console.log forwarding from HTML/JS to Flutter logs
  final bool enableConsoleLogForwarding;

  /// Whether to enable debug logging from the FormGear SDK
  final bool enableDebugLogging;

  /// Visual indicator prefix for HTML/JS logs
  final String htmlLogPrefix;

  /// Visual indicator prefix for internal SDK logs
  final String sdkLogPrefix;

  /// Server port for the local FormGear server
  final int serverPort;

  /// Whether to automatically start the server during initialization
  final bool autoStartServer;

  /// User of the fasih app
  final FasihUser? fasihUser;

  Map<String, dynamic> toJson() => _$FormGearConfigToJson(this);

  @override
  List<Object?> get props => [
    clientMode,
    authToken,
    baseUrl,
    lookupKey,
    lookupValue,
    lookupMode,
    username,
    formMode,
    initialMode,
    enableConsoleLogForwarding,
    enableDebugLogging,
    htmlLogPrefix,
    sdkLogPrefix,
    serverPort,
    autoStartServer,
    fasihUser,
  ];
}
