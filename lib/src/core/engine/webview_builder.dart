import 'dart:async';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/js_executor_service.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/js_handler_base.dart';
import 'package:form_gear_engine_sdk/src/core/ui/form_gear_ui_handler.dart';
import 'package:form_gear_engine_sdk/src/models/assignment_context.dart';
import 'package:form_gear_engine_sdk/src/models/form_engine_type.dart';
import 'package:form_gear_engine_sdk/src/models/prepared_engine.dart';
import 'package:form_gear_engine_sdk/src/presentation/widgets/form_gear_webview.dart';
import 'package:form_gear_engine_sdk/src/utils/form_gear_logger.dart';

/// Builder for creating FormGear WebView widgets with proper configuration
class WebViewBuilder {
  /// Creates WebView with assignment-specific handlers
  ///
  /// On iOS, if `serverUrl` is set in the prepared engine, the WebView
  /// will load from the server URL instead of using loadData() with HTML.
  /// This works around iOS WKWebView limitations with large HTML content.
  static FormGearWebView createWebViewWithAssignment({
    required AssignmentContext assignment,
    required PreparedEngine preparedEngine,
    required FormEngineType? currentEngineType,
    required List<JSHandler<dynamic>> jsHandlers,
    FormGearUiHandler? uiHandler,
  }) {
    // iOS: Use server URL if available (works around loadData() issues)
    // Android: Use HTML content directly with loadData()
    final useServerUrl = Platform.isIOS && preparedEngine.serverUrl != null;
    final url = useServerUrl ? preparedEngine.serverUrl! : 'about:blank';
    final htmlContent = useServerUrl ? null : preparedEngine.html;

    if (useServerUrl) {
      FormGearLogger.sdk(
        'iOS: Loading form from server URL: ${preparedEngine.serverUrl}',
      );
    } else {
      FormGearLogger.sdk(
        'Loading form with loadData '
        '(HTML: ${preparedEngine.html.length} chars)',
      );
    }

    return FormGearWebView(
      uiHandler: uiHandler,
      url: url,
      htmlContent: htmlContent,
      jsHandlers: jsHandlers,
      // FasihForm sets window.fasihForm synchronously on startup; if it is
      // missing after load, the page script threw and the form is blank.
      engineReadyCheck: currentEngineType == FormEngineType.fasihForm
          ? "typeof window.fasihForm !== 'undefined'"
          : null,
      onWebViewCreated: (controller) {
        FormGearLogger.sdk(
          'WebView created for assignment: ${assignment.assignmentId}',
        );
        // Register JavaScript executor service for action handlers
        JSExecutorService().registerController(
          controller,
          currentEngineType?.id.toString(),
        );
      },
    );
  }

  /// Creates a full-screen page wrapper for FormGear WebView
  static Widget createFormGearEnginePage({
    required String title,
    required FormGearWebView webView,
    FormGearUiHandler? uiHandler,
  }) {
    return FormGearEnginePage(
      title: title,
      webView: webView,
      uiHandler: uiHandler,
    );
  }
}

/// Internal page widget for displaying FormGear engine.
///
/// Draws edge to edge by default: transparent system bars under the page and
/// the form kept inside the safe area, so nothing hides behind a bar. A
/// [FormGearUiHandler] can turn this off or restyle the bars.
class FormGearEnginePage extends StatefulWidget {
  const FormGearEnginePage({
    required this.title,
    required this.webView,
    this.uiHandler,
    super.key,
  });

  final String title;
  final FormGearWebView webView;
  final FormGearUiHandler? uiHandler;

  @override
  State<FormGearEnginePage> createState() => _FormGearEnginePageState();
}

class _FormGearEnginePageState extends State<FormGearEnginePage> {
  bool get _edgeToEdge => widget.uiHandler?.edgeToEdge ?? true;

  @override
  void initState() {
    super.initState();
    if (_edgeToEdge) {
      unawaited(SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge));
    }
  }

  @override
  Widget build(BuildContext context) {
    final page = Scaffold(body: widget.webView);
    if (!_edgeToEdge) return page;
    final style =
        widget.uiHandler?.systemOverlayStyle(context) ??
        _transparentBars(Theme.of(context).brightness);
    return AnnotatedRegion<SystemUiOverlayStyle>(value: style, child: page);
  }

  static SystemUiOverlayStyle _transparentBars(Brightness page) {
    final icons = page == Brightness.dark ? Brightness.light : Brightness.dark;
    return SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      systemNavigationBarColor: Colors.transparent,
      systemNavigationBarDividerColor: Colors.transparent,
      systemNavigationBarContrastEnforced: false,
      statusBarIconBrightness: icons,
      systemNavigationBarIconBrightness: icons,
      statusBarBrightness: page,
    );
  }
}
