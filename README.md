# FormGear Flutter SDK

[![pub package](https://img.shields.io/pub/v/form_gear_engine_sdk.svg)](https://pub.dev/packages/form_gear_engine_sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Flutter](https://img.shields.io/badge/Flutter-stable-blue.svg)](https://flutter.dev)

A Flutter SDK for FormGear - A flexible, JSON-driven form generation framework for dynamic data collection, originally developed for BPS - Statistics Indonesia's FASIH App.

## Features

- 🎯 **JSON-driven forms** with 30+ input control types
- 📱 **Multi-engine support**: FormGear (ID 1) and FasihForm (ID 2)
- 📷 **Device integration**: Camera, GPS, file uploads, signature capture
- 🔒 **Security**: Input validation, HTTPS enforcement, log sanitization
- 💾 **Offline capability**: Forms work without internet
- 🎨 **Customizable listeners**: SaveOrSubmit and FileUpload patterns

## Installation

```yaml
dependencies:
  form_gear_engine_sdk: ^0.1.0
```

### Platform Setup

**Android** - Add to `AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

**iOS** - Add to `Info.plist`:
```xml
<key>NSCameraUsageDescription</key>
<string>Camera access for form photos</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>Location access for GPS coordinates</string>
```

## Quick Start

### 1. Initialize SDK

```dart
import 'package:form_gear_engine_sdk/form_gear_engine_sdk.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Configure API
  final apiConfig = FormGearApiConfig(
    baseUrl: 'https://your-api.com',
    formEngineEndpoint: '/api/form-engine/version',
    authToken: 'your-token',
  );

  // Initialize SDK
  final config = FormGearConfig(
    autoStartServer: true,
    serverPort: 8080,
    apiConfig: apiConfig,
    bpsUser: BpsUser(
      sessionToken: 'user-token',
      nipBaru: '123456789',
    ),
  );

  await FormGearSDK.instance.initialize(config);
  runApp(MyApp());
}
```

### 2. Open a Form with Assignment

```dart
class FormPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: () async {
        // Create assignment context
        final assignment = AssignmentContext(
          assignmentId: 'assignment_001',
          templateId: 'demo_template',
          surveyId: 'survey_2024',
          config: AssignmentConfig(
            lookupMode: FormGearLookupMode.offline,
            formMode: FormGearFormMode.open,
            clientMode: FormGearClientMode.capi,
          ),
          data: AssignmentData(
            template: {/* template data */},
            validation: {/* validation rules */},
            response: {/* form responses */},
          ),
        );

        // Open form with assignment
        await FormGearSDK.instance.openFormWithAssignment(
          context: context,
          assignment: assignment,
          title: 'Survey Form',
        );
      },
      child: Text('Open Form'),
    );
  }
}
```

### 3. Check Engine Version

```dart
// Check if engine update is needed
final result = await FormGearSDK.instance.checkFormEngineVersion(
  context: context,
  engineId: '1',
);

if (result != null) {
  print('Current version: ${result.currentVersion}');
  print('Latest version: ${result.latestVersion}');
  print('Update available: ${result.updateAvailable}');
}
```

### 4. Check if Engine is Downloaded

```dart
// Check if engine exists locally
final isDownloaded = await FormGearSDK.instance.isFormEngineDownloaded('1');

if (!isDownloaded) {
  // Show download screen or prompt
}
```

## Public API Reference

### FormGearSDK

Main SDK entry point.

#### Methods

| Method | Description |
|--------|-------------|
| `initialize(FormGearConfig config)` | Initialize SDK with configuration |
| `openFormWithAssignment({BuildContext, AssignmentContext, ...})` | **Primary API** - Open form with assignment context |
| `checkFormEngineVersion({BuildContext? context, String? engineId})` | Check for engine updates |
| `isFormEngineDownloaded(String engineId)` | Check if engine exists locally |
| `setFormDataListener(FormDataListener listener)` | Register save/submit listener |
| `setFileUploadListener(FileUploadListener listener)` | Register file upload listener |
| `removeFormDataListener()` | Remove save/submit listener |
| `removeFileUploadListener()` | Remove file upload listener |

### Configuration Models

#### FormGearConfig

```dart
FormGearConfig({
  bool autoStartServer = true,
  int serverPort = 8080,
  bool enableLogging = false,
  FormGearApiConfig? apiConfig,
  BpsUser? bpsUser,
  FormGearClientMode clientMode = FormGearClientMode.capi,
  FormGearLookupMode lookupMode = FormGearLookupMode.offline,
  FormGearFormMode formMode = FormGearFormMode.open,
})
```

#### FormGearApiConfig

```dart
FormGearApiConfig({
  String? baseUrl,
  String? formEngineEndpoint,
  String? authToken,
  Map<String, String> customHeaders = const {},
  bool isProduction = true,
  Map<String, List<String>>? pinnedCertificates, // For SSL pinning
})
```

#### BpsUser

```dart
BpsUser({
  String? sessionToken,
  String? authToken,
  String? nipBaru,
  String? nama,
  String? jabatan,
  String? org,
  // ... other fields
})
```

### Enums

#### FormGearClientMode
- `capi` - Computer Assisted Personal Interviewing
- `cawi` - Computer Assisted Web Interviewing

#### FormGearLookupMode
- `online` - Fetch lookup data from server
- `offline` - Use cached lookup data
- `local` - Use local lookup data

#### FormGearFormMode
- `open` - Form is editable
- `submitted` - Form is read-only (submitted)
- `rejected` - Form was rejected (editable)

### SaveOrSubmit Listener

Handle form save/submit operations with custom logic.

```dart
class MyFormDataListener extends FormDataListener {
  @override
  Future<SaveSubmitResult> onSaveOrSubmit(SaveSubmitData data) async {
    // Handle FormGear save/submit
    await myDatabase.save(data);
    return SaveSubmitResult.success(submissionId: 'form_${data.assignmentId}');
  }

  @override
  Future<SaveSubmitResult> onSaveOrSubmitFasihForm(SaveSubmitData data) async {
    // Handle FasihForm save/submit
    await myDatabase.saveFasih(data);
    return SaveSubmitResult.success(submissionId: 'fasih_${data.assignmentId}');
  }
}

// Register listener
FormGearSDK.instance.setFormDataListener(MyFormDataListener());
```

#### SaveSubmitData

```dart
class SaveSubmitData {
  final String assignmentId;
  final String templateId;
  final String surveyId;
  final Map<String, dynamic> formData;
  final Map<String, dynamic> remark;
  final List<dynamic> principal;
  final Map<String, dynamic>? reference; // FormGear only
  final Map<String, dynamic>? media;     // FormGear only
  final String flag; // 'save' or 'submit'
}
```

#### SaveSubmitResult

```dart
// Success
SaveSubmitResult.success(submissionId: 'abc123')

// Failure
SaveSubmitResult.failure(error: 'Database error')
```

### FileUpload Listener

Handle file uploads with custom backend integration.

```dart
class MyFileUploadListener implements FileUploadListener {
  @override
  Future<FileUploadResult> onFileUpload(FileUploadData data) async {
    // Upload to your backend (S3, server, etc.)
    final url = await uploadToBackend(data.file, data.fileName);
    return FileUploadResult.success(uploadedUrl: url);
  }

  @override
  void onUploadProgress(String fileName, int sent, int total) {
    print('Upload: ${(sent / total * 100).toInt()}%');
  }
}

// Register listener
FormGearSDK.instance.setFileUploadListener(MyFileUploadListener());
```

#### FileUploadData

```dart
class FileUploadData {
  final String assignmentId;
  final String templateId;
  final String dataKey;
  final File file;
  final String fileName;
  final String fileUri;
  final Map<String, dynamic>? metadata;
}
```

#### FileUploadResult

```dart
// Success
FileUploadResult.success(uploadedUrl: 'https://s3.amazonaws.com/...')

// Failure
FileUploadResult.failure(error: 'Upload failed')
```

### Result Pattern

Type-safe error handling for SDK operations.

```dart
final result = await checkFormEngineVersionUseCase();

result.fold(
  onFailure: (error) {
    print('Error: $error');
  },
  onSuccess: (response) {
    print('Version: ${response.version}');
  },
);
```

#### Result Types

```dart
sealed class Result<T> {}

class Success<T> extends Result<T> {
  final T data;
}

class Failure<T> extends Result<T> {
  final Object error;
  final StackTrace? stackTrace;
}
```

### Models

#### FormEngineEntity

```dart
class FormEngineEntity {
  final String id;            // '1' or '2'
  final String name;          // Engine name
  final String version;       // Version number
  final String? linkDownload; // Download URL
  final String? description;
}
```

#### VersionCheckResult

```dart
class VersionCheckResult {
  final FormEngineEntity engine;
  final String? currentVersion;
  final String? latestVersion;
  final bool updateAvailable;
  final VersionState state; // upToDate, updateAvailable, notInstalled
}
```

## Security Features

The SDK includes security best practices:

- ✅ **Path validation** - Prevents path traversal attacks
- ✅ **HTTPS enforcement** - Blocks insecure HTTP connections
- ✅ **Log sanitization** - Redacts PII (NIK, phone, email, passwords)
- ✅ **SSL pinning** - Certificate validation support
- ✅ **Required encryption keys** - No hardcoded secrets

## Example App

See the [example](example/) directory for a complete implementation showing:
- SDK initialization
- Form engine selection
- Version checking
- SaveOrSubmit listener implementation
- FileUpload listener implementation

Run the example:
```bash
cd example
flutter pub get
flutter run
```

## Migration from Previous Versions

If you're upgrading from an older version, note these breaking changes:

### Removed APIs

The following internal APIs have been removed from the public surface:
- `FormGearDownloadManager` - Use bundled assets or implement custom download
- Template download methods - Manage templates in your app
- Update screens - Implement custom UI for updates

### Changed APIs

- `FormGearApiConfig` now only requires `formEngineEndpoint` (version check)
- All form operations through `FormGearSDK.instance` methods
- Listeners are now the recommended way to handle save/submit and uploads

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- 🐛 [Report Issues](https://github.com/IPDS-59/form_gear_flutter_sdk/issues)
- 📖 [Documentation](https://github.com/IPDS-59/form_gear_flutter_sdk/wiki)
- 💬 [Discussions](https://github.com/IPDS-59/form_gear_flutter_sdk/discussions)

---

Made with ❤️ for FASIH App and the Flutter community
