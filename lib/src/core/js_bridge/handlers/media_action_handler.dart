import 'dart:io';

import 'package:flutter/material.dart';
import 'package:form_gear_engine_sdk/form_gear_engine_sdk.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/handlers/action_handler_contract.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/js_executor_service.dart';
import 'package:form_gear_engine_sdk/src/core/services/navigator_context_provider.dart';
import 'package:form_gear_engine_sdk/src/presentation/widgets/audio_recorder_screen.dart';
import 'package:form_gear_engine_sdk/src/presentation/widgets/video_recorder_screen.dart';
import 'package:form_gear_engine_sdk/src/utils/fasih_media_helper.dart';
import 'package:form_gear_engine_sdk/src/utils/utils.dart';
import 'package:image_picker/image_picker.dart';
import 'package:permission_handler/permission_handler.dart';

/// Handler for media-related actions (CAMERA, AUDIO, VIDEO, SIGNATURE)
class MediaActionHandler with ActionHandlerContract {
  @override
  List<String> get supportedActions => [
    'CAMERA',
    'AUDIO',
    'VIDEO',
    'SIGNATURE',
  ];

  @override
  Future<ActionInfoJs> handle(
    String action,
    String dataKey,
    String data,
  ) async {
    switch (action) {
      case 'CAMERA':
        return handleCamera(dataKey, data);
      case 'AUDIO':
        return handleAudio(dataKey, data);
      case 'VIDEO':
        return handleVideo(dataKey, data);
      case 'SIGNATURE':
        return handleSignature(dataKey, data);
      default:
        return ActionInfoJs(
          success: false,
          error: 'Unsupported media action: $action',
        );
    }
  }

  /// Handle camera action following FASIH media patterns
  Future<ActionInfoJs> handleCamera(String dataKey, String data) async {
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

          // Execute JavaScript callbacks to notify FormGear engine
          await notifyFormGearOfMediaSelection(
            action: 'CAMERA',
            dataKey: dataKey,
            fileName: fileName,
            assignmentId: assignmentId,
          );

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
      return ActionInfoJs(
        success: false,
        error: ErrorSanitizer.sanitizeWithContext('Camera', e.toString()),
      );
    }
  }

  /// Handle audio recording action using presentation layer widget with FASIH
  Future<ActionInfoJs> handleAudio(String dataKey, String data) async {
    try {
      FormGearLogger.webview('Audio action for dataKey: $dataKey');

      // Get current context for navigation
      final context = getCurrentContext();
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

        // Notify FormGear JS of the recorded audio
        await notifyFormGearOfMediaSelection(
          action: 'AUDIO',
          dataKey: dataKey,
          fileName: fileName,
          assignmentId: assignmentId,
        );

        return ActionInfoJs(
          success: true,
          result: fileName,
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
      return ActionInfoJs(
        success: false,
        error: ErrorSanitizer.sanitizeWithContext(
          'Audio recording',
          e.toString(),
        ),
      );
    }
  }

  /// Handle video recording action using the in-app [VideoRecorderScreen].
  ///
  /// Uses the camera package directly instead of [ImagePicker.pickVideo] to
  /// avoid Android OEM camera apps returning null after stopping a recording.
  Future<ActionInfoJs> handleVideo(String dataKey, String data) async {
    try {
      FormGearLogger.webview('Video action for dataKey: $dataKey');

      final context = getCurrentContext();
      if (context == null) {
        return ActionInfoJs(
          success: false,
          error: 'No valid context available for video recorder',
        );
      }

      final assignmentId = data.isNotEmpty ? data : 'current_assignment';
      final fileName = FasihMediaHelper.generateFileName(
        dataKey: dataKey,
        mediaType: 'video',
        extension: 'mp4',
      );

      final recordedVideoName = await Navigator.of(context).push<String?>(
        MaterialPageRoute<String?>(
          builder: (context) => VideoRecorderScreen(
            title: 'Record Video - $dataKey',
            assignmentId: assignmentId,
            fileName: fileName,
            dataKey: dataKey,
          ),
        ),
      );

      if (recordedVideoName != null && recordedVideoName.isNotEmpty) {
        FormGearLogger.webview('Video recording completed: $fileName');

        await notifyFormGearOfMediaSelection(
          action: 'VIDEO',
          dataKey: dataKey,
          fileName: fileName,
          assignmentId: assignmentId,
        );

        return ActionInfoJs(success: true, result: fileName);
      } else {
        FormGearLogger.webview('Video recording cancelled by user');
        return ActionInfoJs(
          success: false,
          error: 'Video recording cancelled by user',
        );
      }
    } on Exception catch (e) {
      FormGearLogger.webviewError('Video recording error: $e');
      return ActionInfoJs(
        success: false,
        error: ErrorSanitizer.sanitizeWithContext(
          'Video recording',
          e.toString(),
        ),
      );
    }
  }

  /// Handle signature action
  /// Both FormGear and FasihForm handle signatures in the WebView using
  /// their built-in signature pad. The signature data is stored as part
  /// of the form response, so this handler just acknowledges the action.
  Future<ActionInfoJs> handleSignature(String dataKey, String data) async {
    try {
      FormGearLogger.webview(
        'Signature action for dataKey: $dataKey, data length: ${data.length}',
      );

      // Signature is handled by the WebView's built-in signature pad
      // The signature data is saved as part of the form response
      // Just acknowledge the action was received
      return ActionInfoJs(success: true);
    } on Exception catch (e) {
      FormGearLogger.webviewError('Signature action error: $e');
      return ActionInfoJs(
        success: false,
        error: ErrorSanitizer.sanitizeWithContext('Signature', e.toString()),
      );
    }
  }

  /// Get the current BuildContext from the NavigatorContextProvider
  BuildContext? getCurrentContext() =>
      NavigatorContextProvider.instance.context;

  /// Notify FormGear engine of media selection following FASIH patterns
  Future<void> notifyFormGearOfMediaSelection({
    required String action,
    required String dataKey,
    required String fileName,
    required String assignmentId,
  }) async {
    final jsExecutor = JSExecutorService();
    if (!jsExecutor.isRegistered) {
      FormGearLogger.webview(
        'No JavaScript executor available, skipping media notification',
      );
      return;
    }

    try {
      // Get media file path for URI
      final filePath = await FasihMediaHelper.getMediaFilePath(
        assignmentId,
        fileName,
      );

      // Choose JavaScript command based on engine type
      if (jsExecutor.formEngineId == '2') {
        // FasihForm engine (engine ID "2")
        final jsCommand =
            '''
javascript:fasihForm.event.emit(
  "file-selected",
  "$dataKey",
  '[{ "filename": "$fileName", "uri": "file://$filePath" }]'
)
''';
        FormGearLogger.webview('Executing JS callback: $jsCommand');
        await jsExecutor.executeJavaScript(jsCommand);
      } else {
        // FormGear engine (engine ID "1")
        // Pass file:// URL so webview can display the image
        await notifyJavaScript(
          action: action,
          result: 'file://$filePath',
          dataKey: dataKey,
        );
      }
    } on Exception catch (e) {
      FormGearLogger.webviewError(
        'Failed to notify FormGear of media selection: $e',
      );
    }
  }
}
