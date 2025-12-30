import 'dart:convert';
import 'dart:io';

import 'package:file_picker/file_picker.dart';
import 'package:form_gear_engine_sdk/form_gear_engine_sdk.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/handlers/action_handler_contract.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/handlers/media_action_handler.dart';
import 'package:form_gear_engine_sdk/src/core/security/path_validator.dart';
import 'package:form_gear_engine_sdk/src/utils/fasih_media_helper.dart';
import 'package:form_gear_engine_sdk/src/utils/utils.dart';
import 'package:permission_handler/permission_handler.dart';

/// Handler for file-related actions (FILE_UPLOAD, FILE_PICKER, FILE_RELOAD)
class FileActionHandler with ActionHandlerContract {
  final MediaActionHandler _mediaHandler = MediaActionHandler();

  @override
  List<String> get supportedActions => [
    'FILE_UPLOAD',
    'FILE_PICKER',
    'FILE_RELOAD',
  ];

  @override
  Future<ActionInfoJs> handle(
    String action,
    String dataKey,
    String data,
  ) async {
    switch (action) {
      case 'FILE_UPLOAD':
        return handleFileUpload(dataKey, data);
      case 'FILE_PICKER':
        return handleFilePicker(dataKey, data);
      case 'FILE_RELOAD':
        return handleFileReload(dataKey, data);
      default:
        return ActionInfoJs(
          success: false,
          error: 'Unsupported file action: $action',
        );
    }
  }

  /// Handle file upload action - file is already selected, just upload it
  Future<ActionInfoJs> handleFileUpload(String dataKey, String data) async {
    try {
      FormGearLogger.webview(
        'Uploading file for dataKey: $dataKey (file already selected)',
      );

      if (data.isEmpty) {
        return ActionInfoJs(
          success: false,
          error: 'No file data provided for upload',
        );
      }

      Map<String, dynamic> fileInfo;
      try {
        final parsed = jsonDecode(data);

        if (parsed is List && parsed.isNotEmpty) {
          fileInfo = parsed[0] as Map<String, dynamic>;
        } else if (parsed is Map<String, dynamic>) {
          fileInfo = parsed;
        } else {
          throw FormatException(
            'Expected Map or List, got ${parsed.runtimeType}',
          );
        }
      } on Exception catch (e) {
        FormGearLogger.webviewError('Failed to parse file data: $e');
        return ActionInfoJs(
          success: false,
          error: 'Invalid file data format',
        );
      }

      final fileName =
          fileInfo['filename'] as String? ?? fileInfo['uri'] as String?;
      final fileUri = fileInfo['uri'] as String?;

      if (fileName == null || fileUri == null) {
        return ActionInfoJs(
          success: false,
          error: 'Missing filename or URI in file data',
        );
      }

      FormGearLogger.webview('File upload: fileName=$fileName, uri=$fileUri');

      var filePath = fileUri.replaceFirst('file://', '');

      // If this is just a filename (not a full path), resolve it to the
      // media directory. Files from camera/media handlers are stored there.
      if (!filePath.contains('/') && !filePath.contains(r'\')) {
        // Get the assignment ID from current context
        final assignmentId =
            FormGearSDK.instance.currentAssignment?.assignmentId ??
            'current_assignment';

        filePath = await FasihMediaHelper.getMediaFilePath(
          assignmentId,
          filePath,
        );
        FormGearLogger.webview(
          'Resolved filename to full path: $filePath',
        );
      }

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

      if (FormGearSDK.instance.hasFileUploadListener) {
        return _handleFileUploadWithListener(
          dataKey: dataKey,
          file: file,
          fileName: fileName,
          fileUri: fileUri,
          fileInfo: fileInfo,
        );
      } else {
        FormGearLogger.webview(
          'File verified (no upload listener): $fileName',
        );

        return ActionInfoJs(
          success: true,
          result: jsonEncode({
            'filename': fileName,
            'uri': fileUri,
            'size': file.lengthSync(),
            'uploaded': false,
            'message': 'File verified locally (no upload configured)',
          }),
        );
      }
    } on Exception catch (e) {
      FormGearLogger.webviewError('File upload error: $e');
      return ActionInfoJs(
        success: false,
        error: ErrorSanitizer.sanitizeWithContext('File upload', e.toString()),
      );
    }
  }

  Future<ActionInfoJs> _handleFileUploadWithListener({
    required String dataKey,
    required File file,
    required String fileName,
    required String fileUri,
    required Map<String, dynamic> fileInfo,
  }) async {
    try {
      final uploadData = FileUploadData(
        assignmentId:
            FormGearSDK.instance.currentAssignment?.assignmentId ?? '',
        templateId: FormGearSDK.instance.currentAssignment?.templateId ?? '',
        dataKey: dataKey,
        file: file,
        fileName: fileName,
        fileUri: fileUri,
        metadata: fileInfo,
      );

      final result = await FormGearSDK.instance.fileUploadListener!
          .onFileUpload(
            uploadData,
          );

      if (result.isSuccess) {
        await FormGearSDK.instance.fileUploadListener!.onUploadCompleted(
          fileName,
          result,
        );

        FormGearLogger.webview(
          'File uploaded via listener: $fileName -> ${result.uploadedUrl}',
        );

        return ActionInfoJs(
          success: true,
          result: jsonEncode({
            'filename': fileName,
            'uri': result.uploadedUrl,
            'size': file.lengthSync(),
            'uploaded': true,
            'message': 'File upload completed successfully',
            ...?result.metadata,
          }),
        );
      } else {
        FormGearLogger.webviewError(
          'File upload failed via listener: ${result.error}',
        );
        return ActionInfoJs(
          success: false,
          error: result.error ?? 'Upload failed',
        );
      }
    } on Exception catch (e, st) {
      await FormGearSDK.instance.fileUploadListener?.onUploadError(
        fileName,
        e,
        st,
      );

      FormGearLogger.webviewError('File upload error: $e');
      return ActionInfoJs(
        success: false,
        error: ErrorSanitizer.sanitizeWithContext('File upload', e.toString()),
      );
    }
  }

  /// Handle file picker action
  Future<ActionInfoJs> handleFilePicker(String dataKey, String data) async {
    try {
      FormGearLogger.webview('Opening file picker for dataKey: $dataKey');

      final storageStatus = await Permission.storage.request();
      if (storageStatus.isDenied) {
        final mediaStatus = await Permission.photos.request();
        if (mediaStatus.isDenied) {
          return ActionInfoJs(
            success: false,
            error: 'Storage permission denied',
          );
        }
      }

      final result = await FilePicker.platform.pickFiles();

      if (result != null && result.files.single.path != null) {
        final filePath = result.files.single.path!;

        // For system file picker, we only validate:
        // 1. No path traversal (handled by sanitizeFilename for the name)
        // 2. File exists
        // 3. Extension is allowed
        // We don't check BPS directories since picked files come from anywhere
        final file = File(filePath);
        if (!file.existsSync()) {
          FormGearLogger.webviewError('Picked file does not exist: $filePath');
          return ActionInfoJs(
            success: false,
            error: 'Selected file does not exist',
          );
        }

        final extension = filePath.split('.').last.toLowerCase();
        if (!PathValidator.isExtensionAllowed(
          '.$extension',
          PathValidationType.media,
        )) {
          FormGearLogger.webviewError(
            'Invalid file extension: $extension',
          );
          return ActionInfoJs(
            success: false,
            error: 'File type not allowed: $extension',
          );
        }

        final originalFile = file;

        final assignmentId = data.isNotEmpty ? data : 'current_assignment';
        final fileName = FasihMediaHelper.generateFileName(
          dataKey: dataKey,
          mediaType: 'document',
          extension: extension,
        );

        final success = await FasihMediaHelper.saveMediaFile(
          assignmentId: assignmentId,
          sourceFile: originalFile,
          fileName: fileName,
          mediaType: 'document',
        );

        if (success) {
          FormGearLogger.webview('File picker completed: $fileName');

          await _mediaHandler.notifyFormGearOfMediaSelection(
            dataKey: dataKey,
            fileName: fileName,
            assignmentId: assignmentId,
          );

          return ActionInfoJs(success: true, result: fileName);
        } else {
          return ActionInfoJs(
            success: false,
            error: 'Failed to save picked file',
          );
        }
      } else {
        FormGearLogger.webview('File picker cancelled by user');
        return ActionInfoJs(
          success: false,
          error: 'File picker cancelled by user',
        );
      }
    } on Exception catch (e) {
      FormGearLogger.webviewError('File picker error: $e');
      return ActionInfoJs(
        success: false,
        error: ErrorSanitizer.sanitizeWithContext('File picker', e.toString()),
      );
    }
  }

  /// Handle file reload action - refreshes file display
  Future<ActionInfoJs> handleFileReload(String dataKey, String data) async {
    try {
      FormGearLogger.webview('File reload for dataKey: $dataKey, data: $data');

      if (data.isNotEmpty) {
        try {
          final fileData = jsonDecode(data);
          FormGearLogger.webview('File reload data: $fileData');
        } on Exception catch (e) {
          FormGearLogger.webviewError('Failed to parse file reload data: $e');
        }
      }

      return ActionInfoJs(
        success: true,
        result: 'File reload completed',
      );
    } on Exception catch (e) {
      FormGearLogger.webviewError('File reload error: $e');
      return ActionInfoJs(
        success: false,
        error: ErrorSanitizer.sanitizeWithContext('File reload', e.toString()),
      );
    }
  }
}
