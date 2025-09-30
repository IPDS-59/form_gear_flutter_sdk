import 'package:equatable/equatable.dart';
import 'package:form_gear_engine_sdk/src/models/assignment_context.dart';
import 'package:json_annotation/json_annotation.dart';

part 'save_submit_data.g.dart';

/// Data model containing all information for save/submit operations
///
/// This class encapsulates all data that FASIH saves during saveOrSubmit operations:
/// - Form response data (answers, selections, inputs)
/// - Remark data (comments, notes from users)
/// - Principal data (collection metadata, signatures)
/// - Reference data (lookup data, validation references)
/// - Media data (file references, image paths, signatures)
/// - Assignment context (for dynamic configuration)
/// - Operation flag (save vs submit)
///
/// Based on FASIH analysis:
/// - FormGear v1: saveOrSubmit(data, remark, principal, reference, media, flag)
/// - FasihForm v2: saveOrSubmitFasihForm(data, remark, principal, flag)
@JsonSerializable()
class SaveSubmitData extends Equatable {
  const SaveSubmitData({
    required this.assignmentContext,
    required this.formData,
    required this.remark,
    required this.principal,
    required this.flag,
    this.reference,
    this.media,
    this.engineType = SaveSubmitEngineType.formGear,
    this.timestamp,
    this.metadata,
  });

  /// Factory constructor from JSON
  factory SaveSubmitData.fromJson(Map<String, dynamic> json) =>
      _$SaveSubmitDataFromJson(json);

  /// Create SaveSubmitData for FormGear v1 (full parameter set)
  factory SaveSubmitData.formGear({
    required AssignmentContext assignmentContext,
    required String formData,
    required String remark,
    required String principal,
    required String reference,
    required String media,
    required String flag,
    Map<String, dynamic>? metadata,
  }) {
    return SaveSubmitData(
      assignmentContext: assignmentContext,
      formData: formData,
      remark: remark,
      principal: principal,
      reference: reference,
      media: media,
      flag: flag,
      timestamp: DateTime.now(),
      metadata: metadata,
    );
  }

  /// Create SaveSubmitData for FasihForm v2 (simplified parameter set)
  factory SaveSubmitData.fasihForm({
    required AssignmentContext assignmentContext,
    required String formData,
    required String remark,
    required String principal,
    required String flag,
    Map<String, dynamic>? metadata,
  }) {
    return SaveSubmitData(
      assignmentContext: assignmentContext,
      formData: formData,
      remark: remark,
      principal: principal,
      flag: flag,
      engineType: SaveSubmitEngineType.fasihForm,
      timestamp: DateTime.now(),
      metadata: metadata,
    );
  }

  /// Assignment context containing configuration and template information
  final AssignmentContext assignmentContext;

  /// Main form data containing all answers and responses (JSON string)
  ///
  /// This typically contains:
  /// - Form answers and user inputs
  /// - Component selections and values
  /// - Calculated fields and derived data
  /// - Form state and progress information
  final String formData;

  /// Remark data containing comments and notes (JSON string)
  ///
  /// This typically contains:
  /// - User comments and notes
  /// - Interviewer remarks
  /// - Field observations
  /// - Data quality notes
  final String remark;

  /// Principal data containing collection metadata (JSON string)
  ///
  /// This typically contains:
  /// - Collection signatures and approvals
  /// - User authentication data
  /// - Supervisor confirmations
  /// - Quality control signatures
  final String principal;

  /// Reference data containing lookup and validation data (JSON string)
  ///
  /// This is only available in FormGear v1 saveOrSubmit.
  /// FasihForm v2 does not include reference data in saveOrSubmitFasihForm.
  ///
  /// This typically contains:
  /// - Lookup table references
  /// - Validation rules and constraints
  /// - Cross-reference data
  /// - Administrative boundaries
  final String? reference;

  /// Media data containing file references and metadata (JSON string)
  ///
  /// This is only available in FormGear v1 saveOrSubmit.
  /// FasihForm v2 does not include media data in saveOrSubmitFasihForm.
  ///
  /// This typically contains:
  /// - Image file paths and metadata
  /// - Document attachments
  /// - Audio recording references
  /// - Signature image data
  final String? media;

  /// Operation flag indicating save vs submit
  ///
  /// Common values:
  /// - 'save': Save form data locally (temporary save)
  /// - 'submit': Submit form data for processing (final submission)
  /// - 'draft': Save as draft (editable)
  /// - 'final': Final submission (non-editable)
  final String flag;

  /// Engine type that triggered this save/submit operation
  final SaveSubmitEngineType engineType;

  /// When this save/submit operation was initiated
  final DateTime? timestamp;

  /// Additional metadata for the save/submit operation
  ///
  /// Can contain custom data specific to your application needs:
  /// - GPS coordinates
  /// - Device information
  /// - Network status
  /// - Custom tracking data
  final Map<String, dynamic>? metadata;

  /// Convenience getter for assignment ID
  String get assignmentId => assignmentContext.assignmentId;

  /// Convenience getter for template ID
  String get templateId => assignmentContext.templateId;

  /// Convenience getter for survey ID
  String get surveyId => assignmentContext.surveyId;

  /// Convenience getter for assignment configuration
  AssignmentConfig get config => assignmentContext.config;

  /// Check if this is a save operation (vs submit)
  bool get isSave =>
      flag.toLowerCase() == 'save' || flag.toLowerCase() == 'draft';

  /// Check if this is a submit operation (vs save)
  bool get isSubmit =>
      flag.toLowerCase() == 'submit' || flag.toLowerCase() == 'final';

  /// Check if this data should be encrypted based on assignment configuration
  bool get shouldEncrypt => assignmentContext.config.isEncrypted;

  /// Check if this is from FormGear v1 engine
  bool get isFormGear => engineType == SaveSubmitEngineType.formGear;

  /// Check if this is from FasihForm v2 engine
  bool get isFasihForm => engineType == SaveSubmitEngineType.fasihForm;

  /// Get all file data that should be saved (following FASIH patterns)
  ///
  /// Returns a map of file types to their data content:
  /// - 'data.json': Form data
  /// - 'remark.json': Remark data
  /// - 'principal.json': Principal data
  /// - 'reference.json': Reference data (FormGear only)
  /// - 'media.json': Media data (FormGear only)
  Map<String, String> getFileData() {
    final files = <String, String>{
      'data.json': formData,
      'remark.json': remark,
      'principal.json': principal,
    };

    // Add FormGear-specific files
    if (isFormGear) {
      if (reference != null) {
        files['reference.json'] = reference!;
      }
      if (media != null) {
        files['media.json'] = media!;
      }
    }

    return files;
  }

  /// Get FASIH-compatible directory path for this assignment
  ///
  /// Returns: 'BPS/assignments/{assignmentId}/'
  String getFasihDirectoryPath() {
    return 'BPS/assignments/$assignmentId/';
  }

  /// Convert to JSON
  Map<String, dynamic> toJson() => _$SaveSubmitDataToJson(this);

  /// Create a copy with updated values
  SaveSubmitData copyWith({
    AssignmentContext? assignmentContext,
    String? formData,
    String? remark,
    String? principal,
    String? reference,
    String? media,
    String? flag,
    SaveSubmitEngineType? engineType,
    DateTime? timestamp,
    Map<String, dynamic>? metadata,
  }) {
    return SaveSubmitData(
      assignmentContext: assignmentContext ?? this.assignmentContext,
      formData: formData ?? this.formData,
      remark: remark ?? this.remark,
      principal: principal ?? this.principal,
      reference: reference ?? this.reference,
      media: media ?? this.media,
      flag: flag ?? this.flag,
      engineType: engineType ?? this.engineType,
      timestamp: timestamp ?? this.timestamp,
      metadata: metadata ?? this.metadata,
    );
  }

  @override
  List<Object?> get props => [
    assignmentContext,
    formData,
    remark,
    principal,
    reference,
    media,
    flag,
    engineType,
    timestamp,
    metadata,
  ];

  @override
  String toString() {
    return 'SaveSubmitData{assignmentId: $assignmentId, '
        'templateId: $templateId, flag: $flag, '
        'engineType: $engineType, timestamp: $timestamp}';
  }
}

/// Enum representing which form engine triggered the save/submit operation
@JsonEnum()
enum SaveSubmitEngineType {
  /// FormGear v1 engine (full parameter set)
  @JsonValue('formGear')
  formGear,

  /// FasihForm v2 engine (simplified parameter set)
  @JsonValue('fasihForm')
  fasihForm;

  /// Display name for the engine type
  String get displayName {
    switch (this) {
      case SaveSubmitEngineType.formGear:
        return 'FormGear v1';
      case SaveSubmitEngineType.fasihForm:
        return 'FasihForm v2';
    }
  }

  /// Engine ID used in file paths and configuration
  String get engineId {
    switch (this) {
      case SaveSubmitEngineType.formGear:
        return '1';
      case SaveSubmitEngineType.fasihForm:
        return '2';
    }
  }
}
