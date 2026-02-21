import 'package:equatable/equatable.dart';

/// Prepared engine assets ready for WebView loading
class PreparedEngine extends Equatable {
  const PreparedEngine({
    required this.html,
    required this.baseUrl,
    this.historyUrl,
    this.serverUrl,
  });

  /// Complete HTML content with injected JS and CSS
  final String html;

  /// Base URL for the WebView
  final String baseUrl;

  /// History URL for navigation
  final String? historyUrl;

  /// Server URL for dynamic HTML serving (used on iOS)
  /// When set, iOS will load from this URL instead of using loadData()
  final String? serverUrl;

  /// Creates a copy with optional server URL
  PreparedEngine withServerUrl(String? serverUrl) => PreparedEngine(
    html: html,
    baseUrl: baseUrl,
    historyUrl: historyUrl,
    serverUrl: serverUrl,
  );

  @override
  List<Object?> get props => [html, baseUrl, historyUrl, serverUrl];
}
