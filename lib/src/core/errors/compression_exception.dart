/// Exception thrown when compression/decompression fails
class CompressionException implements Exception {
  const CompressionException(this.message);

  final String message;

  @override
  String toString() => 'CompressionException: $message';
}
