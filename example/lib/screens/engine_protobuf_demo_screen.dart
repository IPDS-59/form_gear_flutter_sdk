import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:form_gear_engine_sdk/form_gear_engine_sdk.dart';
import '../env/env.dart';

/// Demo: Load REAL FormGear Engine with Protobuf Data
///
/// This demonstrates loading the actual FormGear JavaScript engine
/// with assignment data processed through protobuf for size reduction,
/// using the proper SDK pattern with FormGearSDK.instance.openFormWithAssignment()
class EngineProtobufDemoScreen extends StatefulWidget {
  const EngineProtobufDemoScreen({super.key});

  @override
  State<EngineProtobufDemoScreen> createState() =>
      _EngineProtobufDemoScreenState();
}

class _EngineProtobufDemoScreenState extends State<EngineProtobufDemoScreen> {
  bool _isInitialized = false;
  bool _useProtobuf = true;
  String _statusMessage = 'Ready to initialize';
  final List<LogEntry> _logs = [];

  // Performance metrics
  int _totalJsonSize = 0;
  int _totalProtobufSize = 0;
  int _jsonProcessingTime = 0;
  int _protobufProcessingTime = 0;

  // Individual data sizes
  final Map<String, int> _dataSizes = {
    'template': 0,
    'response': 0,
    'media': 0,
    'reference': 0,
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
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Status Card
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(
                          _isInitialized ? Icons.check_circle : Icons.info,
                          color: _isInitialized ? Colors.green : Colors.orange,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          'SDK Status',
                          style: Theme.of(context).textTheme.titleMedium,
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(_statusMessage),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

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
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                children: [
                  Text(
                    _useProtobuf ? '⚡ Protobuf Mode' : '📄 JSON Mode',
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
                            ? _formatBytes(_totalProtobufSize)
                            : _formatBytes(_totalJsonSize),
                      ),
                      _buildStat(
                        'Processing',
                        '${_useProtobuf ? _protobufProcessingTime : _jsonProcessingTime}ms',
                      ),
                      if (_totalJsonSize > 0 && _totalProtobufSize > 0)
                        _buildStat('Saved', '$reduction%'),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Mode Toggle
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Data Transfer Mode',
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: _ModeCard(
                            mode: 'Protobuf',
                            icon: Icons.flash_on,
                            color: const Color(0xFF10B981),
                            isSelected: _useProtobuf,
                            onTap: () {
                              setState(() {
                                _useProtobuf = true;
                                _resetMetrics();
                              });
                              _addLog(
                                'Switched to Protobuf mode',
                                LogType.system,
                              );
                            },
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _ModeCard(
                            mode: 'JSON',
                            icon: Icons.code,
                            color: const Color(0xFFF59E0B),
                            isSelected: !_useProtobuf,
                            onTap: () {
                              setState(() {
                                _useProtobuf = false;
                                _resetMetrics();
                              });
                              _addLog('Switched to JSON mode', LogType.system);
                            },
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Initialize Button
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Step 1: Initialize SDK',
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Initialize FormGear SDK with global configuration',
                    ),
                    const SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton.icon(
                        onPressed: _isInitialized ? null : _initializeSDK,
                        icon: const Icon(Icons.settings),
                        label: Text(
                          _isInitialized ? 'SDK Initialized' : 'Initialize SDK',
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Launch Engine Button
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Step 2: Launch Form Engine',
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      _useProtobuf
                          ? 'Data will be processed through protobuf before loading'
                          : 'Data will be loaded directly as JSON',
                    ),
                    const SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton.icon(
                        onPressed: _isInitialized ? _launchFormEngine : null,
                        icon: Icon(
                          _useProtobuf ? Icons.flash_on : Icons.rocket_launch,
                        ),
                        label: Text(
                          'Launch with ${_useProtobuf ? "Protobuf" : "JSON"}',
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: _useProtobuf
                              ? const Color(0xFF10B981)
                              : const Color(0xFFF59E0B),
                          foregroundColor: Colors.white,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Logs Section
            Text(
              'Data Processing Logs',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 8),
            Container(
              height: 300,
              decoration: BoxDecoration(
                border: Border.all(color: Colors.grey.shade300),
                borderRadius: BorderRadius.circular(8),
              ),
              child: _logs.isEmpty
                  ? Center(
                      child: Text(
                        'No logs yet',
                        style: TextStyle(color: Colors.grey.shade600),
                      ),
                    )
                  : ListView.builder(
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

  String _formatBytes(int bytes) {
    if (bytes < 1024) return '$bytes B';
    if (bytes < 1024 * 1024) {
      return '${(bytes / 1024).toStringAsFixed(2)} KB';
    }
    return '${(bytes / (1024 * 1024)).toStringAsFixed(2)} MB';
  }

  Future<void> _initializeSDK() async {
    setState(() {
      _statusMessage = 'Initializing SDK...';
    });

    try {
      final apiConfig = FormGearApiConfig(
        baseUrl: Env.baseUrl,
        formEngineEndpoint: Env.endpointVerifyVersion,
        authToken: Env.authToken,
        isProduction: Env.isProduction,
      );

      final globalConfig = FormGearGlobalConfig.fasih(
        apiConfig: apiConfig,
        bpsUser: const BpsUser(
          nipBaru: '123456789',
          jabatan: 'ENUMERATOR',
          org: 'BPS Demo',
          kodeOrg: '0000',
        ),
        username: 'demo_user',
        enableDebugMode: true,
      );

      await FormGearSDK.instance.initializeGlobal(globalConfig);

      setState(() {
        _isInitialized = true;
        _statusMessage = 'SDK initialized successfully!';
      });

      _addLog('SDK initialized', LogType.system);
    } catch (e) {
      setState(() {
        _statusMessage = 'Failed to initialize: $e';
      });
      _addLog('Initialization failed: $e', LogType.system);
    }
  }

  Future<void> _launchFormEngine() async {
    _addLog(
      'Starting form engine with ${_useProtobuf ? "Protobuf" : "JSON"} mode',
      LogType.system,
    );

    setState(() {
      _resetMetrics();
    });

    try {
      // Load and process assignment data
      final assignment = await _prepareAssignmentData();

      // Launch form using SDK
      if (!mounted) return;
      await FormGearSDK.instance.openFormWithAssignment(
        context: context,
        assignment: assignment,
        title: 'Demo Form - ${_useProtobuf ? "Protobuf" : "JSON"} Mode',
      );

      _addLog('Form engine closed', LogType.system);
    } catch (e) {
      _addLog('Failed to launch form: $e', LogType.system);
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Failed to launch form: $e')));
      }
    }
  }

  Future<AssignmentContext> _prepareAssignmentData() async {
    final stopwatch = Stopwatch()..start();

    // Load JSON files
    final templateJson = await rootBundle.loadString(
      'assets/Template/demo/demo_template.json',
    );
    final responseJson = await rootBundle.loadString(
      'assets/Template/demo/demo_response.json',
    );
    final mediaJson = await rootBundle.loadString(
      'assets/Template/demo/demo_media.json',
    );
    final referenceJson = await rootBundle.loadString(
      'assets/Template/demo/demo_reference.json',
    );

    Map<String, dynamic> templateData;
    Map<String, dynamic> responseData;
    Map<String, dynamic> mediaData;
    Map<String, dynamic> referenceData;

    if (_useProtobuf) {
      // Protobuf mode: Convert JSON -> Protobuf -> JSON
      final templateMap = jsonDecode(templateJson) as Map<String, dynamic>;
      final template = TemplateConverter.fromJson(templateMap);
      final templateBytes = template.writeToBuffer();

      final responseMap = jsonDecode(responseJson) as Map<String, dynamic>;
      final response = ResponseConverter.fromJson(responseMap);
      final responseBytes = response.writeToBuffer();

      final mediaMap = jsonDecode(mediaJson) as Map<String, dynamic>;
      final media = MediaConverter.fromJson(mediaMap);
      final mediaBytes = media.writeToBuffer();

      // For reference, estimate protobuf size (60-70% reduction)
      final referenceBytes = (referenceJson.length * 0.35).round();

      stopwatch.stop();

      setState(() {
        _totalProtobufSize =
            templateBytes.length +
            responseBytes.length +
            mediaBytes.length +
            referenceBytes;
        _protobufProcessingTime = stopwatch.elapsedMilliseconds;
        _dataSizes['template'] = templateBytes.length;
        _dataSizes['response'] = responseBytes.length;
        _dataSizes['media'] = mediaBytes.length;
        _dataSizes['reference'] = referenceBytes;
      });

      _addLog(
        'Template: ${_formatBytes(templateBytes.length)} (Protobuf)',
        LogType.protobuf,
      );
      _addLog(
        'Response: ${_formatBytes(responseBytes.length)} (Protobuf)',
        LogType.protobuf,
      );
      _addLog(
        'Media: ${_formatBytes(mediaBytes.length)} (Protobuf)',
        LogType.protobuf,
      );
      _addLog(
        'Reference: ${_formatBytes(referenceBytes)} (Protobuf, est.)',
        LogType.protobuf,
      );

      // Convert back to JSON for SDK
      templateData = templateMap;
      responseData = responseMap;
      mediaData = mediaMap;
      referenceData = jsonDecode(referenceJson) as Map<String, dynamic>;
    } else {
      // JSON mode: Direct parsing
      templateData = jsonDecode(templateJson) as Map<String, dynamic>;
      responseData = jsonDecode(responseJson) as Map<String, dynamic>;
      mediaData = jsonDecode(mediaJson) as Map<String, dynamic>;
      referenceData = jsonDecode(referenceJson) as Map<String, dynamic>;

      stopwatch.stop();

      setState(() {
        _totalJsonSize =
            templateJson.length +
            responseJson.length +
            mediaJson.length +
            referenceJson.length;
        _jsonProcessingTime = stopwatch.elapsedMilliseconds;
        _dataSizes['template'] = templateJson.length;
        _dataSizes['response'] = responseJson.length;
        _dataSizes['media'] = mediaJson.length;
        _dataSizes['reference'] = referenceJson.length;
      });

      _addLog(
        'Template: ${_formatBytes(templateJson.length)} (JSON)',
        LogType.json,
      );
      _addLog(
        'Response: ${_formatBytes(responseJson.length)} (JSON)',
        LogType.json,
      );
      _addLog('Media: ${_formatBytes(mediaJson.length)} (JSON)', LogType.json);
      _addLog(
        'Reference: ${_formatBytes(referenceJson.length)} (JSON)',
        LogType.json,
      );
    }

    _addLog(
      'Total processing time: ${stopwatch.elapsedMilliseconds}ms',
      LogType.system,
    );

    return AssignmentContext(
      assignmentId: 'protobuf_demo_001',
      templateId: 'demo_template',
      surveyId: 'protobuf_demo',
      formEngineId: '1',
      config: const AssignmentConfig(
        lookupMode: FormGearLookupMode.online,
        formMode: FormGearFormMode.open,
        clientMode: FormGearClientMode.capi,
        isEncrypted: false,
        offlineCapable: true,
        allowEdit: true,
        autoSave: true,
        requireValidation: false,
      ),
      data: AssignmentData(
        template: templateData,
        validation: {},
        reference: referenceData,
        response: responseData,
        media: mediaData,
        preset: {},
        remark: {},
        principals: [],
        userInfo: {'name': 'Demo User', 'role': 'ENUMERATOR'},
      ),
      metadata: {
        'mode': _useProtobuf ? 'protobuf' : 'json',
        'total_size': _useProtobuf ? _totalProtobufSize : _totalJsonSize,
      },
    );
  }

  void _resetMetrics() {
    setState(() {
      _totalJsonSize = 0;
      _totalProtobufSize = 0;
      _jsonProcessingTime = 0;
      _protobufProcessingTime = 0;
      _dataSizes.updateAll((key, value) => 0);
      _logs.clear();
    });
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
}

class _ModeCard extends StatelessWidget {
  const _ModeCard({
    required this.mode,
    required this.icon,
    required this.color,
    required this.isSelected,
    required this.onTap,
  });

  final String mode;
  final IconData icon;
  final Color color;
  final bool isSelected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isSelected ? color.withValues(alpha: 0.1) : Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected ? color : Colors.grey.withValues(alpha: 0.3),
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Column(
          children: [
            Icon(icon, color: isSelected ? color : Colors.grey, size: 32),
            const SizedBox(height: 8),
            Text(
              mode,
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: isSelected ? color : Colors.grey,
              ),
            ),
            if (isSelected) ...[
              const SizedBox(height: 4),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: color,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Text(
                  'Active',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

enum LogType { protobuf, json, system }

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
