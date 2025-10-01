import 'package:equatable/equatable.dart';
import 'package:json_annotation/json_annotation.dart';

part 'form_gear_api_config.g.dart';

/// API configuration for FormGear SDK endpoints
///
/// This configuration is used for form engine version checking only.
/// All other data (templates, lookups, etc.) should be provided by the
/// client application through the SDK's public API.
@JsonSerializable()
class FormGearApiConfig extends Equatable {
  const FormGearApiConfig({
    this.baseUrl,
    this.formEngineEndpoint,
    this.authToken,
    this.customHeaders = const {},
    this.isProduction = true,
    this.pinnedCertificates,
  });

  factory FormGearApiConfig.fromJson(Map<String, dynamic> json) =>
      _$FormGearApiConfigFromJson(json);

  /// Base URL for FASIH API endpoints
  final String? baseUrl;

  /// Form engine version check endpoint
  /// Example: /mobile/notification-service/api/mobile/check-form-engine-release
  final String? formEngineEndpoint;

  /// Authentication token for API requests
  final String? authToken;

  /// Custom headers for API requests (can include service-specific tokens)
  final Map<String, String> customHeaders;

  /// Whether this is production environment
  final bool isProduction;

  /// Certificate pinning configuration for enhanced security.
  ///
  /// Maps host names to lists of SHA-256 certificate fingerprints.
  /// Only connections to these hosts with matching certificates will be allowed.
  ///
  /// Example:
  /// ```dart
  /// pinnedCertificates: {
  ///   'fasih-api.bps.go.id': [
  ///     'sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
  ///     'sha256/BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB=',
  ///   ],
  /// }
  /// ```
  ///
  /// Use NetworkSecurityConfig.getCertificateFingerprint() to obtain
  /// fingerprints for your production servers.
  final Map<String, List<String>>? pinnedCertificates;

  /// Get full form engine API URL
  String? get formEngineUrl {
    if (baseUrl == null || formEngineEndpoint == null) return null;
    return '$baseUrl$formEngineEndpoint';
  }

  /// Check if form engine version check is supported
  bool get supportsFormEngineVersionCheck =>
      baseUrl != null && formEngineEndpoint != null;

  Map<String, dynamic> toJson() => _$FormGearApiConfigToJson(this);

  @override
  List<Object?> get props => [
        baseUrl,
        formEngineEndpoint,
        authToken,
        customHeaders,
        isProduction,
        pinnedCertificates,
      ];

  FormGearApiConfig copyWith({
    String? baseUrl,
    String? formEngineEndpoint,
    String? authToken,
    Map<String, String>? customHeaders,
    bool? isProduction,
    Map<String, List<String>>? pinnedCertificates,
  }) {
    return FormGearApiConfig(
      baseUrl: baseUrl ?? this.baseUrl,
      formEngineEndpoint: formEngineEndpoint ?? this.formEngineEndpoint,
      authToken: authToken ?? this.authToken,
      customHeaders: customHeaders ?? this.customHeaders,
      isProduction: isProduction ?? this.isProduction,
      pinnedCertificates: pinnedCertificates ?? this.pinnedCertificates,
    );
  }
}
