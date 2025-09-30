import 'package:flutter/material.dart';
import 'package:form_gear_engine_sdk/form_gear_engine_sdk.dart';

/// Demonstration screen showing how to use FormDataListener
/// for handling save/submit operations from FormGear and FasihForm engines
class FormDataListenerDemoScreen extends StatefulWidget {
  const FormDataListenerDemoScreen({super.key});

  @override
  State<FormDataListenerDemoScreen> createState() =>
      _FormDataListenerDemoScreenState();
}

class _FormDataListenerDemoScreenState
    extends State<FormDataListenerDemoScreen> {
  final List<String> _logs = [];
  late MyCustomFormDataListener _listener;

  @override
  void initState() {
    super.initState();
    _setupFormDataListener();
  }

  void _setupFormDataListener() {
    // Create your custom FormDataListener implementation
    _listener = MyCustomFormDataListener(
      onLog: (message) {
        setState(() {
          _logs.add('[${DateTime.now().toLocal()}] $message');
        });
      },
    );

    // Register the listener with the FormGear SDK
    FormGearSDK.instance.setFormDataListener(_listener);

    _addLog('FormDataListener registered successfully');
  }

  void _addLog(String message) {
    setState(() {
      _logs.add('[${DateTime.now().toLocal()}] $message');
    });
  }

  @override
  void dispose() {
    // Clean up listener when screen is disposed
    FormGearSDK.instance.removeFormDataListener();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FA),
      appBar: AppBar(
        title: const Text(
          'SaveOrSubmit Listener',
          style: TextStyle(fontWeight: FontWeight.w600),
        ),
        backgroundColor: Colors.white,
        foregroundColor: const Color(0xFF1A1A1A),
        elevation: 0,
        surfaceTintColor: Colors.transparent,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header Card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24.0),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [Color(0xFF4CAF50), Color(0xFF2E7D32)],
                ),
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF4CAF50).withValues(alpha: 0.3),
                    blurRadius: 20,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(
                          Icons.save_alt,
                          color: Colors.white,
                          size: 28,
                        ),
                      ),
                      const SizedBox(width: 16),
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Data Persistence Demo',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 22,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            SizedBox(height: 4),
                            Text(
                              'Test custom listener implementations',
                              style: TextStyle(
                                color: Colors.white70,
                                fontSize: 14,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Simulate save/submit operations to see how your FormDataListener handles data persistence with FASIH-compliant patterns.',
                    style: TextStyle(
                      color: Colors.white.withValues(alpha: 0.9),
                      fontSize: 15,
                      height: 1.5,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Action Buttons
            const Text(
              'Test Operations',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: Color(0xFF1A1A1A),
              ),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: _buildActionButton(
                    label: 'FormGear Save',
                    subtitle: '6 parameters',
                    icon: Icons.description,
                    gradient: const LinearGradient(
                      colors: [Color(0xFF2196F3), Color(0xFF1976D2)],
                    ),
                    onPressed: _simulateFormGearSave,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildActionButton(
                    label: 'FasihForm Submit',
                    subtitle: '4 parameters',
                    icon: Icons.send,
                    gradient: const LinearGradient(
                      colors: [Color(0xFF9C27B0), Color(0xFF673AB7)],
                    ),
                    onPressed: _simulateFasihFormSubmit,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: _buildActionButton(
                    label: 'Error Test',
                    subtitle: 'Retry logic',
                    icon: Icons.error_outline,
                    gradient: const LinearGradient(
                      colors: [Color(0xFFFF5722), Color(0xFFD32F2F)],
                    ),
                    onPressed: _simulateError,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildActionButton(
                    label: 'Clear Logs',
                    subtitle: 'Reset view',
                    icon: Icons.clear_all,
                    gradient: const LinearGradient(
                      colors: [Color(0xFF607D8B), Color(0xFF455A64)],
                    ),
                    onPressed: _clearLogs,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 32),

            // Logs Section
            Row(
              children: [
                const Text(
                  'Operation Logs',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF1A1A1A),
                  ),
                ),
                const Spacer(),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: const Color(0xFF4CAF50).withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    '${_logs.length} entries',
                    style: const TextStyle(
                      color: Color(0xFF2E7D32),
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            // Logs Container
            Container(
              height: MediaQuery.of(context).size.height * 0.4,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.05),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: _logs.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Container(
                            padding: const EdgeInsets.all(20),
                            decoration: BoxDecoration(
                              color: const Color(0xFFF8F9FA),
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: const Icon(
                              Icons.pending_actions,
                              size: 48,
                              color: Color(0xFF9E9E9E),
                            ),
                          ),
                          const SizedBox(height: 16),
                          const Text(
                            'No operations logged yet',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                              color: Color(0xFF424242),
                            ),
                          ),
                          const SizedBox(height: 8),
                          const Text(
                            'Try the buttons above to simulate\nsave/submit operations',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              color: Color(0xFF9E9E9E),
                              fontSize: 14,
                            ),
                          ),
                        ],
                      ),
                    )
                  : ListView.builder(
                      padding: const EdgeInsets.all(16),
                      itemCount: _logs.length,
                      itemBuilder: (context, index) {
                        final log = _logs[index];
                        final isError =
                            log.contains('ERROR') || log.contains('Failed');
                        final isSuccess =
                            log.contains('SUCCESS') ||
                            log.contains('completed');

                        return Container(
                          margin: const EdgeInsets.only(bottom: 8.0),
                          padding: const EdgeInsets.all(12.0),
                          decoration: BoxDecoration(
                            color: isError
                                ? const Color(0xFFFFF5F5)
                                : isSuccess
                                ? const Color(0xFFF0FDF4)
                                : const Color(0xFFF8F9FA),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(
                              color: isError
                                  ? const Color(0xFFFECACA)
                                  : isSuccess
                                  ? const Color(0xFFBBF7D0)
                                  : const Color(0xFFE5E7EB),
                              width: 1,
                            ),
                          ),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                width: 6,
                                height: 6,
                                margin: const EdgeInsets.only(top: 6, right: 8),
                                decoration: BoxDecoration(
                                  color: isError
                                      ? const Color(0xFFEF4444)
                                      : isSuccess
                                      ? const Color(0xFF10B981)
                                      : const Color(0xFF6B7280),
                                  borderRadius: BorderRadius.circular(3),
                                ),
                              ),
                              Expanded(
                                child: Text(
                                  log,
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontFamily: 'monospace',
                                    height: 1.4,
                                    color: isError
                                        ? const Color(0xFF991B1B)
                                        : isSuccess
                                        ? const Color(0xFF047857)
                                        : const Color(0xFF374151),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildActionButton({
    required String label,
    required String subtitle,
    required IconData icon,
    required Gradient gradient,
    required VoidCallback onPressed,
  }) {
    return GestureDetector(
      onTap: onPressed,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          gradient: gradient,
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.1),
              blurRadius: 8,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          children: [
            Icon(
              icon,
              color: Colors.white,
              size: 24,
            ),
            const SizedBox(height: 8),
            Text(
              label,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 14,
                fontWeight: FontWeight.w600,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 4),
            Text(
              subtitle,
              style: TextStyle(
                color: Colors.white.withValues(alpha: 0.8),
                fontSize: 12,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  void _simulateFormGearSave() async {
    _addLog('Simulating FormGear save operation...');

    try {
      // Create mock assignment context
      final assignment = AssignmentContext(
        assignmentId:
            'demo_assignment_${DateTime.now().millisecondsSinceEpoch}',
        templateId: 'demo_template_fg',
        surveyId: 'demo_survey_2024',
        config: AssignmentConfig.capi(),
        data: AssignmentData.empty(),
      );

      // Create mock save data for FormGear
      final saveData = SaveSubmitData.formGear(
        assignmentContext: assignment,
        formData: '{"question1": "answer1", "question2": "answer2"}',
        remark: '{"notes": "Demo save operation"}',
        principal: '{"signature": "demo_signature"}',
        reference: '{"lookup_data": []}',
        media: '{"images": []}',
        flag: 'save',
        metadata: {'demo': true, 'screen': 'FormDataListenerDemo'},
      );

      // Simulate the listener call
      final result = await _listener.onSaveOrSubmit(saveData);

      if (result.isSuccess) {
        _addLog(
          'SUCCESS: FormGear save completed with ID: ${result.submissionId}',
        );
      } else {
        _addLog('ERROR: FormGear save failed: ${result.error}');
      }
    } catch (e) {
      _addLog('ERROR: Exception during FormGear save simulation: $e');
    }
  }

  void _simulateFasihFormSubmit() async {
    _addLog('Simulating FasihForm submit operation...');

    try {
      // Create mock assignment context
      final assignment = AssignmentContext(
        assignmentId:
            'demo_assignment_${DateTime.now().millisecondsSinceEpoch}',
        templateId: 'demo_template_ff',
        surveyId: 'demo_survey_2024',
        config: AssignmentConfig.capi(),
        data: AssignmentData.empty(),
      );

      // Create mock submit data for FasihForm
      final submitData = SaveSubmitData.fasihForm(
        assignmentContext: assignment,
        formData: '{"respondent": "John Doe", "answers": ["A", "B", "C"]}',
        remark: '{"interviewer_notes": "Final submission"}',
        principal: '{"supervisor_approval": "approved"}',
        flag: 'submit',
        metadata: {'demo': true, 'screen': 'FormDataListenerDemo'},
      );

      // Simulate the listener call
      final result = await _listener.onSaveOrSubmitFasihForm(submitData);

      if (result.isSuccess) {
        _addLog(
          'SUCCESS: FasihForm submit completed with ID: ${result.submissionId}',
        );
      } else {
        _addLog('ERROR: FasihForm submit failed: ${result.error}');
      }
    } catch (e) {
      _addLog('ERROR: Exception during FasihForm submit simulation: $e');
    }
  }

  void _simulateError() async {
    _addLog('Simulating error scenario...');

    try {
      // Create mock assignment context
      final assignment = AssignmentContext(
        assignmentId: 'error_assignment',
        templateId: 'error_template',
        surveyId: 'error_survey',
        config: AssignmentConfig.capi(),
        data: AssignmentData.empty(),
      );

      // Create save data that will trigger an error
      final saveData = SaveSubmitData.formGear(
        assignmentContext: assignment,
        formData: '{"trigger_error": true}',
        remark: '{}',
        principal: '{}',
        reference: '{}',
        media: '{}',
        flag: 'save',
        metadata: {'demo': true, 'simulate_error': true},
      );

      // Force the listener to simulate an error
      _listener.simulateError = true;
      final result = await _listener.onSaveOrSubmit(saveData);
      _listener.simulateError = false;

      if (result.isSuccess) {
        _addLog('Unexpected SUCCESS: Error simulation should have failed');
      } else {
        _addLog('Expected ERROR: ${result.error} (Code: ${result.errorCode})');
      }
    } catch (e) {
      _addLog('ERROR: Exception during error simulation: $e');
    }
  }

  void _clearLogs() {
    setState(() {
      _logs.clear();
    });
  }
}

/// Custom FormDataListener implementation for demonstration
class MyCustomFormDataListener extends BaseFormDataListener {
  MyCustomFormDataListener({this.onLog});

  final void Function(String message)? onLog;
  bool simulateError = false;

  void _log(String message) {
    onLog?.call(message);
    // Log message is handled by onLog callback for demo purposes
  }

  @override
  Future<SaveSubmitResult> onSaveOrSubmit(SaveSubmitData data) async {
    _log(
      'Processing FormGear save/submit for assignment: ${data.assignmentId}',
    );
    return _handleSaveSubmit(data, 'FormGear');
  }

  @override
  Future<SaveSubmitResult> onSaveOrSubmitFasihForm(SaveSubmitData data) async {
    _log(
      'Processing FasihForm save/submit for assignment: ${data.assignmentId}',
    );
    return _handleSaveSubmit(data, 'FasihForm');
  }

  Future<SaveSubmitResult> _handleSaveSubmit(
    SaveSubmitData data,
    String engineType,
  ) async {
    try {
      // Simulate processing time
      await Future.delayed(const Duration(milliseconds: 500));

      // Check for error simulation
      if (simulateError || data.metadata?['simulate_error'] == true) {
        throw Exception('Simulated error for demonstration');
      }

      // Log data details
      _log('$engineType Data Details:');
      _log('  - Assignment ID: ${data.assignmentId}');
      _log('  - Template ID: ${data.templateId}');
      _log('  - Operation: ${data.flag}');
      _log('  - Form Data: ${data.formData.length} characters');

      if (data.isFormGear) {
        _log('  - Reference Data: ${data.reference?.length ?? 0} characters');
        _log('  - Media Data: ${data.media?.length ?? 0} characters');
      }

      // Simulate saving to database/file system
      _log('Saving data to persistent storage...');
      await Future.delayed(const Duration(milliseconds: 300));

      // Generate submission ID
      final submissionId =
          'demo_${data.assignmentId}_${DateTime.now().millisecondsSinceEpoch}';

      _log('Data saved successfully with submission ID: $submissionId');

      return SaveSubmitResult.success(
        submissionId: submissionId,
        metadata: {
          'engine_type': engineType,
          'assignment_id': data.assignmentId,
          'operation': data.flag,
          'demo_mode': true,
        },
      );
    } catch (e, stackTrace) {
      _log('ERROR: Failed to save data: $e');
      return SaveSubmitResult.fromException(e, stackTrace);
    }
  }

  @override
  Future<void> onSaveOrSubmitError(
    SaveSubmitData data,
    Object error,
    StackTrace? stackTrace,
  ) async {
    _log('ERROR occurred for assignment ${data.assignmentId}: $error');
  }

  @override
  Future<void> onSaveOrSubmitStarted(SaveSubmitData data) async {
    _log('Started processing save/submit for assignment: ${data.assignmentId}');
  }

  @override
  Future<void> onSaveOrSubmitCompleted(
    SaveSubmitData data,
    SaveSubmitResult result,
  ) async {
    if (result.isSuccess) {
      _log(
        'Completed processing for assignment ${data.assignmentId} successfully',
      );
    } else {
      _log(
        'Completed processing for assignment ${data.assignmentId} with error: ${result.error}',
      );
    }
  }
}
