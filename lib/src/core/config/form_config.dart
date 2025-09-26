import 'package:equatable/equatable.dart';

/// Configuration for a specific form instance
class FormConfig extends Equatable {
  const FormConfig({
    required this.formId,
    this.template,
    this.validation,
    this.preset,
    this.response,
    this.media,
    this.reference,
    this.remark,
    this.formMode = 1,
    this.isNew = 1,
    this.principals,
    this.additionalData = const {},
  });

  /// Unique identifier for the form
  final String formId;

  /// Form template configuration
  final Map<String, dynamic>? template;

  /// Validation rules for the form
  final Map<String, dynamic>? validation;

  /// Preset/default values for form fields
  final Map<String, dynamic>? preset;

  /// Current response data (for editing existing forms)
  final Map<String, dynamic>? response;

  /// Media attachments (photos, documents, etc.)
  final Map<String, dynamic>? media;

  /// Reference data for lookups
  final Map<String, dynamic>? reference;

  /// Form remarks/comments
  final Map<String, dynamic>? remark;

  /// Form mode (1 = view, 2 = edit, etc.)
  final int formMode;

  /// Whether this is a new form (1 = new, 0 = existing)
  final int isNew;

  /// Principal collection data
  final List<dynamic>? principals;

  /// Additional custom data
  final Map<String, dynamic> additionalData;

  @override
  List<Object?> get props => [
    formId,
    template,
    validation,
    preset,
    response,
    media,
    reference,
    remark,
    formMode,
    isNew,
    principals,
    additionalData,
  ];

  FormConfig copyWith({
    String? formId,
    Map<String, dynamic>? template,
    Map<String, dynamic>? validation,
    Map<String, dynamic>? preset,
    Map<String, dynamic>? response,
    Map<String, dynamic>? media,
    Map<String, dynamic>? reference,
    Map<String, dynamic>? remark,
    int? formMode,
    int? isNew,
    List<dynamic>? principals,
    Map<String, dynamic>? additionalData,
  }) {
    return FormConfig(
      formId: formId ?? this.formId,
      template: template ?? this.template,
      validation: validation ?? this.validation,
      preset: preset ?? this.preset,
      response: response ?? this.response,
      media: media ?? this.media,
      reference: reference ?? this.reference,
      remark: remark ?? this.remark,
      formMode: formMode ?? this.formMode,
      isNew: isNew ?? this.isNew,
      principals: principals ?? this.principals,
      additionalData: additionalData ?? this.additionalData,
    );
  }
}
