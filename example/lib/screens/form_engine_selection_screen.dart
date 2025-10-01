import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:form_gear_engine_sdk/form_gear_engine_sdk.dart';
import 'package:form_gear_engine_sdk/src/presentation/screens/form_engine_update_screen.dart';
import 'package:path_provider/path_provider.dart';

import 'template_selection_screen.dart';

class FormEngineSelectionScreen extends StatefulWidget {
  const FormEngineSelectionScreen({super.key});

  @override
  State<FormEngineSelectionScreen> createState() =>
      _FormEngineSelectionScreenState();
}

class _FormEngineSelectionScreenState extends State<FormEngineSelectionScreen> {
  List<FormEngineMetadata> availableEngines = [];
  List<String> downloadedEngines = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
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
      final engineConfigs = [
        {
          'id': '1',
          'name': 'FormGear Engine',
          'type': 'FormGear',
          'description': 'Original FormGear Engine with ES6 modules',
          'jsFile': 'form-gear.es.js',
        },
        {
          'id': '2',
          'name': 'FasihForm Engine',
          'type': 'FasihForm',
          'description': 'Enhanced FasihForm with improved validation',
          'jsFile': 'fasih-form.es.js',
        },
      ];

      for (final config in engineConfigs) {
        // Check if engine is downloaded and get actual version
        String version = 'Not Installed';
        try {
          final engineId = config['id'] as String;
          final isDownloaded = await FormGearSDK.instance
              .isFormEngineDownloaded(engineId);

          if (isDownloaded) {
            // Read version from BPS directory
            final versionFromBPS = await _readVersionFromBPS(engineId);
            version = versionFromBPS ?? 'Installed';
            debugPrint('Engine $engineId is downloaded with version: $version');
          } else {
            // Read version from bundled assets
            final bundledVersion = await _readVersionFromAssets(engineId);
            version = bundledVersion ?? 'Available';
            debugPrint(
              'Engine $engineId not downloaded, bundled version: $version',
            );
          }
        } catch (e) {
          debugPrint('Error checking engine ${config['id']}: $e');
        }

        engines.add(
          FormEngineMetadata(
            id: config['id'] as String,
            name: config['name'] as String,
            version: version,
            type: config['type'] as String,
            description: config['description'] as String,
            jsFile: config['jsFile'] as String,
          ),
        );
      }

      if (mounted) {
        setState(() {
          availableEngines = engines;
        });
      }
    } catch (e) {
      debugPrint('Error loading engines: $e');
    }
  }

  Future<void> _loadDownloadedEngines() async {
    try {
      final downloaded = <String>[];

      if (await FormGearSDK.instance.isFormEngineDownloaded('1')) {
        downloaded.add('1');
      }

      if (await FormGearSDK.instance.isFormEngineDownloaded('2')) {
        downloaded.add('2');
      }

      if (mounted) {
        setState(() {
          downloadedEngines = downloaded;
        });
      }
    } catch (e) {
      debugPrint('Error loading downloaded engines: $e');
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
                final isDownloaded = downloadedEngines.contains(engine.id);
                return ModernEngineCard(
                  engine: engine,
                  isDownloaded: isDownloaded,
                  onTap: () => _handleEngineTap(engine, isDownloaded),
                );
              },
            ),
    );
  }

  void _handleEngineTap(FormEngineMetadata engine, bool isDownloaded) {
    if (isDownloaded) {
      _navigateToTemplateSelection(engine);
    } else {
      _showForceUpdateScreen(engine);
    }
  }

  void _navigateToTemplateSelection(FormEngineMetadata engine) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const TemplateSelectionScreen()),
    );
  }

  Future<void> _showForceUpdateScreen(FormEngineMetadata engine) async {
    final formEngine = FormEngineEntity(
      formEngineId: int.parse(engine.id),
      version: engine.version,
      isForce: true, // Force download from bundled assets
      linkDownload: 'bundled://assets/${engine.jsFile}',
    );

    final versionResult = VersionCheckResult(
      state: VersionState.missing,
      formEngine: formEngine,
      localVersion: null,
      remoteVersion: engine.version,
    );

    await FormEngineUpdateScreen.show(
      context: context,
      versionResult: versionResult,
      onDownload: (onProgress) =>
          _downloadFromBundledAssets(engine, onProgress),
    );

    // Refresh the engines list after potential download
    await _loadEngines();
  }

  Future<void> _downloadFromBundledAssets(
    FormEngineMetadata engine,
    void Function(int progress) onProgress,
  ) async {
    debugPrint('Starting download for engine ${engine.id}');

    try {
      // Use the actual download manager to download the form engine
      // Simulate download progress (SDK no longer handles downloads)
      // In real app, implement your own download logic
      for (var i = 0; i <= 100; i += 10) {
        await Future.delayed(const Duration(milliseconds: 300));
        onProgress(i);
      }

      debugPrint(
        'Successfully simulated download for ${engine.name} v${engine.version}',
      );

      // Refresh the downloaded engines list
      await _loadDownloadedEngines();
    } catch (e) {
      debugPrint('Error downloading engine: $e');
      rethrow;
    }
  }

  /// Read version from BPS directory (local storage)
  Future<String?> _readVersionFromBPS(String engineId) async {
    try {
      // Use the same directory logic as DirectoryConstants
      Directory baseDir;
      if (Platform.isAndroid) {
        try {
          final externalDir = await getExternalStorageDirectory();
          baseDir = externalDir != null
              ? Directory('${externalDir.path}/BPS')
              : Directory(
                  '${(await getApplicationDocumentsDirectory()).path}/BPS',
                );
        } catch (e) {
          baseDir = Directory(
            '${(await getApplicationDocumentsDirectory()).path}/BPS',
          );
        }
      } else {
        baseDir = Directory(
          '${(await getApplicationDocumentsDirectory()).path}/BPS',
        );
      }

      final versionFile = File(
        '${baseDir.path}/formengine/$engineId/version.json',
      );

      if (!await versionFile.exists()) {
        return null;
      }

      final content = await versionFile.readAsString();
      final json = jsonDecode(content) as Map<String, dynamic>;
      return json['version'] as String?;
    } catch (e) {
      debugPrint('Error reading version from BPS for engine $engineId: $e');
      return null;
    }
  }

  /// Read version from bundled assets
  Future<String?> _readVersionFromAssets(String engineId) async {
    try {
      final content = await rootBundle.loadString(
        'assets/formengine/$engineId/version.json',
      );
      final json = jsonDecode(content) as Map<String, dynamic>;
      return json['version'] as String?;
    } catch (e) {
      debugPrint('Error reading version from assets for engine $engineId: $e');
      return null;
    }
  }
}

class ModernEngineCard extends StatelessWidget {
  final FormEngineMetadata engine;
  final bool isDownloaded;
  final VoidCallback onTap;

  const ModernEngineCard({
    super.key,
    required this.engine,
    required this.isDownloaded,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    // Determine engine type label and colors based on engine type (ID)
    final engineTypeLabel = engine.id == '1'
        ? 'FormGear Engine'
        : 'FasihForm Engine';
    final primaryColor = engine.id == '1'
        ? const Color(0xFF1E88E5) // Blue for FormGear
        : const Color(0xFF8E24AA); // Purple for FasihForm
    final accentColor = engine.id == '1'
        ? const Color(0xFF42A5F5)
        : const Color(0xFFAB47BC);

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
                      child: Icon(
                        isDownloaded
                            ? Icons.verified_rounded
                            : Icons.rocket_launch_rounded,
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
                            engineTypeLabel,
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Colors.grey[800],
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'v${engine.version}',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: primaryColor,
                            ),
                          ),
                        ],
                      ),
                    ),
                    // Status indicator
                    if (isDownloaded)
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: const Color(0xFF10B981),
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
                      )
                    else
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.orange.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: Colors.orange.withValues(alpha: 0.5),
                            width: 1,
                          ),
                        ),
                        child: const Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              Icons.download_outlined,
                              color: Colors.orange,
                              size: 16,
                            ),
                            SizedBox(width: 4),
                            Text(
                              'Not Downloaded',
                              style: TextStyle(
                                color: Colors.orange,
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
                  engine.description,
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey[600],
                    height: 1.4,
                  ),
                ),
                const SizedBox(height: 16),

                // Technical details
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    _buildEngineTag(
                      'Engine ${engine.id}',
                      primaryColor,
                      Icons.settings_rounded,
                    ),
                    _buildEngineTag(
                      engine.jsFile,
                      const Color(
                        0xFFE65100,
                      ), // Darker orange for better contrast
                      Icons.code_rounded,
                    ),
                    _buildEngineTag(
                      engine.type,
                      const Color(
                        0xFF00695C,
                      ), // Darker teal for better contrast
                      Icons.category_rounded,
                    ),
                  ],
                ),
                const SizedBox(height: 20),

                // Action hint
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      isDownloaded
                          ? Icons.play_arrow_rounded
                          : Icons.download_rounded,
                      size: 16,
                      color: Colors.grey[600],
                    ),
                    const SizedBox(width: 4),
                    Text(
                      isDownloaded
                          ? 'Tap to open template selection'
                          : 'Tap to download engine',
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

  Widget _buildEngineTag(String label, Color color, IconData icon) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: color.withValues(
          alpha: 0.15,
        ), // Increased alpha for better background visibility
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: color.withValues(alpha: 0.4),
          width: 1,
        ), // Increased alpha for border
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
              fontWeight: FontWeight
                  .w700, // Increased font weight for better readability
              color: color,
            ),
          ),
        ],
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
