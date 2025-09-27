import 'package:equatable/equatable.dart';

/// Prepared engine assets ready for WebView loading
class PreparedEngine extends Equatable {
  const PreparedEngine({
    required this.html,
    required this.baseUrl,
    this.historyUrl,
  });

  /// Complete HTML content with injected JS and CSS
  final String html;

  /// Base URL for the WebView
  final String baseUrl;

  /// History URL for navigation
  final String? historyUrl;

  @override
  List<Object?> get props => [html, baseUrl, historyUrl];
}
