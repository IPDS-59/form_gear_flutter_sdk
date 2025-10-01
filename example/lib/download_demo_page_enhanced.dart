import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:path_provider/path_provider.dart';

/// Demo page showing how to copy assets from bundle to local storage
class EnhancedDownloadDemoPage extends StatefulWidget {
  const EnhancedDownloadDemoPage({super.key});

  @override
  State<EnhancedDownloadDemoPage> createState() =>
      _EnhancedDownloadDemoPageState();
}

class _EnhancedDownloadDemoPageState extends State<EnhancedDownloadDemoPage> {
  final Map<String, AssetStatus> _assetStatus = {};
  bool _isInitializing = false;

  @override
  void initState() {
    super.initState();
    _checkAssetStatus();
  }

  Future<void> _checkAssetStatus() async {
    final appDocDir = await getApplicationDocumentsDirectory();
    final bpsDir = Directory('${appDocDir.path}/BPS');

    setState(() {
      _assetStatus['FormGear Engine (ID 1)'] = AssetStatus(
        path: '${bpsDir.path}/formengine/1',
        assetPath: 'assets/BPS/formengine/1',
        isInstalled: false,
      );
      _assetStatus['FasihForm Engine (ID 2)'] = AssetStatus(
        path: '${bpsDir.path}/formengine/2',
        assetPath: 'assets/BPS/formengine/2',
        isInstalled: false,
      );
      _assetStatus['Demo Template'] = AssetStatus(
        path: '${bpsDir.path}/Template/demo_template',
        assetPath: 'assets/BPS/Template/demo_template',
        isInstalled: false,
      );
    });

    // Check which assets are installed
    for (final entry in _assetStatus.entries) {
      final dir = Directory(entry.value.path);
      final exists = await dir.exists();
      setState(() {
        _assetStatus[entry.key] = entry.value.copyWith(isInstalled: exists);
      });
    }
  }

  Future<void> _copyAsset(String name, AssetStatus status) async {
    setState(() {
      _assetStatus[name] = status.copyWith(
        isDownloading: true,
        progress: 0,
        error: null,
      );
    });

    try {
      // List all files in the asset directory
      final manifestContent = await rootBundle.loadString('AssetManifest.json');
      final manifestMap = Map<String, dynamic>.from(
        json.decode(manifestContent) as Map,
      );

      // Filter assets that start with our path
      final assetFiles = manifestMap.keys
          .where((key) => key.startsWith(status.assetPath))
          .toList();

      if (assetFiles.isEmpty) {
        throw Exception('No assets found in ${status.assetPath}');
      }

      debugPrint(
        'Copying ${assetFiles.length} files from ${status.assetPath}...',
      );

      for (var i = 0; i < assetFiles.length; i++) {
        final assetFile = assetFiles[i];
        final relativePath = assetFile.substring(status.assetPath.length);
        final targetFile = File('${status.path}$relativePath');

        // Create parent directory
        await targetFile.parent.create(recursive: true);

        // Copy file from assets
        final data = await rootBundle.load(assetFile);
        final bytes = data.buffer.asUint8List();
        await targetFile.writeAsBytes(bytes);

        // Update progress
        final progress = ((i + 1) / assetFiles.length * 100).round();
        setState(() {
          _assetStatus[name] = status.copyWith(progress: progress);
        });

        // Small delay to show progress
        await Future.delayed(const Duration(milliseconds: 50));
      }

      setState(() {
        _assetStatus[name] = status.copyWith(
          isDownloading: false,
          isInstalled: true,
          progress: 100,
        );
      });

      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('✓ $name copied successfully')));
      }
    } catch (e) {
      setState(() {
        _assetStatus[name] = status.copyWith(
          isDownloading: false,
          error: e.toString(),
        );
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('✗ Failed to copy $name: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  Future<void> _deleteAsset(String name, AssetStatus status) async {
    final dir = Directory(status.path);
    if (await dir.exists()) {
      await dir.delete(recursive: true);
      setState(() {
        _assetStatus[name] = status.copyWith(isInstalled: false, progress: 0);
      });

      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('✓ $name deleted')));
      }
    }
  }

  Future<void> _copyAllAssets() async {
    setState(() => _isInitializing = true);

    for (final entry in _assetStatus.entries) {
      if (!entry.value.isInstalled && !entry.value.isDownloading) {
        await _copyAsset(entry.key, entry.value);
      }
    }

    setState(() => _isInitializing = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Asset Download Demo'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _checkAssetStatus,
            tooltip: 'Refresh Status',
          ),
        ],
      ),
      body: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            color: Theme.of(context).colorScheme.primaryContainer,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Asset Management',
                  style: Theme.of(
                    context,
                  ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                Text(
                  'This demo shows copying bundled assets from the app bundle '
                  'to local storage (BPS directory).',
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
              ],
            ),
          ),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: _assetStatus.entries.map((entry) {
                return _buildAssetCard(entry.key, entry.value);
              }).toList(),
            ),
          ),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.surface,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.1),
                  blurRadius: 8,
                  offset: const Offset(0, -2),
                ),
              ],
            ),
            child: SafeArea(
              child: ElevatedButton.icon(
                onPressed: _isInitializing ? null : _copyAllAssets,
                icon: _isInitializing
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : const Icon(Icons.download_for_offline),
                label: Text(_isInitializing ? 'Copying...' : 'Copy All Assets'),
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  minimumSize: const Size(double.infinity, 50),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAssetCard(String name, AssetStatus status) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
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
                        name,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        status.path,
                        style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                      ),
                    ],
                  ),
                ),
                _buildStatusIcon(status),
              ],
            ),
            if (status.isDownloading) ...[
              const SizedBox(height: 12),
              LinearProgressIndicator(
                value: status.progress / 100,
                backgroundColor: Colors.grey[200],
              ),
              const SizedBox(height: 4),
              Text('${status.progress}%', style: const TextStyle(fontSize: 12)),
            ],
            if (status.error != null) ...[
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.red[50],
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Row(
                  children: [
                    Icon(Icons.error_outline, size: 16, color: Colors.red[700]),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        status.error!,
                        style: TextStyle(fontSize: 12, color: Colors.red[700]),
                      ),
                    ),
                  ],
                ),
              ),
            ],
            if (status.isInstalled && !status.isDownloading) ...[
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: () => _deleteAsset(name, status),
                      icon: const Icon(Icons.delete_outline, size: 18),
                      label: const Text('Delete'),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: Colors.red,
                      ),
                    ),
                  ),
                ],
              ),
            ],
            if (!status.isInstalled && !status.isDownloading) ...[
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: () => _copyAsset(name, status),
                      icon: const Icon(Icons.download, size: 18),
                      label: const Text('Copy from Bundle'),
                    ),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildStatusIcon(AssetStatus status) {
    if (status.isDownloading) {
      return const SizedBox(
        width: 24,
        height: 24,
        child: CircularProgressIndicator(strokeWidth: 2),
      );
    } else if (status.isInstalled) {
      return const Icon(Icons.check_circle, color: Colors.green, size: 24);
    } else if (status.error != null) {
      return const Icon(Icons.error, color: Colors.red, size: 24);
    } else {
      return const Icon(Icons.cloud_download, color: Colors.grey, size: 24);
    }
  }
}

class AssetStatus {
  final String path;
  final String assetPath;
  final bool isInstalled;
  final bool isDownloading;
  final int progress;
  final String? error;

  AssetStatus({
    required this.path,
    required this.assetPath,
    required this.isInstalled,
    this.isDownloading = false,
    this.progress = 0,
    this.error,
  });

  AssetStatus copyWith({
    String? path,
    String? assetPath,
    bool? isInstalled,
    bool? isDownloading,
    int? progress,
    String? error,
  }) {
    return AssetStatus(
      path: path ?? this.path,
      assetPath: assetPath ?? this.assetPath,
      isInstalled: isInstalled ?? this.isInstalled,
      isDownloading: isDownloading ?? this.isDownloading,
      progress: progress ?? this.progress,
      error: error,
    );
  }
}
