import 'package:flutter_test/flutter_test.dart';
import 'package:form_gear_engine_sdk/src/utils/encryption_utils.dart';

void main() {
  group('EncryptionUtils Tests', () {
    group('Basic Encryption/Decryption', () {
      test('should encrypt non-empty string', () {
        const data = 'sensitive information';
        final encrypted = EncryptionUtils.encryptData(data);

        expect(encrypted, isNotEmpty);
        expect(encrypted, isNot(equals(data)));
      });

      test('should return empty string when encrypting empty string', () {
        const data = '';
        final encrypted = EncryptionUtils.encryptData(data);

        expect(encrypted, isEmpty);
      });

      test('should decrypt encrypted data back to original', () {
        const original = 'test data 123';
        final encrypted = EncryptionUtils.encryptData(original);
        final decrypted = EncryptionUtils.decryptData(encrypted);

        expect(decrypted, equals(original));
      });

      test('should handle encryption with custom key', () {
        const data = 'custom key test';
        const customKey = 'my-secret-key-123';

        final encrypted = EncryptionUtils.encryptData(data, key: customKey);
        final decrypted = EncryptionUtils.decryptData(
          encrypted,
          key: customKey,
        );

        expect(decrypted, equals(data));
      });

      test('should fail to decrypt with wrong key', () {
        const data = 'secret message';
        const key1 = 'key-1';
        const key2 = 'key-2';

        final encrypted = EncryptionUtils.encryptData(data, key: key1);
        final decrypted = EncryptionUtils.decryptData(encrypted, key: key2);

        expect(decrypted, isNot(equals(data)));
      });

      test('should handle decryption of empty string', () {
        final decrypted = EncryptionUtils.decryptData('');

        expect(decrypted, isEmpty);
      });

      test('should handle unencrypted data prefix', () {
        const data = 'test data';
        const unencrypted = 'UNENCRYPTED:$data';

        final decrypted = EncryptionUtils.decryptData(unencrypted);

        expect(decrypted, equals(data));
      });

      test('should return original data if decryption fails', () {
        const invalidEncrypted = 'not-base64-data';
        final decrypted = EncryptionUtils.decryptData(invalidEncrypted);

        expect(decrypted, equals(invalidEncrypted));
      });
    });

    group('Hash Generation and Verification', () {
      test('should generate hash for data', () {
        const data = 'test data for hashing';
        final hash = EncryptionUtils.generateHash(data);

        expect(hash, isNotEmpty);
        expect(hash.length, equals(64)); // SHA256 produces 64 char hex string
      });

      test('should generate consistent hash for same data', () {
        const data = 'consistent data';
        final hash1 = EncryptionUtils.generateHash(data);
        final hash2 = EncryptionUtils.generateHash(data);

        expect(hash1, equals(hash2));
      });

      test('should generate different hashes for different data', () {
        const data1 = 'data one';
        const data2 = 'data two';

        final hash1 = EncryptionUtils.generateHash(data1);
        final hash2 = EncryptionUtils.generateHash(data2);

        expect(hash1, isNot(equals(hash2)));
      });

      test('should verify correct hash', () {
        const data = 'verify me';
        final hash = EncryptionUtils.generateHash(data);
        final isValid = EncryptionUtils.verifyHash(data, hash);

        expect(isValid, isTrue);
      });

      test('should reject incorrect hash', () {
        const data = 'test data';
        const wrongHash = 'wrong-hash-value';

        final isValid = EncryptionUtils.verifyHash(data, wrongHash);

        expect(isValid, isFalse);
      });

      test('should handle empty data hashing', () {
        final hash = EncryptionUtils.generateHash('');

        expect(hash, isNotEmpty);
      });
    });

    group('Form Data Encryption', () {
      test('should encrypt sensitive fields in form data', () {
        final formData = <String, dynamic>{
          'name': 'John Doe',
          'age': 30,
          'email': 'john@example.com',
          'city': 'Jakarta',
        };

        final encrypted = EncryptionUtils.encryptFormData(
          formData,
          sensitiveFields: ['name', 'email'],
        );

        expect(encrypted['name'], isNot(equals('John Doe')));
        expect(encrypted['email'], isNot(equals('john@example.com')));
        expect(encrypted['age'], equals(30)); // Non-sensitive field unchanged
        expect(encrypted['city'], equals('Jakarta'));
        expect(encrypted['_encryption'], isNotNull);
      });

      test('should add encryption metadata', () {
        final formData = <String, dynamic>{'name': 'Test'};

        final encrypted = EncryptionUtils.encryptFormData(formData);

        expect(encrypted['_encryption'], isNotNull);
        expect(encrypted['_encryption']['encrypted'], isTrue);
        expect(encrypted['_encryption']['algorithm'], equals('XOR_SHA256'));
        expect(encrypted['_encryption']['version'], equals('1.0.0'));
        expect(encrypted['_encryption']['timestamp'], isNotNull);
      });

      test('should handle nested objects in form data', () {
        final formData = <String, dynamic>{
          'personal': <String, dynamic>{
            'name': 'Jane Doe',
            'email': 'jane@example.com',
          },
          'age': 25,
        };

        final encrypted = EncryptionUtils.encryptFormData(
          formData,
          sensitiveFields: ['personal'],
        );

        expect(encrypted['personal'], isA<Map<String, dynamic>>());
        expect(encrypted['age'], equals(25));
      });

      test('should handle default sensitive fields', () {
        final formData = <String, dynamic>{
          'name': 'Test User',
          'phone': '08123456789',
          'nik': '1234567890123456',
          'randomField': 'Not sensitive',
        };

        final encrypted = EncryptionUtils.encryptFormData(formData);

        expect(encrypted['name'], isNot(equals('Test User')));
        expect(encrypted['phone'], isNot(equals('08123456789')));
        expect(encrypted['nik'], isNot(equals('1234567890123456')));
        expect(encrypted['randomField'], equals('Not sensitive'));
      });

      test('should encrypt with custom encryption key', () {
        final formData = <String, dynamic>{'name': 'Secure Name'};
        const customKey = 'custom-encryption-key';

        final encrypted = EncryptionUtils.encryptFormData(
          formData,
          encryptionKey: customKey,
        );

        expect(encrypted['name'], isNot(equals('Secure Name')));
        expect(encrypted['_encryption'], isNotNull);
      });

      test('should handle non-string sensitive field values', () {
        final formData = <String, dynamic>{
          'name': 123, // Number instead of string
          'email': true, // Boolean instead of string
        };

        final encrypted = EncryptionUtils.encryptFormData(formData);

        expect(encrypted['name'], equals(123)); // Should remain unchanged
        expect(encrypted['email'], equals(true)); // Should remain unchanged
      });
    });

    group('Form Data Decryption', () {
      test('should decrypt encrypted form data', () {
        final original = <String, dynamic>{
          'name': 'John Doe',
          'age': 30,
          'email': 'john@example.com',
        };

        final encrypted = EncryptionUtils.encryptFormData(original);
        final decrypted = EncryptionUtils.decryptFormData(encrypted);

        expect(decrypted['name'], equals('John Doe'));
        expect(decrypted['age'], equals(30));
        expect(decrypted['email'], equals('john@example.com'));
        expect(decrypted.containsKey('_encryption'), isFalse);
      });

      test('should return unencrypted data as-is', () {
        final unencrypted = <String, dynamic>{
          'name': 'Plain Text',
          'age': 25,
        };

        final result = EncryptionUtils.decryptFormData(unencrypted);

        expect(result, equals(unencrypted));
      });

      test('should decrypt with custom key', () {
        final original = <String, dynamic>{'secret': 'confidential'};
        const key = 'my-custom-key';

        final encrypted = EncryptionUtils.encryptFormData(
          original,
          encryptionKey: key,
        );
        final decrypted = EncryptionUtils.decryptFormData(
          encrypted,
          encryptionKey: key,
        );

        expect(decrypted['secret'], equals('confidential'));
      });

      test('should handle nested encrypted objects', () {
        final original = <String, dynamic>{
          'personal': <String, dynamic>{
            'name': 'Jane Doe',
            'email': 'jane@example.com',
          },
        };

        final encrypted = EncryptionUtils.encryptFormData(
          original,
          sensitiveFields: ['personal'],
        );
        final decrypted = EncryptionUtils.decryptFormData(encrypted);

        expect(decrypted['personal'], isA<Map<String, dynamic>>());
      });

      test('should handle empty encrypted data', () {
        final encrypted = <String, dynamic>{};
        final decrypted = EncryptionUtils.decryptFormData(encrypted);

        expect(decrypted, isEmpty);
      });
    });

    group('Secure Key Generation', () {
      test('should generate secure key with default length', () {
        final key = EncryptionUtils.generateSecureKey();

        expect(key, isNotEmpty);
        expect(key.length, equals(32));
      });

      test('should generate secure key with custom length', () {
        final key = EncryptionUtils.generateSecureKey(length: 64);

        expect(key.length, equals(64));
      });

      test('should generate different keys each time', () {
        final key1 = EncryptionUtils.generateSecureKey();
        final key2 = EncryptionUtils.generateSecureKey();

        expect(key1, isNot(equals(key2)));
      });

      test('should generate key with alphanumeric characters only', () {
        final key = EncryptionUtils.generateSecureKey();
        final alphanumericRegex = RegExp(r'^[a-zA-Z0-9]+$');

        expect(alphanumericRegex.hasMatch(key), isTrue);
      });

      test('should generate very short key', () {
        final key = EncryptionUtils.generateSecureKey(length: 1);

        expect(key.length, equals(1));
      });

      test('should generate very long key', () {
        final key = EncryptionUtils.generateSecureKey(length: 256);

        expect(key.length, equals(256));
      });
    });

    group('Encryption Requirements Check', () {
      test('should detect encryption requirement with isEncrypt flag', () {
        final config = <String, dynamic>{'isEncrypt': true};

        expect(EncryptionUtils.requiresEncryption(config), isTrue);
      });

      test('should detect encryption requirement with encryption flag', () {
        final config = <String, dynamic>{'encryption': true};

        expect(EncryptionUtils.requiresEncryption(config), isTrue);
      });

      test('should detect encryption requirement with sensitive flag', () {
        final config = <String, dynamic>{'sensitive': true};

        expect(EncryptionUtils.requiresEncryption(config), isTrue);
      });

      test('should return false when no encryption flags are set', () {
        final config = <String, dynamic>{'someOtherFlag': true};

        expect(EncryptionUtils.requiresEncryption(config), isFalse);
      });

      test('should return false when encryption flags are false', () {
        final config = <String, dynamic>{
          'isEncrypt': false,
          'encryption': false,
          'sensitive': false,
        };

        expect(EncryptionUtils.requiresEncryption(config), isFalse);
      });

      test('should handle empty config', () {
        final config = <String, dynamic>{};

        expect(EncryptionUtils.requiresEncryption(config), isFalse);
      });
    });

    group('Edge Cases and Special Characters', () {
      test('should handle special characters in data', () {
        const data = 'Special: !@#\$%^&*()_+-={}[]|\\:";\'<>?,./';
        final encrypted = EncryptionUtils.encryptData(data);
        final decrypted = EncryptionUtils.decryptData(encrypted);

        expect(decrypted, equals(data));
      });

      test('should handle unicode characters', () {
        const data = '你好世界 🌍 مرحبا بالعالم';
        final encrypted = EncryptionUtils.encryptData(data);
        final decrypted = EncryptionUtils.decryptData(encrypted);

        expect(decrypted, equals(data));
      });

      test('should handle very long strings', () {
        final longData = 'A' * 10000;
        final encrypted = EncryptionUtils.encryptData(longData);
        final decrypted = EncryptionUtils.decryptData(encrypted);

        expect(decrypted, equals(longData));
      });

      test('should handle newlines and tabs', () {
        const data = 'Line 1\nLine 2\tTabbed';
        final encrypted = EncryptionUtils.encryptData(data);
        final decrypted = EncryptionUtils.decryptData(encrypted);

        expect(decrypted, equals(data));
      });

      test('should handle data with colons (salt separator)', () {
        const data = 'data:with:many:colons:in:it';
        final encrypted = EncryptionUtils.encryptData(data);
        final decrypted = EncryptionUtils.decryptData(encrypted);

        expect(decrypted, equals(data));
      });
    });

    group('Round-trip Encryption', () {
      test('should maintain data integrity through encrypt-decrypt cycle', () {
        final testCases = [
          'simple text',
          '123456789',
          'email@example.com',
          '{"json": "data"}',
          'NIK:1234567890123456',
        ];

        for (final testCase in testCases) {
          final encrypted = EncryptionUtils.encryptData(testCase);
          final decrypted = EncryptionUtils.decryptData(encrypted);
          expect(decrypted, equals(testCase), reason: 'Failed for: $testCase');
        }
      });

      test('should handle full form data round-trip', () {
        final original = <String, dynamic>{
          'name': 'John Doe',
          'nik': '1234567890123456',
          'phone': '08123456789',
          'email': 'john@example.com',
          'address': 'Jl. Test No. 123',
          'age': 30,
          'married': true,
        };

        final encrypted = EncryptionUtils.encryptFormData(original);
        final decrypted = EncryptionUtils.decryptFormData(encrypted);

        expect(decrypted['name'], equals(original['name']));
        expect(decrypted['nik'], equals(original['nik']));
        expect(decrypted['phone'], equals(original['phone']));
        expect(decrypted['email'], equals(original['email']));
        expect(decrypted['address'], equals(original['address']));
        expect(decrypted['age'], equals(original['age']));
        expect(decrypted['married'], equals(original['married']));
      });
    });
  });
}
