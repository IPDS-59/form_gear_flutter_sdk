import 'dart:convert';

import 'package:form_gear_engine_sdk/src/core/js_bridge/js_handler_base.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/models/response_models.dart';
import 'package:form_gear_engine_sdk/src/utils/location_service_helper.dart';
import 'package:form_gear_engine_sdk/src/utils/utils.dart';
import 'package:image_picker/image_picker.dart';
import 'package:permission_handler/permission_handler.dart';

/// Factory class that creates JSHandlers for FormGear client action methods
/// These are higher-level methods called by FormGear JavaScript client
class ClientActionHandler {
  ClientActionHandler({
    this.onCameraCapture,
    this.onFileUpload,
    this.onLocationUpdate,
    this.onMapOpen,
    this.onResponseSave,
    this.onSubmitSave,
  });

  final Future<String?> Function(String fileName, String? result)?
  onCameraCapture;
  final Future<String?> Function(
    dynamic fileData,
    Function updateCallback, {
    required bool isReload,
  })?
  onFileUpload;
  final Future<void> Function(Map<String, dynamic> locationData)?
  onLocationUpdate;
  final Future<void> Function(String coordinates)? onMapOpen;
  final Future<void> Function(
    Map<String, dynamic> response,
    Map<String, dynamic> media,
    Map<String, dynamic> remark,
    Map<String, dynamic> principal,
    Map<String, dynamic> reference,
  )?
  onResponseSave;
  final Future<void> Function(
    Map<String, dynamic> response,
    Map<String, dynamic> media,
    Map<String, dynamic> remark,
    Map<String, dynamic> principal,
    Map<String, dynamic> reference,
  )?
  onSubmitSave;

  /// Creates individual JSHandlers for each client action method
  List<JSHandler<ActionInfoJs>> createHandlers() {
    return [
      _ClientActionMethodHandler('cameraHandler', (args) async {
        if (args.length >= 2) {
          final fileName = args[1].toString();

          try {
            // Check camera permissions
            final cameraStatus = await Permission.camera.request();
            if (!cameraStatus.isGranted) {
              return ActionInfoJs(
                success: false,
                error: 'Camera permission denied',
              );
            }

            // Use image picker to capture photo
            final picker = ImagePicker();
            final image = await picker.pickImage(source: ImageSource.camera);

            if (image != null) {
              final result = await onCameraCapture?.call(fileName, image.path);
              FormGearLogger.webview('Camera capture completed: $fileName');
              return ActionInfoJs(success: true, result: result ?? image.path);
            } else {
              return ActionInfoJs(
                success: false,
                error: 'Camera capture cancelled',
              );
            }
          } on Exception catch (e) {
            FormGearLogger.webviewError('Camera handler error: $e');
            return ActionInfoJs(success: false, error: e.toString());
          }
        }
        return ActionInfoJs(
          success: false,
          error: 'Invalid cameraHandler arguments',
        );
      }),

      _ClientActionMethodHandler('fileUploadHandler', (args) async {
        if (args.length >= 2) {
          final fileData = args[0];
          final isReload = args.length > 2 ? args[2] as bool? ?? false : false;

          try {
            // Mock update callback for now
            void updateCallback(dynamic result) {
              FormGearLogger.webview('File upload callback: $result');
            }

            await onFileUpload?.call(
              fileData,
              updateCallback,
              isReload: isReload,
            );
            FormGearLogger.webview('File upload handler completed');
            return ActionInfoJs(success: true, result: 'File upload processed');
          } on Exception catch (e) {
            FormGearLogger.webviewError('File upload handler error: $e');
            return ActionInfoJs(success: false, error: e.toString());
          }
        }
        return ActionInfoJs(
          success: false,
          error: 'Invalid fileUploadHandler arguments',
        );
      }),

      _ClientActionMethodHandler('gpsHandler', (args) async {
        if (args.isNotEmpty) {
          try {
            // Ensure location access using helper
            // (automatically opens settings if disabled)
            final accessResult =
                await LocationServiceHelper.ensureLocationAccess(
                  contextDescription: 'GPS handler',
                );
            if (!accessResult.success) {
              return ActionInfoJs(
                success: false,
                error: accessResult.errorMessage ?? 'Location access failed',
              );
            }

            // Get current location using helper
            final locationResult =
                await LocationServiceHelper.getCurrentLocation();
            if (!locationResult.success) {
              return ActionInfoJs(
                success: false,
                error: locationResult.errorMessage ?? 'Failed to get location',
              );
            }

            final position = locationResult.position!;
            final locationData = {
              'latitude': position.latitude,
              'longitude': position.longitude,
              'accuracy': position.accuracy,
              'timestamp': position.timestamp.toIso8601String(),
            };

            await onLocationUpdate?.call(locationData);
            FormGearLogger.webview(
              'GPS handler completed: '
              '${position.latitude},${position.longitude}',
            );
            return ActionInfoJs(
              success: true,
              result: jsonEncode(locationData),
            );
          } on Exception catch (e) {
            FormGearLogger.webviewError('GPS handler error: $e');
            return ActionInfoJs(success: false, error: e.toString());
          }
        }
        return ActionInfoJs(
          success: false,
          error: 'Invalid gpsHandler arguments',
        );
      }),

      _ClientActionMethodHandler('openMap', (args) async {
        if (args.isNotEmpty) {
          final coordinates = args[0].toString();

          try {
            await onMapOpen?.call(coordinates);
            FormGearLogger.webview('Open map completed: $coordinates');
            return ActionInfoJs(
              success: true,
              result: 'Map opened for: $coordinates',
            );
          } on Exception catch (e) {
            FormGearLogger.webviewError('Open map error: $e');
            return ActionInfoJs(success: false, error: e.toString());
          }
        }
        return ActionInfoJs(success: false, error: 'Invalid openMap arguments');
      }),

      _ClientActionMethodHandler('setResponseMobile', (args) async {
        if (args.length >= 5) {
          try {
            final response = _parseJsonSafely(args[0]);
            final media = _parseJsonSafely(args[1]);
            final remark = _parseJsonSafely(args[2]);
            final principal = _parseJsonSafely(args[3]);
            final reference = _parseJsonSafely(args[4]);

            await onResponseSave?.call(
              response,
              media,
              remark,
              principal,
              reference,
            );
            FormGearLogger.webview('Set response mobile completed');
            return ActionInfoJs(success: true, result: 'Response saved');
          } on Exception catch (e) {
            FormGearLogger.webviewError('Set response mobile error: $e');
            return ActionInfoJs(success: false, error: e.toString());
          }
        }
        return ActionInfoJs(
          success: false,
          error: 'Invalid setResponseMobile arguments',
        );
      }),

      _ClientActionMethodHandler('setSubmitMobile', (args) async {
        if (args.length >= 5) {
          try {
            final response = _parseJsonSafely(args[0]);
            final media = _parseJsonSafely(args[1]);
            final remark = _parseJsonSafely(args[2]);
            final principal = _parseJsonSafely(args[3]);
            final reference = _parseJsonSafely(args[4]);

            await onSubmitSave?.call(
              response,
              media,
              remark,
              principal,
              reference,
            );
            FormGearLogger.webview('Set submit mobile completed');
            return ActionInfoJs(success: true, result: 'Submission saved');
          } on Exception catch (e) {
            FormGearLogger.webviewError('Set submit mobile error: $e');
            return ActionInfoJs(success: false, error: e.toString());
          }
        }
        return ActionInfoJs(
          success: false,
          error: 'Invalid setSubmitMobile arguments',
        );
      }),
    ];
  }

  /// Safely parse JSON or return the value as-is if already a Map
  Map<String, dynamic> _parseJsonSafely(dynamic value) {
    if (value is Map<String, dynamic>) {
      return value;
    } else if (value is String) {
      try {
        final parsed = jsonDecode(value);
        return parsed is Map<String, dynamic> ? parsed : {};
      } on Exception catch (e) {
        FormGearLogger.webviewError('JSON parse error: $e');
        return {};
      }
    }
    return {};
  }
}

/// Individual JSHandler for each client action method
class _ClientActionMethodHandler extends JSHandler<ActionInfoJs> {
  _ClientActionMethodHandler(this._handlerName, this._callback);

  final String _handlerName;
  final Future<ActionInfoJs> Function(List<dynamic> args) _callback;

  @override
  String get handlerName => _handlerName;

  @override
  Future<ActionInfoJs> callback(List<dynamic> arguments) =>
      _callback(arguments);
}
