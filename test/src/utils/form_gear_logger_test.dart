import 'package:flutter_test/flutter_test.dart';
import 'package:form_gear_engine_sdk/src/utils/form_gear_logger.dart';

void main() {
  group('FormGearLogger Tests', () {
    group('Basic Logging Methods', () {
      test('should log info message without category', () {
        expect(() => FormGearLogger.info('Test info message'), returnsNormally);
      });

      test('should log info message with category', () {
        expect(
          () => FormGearLogger.info('Test info', category: 'TestCategory'),
          returnsNormally,
        );
      });

      test('should log debug message without category', () {
        expect(() => FormGearLogger.debug('Test debug'), returnsNormally);
      });

      test('should log debug message with category', () {
        expect(
          () => FormGearLogger.debug('Test debug', category: 'TestCategory'),
          returnsNormally,
        );
      });

      test('should log warning message without category', () {
        expect(() => FormGearLogger.warning('Test warning'), returnsNormally);
      });

      test('should log warning message with category', () {
        expect(
          () =>
              FormGearLogger.warning('Test warning', category: 'TestCategory'),
          returnsNormally,
        );
      });

      test('should log error message without category', () {
        expect(() => FormGearLogger.error('Test error'), returnsNormally);
      });

      test('should log error message with category', () {
        expect(
          () => FormGearLogger.error('Test error', category: 'TestCategory'),
          returnsNormally,
        );
      });

      test('should log error with exception and stack trace', () {
        final exception = Exception('Test exception');
        final stackTrace = StackTrace.current;

        expect(
          () => FormGearLogger.error(
            'Error occurred',
            category: 'Test',
            error: exception,
            stackTrace: stackTrace,
          ),
          returnsNormally,
        );
      });
    });

    group('WebView Logging Methods', () {
      test('should log webview info message', () {
        expect(
          () => FormGearLogger.webview('WebView message'),
          returnsNormally,
        );
      });

      test('should log webview debug message', () {
        expect(
          () => FormGearLogger.webviewDebug('WebView debug'),
          returnsNormally,
        );
      });

      test('should log webview error message', () {
        expect(
          () => FormGearLogger.webviewError('WebView error'),
          returnsNormally,
        );
      });

      test('should log webview error with exception', () {
        final error = Exception('WebView exception');
        expect(
          () => FormGearLogger.webviewError('WebView error', error: error),
          returnsNormally,
        );
      });
    });

    group('JS Bridge Logging Methods', () {
      test('should log JS bridge info message', () {
        expect(
          () => FormGearLogger.jsBridge('Bridge message'),
          returnsNormally,
        );
      });

      test('should log JS bridge debug message', () {
        expect(
          () => FormGearLogger.jsBridgeDebug('Bridge debug'),
          returnsNormally,
        );
      });

      test('should log JS bridge error message', () {
        expect(
          () => FormGearLogger.jsBridgeError('Bridge error'),
          returnsNormally,
        );
      });

      test('should log JS bridge error with exception', () {
        final error = Exception('Bridge exception');
        expect(
          () => FormGearLogger.jsBridgeError('Bridge error', error: error),
          returnsNormally,
        );
      });
    });

    group('Server Logging Methods', () {
      test('should log server info message', () {
        expect(() => FormGearLogger.server('Server message'), returnsNormally);
      });

      test('should log server debug message', () {
        expect(
          () => FormGearLogger.serverDebug('Server debug'),
          returnsNormally,
        );
      });

      test('should log server error message', () {
        expect(
          () => FormGearLogger.serverError('Server error'),
          returnsNormally,
        );
      });

      test('should log server error with exception', () {
        final error = Exception('Server exception');
        expect(
          () => FormGearLogger.serverError('Server error', error: error),
          returnsNormally,
        );
      });
    });

    group('Template Logging Methods', () {
      test('should log template info message', () {
        expect(
          () => FormGearLogger.template('Template message'),
          returnsNormally,
        );
      });

      test('should log template debug message', () {
        expect(
          () => FormGearLogger.templateDebug('Template debug'),
          returnsNormally,
        );
      });

      test('should log template error message', () {
        expect(
          () => FormGearLogger.templateError('Template error'),
          returnsNormally,
        );
      });

      test('should log template error with exception', () {
        final error = Exception('Template exception');
        expect(
          () => FormGearLogger.templateError('Template error', error: error),
          returnsNormally,
        );
      });
    });

    group('Native Logging Methods', () {
      test('should log native info message', () {
        expect(() => FormGearLogger.native('Native message'), returnsNormally);
      });

      test('should log native debug message', () {
        expect(
          () => FormGearLogger.nativeDebug('Native debug'),
          returnsNormally,
        );
      });

      test('should log native error message', () {
        expect(
          () => FormGearLogger.nativeError('Native error'),
          returnsNormally,
        );
      });

      test('should log native error with exception', () {
        final error = Exception('Native exception');
        expect(
          () => FormGearLogger.nativeError('Native error', error: error),
          returnsNormally,
        );
      });
    });

    group('WebView JS Console Logging', () {
      test('should log error level from WebView JS', () {
        expect(
          () => FormGearLogger.webviewJs(
            level: 'error',
            message: 'JS error message',
            timestamp: DateTime.now().toIso8601String(),
          ),
          returnsNormally,
        );
      });

      test('should log warn level from WebView JS', () {
        expect(
          () => FormGearLogger.webviewJs(
            level: 'warn',
            message: 'JS warning message',
            timestamp: DateTime.now().toIso8601String(),
          ),
          returnsNormally,
        );
      });

      test('should log warning level from WebView JS', () {
        expect(
          () => FormGearLogger.webviewJs(
            level: 'warning',
            message: 'JS warning message',
            timestamp: DateTime.now().toIso8601String(),
          ),
          returnsNormally,
        );
      });

      test('should log info level from WebView JS', () {
        expect(
          () => FormGearLogger.webviewJs(
            level: 'info',
            message: 'JS info message',
            timestamp: DateTime.now().toIso8601String(),
          ),
          returnsNormally,
        );
      });

      test('should log debug level from WebView JS', () {
        expect(
          () => FormGearLogger.webviewJs(
            level: 'debug',
            message: 'JS debug message',
            timestamp: DateTime.now().toIso8601String(),
          ),
          returnsNormally,
        );
      });

      test('should log generic log level from WebView JS', () {
        expect(
          () => FormGearLogger.webviewJs(
            level: 'log',
            message: 'JS log message',
            timestamp: DateTime.now().toIso8601String(),
          ),
          returnsNormally,
        );
      });

      test('should log unknown level as info from WebView JS', () {
        expect(
          () => FormGearLogger.webviewJs(
            level: 'unknown',
            message: 'JS unknown level',
            timestamp: DateTime.now().toIso8601String(),
          ),
          returnsNormally,
        );
      });

      test('should not log when console forwarding is disabled', () {
        expect(
          () => FormGearLogger.webviewJs(
            level: 'info',
            message: 'Should not log',
            timestamp: DateTime.now().toIso8601String(),
            enableConsoleLogForwarding: false,
          ),
          returnsNormally,
        );
      });

      test('should handle valid ISO timestamp format', () {
        expect(
          () => FormGearLogger.webviewJs(
            level: 'info',
            message: 'Test message',
            timestamp: '2024-01-15T10:30:45.123Z',
          ),
          returnsNormally,
        );
      });

      test('should handle invalid timestamp format', () {
        expect(
          () => FormGearLogger.webviewJs(
            level: 'info',
            message: 'Test message',
            timestamp: 'invalid-timestamp',
          ),
          returnsNormally,
        );
      });

      test('should handle short timestamp strings', () {
        expect(
          () => FormGearLogger.webviewJs(
            level: 'info',
            message: 'Test message',
            timestamp: '12:34',
          ),
          returnsNormally,
        );
      });

      test('should handle long timestamp strings', () {
        expect(
          () => FormGearLogger.webviewJs(
            level: 'info',
            message: 'Test message',
            timestamp: '2024-01-15T10:30:45.123456789Z',
          ),
          returnsNormally,
        );
      });
    });

    group('Specialized Logging Methods', () {
      test('should log config message', () {
        expect(() => FormGearLogger.config('Config changed'), returnsNormally);
      });

      test('should log init message', () {
        expect(() => FormGearLogger.init('Initializing SDK'), returnsNormally);
      });

      test('should log dispose message', () {
        expect(() => FormGearLogger.dispose('Disposing SDK'), returnsNormally);
      });

      test('should log SDK message', () {
        expect(() => FormGearLogger.sdk('SDK message'), returnsNormally);
      });

      test('should log SDK error message', () {
        expect(() => FormGearLogger.sdkError('SDK error'), returnsNormally);
      });

      test('should log SDK error with exception', () {
        final error = Exception('SDK exception');
        expect(
          () => FormGearLogger.sdkError('SDK error', error: error),
          returnsNormally,
        );
      });
    });

    group('Case Sensitivity Tests', () {
      test('should handle uppercase log levels', () {
        expect(
          () => FormGearLogger.webviewJs(
            level: 'ERROR',
            message: 'Uppercase error',
            timestamp: DateTime.now().toIso8601String(),
          ),
          returnsNormally,
        );
      });

      test('should handle mixed case log levels', () {
        expect(
          () => FormGearLogger.webviewJs(
            level: 'WaRn',
            message: 'Mixed case warning',
            timestamp: DateTime.now().toIso8601String(),
          ),
          returnsNormally,
        );
      });
    });

    group('Edge Cases', () {
      test('should handle empty message', () {
        expect(() => FormGearLogger.info(''), returnsNormally);
      });

      test('should handle very long message', () {
        final longMessage = 'A' * 10000;
        expect(() => FormGearLogger.info(longMessage), returnsNormally);
      });

      test('should handle special characters in message', () {
        expect(
          () => FormGearLogger.info('Special chars: \n\t\r🎉'),
          returnsNormally,
        );
      });

      test('should handle null error gracefully', () {
        expect(
          () => FormGearLogger.error('Error', error: null),
          returnsNormally,
        );
      });

      test('should handle null stack trace gracefully', () {
        expect(
          () => FormGearLogger.error('Error', stackTrace: null),
          returnsNormally,
        );
      });
    });
  });
}
