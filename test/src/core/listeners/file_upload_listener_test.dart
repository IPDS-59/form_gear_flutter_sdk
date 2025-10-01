import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:form_gear_engine_sdk/src/core/listeners/file_upload_listener.dart';
import 'package:form_gear_engine_sdk/src/models/file_upload_data.dart';
import 'package:form_gear_engine_sdk/src/models/file_upload_result.dart';

// Mock implementation for testing
class MockFileUploadListener implements FileUploadListener {
  MockFileUploadListener({
    Future<FileUploadResult> Function(FileUploadData)? onFileUpload,
    void Function(String, int, int)? onUploadProgress,
    Future<void> Function(String, FileUploadResult)? onUploadCompleted,
    Future<void> Function(String, Object, StackTrace)? onUploadError,
  }) : _onFileUploadImpl = onFileUpload,
       _onUploadProgressImpl = onUploadProgress,
       _onUploadCompletedImpl = onUploadCompleted,
       _onUploadErrorImpl = onUploadError;
  final Future<FileUploadResult> Function(FileUploadData)? _onFileUploadImpl;
  final void Function(String, int, int)? _onUploadProgressImpl;
  final Future<void> Function(String, FileUploadResult)? _onUploadCompletedImpl;
  final Future<void> Function(String, Object, StackTrace)? _onUploadErrorImpl;

  // Track calls
  final List<FileUploadData> uploadCalls = [];
  final List<Map<String, dynamic>> progressCalls = [];
  final List<Map<String, dynamic>> completedCalls = [];
  final List<Map<String, dynamic>> errorCalls = [];

  @override
  Future<FileUploadResult> onFileUpload(FileUploadData data) async {
    uploadCalls.add(data);
    if (_onFileUploadImpl != null) {
      return _onFileUploadImpl(data);
    }
    return FileUploadResult.success(
      uploadedUrl: 'https://example.com/${data.fileName}',
    );
  }

  @override
  void onUploadProgress(String fileName, int sent, int total) {
    progressCalls.add({
      'fileName': fileName,
      'sent': sent,
      'total': total,
    });
    _onUploadProgressImpl?.call(fileName, sent, total);
  }

  @override
  Future<void> onUploadCompleted(
    String fileName,
    FileUploadResult result,
  ) async {
    completedCalls.add({
      'fileName': fileName,
      'result': result,
    });
    await _onUploadCompletedImpl?.call(fileName, result);
  }

  @override
  Future<void> onUploadError(
    String fileName,
    Object error,
    StackTrace stackTrace,
  ) async {
    errorCalls.add({
      'fileName': fileName,
      'error': error,
      'stackTrace': stackTrace,
    });
    await _onUploadErrorImpl?.call(fileName, error, stackTrace);
  }
}

void main() {
  group('FileUploadListener Tests', () {
    late File testFile;
    late FileUploadData testData;

    setUp(() {
      testFile = File('/path/to/test/file.jpg');
      testData = FileUploadData(
        assignmentId: 'assignment_001',
        templateId: 'template_001',
        dataKey: 'photo_field',
        file: testFile,
        fileName: 'test_photo.jpg',
        fileUri: 'file:///path/to/test/file.jpg',
      );
    });

    group('Interface Compliance', () {
      test('should implement FileUploadListener interface', () {
        final listener = MockFileUploadListener();
        expect(listener, isA<FileUploadListener>());
      });

      test('should have onFileUpload method', () {
        final listener = MockFileUploadListener();
        expect(
          listener.onFileUpload(testData),
          isA<Future<FileUploadResult>>(),
        );
      });

      test('should have onUploadProgress method', () {
        final listener = MockFileUploadListener();
        expect(
          () => listener.onUploadProgress('file.jpg', 50, 100),
          returnsNormally,
        );
      });

      test('should have onUploadCompleted method', () {
        final listener = MockFileUploadListener();
        const result = FileUploadResult.success(
          uploadedUrl: 'https://example.com/file.jpg',
        );
        expect(
          listener.onUploadCompleted('file.jpg', result),
          isA<Future<void>>(),
        );
      });

      test('should have onUploadError method', () {
        final listener = MockFileUploadListener();
        expect(
          listener.onUploadError(
            'file.jpg',
            Exception('error'),
            StackTrace.current,
          ),
          isA<Future<void>>(),
        );
      });
    });

    group('onFileUpload', () {
      test('should call onFileUpload with correct data', () async {
        final listener = MockFileUploadListener();

        final result = await listener.onFileUpload(testData);

        expect(listener.uploadCalls.length, equals(1));
        expect(listener.uploadCalls[0], equals(testData));
        expect(result.isSuccess, isTrue);
      });

      test('should return custom result from implementation', () async {
        const customResult = FileUploadResult.success(
          uploadedUrl: 'https://s3.amazonaws.com/bucket/file.jpg',
          metadata: {'uploadDuration': 2000},
        );

        final listener = MockFileUploadListener(
          onFileUpload: (_) async => customResult,
        );

        final result = await listener.onFileUpload(testData);

        expect(result, equals(customResult));
        expect(result.uploadedUrl, contains('s3.amazonaws.com'));
        expect(result.metadata!['uploadDuration'], equals(2000));
      });

      test('should handle upload failure', () async {
        const failureResult = FileUploadResult.failure(
          error: 'Network error',
        );

        final listener = MockFileUploadListener(
          onFileUpload: (_) async => failureResult,
        );

        final result = await listener.onFileUpload(testData);

        expect(result.isSuccess, isFalse);
        expect(result.error, equals('Network error'));
      });

      test('should handle async upload operations', () async {
        final listener = MockFileUploadListener(
          onFileUpload: (data) async {
            // Simulate network delay
            await Future.delayed(const Duration(milliseconds: 100));
            return FileUploadResult.success(
              uploadedUrl: 'https://example.com/${data.fileName}',
            );
          },
        );

        final result = await listener.onFileUpload(testData);

        expect(result.isSuccess, isTrue);
        expect(result.uploadedUrl, contains('test_photo.jpg'));
      });
    });

    group('onUploadProgress', () {
      test('should track progress updates', () {
        final listener = MockFileUploadListener();

        listener.onUploadProgress('file.jpg', 25, 100);
        listener.onUploadProgress('file.jpg', 50, 100);
        listener.onUploadProgress('file.jpg', 75, 100);
        listener.onUploadProgress('file.jpg', 100, 100);

        expect(listener.progressCalls.length, equals(4));
        expect(listener.progressCalls[0]['sent'], equals(25));
        expect(listener.progressCalls[1]['sent'], equals(50));
        expect(listener.progressCalls[2]['sent'], equals(75));
        expect(listener.progressCalls[3]['sent'], equals(100));
      });

      test('should call custom progress handler', () {
        final progressUpdates = <int>[];

        final listener = MockFileUploadListener(
          onUploadProgress: (fileName, sent, total) {
            progressUpdates.add(sent);
          },
        );

        listener.onUploadProgress('file.jpg', 50, 100);

        expect(progressUpdates, equals([50]));
      });

      test('should handle zero bytes sent', () {
        final listener = MockFileUploadListener();

        expect(
          () => listener.onUploadProgress('file.jpg', 0, 100),
          returnsNormally,
        );

        expect(listener.progressCalls[0]['sent'], equals(0));
      });

      test('should handle complete upload (sent == total)', () {
        final listener = MockFileUploadListener();

        listener.onUploadProgress('file.jpg', 1024, 1024);

        expect(listener.progressCalls[0]['sent'], equals(1024));
        expect(listener.progressCalls[0]['total'], equals(1024));
      });
    });

    group('onUploadCompleted', () {
      test('should be called after successful upload', () async {
        final listener = MockFileUploadListener();
        const result = FileUploadResult.success(
          uploadedUrl: 'https://example.com/file.jpg',
        );

        await listener.onUploadCompleted('file.jpg', result);

        expect(listener.completedCalls.length, equals(1));
        expect(listener.completedCalls[0]['fileName'], equals('file.jpg'));
        expect(listener.completedCalls[0]['result'], equals(result));
      });

      test('should call custom completion handler', () async {
        var handlerCalled = false;

        final listener = MockFileUploadListener(
          onUploadCompleted: (fileName, result) async {
            handlerCalled = true;
          },
        );

        const result = FileUploadResult.success(
          uploadedUrl: 'https://example.com/file.jpg',
        );

        await listener.onUploadCompleted('file.jpg', result);

        expect(handlerCalled, isTrue);
      });

      test('should handle async completion operations', () async {
        var completionDelay = 0;

        final listener = MockFileUploadListener(
          onUploadCompleted: (fileName, result) async {
            await Future.delayed(const Duration(milliseconds: 50));
            completionDelay = 50;
          },
        );

        const result = FileUploadResult.success(
          uploadedUrl: 'https://example.com/file.jpg',
        );

        await listener.onUploadCompleted('file.jpg', result);

        expect(completionDelay, equals(50));
      });
    });

    group('onUploadError', () {
      test('should be called on upload error', () async {
        final listener = MockFileUploadListener();
        final error = Exception('Upload failed');
        final stackTrace = StackTrace.current;

        await listener.onUploadError('file.jpg', error, stackTrace);

        expect(listener.errorCalls.length, equals(1));
        expect(listener.errorCalls[0]['fileName'], equals('file.jpg'));
        expect(listener.errorCalls[0]['error'], equals(error));
        expect(listener.errorCalls[0]['stackTrace'], equals(stackTrace));
      });

      test('should call custom error handler', () async {
        Object? capturedError;

        final listener = MockFileUploadListener(
          onUploadError: (fileName, error, stackTrace) async {
            capturedError = error;
          },
        );

        final error = Exception('Network timeout');
        await listener.onUploadError('file.jpg', error, StackTrace.current);

        expect(capturedError, equals(error));
      });

      test('should handle different error types', () async {
        final listener = MockFileUploadListener();

        await listener.onUploadError(
          'file1.jpg',
          Exception('Exception error'),
          StackTrace.current,
        );

        await listener.onUploadError(
          'file2.jpg',
          'String error',
          StackTrace.current,
        );

        await listener.onUploadError(
          'file3.jpg',
          const FileSystemException('File not found'),
          StackTrace.current,
        );

        expect(listener.errorCalls.length, equals(3));
        expect(listener.errorCalls[0]['error'], isA<Exception>());
        expect(listener.errorCalls[1]['error'], isA<String>());
        expect(listener.errorCalls[2]['error'], isA<FileSystemException>());
      });
    });

    group('Complete Upload Workflow', () {
      test('should execute complete successful upload workflow', () async {
        final progressUpdates = <int>[];

        final listener = MockFileUploadListener(
          onFileUpload: (data) async {
            return FileUploadResult.success(
              uploadedUrl: 'https://s3.amazonaws.com/bucket/${data.fileName}',
            );
          },
          onUploadProgress: (fileName, sent, total) {
            progressUpdates.add(sent);
          },
        );

        // Simulate progress updates
        listener.onUploadProgress(testData.fileName, 25, 100);
        listener.onUploadProgress(testData.fileName, 50, 100);
        listener.onUploadProgress(testData.fileName, 75, 100);
        listener.onUploadProgress(testData.fileName, 100, 100);

        // Execute upload
        final result = await listener.onFileUpload(testData);

        // Verify success
        expect(result.isSuccess, isTrue);

        // Call completion handler
        await listener.onUploadCompleted(testData.fileName, result);

        // Verify workflow
        expect(listener.uploadCalls.length, equals(1));
        expect(listener.progressCalls.length, equals(4));
        expect(listener.completedCalls.length, equals(1));
        expect(listener.errorCalls.length, equals(0));
        expect(progressUpdates.length, equals(4));
      });

      test('should execute complete failed upload workflow', () async {
        final error = Exception('Upload failed');
        final progressUpdates = <int>[];

        final listener = MockFileUploadListener(
          onFileUpload: (data) async {
            return FileUploadResult.failure(
              error: 'Upload failed: $error',
            );
          },
          onUploadProgress: (fileName, sent, total) {
            progressUpdates.add(sent);
          },
        );

        // Simulate partial progress before failure
        listener.onUploadProgress(testData.fileName, 50, 100);

        // Execute upload
        final result = await listener.onFileUpload(testData);

        // Verify failure
        expect(result.isSuccess, isFalse);

        // Call error handler
        await listener.onUploadError(
          testData.fileName,
          error,
          StackTrace.current,
        );

        // Verify workflow
        expect(listener.uploadCalls.length, equals(1));
        expect(listener.progressCalls.length, equals(1));
        expect(listener.completedCalls.length, equals(0));
        expect(listener.errorCalls.length, equals(1));
        expect(progressUpdates.length, equals(1));
      });
    });

    group('Use Cases', () {
      test('should handle S3 upload with progress tracking', () async {
        final progressUpdates = <int>[];

        final listener = MockFileUploadListener(
          onFileUpload: (data) async {
            return FileUploadResult.success(
              uploadedUrl:
                  'https://fasih-bucket.s3.amazonaws.com/${data.fileName}',
              metadata: const {'uploadDuration': 100},
            );
          },
          onUploadProgress: (fileName, sent, total) {
            progressUpdates.add(sent);
          },
        );

        // Simulate progress tracking
        const totalSize = 1024;
        for (var i = 0; i <= 100; i += 20) {
          final sent = (totalSize * i / 100).round();
          listener.onUploadProgress(testData.fileName, sent, totalSize);
        }

        final result = await listener.onFileUpload(testData);

        expect(result.isSuccess, isTrue);
        expect(listener.progressCalls.length, greaterThan(0));
        expect(progressUpdates.length, greaterThan(0));
      });

      test('should handle retry logic on network failure', () async {
        var attemptCount = 0;

        final listener = MockFileUploadListener(
          onFileUpload: (data) async {
            attemptCount++;
            if (attemptCount < 3) {
              return FileUploadResult.failure(
                error: 'Network error',
                metadata: {'attemptCount': attemptCount},
              );
            }

            return FileUploadResult.success(
              uploadedUrl: 'https://example.com/${data.fileName}',
              metadata: {'attemptCount': attemptCount},
            );
          },
        );

        // Simulate retry logic
        FileUploadResult? result;
        for (var i = 0; i < 3; i++) {
          result = await listener.onFileUpload(testData);
          if (result.isSuccess) break;
        }

        expect(result!.isSuccess, isTrue);
        expect(attemptCount, equals(3));
        expect(listener.uploadCalls.length, equals(3));
      });
    });
  });
}
