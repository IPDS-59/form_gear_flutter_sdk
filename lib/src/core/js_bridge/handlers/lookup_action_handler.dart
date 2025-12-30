import 'dart:convert';
import 'dart:io';

import 'package:flutter/services.dart';
import 'package:form_gear_engine_sdk/form_gear_engine_sdk.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/handlers/action_handler_contract.dart';
import 'package:form_gear_engine_sdk/src/core/security/path_validator.dart';
import 'package:form_gear_engine_sdk/src/utils/form_data_file_manager.dart';
import 'package:form_gear_engine_sdk/src/utils/utils.dart';

/// Handler for lookup-related actions (GET_ANSWER, LOOKUP)
class LookupActionHandler with ActionHandlerContract {
  @override
  List<String> get supportedActions => ['GET_ANSWER', 'LOOKUP'];

  @override
  Future<ActionInfoJs> handle(
    String action,
    String dataKey,
    String data,
  ) async {
    switch (action) {
      case 'GET_ANSWER':
        return _handleGetAnswer(dataKey, data);
      case 'LOOKUP':
        return _handleLookup(dataKey, data);
      default:
        return ActionInfoJs(
          success: false,
          error: 'Unsupported lookup action: $action',
        );
    }
  }

  /// Handle get answer action - retrieves answer from data source
  Future<ActionInfoJs> _handleGetAnswer(String dataKey, String data) async {
    try {
      FormGearLogger.webview('Get answer action for dataKey: $dataKey');

      final assignmentId = data.isNotEmpty ? data : 'current_assignment';

      final responseData = await _loadResponseData(assignmentId);
      final answer = _extractAnswerByKey(responseData, dataKey);

      if (answer != null) {
        return ActionInfoJs(success: true, result: answer);
      } else {
        return ActionInfoJs(success: true, result: '');
      }
    } on Exception catch (e) {
      FormGearLogger.webviewError('Get answer error: $e');
      return ActionInfoJs(success: false, error: 'Get answer error: $e');
    }
  }

  /// Handle lookup action - performs data lookup from FASIH sources
  Future<ActionInfoJs> _handleLookup(String dataKey, String data) async {
    try {
      FormGearLogger.webview(
        'Lookup action for dataKey: $dataKey, data: $data',
      );

      Map<String, dynamic>? lookupParams;
      if (data.isNotEmpty) {
        try {
          lookupParams = jsonDecode(data) as Map<String, dynamic>?;
        } on Exception catch (e) {
          FormGearLogger.webviewError('Failed to parse lookup data: $e');
        }
      }

      final surveyId = lookupParams?['surveyId'] as String? ?? 'current_survey';
      final lookupType = lookupParams?['type'] as String? ?? 'default';
      final searchQuery = lookupParams?['query'] as String? ?? '';

      final lookupData = await _loadLookupData(surveyId, lookupType);

      final filteredData = searchQuery.isNotEmpty
          ? _filterLookupData(lookupData, searchQuery)
          : lookupData;

      if (filteredData.isNotEmpty) {
        final result = {
          'success': true,
          'data': filteredData,
          'count': filteredData.length,
          'query': searchQuery,
          'surveyId': surveyId,
          'type': lookupType,
        };

        FormGearLogger.webview(
          'Lookup completed for $dataKey: ${filteredData.length} items',
        );
        return ActionInfoJs(success: true, result: jsonEncode(result));
      } else {
        return ActionInfoJs(
          success: true,
          result: jsonEncode({
            'success': true,
            'data': <Map<String, dynamic>>[],
            'count': 0,
            'message': 'No lookup data found',
          }),
        );
      }
    } on Exception catch (e) {
      FormGearLogger.webviewError('Lookup error: $e');
      return ActionInfoJs(success: false, error: 'Lookup error: $e');
    }
  }

  /// Load response data from assignment file or fallback to default
  Future<Map<String, dynamic>?> _loadResponseData(String assignmentId) async {
    try {
      final dataPath = await FormDataFileManager.getAssignmentDataPath(
        assignmentId,
      );
      final content = await FormDataFileManager.readFileContent(dataPath);

      if (content != null) {
        final responseData = jsonDecode(content) as Map<String, dynamic>;
        FormGearLogger.webview('Loaded response data from: $dataPath');
        return responseData;
      }
    } on Exception catch (e) {
      FormGearLogger.webviewError('Failed to load assignment data: $e');
    }

    try {
      final assetContent = await rootBundle.loadString(
        'packages/form_gear_engine_sdk/assets/client/formgear/response.json',
      );
      final responseData = jsonDecode(assetContent) as Map<String, dynamic>;
      FormGearLogger.webview('Using default response data from assets');
      return responseData;
    } on Exception catch (e) {
      FormGearLogger.webviewError('Failed to load default response data: $e');
      return null;
    }
  }

  /// Extract answer value by dataKey from response data
  String? _extractAnswerByKey(
    Map<String, dynamic>? responseData,
    String dataKey,
  ) {
    if (responseData == null || dataKey.isEmpty) {
      return null;
    }

    try {
      final answers = responseData['answers'] as List<dynamic>?;
      if (answers == null) {
        return null;
      }

      for (final answer in answers) {
        if (answer is Map<String, dynamic>) {
          final key = answer['dataKey'] as String?;
          if (key == dataKey) {
            final value = answer['value'];
            return value?.toString();
          }
        }
      }

      FormGearLogger.webview('No answer found for dataKey: $dataKey');
      return null;
    } on Exception catch (e) {
      FormGearLogger.webviewError('Error extracting answer for $dataKey: $e');
      return null;
    }
  }

  /// Load lookup data from FASIH sources
  Future<List<Map<String, dynamic>>> _loadLookupData(
    String surveyId,
    String lookupType,
  ) async {
    try {
      final lookupDir = await FormDataFileManager.getLookupDirectory(surveyId);
      final lookupFilePath = '${lookupDir.path}/$lookupType.json';

      final validationResult = PathValidator.validate(
        lookupFilePath,
        type: PathValidationType.data,
      );

      if (!validationResult.isValid) {
        FormGearLogger.webviewError(
          'Invalid lookup file path: ${validationResult.error}',
        );
        return [];
      }

      final lookupFile = File(validationResult.sanitizedPath);

      if (lookupFile.existsSync()) {
        final content = await lookupFile.readAsString();
        final data = jsonDecode(content);

        if (data is List) {
          return List<Map<String, dynamic>>.from(
            data.map((item) => item as Map<String, dynamic>),
          );
        } else if (data is Map<String, dynamic> && data['data'] is List) {
          return List<Map<String, dynamic>>.from(
            (data['data'] as List).map((item) => item as Map<String, dynamic>),
          );
        }
      }
    } on Exception catch (e) {
      FormGearLogger.webviewError('Failed to load lookup data: $e');
    }

    return [
      {
        'id': '1',
        'code': 'A001',
        'name': 'Sample Lookup Item 1',
        'description': 'This is a sample lookup item for testing',
        'category': 'default',
        'active': true,
      },
      {
        'id': '2',
        'code': 'A002',
        'name': 'Sample Lookup Item 2',
        'description': 'Another sample lookup item',
        'category': 'default',
        'active': true,
      },
      {
        'id': '3',
        'code': 'B001',
        'name': 'Category B Item',
        'description': 'Sample item from category B',
        'category': 'category_b',
        'active': true,
      },
    ];
  }

  /// Filter lookup data based on search query
  List<Map<String, dynamic>> _filterLookupData(
    List<Map<String, dynamic>> data,
    String query,
  ) {
    if (query.isEmpty) return data;

    final lowercaseQuery = query.toLowerCase();
    return data.where((item) {
      final searchableFields = ['name', 'code', 'description', 'category'];

      for (final field in searchableFields) {
        final value = item[field]?.toString().toLowerCase() ?? '';
        if (value.contains(lowercaseQuery)) {
          return true;
        }
      }
      return false;
    }).toList();
  }
}
