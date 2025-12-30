import 'package:form_gear_engine_sdk/form_gear_engine_sdk.dart';
import 'package:form_gear_engine_sdk/src/utils/utils.dart';

/// Manages listener registration for FormGear SDK
///
/// Handles FormDataListener and FileUploadListener registration
class ListenerRegistry {
  FormDataListener? _formDataListener;
  FileUploadListener? _fileUploadListener;

  /// Sets the FormDataListener for handling save/submit operations
  void setFormDataListener(FormDataListener? listener) {
    _formDataListener = listener;

    if (listener != null) {
      FormGearLogger.sdk(
        'FormDataListener registered: ${listener.runtimeType}',
      );
    } else {
      FormGearLogger.sdk('FormDataListener removed');
    }
  }

  /// Gets the currently registered FormDataListener
  FormDataListener? get formDataListener => _formDataListener;

  /// Checks if a FormDataListener is currently registered
  bool get hasFormDataListener => _formDataListener != null;

  /// Removes the currently registered FormDataListener
  void removeFormDataListener() => setFormDataListener(null);

  /// Sets the FileUploadListener for handling file upload operations
  void setFileUploadListener(FileUploadListener? listener) {
    _fileUploadListener = listener;

    if (listener != null) {
      FormGearLogger.sdk(
        'FileUploadListener registered: ${listener.runtimeType}',
      );
    } else {
      FormGearLogger.sdk('FileUploadListener removed');
    }
  }

  /// Gets the currently registered FileUploadListener
  FileUploadListener? get fileUploadListener => _fileUploadListener;

  /// Checks if a FileUploadListener is currently registered
  bool get hasFileUploadListener => _fileUploadListener != null;

  /// Removes the currently registered FileUploadListener
  void removeFileUploadListener() => setFileUploadListener(null);

  /// Clears all registered listeners
  void dispose() {
    _formDataListener = null;
    _fileUploadListener = null;
  }
}
