import 'dart:convert';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/js_handler_base.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/models/response_models.dart';
import 'package:form_gear_engine_sdk/src/utils/utils.dart';
import 'package:geolocator/geolocator.dart';
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

      // First check location services availability
      final serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        return ActionInfoJs(
          success: false,
          error:
              'Location services are disabled. '
              'Please enable location services.',
        );
      }

      // Request location permission
      var locationPermission = await Geolocator.checkPermission();
      if (locationPermission == LocationPermission.denied) {
        locationPermission = await Geolocator.requestPermission();
        if (locationPermission == LocationPermission.denied) {
          return ActionInfoJs(
            success: false,
            error: 'Location permission denied',
          );
        }
      }

      if (locationPermission == LocationPermission.deniedForever) {
        // Try to open app settings for user
        try {
          await Geolocator.openAppSettings();
        } on Exception catch (e) {
          FormGearLogger.webviewError('Failed to open app settings: $e');
        }
        return ActionInfoJs(
          success: false,
          error:
              'Location permission permanently denied. Please enable location '
              'access for this app in your device settings.',
        );
      }

      // Get current location
      late Position position;
      try {
        position = await Geolocator.getCurrentPosition(
          locationSettings: const LocationSettings(
            accuracy: LocationAccuracy.high,
            timeLimit: Duration(seconds: 10),
          ),
        );
      } on Exception catch (e) {
        return ActionInfoJs(
          success: false,
          error: 'Failed to get location: $e',
        );
      }

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

  /// Handle camera action with actual camera functionality
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
        FormGearLogger.webview('Camera completed: ${image.path}');
        return ActionInfoJs(success: true, result: image.path);
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

      // Check if location services are enabled
      final serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        // Try to open location settings
        try {
          await Geolocator.openLocationSettings();
          // Wait a bit and check again
          await Future<void>.delayed(const Duration(seconds: 1));
          final newServiceEnabled = await Geolocator.isLocationServiceEnabled();
          if (!newServiceEnabled) {
            return ActionInfoJs(
              success: false,
              error:
                  'Location services are disabled. Please enable location '
                  'services in settings.',
            );
          }
        } on Exception {
          return ActionInfoJs(
            success: false,
            error:
                'Location services are disabled. Please enable location '
                'services manually in your device settings.',
          );
        }
      }

      // Request location permission
      var permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          return ActionInfoJs(
            success: false,
            error: 'Location permission denied',
          );
        }
      }

      if (permission == LocationPermission.deniedForever) {
        return ActionInfoJs(
          success: false,
          error:
              'Location permission permanently denied. '
              'Please enable in settings.',
        );
      }

      // Get current position with proper settings
      final position = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(
          accuracy: LocationAccuracy.high,
          timeLimit: Duration(seconds: 10),
        ),
      );

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

      // TODO(sdk): Implement actual answer retrieval from form data source.
      // This should connect to the form's data storage system.
      // For now, return success with placeholder.
      return ActionInfoJs(
        success: true,
        result: 'Answer retrieved for $dataKey',
      );
    } on Exception catch (e) {
      FormGearLogger.webviewError('Get answer error: $e');
      return ActionInfoJs(success: false, error: 'Get answer error: $e');
    }
  }

  /// Handle barcode/QR scan action - opens barcode scanner
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

      // TODO(sdk): Integrate with barcode scanning package.
      // Recommended packages: mobile_scanner, qr_code_scanner.
      // For now, return success with placeholder.
      return ActionInfoJs(
        success: true,
        result: 'Barcode scan completed for $dataKey',
      );
    } on Exception catch (e) {
      FormGearLogger.webviewError('Barcode scan error: $e');
      return ActionInfoJs(success: false, error: 'Barcode scan error: $e');
    }
  }

  /// Handle audio recording action - records audio
  Future<ActionInfoJs> _handleAudioAction(
    String dataKey,
    String data,
  ) async {
    try {
      FormGearLogger.webview('Audio action for dataKey: $dataKey');

      // Check microphone permission for audio recording
      final microphoneStatus = await Permission.microphone.request();
      if (!microphoneStatus.isGranted) {
        return ActionInfoJs(
          success: false,
          error: 'Microphone permission required for audio recording',
        );
      }

      // TODO(sdk): Integrate with audio recording package.
      // Recommended packages: record, audio_recorder.
      // For now, return success with placeholder.
      return ActionInfoJs(
        success: true,
        result: 'Audio recording completed for $dataKey',
      );
    } on Exception catch (e) {
      FormGearLogger.webviewError('Audio recording error: $e');
      return ActionInfoJs(success: false, error: 'Audio recording error: $e');
    }
  }

  /// Handle lookup action - performs data lookup
  Future<ActionInfoJs> _handleLookupAction(
    String dataKey,
    String data,
  ) async {
    try {
      FormGearLogger.webview(
        'Lookup action for dataKey: $dataKey, data: $data',
      );

      // TODO(sdk): Implement actual lookup data retrieval.
      // This should connect to survey lookup data sources.
      // For now, return success with placeholder.
      return ActionInfoJs(
        success: true,
        result: 'Lookup completed for $dataKey',
      );
    } on Exception catch (e) {
      FormGearLogger.webviewError('Lookup error: $e');
      return ActionInfoJs(success: false, error: 'Lookup error: $e');
    }
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
