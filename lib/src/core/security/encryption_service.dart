import 'dart:convert';
import 'dart:typed_data';

import 'package:crypto/crypto.dart';
import 'package:encrypt/encrypt.dart';
import 'package:form_gear_engine_sdk/src/core/errors/errors.dart';
import 'package:injectable/injectable.dart';

/// Service for encrypting and decrypting sensitive form data
/// Follows FASIH security requirements for offline data storage
@LazySingleton()
class EncryptionService {
  EncryptionService({String? customKey}) {
    _key = customKey != null ? _deriveKey(customKey) : _defaultKey;
    _encrypter = Encrypter(AES(_key));
  }

  // Default encryption key (should be replaced with device-specific key)
  static final _defaultKey = Key.fromLength(32);

  late final Key _key;
  late final Encrypter _encrypter;

  /// Derives a 256-bit key from a custom string using SHA256
  Key _deriveKey(String customKey) {
    final bytes = utf8.encode(customKey);
    final hash = sha256.convert(bytes);
    return Key(Uint8List.fromList(hash.bytes));
  }

  /// Encrypts sensitive form data (responses, media paths, etc.)
  String encrypt(String plainText) {
    try {
      final iv = IV.fromLength(16); // Use random IV in production
      final encrypted = _encrypter.encrypt(plainText, iv: iv);

      // Prepend IV to encrypted data for decryption
      final combined = '${iv.base64}:${encrypted.base64}';
      return combined;
    } catch (e) {
      throw EncryptionException('Failed to encrypt data: $e');
    }
  }

  /// Decrypts encrypted form data
  String decrypt(String encryptedText) {
    try {
      final parts = encryptedText.split(':');
      if (parts.length != 2) {
        throw const EncryptionException('Invalid encrypted data format');
      }

      final iv = IV.fromBase64(parts[0]);
      final encrypted = Encrypted.fromBase64(parts[1]);

      return _encrypter.decrypt(encrypted, iv: iv);
    } catch (e) {
      throw EncryptionException('Failed to decrypt data: $e');
    }
  }

  /// Encrypts JSON data (form responses, media metadata)
  String encryptJson(Map<String, dynamic> data) {
    final jsonString = jsonEncode(data);
    return encrypt(jsonString);
  }

  /// Decrypts JSON data
  Map<String, dynamic> decryptJson(String encryptedText) {
    final jsonString = decrypt(encryptedText);
    return jsonDecode(jsonString) as Map<String, dynamic>;
  }

  /// Hashes sensitive data for comparison (one-way)
  String hash(String data) {
    final bytes = utf8.encode(data);
    final digest = sha256.convert(bytes);
    return digest.toString();
  }

  /// Verifies if data matches a hash
  bool verifyHash(String data, String hash) {
    return this.hash(data) == hash;
  }
}
