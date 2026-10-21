# Migration guide

This guide moves a host app from `form_gear_engine_sdk` 0.x to 1.0.0.
Read it top to bottom. Each step matches one SDK release, so you can upgrade one
release at a time and ship after each.

## What changed in one paragraph

Before 1.0.0, the SDK shipped its own camera, file picker, audio and video
recorders, barcode screen and location code. From 1.0.0, the SDK has none of
these. Your app provides them through one class, `FormGearCapabilities`. If your
app does not provide a capability, the form shows "tidak tersedia" for that
field. The SDK does not crash and does not open a built-in screen.

## Why

- A host that does not need audio or video no longer pays for those plugins.
- One camera screen, one permission flow and one look for the whole app.
- Your app decides which plugin versions it uses.

## Upgrade path

### 0.14.0: barcode scanning moves to the host

The SDK dropped `flutter_zxing`. Open your own scanner.

Before (0.13 and earlier): the SDK opened its zxing screen.

After (0.14 and later):

```dart
class MyCapabilities extends FormGearCapabilities {
  @override
  CapabilitySupport support(CapabilityKind kind) =>
      kind == CapabilityKind.scan
      ? const CapabilitySupport.supported()
      : const CapabilitySupport.unsupported();

  @override
  Future<BarcodeScanResult?> scan(
    BuildContext context,
    BarcodeScanRequest request,
  ) async {
    final code = await myScanner(context);
    return code == null
        ? const BarcodeScanResult.cancelled()
        : BarcodeScanResult(text: code.text, format: code.format);
  }
}

FormGearSDK.instance.capabilities = MyCapabilities();
```

In 0.14 you could override `FormGearUiHandler.scanBarcode`. That method is
removed in 1.0.0. Move its body into `FormGearCapabilities.scan`. The types
(`BarcodeScanRequest`, `BarcodeScanResult`) did not change.

### 0.15.0: photo and file pick

Before: the SDK used `image_picker` and `file_picker` and asked for the camera
and storage permission itself.

After:

```dart
@override
Future<CapturedMedia?> capturePhoto(CapturePhotoRequest r) async {
  final file = await myCamera(r.context, maxWidth: r.maxWidth);
  return file == null ? null : CapturedMedia(file: file); // null = cancelled
}

@override
Future<PickedFile?> pickFile(PickRequest r) async {
  final picked = await myPicker(
    extensions: r.allowedExtensions,
    imagesOnly: r.imagesOnly,
  );
  return picked == null
      ? null
      : PickedFile(file: picked.file, name: picked.name);
}
```

Rules for every capability:

- Return `null` when the user cancels. Cancel is not an error.
- Throw a `CapabilityException` (with a sentence for the user) when something
  fails. Use `CapabilityException.denied(...)` for a refused permission.
- Ask for your own permissions inside the capability.
- Write the result file anywhere. The SDK copies it into the assignment media
  folder, names it and updates `media.json`.

If you stamped photos with `FormGearUiHandler.processCapturedPhoto`, move that
code into `capturePhoto`. The hook is removed in 1.0.0.

### 0.16.0: audio and video

Before: the SDK used `record`, `just_audio`, `camera` and `waveform_flutter`.

After:

```dart
@override
Future<CapturedMedia?> recordAudio(RecordAudioRequest r) async {
  final file = await myAudioSheet(r.context, maxDuration: r.maxDuration);
  return file == null
      ? null
      : CapturedMedia(file: file, mime: 'audio/mp4');
}

@override
Future<CapturedMedia?> recordVideo(RecordVideoRequest r) async {
  final file = await myVideoPage(r.context, quality: r.quality);
  return file == null
      ? null
      : CapturedMedia(file: file, mime: 'video/mp4');
}
```

Video is a normal capability. It is not dropped. Provide it if your forms have
video fields.

### 0.17.0: location and mock GPS

Before: the SDK used `geolocator` and `permission_handler`.

After:

```dart
@override
Future<LocationFix?> locate(LocateRequest r) async {
  final p = await myLocation(timeout: r.timeout); // permission + Location switch
  return p == null
      ? null
      : LocationFix(
          latitude: p.latitude,
          longitude: p.longitude,
          accuracy: p.accuracy,
          isMock: p.isMocked, // the SDK then calls onMockLocation
        );
}
```

`FormGearUiHandler.onMockLocation(context)` still works. The SDK calls it when
`LocationFix.isMock` is true. The position is still given to the form.

### 1.0.0: the plugins are removed

Update the dependency:

```yaml
dependencies:
  form_gear_engine_sdk: ^1.0.0
```

Then:

1. Delete any `@Deprecated` member you still override (see the list below).
2. Add the plugins you now need to your own `pubspec.yaml`.
3. Add the permissions below to your own manifest and plist.
4. Set `FormGearSDK.instance.capabilities` before you open a form.
5. Run your tests. Check each field type once on a device.

## Permissions your app now owns

The SDK no longer declares or asks for these. Add the ones your capabilities
need.

Android (`AndroidManifest.xml`):

| Capability | Permission |
|---|---|
| photo, video | `android.permission.CAMERA` |
| audio, video | `android.permission.RECORD_AUDIO` |
| locate | `android.permission.ACCESS_FINE_LOCATION` (and `ACCESS_COARSE_LOCATION`) |
| pick file, gallery | none with the system picker on Android 13 and later |

The SDK still needs `android.permission.INTERNET` for the web view.

iOS (`Info.plist`):

| Capability | Key |
|---|---|
| photo, video, scan | `NSCameraUsageDescription` |
| audio, video | `NSMicrophoneUsageDescription` |
| locate | `NSLocationWhenInUseUsageDescription` |
| gallery | `NSPhotoLibraryUsageDescription` |

Write a sentence that says why your app needs it. App Store review reads it.

## What "unsupported" looks like

If `support(kind)` returns unsupported, or the host has no
`FormGearCapabilities`, every route answers the same way:

- The JS reply is `success: false` with the message
  `Fitur ini belum tersedia di aplikasi`.
- The form field shows that message. Nothing opens and nothing crashes.
- The Dart side sees `CapabilityException.unsupported(kind)` with
  `code == CapabilityErrorCode.unavailable`.

You can pass your own reason with `CapabilitySupport.unsupported('reason')`.

## Removed APIs

| Removed | Use instead |
|---|---|
| `FormGearUiHandler.scanBarcode` | `FormGearCapabilities.scan` |
| `FormGearUiHandler.processCapturedPhoto` | stamp the photo inside `capturePhoto` |
| `FormGearSDK.createDebugBridgeTest` | `openFormWithAssignment` |
| `AudioRecorderScreen`, the audio recorder bloc and widgets | `recordAudio` |
| `VideoRecorderScreen` | `recordVideo` |
| `PermissionConsentScreen` | your own permission screen |
| `MediaDemoScreen` | the example app |
| `LocationServiceHelper` | `locate` |

Dependencies removed from the SDK: `camera`, `record`, `just_audio`,
`geolocator`, `permission_handler`, `image_picker`, `file_picker`,
`waveform_flutter` and `alice_dio`. If your app used any of them through the
SDK's transitive dependencies, add them to your own `pubspec.yaml`.

## Check your upgrade

- [ ] `FormGearSDK.instance.capabilities` is set before the first form opens.
- [ ] `support()` is true only for what you built.
- [ ] Cancel returns `null` in every capability.
- [ ] Refused permissions throw `CapabilityException.denied` with a sentence.
- [ ] Manifest and plist have the permissions above.
- [ ] No call to a removed API remains (`dart analyze` shows it).
- [ ] One photo, one file, one location (and audio or video if you use them)
      work on a real device.

## The example app

`example/` runs with stub capabilities (`example/lib/example_capabilities.dart`):
a sample photo, a sample CSV file, a fixed position and a dialog for scans.
Audio and video are left out on purpose, so you can see "tidak tersedia".
Copy the file as a starting point.

## More

- Capabilities epic: [#110](https://github.com/IPDS-59/form_gear_flutter_sdk/issues/110)
- Phase 5 (this release): [#101](https://github.com/IPDS-59/form_gear_flutter_sdk/issues/101)
- Host bridge RFC tracking: [#96](https://github.com/IPDS-59/form_gear_flutter_sdk/issues/96)
- [CHANGELOG](CHANGELOG.md)
