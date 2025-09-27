import 'dart:convert';

import 'package:flutter/services.dart';
import 'package:form_gear_engine_sdk/src/core/base/result.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/handlers/android_data_handler.dart';
import 'package:form_gear_engine_sdk/src/domain/usecases/get_assignment_usecase.dart';
import 'package:form_gear_engine_sdk/src/domain/usecases/get_form_config_usecase.dart';
import 'package:form_gear_engine_sdk/src/domain/usecases/get_media_usecase.dart';
import 'package:form_gear_engine_sdk/src/domain/usecases/get_preset_usecase.dart';
import 'package:form_gear_engine_sdk/src/domain/usecases/get_reference_usecase.dart';
import 'package:form_gear_engine_sdk/src/domain/usecases/get_remark_usecase.dart';
import 'package:form_gear_engine_sdk/src/domain/usecases/get_response_usecase.dart';
import 'package:form_gear_engine_sdk/src/domain/usecases/get_template_usecase.dart';
import 'package:form_gear_engine_sdk/src/domain/usecases/get_user_name_usecase.dart';
import 'package:form_gear_engine_sdk/src/domain/usecases/get_validation_usecase.dart';

/// FASIH-specific data handler that integrates with FormGear use cases
/// Provides actual implementation for FASIH data loading patterns
class FasihDataHandler {
  const FasihDataHandler({
    required this.assignmentId,
    required this.templateId,
    required this.getTemplateUseCase,
    required this.getValidationUseCase,
    required this.getResponseUseCase,
    required this.getPresetUseCase,
    required this.getMediaUseCase,
    required this.getRemarkUseCase,
    required this.getReferenceUseCase,
    required this.getUserNameUseCase,
    required this.getUserRoleUseCase,
    required this.getFormModeUseCase,
    required this.getIsNewUseCase,
    required this.getPrincipalCollectionUseCase,
    required this.getRolePetugasUseCase,
    required this.getAssignmentUseCase,
  });

  final String assignmentId;
  final String templateId;
  final GetTemplateUseCase getTemplateUseCase;
  final GetValidationUseCase getValidationUseCase;
  final GetResponseUseCase getResponseUseCase;
  final GetPresetUseCase getPresetUseCase;
  final GetMediaUseCase getMediaUseCase;
  final GetRemarkUseCase getRemarkUseCase;
  final GetReferenceUseCase getReferenceUseCase;
  final GetUserNameUseCase getUserNameUseCase;
  final GetUserRoleUseCase getUserRoleUseCase;
  final GetFormModeUseCase getFormModeUseCase;
  final GetIsNewUseCase getIsNewUseCase;
  final GetPrincipalCollectionUseCase getPrincipalCollectionUseCase;
  final GetRolePetugasUseCase getRolePetugasUseCase;
  final GetAssignmentUseCase getAssignmentUseCase;

  /// Create AndroidDataHandler with FASIH use case implementations
  AndroidDataHandler createAndroidDataHandler() {
    return AndroidDataHandler(
      onGetTemplate: _getTemplate,
      onGetValidation: _getValidation,
      onGetResponse: _getResponse,
      onGetPreset: _getPreset,
      onGetMedia: _getMedia,
      onGetRemark: _getRemark,
      onGetReference: _getReference,
      onGetUserName: _getUserName,
      onGetUserRole: _getUserRole,
      onGetFormMode: _getFormMode,
      onGetIsNew: _getIsNew,
      onGetPrincipalCollection: _getPrincipalCollection,
      onGetRolePetugas: _getRolePetugas,
    );
  }

  Future<Map<String, dynamic>> _getTemplate() async {
    try {
      final result = await getTemplateUseCase(templateId);
      return result.fold(
        (Object error) => _getDefaultTemplate(),
        _parseJsonData,
      );
    } on Exception {
      return _getDefaultTemplate();
    }
  }

  Future<Map<String, dynamic>> _getValidation() async {
    try {
      final result = await getValidationUseCase(templateId);
      return result.fold(
        (Object error) => _getDefaultValidation(),
        _parseJsonData,
      );
    } on Exception {
      return _getDefaultValidation();
    }
  }

  Future<Map<String, dynamic>> _getResponse() async {
    try {
      final result = await getResponseUseCase(assignmentId);
      return result.fold(
        (Object error) => _getDefaultResponse(),
        _parseJsonData,
      );
    } on Exception {
      return _getDefaultResponse();
    }
  }

  Future<Map<String, dynamic>> _getPreset() async {
    try {
      final result = await getPresetUseCase(assignmentId);
      return result.fold(
        (Object error) => _getDefaultPreset(),
        _parseJsonData,
      );
    } on Exception {
      return _getDefaultPreset();
    }
  }

  Future<Map<String, dynamic>> _getMedia() async {
    try {
      final result = await getMediaUseCase(assignmentId);
      return result.fold(
        (Object error) => _getDefaultMedia(),
        _parseJsonData,
      );
    } on Exception {
      return _getDefaultMedia();
    }
  }

  Future<Map<String, dynamic>> _getRemark() async {
    try {
      final result = await getRemarkUseCase(assignmentId);
      return result.fold(
        (Object error) => _getDefaultRemark(),
        _parseJsonData,
      );
    } on Exception {
      return _getDefaultRemark();
    }
  }

  Future<Map<String, dynamic>> _getReference() async {
    try {
      final result = await getReferenceUseCase(assignmentId);
      return result.fold(
        (Object error) => _getDefaultReference(),
        _parseJsonData,
      );
    } on Exception {
      return _getDefaultReference();
    }
  }

  Future<String> _getUserName() async {
    try {
      final result = await getUserNameUseCase();
      return result.fold(
        (Object error) => 'Unknown User',
        (String data) => data,
      );
    } on Exception {
      return 'Unknown User';
    }
  }

  Future<String> _getUserRole() async {
    try {
      final result = await getUserRoleUseCase();
      return result.fold(
        (Object error) => 'USER',
        (String data) => data,
      );
    } on Exception {
      return 'USER';
    }
  }

  Future<int> _getFormMode() async {
    try {
      final result = await getFormModeUseCase();
      return result.fold(
        (Object error) => 0,
        (data) => int.tryParse(data) ?? 0,
      );
    } on Exception {
      return 0;
    }
  }

  Future<int> _getIsNew() async {
    try {
      final result = await getIsNewUseCase();
      return result.fold(
        (Object error) => 1,
        (data) => data.toLowerCase() == 'true' ? 1 : 0,
      );
    } on Exception {
      return 1;
    }
  }

  Future<List<dynamic>> _getPrincipalCollection() async {
    try {
      final result = await getPrincipalCollectionUseCase();
      return result.fold(
        (Object error) => <dynamic>[],
        _parseListData,
      );
    } on Exception {
      return <dynamic>[];
    }
  }

  Future<String> _getRolePetugas() async {
    try {
      final result = await getRolePetugasUseCase();
      return result.fold(
        (Object error) => 'USER',
        (String data) => data,
      );
    } on Exception {
      return 'USER';
    }
  }

  /// Parse JSON string to Map
  Map<String, dynamic> _parseJsonData(String jsonData) {
    try {
      final decoded = json.decode(jsonData);
      if (decoded is Map<String, dynamic>) {
        return decoded;
      }
      return {'data': decoded};
    } on FormatException {
      return {'error': 'Invalid JSON format', 'rawData': jsonData};
    }
  }

  /// Parse JSON string to List
  List<dynamic> _parseListData(String jsonData) {
    try {
      final decoded = json.decode(jsonData);
      if (decoded is List<dynamic>) {
        return decoded;
      }
      return [decoded];
    } on FormatException {
      return <dynamic>[];
    }
  }

  /// Load default template from assets
  Map<String, dynamic> _getDefaultTemplate() {
    return {
      'template': {
        'id': templateId,
        'version': '1.0.0',
        'fields': <dynamic>[],
      },
      'error': 'Template not found, using default',
    };
  }

  /// Load default validation from assets
  Map<String, dynamic> _getDefaultValidation() {
    return {
      'validation': {
        'templateId': templateId,
        'rules': <dynamic>[],
      },
      'error': 'Validation not found, using default',
    };
  }

  /// Load default response from assets (matching FASIH structure exactly)
  Future<Map<String, dynamic>> _getDefaultResponse() async {
    try {
      final jsonString = await rootBundle.loadString(
        'packages/form_gear_engine_sdk/assets/client/formgear/response.json',
      );
      return _parseJsonData(jsonString);
    } on Exception {
      return {
        'description': '',
        'dataKey': '',
        'answers': <dynamic>[],
      };
    }
  }

  /// Load default preset from assets
  Future<Map<String, dynamic>> _getDefaultPreset() async {
    // FASIH doesn't have a default preset file, return empty data
    return <String, dynamic>{};
  }

  /// Load default media from assets (matching FASIH structure exactly)
  Future<Map<String, dynamic>> _getDefaultMedia() async {
    try {
      final jsonString = await rootBundle.loadString(
        'packages/form_gear_engine_sdk/assets/client/formgear/media.json',
      );
      return _parseJsonData(jsonString);
    } on Exception {
      return {
        'dataKey': '',
        'media': <dynamic>[],
      };
    }
  }

  /// Load default remark from assets
  Future<Map<String, dynamic>> _getDefaultRemark() async {
    // FASIH doesn't have a default remark file, return empty data
    return <String, dynamic>{};
  }

  /// Load default reference from assets (matching FASIH structure exactly)
  Future<Map<String, dynamic>> _getDefaultReference() async {
    try {
      final jsonString = await rootBundle.loadString(
        'packages/form_gear_engine_sdk/assets/client/formgear/reference.json',
      );
      return _parseJsonData(jsonString);
    } on Exception {
      return {
        'details': <dynamic>[],
        'sidebar': <dynamic>[],
      };
    }
  }
}
