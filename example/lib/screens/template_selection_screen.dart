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
                      return Card(
                        margin: const EdgeInsets.only(bottom: 12),
                        child: ListTile(
                          leading: const Icon(
                            Icons.description,
                            color: Colors.green,
                          ),
                          title: Text(
                            template.title,
                            style: const TextStyle(fontWeight: FontWeight.bold),
                          ),
                          subtitle: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(template.description),
                              const SizedBox(height: 4),
                              Text(
                                'Version: ${template.version} | Data Key: ${template.dataKey}',
                                style: const TextStyle(
                                  fontSize: 12,
                                  color: Colors.grey,
                                ),
                              ),
                            ],
                          ),
                          trailing: const Icon(Icons.arrow_forward_ios),
                          onTap: () => _launchFormEngine(context, template),
                          isThreeLine: true,
                        ),
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
