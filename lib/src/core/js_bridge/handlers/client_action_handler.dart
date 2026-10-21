import 'dart:convert';

import 'package:form_gear_engine_sdk/src/core/capabilities/capability_broker.dart';
import 'package:form_gear_engine_sdk/src/core/capabilities/form_gear_capabilities.dart';
import 'package:form_gear_engine_sdk/src/core/capabilities/location_resolver.dart';
import 'package:form_gear_engine_sdk/src/core/form_gear_sdk.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/js_handler_base.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/models/response_models.dart';
import 'package:form_gear_engine_sdk/src/utils/utils.dart';

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
            final photo = await CapabilityBroker.current.capturePhoto(
              dataKey: fileName,
              assignmentId:
                  FormGearSDK.instance.currentAssignment?.assignmentId ?? '',
            );
            if (photo == null) {
              return ActionInfoJs(
                success: false,
                error: 'Camera capture cancelled',
              );
            }
            final result = await onCameraCapture?.call(
              fileName,
              photo.file.path,
            );
            return ActionInfoJs(
              success: true,
              result: result ?? photo.file.path,
            );
          } on Exception catch (e) {
            FormGearLogger.webviewError('Camera handler error: $e');
            return e is CapabilityException
                ? CapabilityBroker.errorToJs(e, 'Camera')
                : ActionInfoJs(success: false, error: e.toString());
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
            final position = await resolveLocation(
              dataKey: 'gpsHandler',
              purpose: 'GPS handler',
            );
            if (position == null) {
              return ActionInfoJs(success: false, error: 'Location cancelled');
            }
            final locationData = {
              'latitude': position.latitude,
              'longitude': position.longitude,
              'accuracy': position.accuracy,
              'timestamp': (position.timestamp ?? DateTime.now())
                  .toIso8601String(),
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
          } on CapabilityException catch (e) {
            return CapabilityBroker.errorToJs(e, 'GPS');
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
