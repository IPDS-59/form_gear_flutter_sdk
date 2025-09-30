import 'dart:convert';
import 'dart:io';

import 'package:archive/archive.dart';
import 'package:form_gear_engine_sdk/src/core/errors/errors.dart';
import 'package:injectable/injectable.dart';

/// Service for compressing and decompressing large form data payloads
/// Follows FASIH patterns for efficient data transfer and storage
@LazySingleton()
class CompressionService {
  /// Compresses a string using GZip
  List<int> compressString(String data) {
    try {
      final bytes = utf8.encode(data);
      return const GZipEncoder().encode(bytes);
    } catch (e) {
      throw CompressionException('Failed to compress string: $e');
    }
  }

  /// Decompresses GZip data to string
  String decompressString(List<int> compressed) {
    try {
      final decompressed = const GZipDecoder().decodeBytes(compressed);
      return utf8.decode(decompressed);
    } catch (e) {
      throw CompressionException('Failed to decompress string: $e');
    }
  }

  /// Compresses JSON data
  List<int> compressJson(Map<String, dynamic> data) {
    final jsonString = jsonEncode(data);
    return compressString(jsonString);
  }

  /// Decompresses JSON data
  Map<String, dynamic> decompressJson(List<int> compressed) {
    final jsonString = decompressString(compressed);
    return jsonDecode(jsonString) as Map<String, dynamic>;
  }

  /// Compresses a file and returns compressed bytes
  Future<List<int>> compressFile(String filePath) async {
    try {
      final file = File(filePath);
      if (!await file.exists()) {
        throw CompressionException('File not found: $filePath');
      }

      final bytes = await file.readAsBytes();
      return const GZipEncoder().encode(bytes);
    } catch (e) {
      throw CompressionException('Failed to compress file: $e');
    }
  }

  /// Decompresses data and writes to file
  Future<void> decompressToFile(List<int> compressed, String outputPath) async {
    try {
      final decompressed = const GZipDecoder().decodeBytes(compressed);
      final file = File(outputPath);
      await file.writeAsBytes(decompressed);
    } catch (e) {
      throw CompressionException('Failed to decompress to file: $e');
    }
  }

  /// Compresses base64 string (useful for image data)
  String compressBase64(String base64Data) {
    try {
      final bytes = base64Decode(base64Data);
      final compressed = const GZipEncoder().encode(bytes);
      return base64Encode(compressed);
    } catch (e) {
      throw CompressionException('Failed to compress base64: $e');
    }
  }

  /// Decompresses base64 string
  String decompressBase64(String compressedBase64) {
    try {
      final compressed = base64Decode(compressedBase64);
      final decompressed = const GZipDecoder().decodeBytes(compressed);
      return base64Encode(decompressed);
    } catch (e) {
      throw CompressionException('Failed to decompress base64: $e');
    }
  }

  /// Calculates compression ratio (original size / compressed size)
  double compressionRatio(String original, List<int> compressed) {
    final originalSize = utf8.encode(original).length;
    return originalSize / compressed.length;
  }

  /// Determines if compression is beneficial (ratio > 1.5)
  bool shouldCompress(String data, {double minRatio = 1.5}) {
    final compressed = compressString(data);
    final ratio = compressionRatio(data, compressed);
    return ratio >= minRatio;
  }
}
