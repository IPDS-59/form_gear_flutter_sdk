import 'dart:convert';

import 'package:form_gear_engine_sdk/form_gear_engine_sdk.dart';
import 'package:form_gear_engine_sdk/src/core/capabilities/capability_broker.dart';
import 'package:form_gear_engine_sdk/src/core/capabilities/location_resolver.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/handlers/action_handler_contract.dart';
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
        return await _handleCameraGPS(dataKey, data);
      case 'LOCATION':
        return await _handleLocation(dataKey, data);
      case 'OPEN_MAPS':
        return await _handleOpenMaps(dataKey, data);
      default:
        return ActionInfoJs(
          success: false,
          error: 'Unsupported location action: $action',
        );
    }
  }

  Future<LocationFix?> _fix(String dataKey, String purpose) =>
      resolveLocation(dataKey: dataKey, purpose: purpose);

  /// Handle camera with GPS action - returns location coordinates (no camera)
  Future<ActionInfoJs> _handleCameraGPS(String dataKey, String data) async {
    try {
      FormGearLogger.webview('Getting GPS location for dataKey: $dataKey');

      final position = await _fix(dataKey, 'camera GPS');
      if (position == null) {
        return ActionInfoJs(success: false, error: 'Location cancelled');
      }

      final result = {
        'success': true,
        'coordinat': {
          'latitude': position.latitude,
          'longitude': position.longitude,
        },
        'accuracy': position.accuracy,
        'provider': position.provider,
        'timestamp': (position.timestamp ?? DateTime.now()).toIso8601String(),
        'remark': 'GPS location acquired successfully',
      };

      final resultJson = jsonEncode(result);

      FormGearLogger.webview(
        'GPS location completed: ${position.latitude},${position.longitude}',
      );

      // Notify JavaScript of the result
      await notifyJavaScript(
        action: 'CAMERA_GPS',
        result: resultJson,
        dataKey: dataKey,
      );

      return ActionInfoJs(success: true, result: resultJson);
    } on CapabilityException catch (e) {
      return CapabilityBroker.errorToJs(e, 'GPS');
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

      final position = await _fix(dataKey, 'location');
      if (position == null) {
        return ActionInfoJs(success: false, error: 'Location cancelled');
      }
      final locationData = '${position.latitude},${position.longitude}';
      FormGearLogger.webview('Location completed: $locationData');

      // Notify JavaScript of the result
      await notifyJavaScript(
        action: 'LOCATION',
        result: locationData,
        dataKey: dataKey,
      );

      return ActionInfoJs(success: true, result: locationData);
    } on CapabilityException catch (e) {
      return CapabilityBroker.errorToJs(e, 'Location');
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
