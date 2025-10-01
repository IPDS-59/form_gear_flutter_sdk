import 'package:flutter/material.dart';
import 'package:form_gear_engine_sdk/src/core/config/config.dart';
import 'package:form_gear_engine_sdk/src/core/engine/handler_factory.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/js_executor_service.dart';
import 'package:form_gear_engine_sdk/src/core/listeners/form_data_listener.dart';
import 'package:form_gear_engine_sdk/src/models/assignment_context.dart';
import 'package:form_gear_engine_sdk/src/models/form_engine_type.dart';
import 'package:form_gear_engine_sdk/src/models/prepared_engine.dart';
import 'package:form_gear_engine_sdk/src/presentation/widgets/form_gear_webview.dart';
import 'package:form_gear_engine_sdk/src/utils/form_gear_logger.dart';

/// Builder for creating FormGear WebView widgets with proper configuration
class WebViewBuilder {
  /// Creates WebView with assignment-specific handlers
  static FormGearWebView createWebViewWithAssignment({
    required AssignmentContext assignment,
    required PreparedEngine preparedEngine,
    required FormEngineType? currentEngineType,
    required FormConfig? currentFormConfig,
    required FormGearConfig? config,
    required AssignmentContext? Function() getCurrentAssignment,
    FormDataListener? formDataListener,
  }) {
    return FormGearWebView(
      url: 'about:blank',
      htmlContent: preparedEngine.html,
      jsHandlers: HandlerFactory.createAssignmentAwareHandlers(
        assignment: assignment,
        currentFormConfig: currentFormConfig,
        config: config,
        formDataListener: formDataListener,
        getCurrentAssignment: getCurrentAssignment,
      ),
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
  }) {
    return FormGearEnginePage(
      title: title,
      webView: webView,
    );
  }
}

/// Internal page widget for displaying FormGear engine
class FormGearEnginePage extends StatelessWidget {
  const FormGearEnginePage({
    required this.title,
    required this.webView,
    super.key,
  });

  final String title;
  final FormGearWebView webView;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: webView,
    );
  }
}
