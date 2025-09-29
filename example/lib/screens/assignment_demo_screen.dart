import 'package:flutter/material.dart';
import 'package:form_gear_engine_sdk/form_gear_engine_sdk.dart';
import '../env/env.dart';
import 'demo_template_loader.dart';

/// Modern assignment card widget with Material Design 3
class AssignmentCard extends StatelessWidget {
  const AssignmentCard({
    super.key,
    required this.title,
    required this.subtitle,
    required this.description,
    required this.config,
    required this.gradientColors,
    required this.onTap,
    required this.isEnabled,
  });

  final String title;
  final String subtitle;
  final String description;
  final String config;
  final List<Color> gradientColors;
  final VoidCallback onTap;
  final bool isEnabled;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        gradient: LinearGradient(
          colors: gradientColors,
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        boxShadow: [
          BoxShadow(
            color: gradientColors.first.withValues(alpha: 0.3),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: isEnabled ? onTap : null,
          borderRadius: BorderRadius.circular(12),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            title,
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            subtitle,
                            style: TextStyle(
                              fontSize: 13,
                              color: Colors.white.withValues(alpha: 0.8),
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Icon(
                      isEnabled ? Icons.arrow_forward_ios : Icons.lock_outline,
                      color: Colors.white.withValues(alpha: 0.7),
                      size: 16,
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Text(
                  description,
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.white.withValues(alpha: 0.9),
                  ),
                ),
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    config,
                    style: const TextStyle(
                      fontSize: 11,
                      color: Colors.white,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// Demo screen showcasing the new assignment-based dynamic configuration
/// This demonstrates how different templates can have different configurations
class AssignmentDemoScreen extends StatefulWidget {
  const AssignmentDemoScreen({super.key});

  @override
  State<AssignmentDemoScreen> createState() => _AssignmentDemoScreenState();
}

class _AssignmentDemoScreenState extends State<AssignmentDemoScreen> {
  bool _isInitialized = false;
  String _statusMessage = 'Ready to initialize global configuration';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Assignment-Based Configuration'),
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

            // Global Initialization
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Step 1: Global Initialization',
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Initialize the SDK with global configuration (API endpoints, authentication) that applies to all assignments.',
                    ),
                    const SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton.icon(
                        onPressed: _isInitialized ? null : _initializeGlobal,
                        icon: const Icon(Icons.settings),
                        label: Text(
                          _isInitialized
                              ? 'Global Config Initialized'
                              : 'Initialize Global Config',
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Assignment Examples
            Text(
              'Step 2: Open Forms with Assignment Context',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 16),

            // Scenario 1: New Assignment (Empty data)
            AssignmentCard(
              title: 'New Assignment (Empty)',
              subtitle: 'Online lookup + Fresh form',
              description:
                  'New form with template & validation only, online lookup',
              config: 'Lookup: Online • Form: Open • State: New',
              gradientColors: const [Color(0xFF4CAF50), Color(0xFF45A049)],
              isEnabled: _isInitialized,
              onTap: () async {
                final assignment = await _createNewAssignment();
                await _openAssignment(assignment);
              },
            ),
            const SizedBox(height: 12),

            // Scenario 2: Existing Assignment with Data
            AssignmentCard(
              title: 'Existing Assignment (With Data)',
              subtitle: 'Offline lookup + Pre-filled form',
              description:
                  'Existing form with response, media & remarks, offline lookup',
              config: 'Lookup: Offline • Form: Open • State: In Progress',
              gradientColors: const [Color(0xFFFF9800), Color(0xFFFF6F00)],
              isEnabled: _isInitialized,
              onTap: () async {
                final assignment = await _createExistingAssignment();
                await _openAssignment(assignment);
              },
            ),
            const SizedBox(height: 12),

            // Scenario 3: Review Assignment
            AssignmentCard(
              title: 'Review Assignment (Read-only)',
              subtitle: 'Online lookup + Review mode',
              description:
                  'Completed form in review mode, online lookup for validation',
              config: 'Lookup: Online • Form: Submitted • State: Review',
              gradientColors: const [Color(0xFF9C27B0), Color(0xFF673AB7)],
              isEnabled: _isInitialized,
              onTap: () async {
                final assignment = await _createReviewAssignment();
                await _openAssignment(assignment);
              },
            ),
            const SizedBox(height: 32),

            // Implementation Details
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Dynamic Configuration Benefits',
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    const SizedBox(height: 12),
                    const Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('✅ Template-specific lookup modes'),
                        Text('✅ Assignment-based form configurations'),
                        Text('✅ Dynamic engine selection'),
                        Text('✅ Context-aware JavaScript handlers'),
                        Text('✅ Per-assignment user permissions'),
                        Text('✅ FASIH-compatible architecture'),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _initializeGlobal() async {
    setState(() {
      _statusMessage = 'Initializing global configuration...';
    });

    try {
      // Create API configuration
      final apiConfig = FormGearApiConfig(
        baseUrl: Env.baseUrl,
        templateZipEndpoint: Env.endpointTemplateDownload,
        formEngineEndpoint: Env.endpointVerifyVersion,
        lookupEndpoint: Env.endpointLookup,
        authToken: Env.wilkerstatBearerToken,
        isProduction: Env.isProduction,
      );

      // Create global configuration with default assignment config
      final globalConfig = FormGearGlobalConfig.fasih(
        apiConfig: apiConfig,
        bpsUser: const BpsUser(
          nipBaru: '123456789',
          jabatan: 'ENUMERATOR',
          org: 'BPS Jawa Barat',
          kodeOrg: '3200',
        ),
        username: 'demo_user',
        enableDebugMode: true,
      );

      // Initialize SDK with global configuration
      await FormGearSDK.instance.initializeGlobal(globalConfig);

      setState(() {
        _isInitialized = true;
        _statusMessage = 'Global configuration initialized successfully!';
      });
    } catch (e) {
      setState(() {
        _statusMessage = 'Failed to initialize: $e';
      });
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Initialization failed: $e')));
      }
    }
  }

  Future<void> _openAssignment(AssignmentContext assignment) async {
    if (!_isInitialized) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please initialize global configuration first'),
        ),
      );
      return;
    }

    try {
      await FormGearSDK.instance.openFormWithAssignment(
        context: context,
        assignment: assignment,
        title: 'Assignment: ${assignment.assignmentId}',
      );
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to open assignment: $e')),
        );
      }
    }
  }

  /// Scenario 1: Create new assignment with empty data (only template & validation)
  Future<AssignmentContext> _createNewAssignment() async {
    final data = await DemoTemplateLoader.loadNewAssignmentData();

    return AssignmentContext(
      assignmentId: 'new_assignment_001',
      templateId: 'demo_template',
      surveyId: 'family_characteristics_2024',
      config: const AssignmentConfig(
        lookupMode:
            FormGearLookupMode.online, // Online lookup for real-time data
        formMode: FormGearFormMode.open,
        clientMode: FormGearClientMode.capi,
        isEncrypted: false,
        offlineCapable: true,
        allowEdit: true,
        autoSave: true,
        requireValidation: true,
      ),
      data: AssignmentData(
        template: _convertToStringDynamicMap(data['template']),
        validation: _convertToStringDynamicMap(data['validation']),
        reference: _convertToStringDynamicMap(data['reference']),
        response: _convertToStringDynamicMap(
          data['response'],
        ), // Empty responses
        media: _convertToStringDynamicMap(data['media']), // Empty media
        preset: _convertToStringDynamicMap(data['preset']), // Empty preset
        remark: _convertToStringDynamicMap(data['remark']), // Empty remarks
        principals: [
          {'name': 'Supervisor A', 'role': 'SUPERVISOR'},
        ],
        userInfo: {
          'name': 'Field Enumerator',
          'role': 'ENUMERATOR',
          'permissions': ['read', 'write', 'submit'],
          'nip': '123456789',
        },
      ),
      metadata: {
        'created_at': DateTime.now().toIso8601String(),
        'status': 'new',
        'priority': 'high',
        'region': 'Jakarta',
        'assignment_type': 'new_collection',
      },
    );
  }

  /// Scenario 2: Create existing assignment with response, media, and remarks
  Future<AssignmentContext> _createExistingAssignment() async {
    final data = await DemoTemplateLoader.loadAllAssignmentData();

    return AssignmentContext(
      assignmentId: 'existing_assignment_002',
      templateId: 'demo_template',
      surveyId: 'family_characteristics_2024',
      config: const AssignmentConfig(
        lookupMode: FormGearLookupMode.online,
        formMode: FormGearFormMode.open,
        clientMode: FormGearClientMode.capi,
        isEncrypted: true,
        offlineCapable: true,
        allowEdit: true,
        autoSave: true,
        requireValidation: false,
      ),
      data: AssignmentData(
        template: _convertToStringDynamicMap(data['template']),
        validation: _convertToStringDynamicMap(data['validation']),
        reference: _convertToStringDynamicMap(data['reference']),
        response: _convertToStringDynamicMap(
          data['response'],
        ), // Existing responses from previous work
        media: _convertToStringDynamicMap(
          data['media'],
        ), // Existing media files
        preset: _convertToStringDynamicMap(data['preset']),
        remark: _convertToStringDynamicMap(data['remark']), // Existing remarks
        principals: [
          {'name': 'Field Supervisor', 'role': 'SUPERVISOR'},
        ],
        userInfo: {
          'name': 'Field Enumerator',
          'role': 'ENUMERATOR',
          'permissions': ['read', 'write', 'update'],
          'nip': '456789123',
        },
      ),
      metadata: {
        'created_at': DateTime.now()
            .subtract(const Duration(days: 2))
            .toIso8601String(),
        'last_modified': DateTime.now()
            .subtract(const Duration(hours: 4))
            .toIso8601String(),
        'status': 'in_progress',
        'priority': 'medium',
        'region': 'Remote Area',
        'assignment_type': 'existing_collection',
        'completion_rate': '75%',
      },
    );
  }

  /// Scenario 3: Create review assignment for completed forms (read-only mode)
  Future<AssignmentContext> _createReviewAssignment() async {
    final data = await DemoTemplateLoader.loadAllAssignmentData();

    return AssignmentContext(
      assignmentId: 'review_assignment_003',
      templateId: 'demo_template',
      surveyId: 'family_characteristics_2024',
      config: const AssignmentConfig(
        lookupMode: FormGearLookupMode.online, // Online lookup for validation
        formMode: FormGearFormMode.submitted, // Read-only submitted form
        clientMode: FormGearClientMode.capi,
        isEncrypted: true,
        offlineCapable: false,
        allowEdit: false, // No editing allowed in review mode
        autoSave: false,
        requireValidation: true,
      ),
      data: AssignmentData(
        template: _convertToStringDynamicMap(data['template']),
        validation: _convertToStringDynamicMap(data['validation']),
        reference: _convertToStringDynamicMap(data['reference']),
        response: _convertToStringDynamicMap(
          data['response'],
        ), // Complete responses for review
        media: _convertToStringDynamicMap(
          data['media'],
        ), // All associated media
        preset: _convertToStringDynamicMap(data['preset']),
        remark: _convertToStringDynamicMap(
          data['remark'],
        ), // Supervisor remarks
        principals: [
          {'name': 'Regional Supervisor', 'role': 'SUPERVISOR'},
          {'name': 'Quality Controller', 'role': 'QC'},
        ],
        userInfo: {
          'name': 'Review Officer',
          'role': 'SUPERVISOR',
          'permissions': ['read', 'review', 'approve'],
          'nip': '987654321',
        },
      ),
      metadata: {
        'created_at': DateTime.now()
            .subtract(const Duration(days: 5))
            .toIso8601String(),
        'submitted_at': DateTime.now()
            .subtract(const Duration(days: 1))
            .toIso8601String(),
        'status': 'submitted',
        'priority': 'high',
        'region': 'Central Jakarta',
        'assignment_type': 'quality_review',
        'completion_rate': '100%',
      },
    );
  }

  /// Helper method to safely convert dynamic maps to Map&lt;String, dynamic&gt;
  Map<String, dynamic> _convertToStringDynamicMap(dynamic data) {
    if (data == null) return <String, dynamic>{};
    if (data is Map<String, dynamic>) return data;
    if (data is Map) {
      return data.map((key, value) => MapEntry(key.toString(), value));
    }
    return <String, dynamic>{};
  }
}
