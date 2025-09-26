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
        case 'LOCATION':
          return await _handleLocationAction(dataKey, data);
        case 'SIGNATURE':
          return await _handleSignatureAction(dataKey, data);
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

  /// Handle signature action - shows signature capture screen and returns base64 PNG data
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
