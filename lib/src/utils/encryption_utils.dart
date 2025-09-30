import 'dart:convert';
import 'dart:math';
import 'dart:typed_data';

import 'package:crypto/crypto.dart';

/// Utility class for encrypting and decrypting sensitive FASIH data
/// Provides basic encryption for form data, user information, and file content
class EncryptionUtils {
  static const String _defaultSalt = 'FASIH_BPS_SALT_2024';

  /// Encrypts sensitive string data using base64 encoding with salt
  /// For basic protection of PII and form responses
  static String encryptData(String data, {String? key}) {
    if (data.isEmpty) return data;

    try {
      final actualKey = key ?? _generateDefaultKey();
      final saltedData =
          '$_defaultSalt:$data:${DateTime.now().millisecondsSinceEpoch}';
      final bytes = utf8.encode(saltedData);
      final digest = sha256.convert(utf8.encode(actualKey));

      // Simple XOR encryption with key digest
      final encrypted = Uint8List.fromList(bytes);
      final keyBytes = digest.bytes;

      for (var i = 0; i < encrypted.length; i++) {
        encrypted[i] ^= keyBytes[i % keyBytes.length];
      }

      return base64.encode(encrypted);
    } on Exception {
      // If encryption fails, return original data with warning prefix
      return 'UNENCRYPTED:$data';
    }
  }

  /// Decrypts sensitive string data from base64 encoding
  /// Returns original data if decryption fails
  static String decryptData(String encryptedData, {String? key}) {
    if (encryptedData.isEmpty) return encryptedData;

    // Handle unencrypted data
    if (encryptedData.startsWith('UNENCRYPTED:')) {
      return encryptedData.substring(12);
    }

    try {
      final actualKey = key ?? _generateDefaultKey();
      final encrypted = base64.decode(encryptedData);
      final digest = sha256.convert(utf8.encode(actualKey));
      final keyBytes = digest.bytes;

      // XOR decryption
      final decrypted = Uint8List.fromList(encrypted);
      for (var i = 0; i < decrypted.length; i++) {
        decrypted[i] ^= keyBytes[i % keyBytes.length];
      }

      final saltedData = utf8.decode(decrypted);

      // Extract original data between salt markers
      final parts = saltedData.split(':');
      if (parts.length >= 3 && parts[0] == _defaultSalt) {
        // Reconstruct data by joining all parts except salt and timestamp
        return parts.sublist(1, parts.length - 1).join(':');
      }

      return saltedData;
    } on Exception {
      // If decryption fails, return original data
      return encryptedData;
    }
  }

  /// Generates a hash for data integrity verification
  static String generateHash(String data) {
    try {
      final bytes = utf8.encode(data);
      final digest = sha256.convert(bytes);
      return digest.toString();
    } on Exception {
      return '';
    }
  }

  /// Verifies data integrity using hash
  static bool verifyHash(String data, String hash) {
    return generateHash(data) == hash;
  }

  /// Encrypts JSON data for form responses
  static Map<String, dynamic> encryptFormData(
    Map<String, dynamic> formData, {
    String? encryptionKey,
    List<String> sensitiveFields = const [
      'name',
      'phone',
      'email',
      'address',
      'nik',
      'ktp',
      'identity',
      'personal',
      'contact',
      'narasumber',
    ],
  }) {
    final encrypted = Map<String, dynamic>.from(formData);

    for (final field in sensitiveFields) {
      if (encrypted.containsKey(field) && encrypted[field] is String) {
        encrypted[field] = encryptData(
          encrypted[field] as String,
          key: encryptionKey,
        );
      }

      // Handle nested objects
      if (encrypted.containsKey(field) && encrypted[field] is Map) {
        final nestedData = encrypted[field] as Map<String, dynamic>;
        encrypted[field] = _encryptNestedData(nestedData, encryptionKey);
      }
    }

    // Add encryption metadata
    encrypted['_encryption'] = {
      'encrypted': true,
      'timestamp': DateTime.now().toIso8601String(),
      'algorithm': 'XOR_SHA256',
      'version': '1.0.0',
    };

    return encrypted;
  }

  /// Decrypts JSON data for form responses
  static Map<String, dynamic> decryptFormData(
    Map<String, dynamic> encryptedData, {
    String? encryptionKey,
  }) {
    if (encryptedData['_encryption'] == null) {
      // Data is not encrypted
      return encryptedData;
    }

    final decrypted = Map<String, dynamic>.from(encryptedData);

    // Remove encryption metadata
    decrypted.remove('_encryption');

    // Find and decrypt encrypted fields
    for (final entry in decrypted.entries) {
      if (entry.value is String &&
          (entry.value as String).isNotEmpty &&
          _isBase64(entry.value as String)) {
        decrypted[entry.key] = decryptData(
          entry.value as String,
          key: encryptionKey,
        );
      }

      // Handle nested objects
      if (entry.value is Map) {
        decrypted[entry.key] = _decryptNestedData(
          entry.value as Map<String, dynamic>,
          encryptionKey,
        );
      }
    }

    return decrypted;
  }

  /// Generates a secure random key for encryption
  static String generateSecureKey({int length = 32}) {
    const chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    final random = Random.secure();
    return String.fromCharCodes(
      Iterable.generate(
        length,
        (_) => chars.codeUnitAt(random.nextInt(chars.length)),
      ),
    );
  }

  /// Checks if assignment requires encryption based on configuration
  static bool requiresEncryption(Map<String, dynamic> assignmentConfig) {
    return assignmentConfig['isEncrypt'] == true ||
        assignmentConfig['encryption'] == true ||
        assignmentConfig['sensitive'] == true;
  }

  /// Internal method to encrypt nested data structures
  static Map<String, dynamic> _encryptNestedData(
    Map<String, dynamic> data,
    String? key,
  ) {
    final encrypted = <String, dynamic>{};

    for (final entry in data.entries) {
      if (entry.value is String) {
        encrypted[entry.key] = encryptData(entry.value as String, key: key);
      } else if (entry.value is Map) {
        encrypted[entry.key] = _encryptNestedData(
          entry.value as Map<String, dynamic>,
          key,
        );
      } else {
        encrypted[entry.key] = entry.value;
      }
    }

    return encrypted;
  }

  /// Internal method to decrypt nested data structures
  static Map<String, dynamic> _decryptNestedData(
    Map<String, dynamic> data,
    String? key,
  ) {
    final decrypted = <String, dynamic>{};

    for (final entry in data.entries) {
      if (entry.value is String && _isBase64(entry.value as String)) {
        decrypted[entry.key] = decryptData(entry.value as String, key: key);
      } else if (entry.value is Map) {
        decrypted[entry.key] = _decryptNestedData(
          entry.value as Map<String, dynamic>,
          key,
        );
      } else {
        decrypted[entry.key] = entry.value;
      }
    }

    return decrypted;
  }

  /// Checks if a string is valid base64
  static bool _isBase64(String str) {
    try {
      base64.decode(str);
      return true;
    } on FormatException {
      return false;
    }
  }

  /// Generates default encryption key based on device/app identifiers
  static String _generateDefaultKey() {
    // In production, this should use device-specific identifiers
    // For now, use a combination of constants
    const baseKey = 'FASIH_FORM_GEAR_SDK_2024';
    final timestamp =
        DateTime.now().millisecondsSinceEpoch ~/ 86400000; // Daily rotation
    return '$baseKey:$timestamp';
  }
}
