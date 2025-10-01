import 'package:equatable/equatable.dart';
import 'package:json_annotation/json_annotation.dart';

part 'form_gear_api_config.g.dart';

/// API configuration for FormGear SDK endpoints
@JsonSerializable()
class FormGearApiConfig extends Equatable {
  const FormGearApiConfig({
    this.baseUrl,
    this.templateZipEndpoint,
    this.formEngineEndpoint,
    this.lookupEndpoint,
    this.authToken,
    this.customHeaders = const {},
    this.isProduction = true,
    this.pinnedCertificates,
  });

  factory FormGearApiConfig.fromJson(Map<String, dynamic> json) =>
      _$FormGearApiConfigFromJson(json);

  /// Base URL for all FASIH API endpoints
  final String? baseUrl;

  /// Template ZIP download endpoint (with {templateId} placeholder)
  /// FASIH endpoint: /mobile/assignment-sync/api/mobile/template/zip/{templateId}
  final String? templateZipEndpoint;

  /// Form engine version check endpoint
  final String? formEngineEndpoint;

  /// Lookup data endpoint for survey lookups
  final String? lookupEndpoint;

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

  /// Get full template ZIP download URL for a specific template ID
  /// Used for FASIH-compatible ZIP downloads
  String? getTemplateZipUrl(String templateId) {
    if (baseUrl == null || templateZipEndpoint == null) return null;
    return '$baseUrl${templateZipEndpoint!.replaceAll(
      '{templateId}',
      templateId,
    )}';
  }

  /// Get full form engine API URL
  String? get formEngineUrl {
    if (baseUrl == null || formEngineEndpoint == null) return null;
    return '$baseUrl$formEngineEndpoint';
  }

  /// Get full lookup API URL
  String? get lookupUrl {
    if (baseUrl == null || lookupEndpoint == null) return null;
    return '$baseUrl$lookupEndpoint';
  }

  /// Check if form engine download is supported
  bool get supportsFormEngineDownload =>
      baseUrl != null && formEngineEndpoint != null;

  Map<String, dynamic> toJson() => _$FormGearApiConfigToJson(this);

  @override
  List<Object?> get props => [
    baseUrl,
    templateZipEndpoint,
    formEngineEndpoint,
    lookupEndpoint,
    authToken,
    customHeaders,
    isProduction,
    pinnedCertificates,
  ];

  FormGearApiConfig copyWith({
    String? baseUrl,
    String? templateZipEndpoint,
    String? formEngineEndpoint,
    String? lookupEndpoint,
    String? authToken,
    Map<String, String>? customHeaders,
    bool? isProduction,
    Map<String, List<String>>? pinnedCertificates,
  }) {
    return FormGearApiConfig(
      baseUrl: baseUrl ?? this.baseUrl,
      templateZipEndpoint: templateZipEndpoint ?? this.templateZipEndpoint,
      formEngineEndpoint: formEngineEndpoint ?? this.formEngineEndpoint,
      lookupEndpoint: lookupEndpoint ?? this.lookupEndpoint,
      authToken: authToken ?? this.authToken,
      customHeaders: customHeaders ?? this.customHeaders,
      isProduction: isProduction ?? this.isProduction,
      pinnedCertificates: pinnedCertificates ?? this.pinnedCertificates,
    );
  }
}
