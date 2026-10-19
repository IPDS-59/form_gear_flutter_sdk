import 'dart:io';

import 'package:flutter/widgets.dart';
import 'package:form_gear_engine_sdk/src/core/capabilities/form_gear_capabilities.dart';
import 'package:form_gear_engine_sdk/src/core/form_gear_sdk.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/models/response_models.dart';
import 'package:form_gear_engine_sdk/src/core/services/navigator_context_provider.dart';
import 'package:form_gear_engine_sdk/src/core/ui/barcode_scan.dart';
import 'package:form_gear_engine_sdk/src/utils/utils.dart';

/// The one place the bridge routes (`action`, `execute` and the client
/// handlers) call to use the host's [FormGearCapabilities]: builds the request,
/// runs the call and maps failures to the JS reply.
class CapabilityBroker {
  CapabilityBroker(this._capabilities, {BuildContext? Function()? context})
    : _context = context ?? (() => NavigatorContextProvider.instance.context);

  /// The broker for the SDK's current host.
  // A getter on purpose: it reads the host registered right now.
  // ignore: prefer_constructors_over_static_methods
  static CapabilityBroker get current =>
      CapabilityBroker(FormGearSDK.instance.capabilities);

  static CapabilityCancelToken _cancel = CapabilityCancelToken();

  /// Tells open capability calls the form closed.
  static void cancelOpenCalls() {
    _cancel.cancel();
    _cancel = CapabilityCancelToken();
  }

  final FormGearCapabilities? _capabilities;
  final BuildContext? Function() _context;

  /// Whether the host does [kind] (false without a host).
  bool provides(CapabilityKind kind) =>
      _capabilities?.support(kind).supported ?? false;

  Future<CapturedMedia?> capturePhoto({
    required String dataKey,
    required String assignmentId,
  }) async {
    final media = await _capabilities!.capturePhoto(
      CapturePhotoRequest(
        context: _requireContext(),
        dataKey: dataKey,
        assignmentId: assignmentId,
        cancel: _cancel,
        tempDir: await _tempDir(),
      ),
    );
    return media;
  }

  Future<CapturedMedia?> recordAudio({
    required String dataKey,
    required String assignmentId,
    Duration? maxDuration,
  }) async {
    final clip = await _capabilities!.recordAudio(
      RecordAudioRequest(
        context: _requireContext(),
        dataKey: dataKey,
        assignmentId: assignmentId,
        cancel: _cancel,
        tempDir: await _tempDir(),
        maxDuration: maxDuration,
      ),
    );
    return clip;
  }

  Future<CapturedMedia?> recordVideo({
    required String dataKey,
    required String assignmentId,
    Duration? maxDuration,
  }) async {
    final clip = await _capabilities!.recordVideo(
      RecordVideoRequest(
        context: _requireContext(),
        dataKey: dataKey,
        assignmentId: assignmentId,
        cancel: _cancel,
        tempDir: await _tempDir(),
        maxDuration: maxDuration,
      ),
    );
    return clip;
  }

  Future<PickedFile?> pickFile({
    required String dataKey,
    required String assignmentId,
    List<String> allowedExtensions = const [],
    bool imagesOnly = false,
  }) async {
    final picked = await _capabilities!.pickFile(
      PickRequest(
        context: _requireContext(),
        dataKey: dataKey,
        assignmentId: assignmentId,
        cancel: _cancel,
        tempDir: await _tempDir(),
        allowedExtensions: allowedExtensions,
        imagesOnly: imagesOnly,
      ),
    );
    return picked;
  }

  /// The host scanner, or null when the host has none.
  Future<BarcodeScanResult?> scan(
    BuildContext context,
    BarcodeScanRequest request,
  ) => provides(CapabilityKind.scan)
      ? _capabilities!.scan(context, request)
      : Future.value();

  BuildContext _requireContext() =>
      _context() ??
      (throw const CapabilityException(
        CapabilityErrorCode.unavailable,
        'Formulir tidak sedang terbuka',
      ));

  Future<Directory> _tempDir() => Directory(
    '${Directory.systemTemp.path}/form_gear_capabilities',
  ).create(recursive: true);

  /// The JS reply for a failed call: the host's own sentence for a
  /// [CapabilityException], the sanitized text for anything else.
  static ActionInfoJs errorToJs(Object error, String what) => ActionInfoJs(
    success: false,
    error: error is CapabilityException
        ? error.userMessage
        : ErrorSanitizer.sanitizeWithContext(what, error.toString()),
  );
}
