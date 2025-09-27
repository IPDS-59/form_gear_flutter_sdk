import 'package:form_gear_engine_sdk/src/core/js_bridge/js_handler_base.dart';

/// Generic response for success/failure operations
class GenericInfoJs extends JsonCodable {
  GenericInfoJs({
    required this.success,
    this.message,
  });

  factory GenericInfoJs.fromJson(Map<String, dynamic> json) {
    return GenericInfoJs(
      success: json['success'] as bool,
      message: json['message'] as String?,
    );
  }
  final bool success;
  final String? message;

  @override
  List<Object?> get props => [success, message];

  @override
  Map<String, dynamic> toJson() {
    return {
      'success': success,
      if (message != null) 'message': message,
    };
  }
}

/// Response for string values (like getUserName)
class StringInfoJs extends JsonCodable {
  StringInfoJs({
    required this.success,
    this.value,
    this.error,
  });

  factory StringInfoJs.fromJson(Map<String, dynamic> json) {
    return StringInfoJs(
      success: json['success'] as bool,
      value: json['value'] as String?,
      error: json['error'] as String?,
    );
  }
  final bool success;
  final String? value;
  final String? error;

  @override
  List<Object?> get props => [success, value, error];

  @override
  Map<String, dynamic> toJson() {
    return {
      'success': success,
      if (value != null) 'value': value,
      if (error != null) 'error': error,
    };
  }
}

/// Response for JSON data (like getTemplate, getPreset)
class JsonInfoJs extends JsonCodable {
  JsonInfoJs({
    required this.success,
    this.data,
    this.error,
  });

  factory JsonInfoJs.fromJson(Map<String, dynamic> json) {
    return JsonInfoJs(
      success: json['success'] as bool,
      data: json['data'] as Map<String, dynamic>?,
      error: json['error'] as String?,
    );
  }
  final bool success;
  final Map<String, dynamic>? data;
  final String? error;

  @override
  List<Object?> get props => [success, data, error];

  @override
  Map<String, dynamic> toJson() {
    return {
      'success': success,
      if (data != null) 'data': data,
      if (error != null) 'error': error,
    };
  }
}

/// Response for list/array data (like getPrincipalCollection)
class ListInfoJs extends JsonCodable {
  ListInfoJs({
    required this.success,
    this.data,
    this.error,
  });

  factory ListInfoJs.fromJson(Map<String, dynamic> json) {
    return ListInfoJs(
      success: json['success'] as bool,
      data: json['data'] as List<dynamic>?,
      error: json['error'] as String?,
    );
  }
  final bool success;
  final List<dynamic>? data;
  final String? error;

  @override
  List<Object?> get props => [success, data, error];

  @override
  Map<String, dynamic> toJson() {
    return {
      'success': success,
      if (data != null) 'data': data,
      if (error != null) 'error': error,
    };
  }
}

/// Response for action operations (like camera, file upload)
class ActionInfoJs extends JsonCodable {
  ActionInfoJs({
    required this.success,
    this.result,
    this.error,
  });

  factory ActionInfoJs.fromJson(Map<String, dynamic> json) {
    return ActionInfoJs(
      success: json['success'] as bool,
      result: json['result'] as String?,
      error: json['error'] as String?,
    );
  }
  final bool success;
  final String? result;
  final String? error;

  @override
  List<Object?> get props => [success, result, error];

  @override
  Map<String, dynamic> toJson() {
    return {
      'success': success,
      if (result != null) 'result': result,
      if (error != null) 'error': error,
    };
  }
}

/// Response for submission operations
class SubmissionInfoJs extends JsonCodable {
  SubmissionInfoJs({
    required this.success,
    this.submissionId,
    this.error,
  });

  factory SubmissionInfoJs.fromJson(Map<String, dynamic> json) {
    return SubmissionInfoJs(
      success: json['success'] as bool,
      submissionId: json['submissionId'] as String?,
      error: json['error'] as String?,
    );
  }
  final bool success;
  final String? submissionId;
  final String? error;

  @override
  List<Object?> get props => [success, submissionId, error];

  @override
  Map<String, dynamic> toJson() {
    return {
      'success': success,
      if (submissionId != null) 'submissionId': submissionId,
      if (error != null) 'error': error,
    };
  }
}
