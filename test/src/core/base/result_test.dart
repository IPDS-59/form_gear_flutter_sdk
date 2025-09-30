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

    group('ResultExtension - isSuccess/isFailure', () {
      test('should identify success result', () {
        const result = Success<int>(42);

        expect(result.isSuccess, isTrue);
        expect(result.isFailure, isFalse);
      });

      test('should identify failure result', () {
        final result = Failure<int>(Exception('Error'));

        expect(result.isFailure, isTrue);
        expect(result.isSuccess, isFalse);
      });
    });

    group('ResultExtension - dataOrNull', () {
      test('should return data for success', () {
        const result = Success<int>(42);

        expect(result.dataOrNull, equals(42));
      });

      test('should return null for failure', () {
        final result = Failure<int>(Exception('Error'));

        expect(result.dataOrNull, isNull);
      });

      test('should return null data if success contains null', () {
        const result = Success<String?>(null);

        expect(result.dataOrNull, isNull);
      });
    });

    group('ResultExtension - errorOrNull', () {
      test('should return null for success', () {
        const result = Success<int>(42);

        expect(result.errorOrNull, isNull);
      });

      test('should return error for failure', () {
        final error = Exception('Test error');
        final result = Failure<int>(error);

        expect(result.errorOrNull, equals(error));
      });
    });

    group('ResultExtension - onSuccess', () {
      test('should execute callback for success', () {
        const result = Success<int>(42);
        var callbackExecuted = false;
        var capturedData = 0;

        result.onSuccess((data) {
          callbackExecuted = true;
          capturedData = data;
        });

        expect(callbackExecuted, isTrue);
        expect(capturedData, equals(42));
      });

      test('should not execute callback for failure', () {
        final result = Failure<int>(Exception('Error'));
        var callbackExecuted = false;

        result.onSuccess((data) {
          callbackExecuted = true;
        });

        expect(callbackExecuted, isFalse);
      });

      test('should return the same result for chaining', () {
        const result = Success<int>(42);

        final returned = result.onSuccess((data) {});

        expect(returned, equals(result));
      });
    });

    group('ResultExtension - onFailure', () {
      test('should execute callback for failure', () {
        final error = Exception('Test error');
        final result = Failure<int>(error);
        var callbackExecuted = false;
        Object? capturedError;

        result.onFailure((err) {
          callbackExecuted = true;
          capturedError = err;
        });

        expect(callbackExecuted, isTrue);
        expect(capturedError, equals(error));
      });

      test('should not execute callback for success', () {
        const result = Success<int>(42);
        var callbackExecuted = false;

        result.onFailure((error) {
          callbackExecuted = true;
        });

        expect(callbackExecuted, isFalse);
      });

      test('should return the same result for chaining', () {
        final error = Exception('Error');
        final result = Failure<int>(error);

        final returned = result.onFailure((err) {});

        expect(returned, equals(result));
      });
    });

    group('ResultExtension - map', () {
      test('should map success data', () {
        const result = Success<int>(42);

        final mapped = result.map((data) => data * 2);

        expect(mapped, isA<Success<int>>());
        expect(mapped.dataOrNull, equals(84));
      });

      test('should map to different type', () {
        const result = Success<int>(42);

        final mapped = result.map((data) => 'Number: $data');

        expect(mapped, isA<Success<String>>());
        expect(mapped.dataOrNull, equals('Number: 42'));
      });

      test('should preserve failure with stackTrace', () {
        final error = Exception('Test error');
        final stackTrace = StackTrace.current;
        final result = Failure<int>(error, stackTrace);

        final mapped = result.map((data) => data * 2);

        expect(mapped, isA<Failure<int>>());
        expect(mapped.errorOrNull, equals(error));
        expect((mapped as Failure<int>).stackTrace, equals(stackTrace));
      });
    });

    group('ResultExtension - flatMap', () {
      test('should flat map success to success', () {
        const result = Success<int>(42);

        final flatMapped = result.flatMap((data) => Success(data * 2));

        expect(flatMapped, isA<Success<int>>());
        expect(flatMapped.dataOrNull, equals(84));
      });

      test('should flat map success to failure', () {
        const result = Success<int>(42);

        final flatMapped = result.flatMap(
          (data) => Failure<int>(Exception('Validation failed')),
        );

        expect(flatMapped, isA<Failure<int>>());
        expect(
          flatMapped.errorOrNull.toString(),
          contains('Validation failed'),
        );
      });

      test('should preserve failure with stackTrace', () {
        final error = Exception('Original error');
        final stackTrace = StackTrace.current;
        final result = Failure<int>(error, stackTrace);

        final flatMapped = result.flatMap((data) => Success(data * 2));

        expect(flatMapped, isA<Failure<int>>());
        expect(flatMapped.errorOrNull, equals(error));
        expect((flatMapped as Failure<int>).stackTrace, equals(stackTrace));
      });

      test('should support chaining operations', () {
        const result = Success<int>(10);

        final chained = result
            .flatMap((data) => Success(data * 2))
            .flatMap((data) => Success(data + 5))
            .flatMap((data) => Success('Result: $data'));

        expect(chained, isA<Success<String>>());
        expect(chained.dataOrNull, equals('Result: 25'));
      });
    });

    group('ResultExtension - Combined Operations', () {
      test('should support combined onSuccess and map', () {
        const result = Success<int>(42);
        var sideEffectExecuted = false;

        final mapped = result
            .onSuccess((data) => sideEffectExecuted = true)
            .map((data) => data.toString());

        expect(sideEffectExecuted, isTrue);
        expect(mapped.dataOrNull, equals('42'));
      });

      test('should support combined onFailure and map', () {
        final result = Failure<int>(Exception('Error'));
        var sideEffectExecuted = false;

        final mapped = result
            .onFailure((error) => sideEffectExecuted = true)
            .map((data) => data.toString());

        expect(sideEffectExecuted, isTrue);
        expect(mapped.errorOrNull.toString(), contains('Error'));
      });

      test('should handle complex workflow chains', () {
        const result = Success<int>(10);

        final output = result
            .map((data) => data * 2)
            .onSuccess((data) => {})
            .flatMap((data) => Success(data + 5))
            .fold(
              (error) => 'Failed',
              (data) => 'Result is $data',
            );

        expect(output, equals('Result is 25'));
      });
    });

    group('Real-world Scenarios', () {
      test('should handle validation chain', () {
        Result<int> validateAge(int age) {
          if (age < 0) return const Failure('Age cannot be negative');
          if (age > 150) return const Failure('Age cannot exceed 150');
          return Success(age);
        }

        Result<String> categorizeAge(int age) {
          if (age < 18) return const Success('Minor');
          if (age < 65) return const Success('Adult');
          return const Success('Senior');
        }

        final result1 = validateAge(25).flatMap(categorizeAge);
        final result2 = validateAge(-5).flatMap(categorizeAge);
        final result3 = validateAge(70).flatMap(categorizeAge);

        expect(result1.dataOrNull, equals('Adult'));
        expect(result2.errorOrNull, equals('Age cannot be negative'));
        expect(result3.dataOrNull, equals('Senior'));
      });

      test('should handle API response transformation', () {
        final apiResult = Success<Map<String, dynamic>>({
          'userId': 123,
          'name': 'John Doe',
          'email': 'john@example.com',
        });

        final userName = apiResult
            .map((data) => data['name'] as String?)
            .fold(
              (error) => 'Unknown User',
              (name) => name ?? 'No Name',
            );

        expect(userName, equals('John Doe'));
      });

      test('should handle form submission workflow', () {
        Result<String> validateEmail(String email) {
          if (!email.contains('@')) {
            return const Failure('Invalid email format');
          }
          return Success(email);
        }

        Result<Map<String, String>> createUser(String email) {
          return Success({
            'email': email,
            'id': 'user_123',
            'status': 'created',
          });
        }

        final workflow1 = validateEmail('test@example.com').flatMap(createUser);

        final workflow2 = validateEmail('invalid-email').flatMap(createUser);

        expect(workflow1.isSuccess, isTrue);
        expect(workflow1.dataOrNull?['id'], equals('user_123'));
        expect(workflow2.isFailure, isTrue);
        expect(workflow2.errorOrNull, equals('Invalid email format'));
      });
    });
  });
}
