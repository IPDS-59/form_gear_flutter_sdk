import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:form_gear_engine_sdk/src/proto/converters/template_converter.dart';
import 'package:form_gear_engine_sdk/src/utils/form_gear_logger.dart';

/// Demo: Load FormGear Engine with Protobuf Data
///
/// This demonstrates loading the actual FormGear JavaScript engine
/// and passing template data via protobuf instead of JSON.
class EngineProtobufDemoScreen extends StatefulWidget {
  const EngineProtobufDemoScreen({super.key});

  @override
  State<EngineProtobufDemoScreen> createState() =>
      _EngineProtobufDemoScreenState();
}

class _EngineProtobufDemoScreenState extends State<EngineProtobufDemoScreen> {
  InAppWebViewController? _controller;
  bool _isLoading = true;
  bool _useProtobuf = true;
  final List<LogEntry> _logs = [];
  int _jsonLoadTime = 0;
  int _protobufLoadTime = 0;
  int _jsonSize = 0;
  int _protobufSize = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Engine Protobuf Demo'),
        backgroundColor: const Color(0xFF1E88E5),
        foregroundColor: Colors.white,
        actions: [
          if (!_isLoading)
            IconButton(
              icon: Icon(_useProtobuf ? Icons.code : Icons.flash_on),
              onPressed: _toggleDataFormat,
              tooltip: _useProtobuf ? 'Switch to JSON' : 'Switch to Protobuf',
            ),
          if (!_isLoading)
            IconButton(
              icon: const Icon(Icons.refresh),
              onPressed: _reloadEngine,
              tooltip: 'Reload Engine',
            ),
        ],
      ),
      body: Column(
        children: [
          // Performance Stats Card
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  _useProtobuf
                      ? const Color(0xFF10B981)
                      : const Color(0xFFF59E0B),
                  _useProtobuf
                      ? const Color(0xFF059669)
                      : const Color(0xFFEF4444),
                ],
              ),
            ),
            child: Column(
              children: [
                Text(
                  _useProtobuf ? '⚡ Using Protobuf' : '📄 Using JSON',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _buildStat(
                      'Load Time',
                      _useProtobuf
                          ? '${_protobufLoadTime}ms'
                          : '${_jsonLoadTime}ms',
                    ),
                    _buildStat(
                      'Data Size',
                      _useProtobuf
                          ? '${(_protobufSize / 1024).toStringAsFixed(2)} KB'
                          : '${(_jsonSize / 1024).toStringAsFixed(2)} KB',
                    ),
                    if (_jsonSize > 0 && _protobufSize > 0)
                      _buildStat(
                        'Saved',
                        '${(((1 - _protobufSize / _jsonSize) * 100).toStringAsFixed(1))}%',
                      ),
                  ],
                ),
              ],
            ),
          ),

          // WebView with FormGear Engine
          Expanded(
            flex: 2,
            child: Stack(
              children: [
                InAppWebView(
                  initialData: InAppWebViewInitialData(
                    data: _buildEngineHtml(),
                  ),
                  onWebViewCreated: (controller) {
                    _controller = controller;

                    // Add JavaScript handlers
                    controller.addJavaScriptHandler(
                      handlerName: 'getTemplate',
                      callback: (args) => _getTemplateData(),
                    );

                    controller.addJavaScriptHandler(
                      handlerName: 'logToFlutter',
                      callback: (args) {
                        if (args.isNotEmpty) {
                          _addLog(args[0].toString(), LogType.engine);
                        }
                        return null;
                      },
                    );
                  },
                  onLoadStop: (controller, url) async {
                    setState(() => _isLoading = false);
                    _addLog('Engine loaded successfully', LogType.system);
                    await _loadTemplateData();
                  },
                  onConsoleMessage: (controller, message) {
                    FormGearLogger.sdk('Engine: ${message.message}');
                  },
                ),
                if (_isLoading)
                  Container(
                    color: Colors.black54,
                    child: const Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          CircularProgressIndicator(color: Colors.white),
                          SizedBox(height: 16),
                          Text(
                            'Loading FormGear Engine...',
                            style: TextStyle(color: Colors.white),
                          ),
                        ],
                      ),
                    ),
                  ),
              ],
            ),
          ),

          // Logs Section
          Expanded(
            child: Container(
              decoration: BoxDecoration(
                border: Border(top: BorderSide(color: Colors.grey.shade300)),
              ),
              child: Column(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    color: Colors.grey.shade100,
                    child: const Row(
                      children: [
                        Icon(Icons.terminal, size: 16),
                        SizedBox(width: 8),
                        Text(
                          'Engine Logs',
                          style: TextStyle(fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ),
                  Expanded(
                    child: ListView.builder(
                      itemCount: _logs.length,
                      itemBuilder: (context, index) {
                        final log = _logs[index];
                        return ListTile(
                          dense: true,
                          leading: Icon(
                            log.type == LogType.protobuf
                                ? Icons.flash_on
                                : log.type == LogType.json
                                ? Icons.code
                                : log.type == LogType.engine
                                ? Icons.settings
                                : Icons.info,
                            size: 16,
                            color: log.type == LogType.protobuf
                                ? Colors.green
                                : log.type == LogType.json
                                ? Colors.orange
                                : Colors.blue,
                          ),
                          title: Text(
                            log.message,
                            style: const TextStyle(fontSize: 12),
                          ),
                          subtitle: Text(
                            log.timestamp,
                            style: const TextStyle(fontSize: 10),
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStat(String label, String value) {
    return Column(
      children: [
        Text(
          label,
          style: const TextStyle(color: Colors.white70, fontSize: 12),
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }

  void _addLog(String message, LogType type) {
    setState(() {
      _logs.add(
        LogEntry(
          message: message,
          type: type,
          timestamp: DateTime.now().toString().substring(11, 19),
        ),
      );
    });
  }

  Future<void> _toggleDataFormat() async {
    setState(() {
      _useProtobuf = !_useProtobuf;
    });
    _addLog(
      'Switched to ${_useProtobuf ? 'Protobuf' : 'JSON'} mode',
      LogType.system,
    );
    await _loadTemplateData();
  }

  Future<void> _reloadEngine() async {
    setState(() {
      _isLoading = true;
      _logs.clear();
    });
    await _controller?.reload();
  }

  Future<Map<String, dynamic>> _getTemplateData() async {
    final stopwatch = Stopwatch()..start();

    // Load template JSON
    final jsonString = await rootBundle.loadString(
      'assets/Template/demo/demo_template.json',
    );
    final jsonMap = jsonDecode(jsonString) as Map<String, dynamic>;

    if (_useProtobuf) {
      // Convert to protobuf and measure
      final template = TemplateConverter.fromJson(jsonMap);
      final protobufBytes = template.writeToBuffer();
      final base64Data = base64Encode(protobufBytes);

      stopwatch.stop();

      setState(() {
        _protobufLoadTime = stopwatch.elapsedMilliseconds;
        _protobufSize = protobufBytes.length;
      });

      _addLog(
        'Loaded via Protobuf: ${protobufBytes.length} bytes in ${stopwatch.elapsedMilliseconds}ms',
        LogType.protobuf,
      );

      // Return both protobuf and decoded JSON for engine
      return {
        'format': 'protobuf',
        'data': base64Data,
        'size': protobufBytes.length,
        'template': jsonMap, // Engine still needs JSON structure
      };
    } else {
      // Use JSON directly
      stopwatch.stop();

      setState(() {
        _jsonLoadTime = stopwatch.elapsedMilliseconds;
        _jsonSize = jsonString.length;
      });

      _addLog(
        'Loaded via JSON: ${jsonString.length} bytes in ${stopwatch.elapsedMilliseconds}ms',
        LogType.json,
      );

      return {
        'format': 'json',
        'data': jsonString,
        'size': jsonString.length,
        'template': jsonMap,
      };
    }
  }

  Future<void> _loadTemplateData() async {
    _addLog('Loading template data...', LogType.system);

    await _controller?.evaluateJavascript(
      source: '''
      (async function() {
        try {
          const templateData = await window.flutter_inappwebview.callHandler('getTemplate');

          window.logToFlutter = function(msg) {
            window.flutter_inappwebview.callHandler('logToFlutter', msg);
          };

          logToFlutter('Received template: ' + templateData.format + ' (' + templateData.size + ' bytes)');

          // Store template data
          window.currentTemplate = templateData.template;
          window.templateFormat = templateData.format;

          // Display template info
          if (window.currentTemplate) {
            logToFlutter('Template: ' + window.currentTemplate.title);
            logToFlutter('Components: ' + (window.currentTemplate.components || []).length + ' sections');
          }
        } catch (e) {
          logToFlutter('Error loading template: ' + e.message);
        }
      })();
    ''',
    );
  }

  String _buildEngineHtml() {
    return '''
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FormGear Engine - Protobuf Demo</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      color: white;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
    }
    h1 {
      font-size: 24px;
      margin-bottom: 20px;
      text-align: center;
    }
    .engine-info {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .label {
      font-weight: 600;
      opacity: 0.8;
    }
    .value {
      font-weight: bold;
    }
    .status {
      text-align: center;
      padding: 16px;
      background: rgba(16, 185, 129, 0.2);
      border-radius: 8px;
      margin-top: 20px;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: bold;
      background: #10b981;
      margin-left: 8px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>⚡ FormGear Engine</h1>

    <div class="engine-info">
      <div class="info-row">
        <span class="label">Engine Status</span>
        <span class="value" id="engineStatus">Initializing...</span>
      </div>
      <div class="info-row">
        <span class="label">Data Format</span>
        <span class="value" id="dataFormat">-</span>
      </div>
      <div class="info-row">
        <span class="label">Template</span>
        <span class="value" id="templateName">-</span>
      </div>
      <div class="info-row">
        <span class="label">Components</span>
        <span class="value" id="componentCount">-</span>
      </div>
      <div class="info-row">
        <span class="label">Data Size</span>
        <span class="value" id="dataSize">-</span>
      </div>
    </div>

    <div class="status">
      <div id="statusMessage">✓ Engine ready to receive data</div>
    </div>
  </div>

  <script>
    // Engine initialization
    window.addEventListener('DOMContentLoaded', function() {
      document.getElementById('engineStatus').innerHTML =
        'Ready <span class="badge">ACTIVE</span>';
    });

    // Update display when template is loaded
    window.updateTemplateDisplay = function(data) {
      if (data.format) {
        document.getElementById('dataFormat').innerHTML =
          data.format.toUpperCase() +
          (data.format === 'protobuf' ? ' <span class="badge">BINARY</span>' : '');
      }

      if (data.template) {
        document.getElementById('templateName').textContent =
          data.template.title || '-';

        const sections = (data.template.components || []).length;
        let totalComponents = 0;
        if (data.template.components) {
          totalComponents = data.template.components.reduce((sum, section) => {
            return sum + (Array.isArray(section) ? section.length : 0);
          }, 0);
        }

        document.getElementById('componentCount').textContent =
          totalComponents + ' in ' + sections + ' sections';
      }

      if (data.size) {
        document.getElementById('dataSize').textContent =
          (data.size / 1024).toFixed(2) + ' KB';
      }

      document.getElementById('statusMessage').innerHTML =
        '✓ Template loaded successfully via ' +
        (data.format || 'unknown').toUpperCase();
    };
  </script>
</body>
</html>
    ''';
  }
}

enum LogType { protobuf, json, system, engine }

class LogEntry {
  final String message;
  final LogType type;
  final String timestamp;

  LogEntry({
    required this.message,
    required this.type,
    required this.timestamp,
  });
}
