import 'package:flutter_test/flutter_test.dart';
import 'package:form_gear_engine_sdk/src/models/file_upload_result.dart';

void main() {
  group('FileUploadResult Tests', () {
    group('Construction', () {
      test('should create success result with uploadedUrl', () {
        const result = FileUploadResult.success(
          uploadedUrl: 'https://s3.amazonaws.com/bucket/file.jpg',
        );

        expect(result.isSuccess, isTrue);
        expect(result.uploadedUrl, equals('https://s3.amazonaws.com/bucket/file.jpg'));
        expect(result.error, isNull);
        expect(result.metadata, isNull);
      });

      test('should create success result with metadata', () {
        final metadata = {
          'uploadDuration': 1500,
          'fileSize': 2048,
          'checksum': 'abc123',
        };

        final result = FileUploadResult.success(
          uploadedUrl: 'https://s3.amazonaws.com/bucket/file.jpg',
          metadata: metadata,
        );

        expect(result.isSuccess, isTrue);
        expect(result.metadata, equals(metadata));
        expect(result.metadata!['uploadDuration'], equals(1500));
      });

      test('should create failure result with error', () {
        const result = FileUploadResult.failure(
          error: 'Network timeout',
        );

        expect(result.isSuccess, isFalse);
        expect(result.error, equals('Network timeout'));
        expect(result.uploadedUrl, isNull);
        expect(result.metadata, isNull);
      });

      test('should create failure result with metadata', () {
        final metadata = {
          'errorCode': 'NETWORK_ERROR',
          'retryCount': 3,
          'timestamp': '2024-01-01T10:00:00Z',
        };

        final result = FileUploadResult.failure(
          error: 'Upload failed after 3 retries',
          metadata: metadata,
        );

        expect(result.isSuccess, isFalse);
        expect(result.metadata, equals(metadata));
        expect(result.metadata!['retryCount'], equals(3));
      });
    });

    group('Assertion Tests', () {
      test('should enforce uploadedUrl when isSuccess is true', () {
        expect(
          () => FileUploadResult(
            isSuccess: true,
          ),
          throwsA(isA<AssertionError>()),
        );
      });

      test('should enforce error when isSuccess is false', () {
        expect(
          () => FileUploadResult(
            isSuccess: false,
          ),
          throwsA(isA<AssertionError>()),
        );
      });

      test('should allow success with uploadedUrl', () {
        expect(
          () => const FileUploadResult(
            isSuccess: true,
            uploadedUrl: 'https://example.com/file.jpg',
          ),
          returnsNormally,
        );
      });

      test('should allow failure with error', () {
        expect(
          () => const FileUploadResult(
            isSuccess: false,
            error: 'Upload failed',
          ),
          returnsNormally,
        );
      });
    });

    group('Equality', () {
      test('should be equal when all properties match (success)', () {
        const result1 = FileUploadResult.success(
          uploadedUrl: 'https://example.com/file.jpg',
        );

        const result2 = FileUploadResult.success(
          uploadedUrl: 'https://example.com/file.jpg',
        );

        expect(result1, equals(result2));
        expect(result1.hashCode, equals(result2.hashCode));
      });

      test('should be equal when all properties match (failure)', () {
        const result1 = FileUploadResult.failure(
          error: 'Upload failed',
        );

        const result2 = FileUploadResult.failure(
          error: 'Upload failed',
        );

        expect(result1, equals(result2));
        expect(result1.hashCode, equals(result2.hashCode));
      });

      test('should not be equal when uploadedUrl differs', () {
        const result1 = FileUploadResult.success(
          uploadedUrl: 'https://example.com/file1.jpg',
        );

        const result2 = FileUploadResult.success(
          uploadedUrl: 'https://example.com/file2.jpg',
        );

        expect(result1, isNot(equals(result2)));
      });

      test('should not be equal when error differs', () {
        const result1 = FileUploadResult.failure(
          error: 'Network error',
        );

        const result2 = FileUploadResult.failure(
          error: 'Server error',
        );

        expect(result1, isNot(equals(result2)));
      });

      test('should not be equal when metadata differs', () {
        const result1 = FileUploadResult.success(
          uploadedUrl: 'https://example.com/file.jpg',
          metadata: {'key': 'value1'},
        );

        const result2 = FileUploadResult.success(
          uploadedUrl: 'https://example.com/file.jpg',
          metadata: {'key': 'value2'},
        );

        expect(result1, isNot(equals(result2)));
      });
    });

    group('copyWith', () {
      test('should create copy with modified uploadedUrl', () {
        const original = FileUploadResult.success(
          uploadedUrl: 'https://example.com/file1.jpg',
        );

        final copied = original.copyWith(
          uploadedUrl: 'https://example.com/file2.jpg',
        );

        expect(copied.uploadedUrl, equals('https://example.com/file2.jpg'));
        expect(copied.isSuccess, equals(original.isSuccess));
      });

      test('should create copy with modified metadata', () {
        const original = FileUploadResult.success(
          uploadedUrl: 'https://example.com/file.jpg',
        );

        final newMetadata = {'uploadTime': 2000};
        final copied = original.copyWith(metadata: newMetadata);

        expect(copied.metadata, equals(newMetadata));
        expect(copied.uploadedUrl, equals(original.uploadedUrl));
      });

      test('should keep original values when not specified', () {
        const original = FileUploadResult.failure(
          error: 'Upload failed',
          metadata: {'retries': 3},
        );

        final copied = original.copyWith();

        expect(copied.isSuccess, equals(original.isSuccess));
        expect(copied.error, equals(original.error));
        expect(copied.metadata, equals(original.metadata));
      });
    });

    group('toString', () {
      test('should have formatted string for success', () {
        const result = FileUploadResult.success(
          uploadedUrl: 'https://s3.amazonaws.com/bucket/file.jpg',
        );

        final string = result.toString();

        expect(string, contains('FileUploadResult.success'));
        expect(string, contains('https://s3.amazonaws.com/bucket/file.jpg'));
      });

      test('should have formatted string for failure', () {
        const result = FileUploadResult.failure(
          error: 'Network timeout occurred',
        );

        final string = result.toString();

        expect(string, contains('FileUploadResult.failure'));
        expect(string, contains('Network timeout occurred'));
      });
    });

    group('Props', () {
      test('should include all properties in props list (success)', () {
        final metadata = {'key': 'value'};
        final result = FileUploadResult.success(
          uploadedUrl: 'https://example.com/file.jpg',
          metadata: metadata,
        );

        final props = result.props;

        expect(props.length, equals(4));
        expect(props, contains(true));
        expect(props, contains('https://example.com/file.jpg'));
        expect(props, contains(null)); // error
        expect(props, contains(metadata));
      });

      test('should include all properties in props list (failure)', () {
        final metadata = {'errorCode': 500};
        final result = FileUploadResult.failure(
          error: 'Server error',
          metadata: metadata,
        );

        final props = result.props;

        expect(props.length, equals(4));
        expect(props, contains(false));
        expect(props, contains(null)); // uploadedUrl
        expect(props, contains('Server error'));
        expect(props, contains(metadata));
      });
    });

    group('Use Cases', () {
      test('should represent successful S3 upload', () {
        const result = FileUploadResult.success(
          uploadedUrl: 'https://fasih-bucket.s3.amazonaws.com/assignments/001/photo_123.jpg',
          metadata: {
            'uploadDuration': 2500,
            'fileSize': 1024000,
            'assignmentId': 'assignment_001',
            'uploadedAt': '2024-01-01T10:30:00Z',
          },
        );

        expect(result.isSuccess, isTrue);
        expect(result.uploadedUrl, contains('fasih-bucket'));
        expect(result.metadata!['assignmentId'], equals('assignment_001'));
      });

      test('should represent network error failure', () {
        const result = FileUploadResult.failure(
          error: 'Failed to upload: Network connection lost',
          metadata: {
            'errorType': 'NetworkError',
            'retryCount': 3,
            'lastAttempt': '2024-01-01T10:35:00Z',
          },
        );

        expect(result.isSuccess, isFalse);
        expect(result.error, contains('Network connection lost'));
        expect(result.metadata!['retryCount'], equals(3));
      });

      test('should represent S3 pre-signed URL upload', () {
        const result = FileUploadResult.success(
          uploadedUrl: 'https://fasih-media.s3.amazonaws.com/photo.jpg',
          metadata: {
            'uploadMethod': 'pre-signed-url',
            'bucket': 'fasih-media',
            'region': 'ap-southeast-1',
            'checksum': 'md5-abc123',
          },
        );

        expect(result.uploadedUrl, contains('s3.amazonaws.com'));
        expect(result.metadata!['uploadMethod'], equals('pre-signed-url'));
      });

      test('should represent server validation error', () {
        const result = FileUploadResult.failure(
          error: 'File too large: Maximum size is 5MB',
          metadata: {
            'errorCode': 'FILE_TOO_LARGE',
            'maxSize': 5242880,
            'actualSize': 10485760,
          },
        );

        expect(result.error, contains('File too large'));
        expect(result.metadata!['errorCode'], equals('FILE_TOO_LARGE'));
      });

      test('should handle retry logic metadata', () {
        const result = FileUploadResult.failure(
          error: 'Upload failed after maximum retries',
          metadata: {
            'retryCount': 5,
            'maxRetries': 5,
            'backoffStrategy': 'exponential',
            'totalDuration': 15000,
          },
        );

        expect(result.metadata!['retryCount'], equals(5));
        expect(result.metadata!['backoffStrategy'], equals('exponential'));
      });
    });
  });
}
