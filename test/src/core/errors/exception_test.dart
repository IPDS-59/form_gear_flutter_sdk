import 'package:flutter_test/flutter_test.dart';
import 'package:form_gear_engine_sdk/src/core/errors/compression_exception.dart';
import 'package:form_gear_engine_sdk/src/core/errors/encryption_exception.dart';

void main() {
  group('CompressionException Tests', () {
    test('should create exception with message', () {
      const exception = CompressionException('Failed to compress data');

      expect(exception.message, equals('Failed to compress data'));
    });

    test('should implement Exception interface', () {
      const exception = CompressionException('Test');

      expect(exception, isA<Exception>());
    });

    test('should have formatted toString output', () {
      const exception = CompressionException('Compression failed');

      expect(
        exception.toString(),
        equals('CompressionException: Compression failed'),
      );
    });

    test('should handle empty message', () {
      const exception = CompressionException('');

      expect(exception.message, isEmpty);
      expect(exception.toString(), equals('CompressionException: '));
    });

    test('should handle long error messages', () {
      const longMessage =
          'This is a very long error message that describes '
          'in detail what went wrong during the compression process and '
          'provides helpful context for debugging the issue';
      const exception = CompressionException(longMessage);

      expect(exception.message, equals(longMessage));
      expect(exception.toString(), contains(longMessage));
    });

    test('should handle special characters in message', () {
      const exception = CompressionException('Error: 100% failed!\n\tDetails');

      expect(exception.message, contains('100%'));
      expect(exception.toString(), contains('\n\t'));
    });

    test('should be throwable', () {
      expect(
        () => throw const CompressionException('Test error'),
        throwsA(isA<CompressionException>()),
      );
    });

    test('should be catchable as Exception', () {
      try {
        throw const CompressionException('Test error');
      } on Exception catch (e) {
        expect(e, isA<CompressionException>());
        expect((e as CompressionException).message, equals('Test error'));
      }
    });
  });

  group('EncryptionException Tests', () {
    test('should create exception with message', () {
      const exception = EncryptionException('Failed to encrypt data');

      expect(exception.message, equals('Failed to encrypt data'));
    });

    test('should implement Exception interface', () {
      const exception = EncryptionException('Test');

      expect(exception, isA<Exception>());
    });

    test('should have formatted toString output', () {
      const exception = EncryptionException('Encryption failed');

      expect(
        exception.toString(),
        equals('EncryptionException: Encryption failed'),
      );
    });

    test('should handle empty message', () {
      const exception = EncryptionException('');

      expect(exception.message, isEmpty);
      expect(exception.toString(), equals('EncryptionException: '));
    });

    test('should handle long error messages', () {
      const longMessage =
          'This is a very long error message that describes '
          'in detail what went wrong during the encryption process and '
          'provides helpful context for debugging the issue';
      const exception = EncryptionException(longMessage);

      expect(exception.message, equals(longMessage));
      expect(exception.toString(), contains(longMessage));
    });

    test('should handle special characters in message', () {
      const exception = EncryptionException('Error: 100% failed!\n\tDetails');

      expect(exception.message, contains('100%'));
      expect(exception.toString(), contains('\n\t'));
    });

    test('should be throwable', () {
      expect(
        () => throw const EncryptionException('Test error'),
        throwsA(isA<EncryptionException>()),
      );
    });

    test('should be catchable as Exception', () {
      try {
        throw const EncryptionException('Test error');
      } on Exception catch (e) {
        expect(e, isA<EncryptionException>());
        expect((e as EncryptionException).message, equals('Test error'));
      }
    });

    test('should be distinguishable from CompressionException', () {
      const encryptionEx = EncryptionException('Encryption error');
      const compressionEx = CompressionException('Compression error');

      expect(encryptionEx, isNot(isA<CompressionException>()));
      expect(compressionEx, isNot(isA<EncryptionException>()));
    });
  });

  group('Exception Interoperability', () {
    test('should handle both exception types in same try-catch', () {
      void throwRandomException(bool throwEncryption) {
        if (throwEncryption) {
          throw const EncryptionException('Encryption failed');
        } else {
          throw const CompressionException('Compression failed');
        }
      }

      expect(
        () => throwRandomException(true),
        throwsA(isA<EncryptionException>()),
      );
      expect(
        () => throwRandomException(false),
        throwsA(isA<CompressionException>()),
      );
    });

    test('should be catchable with specific exception types', () {
      var caughtType = '';

      try {
        throw const EncryptionException('Test');
      } on EncryptionException {
        caughtType = 'encryption';
      } on CompressionException {
        caughtType = 'compression';
      }

      expect(caughtType, equals('encryption'));
    });
  });
}
