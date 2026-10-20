import 'dart:async';
import 'dart:io';

import 'package:flutter/widgets.dart';
import 'package:form_gear_engine_sdk/src/core/ui/barcode_scan.dart';

/// What a host can do for a form, one entry per [FormGearCapabilities] member.
enum CapabilityKind { photo, audio, video, scan, pickFile, locate, openMap }

/// Whether a host provides one capability, and why not when it does not.
class CapabilitySupport {
  const CapabilitySupport.supported() : supported = true, reason = null;

  const CapabilitySupport.unsupported([this.reason]) : supported = false;

  final bool supported;

  /// A message for the form page when [supported] is false.
  final String? reason;
}

/// Why a capability call failed.
enum CapabilityErrorCode { denied, permanentlyDenied, unavailable, failed }

/// A capability that did not produce a result. Cancel is not an error: it is a
/// `null` result.
class CapabilityException implements Exception {
  const CapabilityException(this.code, this.userMessage) : kind = null;

  const CapabilityException.unsupported(this.kind)
    : code = CapabilityErrorCode.unavailable,
      userMessage = 'Fitur ini belum tersedia di aplikasi';

  const CapabilityException.denied(String message)
    : kind = null,
      code = CapabilityErrorCode.denied,
      userMessage = message;

  const CapabilityException.permanentlyDenied(String message)
    : kind = null,
      code = CapabilityErrorCode.permanentlyDenied,
      userMessage = message;

  /// The kind that is not provided, for [CapabilityException.unsupported].
  final CapabilityKind? kind;

  final CapabilityErrorCode code;

  /// A sentence for the person using the form, written by the host.
  final String userMessage;

  @override
  String toString() => 'CapabilityException($code): $userMessage';
}

/// Fires when the form closes while a capability call is still open, so the
/// host can pop its route.
class CapabilityCancelToken {
  final _done = Completer<void>();

  bool get isCancelled => _done.isCompleted;

  /// Completes when the form closed first.
  Future<void> get whenCancelled => _done.future;

  void cancel() {
    if (!_done.isCompleted) _done.complete();
  }
}

/// What every capability call carries.
class CapabilityRequest {
  const CapabilityRequest({
    required this.context,
    required this.dataKey,
    required this.assignmentId,
    required this.cancel,
    required this.tempDir,
  });

  /// The form page's context, for a route or a dialog.
  final BuildContext context;

  /// The form field that asked.
  final String dataKey;
  final String assignmentId;
  final CapabilityCancelToken cancel;

  /// Scratch folder owned by the engine. The host writes its result here.
  final Directory tempDir;
}

/// Take one photo.
class CapturePhotoRequest extends CapabilityRequest {
  const CapturePhotoRequest({
    required super.context,
    required super.dataKey,
    required super.assignmentId,
    required super.cancel,
    required super.tempDir,
    this.maxWidth = 1920,
    this.maxHeight = 1080,
    this.quality = 85,
    this.preferFront = false,
  });

  final int maxWidth;
  final int maxHeight;

  /// JPEG quality, 0 to 100.
  final int quality;
  final bool preferFront;
}

/// Record one audio clip. The host owns the whole flow: permission, recorder
/// screen, preview playback. Null means the user cancelled.
class RecordAudioRequest extends CapabilityRequest {
  const RecordAudioRequest({
    required super.context,
    required super.dataKey,
    required super.assignmentId,
    required super.cancel,
    required super.tempDir,
    this.maxDuration,
  });

  /// Longest clip, when the form sets one; null means no limit.
  final Duration? maxDuration;
}

/// How sharp a video the form wants; the host maps it to its camera.
enum VideoQuality { low, medium, high }

/// Record one video clip, with the same rules as [RecordAudioRequest].
class RecordVideoRequest extends CapabilityRequest {
  const RecordVideoRequest({
    required super.context,
    required super.dataKey,
    required super.assignmentId,
    required super.cancel,
    required super.tempDir,
    this.maxDuration,
    this.quality = VideoQuality.medium,
  });

  /// Longest clip, when the form sets one; null means no limit.
  final Duration? maxDuration;

  /// Resolution hint; the host picks the closest its camera supports.
  final VideoQuality quality;
}

/// How exact a position the form needs; the host maps it to its provider.
enum LocateAccuracy { low, balanced, high }

/// Get the device position once.
class LocateRequest extends CapabilityRequest {
  const LocateRequest({
    required super.context,
    required super.dataKey,
    required super.assignmentId,
    required super.cancel,
    required super.tempDir,
    this.accuracy = LocateAccuracy.high,
    this.timeout = const Duration(seconds: 10),
  });

  final LocateAccuracy accuracy;

  /// How long the host may wait for a fix before it fails or gives up.
  final Duration timeout;
}

/// One position fix from the host.
class LocationFix {
  const LocationFix({
    required this.latitude,
    required this.longitude,
    this.accuracy,
    this.provider = 'GPS',
    this.timestamp,
    this.isMock = false,
  });

  final double latitude;
  final double longitude;

  /// Metres, when the provider says.
  final double? accuracy;
  final String provider;
  final DateTime? timestamp;

  /// The position came from a mock provider ("manipulasi GPS"). The SDK then
  /// calls `FormGearUiHandler.onMockLocation`; the fix is still returned.
  final bool isMock;
}

/// A photo or recording the host made.
class CapturedMedia {
  const CapturedMedia({
    required this.file,
    this.mime = 'image/jpeg',
    this.duration,
    this.meta = const {},
  });

  /// Written by the host, inside [CapabilityRequest.tempDir].
  final File file;
  final String mime;
  final Duration? duration;
  final Map<String, Object?> meta;
}

/// Pick one file from the device.
class PickRequest extends CapabilityRequest {
  const PickRequest({
    required super.context,
    required super.dataKey,
    required super.assignmentId,
    required super.cancel,
    required super.tempDir,
    this.allowedExtensions = const [],
    this.imagesOnly = false,
    this.maxBytes,
  });

  /// Lower case, without the dot. Empty means any file.
  final List<String> allowedExtensions;
  final bool imagesOnly;
  final int? maxBytes;
}

/// A file the user picked.
class PickedFile {
  const PickedFile({required this.file, required this.name, this.mime});

  final File file;
  final String name;
  final String? mime;
}

/// What the host can do for a form: the device parts the engine does not own.
/// Every method defaults to "not provided". Extend this class (do not
/// implement it) so members added later keep their defaults.
///
/// Rules: `null` means the user cancelled. A failure is a
/// [CapabilityException]. The host asks for its own permissions. The engine
/// names the final file and keeps `media.json`.
///
/// Register it with `FormGearSDK.instance.capabilities = MyCapabilities()`.
abstract class FormGearCapabilities {
  const FormGearCapabilities();

  /// Whether the host does [kind]. The engine asks before it calls: an
  /// unsupported kind uses the SDK's built-in path while it still has one, and
  /// gives the page a friendly error after that.
  CapabilitySupport support(CapabilityKind kind) =>
      const CapabilitySupport.unsupported();

  Future<CapturedMedia?> capturePhoto(CapturePhotoRequest request) async =>
      throw const CapabilityException.unsupported(CapabilityKind.photo);

  /// Records one audio clip (`audio/mp4` is the usual result).
  Future<CapturedMedia?> recordAudio(RecordAudioRequest request) async =>
      throw const CapabilityException.unsupported(CapabilityKind.audio);

  /// Records one video clip (`video/mp4`). A host that does not provide it
  /// leaves the SDK's built-in video recorder in charge (until 1.0.0).
  Future<CapturedMedia?> recordVideo(RecordVideoRequest request) async =>
      throw const CapabilityException.unsupported(CapabilityKind.video);

  Future<PickedFile?> pickFile(PickRequest request) async =>
      throw const CapabilityException.unsupported(CapabilityKind.pickFile);

  /// Scans one barcode or QR code. Same types as
  /// `FormGearUiHandler.scanBarcode`, which now forwards here.
  Future<BarcodeScanResult?> scan(
    BuildContext context,
    BarcodeScanRequest request,
  ) async => throw const CapabilityException.unsupported(CapabilityKind.scan);

  /// Gets one position fix. The host asks for the location permission, copes
  /// with the system Location switch being off, and flags mock positions.
  /// Without it the SDK uses its built-in geolocator path (until 1.0.0).
  Future<LocationFix?> locate(LocateRequest request) async =>
      throw const CapabilityException.unsupported(CapabilityKind.locate);
}
