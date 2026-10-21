import 'package:flutter/widgets.dart';
import 'package:form_gear_engine_sdk/form_gear_engine_sdk.dart';
import 'package:form_gear_engine_sdk/src/core/capabilities/capability_broker.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/handlers/action_handler_contract.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/js_executor_service.dart';
import 'package:form_gear_engine_sdk/src/core/services/navigator_context_provider.dart';
import 'package:form_gear_engine_sdk/src/utils/fasih_form_notifier.dart';
import 'package:form_gear_engine_sdk/src/utils/fasih_media_helper.dart';
import 'package:form_gear_engine_sdk/src/utils/utils.dart';

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
        return await handleCamera(dataKey, data);
      case 'AUDIO':
        return await handleAudio(dataKey, data);
      case 'VIDEO':
        return await handleVideo(dataKey, data);
      case 'SIGNATURE':
        return await handleSignature(dataKey, data);
      default:
        return ActionInfoJs(
          success: false,
          error: 'Unsupported media action: $action',
        );
    }
  }

  /// Handle the camera action: the photo comes from the host's
  /// `capturePhoto`; without it the form shows "tidak tersedia".
  Future<ActionInfoJs> handleCamera(String dataKey, String data) async {
    try {
      FormGearLogger.webview('Opening camera for dataKey: $dataKey');
      return await _cameraFromHost(CapabilityBroker.current, dataKey, data);
    } on Exception catch (e) {
      FormGearLogger.webviewError('Camera error: $e');
      return CapabilityBroker.errorToJs(e, 'Camera');
    }
  }

  /// The photo comes from the host's `capturePhoto` (its own camera, stamp and
  /// permissions); the engine only names, stores and announces the file.
  Future<ActionInfoJs> _cameraFromHost(
    CapabilityBroker host,
    String dataKey,
    String data,
  ) async {
    final assignmentId = data.isNotEmpty ? data : 'current_assignment';
    final photo = await host.capturePhoto(
      dataKey: dataKey,
      assignmentId: assignmentId,
    );
    if (photo == null) {
      return ActionInfoJs(success: false, error: 'Camera cancelled by user');
    }
    final fileName = FasihMediaHelper.generateFileName(
      dataKey: dataKey,
      mediaType: 'photo',
      extension: 'jpg',
    );
    final saved = await FasihMediaHelper.saveMediaFile(
      assignmentId: assignmentId,
      sourceFile: photo.file,
      fileName: fileName,
      mediaType: 'photo',
    );
    if (!saved) {
      return ActionInfoJs(success: false, error: 'Failed to save camera image');
    }
    await notifyFormGearOfMediaSelection(
      action: 'CAMERA',
      dataKey: dataKey,
      fileName: fileName,
      assignmentId: assignmentId,
    );
    return ActionInfoJs(success: true, result: fileName);
  }

  /// Handle the audio action: the clip comes from the host's `recordAudio`;
  /// without it the form shows "tidak tersedia".
  Future<ActionInfoJs> handleAudio(String dataKey, String data) async {
    try {
      FormGearLogger.webview('Audio action for dataKey: $dataKey');
      return await _clipFromHost(
        CapabilityBroker.current,
        dataKey,
        data,
        video: false,
      );
    } on Exception catch (e) {
      FormGearLogger.webviewError('Audio recording error: $e');
      return CapabilityBroker.errorToJs(e, 'Audio recording');
    }
  }

  /// The clip comes from the host's `recordAudio` or `recordVideo` (its own
  /// recorder, preview and permissions); the engine only names, stores and
  /// announces it.
  Future<ActionInfoJs> _clipFromHost(
    CapabilityBroker host,
    String dataKey,
    String data, {
    required bool video,
  }) async {
    final kind = video ? 'video' : 'audio';
    final assignmentId = data.isNotEmpty ? data : 'current_assignment';
    final clip = video
        ? await host.recordVideo(dataKey: dataKey, assignmentId: assignmentId)
        : await host.recordAudio(dataKey: dataKey, assignmentId: assignmentId);
    if (clip == null) {
      return ActionInfoJs(
        success: false,
        error: '${video ? 'Video' : 'Audio'} recording cancelled by user',
      );
    }
    final dot = clip.file.path.lastIndexOf('.');
    final fileName = FasihMediaHelper.generateFileName(
      dataKey: dataKey,
      mediaType: kind,
      extension: dot < 0
          ? (video ? 'mp4' : 'm4a')
          : clip.file.path.substring(dot + 1),
    );
    final saved = await FasihMediaHelper.saveMediaFile(
      assignmentId: assignmentId,
      sourceFile: clip.file,
      fileName: fileName,
      mediaType: kind,
    );
    if (!saved) {
      return ActionInfoJs(success: false, error: 'Failed to save $kind');
    }
    await notifyFormGearOfMediaSelection(
      action: kind.toUpperCase(),
      dataKey: dataKey,
      fileName: fileName,
      assignmentId: assignmentId,
    );
    return ActionInfoJs(success: true, result: fileName);
  }

  /// Handle the video action: the clip comes from the host's `recordVideo`;
  /// without it the form shows "tidak tersedia".
  Future<ActionInfoJs> handleVideo(String dataKey, String data) async {
    try {
      FormGearLogger.webview('Video action for dataKey: $dataKey');
      return await _clipFromHost(
        CapabilityBroker.current,
        dataKey,
        data,
        video: true,
      );
    } on Exception catch (e) {
      FormGearLogger.webviewError('Video recording error: $e');
      return CapabilityBroker.errorToJs(e, 'Video recording');
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
        await FasihFormNotifier.notifyFileSelection(
          dataKey: dataKey,
          filePath: filePath,
          fileName: fileName,
        );
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
