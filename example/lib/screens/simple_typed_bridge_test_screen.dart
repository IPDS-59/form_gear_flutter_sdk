import 'package:flutter/material.dart';
import 'package:form_gear_engine_sdk/form_gear_engine_sdk.dart';

class SimpleTypedBridgeTestScreen extends StatefulWidget {
  const SimpleTypedBridgeTestScreen({super.key});

  @override
  State<SimpleTypedBridgeTestScreen> createState() =>
      _SimpleTypedBridgeTestScreenState();
}

class _SimpleTypedBridgeTestScreenState
    extends State<SimpleTypedBridgeTestScreen> {
  Widget? debugWebView;
  bool isLoading = true;

  // Custom handlers that provide app-specific data
  final customHandlers = <JSHandler<dynamic>>[
    _CustomUserHandler(username: 'TypedBridgeUser'),
    _CustomFormHandler(formMode: 2),
  ];

  @override
  void initState() {
    super.initState();
    _loadDebugWebView();
  }

  Future<void> _loadDebugWebView() async {
    try {
      final webView = await FormGearSDK.instance.createDebugBridgeTest(
        customHandlers: customHandlers,
        onWebViewCreated: (controller) {
          print('WebView created with SDK');
        },
        onLoadStart: (controller, url) {
          print('Load started: $url');
        },
        onLoadStop: (controller, url) {
          print('Load finished: $url');
        },
        onLoadError: (controller, url, code, message) {
          print('Load error: $code - $message');
        },
        onConsoleMessage: (controller, consoleMessage) {
          print(
            'Console [${consoleMessage.messageLevel}]: '
            '${consoleMessage.message}',
          );
        },
      );

      setState(() {
        debugWebView = webView;
        isLoading = false;
      });
    } catch (e) {
      print('Error loading debug WebView: $e');
      setState(() {
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('SDK Integration Test'),
        backgroundColor: Colors.purple[600],
        foregroundColor: Colors.white,
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                Container(
                  padding: const EdgeInsets.all(16),
                  color: Colors.purple[50],
                  width: double.infinity,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'FormGear SDK Integration Test',
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                          color: Colors.purple[800],
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'SDK automatically provides: CAMERA, FILE_PICKER, LOCATION',
                        style: Theme.of(context).textTheme.bodyMedium,
                      ),
                      Text(
                        'Custom handlers: ${customHandlers.length}',
                        style: Theme.of(context).textTheme.bodyMedium,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Bridge test HTML loaded from SDK assets (DEBUG ONLY)',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: Colors.purple[600],
                          fontStyle: FontStyle.italic,
                        ),
                      ),
                    ],
                  ),
                ),
                Expanded(
                  child:
                      debugWebView ??
                      const Center(
                        child: Text(
                          'Debug mode only - Bridge test not available in release mode',
                          style: TextStyle(color: Colors.red),
                        ),
                      ),
                ),
              ],
            ),
    );
  }

  @override
  void dispose() {
    // No need to dispose - SDK handles it automatically
    super.dispose();
  }
}

/// Custom handler for user-specific data
class _CustomUserHandler extends JSHandler<StringInfoJs> {
  _CustomUserHandler({required this.username});

  final String username;

  @override
  String get handlerName => 'getUserName';

  @override
  Future<StringInfoJs> callback(List<dynamic> arguments) async {
    return StringInfoJs(success: true, value: username);
  }
}

/// Custom handler for form-specific data
class _CustomFormHandler extends JSHandler<StringInfoJs> {
  _CustomFormHandler({required this.formMode});

  final int formMode;

  @override
  String get handlerName => 'getFormMode';

  @override
  Future<StringInfoJs> callback(List<dynamic> arguments) async {
    return StringInfoJs(success: true, value: formMode.toString());
  }
}
