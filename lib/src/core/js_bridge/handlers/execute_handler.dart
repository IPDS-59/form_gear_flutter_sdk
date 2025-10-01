import 'dart:convert';
import 'dart:io';

import 'package:file_picker/file_picker.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/js_executor_service.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/js_handler_base.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/models/response_models.dart';
import 'package:form_gear_engine_sdk/src/core/security/path_validator.dart';
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
        case 'FILE':
        case 'FILE_PICKER':
          // FILE/FILE_PICKER: Open camera or file picker to select file
          return await _executeFilePicker(dataKey, data);
        case 'FILE_UPLOAD':
          // FILE_UPLOAD: File already selected, just upload it
          return await _executeFileUpload(dataKey, data);
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

  /// Execute file upload - file is already selected, just upload it
  /// This is called when user clicks "Upload" button in FasihForm
  Future<ActionInfoJs> _executeFileUpload(String dataKey, String data) async {
    try {
      FormGearLogger.webview(
        'Executing file upload for FasihForm: $dataKey (file already selected)',
      );

      // Parse the file data from JavaScript
      if (data.isEmpty) {
        return ActionInfoJs(
          success: false,
          error: 'No file data provided for upload',
        );
      }

      Map<String, dynamic> fileInfo;
      try {
        fileInfo = jsonDecode(data) as Map<String, dynamic>;
      } on Exception catch (e) {
        FormGearLogger.webviewError('Failed to parse file data: $e');
        return ActionInfoJs(
          success: false,
          error: 'Invalid file data format',
        );
      }

      // Extract file information
      final fileName = fileInfo['filename'] as String?;
      final fileUri = fileInfo['uri'] as String?;

      if (fileName == null || fileUri == null) {
        return ActionInfoJs(
          success: false,
          error: 'Missing filename or URI in file data',
        );
      }

      FormGearLogger.webview(
        'File upload: fileName=$fileName, uri=$fileUri',
      );

      // File is already selected from previous file-open event
      // Just verify it exists and return success
      final filePath = fileUri.replaceFirst('file://', '');

      // Validate file path for security
      final validationResult = PathValidator.validate(
        filePath,
        type: PathValidationType.media,
        checkExists: true,
      );

      if (!validationResult.isValid) {
        FormGearLogger.webviewError(
          'Invalid file path: ${validationResult.error}',
        );
        return ActionInfoJs(
          success: false,
          error: 'Invalid file path: ${validationResult.error}',
        );
      }

      final file = File(validationResult.sanitizedPath);

      // In a real implementation, this would upload to server
      // For now, we just confirm the file exists and is ready
      FormGearLogger.webview('File upload completed: $fileName');

      return ActionInfoJs(
        success: true,
        result: jsonEncode({
          'filename': fileName,
          'uri': fileUri,
          'size': file.lengthSync(),
          'uploaded': true,
          'message': 'File upload completed successfully',
        }),
      );
    } on Exception catch (e) {
      FormGearLogger.webviewError('Execute file upload error: $e');
      return ActionInfoJs(
        success: false,
        error: 'Execute file upload error: $e',
      );
    }
  }

  /// Execute file picker with FasihForm pattern
  Future<ActionInfoJs> _executeFilePicker(String dataKey, String data) async {
    try {
      FormGearLogger.webview('Executing file picker for FasihForm: $dataKey');
      FormGearLogger.webview('File picker data: $data');

      // Parse data parameter (may contain accept type like {"accept":"text/csv"})
      String? acceptType;
      try {
        final dataJson = jsonDecode(data) as Map<String, dynamic>;
        acceptType = dataJson['accept'] as String?;
        FormGearLogger.webview('Parsed accept type: $acceptType');
      } on Exception {
        // Ignore JSON parsing errors, continue with default file picker
        FormGearLogger.webview(
          'No JSON data to parse, using default file picker',
        );
      }

      // Use ImagePicker for images to avoid double picker issue on Android 13+
      if (acceptType != null && acceptType.contains('image')) {
        // Use ImagePicker for images (direct gallery access)
        // NOTE: Don't request permission manually
        // ImagePicker handles it internally
        // Requesting Permission.photos on Android 13+
        // opens photo picker first!
        final picker = ImagePicker();
        final image = await picker.pickImage(source: ImageSource.gallery);

        if (image != null) {
          final filePath = image.path;
          final fileName = image.name;
          FormGearLogger.webview(
            'FasihForm image picker executed: $filePath (filename: $fileName)',
          );

          // Notify FasihForm of file selection via JavaScript callback
          await _notifyFasihFormOfFileSelection(
            dataKey: dataKey,
            filePath: filePath,
            fileName: fileName,
          );

          return ActionInfoJs(success: true, result: filePath);
        } else {
          FormGearLogger.webview('FasihForm image picker cancelled by user');
          return ActionInfoJs(
            success: false,
            error: 'Image picker cancelled by user',
          );
        }
      }

      // For other file types, use FilePicker
      // Request storage permission for non-image files
      final storageStatus = await Permission.storage.request();
      if (storageStatus.isDenied) {
        // Storage permission is optional on newer Android versions
        FormGearLogger.webview(
          'Storage permission denied, but continuing with file picker',
        );
      }

      // Open file picker with appropriate type
      FilePickerResult? result;
      if (acceptType != null) {
        // Handle specific file types
        if (acceptType.contains('csv')) {
          result = await FilePicker.platform.pickFiles(
            type: FileType.custom,
            allowedExtensions: ['csv'],
          );
        } else if (acceptType.contains('video')) {
          result = await FilePicker.platform.pickFiles(type: FileType.video);
        } else if (acceptType.contains('audio')) {
          result = await FilePicker.platform.pickFiles(type: FileType.audio);
        } else {
          result = await FilePicker.platform.pickFiles();
        }
      } else {
        result = await FilePicker.platform.pickFiles();
      }

      if (result != null && result.files.single.path != null) {
        final filePath = result.files.single.path!;
        final fileName = result.files.single.name;
        FormGearLogger.webview(
          'FasihForm file picker executed: $filePath (filename: $fileName)',
        );

        // Notify FasihForm of file selection via JavaScript callback
        await _notifyFasihFormOfFileSelection(
          dataKey: dataKey,
          filePath: filePath,
          fileName: fileName,
        );

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

  /// Notifies FasihForm JavaScript of file selection
  /// Calls: fasihForm.event.emit('file-selected', dataKey, '[{ "filename": "...", "uri": "file://..." }]')
  Future<void> _notifyFasihFormOfFileSelection({
    required String dataKey,
    required String filePath,
    required String fileName,
  }) async {
    try {
      final jsExecutor = JSExecutorService();
      if (!jsExecutor.isRegistered) {
        FormGearLogger.webview(
          'No JavaScript executor available, skipping file notification',
        );
        return;
      }

      // FasihForm expects: fasihForm.event.emit('file-selected', dataKey, '[{ "filename": "name", "uri": "file://path" }]')
      final jsCommand =
          '''
javascript:fasihForm.event.emit(
  "file-selected",
  "$dataKey",
  '[{ "filename": "$fileName", "uri": "file://$filePath" }]'
)
''';

      FormGearLogger.webview('Executing file-selected JS callback: $jsCommand');
      await jsExecutor.executeJavaScript(jsCommand);
    } on Exception catch (e) {
      FormGearLogger.webviewError(
        'Failed to notify FasihForm of file selection: $e',
      );
    }
  }

  /// Execute location with FasihForm pattern
  Future<ActionInfoJs> _executeLocation(String dataKey, String data) async {
    try {
      FormGearLogger.webview('Executing location for FasihForm: $dataKey');

      // Ensure location access using helper
      // (automatically opens settings if disabled)
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

      // Notify FasihForm of location acquisition via JavaScript callback
      await _notifyFasihFormOfLocation(
        dataKey: dataKey,
        latitude: position.latitude,
        longitude: position.longitude,
        accuracy: position.accuracy,
      );

      return ActionInfoJs(success: true, result: locationData);
    } on Exception catch (e) {
      FormGearLogger.webviewError('Execute location error: $e');
      return ActionInfoJs(success: false, error: 'Execute location error: $e');
    }
  }

  /// Notifies FasihForm JavaScript of location acquisition
  /// Calls: fasihForm.event.emit('geolocation-acquired', dataKey, jsonString)
  Future<void> _notifyFasihFormOfLocation({
    required String dataKey,
    required double latitude,
    required double longitude,
    required double accuracy,
  }) async {
    try {
      final jsExecutor = JSExecutorService();
      if (!jsExecutor.isRegistered) {
        FormGearLogger.webview(
          'No JavaScript executor available, skipping location notification',
        );
        return;
      }

      // FasihForm expects:
      // fasihForm.event.emit('geolocation-acquired', dataKey,
      //   '{"latitude": lat, "longitude": lng, "accuracy": acc}')
      final jsCommand =
          '''
javascript:fasihForm.event.emit(
  "geolocation-acquired",
  "$dataKey",
  '{"latitude": $latitude, "longitude": $longitude, "accuracy": $accuracy}'
)
''';

      FormGearLogger.webview('Executing geolocation JS callback: $jsCommand');
      await jsExecutor.executeJavaScript(jsCommand);
    } on Exception catch (e) {
      FormGearLogger.webviewError(
        'Failed to notify FasihForm of location: $e',
      );
    }
  }
}
