# FormGear Flutter SDK - Claude Code Guide

## Overview

This is a Flutter SDK for **FormGear** - a flexible, JSON-driven form generation framework developed for **FASIH App** (Indonesian government data collection system). The SDK integrates with BPS - Statistics Indonesia's standards and follows clean architecture principles for mobile development.

**Key Technologies:**
- Flutter 3.9.2+
- Clean Architecture with Repository Pattern
- Dependency Injection (GetIt + Injectable)
- JavaScript Bridge for WebView integration
- Result Pattern for type-safe error handling
- FASIH-compliant directory structure and naming

## Architecture Overview

### Clean Architecture Layers

The codebase follows **clean architecture principles** with clear separation of concerns:

```
lib/src/
├── core/                    # Infrastructure & Cross-cutting
│   ├── di/                  # Dependency Injection (GetIt)
│   ├── config/              # Configuration models
│   ├── constants/           # FASIH directory constants
│   ├── base/                # Base classes (UseCase, Result)
│   ├── js_bridge/           # WebView-Flutter communication
│   ├── server/              # Local HTTP server
│   └── form_gear_sdk.dart   # Main SDK entry point
├── domain/                  # Business Logic Layer
│   ├── repositories/        # Repository interfaces
│   └── usecases/            # Business logic use cases
├── data/                    # Data Layer
│   ├── repositories/        # Repository implementations
│   ├── datasources/         # Remote/Local data sources
│   └── interceptors/        # HTTP interceptors
├── presentation/            # UI Layer
│   └── widgets/             # Reusable Flutter widgets
├── models/                  # Data models & entities
└── utils/                   # Utilities & helpers
```

### Key Architectural Patterns

#### 1. **Repository Pattern with Interfaces**
```dart
// Domain layer interface
abstract class FormEngineRepository {
  Future<Result<FormEngineResponse>> checkFormEngineVersion([String? formEngineId]);
  Future<bool> isFormEngineDownloaded(String engineId);
}

// Data layer implementation
@LazySingleton(as: FormEngineRepository)
class FormEngineRepositoryImpl implements FormEngineRepository {
  // Implementation with remote/local data sources
}
```

#### 2. **Use Case Pattern for Business Logic**
```dart
@LazySingleton()
class CheckFormEngineVersionUseCase extends BaseUseCase<Result<FormEngineResponse>, String?, FormEngineRepository> {
  const CheckFormEngineVersionUseCase(super.repo);

  @override
  Future<Result<FormEngineResponse>> call([String? formEngineId]) async {
    final engineId = formEngineId ?? FormEngineType.formGear.id.toString();
    return repo.checkFormEngineVersion(engineId);
  }
}
```

#### 3. **Result Pattern for Type-Safe Error Handling**
```dart
sealed class Result<T> {
  const Result();
}

final class Success<T> extends Result<T> {
  const Success(this.data);
  final T data;
}

final class Failure<T> extends Result<T> {
  const Failure(this.error, [this.stackTrace]);
  final Object error;
  final StackTrace? stackTrace;
}
```

#### 4. **Dependency Injection with Injectable**
```dart
// Automatic registration
@LazySingleton()
class MyService {}

// Module for complex dependencies
@module
abstract class RegisterModule {
  @lazySingleton
  Dio dio(FormGearApiConfig apiConfig) {
    // Configure Dio with interceptors
  }
}
```

## Mobile Development Patterns

### 1. **Platform-Specific Directory Management (FASIH Compliance)**

The SDK uses **DirectoryConstants** to match FASIH's native Android directory structure:

```dart
class DirectoryConstants {
  // Matches FASIH: {external_files_dir}/BPS/formengine/{formEngineId}/
  static Future<Directory> getFormEngineDirectory(String engineId);

  // Matches FASIH: {external_files_dir}/BPS/Template/{templateId}/
  static Future<Directory> getTemplateDirectory(String templateId);
}
```

**Key paths:**
- **Android:** `/storage/emulated/0/Android/data/app/files/BPS/`
- **iOS:** `{documents}/BPS/`
- **Templates:** `BPS/Template/` (note: capital T, not templates/)
- **Engines:** `BPS/formengine/{engineId}/`
- **Lookup:** `BPS/lookup/{lookupId}/`

### 2. **WebView-Native Bridge Architecture**

The SDK implements a sophisticated **JavaScript bridge** for WebView communication:

```dart
// Handler base class
abstract class JSHandler<T> {
  String get handlerName;
  Future<T> callback(List<dynamic> arguments);
}

// Action handlers for device capabilities
class ActionHandler extends JSHandler<ActionInfoJs> {
  // Handles: CAMERA, GPS, FILE_PICKER, SIGNATURE
}

// Data handlers for form configuration
class AndroidDataHandler extends JSHandler<dynamic> {
  // Handles: getTemplate, getValidation, getReference
}
```

### 3. **Asset Management & Caching Strategy**

```dart
class FormGearSDK {
  // Loads from local storage first, falls back to bundle assets
  Future<_EngineAssets> _loadEngineAssets(FormEngineType engineType) async {
    try {
      final localAssets = await _loadEngineFromLocal(engineType);
      if (localAssets != null) return localAssets;
    } catch (e) {
      // Log and fall back
    }
    return await _loadEngineFromAssets(engineType);
  }
}
```

### 4. **Local HTTP Server for Performance**

The SDK runs a local HTTP server to serve assets efficiently:

```dart
// Auto-started server for form assets
final config = FormGearConfig(
  autoStartServer: true,
  serverPort: 3310, // Default port
);
```

## FASIH Integration Specifics

### 1. **BPS User Authentication Model**

```dart
@JsonSerializable()
class BpsUser extends Equatable {
  final String? nama;
  final String? nip;
  final String? jabatan;    // USER, ADMIN, SUPERVISOR
  final String? email;
  final String? kdprov;     // Province code
  final String? kdkab;      // Regency code
  final String? kdkec;      // District code
  final String? kddesa;     // Village code
}
```

### 2. **FASIH-Specific Configuration**

```dart
final config = FormGearConfig(
  clientMode: FormGearClientMode.capi,        // CAPI mode for FASIH
  lookupMode: FormGearLookupMode.offline,     // Offline lookup support
  formMode: FormGearFormMode.open,            // Form accessibility
  initialMode: FormGearInitialMode.initial,   // Initial form state
  apiConfig: FormGearApiConfig(
    baseUrl: 'https://fasih-api.bps.go.id',
    templateEndpoint: '/api/templates/{templateId}',
    formEngineEndpoint: '/api/form-engine/version',
    lookupEndpoint: '/api/lookup/{surveyId}',
  ),
);
```

### 3. **FASIH Directory Structure Compliance**

The SDK **exactly matches FASIH's native Android paths**:
- Uses `BPS/` as root directory (not `formgear_data/`)
- Templates in `Template/` directory (capital T)
- Engine files in `formengine/` directory
- Version files as `version.json` (not `version.txt`)

### 4. **Survey Integration Patterns**

```dart
// Custom FASIH form handler
class FasihFormHandler extends JSHandler<ActionInfoJs> {
  @override
  Future<ActionInfoJs> callback(List<dynamic> arguments) async {
    final formData = arguments[0] as Map<String, dynamic>;

    // Add FASIH metadata
    formData['surveyId'] = surveyId;
    formData['appVersion'] = 'FASIH-1.0';
    formData['submittedAt'] = DateTime.now().toIso8601String();

    return ActionInfoJs(success: true, result: 'Form submitted');
  }
}
```

## Development Commands & Workflows

### Common Flutter Commands
```bash
# Dependencies
flutter pub get
flutter pub upgrade

# Code Generation (for Injectable, JSON serialization)
flutter packages pub run build_runner build --delete-conflicting-outputs

# Linting & Formatting
flutter analyze
dart format .
dart fix --apply

# Testing
flutter test
flutter test --coverage

# Build
flutter build apk
flutter build ios
```

### Code Generation Patterns

The project uses several code generators:

1. **Injectable** for dependency injection:
```dart
@InjectableInit()
Future<void> configureDependencies() async {
  $initGetIt(getIt);
}
```

2. **JSON Serialization** for models:
```dart
@JsonSerializable()
class FormEngineResponse {
  // Generated: .g.dart files
}
```

3. **Freezed** for immutable data classes (if used)

### Linting Configuration

Uses `very_good_analysis` with custom overrides:

```yaml
include: package:very_good_analysis/analysis_options.yaml

analyzer:
  exclude:
    - "**/**.g.dart"      # Generated files
    - "**/**.config.dart" # Injectable config

linter:
  rules:
    public_member_api_docs: false  # Disabled for internal SDK
```

## Key Mobile Development Considerations

### 1. **Permission Handling**

The SDK requires multiple permissions for FASIH functionality:

```xml
<!-- Android -->
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

### 2. **WebView Security**

```dart
// Security configurations for form engines
InAppWebView(
  initialOptions: InAppWebViewGroupOptions(
    crossPlatform: InAppWebViewOptions(
      useShouldOverrideUrlLoading: true,
      mediaPlaybackRequiresUserGesture: false,
    ),
    android: AndroidInAppWebViewOptions(
      useHybridComposition: true,
    ),
  ),
)
```

### 3. **Background Processing**

The SDK handles asset downloads and extraction in the background while maintaining UI responsiveness.

### 4. **Memory Management**

- Proper disposal of WebView controllers
- Asset caching with size limits
- Image compression for camera captures

## Testing Strategy

### Unit Tests
- Use cases with mocked repositories
- Result pattern validation
- Model serialization/deserialization

### Integration Tests
- WebView bridge communication
- Asset download and extraction
- Directory structure creation

### Widget Tests
- FormGear WebView widget
- Error state handling
- Loading indicators

## Common Patterns & Best Practices

### 1. **Error Handling with Result Pattern**

```dart
// Usage pattern
final result = await checkFormEngineVersionUseCase('1');
result.fold(
  (error) => showErrorDialog(error.toString()),
  (response) => handleSuccess(response),
);
```

### 2. **Dependency Injection Usage**

```dart
// Getting dependencies
final repository = getIt<FormEngineRepository>();
final useCase = getIt<CheckFormEngineVersionUseCase>();
```

### 3. **Asset Path Management**

```dart
// Always use DirectoryConstants for FASIH compliance
final engineDir = await DirectoryConstants.getFormEngineDirectory('1');
final templateDir = await DirectoryConstants.getTemplateDirectory('survey-2024');
```

### 4. **WebView Bridge Implementation**

```dart
// Custom handler registration
FormGearSDK.instance.createWebView(
  formEngineId: '2',
  customHandlers: [
    CustomFormHandler(),
    FasihDataHandler(),
  ],
);
```

## Key Files to Understand

### Core Architecture
- `lib/src/core/form_gear_sdk.dart` - Main SDK entry point
- `lib/src/core/di/injection.dart` - Dependency injection setup
- `lib/src/core/constants/directory_constants.dart` - FASIH directory structure

### Clean Architecture
- `lib/src/core/base/base_use_case.dart` - Use case base classes
- `lib/src/core/base/result.dart` - Result pattern implementation
- `lib/src/domain/repositories/` - Repository interfaces
- `lib/src/data/repositories/` - Repository implementations

### Mobile-Specific
- `lib/src/core/js_bridge/` - WebView-native bridge
- `lib/src/presentation/widgets/form_gear_webview.dart` - WebView widget
- `lib/src/models/bps_user.dart` - FASIH user model

### Configuration
- `pubspec.yaml` - Dependencies and metadata
- `analysis_options.yaml` - Linting rules
- `example/` - Complete integration example

## Development Tips

1. **Always run code generation** after adding new Injectable or JsonSerializable classes
2. **Use DirectoryConstants** instead of hardcoded paths for FASIH compliance
3. **Prefer Result pattern** over throwing exceptions for business logic
4. **Test WebView bridge handlers** thoroughly - they're the most complex part
5. **Follow FASIH naming conventions** exactly (BPS/, Template/, etc.)
6. **Use the example app** as reference for proper SDK integration
7. **Always use mobile dev expert** for mobile-specific operations
8. **For file operations, always use synchronous methods** (existsSync, deleteSync, etc.) when possible for better performance

## FASIH App Integration Checklist

- [ ] Initialize SDK with FASIH-compatible configuration
- [ ] Set up BpsUser with proper authentication details
- [ ] Configure API endpoints for FASIH backend
- [ ] Use FormEngineType.fasihForm (engine ID '2') for FasihForm v2
- [ ] Implement custom handlers for FASIH-specific form actions
- [ ] Ensure offline capability with proper asset caching
- [ ] Test directory structure matches native Android FASIH app
- [ ] Verify GPS and camera permissions are properly requested
- [ ] Implement proper error handling for network failures
- [ ] Add progress indicators for asset downloads

This SDK is specifically designed for Indonesian government data collection workflows and follows BPS - Statistics Indonesia's technical standards and directory structures.
- this is form gear sdk version we try to extract from Documents/Projects/Flutter/form_gear_backup/fasih_analysis
- NEVER RUN THE APP SINCE YOU CAN'T SEE THE CONTENT, IF YOU NEED TO VERIFY SOMETHING, LET ME RUN THE APP AND PASTE THE LOG FOR YOU