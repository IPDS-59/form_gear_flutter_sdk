import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:form_gear_engine_sdk/form_gear_engine_sdk.dart';

class TemplateSelectionScreen extends StatefulWidget {
  const TemplateSelectionScreen({
    super.key,
    required this.formEngineId,
    this.engineName,
  });

  final String formEngineId;
  final String? engineName;

  @override
  State<TemplateSelectionScreen> createState() =>
      _TemplateSelectionScreenState();
}

class _TemplateSelectionScreenState extends State<TemplateSelectionScreen> {
  late final FormGearDownloadManager downloadManager;
  List<TemplateInfo> _templates = [];
  List<String> _downloadedTemplates = [];
  bool _isLoading = true;

  // Cache basic form data to avoid reloading
  static Map<String, dynamic>? _cachedMediaData;
  static Map<String, dynamic>? _cachedReferenceData;
  static Map<String, dynamic>? _cachedResponseData;

  @override
  void initState() {
    super.initState();
    downloadManager = getIt<FormGearDownloadManager>();
    _loadTemplates();
  }

  Future<void> _loadTemplates() async {
    try {
      // First get downloaded templates
      _downloadedTemplates = await downloadManager.getDownloadedTemplates();

      // If no downloaded templates, show empty state
      if (_downloadedTemplates.isEmpty) {
        setState(() {
          _templates = [];
          _isLoading = false;
        });
        return;
      }

      debugPrint('Found ${_downloadedTemplates.length} downloaded templates');

      final templates = <TemplateInfo>[];

      // Load downloaded templates' metadata from local storage
      final futures = _downloadedTemplates.map((templateId) async {
        try {
          final templateData = await downloadManager.loadLocalTemplate(
            templateId,
          );
          if (templateData != null) {
            return TemplateInfo(
              id: templateId,
              title: templateData['title'] ?? 'Unknown Template',
              description:
                  templateData['description'] ?? 'No description available',
              version: templateData['version'] ?? '1.0.0',
              dataKey: templateData['dataKey'] ?? templateId,
            );
          }
          return null;
        } catch (e) {
          debugPrint('Error loading template $templateId: $e');
          return null;
        }
      });

      // Wait for all templates to load in parallel
      final results = await Future.wait(futures);

      // Filter out null results and add to templates list
      for (final template in results) {
        if (template != null) {
          templates.add(template);
        }
      }

      // Sort templates by title for consistent ordering
      templates.sort((a, b) => a.title.compareTo(b.title));

      debugPrint('Successfully loaded ${templates.length} templates');
      setState(() {
        _templates = templates;
        _isLoading = false;
      });
    } catch (e) {
      debugPrint('Error loading templates: $e');
      setState(() {
        _isLoading = false;
      });
    }
  }

  /// Loads basic form data with caching to improve performance
  Future<Map<String, Map<String, dynamic>>> _loadBasicFormData() async {
    // Return cached data if available
    if (_cachedMediaData != null &&
        _cachedReferenceData != null &&
        _cachedResponseData != null) {
      return {
        'media': _cachedMediaData!,
        'reference': _cachedReferenceData!,
        'response': _cachedResponseData!,
      };
    }

    // Load all basic data in parallel
    final futures = await Future.wait([
      rootBundle.loadString('assets/formgear/media.json'),
      rootBundle.loadString('assets/formgear/reference.json'),
      rootBundle.loadString('assets/formgear/response.json'),
    ]);

    // Parse and cache the data
    _cachedMediaData = json.decode(futures[0]);
    _cachedReferenceData = json.decode(futures[1]);
    _cachedResponseData = json.decode(futures[2]);

    return {
      'media': _cachedMediaData!,
      'reference': _cachedReferenceData!,
      'response': _cachedResponseData!,
    };
  }

  @override
  Widget build(BuildContext context) {
    final displayTitle = widget.engineName != null
        ? 'Templates - ${widget.engineName}'
        : 'Select Template - FormGear v${widget.formEngineId}';

    return Scaffold(
      appBar: AppBar(
        title: Text(displayTitle),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _templates.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(
                    Icons.description_outlined,
                    size: 64,
                    color: Colors.grey,
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'No Templates Downloaded',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Please download templates from the Download Demo first.',
                    textAlign: TextAlign.center,
                    style: TextStyle(color: Colors.grey),
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton.icon(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.download),
                    label: const Text('Go to Download Demo'),
                  ),
                ],
              ),
            )
          : Column(
              children: [
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(16),
                  color: Colors.blue[50],
                  child: Text(
                    'Downloaded Templates (${_templates.length})',
                    style: TextStyle(
                      fontWeight: FontWeight.w500,
                      color: Colors.blue[800],
                    ),
                  ),
                ),
                Expanded(
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _templates.length,
                    itemBuilder: (context, index) {
                      final template = _templates[index];
                      return ModernTemplateCard(
                        template: template,
                        onTap: () => _launchFormEngine(context, template),
                      );
                    },
                  ),
                ),
              ],
            ),
    );
  }

  Future<void> _launchFormEngine(
    BuildContext context,
    TemplateInfo template,
  ) async {
    if (!mounted) return;

    // Capture context references at the start
    final navigator = Navigator.of(context);
    final contextForOperations = context;

    try {
      // Show loading dialog
      showDialog(
        context: contextForOperations,
        barrierDismissible: false,
        builder: (context) => const AlertDialog(
          content: Row(
            children: [
              CircularProgressIndicator(),
              SizedBox(width: 16),
              Text('Loading form engine...'),
            ],
          ),
        ),
      );

      // Determine FormEngineType from widget.formEngineId
      FormEngineType? engineType = FormEngineType.fromString(
        widget.formEngineId,
      );

      if (engineType == null) {
        throw Exception('Unknown form engine ID: ${widget.formEngineId}');
      }

      // Load template and validation data from downloaded files
      final templateDataMap = await downloadManager.loadLocalTemplate(
        template.id,
      );
      final validationDataMap = await downloadManager.loadLocalValidation(
        template.id,
      );

      if (templateDataMap == null || validationDataMap == null) {
        throw Exception('Template or validation data not found locally');
      }

      // Load basic form data (cached)
      final basicData = await _loadBasicFormData();
      final mediaData = basicData['media']!;
      final referenceData = basicData['reference']!;
      final responseData = basicData['response']!;

      // Prepare the engine using the new API
      await FormGearSDK.instance.prepareEngine(
        engineType: engineType,
        baseUrl: 'about:blank',
      );

      // Load form configuration
      FormGearSDK.instance.loadFormConfig(
        FormConfig(
          formId: template.id,
          template: templateDataMap,
          validation: validationDataMap,
          preset: {
            'description': 'Default Preset',
            'dataKey': 'default_preset',
            'predata': <dynamic>[],
          },
          remark: {'dataKey': 'default_remark', 'notes': <dynamic>[]},
          media: mediaData,
          reference: referenceData,
          response: responseData,
        ),
      );

      if (!mounted) return;

      // Close loading dialog
      if (navigator.canPop()) {
        navigator.pop();
      }

      if (!mounted) return;

      // Launch the prepared engine
      await FormGearSDK.instance.launchPreparedEngine(
        contextForOperations,
        title: template.title,
      );
    } catch (e) {
      if (!mounted) return;

      // Close loading dialog if it's open
      if (navigator.canPop()) {
        navigator.pop();
      }

      if (!mounted) return;

      // Show error dialog
      showDialog(
        context: contextForOperations,
        builder: (context) => AlertDialog(
          title: const Text('Error'),
          content: Text('Failed to load form engine: $e'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('OK'),
            ),
          ],
        ),
      );
    }
  }
}

class ModernTemplateCard extends StatelessWidget {
  final TemplateInfo template;
  final VoidCallback onTap;

  const ModernTemplateCard({
    super.key,
    required this.template,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    // Template-specific colors (different from engine colors)
    const primaryColor = Color(0xFF00BCD4); // Cyan for templates
    const accentColor = Color(0xFF26C6DA);
    const successColor = Color(0xFF10B981);

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        gradient: LinearGradient(
          colors: [Colors.white, primaryColor.withValues(alpha: 0.05)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        boxShadow: [
          BoxShadow(
            color: primaryColor.withValues(alpha: 0.15),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
        border: Border.all(
          color: primaryColor.withValues(alpha: 0.2),
          width: 1,
        ),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(16),
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header with icon and status
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [primaryColor, accentColor],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(12),
                        boxShadow: [
                          BoxShadow(
                            color: primaryColor.withValues(alpha: 0.3),
                            blurRadius: 8,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: const Icon(
                        Icons.description_rounded,
                        color: Colors.white,
                        size: 24,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            template.title,
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Colors.grey[800],
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'v${template.version}',
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: primaryColor,
                            ),
                          ),
                        ],
                      ),
                    ),
                    // Downloaded status indicator
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: successColor,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            Icons.check_circle_rounded,
                            color: Colors.white,
                            size: 16,
                          ),
                          SizedBox(width: 4),
                          Text(
                            'Downloaded',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                // Description
                Text(
                  template.description,
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey[600],
                    height: 1.4,
                  ),
                ),
                const SizedBox(height: 16),

                // Template details
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    _buildTemplateTag(
                      'Template ID: ${template.id}',
                      primaryColor,
                      Icons.badge_rounded,
                    ),
                    _buildTemplateTag(
                      'Data Key: ${template.dataKey}',
                      Colors.orange,
                      Icons.key_rounded,
                    ),
                    _buildTemplateTag(
                      'Form Template',
                      Colors.teal,
                      Icons.web_asset_rounded,
                    ),
                  ],
                ),
                const SizedBox(height: 20),

                // Action hint
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.play_arrow_rounded,
                      size: 16,
                      color: Colors.grey[600],
                    ),
                    const SizedBox(width: 4),
                    Text(
                      'Tap to launch form engine',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                        color: Colors.grey[600],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTemplateTag(String label, Color color, IconData icon) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: color.withValues(alpha: 0.3), width: 1),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: color),
          const SizedBox(width: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: color,
            ),
          ),
        ],
      ),
    );
  }
}

class TemplateInfo {
  final String id;
  final String title;
  final String description;
  final String version;
  final String dataKey;

  const TemplateInfo({
    required this.id,
    required this.title,
    required this.description,
    required this.version,
    required this.dataKey,
  });
}
