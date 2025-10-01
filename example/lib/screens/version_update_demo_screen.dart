import 'package:flutter/material.dart';
import 'package:form_gear_engine_sdk/form_gear_engine_sdk.dart';

// Import screens directly since they're not exported
// This is acceptable for demo/example code
import 'package:form_gear_engine_sdk/src/presentation/screens/form_engine_update_screen.dart';

class VersionUpdateDemoScreen extends StatelessWidget {
  const VersionUpdateDemoScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Version Update Demo')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'Version Update Screen Demos',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 24),
            _buildDemoSection(context, 'Form Engine Updates', [
              _buildDemoCard(
                context,
                'Missing Engine (Forced)',
                'Show forced download for missing form engine',
                () => _showFormEngineUpdate(
                  context,
                  VersionCheckResult(
                    state: VersionState.missing,
                    formEngine: _createMockFormEngine(isForced: true),
                    remoteVersion: '2.1.0',
                  ),
                ),
              ),
              _buildDemoCard(
                context,
                'Outdated Engine (Optional)',
                'Show optional update for outdated form engine',
                () => _showFormEngineUpdate(
                  context,
                  VersionCheckResult(
                    state: VersionState.outdated,
                    formEngine: _createMockFormEngine(isForced: false),
                    localVersion: '1.5.0',
                    remoteVersion: '2.1.0',
                  ),
                ),
              ),
              _buildDemoCard(
                context,
                'Current Engine',
                'Show re-download option for current engine',
                () => _showFormEngineUpdate(
                  context,
                  VersionCheckResult(
                    state: VersionState.current,
                    formEngine: _createMockFormEngine(isForced: false),
                    localVersion: '2.1.0',
                    remoteVersion: '2.1.0',
                  ),
                ),
              ),
            ]),
          ],
        ),
      ),
    );
  }

  Widget _buildDemoSection(
    BuildContext context,
    String title,
    List<Widget> children,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: Theme.of(
            context,
          ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w600),
        ),
        const SizedBox(height: 12),
        ...children,
      ],
    );
  }

  Widget _buildDemoCard(
    BuildContext context,
    String title,
    String description,
    VoidCallback onTap,
  ) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        title: Text(title),
        subtitle: Text(description),
        trailing: const Icon(Icons.arrow_forward_ios, size: 16),
        onTap: onTap,
      ),
    );
  }

  Future<void> _showFormEngineUpdate(
    BuildContext context,
    VersionCheckResult versionResult,
  ) async {
    await FormEngineUpdateScreen.show(
      context: context,
      versionResult: versionResult,
      onDownload: (onProgress) => _simulateDownload(onProgress),
    );
  }

  Future<void> _simulateDownload(void Function(int progress) onProgress) async {
    // Simulate download progress (SDK no longer handles downloads directly)
    // In real app, you would implement your own download logic here
    for (var i = 0; i <= 100; i += 10) {
      await Future.delayed(const Duration(milliseconds: 300));
      onProgress(i);
      debugPrint('Download progress: $i%');
    }

    debugPrint('Form engine download simulation completed');
  }

  FormEngineEntity _createMockFormEngine({required bool isForced}) {
    return FormEngineEntity(
      formEngineId: 1, // FormGear engine ID
      id: 'demo_engine_id',
      version: '2.1.0',
      linkDownload: 'https://example.com/engine.zip',
      isForce: isForced,
      message: 'Demo engine for testing',
      isDefault: true,
    );
  }
}
