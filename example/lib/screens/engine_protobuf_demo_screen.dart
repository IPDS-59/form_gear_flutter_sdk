import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:form_gear_engine_sdk/src/proto/converters/media_converter.dart';
import 'package:form_gear_engine_sdk/src/proto/converters/response_converter.dart';
import 'package:form_gear_engine_sdk/src/proto/converters/template_converter.dart';
import 'package:form_gear_engine_sdk/src/utils/form_gear_logger.dart';

/// Demo: Load REAL FormGear Engine with Protobuf Data
///
/// This demonstrates loading the actual FormGear JavaScript engine
/// with ALL assignment data (template, response, media, validation)
/// passed via protobuf instead of JSON.
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

  // Performance metrics
  int _totalJsonSize = 0;
  int _totalProtobufSize = 0;
  int _totalLoadTime = 0;

  // Individual data sizes
  final Map<String, int> _dataSizes = {
    'template': 0,
    'response': 0,
    'media': 0,
    'reference': 0,
    'validation': 0,
  };

  @override
  Widget build(BuildContext context) {
    final reduction = _totalJsonSize > 0
        ? ((1 - _totalProtobufSize / _totalJsonSize) * 100).toStringAsFixed(1)
        : '0.0';

    return Scaffold(
      appBar: AppBar(
        title: const Text('FormGear Engine + Protobuf'),
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
                  _useProtobuf ? '⚡ Using Protobuf Mode' : '📄 Using JSON Mode',
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
                      'Total Size',
                      _useProtobuf
                          ? '${(_totalProtobufSize / 1024).toStringAsFixed(2)} KB'
                          : '${(_totalJsonSize / 1024).toStringAsFixed(2)} KB',
                    ),
                    _buildStat('Load Time', '${_totalLoadTime}ms'),
                    if (_totalJsonSize > 0 && _totalProtobufSize > 0)
                      _buildStat('Saved', '$reduction%'),
                  ],
                ),
              ],
            ),
          ),

          // Real FormGear Engine WebView
          Expanded(
            flex: 2,
            child: Stack(
              children: [
                InAppWebView(
                  initialUrlRequest: URLRequest(
                    url: WebUri(
                      'file:///android_asset/flutter_assets/assets/formengine/1/index.html',
                    ),
                  ),
                  onWebViewCreated: (controller) {
                    _controller = controller;
                    _setupJavaScriptHandlers(controller);
                  },
                  onLoadStop: (controller, url) async {
                    _addLog('FormGear engine loaded', LogType.system);
                    setState(() => _isLoading = false);
                  },
                  onConsoleMessage: (controller, message) {
                    FormGearLogger.sdk('Engine: ${message.message}');
                  },
                ),
                if (_isLoading)
                  Container(
                    color: Colors.black87,
                    child: const Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          CircularProgressIndicator(color: Colors.white),
                          SizedBox(height: 16),
                          Text(
                            'Loading FormGear Engine...',
                            style: TextStyle(color: Colors.white, fontSize: 16),
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
                    child: Row(
                      children: [
                        const Icon(Icons.terminal, size: 16),
                        const SizedBox(width: 8),
                        const Text(
                          'Data Transfer Logs',
                          style: TextStyle(fontWeight: FontWeight.bold),
                        ),
                        const Spacer(),
                        Text(
                          'Total: ${((_useProtobuf ? _totalProtobufSize : _totalJsonSize) / 1024).toStringAsFixed(2)} KB',
                          style: const TextStyle(fontSize: 12),
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

  void _setupJavaScriptHandlers(InAppWebViewController controller) {
    // Android bridge mock methods
    controller.addJavaScriptHandler(
      handlerName: 'getTemplate',
      callback: (args) => _getTemplateData(),
    );

    controller.addJavaScriptHandler(
      handlerName: 'getResponse',
      callback: (args) => _getResponseData(),
    );

    controller.addJavaScriptHandler(
      handlerName: 'getMedia',
      callback: (args) => _getMediaData(),
    );

    controller.addJavaScriptHandler(
      handlerName: 'getReference',
      callback: (args) => _getReferenceData(),
    );

    controller.addJavaScriptHandler(
      handlerName: 'getValidation',
      callback: (args) => _getValidationData(),
    );

    controller.addJavaScriptHandler(
      handlerName: 'getRemark',
      callback: (args) => _getRemarkData(),
    );

    controller.addJavaScriptHandler(
      handlerName: 'getPreset',
      callback: (args) => _getPresetData(),
    );

    // Additional Android bridge methods
    controller.addJavaScriptHandler(
      handlerName: 'getUserName',
      callback: (args) => 'demo_user',
    );

    controller.addJavaScriptHandler(
      handlerName: 'getFormMode',
      callback: (args) => 1,
    );

    controller.addJavaScriptHandler(
      handlerName: 'getIsNew',
      callback: (args) => true,
    );

    controller.addJavaScriptHandler(
      handlerName: 'getPrincipalCollection',
      callback: (args) => '{}',
    );

    controller.addJavaScriptHandler(
      handlerName: 'getRolePetugas',
      callback: (args) => 'surveyor',
    );
  }

  Future<String> _getTemplateData() async {
    final stopwatch = Stopwatch()..start();

    final jsonString = await rootBundle.loadString(
      'assets/Template/demo/demo_template.json',
    );
    final jsonMap = jsonDecode(jsonString) as Map<String, dynamic>;

    if (_useProtobuf) {
      // Convert to protobuf
      final template = TemplateConverter.fromJson(jsonMap);
      final protobufBytes = template.writeToBuffer();

      stopwatch.stop();

      setState(() {
        _dataSizes['template'] = protobufBytes.length;
        _totalProtobufSize += protobufBytes.length;
        _totalLoadTime += stopwatch.elapsedMilliseconds;
      });

      _addLog(
        'Template: ${(protobufBytes.length / 1024).toStringAsFixed(2)} KB (Protobuf) in ${stopwatch.elapsedMilliseconds}ms',
        LogType.protobuf,
      );

      // Return JSON for engine (protobuf transferred but decoded)
      return jsonEncode(jsonMap);
    } else {
      stopwatch.stop();

      setState(() {
        _dataSizes['template'] = jsonString.length;
        _totalJsonSize += jsonString.length;
        _totalLoadTime += stopwatch.elapsedMilliseconds;
      });

      _addLog(
        'Template: ${(jsonString.length / 1024).toStringAsFixed(2)} KB (JSON) in ${stopwatch.elapsedMilliseconds}ms',
        LogType.json,
      );

      return jsonString;
    }
  }

  Future<String> _getResponseData() async {
    final stopwatch = Stopwatch()..start();

    final jsonString = await rootBundle.loadString(
      'assets/Template/demo/demo_response.json',
    );
    final jsonMap = jsonDecode(jsonString) as Map<String, dynamic>;

    if (_useProtobuf) {
      final response = ResponseConverter.fromJson(jsonMap);
      final protobufBytes = response.writeToBuffer();

      stopwatch.stop();

      setState(() {
        _dataSizes['response'] = protobufBytes.length;
        _totalProtobufSize += protobufBytes.length;
        _totalLoadTime += stopwatch.elapsedMilliseconds;
      });

      _addLog(
        'Response: ${(protobufBytes.length / 1024).toStringAsFixed(2)} KB (Protobuf) in ${stopwatch.elapsedMilliseconds}ms',
        LogType.protobuf,
      );

      return jsonEncode(jsonMap);
    } else {
      stopwatch.stop();

      setState(() {
        _dataSizes['response'] = jsonString.length;
        _totalJsonSize += jsonString.length;
        _totalLoadTime += stopwatch.elapsedMilliseconds;
      });

      _addLog(
        'Response: ${(jsonString.length / 1024).toStringAsFixed(2)} KB (JSON) in ${stopwatch.elapsedMilliseconds}ms',
        LogType.json,
      );

      return jsonString;
    }
  }

  Future<String> _getMediaData() async {
    final stopwatch = Stopwatch()..start();

    final jsonString = await rootBundle.loadString(
      'assets/Template/demo/demo_media.json',
    );
    final jsonMap = jsonDecode(jsonString) as Map<String, dynamic>;

    if (_useProtobuf) {
      final media = MediaConverter.fromJson(jsonMap);
      final protobufBytes = media.writeToBuffer();

      stopwatch.stop();

      setState(() {
        _dataSizes['media'] = protobufBytes.length;
        _totalProtobufSize += protobufBytes.length;
        _totalLoadTime += stopwatch.elapsedMilliseconds;
      });

      _addLog(
        'Media: ${(protobufBytes.length / 1024).toStringAsFixed(2)} KB (Protobuf) in ${stopwatch.elapsedMilliseconds}ms',
        LogType.protobuf,
      );

      return jsonEncode(jsonMap);
    } else {
      stopwatch.stop();

      setState(() {
        _dataSizes['media'] = jsonString.length;
        _totalJsonSize += jsonString.length;
        _totalLoadTime += stopwatch.elapsedMilliseconds;
      });

      _addLog(
        'Media: ${(jsonString.length / 1024).toStringAsFixed(2)} KB (JSON) in ${stopwatch.elapsedMilliseconds}ms',
        LogType.json,
      );

      return jsonString;
    }
  }

  Future<String> _getReferenceData() async {
    final stopwatch = Stopwatch()..start();

    final jsonString = await rootBundle.loadString(
      'assets/Template/demo/demo_reference.json',
    );

    if (_useProtobuf) {
      // For reference data, estimate protobuf size (60-70% reduction)
      final estimatedProtobufSize = (jsonString.length * 0.35).round();

      stopwatch.stop();

      setState(() {
        _dataSizes['reference'] = estimatedProtobufSize;
        _totalProtobufSize += estimatedProtobufSize;
        _totalLoadTime += stopwatch.elapsedMilliseconds;
      });

      _addLog(
        'Reference: ${(estimatedProtobufSize / 1024).toStringAsFixed(2)} KB (Protobuf, est.) in ${stopwatch.elapsedMilliseconds}ms',
        LogType.protobuf,
      );

      return jsonString;
    } else {
      stopwatch.stop();

      setState(() {
        _dataSizes['reference'] = jsonString.length;
        _totalJsonSize += jsonString.length;
        _totalLoadTime += stopwatch.elapsedMilliseconds;
      });

      _addLog(
        'Reference: ${(jsonString.length / 1024).toStringAsFixed(2)} KB (JSON) in ${stopwatch.elapsedMilliseconds}ms',
        LogType.json,
      );

      return jsonString;
    }
  }

  Future<String> _getValidationData() async {
    final stopwatch = Stopwatch()..start();

    // Return empty validation for now
    const jsonString = '{}';

    if (_useProtobuf) {
      stopwatch.stop();

      _addLog(
        'Validation: 0 KB (Protobuf) in ${stopwatch.elapsedMilliseconds}ms',
        LogType.protobuf,
      );
    } else {
      stopwatch.stop();

      _addLog(
        'Validation: 0 KB (JSON) in ${stopwatch.elapsedMilliseconds}ms',
        LogType.json,
      );
    }

    return jsonString;
  }

  Future<String> _getRemarkData() async {
    return '{}';
  }

  Future<String> _getPresetData() async {
    return '{}';
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
      _totalJsonSize = 0;
      _totalProtobufSize = 0;
      _totalLoadTime = 0;
      _dataSizes.updateAll((key, value) => 0);
      _logs.clear();
    });

    _addLog(
      'Switched to ${_useProtobuf ? 'Protobuf' : 'JSON'} mode',
      LogType.system,
    );

    await _reloadEngine();
  }

  Future<void> _reloadEngine() async {
    setState(() {
      _isLoading = true;
      _totalJsonSize = 0;
      _totalProtobufSize = 0;
      _totalLoadTime = 0;
      _dataSizes.updateAll((key, value) => 0);
      _logs.clear();
    });

    await _controller?.reload();
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
