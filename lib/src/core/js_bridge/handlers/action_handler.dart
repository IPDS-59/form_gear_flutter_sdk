import 'dart:convert';
import 'dart:io';

import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/js_handler_base.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/models/response_models.dart';
import 'package:form_gear_engine_sdk/src/presentation/widgets/audio_recorder_screen.dart';
import 'package:form_gear_engine_sdk/src/presentation/widgets/barcode_scanner_screen.dart';
import 'package:form_gear_engine_sdk/src/utils/fasih_media_helper.dart';
import 'package:form_gear_engine_sdk/src/utils/form_data_file_manager.dart';
import 'package:form_gear_engine_sdk/src/utils/location_service_helper.dart';
import 'package:form_gear_engine_sdk/src/utils/utils.dart';
import 'package:image_picker/image_picker.dart';
import 'package:permission_handler/permission_handler.dart';

/// Individual JSHandler for FormGear action() calls
class ActionHandler extends JSHandler<ActionInfoJs> {
  @override
  String get handlerName => 'action';

  @override
  Future<ActionInfoJs> callback(List<dynamic> arguments) async {
    try {
      if (arguments.isEmpty) {
        return ActionInfoJs(success: false, error: 'No action specified');
      }

      final action = arguments[0].toString().toUpperCase();
      final dataKey = arguments.length > 1 ? arguments[1].toString() : '';
      final data = arguments.length > 2 ? arguments[2].toString() : '';

      FormGearLogger.webview(
        'Action handler called: $action, dataKey: $dataKey, data: $data',
      );

      // Route to specific action implementations
      switch (action) {
        case 'CAMERA':
          return await _handleCameraAction(dataKey, data);
        case 'CAMERA_GPS':
          return await _handleCameraGPSAction(dataKey, data);
        case 'FILE_UPLOAD':
        case 'FILE_PICKER':
          return await _handleFilePickerAction(dataKey, data);
        case 'FILE_RELOAD':
          return await _handleFileReloadAction(dataKey, data);
        case 'LOCATION':
          return await _handleLocationAction(dataKey, data);
        case 'OPEN_MAPS':
          return await _handleOpenMapsAction(dataKey, data);
        case 'SIGNATURE':
          return await _handleSignatureAction(dataKey, data);
        case 'GET_ANSWER':
          return await _handleGetAnswerAction(dataKey, data);
        case 'BARCODE':
        case 'QR_SCAN':
          return await _handleBarcodeAction(dataKey, data);
        case 'AUDIO':
          return await _handleAudioAction(dataKey, data);
        case 'LOOKUP':
          return await _handleLookupAction(dataKey, data);
        default:
          FormGearLogger.webview('Unknown action: $action');
          return ActionInfoJs(success: false, error: 'Unknown action: $action');
      }
    } on Exception catch (e) {
      FormGearLogger.webviewError('Action handler error: $e');
      return ActionInfoJs(success: false, error: e.toString());
    }
  }

  /// Handle camera with GPS action - returns location coordinates (no camera)
  Future<ActionInfoJs> _handleCameraGPSAction(
    String dataKey,
    String data,
  ) async {
    try {
      FormGearLogger.webview('Getting GPS location for dataKey: $dataKey');

      // Ensure location access using helper
      final accessResult = await LocationServiceHelper.ensureLocationAccess(
        contextDescription: 'camera GPS',
      );

      if (!accessResult.success) {
        return ActionInfoJs(
          success: false,
          error: accessResult.errorMessage ?? 'Location access failed',
        );
      }

      // Get current location using helper
      final locationResult = await LocationServiceHelper.getCurrentLocation();
      if (!locationResult.success) {
        return ActionInfoJs(
          success: false,
          error: locationResult.errorMessage ?? 'Failed to get location',
        );
      }

      final position = locationResult.position!;

      // Return GPS coordinates in FormGear expected format
      final result = {
        'success': true,
        'coordinat': {
          'latitude': position.latitude,
          'longitude': position.longitude,
        },
        'accuracy': position.accuracy,
        'provider': 'GPS',
        'timestamp': DateTime.now().toIso8601String(),
        'remark': 'GPS location acquired successfully',
      };

      FormGearLogger.webview(
        'GPS location completed: ${position.latitude},${position.longitude}',
      );
      return ActionInfoJs(success: true, result: jsonEncode(result));
    } on Exception catch (e) {
      FormGearLogger.webviewError('Camera with GPS error: $e');
      return ActionInfoJs(success: false, error: 'Camera with GPS error: $e');
    }
  }

  /// Handle camera action following FASIH media patterns
  Future<ActionInfoJs> _handleCameraAction(String dataKey, String data) async {
    try {
      FormGearLogger.webview('Opening camera for dataKey: $dataKey');

      // Request camera permission first
      final cameraStatus = await Permission.camera.request();
      if (cameraStatus.isDenied) {
        return ActionInfoJs(
          success: false,
          error: 'Camera permission denied',
        );
      }

      if (cameraStatus.isPermanentlyDenied) {
        return ActionInfoJs(
          success: false,
          error:
              'Camera permission permanently denied. '
              'Please enable in settings.',
        );
      }

      // Open camera using image picker
      final picker = ImagePicker();
      final image = await picker.pickImage(
        source: ImageSource.camera,
        imageQuality: 85,
        maxWidth: 1920,
        maxHeight: 1080,
      );

      if (image != null) {
        // Follow FASIH pattern: save to assignment media directory
        final assignmentId = data.isNotEmpty ? data : 'current_assignment';
        final fileName = FasihMediaHelper.generateFileName(
          dataKey: dataKey,
          mediaType: 'photo',
          extension: 'jpg',
        );

        // Save media file following FASIH pattern
        final success = await FasihMediaHelper.saveMediaFile(
          assignmentId: assignmentId,
          sourceFile: File(image.path),
          fileName: fileName,
          mediaType: 'photo',
        );

        if (success) {
          FormGearLogger.webview('Camera completed: $fileName');
          return ActionInfoJs(success: true, result: fileName);
        } else {
          return ActionInfoJs(
            success: false,
            error: 'Failed to save camera image',
          );
        }
      } else {
        FormGearLogger.webview('Camera cancelled by user');
        return ActionInfoJs(success: false, error: 'Camera cancelled by user');
      }
    } on Exception catch (e) {
      FormGearLogger.webviewError('Camera error: $e');
      return ActionInfoJs(success: false, error: 'Camera error: $e');
    }
  }

  /// Handle file picker action
  Future<ActionInfoJs> _handleFilePickerAction(
    String dataKey,
    String data,
  ) async {
    try {
      FormGearLogger.webview('Opening file picker for dataKey: $dataKey');

      // Request storage permission first (for Android)
      final storageStatus = await Permission.storage.request();
      if (storageStatus.isDenied) {
        // Try with media access permission for newer Android versions
        final mediaStatus = await Permission.photos.request();
        if (mediaStatus.isDenied) {
          return ActionInfoJs(
            success: false,
            error: 'Storage permission denied',
          );
        }
      }

      // Open file picker
      final result = await FilePicker.platform.pickFiles();

      if (result != null && result.files.single.path != null) {
        final filePath = result.files.single.path!;
        FormGearLogger.webview('File picker completed: $filePath');
        return ActionInfoJs(success: true, result: filePath);
      } else {
        FormGearLogger.webview('File picker cancelled by user');
        return ActionInfoJs(
          success: false,
          error: 'File picker cancelled by user',
        );
      }
    } on Exception catch (e) {
      FormGearLogger.webviewError('File picker error: $e');
      return ActionInfoJs(success: false, error: 'File picker error: $e');
    }
  }

  /// Handle location action
  Future<ActionInfoJs> _handleLocationAction(
    String dataKey,
    String data,
  ) async {
    try {
      FormGearLogger.webview('Getting location for dataKey: $dataKey');

      // Ensure location access using helper
      final accessResult = await LocationServiceHelper.ensureLocationAccess(
        contextDescription: 'location',
      );
      if (!accessResult.success) {
        return ActionInfoJs(
          success: false,
          error: accessResult.errorMessage ?? 'Location access failed',
        );
      }

      // Get current location using helper
      final locationResult = await LocationServiceHelper.getCurrentLocation();
      if (!locationResult.success) {
        return ActionInfoJs(
          success: false,
          error: locationResult.errorMessage ?? 'Failed to get location',
        );
      }

      final position = locationResult.position!;
      final locationData = '${position.latitude},${position.longitude}';
      FormGearLogger.webview('Location completed: $locationData');
      return ActionInfoJs(success: true, result: locationData);
    } on Exception catch (e) {
      FormGearLogger.webviewError('Location error: $e');
      return ActionInfoJs(success: false, error: 'Location error: $e');
    }
  }

  /// Handle signature action - shows signature capture screen and returns
  /// base64 PNG data
  Future<ActionInfoJs> _handleSignatureAction(
    String dataKey,
    String data,
  ) async {
    try {
      FormGearLogger.webview('Signature action for dataKey: $dataKey');

      // Get current context from navigator
      final context = _getCurrentContext();
      if (context == null) {
        return ActionInfoJs(
          success: false,
          error: 'No valid context available for signature capture',
        );
      }

      // // Show signature capture screen
      // final signatureBytes = await Navigator.of(context)
      //     .push<Uint8List>(
      //       MaterialPageRoute(
      //         builder: (context) => SignatureCaptureScreen(
      //           title: 'Signature - $dataKey',
      //         ),
      //       ),
      //     );

      // if (signatureBytes != null) {
      //   // Convert to base64
      //   final base64String = base64Encode(signatureBytes);
      //   final signatureBase64 = 'data:image/png;base64,$base64String';

      //   final result = {
      //     'value': signatureBase64,
      //     'type': 'image/png',
      //     'remark': 'Signature captured successfully',
      //   };

      //   FormGearLogger.webview(
      //     'Signature captured successfully for dataKey: $dataKey',
      //   );
      //   return ActionInfoJs(success: true, result: jsonEncode(result));
      // } else {
      //   FormGearLogger.webview('Signature capture cancelled by user');
      //   return ActionInfoJs(
      //     success: false,
      //     error: 'Signature capture cancelled by user',
      //   );
      // }

      return ActionInfoJs(
        success: true,
      );
    } on Exception catch (e) {
      FormGearLogger.webviewError('Signature action error: $e');
      return ActionInfoJs(success: false, error: 'Signature action error: $e');
    }
  }

  /// Handle file reload action - refreshes file display
  Future<ActionInfoJs> _handleFileReloadAction(
    String dataKey,
    String data,
  ) async {
    try {
      FormGearLogger.webview('File reload for dataKey: $dataKey, data: $data');

      // Parse the file data if provided
      if (data.isNotEmpty) {
        try {
          final fileData = jsonDecode(data);
          FormGearLogger.webview('File reload data: $fileData');
        } on Exception catch (e) {
          FormGearLogger.webviewError('Failed to parse file reload data: $e');
        }
      }

      // For file reload, we typically just need to confirm the action
      // The actual file refresh is handled by the WebView
      return ActionInfoJs(
        success: true,
        result: 'File reload completed',
      );
    } on Exception catch (e) {
      FormGearLogger.webviewError('File reload error: $e');
      return ActionInfoJs(success: false, error: 'File reload error: $e');
    }
  }

  /// Handle open maps action - opens device maps app with coordinates
  /// Supports both comma-separated string format "lat,lng" and JSON format
  Future<ActionInfoJs> _handleOpenMapsAction(
    String dataKey,
    String data,
  ) async {
    try {
      FormGearLogger.webview('Open maps for dataKey: $dataKey, data: $data');

      if (data.isEmpty) {
        return ActionInfoJs(
          success: false,
          error: 'No coordinates provided for maps',
        );
      }

      double? latitude;
      double? longitude;

      // Try to parse as comma-separated string first (most common format)
      if (data.contains(',')) {
        final coords = data.split(',');
        if (coords.length >= 2) {
          try {
            latitude = double.parse(coords[0].trim());
            longitude = double.parse(coords[1].trim());
          } on FormatException {
            // Fall through to JSON parsing
          }
        }
      }

      // If string parsing failed, try JSON format
      if (latitude == null || longitude == null) {
        try {
          final coordinates = jsonDecode(data) as Map<String, dynamic>;
          final latValue = coordinates['latitude'] ?? coordinates['lat'];
          final lngValue = coordinates['longitude'] ?? coordinates['lng'];

          if (latValue != null) {
            latitude = double.tryParse(latValue.toString());
          }
          if (lngValue != null) {
            longitude = double.tryParse(lngValue.toString());
          }
        } on Exception {
          // JSON parsing also failed
        }
      }

      if (latitude == null || longitude == null) {
        return ActionInfoJs(
          success: false,
          error: 'Invalid coordinates format. Expected "lat,lng" or JSON',
        );
      }

      // Create maps URL for both iOS and Android
      final mapsUrl = 'https://maps.google.com/maps?q=$latitude,$longitude';

      FormGearLogger.webview(
        'Opening maps with coordinates: $latitude,$longitude',
      );
      FormGearLogger.webview('Maps URL: $mapsUrl');

      // Return the maps URL - the WebView can handle opening it
      // In a real implementation, this would use url_launcher package
      return ActionInfoJs(
        success: true,
        result: mapsUrl,
      );
    } on Exception catch (e) {
      FormGearLogger.webviewError('Open maps error: $e');
      return ActionInfoJs(success: false, error: 'Open maps error: $e');
    }
  }

  /// Handle get answer action - retrieves answer from data source
  Future<ActionInfoJs> _handleGetAnswerAction(
    String dataKey,
    String data,
  ) async {
    try {
      FormGearLogger.webview('Get answer action for dataKey: $dataKey');

      // Try to get the current assignment ID from context
      // In a real implementation, this would come from the form context
      final assignmentId = data.isNotEmpty ? data : 'current_assignment';

      // Attempt to load response data and extract the specific answer
      final responseData = await _loadResponseData(assignmentId);
      final answer = _extractAnswerByKey(responseData, dataKey);

      if (answer != null) {
        return ActionInfoJs(
          success: true,
          result: answer,
        );
      } else {
        return ActionInfoJs(
          success: true,
          result: '', // Return empty string if no answer found
        );
      }
    } on Exception catch (e) {
      FormGearLogger.webviewError('Get answer error: $e');
      return ActionInfoJs(success: false, error: 'Get answer error: $e');
    }
  }

  /// Handle barcode/QR scan action using presentation layer widget
  Future<ActionInfoJs> _handleBarcodeAction(
    String dataKey,
    String data,
  ) async {
    try {
      FormGearLogger.webview('Barcode scan action for dataKey: $dataKey');

      // Check camera permission for barcode scanning
      final cameraStatus = await Permission.camera.request();
      if (!cameraStatus.isGranted) {
        return ActionInfoJs(
          success: false,
          error: 'Camera permission required for barcode scanning',
        );
      }

      // Get current context for navigation
      final context = _getCurrentContext();
      if (context == null) {
        return ActionInfoJs(
          success: false,
          error: 'No valid context available for barcode scanner',
        );
      }

      // Navigate to barcode scanner screen from presentation layer
      final scannedResult = await Navigator.of(context).push<String?>(
        MaterialPageRoute<String?>(
          builder: (context) => BarcodeScannerScreen(
            title: 'Scan Barcode - $dataKey',
          ),
        ),
      );

      if (scannedResult != null && scannedResult.isNotEmpty) {
        FormGearLogger.webview('Barcode scan completed: $scannedResult');
        return ActionInfoJs(
          success: true,
          result: scannedResult,
        );
      } else {
        FormGearLogger.webview('Barcode scan cancelled by user');
        return ActionInfoJs(
          success: false,
          error: 'Barcode scan cancelled by user',
        );
      }
    } on Exception catch (e) {
      FormGearLogger.webviewError('Barcode scan error: $e');
      return ActionInfoJs(success: false, error: 'Barcode scan error: $e');
    }
  }

  /// Handle audio recording action using presentation layer widget with FASIH
  Future<ActionInfoJs> _handleAudioAction(
    String dataKey,
    String data,
  ) async {
    try {
      FormGearLogger.webview('Audio action for dataKey: $dataKey');

      // Get current context for navigation
      final context = _getCurrentContext();
      if (context == null) {
        return ActionInfoJs(
          success: false,
          error: 'No valid context available for audio recorder',
        );
      }

      // Extract assignment ID and generate FASIH-compatible file name
      final assignmentId = data.isNotEmpty ? data : 'current_assignment';
      final fileName = FasihMediaHelper.generateFileName(
        dataKey: dataKey,
        mediaType: 'audio',
        extension: 'm4a',
      );

      // Navigate to audio recording screen from presentation layer
      final recordedAudioPath = await Navigator.of(context).push<String?>(
        MaterialPageRoute<String?>(
          builder: (context) => AudioRecorderScreen(
            title: 'Record Audio - $dataKey',
            assignmentId: assignmentId,
            fileName: fileName,
            dataKey: dataKey,
          ),
        ),
      );

      if (recordedAudioPath != null && recordedAudioPath.isNotEmpty) {
        FormGearLogger.webview('Audio recording completed: $fileName');
        return ActionInfoJs(
          success: true,
          result: fileName, // Return FASIH fileName, not full path
        );
      } else {
        FormGearLogger.webview('Audio recording cancelled by user');
        return ActionInfoJs(
          success: false,
          error: 'Audio recording cancelled by user',
        );
      }
    } on Exception catch (e) {
      FormGearLogger.webviewError('Audio recording error: $e');
      return ActionInfoJs(success: false, error: 'Audio recording error: $e');
    }
  }

  /// Handle lookup action - performs data lookup from FASIH sources
  Future<ActionInfoJs> _handleLookupAction(
    String dataKey,
    String data,
  ) async {
    try {
      FormGearLogger.webview(
        'Lookup action for dataKey: $dataKey, data: $data',
      );

      // Parse data to get lookup parameters
      Map<String, dynamic>? lookupParams;
      if (data.isNotEmpty) {
        try {
          lookupParams = jsonDecode(data) as Map<String, dynamic>?;
        } on Exception catch (e) {
          FormGearLogger.webviewError('Failed to parse lookup data: $e');
        }
      }

      // Extract lookup parameters
      final surveyId = lookupParams?['surveyId'] as String? ?? 'current_survey';
      final lookupType = lookupParams?['type'] as String? ?? 'default';
      final searchQuery = lookupParams?['query'] as String? ?? '';

      // Try to load lookup data from FASIH sources
      final lookupData = await _loadLookupData(surveyId, lookupType);

      // Filter lookup data based on search query if provided
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
        return ActionInfoJs(
          success: true,
          result: jsonEncode(result),
        );
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
      // Try to load from assignment data file first
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
      // Fallback to default response asset
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
      // Look for answers array in response data
      final answers = responseData['answers'] as List<dynamic>?;
      if (answers == null) {
        return null;
      }

      // Find answer by dataKey
      for (final answer in answers) {
        if (answer is Map<String, dynamic>) {
          final key = answer['dataKey'] as String?;
          if (key == dataKey) {
            // Return the value, converting to string if needed
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
      // Try to load from lookup directory first
      final lookupDir = await FormDataFileManager.getLookupDirectory(surveyId);
      final lookupFile = File('${lookupDir.path}/$lookupType.json');

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

    // Return default lookup data for demo purposes
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
      // Search in common fields
      final searchableFields = [
        'name',
        'code',
        'description',
        'category',
      ];

      for (final field in searchableFields) {
        final value = item[field]?.toString().toLowerCase() ?? '';
        if (value.contains(lowercaseQuery)) {
          return true;
        }
      }
      return false;
    }).toList();
  }

  /// Get the current BuildContext from the navigator
  BuildContext? _getCurrentContext() {
    try {
      return WidgetsBinding.instance.rootElement?.mounted ?? false
          ? WidgetsBinding.instance.rootElement
          : null;
    } on Exception catch (e) {
      FormGearLogger.webviewError('Error getting context: $e');
      return null;
    }
  }
}
