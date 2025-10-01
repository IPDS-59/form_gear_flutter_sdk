import 'package:flutter_test/flutter_test.dart';
import 'package:form_gear_engine_sdk/src/core/base/failure.dart';

void main() {
  group('Failure Types Tests', () {
    group('ServerFailure', () {
      test('should create ServerFailure with message', () {
        const failure = ServerFailure('Server error');

        expect(failure, isA<AppFailure>());
        expect(failure.message, equals('Server error'));
        expect(failure.code, isNull);
      });

      test('should create ServerFailure with message and code', () {
        const failure = ServerFailure('Server error', '500');

        expect(failure.message, equals('Server error'));
        expect(failure.code, equals('500'));
      });

      test('should have consistent toString', () {
        const failure = ServerFailure('Test error', '503');

        expect(
          failure.toString(),
          contains('message: Test error'),
        );
      });
    });

    group('CacheFailure', () {
      test('should create CacheFailure with message', () {
        const failure = CacheFailure('Cache error');

        expect(failure, isA<AppFailure>());
        expect(failure.message, equals('Cache error'));
        expect(failure.code, isNull);
      });

      test('should create CacheFailure with message and code', () {
        const failure = CacheFailure('Cache error', 'CACHE_001');

        expect(failure.message, equals('Cache error'));
        expect(failure.code, equals('CACHE_001'));
      });
    });

    group('NetworkFailure', () {
      test('should create NetworkFailure with message', () {
        const failure = NetworkFailure('Network error');

        expect(failure, isA<AppFailure>());
        expect(failure.message, equals('Network error'));
        expect(failure.code, isNull);
      });

      test('should create NetworkFailure with message and code', () {
        const failure = NetworkFailure('Network error', 'NET_001');

        expect(failure.message, equals('Network error'));
        expect(failure.code, equals('NET_001'));
      });
    });

    group('DataFailure', () {
      test('should create DataFailure with message', () {
        const failure = DataFailure('Parsing error');

        expect(failure, isA<AppFailure>());
        expect(failure.message, equals('Parsing error'));
        expect(failure.code, isNull);
      });

      test('should create DataFailure with message and code', () {
        const failure = DataFailure('Parsing error', 'PARSE_001');

        expect(failure.message, equals('Parsing error'));
        expect(failure.code, equals('PARSE_001'));
      });
    });

    group('ClientFailure', () {
      test('should create ClientFailure with message', () {
        const failure = ClientFailure('Bad request');

        expect(failure, isA<AppFailure>());
        expect(failure.message, equals('Bad request'));
        expect(failure.code, isNull);
      });

      test('should create ClientFailure with message and code', () {
        const failure = ClientFailure('Not found', '404');

        expect(failure.message, equals('Not found'));
        expect(failure.code, equals('404'));
      });
    });

    group('AuthFailure', () {
      test('should create AuthFailure with message', () {
        const failure = AuthFailure('Unauthorized');

        expect(failure, isA<AppFailure>());
        expect(failure.message, equals('Unauthorized'));
        expect(failure.code, isNull);
      });

      test('should create AuthFailure with message and code', () {
        const failure = AuthFailure('Token expired', 'AUTH_001');

        expect(failure.message, equals('Token expired'));
        expect(failure.code, equals('AUTH_001'));
      });
    });

    group('UnknownFailure', () {
      test('should create UnknownFailure with message', () {
        const failure = UnknownFailure('Unknown error');

        expect(failure, isA<AppFailure>());
        expect(failure.message, equals('Unknown error'));
        expect(failure.code, isNull);
      });

      test('should create UnknownFailure with message and code', () {
        const failure = UnknownFailure('Unexpected error', 'UNKNOWN');

        expect(failure.message, equals('Unexpected error'));
        expect(failure.code, equals('UNKNOWN'));
      });
    });

    group('Failure implements Exception', () {
      test('ServerFailure should implement Exception', () {
        const failure = ServerFailure('Test');

        expect(failure, isA<Exception>());
      });

      test('NetworkFailure should implement Exception', () {
        const failure = NetworkFailure('Test');

        expect(failure, isA<Exception>());
      });

      test('DataFailure should implement Exception', () {
        const failure = DataFailure('Test');

        expect(failure, isA<Exception>());
      });
    });
  });
}
