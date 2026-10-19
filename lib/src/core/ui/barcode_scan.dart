/// What the engine asks the host to scan: one barcode or QR code for the form
/// field [dataKey].
class BarcodeScanRequest {
  const BarcodeScanRequest({required this.dataKey, required this.title});

  /// The form field that asked for the scan.
  final String dataKey;

  /// A title for the scanner screen, for example `Scan Barcode - <dataKey>`.
  final String title;
}

/// What a host scanner returns. A null [text] means the user left the scanner
/// without a code.
class BarcodeScanResult {
  const BarcodeScanResult({this.text, this.format = ''});

  /// The user left the scanner without a code.
  const BarcodeScanResult.cancelled() : text = null, format = '';

  /// The decoded text, or null when cancelled.
  final String? text;

  /// Symbology name, for example `QRCode` or `Code128`. Empty when unknown.
  final String format;

  bool get cancelled => text == null || text!.isEmpty;
}
