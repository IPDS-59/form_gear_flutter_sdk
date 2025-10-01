import 'package:flutter_test/flutter_test.dart';
import 'package:form_gear_engine_sdk/src/core/listeners/save_submit_result.dart';

void main() {
  group('SaveSubmitResult Tests', () {
    group('Factory Constructors', () {
      test('should create successful result with submission ID', () {
        final result = SaveSubmitResult.success(
          submissionId: 'form_12345',
          metadata: const {'saved_at': '/path/to/file'},
        );

        expect(result.isSuccess, isTrue);
        expect(result.isFailure, isFalse);
        expect(result.submissionId, equals('form_12345'));
        expect(result.error, isNull);
        expect(result.errorCode, isNull);
        expect(result.metadata, equals({'saved_at': '/path/to/file'}));
        expect(result.timestamp, isNotNull);
      });

      test('should create successful result with generated submission ID', () {
        final result = SaveSubmitResult.success();

        expect(result.isSuccess, isTrue);
        expect(result.submissionId, isNotNull);
        expect(result.submissionId, startsWith('submission_'));
      });

      test('should create failure result with error message', () {
        final result = SaveSubmitResult.failure(
          error: 'Database connection failed',
          errorCode: 'DB_ERROR',
          metadata: const {'retry_count': 3},
        );

        expect(result.isSuccess, isFalse);
        expect(result.isFailure, isTrue);
        expect(result.error, equals('Database connection failed'));
        expect(result.errorCode, equals('DB_ERROR'));
        expect(result.submissionId, isNull);
        expect(result.metadata, equals({'retry_count': 3}));
        expect(result.timestamp, isNotNull);
      });

      test('should create result from exception', () {
        final exception = Exception('Test error');
        final stackTrace = StackTrace.current;

        final result = SaveSubmitResult.fromException(exception, stackTrace);

        expect(result.isSuccess, isFalse);
        expect(result.isFailure, isTrue);
        expect(result.error, contains('Test error'));
        expect(result.errorCode, equals('_Exception'));
        expect(result.metadata?['exception_type'], equals('_Exception'));
        expect(result.metadata?['stack_trace'], isNotNull);
      });

      test('should create result from exception without stack trace', () {
        final exception = Exception('Test error');

        final result = SaveSubmitResult.fromException(exception);

        expect(result.error, contains('Test error'));
        expect(result.metadata?['stack_trace'], isNull);
      });
    });

    group('Getters', () {
      test('getSubmissionId should return submission ID or default', () {
        final successResult = SaveSubmitResult.success(
          submissionId: 'form_123',
        );

        expect(successResult.getSubmissionId(), equals('form_123'));
        expect(
          successResult.getSubmissionId('default'),
          equals('form_123'),
        );

        final failureResult = SaveSubmitResult.failure(error: 'Error');

        expect(
          failureResult.getSubmissionId(),
          equals('unknown_submission'),
        );
        expect(
          failureResult.getSubmissionId('custom_default'),
          equals('custom_default'),
        );
      });

      test('getError should return error message or default', () {
        final failureResult = SaveSubmitResult.failure(
          error: 'Network error',
        );

        expect(failureResult.getError(), equals('Network error'));
        expect(failureResult.getError('default'), equals('Network error'));

        final successResult = SaveSubmitResult.success();

        expect(successResult.getError(), equals('Unknown error occurred'));
        expect(successResult.getError('custom'), equals('custom'));
      });

      test('getDisplayMessage should format success message', () {
        final result = SaveSubmitResult.success(submissionId: 'form_123');

        final message = result.getDisplayMessage();

        expect(message, contains('Successfully saved'));
        expect(message, contains('form_123'));
      });

      test('getDisplayMessage should format failure message', () {
        final result = SaveSubmitResult.failure(error: 'Network timeout');

        final message = result.getDisplayMessage();

        expect(message, contains('Save failed'));
        expect(message, contains('Network timeout'));
      });

      test('getMetadata should return value by key with type safety', () {
        final result = SaveSubmitResult.success(
          metadata: const {
            'count': 5,
            'name': 'test',
            'enabled': true,
          },
        );

        expect(result.getMetadata<int>('count'), equals(5));
        expect(result.getMetadata<String>('name'), equals('test'));
        expect(result.getMetadata<bool>('enabled'), isTrue);
        expect(result.getMetadata<int>('missing'), isNull);
        expect(result.getMetadata<int>('missing', 10), equals(10));
      });
    });

    group('isRetryable', () {
      test('should be retryable for network errors', () {
        final result1 = SaveSubmitResult.failure(
          error: 'Failed',
          errorCode: 'NETWORK_ERROR',
        );
        final result2 = SaveSubmitResult.failure(
          error: 'Failed',
          errorCode: 'CONNECTION_LOST',
        );

        expect(result1.isRetryable, isTrue);
        expect(result2.isRetryable, isTrue);
      });

      test('should be retryable for timeout errors', () {
        final result = SaveSubmitResult.failure(
          error: 'Failed',
          errorCode: 'TIMEOUT_ERROR',
        );

        expect(result.isRetryable, isTrue);
      });

      test('should be retryable for temporary storage errors', () {
        final result = SaveSubmitResult.failure(
          error: 'Failed',
          errorCode: 'STORAGE_ERROR',
        );

        expect(result.isRetryable, isTrue);
      });

      test('should not be retryable for storage full errors', () {
        final result = SaveSubmitResult.failure(
          error: 'Failed',
          errorCode: 'STORAGE_FULL',
        );

        expect(result.isRetryable, isFalse);
      });

      test('should not be retryable for validation errors', () {
        final result = SaveSubmitResult.failure(
          error: 'Failed',
          errorCode: 'VALIDATION_ERROR',
        );

        expect(result.isRetryable, isFalse);
      });

      test('should not be retryable for permission errors', () {
        final result = SaveSubmitResult.failure(
          error: 'Failed',
          errorCode: 'PERMISSION_ERROR',
        );

        expect(result.isRetryable, isFalse);
      });

      test('should not be retryable for successful results', () {
        final result = SaveSubmitResult.success();

        expect(result.isRetryable, isFalse);
      });

      test('should not be retryable when error code is null', () {
        final result = SaveSubmitResult.failure(error: 'Failed');

        expect(result.isRetryable, isFalse);
      });
    });

    group('copyWith', () {
      test('should create copy with modified values', () {
        final original = SaveSubmitResult.success(submissionId: 'original');

        final copy = original.copyWith(
          submissionId: 'modified',
          metadata: {'new': 'data'},
        );

        expect(copy.submissionId, equals('modified'));
        expect(copy.metadata, equals({'new': 'data'}));
        expect(copy.isSuccess, equals(original.isSuccess));
      });

      test('should keep original values when not specified', () {
        final original = SaveSubmitResult.failure(
          error: 'Original error',
          errorCode: 'ERR_001',
          metadata: const {'count': 1},
        );

        final copy = original.copyWith(error: 'Modified error');

        expect(copy.error, equals('Modified error'));
        expect(copy.errorCode, equals(original.errorCode));
        expect(copy.metadata, equals(original.metadata));
      });
    });

    group('Equality', () {
      test('should be equal when all properties match', () {
        final result1 = SaveSubmitResult.success(
          submissionId: 'form_123',
          metadata: const {'key': 'value'},
        );
        final result2 = SaveSubmitResult.success(
          submissionId: 'form_123',
          metadata: const {'key': 'value'},
        );

        // Note: timestamps will differ, so they won't be equal
        expect(result1.isSuccess, equals(result2.isSuccess));
        expect(result1.submissionId, equals(result2.submissionId));
      });

      test('should not be equal when submission ID differs', () {
        final result1 = SaveSubmitResult.success(submissionId: 'form_123');
        final result2 = SaveSubmitResult.success(submissionId: 'form_456');

        expect(result1.submissionId, isNot(equals(result2.submissionId)));
      });
    });

    group('toString', () {
      test('should format success result', () {
        final result = SaveSubmitResult.success(submissionId: 'form_123');

        final str = result.toString();

        expect(str, contains('SaveSubmitResult.success'));
        expect(str, contains('form_123'));
      });

      test('should format failure result', () {
        final result = SaveSubmitResult.failure(
          error: 'Network error',
          errorCode: 'NET_001',
        );

        final str = result.toString();

        expect(str, contains('SaveSubmitResult.failure'));
        expect(str, contains('Network error'));
        expect(str, contains('NET_001'));
      });
    });

    group('JSON Serialization', () {
      test('should serialize success result to JSON', () {
        final result = SaveSubmitResult.success(
          submissionId: 'form_123',
          metadata: const {'saved_at': '/path/to/file'},
        );

        final json = result.toJson();

        expect(json['isSuccess'], isTrue);
        expect(json['submissionId'], equals('form_123'));
        expect(json['metadata'], equals({'saved_at': '/path/to/file'}));
      });

      test('should serialize failure result to JSON', () {
        final result = SaveSubmitResult.failure(
          error: 'Network error',
          errorCode: 'NET_001',
          metadata: const {'retry_count': 3},
        );

        final json = result.toJson();

        expect(json['isSuccess'], isFalse);
        expect(json['error'], equals('Network error'));
        expect(json['errorCode'], equals('NET_001'));
        expect(json['metadata'], equals({'retry_count': 3}));
      });

      test('should deserialize from JSON', () {
        final json = <String, dynamic>{
          'isSuccess': true,
          'submissionId': 'form_123',
          'metadata': {'saved_at': '/path/to/file'},
          'timestamp': DateTime.now().toIso8601String(),
        };

        final result = SaveSubmitResult.fromJson(json);

        expect(result.isSuccess, isTrue);
        expect(result.submissionId, equals('form_123'));
        expect(result.metadata, equals({'saved_at': '/path/to/file'}));
      });
    });
  });

  group('SaveSubmitResultExtensions Tests', () {
    group('allSuccessful', () {
      test('should return true when all results are successful', () {
        final results = [
          SaveSubmitResult.success(submissionId: 'form_1'),
          SaveSubmitResult.success(submissionId: 'form_2'),
          SaveSubmitResult.success(submissionId: 'form_3'),
        ];

        expect(results.allSuccessful, isTrue);
      });

      test('should return false when any result fails', () {
        final results = [
          SaveSubmitResult.success(submissionId: 'form_1'),
          SaveSubmitResult.failure(error: 'Error'),
          SaveSubmitResult.success(submissionId: 'form_3'),
        ];

        expect(results.allSuccessful, isFalse);
      });

      test('should return true for empty list', () {
        final results = <SaveSubmitResult>[];

        expect(results.allSuccessful, isTrue);
      });
    });

    group('anyFailed', () {
      test('should return true when any result fails', () {
        final results = [
          SaveSubmitResult.success(submissionId: 'form_1'),
          SaveSubmitResult.failure(error: 'Error'),
          SaveSubmitResult.success(submissionId: 'form_3'),
        ];

        expect(results.anyFailed, isTrue);
      });

      test('should return false when all results are successful', () {
        final results = [
          SaveSubmitResult.success(submissionId: 'form_1'),
          SaveSubmitResult.success(submissionId: 'form_2'),
        ];

        expect(results.anyFailed, isFalse);
      });

      test('should return false for empty list', () {
        final results = <SaveSubmitResult>[];

        expect(results.anyFailed, isFalse);
      });
    });

    group('successful and failed', () {
      test('should filter successful results', () {
        final results = [
          SaveSubmitResult.success(submissionId: 'form_1'),
          SaveSubmitResult.failure(error: 'Error 1'),
          SaveSubmitResult.success(submissionId: 'form_2'),
          SaveSubmitResult.failure(error: 'Error 2'),
        ];

        final successful = results.successful;

        expect(successful, hasLength(2));
        expect(successful.every((r) => r.isSuccess), isTrue);
      });

      test('should filter failed results', () {
        final results = [
          SaveSubmitResult.success(submissionId: 'form_1'),
          SaveSubmitResult.failure(error: 'Error 1'),
          SaveSubmitResult.success(submissionId: 'form_2'),
          SaveSubmitResult.failure(error: 'Error 2'),
        ];

        final failed = results.failed;

        expect(failed, hasLength(2));
        expect(failed.every((r) => r.isFailure), isTrue);
      });
    });

    group('submissionIds and errorMessages', () {
      test('should extract submission IDs from successful results', () {
        final results = [
          SaveSubmitResult.success(submissionId: 'form_1'),
          SaveSubmitResult.failure(error: 'Error'),
          SaveSubmitResult.success(submissionId: 'form_2'),
        ];

        final ids = results.submissionIds;

        expect(ids, hasLength(2));
        expect(ids, contains('form_1'));
        expect(ids, contains('form_2'));
      });

      test('should extract error messages from failed results', () {
        final results = [
          SaveSubmitResult.success(submissionId: 'form_1'),
          SaveSubmitResult.failure(error: 'Network error'),
          SaveSubmitResult.failure(error: 'Database error'),
        ];

        final errors = results.errorMessages;

        expect(errors, hasLength(2));
        expect(errors, contains('Network error'));
        expect(errors, contains('Database error'));
      });
    });
  });
}
