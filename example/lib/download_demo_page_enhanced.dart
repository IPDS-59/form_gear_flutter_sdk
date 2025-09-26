import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:form_gear_engine_sdk/form_gear_engine_sdk.dart';
import 'package:skeletonizer/skeletonizer.dart';

/// Enhanced demo page with skeleton loading, proper download status, and lookup content preview
class EnhancedDownloadDemoPage extends StatefulWidget {
  const EnhancedDownloadDemoPage({super.key});

  @override
  State<EnhancedDownloadDemoPage> createState() =>
      _EnhancedDownloadDemoPageState();
}

class _EnhancedDownloadDemoPageState extends State<EnhancedDownloadDemoPage> {
  late final FormGearDownloadManager downloadManager;
  List<TemplateMetadata> availableTemplates = [];
  List<FormEngineMetadata> availableEngines = [];
  List<LookupMetadata> availableLookups = [];

  List<String> downloadedTemplates = [];
  List<String> downloadedEngines = [];
  List<String> downloadedLookups = [];
  bool isLoadingEngines = true;
  bool isLoadingTemplates = true;
  bool isLoadingLookups = true;
  Map<String, bool> downloadingItems = {};
  Map<String, double> downloadProgress = {};
  bool isClearingAll = false;

  @override
  void initState() {
    super.initState();
    downloadManager = getIt<FormGearDownloadManager>();
    _loadAvailableContent();
    _loadDownloadedItems();
  }

  Future<void> _loadAvailableContent() async {
    setState(() {
      isLoadingEngines = true;
      isLoadingTemplates = true;
      isLoadingLookups = true;
    });

    await Future.wait([
      _loadAvailableTemplates(),
      _loadAvailableEngines(),
      _loadAvailableLookups(),
    ]);
  }

  Future<void> _loadAvailableLookups() async {
    try {
      // Add artificial delay for demonstration
      await Future.delayed(const Duration(milliseconds: 1500));

      // Get available lookup directories from asset manifest
      final manifestContent = await rootBundle.loadString('AssetManifest.json');
      final Map<String, dynamic> manifestMap = json.decode(manifestContent);

      // Extract lookup IDs from asset paths
      final Set<String> lookupIds = <String>{};
      for (String key in manifestMap.keys) {
        if (key.startsWith('assets/lookup/') && key.endsWith('.json')) {
          final pathParts = key.split('/');
          if (pathParts.length >= 4) {
            final lookupId = pathParts[2];
            lookupIds.add(lookupId);
          }
        }
      }

      final lookups = <LookupMetadata>[];

      // Load lookup metadata in parallel (limit to first 20 for performance)
      final futures = lookupIds.take(20).map((lookupId) async {
        try {
          // Try different version patterns
          String? lookupContent;
          String version = '1';

          // Try version "1" first
          try {
            lookupContent = await rootBundle.loadString(
              'assets/lookup/$lookupId/1.json',
            );
          } catch (e) {
            // Try version "v1"
            try {
              lookupContent = await rootBundle.loadString(
                'assets/lookup/$lookupId/v1.json',
              );
              version = 'v1';
            } catch (e2) {
              debugPrint('Error loading lookup $lookupId: $e2');
              return null;
            }
          }

          final lookupData = json.decode(lookupContent);
          final collectionName = lookupData['collectionName'] ?? 'Unknown';
          final rowCount = lookupData['rowCount'] ?? 0;
          final fields = List<String>.from(lookupData['fields'] ?? []);

          // Extract preview data (first few items)
          final dataList = lookupData['data'] as List?;
          String preview = 'No data available';
          String category = 'Data Collection';

          if (dataList != null && dataList.isNotEmpty) {
            // Parse first few items for preview
            final previewItems = <String>[];
            for (int i = 0; i < 3 && i < dataList.length; i++) {
              try {
                final itemStr = dataList[i].toString();
                // Extract meaningful part (first field usually contains readable name)
                final match = RegExp(r"'([^']*)'").firstMatch(itemStr);
                if (match != null) {
                  previewItems.add(match.group(1)!);
                }
              } catch (e) {
                // Skip malformed items
              }
            }

            if (previewItems.isNotEmpty) {
              preview = previewItems.join(', ');
              if (dataList.length > 3) {
                preview += '... (+${dataList.length - 3} more)';
              }
            }

            // Determine category based on collection name
            final name = collectionName.toLowerCase();
            if (name.contains('prov')) {
              category = 'Administrative - Province';
            } else if (name.contains('kab')) {
              category = 'Administrative - Regency';
            } else if (name.contains('desa')) {
              category = 'Administrative - Village';
            } else if (name.contains('sekolah')) {
              category = 'Educational - Schools';
            } else if (name.contains('kesehatan')) {
              category = 'Healthcare - Facilities';
            } else {
              category = 'Data Collection';
            }
          }

          return LookupMetadata(
            id: lookupId,
            version: version,
            collectionName: collectionName,
            rowCount: rowCount,
            fields: fields,
            preview: preview,
            category: category,
          );
        } catch (e) {
          debugPrint('Error loading lookup $lookupId: $e');
          return null;
        }
      });

      final results = await Future.wait(futures);

      for (final lookup in results) {
        if (lookup != null) {
          lookups.add(lookup);
        }
      }

      // Sort by category then by collection name
      lookups.sort((a, b) {
        final categoryCompare = a.category.compareTo(b.category);
        if (categoryCompare != 0) return categoryCompare;
        return a.collectionName.compareTo(b.collectionName);
      });

      if (mounted) {
        setState(() {
          availableLookups = lookups;
          isLoadingLookups = false;
        });
      }
    } catch (e) {
      debugPrint('Error loading available lookups: $e');
      if (mounted) {
        setState(() {
          isLoadingLookups = false;
        });
      }
    }
  }

  Future<void> _loadAvailableTemplates() async {
    try {
      // Add artificial delay for demonstration
      await Future.delayed(const Duration(seconds: 2));

      // Get available template directories from asset manifest
      final manifestContent = await rootBundle.loadString('AssetManifest.json');
      final Map<String, dynamic> manifestMap = json.decode(manifestContent);

      // Extract template IDs from asset paths
      final Set<String> templateIds = <String>{};
      for (String key in manifestMap.keys) {
        if (key.startsWith('assets/Template/') &&
            key.endsWith('_template.json')) {
          final templateId = key.split('/')[2];
          templateIds.add(templateId);
        }
      }

      final templates = <TemplateMetadata>[];

      // Load template metadata in parallel
      final futures = templateIds.map((templateId) async {
        try {
          final templateContent = await rootBundle.loadString(
            'assets/Template/$templateId/${templateId}_template.json',
          );
          final templateData = json.decode(templateContent);

          return TemplateMetadata(
            id: templateId,
            title: templateData['title'] ?? 'Unknown Template',
            description: templateData['description'] ?? 'No description',
            version: templateData['version'] ?? '1.0.0',
            dataKey: templateData['dataKey'] ?? templateId,
            category: templateData['category'] ?? 'General',
            formType: templateData['formType'] ?? 'Standard',
          );
        } catch (e) {
          debugPrint('Error loading template $templateId: $e');
          return null;
        }
      });

      final results = await Future.wait(futures);

      for (final template in results) {
        if (template != null) {
          templates.add(template);
        }
      }

      templates.sort((a, b) => a.title.compareTo(b.title));

      if (mounted) {
        setState(() {
          availableTemplates = templates;
          isLoadingTemplates = false;
        });
      }
    } catch (e) {
      debugPrint('Error loading available templates: $e');
      if (mounted) {
        setState(() {
          isLoadingTemplates = false;
        });
      }
    }
  }

  Future<void> _loadAvailableEngines() async {
    try {
      // Add artificial delay for demonstration
      await Future.delayed(const Duration(seconds: 1));

      final engines = <FormEngineMetadata>[];

      // Check for FormGear Engine (ID: 1)
      try {
        await rootBundle.loadString('assets/formengine/1/index.html');

        // Try to load actual version from version.json
        String version = '1.0.0'; // Default version
        try {
          final versionContent = await rootBundle.loadString(
            'assets/formengine/1/version.json',
          );
          final versionData = json.decode(versionContent);
          version = versionData['version'] ?? '1.0.0';
        } catch (e) {
          debugPrint('Could not load version.json for FormGear Engine: $e');
        }

        engines.add(
          FormEngineMetadata(
            id: '1',
            name: 'FormGear Engine',
            version: version,
            type: 'FormGear',
            description: 'Original FormGear Engine with ES6 modules',
            jsFile: 'form-gear.es.js',
          ),
        );
      } catch (e) {
        debugPrint('FormGear Engine (ID: 1) not found');
      }

      // Check for FasihForm Engine (ID: 2)
      try {
        await rootBundle.loadString('assets/formengine/2/index.html');

        // Try to load actual version from version.json
        String version = '2.0.0'; // Default version
        try {
          final versionContent = await rootBundle.loadString(
            'assets/formengine/2/version.json',
          );
          final versionData = json.decode(versionContent);
          version = versionData['version'] ?? '2.0.0';
        } catch (e) {
          debugPrint('Could not load version.json for FasihForm Engine: $e');
        }

        engines.add(
          FormEngineMetadata(
            id: '2',
            name: 'FasihForm Engine',
            version: version,
            type: 'FasihForm',
            description: 'Enhanced FasihForm with improved validation',
            jsFile: 'fasih-form.es.js',
          ),
        );
      } catch (e) {
        debugPrint('FasihForm Engine (ID: 2) not found');
      }

      if (mounted) {
        setState(() {
          availableEngines = engines;
          isLoadingEngines = false;
        });
      }
    } catch (e) {
      debugPrint('Error loading available engines: $e');
      if (mounted) {
        setState(() {
          isLoadingEngines = false;
        });
      }
    }
  }

  Future<void> _loadDownloadedItems() async {
    // Add delay to ensure engines and lookups are loaded first
    await Future.delayed(const Duration(milliseconds: 1000));

    final templates = await downloadManager.getDownloadedTemplates();
    if (mounted) {
      setState(() {
        downloadedTemplates = templates;
      });
    }

    // Check downloaded engines - wait for engines to be available
    final engines = <String>[];
    for (final engine in availableEngines) {
      final isDownloaded = await downloadManager.isEngineDownloaded(engine.id);
      if (isDownloaded) {
        engines.add(engine.id);
      }
    }
    if (mounted) {
      setState(() {
        downloadedEngines = engines;
      });
    }

    // Check downloaded lookups - wait for lookups to be available
    final lookups = <String>[];
    for (final lookup in availableLookups) {
      final isDownloaded = await downloadManager.isLookupDownloaded(
        lookup.id,
        lookup.version,
      );
      if (isDownloaded) {
        lookups.add('${lookup.id} v${lookup.version}');
      }
    }
    if (mounted) {
      setState(() {
        downloadedLookups = lookups;
      });
    }
  }

  Future<void> _downloadTemplate(TemplateMetadata template) async {
    if (!mounted) return;
    final itemKey = 'template_${template.id}';
    setState(() {
      downloadingItems[itemKey] = true;
      downloadProgress[itemKey] = 0.0;
    });

    debugPrint('Starting download simulation for template ${template.id}');

    try {
      // Simulate download progress
      for (int i = 1; i <= 10; i++) {
        await Future.delayed(const Duration(milliseconds: 200));
        if (mounted) {
          setState(() {
            downloadProgress[itemKey] = i / 10.0;
          });
        }
      }

      final success = await downloadManager.downloadTemplate(template.id);
      if (success) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Downloaded: ${template.title}'),
              backgroundColor: Colors.green,
            ),
          );
          await _loadDownloadedItems();
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Failed to download: ${template.title}'),
              backgroundColor: Colors.red,
            ),
          );
        }
      }
    } finally {
      if (mounted) {
        setState(() {
          downloadingItems.remove(itemKey);
          downloadProgress.remove(itemKey);
        });
      }
    }
  }

  Future<void> _downloadLookup(LookupMetadata lookup) async {
    final itemKey = 'lookup_${lookup.id}_${lookup.version}';
    setState(() {
      downloadingItems[itemKey] = true;
      downloadProgress[itemKey] = 0.0;
    });

    debugPrint(
      'Starting download simulation for lookup ${lookup.id} v${lookup.version}',
    );

    try {
      // Simulate download progress
      for (int i = 1; i <= 8; i++) {
        await Future.delayed(const Duration(milliseconds: 150));
        if (mounted) {
          setState(() {
            downloadProgress[itemKey] = i / 8.0;
          });
        }
      }

      final success = await downloadManager.downloadLookupData(
        lookup.id,
        lookup.version,
      );
      if (success && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Downloaded lookup: ${lookup.collectionName}'),
            backgroundColor: Colors.green,
          ),
        );
        await _loadDownloadedItems();
      } else if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Failed to download lookup: ${lookup.collectionName}',
            ),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          downloadingItems.remove(itemKey);
          downloadProgress.remove(itemKey);
        });
      }
    }
  }

  Future<void> _downloadFormEngine(FormEngineMetadata engine) async {
    if (!mounted) return;
    final itemKey = 'engine_${engine.id}';
    setState(() {
      downloadingItems[itemKey] = true;
      downloadProgress[itemKey] = 0.0;
    });

    debugPrint('Starting download simulation for engine ${engine.id}');

    try {
      // Simulate download progress
      for (int i = 1; i <= 12; i++) {
        await Future.delayed(const Duration(milliseconds: 250));
        if (mounted) {
          setState(() {
            downloadProgress[itemKey] = i / 12.0;
          });
        }
      }

      final success = await downloadManager.downloadFormEngine(engine.id);
      if (success) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Downloaded: ${engine.name} v${engine.version}'),
              backgroundColor: Colors.green,
            ),
          );
          await _loadDownloadedItems();
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Failed to download: ${engine.name}'),
              backgroundColor: Colors.red,
            ),
          );
        }
      }
    } finally {
      if (mounted) {
        setState(() {
          downloadingItems.remove(itemKey);
          downloadProgress.remove(itemKey);
        });
      }
    }
  }

  Future<void> _clearAllData() async {
    setState(() {
      isClearingAll = true;
    });

    try {
      await downloadManager.clearAllData();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('All downloaded data cleared'),
            backgroundColor: Colors.orange,
          ),
        );
        await _loadDownloadedItems();
      }
    } finally {
      if (mounted) {
        setState(() {
          isClearingAll = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('FormGear Download Demo'),
        backgroundColor: const Color(0xFF1E88E5),
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: isClearingAll
                ? const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: Colors.white,
                    ),
                  )
                : const Icon(Icons.delete_forever),
            onPressed: isClearingAll ? null : _clearAllData,
            tooltip: 'Clear All Data',
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildSectionHeader('FormGear Engines'),
          ...isLoadingEngines
              ? _buildEngineSkeletons()
              : availableEngines.map(_buildEngineCard),
          const SizedBox(height: 24),
          _buildSectionHeader('Available Templates'),
          ...isLoadingTemplates
              ? _buildTemplateSkeletons()
              : availableTemplates.map(_buildTemplateCard),
          const SizedBox(height: 24),
          _buildSectionHeader('Available Lookup Data'),
          ...isLoadingLookups
              ? _buildLookupSkeletons()
              : availableLookups.map(_buildLookupCard),
          const SizedBox(height: 24),
          _buildSectionHeader('Downloaded Summary'),
          _buildSummaryCard(),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.bold,
          color: Color(0xFF1E88E5),
        ),
      ),
    );
  }

  List<Widget> _buildEngineSkeletons() {
    return List.generate(2, (index) {
      return Skeletonizer(
        child: Card(
          margin: const EdgeInsets.only(bottom: 8),
          child: ListTile(
            leading: const Icon(Icons.engineering),
            title: Text('Form Engine ${index + 1}'),
            subtitle: const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Loading engine information...'),
                SizedBox(height: 4),
                Text('Type: Loading • JS: loading.js'),
              ],
            ),
            trailing: const SizedBox(width: 80, height: 36, child: Card()),
            isThreeLine: true,
          ),
        ),
      );
    });
  }

  List<Widget> _buildTemplateSkeletons() {
    return List.generate(3, (index) {
      return Skeletonizer(
        child: Card(
          margin: const EdgeInsets.only(bottom: 8),
          child: ListTile(
            leading: const Icon(Icons.description),
            title: Text('Template ${index + 1}'),
            subtitle: const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Loading template description...'),
                SizedBox(height: 4),
                Text('v1.0.0 • Loading • Standard'),
              ],
            ),
            trailing: const SizedBox(width: 80, height: 36, child: Card()),
            isThreeLine: true,
          ),
        ),
      );
    });
  }

  List<Widget> _buildLookupSkeletons() {
    return List.generate(4, (index) {
      return Skeletonizer(
        child: Card(
          margin: const EdgeInsets.only(bottom: 8),
          child: ListTile(
            leading: const Icon(Icons.data_object),
            title: Text('Lookup Data ${index + 1}'),
            subtitle: const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Loading lookup information...'),
                SizedBox(height: 4),
                Text('Category: Loading • Data: Loading...'),
              ],
            ),
            trailing: const SizedBox(width: 80, height: 36, child: Card()),
            isThreeLine: true,
          ),
        ),
      );
    });
  }

  Widget _buildEngineCard(FormEngineMetadata engine) {
    final isDownloaded = downloadedEngines.contains(engine.id);
    final itemKey = 'engine_${engine.id}';
    final isDownloading = downloadingItems[itemKey] ?? false;
    final progress = downloadProgress[itemKey] ?? 0.0;

    // Determine engine type label and color based on ID
    final engineTypeLabel = engine.id == '1'
        ? 'FormGear'
        : engine.id == '2'
        ? 'FasihForm'
        : engine.type;
    final engineColor = engine.id == '1'
        ? Colors.blue
        : engine.id == '2'
        ? Colors.purple
        : Colors.grey;

    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: Column(
        children: [
          ListTile(
            leading: Icon(
              isDownloaded ? Icons.download_done : Icons.engineering,
              color: isDownloaded ? Colors.green : engineColor,
            ),
            title: Text('${engine.name} v${engine.version}'),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(engine.description),
                const SizedBox(height: 4),
                Wrap(
                  spacing: 8,
                  runSpacing: 4,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: engineColor.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(4),
                        border: Border.all(color: engineColor.withValues(alpha: 0.3)),
                      ),
                      child: Text(
                        'Engine ID: ${engine.id}',
                        style: TextStyle(
                          fontSize: 11,
                          color: engineColor,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                    Text(
                      'Type: $engineTypeLabel',
                      style: const TextStyle(fontSize: 12, color: Colors.grey),
                    ),
                    Text(
                      'JS: ${engine.jsFile}',
                      style: const TextStyle(fontSize: 12, color: Colors.grey),
                    ),
                  ],
                ),
              ],
            ),
            trailing: isDownloaded
                ? const Icon(Icons.check_circle, color: Colors.green)
                : isDownloading
                ? SizedBox(
                    width: 80,
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const SizedBox(
                          width: 24,
                          height: 24,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '${(progress * 100).toInt()}%',
                          style: const TextStyle(fontSize: 12),
                        ),
                      ],
                    ),
                  )
                : ElevatedButton(
                    onPressed: () => _downloadFormEngine(engine),
                    child: const Text('Download'),
                  ),
            isThreeLine: true,
          ),
          if (isDownloading)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: LinearProgressIndicator(
                value: progress,
                backgroundColor: Colors.grey[300],
                valueColor: AlwaysStoppedAnimation<Color>(engineColor),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildTemplateCard(TemplateMetadata template) {
    final isDownloaded = downloadedTemplates.contains(template.id);
    final itemKey = 'template_${template.id}';
    final isDownloading = downloadingItems[itemKey] ?? false;
    final progress = downloadProgress[itemKey] ?? 0.0;

    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: Column(
        children: [
          ListTile(
            leading: Icon(
              isDownloaded ? Icons.download_done : Icons.description,
              color: isDownloaded ? Colors.green : Colors.grey,
            ),
            title: Text(template.title),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(template.description),
                const SizedBox(height: 4),
                Text(
                  'v${template.version} • ${template.category} • ${template.formType}',
                  style: const TextStyle(fontSize: 12, color: Colors.grey),
                ),
              ],
            ),
            trailing: isDownloaded
                ? const Icon(Icons.check_circle, color: Colors.green)
                : isDownloading
                ? SizedBox(
                    width: 80,
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const SizedBox(
                          width: 24,
                          height: 24,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '${(progress * 100).toInt()}%',
                          style: const TextStyle(fontSize: 12),
                        ),
                      ],
                    ),
                  )
                : ElevatedButton(
                    onPressed: () => _downloadTemplate(template),
                    child: const Text('Download'),
                  ),
            isThreeLine: true,
          ),
          if (isDownloading)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: LinearProgressIndicator(
                value: progress,
                backgroundColor: Colors.grey[300],
                valueColor: const AlwaysStoppedAnimation<Color>(Colors.blue),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildLookupCard(LookupMetadata lookup) {
    final displayKey = '${lookup.id} v${lookup.version}';
    final isDownloaded = downloadedLookups.contains(displayKey);
    final shortId = lookup.id.substring(0, 8);
    final itemKey = 'lookup_${lookup.id}_${lookup.version}';
    final isDownloading = downloadingItems[itemKey] ?? false;
    final progress = downloadProgress[itemKey] ?? 0.0;

    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: Column(
        children: [
          ListTile(
            leading: Icon(
              isDownloaded ? Icons.download_done : Icons.data_object,
              color: isDownloaded ? Colors.green : Colors.orange,
            ),
            title: Text(lookup.collectionName),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '${lookup.category} • ${lookup.rowCount} rows',
                  style: const TextStyle(fontWeight: FontWeight.w500),
                ),
                const SizedBox(height: 4),
                Text(
                  'Preview: ${lookup.preview}',
                  style: const TextStyle(fontSize: 12, color: Colors.grey),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 2),
                Text(
                  'ID: $shortId • v${lookup.version}',
                  style: const TextStyle(fontSize: 11, color: Colors.grey),
                ),
              ],
            ),
            trailing: isDownloaded
                ? const Icon(Icons.check_circle, color: Colors.green)
                : isDownloading
                ? SizedBox(
                    width: 80,
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const SizedBox(
                          width: 24,
                          height: 24,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '${(progress * 100).toInt()}%',
                          style: const TextStyle(fontSize: 12),
                        ),
                      ],
                    ),
                  )
                : ElevatedButton(
                    onPressed: () => _downloadLookup(lookup),
                    child: const Text('Download'),
                  ),
            isThreeLine: true,
          ),
          if (isDownloading)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: LinearProgressIndicator(
                value: progress,
                backgroundColor: Colors.grey[300],
                valueColor: const AlwaysStoppedAnimation<Color>(Colors.orange),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildSummaryCard() {
    return Card(
      color: Colors.blue[50],
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Downloaded Items:',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: Colors.blue[800],
              ),
            ),
            const SizedBox(height: 8),
            Text('• Form Engines: ${downloadedEngines.length}'),
            Text('• Templates: ${downloadedTemplates.length}'),
            Text('• Lookup Data: ${downloadedLookups.length}'),
            const SizedBox(height: 12),
            const Text(
              'All downloaded data is stored in the app\'s documents directory '
              'and served by the local HTTP server.',
              style: TextStyle(fontSize: 12, color: Colors.grey),
            ),
          ],
        ),
      ),
    );
  }
}

class TemplateMetadata {
  final String id;
  final String title;
  final String description;
  final String version;
  final String dataKey;
  final String category;
  final String formType;

  const TemplateMetadata({
    required this.id,
    required this.title,
    required this.description,
    required this.version,
    required this.dataKey,
    required this.category,
    required this.formType,
  });
}

class FormEngineMetadata {
  final String id;
  final String name;
  final String version;
  final String type;
  final String description;
  final String jsFile;

  const FormEngineMetadata({
    required this.id,
    required this.name,
    required this.version,
    required this.type,
    required this.description,
    required this.jsFile,
  });
}

class LookupMetadata {
  final String id;
  final String version;
  final String collectionName;
  final int rowCount;
  final List<String> fields;
  final String preview;
  final String category;

  const LookupMetadata({
    required this.id,
    required this.version,
    required this.collectionName,
    required this.rowCount,
    required this.fields,
    required this.preview,
    required this.category,
  });
}
