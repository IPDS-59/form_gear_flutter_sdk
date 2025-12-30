import 'dart:convert';

import 'package:form_gear_engine_sdk/form_gear_engine_sdk.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/handlers/action_handler_contract.dart';
import 'package:form_gear_engine_sdk/src/utils/location_service_helper.dart';
import 'package:form_gear_engine_sdk/src/utils/utils.dart';

/// Handler for location-related actions (LOCATION, CAMERA_GPS, OPEN_MAPS)
class LocationActionHandler with ActionHandlerContract {
  @override
  List<String> get supportedActions => ['LOCATION', 'CAMERA_GPS', 'OPEN_MAPS'];

  @override
  Future<ActionInfoJs> handle(
    String action,
    String dataKey,
    String data,
  ) async {
    switch (action) {
      case 'CAMERA_GPS':
        return _handleCameraGPS(dataKey, data);
      case 'LOCATION':
        return _handleLocation(dataKey, data);
      case 'OPEN_MAPS':
        return _handleOpenMaps(dataKey, data);
      default:
        return ActionInfoJs(
          success: false,
          error: 'Unsupported location action: $action',
        );
    }
  }

  /// Handle camera with GPS action - returns location coordinates (no camera)
  Future<ActionInfoJs> _handleCameraGPS(String dataKey, String data) async {
    try {
      FormGearLogger.webview('Getting GPS location for dataKey: $dataKey');

      final accessResult = await LocationServiceHelper.ensureLocationAccess(
        contextDescription: 'camera GPS',
      );

      if (!accessResult.success) {
        return ActionInfoJs(
          success: false,
          error: accessResult.errorMessage ?? 'Location access failed',
        );
      }

      final locationResult = await LocationServiceHelper.getCurrentLocation();
      if (!locationResult.success) {
        return ActionInfoJs(
          success: false,
          error: locationResult.errorMessage ?? 'Failed to get location',
        );
      }

      final position = locationResult.position!;

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
      return ActionInfoJs(
        success: false,
        error: ErrorSanitizer.sanitizeWithContext('GPS', e.toString()),
      );
    }
  }

  /// Handle location action
  Future<ActionInfoJs> _handleLocation(String dataKey, String data) async {
    try {
      FormGearLogger.webview('Getting location for dataKey: $dataKey');

      final accessResult = await LocationServiceHelper.ensureLocationAccess(
        contextDescription: 'location',
      );
      if (!accessResult.success) {
        return ActionInfoJs(
          success: false,
          error: accessResult.errorMessage ?? 'Location access failed',
        );
      }

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
      return ActionInfoJs(
        success: false,
        error: ErrorSanitizer.sanitizeWithContext('Location', e.toString()),
      );
    }
  }

  /// Handle open maps action - opens device maps app with coordinates
  Future<ActionInfoJs> _handleOpenMaps(String dataKey, String data) async {
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

      final mapsUrl = 'https://maps.google.com/maps?q=$latitude,$longitude';

      FormGearLogger.webview(
        'Opening maps with coordinates: $latitude,$longitude',
      );
      FormGearLogger.webview('Maps URL: $mapsUrl');

      return ActionInfoJs(success: true, result: mapsUrl);
    } on Exception catch (e) {
      FormGearLogger.webviewError('Open maps error: $e');
      return ActionInfoJs(
        success: false,
        error: ErrorSanitizer.sanitizeWithContext('Maps', e.toString()),
      );
    }
  }
}
