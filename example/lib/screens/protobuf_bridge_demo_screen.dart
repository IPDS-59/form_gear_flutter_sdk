import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:form_gear_engine_sdk/src/core/bridge/protobuf_bridge_channel.dart';
import 'package:form_gear_engine_sdk/src/proto/converters/template_converter.dart';

class ProtobufBridgeDemoScreen extends StatefulWidget {
  const ProtobufBridgeDemoScreen({super.key});

  @override
  State<ProtobufBridgeDemoScreen> createState() =>
      _ProtobufBridgeDemoScreenState();
}

class _ProtobufBridgeDemoScreenState extends State<ProtobufBridgeDemoScreen> {
  InAppWebViewController? _controller;
  ProtobufBridgeChannel? _protobufBridge;
  final List<BridgeMessage> _messages = [];
  bool _isReady = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Protobuf Bridge Demo'),
        backgroundColor: const Color(0xFF1E88E5),
        foregroundColor: Colors.white,
        actions: [
          if (_isReady)
            IconButton(
              icon: const Icon(Icons.send),
              onPressed: _sendProtobufData,
              tooltip: 'Send Protobuf',
            ),
          if (_isReady)
            IconButton(
              icon: const Icon(Icons.compare_arrows),
              onPressed: _sendJsonData,
              tooltip: 'Send JSON',
            ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            flex: 2,
            child: InAppWebView(
              initialData: InAppWebViewInitialData(data: _buildHtmlPage()),
              onWebViewCreated: (controller) {
                _controller = controller;
                _protobufBridge = ProtobufBridgeChannel(controller);
              },
              onLoadStop: (controller, url) {
                setState(() => _isReady = true);
                _addMessage('WebView ready', MessageType.system);
              },
              onConsoleMessage: (controller, message) {
                _addMessage(message.message, MessageType.console);
              },
            ),
          ),
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
                        Icon(Icons.message, size: 16),
                        SizedBox(width: 8),
                        Text(
                          'Bridge Messages',
                          style: TextStyle(fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ),
                  Expanded(
                    child: ListView.builder(
                      itemCount: _messages.length,
                      itemBuilder: (context, index) {
                        final msg = _messages[index];
                        return ListTile(
                          dense: true,
                          leading: Icon(
                            msg.type == MessageType.protobuf
                                ? Icons.flash_on
                                : msg.type == MessageType.json
                                ? Icons.code
                                : Icons.info,
                            size: 16,
                            color: msg.type == MessageType.protobuf
                                ? Colors.green
                                : msg.type == MessageType.json
                                ? Colors.orange
                                : Colors.grey,
                          ),
                          title: Text(
                            msg.message,
                            style: const TextStyle(fontSize: 12),
                          ),
                          subtitle: Text(
                            msg.timestamp,
                            style: TextStyle(
                              fontSize: 10,
                              color: Colors.grey.shade600,
                            ),
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

  void _addMessage(String message, MessageType type) {
    setState(() {
      _messages.add(
        BridgeMessage(
          message: message,
          type: type,
          timestamp: DateTime.now().toString().substring(11, 19),
        ),
      );
    });
  }

  Future<void> _sendProtobufData() async {
    if (_protobufBridge == null) return;

    _addMessage('Loading template...', MessageType.system);

    // Load and convert template
    final jsonString = await rootBundle.loadString(
      'assets/Template/demo/demo_template.json',
    );
    final jsonMap = jsonDecode(jsonString) as Map<String, dynamic>;
    final template = TemplateConverter.fromJson(jsonMap);

    final protobufSize = template.writeToBuffer().length;
    _addMessage(
      'Loaded: ${template.title} (${template.components.length} sections)',
      MessageType.system,
    );
    _addMessage(
      'Sending protobuf: ${(protobufSize / 1024).toStringAsFixed(2)} KB',
      MessageType.protobuf,
    );

    // Send template metadata first for display
    await _controller!.evaluateJavascript(
      source:
          '''
      window.templateMetadata = {
        title: "${template.title}",
        description: "${template.description}",
        version: "${template.version}",
        sections: ${template.components.length},
        totalComponents: ${template.components.fold(0, (sum, section) => sum + section.components.length)}
      };
    ''',
    );

    await _protobufBridge!.sendTemplate(template);
  }

  Future<void> _sendJsonData() async {
    if (_protobufBridge == null) return;

    _addMessage('Loading template...', MessageType.system);

    // Load JSON
    final jsonString = await rootBundle.loadString(
      'assets/Template/demo/demo_template.json',
    );
    final jsonMap = jsonDecode(jsonString) as Map<String, dynamic>;

    final componentCount =
        (jsonMap['components'] as List?)?.fold(
          0,
          (sum, section) => sum + (section as List).length,
        ) ??
        0;

    _addMessage(
      'Loaded: ${jsonMap['title']} ($componentCount components)',
      MessageType.system,
    );
    _addMessage(
      'Sending JSON: ${(jsonString.length / 1024).toStringAsFixed(2)} KB',
      MessageType.json,
    );

    // Send template metadata first for display
    await _controller!.evaluateJavascript(
      source:
          '''
      window.templateMetadata = {
        title: "${jsonMap['title']}",
        description: "${jsonMap['description']}",
        version: "${jsonMap['version']}",
        sections: ${(jsonMap['components'] as List?)?.length ?? 0},
        totalComponents: $componentCount
      };
    ''',
    );

    await _protobufBridge!.sendTemplateAsJson(jsonMap);
  }

  String _buildHtmlPage() {
    return '''
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
      max-width: 600px;
      margin: 0 auto;
    }
    h1 {
      font-size: 24px;
      margin-bottom: 20px;
      text-align: center;
    }
    .stats {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
    }
    .stat-item {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .stat-item:last-child {
      border-bottom: none;
    }
    .stat-label {
      font-weight: 600;
      opacity: 0.8;
    }
    .stat-value {
      font-weight: bold;
      font-size: 18px;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: bold;
      margin-left: 8px;
    }
    .badge-protobuf {
      background: #10b981;
    }
    .badge-json {
      background: #f59e0b;
    }
    .template-info {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 20px;
      display: none;
    }
    .template-info.visible {
      display: block;
    }
    .template-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 8px;
    }
    .template-detail {
      font-size: 13px;
      opacity: 0.9;
      margin: 4px 0;
    }
    #log {
      background: rgba(0, 0, 0, 0.3);
      border-radius: 8px;
      padding: 12px;
      max-height: 200px;
      overflow-y: auto;
      font-family: monospace;
      font-size: 12px;
    }
    .log-entry {
      padding: 4px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>⚡ Protobuf Bridge</h1>

    <div class="stats">
      <div class="stat-item">
        <span class="stat-label">Last Received</span>
        <span class="stat-value" id="lastType">-</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Size</span>
        <span class="stat-value" id="lastSize">-</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Total Messages</span>
        <span class="stat-value" id="totalMessages">0</span>
      </div>
    </div>

    <div id="templateInfo" class="template-info">
      <div class="template-title" id="templateTitle">-</div>
      <div class="template-detail" id="templateDescription">-</div>
      <div class="template-detail">
        📋 <span id="templateComponents">0</span> components in
        <span id="templateSections">0</span> sections
      </div>
      <div class="template-detail">
        🏷️ Version: <span id="templateVersion">-</span>
      </div>
    </div>

    <div id="log"></div>
  </div>

  <script>
    let messageCount = 0;
    const logEl = document.getElementById('log');

    function addLog(message, type = 'info') {
      const entry = document.createElement('div');
      entry.className = 'log-entry';
      entry.textContent = new Date().toLocaleTimeString() + ' - ' + message;
      logEl.appendChild(entry);
      logEl.scrollTop = logEl.scrollHeight;
      console.log(message);
    }

    function updateTemplateInfo() {
      if (window.templateMetadata) {
        const info = document.getElementById('templateInfo');
        info.classList.add('visible');

        document.getElementById('templateTitle').textContent =
          window.templateMetadata.title;
        document.getElementById('templateDescription').textContent =
          window.templateMetadata.description;
        document.getElementById('templateComponents').textContent =
          window.templateMetadata.totalComponents;
        document.getElementById('templateSections').textContent =
          window.templateMetadata.sections;
        document.getElementById('templateVersion').textContent =
          window.templateMetadata.version;
      }
    }

    // Handle Protobuf data
    window.addEventListener('formgear:template:protobuf', (event) => {
      messageCount++;
      const { bytes, size } = event.detail;

      document.getElementById('lastType').innerHTML =
        'Protobuf <span class="badge badge-protobuf">BINARY</span>';
      document.getElementById('lastSize').textContent =
        (size / 1024).toFixed(2) + ' KB';
      document.getElementById('totalMessages').textContent = messageCount;

      updateTemplateInfo();
      addLog('✓ Received protobuf: ' + size + ' bytes', 'protobuf');

      if (window.templateMetadata) {
        addLog('  → ' + window.templateMetadata.totalComponents + ' components loaded');
      }
    });

    // Handle JSON data
    window.addEventListener('formgear:template:json', (event) => {
      messageCount++;
      const { data, size } = event.detail;

      document.getElementById('lastType').innerHTML =
        'JSON <span class="badge badge-json">TEXT</span>';
      document.getElementById('lastSize').textContent =
        (size / 1024).toFixed(2) + ' KB';
      document.getElementById('totalMessages').textContent = messageCount;

      updateTemplateInfo();
      addLog('✓ Received JSON: ' + size + ' bytes', 'json');

      if (window.templateMetadata) {
        addLog('  → ' + window.templateMetadata.totalComponents + ' components loaded');
      }
    });

    addLog('WebView initialized - waiting for data...');
  </script>
</body>
</html>
    ''';
  }
}

enum MessageType { protobuf, json, system, console }

class BridgeMessage {
  final String message;
  final MessageType type;
  final String timestamp;

  BridgeMessage({
    required this.message,
    required this.type,
    required this.timestamp,
  });
}
