import 'package:file_picker/file_picker.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/js_handler_base.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/models/response_models.dart';
import 'package:form_gear_engine_sdk/src/utils/location_service_helper.dart';
import 'package:form_gear_engine_sdk/src/utils/utils.dart';
import 'package:image_picker/image_picker.dart';
import 'package:permission_handler/permission_handler.dart';

/// Individual JSHandler for FasihForm execute() calls
class ExecuteHandler extends JSHandler<ActionInfoJs> {
  @override
  String get handlerName => 'execute';

  @override
  Future<ActionInfoJs> callback(List<dynamic> arguments) async {
    try {
      if (arguments.isEmpty) {
        return ActionInfoJs(
          success: false,
          error: 'No execute action specified',
        );
      }

      final action = arguments[0].toString().toUpperCase();
      final dataKey = arguments.length > 1 ? arguments[1].toString() : '';
      final data = arguments.length > 2 ? arguments[2].toString() : '';

      FormGearLogger.webview(
        'Execute handler called: $action, dataKey: $dataKey, data: $data',
      );

      // Route to specific execute implementations
      switch (action) {
        case 'CAMERA':
          return await _executeCamera(dataKey, data);
        case 'FILE_UPLOAD':
        case 'FILE_PICKER':
          return await _executeFilePicker(dataKey, data);
        case 'LOCATION':
          return await _executeLocation(dataKey, data);
        default:
          FormGearLogger.webview('Unknown execute action: $action');
          return ActionInfoJs(
            success: false,
            error: 'Unknown execute action: $action',
          );
      }
    } on Exception catch (e) {
      FormGearLogger.webviewError('Execute handler error: $e');
      return ActionInfoJs(success: false, error: e.toString());
    }
  }

  /// Execute camera with FasihForm pattern
  Future<ActionInfoJs> _executeCamera(String dataKey, String data) async {
    try {
      FormGearLogger.webview('Executing camera for FasihForm: $dataKey');

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
              'Camera permission permanently denied. Please enable in '
              'settings.',
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
        FormGearLogger.webview('FasihForm camera executed: ${image.path}');
        return ActionInfoJs(success: true, result: image.path);
      } else {
        FormGearLogger.webview('FasihForm camera cancelled by user');
        return ActionInfoJs(success: false, error: 'Camera cancelled by user');
      }
    } on Exception catch (e) {
      FormGearLogger.webviewError('Execute camera error: $e');
      return ActionInfoJs(success: false, error: 'Execute camera error: $e');
    }
  }

  /// Execute file picker with FasihForm pattern
  Future<ActionInfoJs> _executeFilePicker(String dataKey, String data) async {
    try {
      FormGearLogger.webview('Executing file picker for FasihForm: $dataKey');

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
        FormGearLogger.webview('FasihForm file picker executed: $filePath');
        return ActionInfoJs(success: true, result: filePath);
      } else {
        FormGearLogger.webview('FasihForm file picker cancelled by user');
        return ActionInfoJs(
          success: false,
          error: 'File picker cancelled by user',
        );
      }
    } on Exception catch (e) {
      FormGearLogger.webviewError('Execute file picker error: $e');
      return ActionInfoJs(
        success: false,
        error: 'Execute file picker error: $e',
      );
    }
  }

  /// Execute location with FasihForm pattern
  Future<ActionInfoJs> _executeLocation(String dataKey, String data) async {
    try {
      FormGearLogger.webview('Executing location for FasihForm: $dataKey');

      // Ensure location access using helper (automatically opens settings if disabled)
      final accessResult = await LocationServiceHelper.ensureLocationAccess(
        contextDescription: 'FasihForm location',
      );
      if (!accessResult.success) {
        return ActionInfoJs(
          success: false,
          error: accessResult.errorMessage ?? 'Location access failed',
        );
      }

      // Get current location using helper
      final locationResult = await LocationServiceHelper.getCurrentLocation(
        timeLimit: const Duration(seconds: 10),
      );
      if (!locationResult.success) {
        return ActionInfoJs(
          success: false,
          error: locationResult.errorMessage ?? 'Failed to get location',
        );
      }

      final position = locationResult.position!;
      final locationData = '${position.latitude},${position.longitude}';
      FormGearLogger.webview('FasihForm location executed: $locationData');
      return ActionInfoJs(success: true, result: locationData);
    } on Exception catch (e) {
      FormGearLogger.webviewError('Execute location error: $e');
      return ActionInfoJs(success: false, error: 'Execute location error: $e');
    }
  }
}
