import 'dart:developer' as developer;

/// Centralized logging utility for FormGear SDK
///
/// Provides consistent logging across the SDK with proper categorization
/// and formatting. Supports both internal SDK logs and forwarded console logs
/// from WebView JavaScript.
class FormGearLogger {
  static const String _sdkName = 'FormGearSDK';

  // Log categories for different components
  static const String _webview = 'WebView';
  static const String _jsBridge = 'JSBridge';
  static const String _server = 'Server';
  static const String _template = 'Template';
  static const String _native = 'Native';
  static const String _webviewJs = 'WebView-JS';

  /// Log general SDK messages
  static void info(String message, {String? category}) {
    developer.log(
      message,
      name: category != null ? '$_sdkName.$category' : _sdkName,
      level: 800, // Info level
    );
  }

  /// Log debug messages
  static void debug(String message, {String? category}) {
    developer.log(
      message,
      name: category != null ? '$_sdkName.$category' : _sdkName,
      level: 700, // Debug level
    );
  }

  /// Log warning messages
  static void warning(String message, {String? category}) {
    developer.log(
      message,
      name: category != null ? '$_sdkName.$category' : _sdkName,
      level: 900, // Warning level
    );
  }

  /// Log error messages
  static void error(
    String message, {
    String? category,
    Object? error,
    StackTrace? stackTrace,
  }) {
    developer.log(
      message,
      name: category != null ? '$_sdkName.$category' : _sdkName,
      level: 1000, // Error level
      error: error,
      stackTrace: stackTrace,
    );
  }

  // Specific category loggers for better organization

  /// Log WebView related messages
  static void webview(String message) {
    info(message, category: _webview);
  }

  /// Log WebView debug messages
  static void webviewDebug(String message) {
    debug(message, category: _webview);
  }

  /// Log WebView error messages
  static void webviewError(String message, {Object? error}) {
    FormGearLogger.error(message, category: _webview, error: error);
  }

  /// Log JS Bridge related messages
  static void jsBridge(String message) {
    info(message, category: _jsBridge);
  }

  /// Log JS Bridge debug messages
  static void jsBridgeDebug(String message) {
    debug(message, category: _jsBridge);
  }

  /// Log JS Bridge error messages
  static void jsBridgeError(String message, {Object? error}) {
    FormGearLogger.error(message, category: _jsBridge, error: error);
  }

  /// Log server related messages
  static void server(String message) {
    info(message, category: _server);
  }

  /// Log server debug messages
  static void serverDebug(String message) {
    debug(message, category: _server);
  }

  /// Log server error messages
  static void serverError(String message, {Object? error}) {
    FormGearLogger.error(message, category: _server, error: error);
  }

  /// Log template related messages
  static void template(String message) {
    info(message, category: _template);
  }

  /// Log template debug messages
  static void templateDebug(String message) {
    debug(message, category: _template);
  }

  /// Log template error messages
  static void templateError(String message, {Object? error}) {
    FormGearLogger.error(message, category: _template, error: error);
  }

  /// Log native features related messages
  static void native(String message) {
    info(message, category: _native);
  }

  /// Log native features debug messages
  static void nativeDebug(String message) {
    debug(message, category: _native);
  }

  /// Log native features error messages
  static void nativeError(String message, {Object? error}) {
    FormGearLogger.error(message, category: _native, error: error);
  }

  /// Log messages forwarded from WebView JavaScript console
  ///
  /// These logs are distinguished with special formatting and indicators
  /// to show they originated from the WebView's JavaScript context.
  static void webviewJs({
    required String level,
    required String message,
    required String timestamp,
    bool enableConsoleLogForwarding = true,
  }) {
    if (!enableConsoleLogForwarding) {
      return;
    }

    // Format timestamp for better readability
    final timeStr = _formatTimestamp(timestamp);

    // Add visual indicators for different log levels
    final indicator = _getLogLevelIndicator(level);

    // Format the message with clear indication it's from WebView JS
    final formattedMessage = '[$timeStr] $indicator $message';

    // Use appropriate log level based on JavaScript console level
    switch (level.toLowerCase()) {
      case 'error':
        developer.log(
          formattedMessage,
          name: '$_sdkName.$_webviewJs',
          level: 1000, // Error level
        );
        // Additional error indicator
        developer.log(
          '⚠️  JavaScript Error detected - check WebView console for details',
          name: '$_sdkName.$_webviewJs',
          level: 900, // Warning level
        );
      case 'warn':
      case 'warning':
        developer.log(
          formattedMessage,
          name: '$_sdkName.$_webviewJs',
          level: 900, // Warning level
        );
      case 'info':
        developer.log(
          formattedMessage,
          name: '$_sdkName.$_webviewJs',
          level: 800, // Info level
        );
      case 'debug':
        developer.log(
          formattedMessage,
          name: '$_sdkName.$_webviewJs',
          level: 700, // Debug level
        );
      case 'log':
      default:
        developer.log(
          formattedMessage,
          name: '$_sdkName.$_webviewJs',
          level: 800, // Info level
        );
    }
  }

  /// Format timestamp for better readability
  static String _formatTimestamp(String timestamp) {
    try {
      final dateTime = DateTime.tryParse(timestamp);
      if (dateTime != null) {
        final localTime = dateTime.toLocal().toString();
        // Extract time portion (HH:mm:ss.SSS)
        return localTime.substring(11, 23);
      }
    } on Exception catch (_) {
      // Fallback to last part of timestamp if parsing fails
    }

    // Fallback: use last 12 characters of timestamp
    return timestamp.length > 12
        ? timestamp.substring(timestamp.length - 12)
        : timestamp;
  }

  /// Get visual indicator for log level
  static String _getLogLevelIndicator(String level) {
    switch (level.toLowerCase()) {
      case 'error':
        return '🔴 ERROR:';
      case 'warn':
      case 'warning':
        return '🟡 WARN:';
      case 'info':
        return '🔵 INFO:';
      case 'debug':
        return '🟣 DEBUG:';
      case 'log':
      default:
        return '⚪ LOG:';
    }
  }

  /// Log configuration changes
  static void config(String message) {
    info(message, category: 'Config');
  }

  /// Log initialization messages
  static void init(String message) {
    info(message, category: 'Init');
  }

  /// Log disposal/cleanup messages
  static void dispose(String message) {
    info(message, category: 'Dispose');
  }

  /// Log SDK general messages
  static void sdk(String message) {
    info(message, category: 'SDK');
  }

  /// Log SDK error messages
  static void sdkError(String message, {Object? error}) {
    FormGearLogger.error(message, category: 'SDK', error: error);
  }
}
