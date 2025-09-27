# FASIH Data Loading Analysis

**Analysis Date:** 2025-01-27
**Branch:** `feature/fasih-data-loading-analysis`
**Purpose:** Understand how FASIH loads previous response, config, media, and handles save/store/upload operations for FormGear integration

## Executive Summary

FASIH uses a sophisticated data management system that handles multiple data types for survey forms including templates, responses, media, validation, and user configurations. The system implements a comprehensive JavaScript bridge interface for FormGear WebView integration with full CRUD operations, encryption support, and offline-first architecture.

## Key Findings

### 1. Data Architecture Overview

FASIH implements a **multi-layered data architecture** with the following key components:

- **Assignment-Based System**: Every survey assignment (narasumber) has its own data context
- **Template-Driven Forms**: Each survey uses JSON templates with validation rules
- **Encrypted Data Storage**: Supports encrypted local storage for sensitive data
- **Offline-First Design**: Full offline capability with sync mechanisms
- **Media Management**: Comprehensive image, file, and document handling

### 2. Core Data Types

#### A. Assignment Entity Structure
```kotlin
class AssignmentEntity {
    // Core identifiers
    val id: String
    val surveyId: String
    val periodeId: String
    val templateId: String

    // User context
    val currentUserId: String
    val currentUserRole: String

    // Data files
    val preDefinedData: String?      // Pre-filled form data
    val data: DataAssignment?        // Form responses
    val comment: String?             // Remarks/notes

    // Media references
    val assignmentResponsibility: List<AssignmentResponsibilityForResponseData>
    val assignmentHistories: List<AssignmentHistory>

    // Location data
    val latitude: Double?
    val longitude: Double?
    val accuracy: Double?

    // Status management
    val assignmentStatusId: Int?
    val isDone: Boolean?
    val isEncrypt: Boolean
    val offlineSend: Boolean
}
```

#### B. File Structure Pattern
FASIH uses a standardized directory structure matching Android external storage:
```
{external_files_dir}/BPS/
├── Template/{templateId}/
│   ├── template.json
│   └── validation.json
├── formengine/{engineId}/
│   ├── index.html
│   ├── form-gear.js
│   └── version.json
├── lookup/{surveyId}/
│   └── lookup.json
└── assignments/{assignmentId}/
    ├── data.json          # Form responses
    ├── media.json         # Media file references
    ├── principal.json     # User principal data
    ├── reference.json     # Reference/lookup data
    ├── remark.json        # Comments/remarks
    └── media/             # Actual media files
        ├── photo1.jpg
        ├── signature.png
        └── document.pdf
```

### 3. Data Loading Mechanisms

#### A. Template Loading (`getTemplate()`)
```kotlin
@JavascriptInterface
fun getTemplate(): String {
    try {
        val templateFile = File(FileHelper.pathTemplate(activity.templateId))
        return templateFile.readText(Charsets.UTF_8)
    } catch (IOException e) {
        // Error handling - show sync dialog
        activity.showAlertDialog("Template not found", "Please sync templates")
        return ""
    }
}
```

**Key Points:**
- Templates loaded from local storage first
- Fallback to asset files if local not found
- JSON format with form structure and validation rules
- Cached locally after initial download

#### B. Previous Response Loading (`getResponse()`)
```kotlin
@JavascriptInterface
fun getResponse(): String? {
    try {
        val dataFile = File("${activity.answerPath}/data.json")
        if (dataFile.exists()) {
            val content = FileHelper.readFile(dataFile).toString()
            if (isJsonFormat(content)) {
                return content
            } else {
                // Handle encrypted data
                return decryptData(content)
            }
        } else {
            // For new forms, return default empty response
            return assets.open("client/formgear/response.json").readText()
        }
    } catch (IOException e) {
        // Handle error - might trigger re-download
        return null
    }
}
```

**Key Points:**
- Checks for existing response data first
- Supports encrypted response data
- Falls back to default template response for new assignments
- Auto-downloads from server if in edit mode and local data corrupted

#### C. Preset Data Loading (`getPreset()`)
```kotlin
@JavascriptInterface
fun getPreset(): String? {
    try {
        val assignment = runBlocking { getAssignmentById(assignmentId) }
        return assignment?.preDefinedData ?: ""
    } catch (IOException e) {
        activity.showErrorDialog("Preset data error")
        return null
    }
}
```

**Key Points:**
- Loads pre-defined form data for the assignment
- Used for pre-filling form fields based on sampling data
- Contains respondent information, location data, etc.

#### D. Media Loading (`getMedia()`)
```kotlin
@JavascriptInterface
fun getMedia(): String? {
    try {
        val mediaFile = File("${activity.answerPath}/media.json")
        if (mediaFile.exists()) {
            return FileHelper.readFile(mediaFile).toString()
        } else {
            // Return empty media structure
            return assets.open("client/formgear/media.json").readText()
        }
    } catch (IOException e) {
        return null
    }
}
```

**Key Points:**
- Media.json contains file references, not actual files
- References point to files in media/ subdirectory
- Supports photos, signatures, documents, audio recordings

#### E. Validation Rules (`getValidation()`)
```kotlin
@JavascriptInterface
fun getValidation(): String {
    try {
        val validationFile = File(FileHelper.pathValidation(activity.templateId))
        return validationFile.readText(Charsets.UTF_8)
    } catch (IOException e) {
        activity.showSyncDialog()
        return ""
    }
}
```

### 4. Save/Store/Upload Operations

#### A. Save or Submit (`saveOrSubmit()`)
```kotlin
@JavascriptInterface
fun saveOrSubmit(
    data: String,
    remark: String,
    principal: String,
    reference: String,
    media: String,
    flag: String
) {
    val timestamp = System.currentTimeMillis()
    val assignment = getAssignmentById(assignmentId)
    val isEncrypted = assignment?.isEncrypt ?: false

    // Save data.json
    FileHelper.saveAssignmentFile(
        path = "${activity.answerPath}/data.json",
        content = data,
        timestamp = timestamp,
        encrypt = isEncrypted
    ) { success ->
        if (success) {
            // Save media.json
            FileHelper.saveAssignmentFile(
                path = "${activity.answerPath}/media.json",
                content = media,
                timestamp = timestamp,
                encrypt = false
            ) { mediaSuccess ->
                if (mediaSuccess) {
                    // Save principal.json
                    FileHelper.saveAssignmentFile(
                        path = "${activity.answerPath}/principal.json",
                        content = principal,
                        timestamp = timestamp,
                        encrypt = false
                    ) { principalSuccess ->
                        if (principalSuccess) {
                            // Save remark.json
                            FileHelper.saveAssignmentFile(
                                path = "${activity.answerPath}/remark.json",
                                content = remark,
                                timestamp = timestamp,
                                encrypt = false
                            ) { remarkSuccess ->
                                if (remarkSuccess) {
                                    // Update assignment status
                                    updateAssignmentStatus(flag)

                                    // If submit flag, trigger upload
                                    if (flag == "submit") {
                                        if (SsoHelper.checkExpSession()) {
                                            submit()
                                        } else {
                                            // Refresh token and retry
                                            SsoHelper.requestRefreshToken { success ->
                                                if (success) submit()
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
```

#### B. FASIH Form Save (`saveOrSubmitFasihForm()`)
```kotlin
@JavascriptInterface
fun saveOrSubmitFasihForm(
    data: String,
    remark: String,
    principal: String,
    flag: String
) {
    if (!activity.isEdit) {
        val assignment = getAssignmentById(assignmentId)
        val isEncrypted = assignment?.isEncrypt ?: false
        val timestamp = System.currentTimeMillis()

        // Save data.json with encryption if required
        FileHelper.saveAssignmentFile(
            path = "${activity.answerPath}/data.json",
            content = data,
            timestamp = timestamp,
            encrypt = isEncrypted
        ) { success ->
            if (success) {
                // Save principal.json
                FileHelper.saveAssignmentFile(
                    path = "${activity.answerPath}/principal.json",
                    content = principal,
                    timestamp = timestamp,
                    encrypt = false
                ) { principalSuccess ->
                    if (principalSuccess) {
                        // Update assignment status and handle submit
                        updateAssignmentStatus(flag)
                        if (flag == "submit") {
                            submitToServer()
                        }
                    }
                }
            }
        }
    }
}
```

### 5. Media File Management

#### A. Camera Capture Integration
```kotlin
fun cameraResult(file: File?, fileNameFormGear: String) {
    if (file != null) {
        val targetPath = "${activity.answerPath}/media/$fileNameFormGear"
        file.copyTo(File(targetPath))

        // Update media.json with new file reference
        val mediaJson = getMediaJson()
        mediaJson.addPhoto(fileNameFormGear, targetPath)
        saveMediaJson(mediaJson)

        // Notify FormGear JavaScript
        webView.evaluateJavascript(
            "window.cameraCallback('$fileNameFormGear')", null
        )
    }
}
```

#### B. File Upload Processing
```kotlin
@JavascriptInterface
fun fileUploadHandler(fileData: Any, updateCallback: Function, isReload: Boolean) {
    try {
        val fileInfo = parseFileData(fileData)
        val fileName = fileInfo.name
        val content = fileInfo.content

        // Save file to media directory
        val filePath = "${activity.answerPath}/media/$fileName"
        File(filePath).writeBytes(content)

        // Update media references
        updateMediaReferences(fileName, filePath)

        // Call progress callback
        updateCallback.invoke("File uploaded: $fileName")

    } catch (e: Exception) {
        updateCallback.invoke("Error: ${e.message}")
    }
}
```

### 6. Offline/Online Synchronization

#### A. Offline Storage Strategy
- **Local First**: All data saved locally immediately
- **Queue Management**: Failed uploads queued for retry
- **Conflict Resolution**: Server data takes precedence on conflicts
- **Encryption Support**: Sensitive data encrypted at rest

#### B. Upload Mechanism
```kotlin
private fun submit() {
    val assignment = getCurrentAssignment()
    val uploadEntity = createAssignmentUploadEntity(assignment)

    // Create 7z archive of all assignment files
    val archiveFile = create7zFile(assignment.answerPath)

    // Upload to S3 with presigned URLs
    uploadToS3(archiveFile) { success ->
        if (success) {
            // Mark as uploaded
            assignment.offlineSend = false
            updateAssignment(assignment)

            // Show success message
            activity.runOnUiThread {
                activity.showSuccessDialog("Data uploaded successfully")
            }
        } else {
            // Keep in offline queue
            assignment.offlineSend = true
            updateAssignment(assignment)
        }
    }
}
```

### 7. Configuration Management

#### A. User Configuration Loading
```kotlin
@JavascriptInterface
fun getUserName(): String? = DataSurvey.User.getCurrentUser()?.nama

@JavascriptInterface
fun getUserRole(): String? = DataSurvey.User.getCurrentUser()?.jabatan

@JavascriptInterface
fun getFormMode(): String? = DataSurvey.Status.getFormMode()

@JavascriptInterface
fun getIsNew(): String? = DataSurvey.Status.getIsNew().toString()
```

#### B. Survey Configuration
```kotlin
@JavascriptInterface
fun getReference(): String? {
    try {
        val referenceFile = File("${activity.answerPath}/reference.json")
        if (referenceFile.exists()) {
            return referenceFile.readText()
        } else {
            // Load default reference data
            return loadDefaultReference(activity.surveyId)
        }
    } catch (e: IOException) {
        return null
    }
}
```

### 8. Error Handling & Recovery

#### A. Data Corruption Recovery
- **Automatic Re-download**: If local data corrupted, triggers server download
- **Backup Mechanisms**: Multiple backup locations for critical data
- **Validation Checks**: JSON validation before processing
- **User Notifications**: Clear error messages with recovery actions

#### B. Network Failure Handling
- **Offline Queue**: Failed uploads stored in local queue
- **Retry Logic**: Exponential backoff for failed requests
- **Session Management**: Automatic token refresh
- **Graceful Degradation**: App functions fully offline

## Recommendations for Flutter SDK Implementation

### 1. Data Architecture
```dart
class FormGearDataManager {
  // Core data loading methods matching FASIH interface
  Future<String?> getTemplate(String templateId);
  Future<String?> getResponse(String assignmentId);
  Future<String?> getPreset(String assignmentId);
  Future<String?> getMedia(String assignmentId);
  Future<String?> getValidation(String templateId);
  Future<String?> getReference(String assignmentId);
  Future<String?> getRemark(String assignmentId);

  // Configuration methods
  Future<String?> getUserName();
  Future<String?> getUserRole();
  Future<String?> getFormMode();
  Future<String?> getIsNew();

  // Save/submit operations
  Future<bool> saveOrSubmit({
    required String data,
    required String remark,
    required String principal,
    required String reference,
    required String media,
    required String flag,
  });

  Future<bool> saveOrSubmitFasihForm({
    required String data,
    required String remark,
    required String principal,
    required String flag,
  });
}
```

### 2. File System Management
```dart
class FormGearFileManager {
  static Future<Directory> getAssignmentDirectory(String assignmentId) async {
    final appDir = await getApplicationDocumentsDirectory();
    return Directory('${appDir.path}/BPS/assignments/$assignmentId');
  }

  static Future<Directory> getTemplateDirectory(String templateId) async {
    final appDir = await getApplicationDocumentsDirectory();
    return Directory('${appDir.path}/BPS/Template/$templateId');
  }

  static Future<Directory> getMediaDirectory(String assignmentId) async {
    final assignmentDir = await getAssignmentDirectory(assignmentId);
    return Directory('${assignmentDir.path}/media');
  }
}
```

### 3. Bridge Handler Extensions
```dart
// Add to existing AndroidDataHandler
class AndroidDataHandler extends JSHandler<dynamic> {
  @override
  Future<dynamic> callback(List<dynamic> arguments) async {
    final method = arguments[0] as String;

    switch (method) {
      case 'getTemplate':
        return await dataManager.getTemplate(templateId);
      case 'getResponse':
        return await dataManager.getResponse(assignmentId);
      case 'getPreset':
        return await dataManager.getPreset(assignmentId);
      case 'getMedia':
        return await dataManager.getMedia(assignmentId);
      case 'getValidation':
        return await dataManager.getValidation(templateId);
      case 'getReference':
        return await dataManager.getReference(assignmentId);
      case 'getRemark':
        return await dataManager.getRemark(assignmentId);
      // ... other cases
    }
  }
}

// Extend existing ActionHandler for save operations
class ActionHandler extends JSHandler<ActionInfoJs> {
  @override
  Future<ActionInfoJs> callback(List<dynamic> arguments) async {
    final action = arguments[0] as String;

    switch (action) {
      case 'saveOrSubmit':
        final result = await dataManager.saveOrSubmit(
          data: arguments[1],
          remark: arguments[2],
          principal: arguments[3],
          reference: arguments[4],
          media: arguments[5],
          flag: arguments[6],
        );
        return ActionInfoJs(success: result);

      case 'saveOrSubmitFasihForm':
        final result = await dataManager.saveOrSubmitFasihForm(
          data: arguments[1],
          remark: arguments[2],
          principal: arguments[3],
          flag: arguments[4],
        );
        return ActionInfoJs(success: result);

      // ... other cases
    }
  }
}
```

### 4. Encryption Support
```dart
class FormGearEncryption {
  static Future<String> encryptData(String data, String key) async {
    // Implement AES encryption matching FASIH
    return await AESCrypt.encrypt(data, key);
  }

  static Future<String> decryptData(String encryptedData, String key) async {
    // Implement AES decryption matching FASIH
    return await AESCrypt.decrypt(encryptedData, key);
  }
}
```

### 5. Assignment Model
```dart
@JsonSerializable()
class Assignment {
  final String id;
  final String surveyId;
  final String periodeId;
  final String templateId;
  final String currentUserId;
  final String? preDefinedData;
  final bool isEncrypt;
  final bool offlineSend;
  final double? latitude;
  final double? longitude;
  final double? accuracy;
  final int? assignmentStatusId;
  final bool? isDone;

  // Add methods for data paths
  String get answerPath => 'BPS/assignments/$id';
  String get dataPath => '$answerPath/data.json';
  String get mediaPath => '$answerPath/media.json';
  String get principalPath => '$answerPath/principal.json';
  String get remarkPath => '$answerPath/remark.json';
  String get referencePath => '$answerPath/reference.json';
  String get mediaDirectory => '$answerPath/media/';
}
```

## Implementation Priority

### Phase 1: Core Data Loading
1. Implement basic file system structure
2. Add template and validation loading
3. Add response data loading with encryption support
4. Add preset and configuration loading

### Phase 2: Save Operations
1. Implement saveOrSubmit functionality
2. Add saveOrSubmitFasihForm functionality
3. Add media file handling
4. Add encryption/decryption support

### Phase 3: Advanced Features
1. Add offline queue management
2. Implement sync mechanisms
3. Add error recovery
4. Add progress tracking

This analysis provides a comprehensive foundation for implementing FASIH-compatible data loading and management in the FormGear Flutter SDK.