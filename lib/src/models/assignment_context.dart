import 'package:equatable/equatable.dart';
import 'package:form_gear_engine_sdk/src/core/config/form_gear_client_mode.dart';
import 'package:form_gear_engine_sdk/src/core/config/form_gear_form_mode.dart';
import 'package:form_gear_engine_sdk/src/core/config/form_gear_lookup_mode.dart';
import 'package:json_annotation/json_annotation.dart';

part 'assignment_context.g.dart';

/// Assignment-based context that holds template-specific configuration
/// Following FASIH's assignment-based architecture where each assignment
/// can have different lookup modes, form modes, and client modes
@JsonSerializable()
class AssignmentContext extends Equatable {
  const AssignmentContext({
    required this.assignmentId,
    required this.templateId,
    required this.surveyId,
    required this.config,
    required this.data,
    this.metadata,
  });

  /// Factory constructor from JSON
  factory AssignmentContext.fromJson(Map<String, dynamic> json) =>
      _$AssignmentContextFromJson(json);

  /// Unique identifier for this assignment
  final String assignmentId;

  /// Template identifier (e.g., "census_template", "business_template")
  final String templateId;

  /// Survey identifier for lookup data
  final String surveyId;

  /// Assignment-specific configuration
  final AssignmentConfig config;

  /// Assignment data containing responses, media, etc.
  final AssignmentData data;

  /// Optional metadata for additional assignment information
  final Map<String, dynamic>? metadata;

  /// Convert to JSON
  Map<String, dynamic> toJson() => _$AssignmentContextToJson(this);

  /// Create a copy with updated values
  AssignmentContext copyWith({
    String? assignmentId,
    String? templateId,
    String? surveyId,
    AssignmentConfig? config,
    AssignmentData? data,
    Map<String, dynamic>? metadata,
  }) {
    return AssignmentContext(
      assignmentId: assignmentId ?? this.assignmentId,
      templateId: templateId ?? this.templateId,
      surveyId: surveyId ?? this.surveyId,
      config: config ?? this.config,
      data: data ?? this.data,
      metadata: metadata ?? this.metadata,
    );
  }

  @override
  List<Object?> get props => [
    assignmentId,
    templateId,
    surveyId,
    config,
    data,
    metadata,
  ];
}

/// Assignment-specific configuration that can differ per template
/// This allows different templates to have different lookup modes,
/// form modes, and client modes as required by FASIH
@JsonSerializable()
class AssignmentConfig extends Equatable {
  const AssignmentConfig({
    required this.lookupMode,
    required this.formMode,
    required this.clientMode,
    this.isEncrypted = false,
    this.offlineCapable = true,
    this.allowEdit = true,
    this.autoSave = true,
    this.requireValidation = true,
  });

  /// Factory constructor from JSON
  factory AssignmentConfig.fromJson(Map<String, dynamic> json) =>
      _$AssignmentConfigFromJson(json);

  /// Create default configuration for CAPI mode (interviewer-administered)
  factory AssignmentConfig.capi({
    FormGearLookupMode lookupMode = FormGearLookupMode.offline,
    bool isEncrypted = false,
  }) {
    return AssignmentConfig(
      lookupMode: lookupMode,
      formMode: FormGearFormMode.open,
      clientMode: FormGearClientMode.capi,
      isEncrypted: isEncrypted,
    );
  }

  /// Create default configuration for CAWI mode (self-administered)
  factory AssignmentConfig.cawi({
    FormGearLookupMode lookupMode = FormGearLookupMode.online,
    bool isEncrypted = false,
  }) {
    return AssignmentConfig(
      lookupMode: lookupMode,
      formMode: FormGearFormMode.open,
      clientMode: FormGearClientMode.cawi,
      isEncrypted: isEncrypted,
      offlineCapable: false,
    );
  }

  /// Create default configuration for test mode
  factory AssignmentConfig.test({
    FormGearLookupMode lookupMode = FormGearLookupMode.local,
    bool isEncrypted = false,
  }) {
    return AssignmentConfig(
      lookupMode: lookupMode,
      formMode: FormGearFormMode.debug,
      clientMode: FormGearClientMode.test,
      isEncrypted: isEncrypted,
      autoSave: false,
      requireValidation: false,
    );
  }

  /// Lookup mode for this assignment (online, offline, local)
  final FormGearLookupMode lookupMode;

  /// Form mode for this assignment (open, restricted, debug)
  final FormGearFormMode formMode;

  /// Client mode for this assignment (capi, cawi, test)
  final FormGearClientMode clientMode;

  /// Whether assignment data should be encrypted
  final bool isEncrypted;

  /// Whether assignment can work offline
  final bool offlineCapable;

  /// Whether assignment allows editing
  final bool allowEdit;

  /// Whether assignment auto-saves changes
  final bool autoSave;

  /// Whether assignment requires validation before submission
  final bool requireValidation;

  /// Convert to JSON
  Map<String, dynamic> toJson() => _$AssignmentConfigToJson(this);

  /// Create a copy with updated values
  AssignmentConfig copyWith({
    FormGearLookupMode? lookupMode,
    FormGearFormMode? formMode,
    FormGearClientMode? clientMode,
    bool? isEncrypted,
    bool? offlineCapable,
    bool? allowEdit,
    bool? autoSave,
    bool? requireValidation,
  }) {
    return AssignmentConfig(
      lookupMode: lookupMode ?? this.lookupMode,
      formMode: formMode ?? this.formMode,
      clientMode: clientMode ?? this.clientMode,
      isEncrypted: isEncrypted ?? this.isEncrypted,
      offlineCapable: offlineCapable ?? this.offlineCapable,
      allowEdit: allowEdit ?? this.allowEdit,
      autoSave: autoSave ?? this.autoSave,
      requireValidation: requireValidation ?? this.requireValidation,
    );
  }

  @override
  List<Object?> get props => [
    lookupMode,
    formMode,
    clientMode,
    isEncrypted,
    offlineCapable,
    allowEdit,
    autoSave,
    requireValidation,
  ];
}

/// Assignment data containing all form-related information
/// Following FASIH's data structure for assignments
@JsonSerializable()
class AssignmentData extends Equatable {
  const AssignmentData({
    required this.template,
    required this.response,
    required this.validation,
    required this.reference,
    required this.media,
    required this.remark,
    required this.preset,
    this.principals = const [],
    this.userInfo,
  });

  /// Factory constructor from JSON
  factory AssignmentData.fromJson(Map<String, dynamic> json) =>
      _$AssignmentDataFromJson(json);

  /// Create empty assignment data
  factory AssignmentData.empty() {
    return const AssignmentData(
      template: {},
      response: {
        'details': {'answers': <dynamic>[]},
      },
      validation: {'testFunctions': <dynamic>[]},
      reference: {'predata': <dynamic>[]},
      media: {
        'details': {'media': <dynamic>[]},
      },
      remark: {'dataKey': 'default_remark', 'notes': <dynamic>[]},
      preset: {},
    );
  }

  /// Template JSON data
  final Map<String, dynamic> template;

  /// Previous response data (if any)
  final Map<String, dynamic> response;

  /// Validation rules
  final Map<String, dynamic> validation;

  /// Reference/lookup data
  final Map<String, dynamic> reference;

  /// Media file references
  final Map<String, dynamic> media;

  /// Remarks/comments
  final Map<String, dynamic> remark;

  /// Pre-filled data from sampling/assignment
  final Map<String, dynamic> preset;

  /// Principal data collection information
  final List<dynamic> principals;

  /// User information for this assignment
  final Map<String, dynamic>? userInfo;

  /// Convert to JSON
  Map<String, dynamic> toJson() => _$AssignmentDataToJson(this);

  /// Create a copy with updated values
  AssignmentData copyWith({
    Map<String, dynamic>? template,
    Map<String, dynamic>? response,
    Map<String, dynamic>? validation,
    Map<String, dynamic>? reference,
    Map<String, dynamic>? media,
    Map<String, dynamic>? remark,
    Map<String, dynamic>? preset,
    List<dynamic>? principals,
    Map<String, dynamic>? userInfo,
  }) {
    return AssignmentData(
      template: template ?? this.template,
      response: response ?? this.response,
      validation: validation ?? this.validation,
      reference: reference ?? this.reference,
      media: media ?? this.media,
      remark: remark ?? this.remark,
      preset: preset ?? this.preset,
      principals: principals ?? this.principals,
      userInfo: userInfo ?? this.userInfo,
    );
  }

  @override
  List<Object?> get props => [
    template,
    response,
    validation,
    reference,
    media,
    remark,
    preset,
    principals,
    userInfo,
  ];
}
