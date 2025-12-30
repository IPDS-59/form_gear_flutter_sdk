import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:form_gear_engine_sdk/src/utils/form_gear_logger.dart';

/// Helper class for WebView navigation operations
class WebViewNavigationHelper {
  /// JavaScript code for back navigation in form engines
  static const String _backNavigationScript = '''
    (function() {
      try {
        // 1. Check for mobileBack function (custom handler)
        if (typeof window.mobileBack === 'function') {
          var backResult = window.mobileBack();
          if (backResult === true || backResult === 'true') return true;
          if (backResult === false || backResult === 'false') return false;
        }

        // 2. FasihForm: Check canGoBack/goBack methods
        if (window.fasihForm && window.fasihForm.event) {
          if (typeof window.fasihForm.canGoBack === 'function') {
            if (window.fasihForm.canGoBack()) {
              window.fasihForm.goBack();
              return true;
            }
            return false;
          }
          try {
            window.fasihForm.event.emit('back-request');
          } catch (e) {}
        }

        // 3. Look for prev/back navigation buttons in DOM
        var prevButton = document.querySelector(
          'button[data-action="prev"], button[data-action="back"], ' +
          '[data-testid="prev-section"], [data-testid="back-button"], ' +
          '.prev-section-btn, .back-btn, ' +
          'button[aria-label*="previous" i], ' +
          'button[aria-label*="sebelumnya" i], ' +
          'button[aria-label*="kembali" i]'
        );

        if (prevButton && !prevButton.disabled &&
            prevButton.offsetParent !== null &&
            getComputedStyle(prevButton).display !== 'none') {
          prevButton.click();
          return true;
        }

        // 4. Check for stepper/pagination navigation
        var steppers = document.querySelectorAll(
          '.stepper-item, .step-item, .pagination-item, ' +
          '[role="tab"], [data-step]'
        );

        if (steppers.length > 1) {
          var activeIndex = -1;
          steppers.forEach(function(el, idx) {
            if (el.classList.contains('active') ||
                el.classList.contains('current') ||
                el.getAttribute('aria-selected') === 'true' ||
                el.getAttribute('data-active') === 'true') {
              activeIndex = idx;
            }
          });

          if (activeIndex > 0) {
            steppers[activeIndex - 1].click();
            return true;
          }
          if (activeIndex === 0) return false;
        }

        return 'unknown';
      } catch (e) {
        console.log('Back navigation check error: ' + e);
        return 'error';
      }
    })();
  ''';

  /// Try to navigate back within the form sections/pages
  /// Returns true if navigation was handled, false if at first section
  static Future<bool> tryNavigateBackInForm(
    InAppWebViewController controller,
  ) async {
    try {
      final result = await controller.evaluateJavascript(
        source: _backNavigationScript,
      );

      // Parse result - could be bool, string, or null
      if (result == true || result == 'true') {
        return true;
      }

      if (result == false || result == 'false') {
        return false;
      }

      // If unknown, check WebView history as fallback
      final canGoBack = await controller.canGoBack();
      if (canGoBack) {
        await controller.goBack();
        return true;
      }

      return false;
    } on Exception catch (e) {
      FormGearLogger.webviewError('Error checking form back navigation: $e');
      return false;
    }
  }

  /// JavaScript code for calling mobileExit before closing
  static const String _mobileExitScript = '''
    (function() {
      try {
        if (typeof window.mobileExit === 'function') {
          window.mobileExit();
        } else if (typeof Android !== 'undefined' &&
                   typeof Android.mobileExit === 'function') {
          Android.mobileExit();
        }
      } catch (e) {
        console.log('mobileExit not available: ' + e);
      }
    })();
  ''';

  /// Call mobileExit() JavaScript function before closing
  static Future<void> callMobileExit(InAppWebViewController controller) async {
    try {
      await controller.evaluateJavascript(source: _mobileExitScript);
      FormGearLogger.webview('Called mobileExit before closing form');
    } on Exception catch (e) {
      FormGearLogger.webviewError('Error calling mobileExit: $e');
    }
  }
}
