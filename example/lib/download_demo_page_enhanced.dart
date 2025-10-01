import 'package:flutter/material.dart';
import 'package:form_gear_engine_sdk/form_gear_engine_sdk.dart';

/// Demo page showing that download functionality is now client responsibility
class EnhancedDownloadDemoPage extends StatelessWidget {
  const EnhancedDownloadDemoPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Download Management'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.info_outline,
                size: 80,
                color: Theme.of(context).colorScheme.primary,
              ),
              const SizedBox(height: 24),
              Text(
                'Download Management',
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              Text(
                'As of SDK v2.0, template and lookup downloads are now '
                'the responsibility of the client application.',
                style: Theme.of(context).textTheme.bodyLarge,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'SDK Responsibilities:',
                        style: Theme.of(context).textTheme.titleMedium?.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                      ),
                      const SizedBox(height: 8),
                      _buildBulletPoint('✓ Render forms from local template files'),
                      _buildBulletPoint('✓ Check form engine versions'),
                      _buildBulletPoint('✓ Handle form submissions'),
                      _buildBulletPoint('✓ Manage WebView bridge'),
                      const SizedBox(height: 16),
                      Text(
                        'Client App Responsibilities:',
                        style: Theme.of(context).textTheme.titleMedium?.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                      ),
                      const SizedBox(height: 8),
                      _buildBulletPoint('• Download templates from your API'),
                      _buildBulletPoint('• Download lookup data'),
                      _buildBulletPoint('• Manage local file storage'),
                      _buildBulletPoint('• Handle your own caching strategy'),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),
              ElevatedButton.icon(
                onPressed: () async {
                  // Show example of checking engine download status
                  final isEngine1Downloaded =
                      await FormGearSDK.instance.isFormEngineDownloaded('1');
                  final isEngine2Downloaded =
                      await FormGearSDK.instance.isFormEngineDownloaded('2');

                  if (!context.mounted) return;

                  showDialog(
                    context: context,
                    builder: (context) => AlertDialog(
                      title: const Text('Engine Status'),
                      content: Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'FormGear (ID 1): ${isEngine1Downloaded ? '✓ Installed' : '✗ Not Installed'}',
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'FasihForm (ID 2): ${isEngine2Downloaded ? '✓ Installed' : '✗ Not Installed'}',
                          ),
                        ],
                      ),
                      actions: [
                        TextButton(
                          onPressed: () => Navigator.pop(context),
                          child: const Text('OK'),
                        ),
                      ],
                    ),
                  );
                },
                icon: const Icon(Icons.check_circle_outline),
                label: const Text('Check Engine Status'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBulletPoint(String text) {
    return Padding(
      padding: const EdgeInsets.only(left: 8, bottom: 4),
      child: Text(text),
    );
  }
}
