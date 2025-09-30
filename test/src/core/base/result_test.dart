import 'package:flutter_test/flutter_test.dart';
import 'package:form_gear_engine_sdk/src/core/base/result.dart';

void main() {
  group('Result Pattern Tests', () {
    group('Success', () {
      test('should create Success with data', () {
        const result = Success<int>(42);

        expect(result, isA<Success<int>>());
        expect(result.data, equals(42));
      });

      test('should work with different data types', () {
        const stringResult = Success<String>('test');
        const boolResult = Success<bool>(true);
        const nullableResult = Success<String?>(null);

        expect(stringResult.data, equals('test'));
        expect(boolResult.data, isTrue);
        expect(nullableResult.data, isNull);
      });

      test('should be callable with fold', () {
        const result = Success<int>(100);

        final value = result.fold(
          (error) => -1,
          (data) => data * 2,
        );

        expect(value, equals(200));
      });
    });

    group('Failure', () {
      test('should create Failure with error', () {
        final error = Exception('Test error');
        final result = Failure<int>(error);

        expect(result, isA<Failure<int>>());
        expect(result.error, equals(error));
        expect(result.stackTrace, isNull);
      });

      test('should create Failure with error and stackTrace', () {
        final error = Exception('Test error');
        final stackTrace = StackTrace.current;
        final result = Failure<int>(error, stackTrace);

        expect(result.error, equals(error));
        expect(result.stackTrace, equals(stackTrace));
      });

      test('should work with different error types', () {
        final exceptionResult = Failure<int>(Exception('exception'));
        final errorResult = Failure<int>(Error());
        const stringResult = Failure<int>('string error');

        expect(exceptionResult.error, isA<Exception>());
        expect(errorResult.error, isA<Error>());
        expect(stringResult.error, isA<String>());
      });

      test('should be callable with fold', () {
        final error = Exception('Test error');
        final result = Failure<int>(error);

        final value = result.fold(
          (error) => -1,
          (data) => data * 2,
        );

        expect(value, equals(-1));
      });
    });

    group('fold method', () {
      test('should call onSuccess for Success result', () {
        const result = Success<String>('success');
        var onSuccessCalled = false;
        var onFailureCalled = false;

        result.fold(
          (error) {
            onFailureCalled = true;
            return 'failure';
          },
          (data) {
            onSuccessCalled = true;
            return data;
          },
        );

        expect(onSuccessCalled, isTrue);
        expect(onFailureCalled, isFalse);
      });

      test('should call onFailure for Failure result', () {
        final result = Failure<String>(Exception('error'));
        var onSuccessCalled = false;
        var onFailureCalled = false;

        result.fold(
          (error) {
            onFailureCalled = true;
            return 'failure';
          },
          (data) {
            onSuccessCalled = true;
            return data;
          },
        );

        expect(onSuccessCalled, isFalse);
        expect(onFailureCalled, isTrue);
      });

      test('should transform Success data', () {
        const result = Success<int>(10);

        final transformed = result.fold(
          (error) => 'Error: $error',
          (data) => 'Value: $data',
        );

        expect(transformed, equals('Value: 10'));
      });

      test('should transform Failure error', () {
        final error = Exception('Test error');
        final result = Failure<int>(error);

        final transformed = result.fold(
          (error) => 'Error: $error',
          (data) => 'Value: $data',
        );

        expect(transformed, contains('Error:'));
        expect(transformed, contains('Test error'));
      });
    });

    group('Result type safety', () {
      test('should maintain type safety with generics', () {
        const Result<int> intResult = Success(42);
        const Result<String> stringResult = Success('test');

        expect(intResult, isA<Result<int>>());
        expect(stringResult, isA<Result<String>>());
      });

      test('should work with complex types', () {
        const data = <String, dynamic>{
          'key': 'value',
          'number': 123,
        };
        const result = Success<Map<String, dynamic>>(data);

        expect(result.data['key'], equals('value'));
        expect(result.data['number'], equals(123));
      });
    });
  });
}
