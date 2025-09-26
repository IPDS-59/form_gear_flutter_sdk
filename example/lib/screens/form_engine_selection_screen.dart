import 'package:flutter/material.dart';
import 'package:form_gear_engine_sdk/form_gear_engine_sdk.dart';
import 'template_selection_screen.dart';

class FormEngineSelectionScreen extends StatefulWidget {
  const FormEngineSelectionScreen({super.key});

  @override
  State<FormEngineSelectionScreen> createState() =>
      _FormEngineSelectionScreenState();
}

class _FormEngineSelectionScreenState extends State<FormEngineSelectionScreen> {
  late final FormGearDownloadManager downloadManager;
  List<FormEngineMetadata> availableEngines = [];
  List<String> downloadedEngines = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    downloadManager = getIt<FormGearDownloadManager>();
    _loadEngines();
  }

  Future<void> _loadEngines() async {
    await Future.wait([_loadAvailableEngines(), _loadDownloadedEngines()]);

    if (mounted) {
      setState(() {
        isLoading = false;
      });
    }
  }

  Future<void> _loadAvailableEngines() async {
    try {
      final engines = <FormEngineMetadata>[];

      // Check for FormGear Engine v1
      if (await downloadManager.isEngineDownloaded('1')) {
        engines.add(
          const FormEngineMetadata(
            id: '1',
            name: 'FormGear Engine',
            version: '1.0',
            type: 'FormGear',
            description: 'Original FormGear Engine with ES6 modules',
            jsFile: 'form-gear.es.js',
          ),
        );
      }

      // Check for FasihForm Engine v2
      if (await downloadManager.isEngineDownloaded('2')) {
        engines.add(
          const FormEngineMetadata(
            id: '2',
            name: 'FasihForm Engine',
            version: '2.0',
            type: 'FasihForm',
            description: 'Enhanced FasihForm with improved validation',
            jsFile: 'fasih-form.es.js',
          ),
        );
      }

      if (mounted) {
        setState(() {
          availableEngines = engines;
        });
      }
    } catch (e) {
      print('Error loading engines: $e');
    }
  }

  Future<void> _loadDownloadedEngines() async {
    try {
      final downloaded = <String>[];

      if (await downloadManager.isEngineDownloaded('1')) {
        downloaded.add('1');
      }

      if (await downloadManager.isEngineDownloaded('2')) {
        downloaded.add('2');
      }

      if (mounted) {
        setState(() {
          downloadedEngines = downloaded;
        });
      }
    } catch (e) {
      print('Error loading downloaded engines: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Select Form Engine'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : availableEngines.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(
                    Icons.download_outlined,
                    size: 64,
                    color: Colors.grey,
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'No Form Engines Downloaded',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Please download form engines from the Download Demo first.',
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
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: availableEngines.length,
              itemBuilder: (context, index) {
                final engine = availableEngines[index];
                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: ListTile(
                    leading: Icon(
                      Icons.engineering,
                      color: engine.type == 'FormGear'
                          ? Colors.blue
                          : Colors.green,
                      size: 32,
                    ),
                    title: Text(
                      '${engine.name} v${engine.version}',
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(engine.description),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8,
                                vertical: 2,
                              ),
                              decoration: BoxDecoration(
                                color: engine.type == 'FormGear'
                                    ? Colors.blue[100]
                                    : Colors.green[100],
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                engine.type,
                                style: TextStyle(
                                  fontSize: 12,
                                  color: engine.type == 'FormGear'
                                      ? Colors.blue[800]
                                      : Colors.green[800],
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Text(
                              engine.jsFile,
                              style: const TextStyle(
                                fontSize: 12,
                                color: Colors.grey,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                    trailing: const Icon(Icons.arrow_forward_ios),
                    onTap: () => _navigateToTemplateSelection(engine),
                    isThreeLine: true,
                  ),
                );
              },
            ),
    );
  }

  void _navigateToTemplateSelection(FormEngineMetadata engine) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => TemplateSelectionScreen(
          formEngineId: engine.id,
          engineName: '${engine.name} v${engine.version}',
        ),
      ),
    );
  }
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
