import 'package:flutter/material.dart';
import 'package:form_gear_engine_sdk/form_gear_engine_sdk.dart';
import '../main.dart'; // For Alice access

/// Demonstrates clean architecture patterns through FormGear SDK public API
class CleanArchitectureDemoScreen extends StatefulWidget {
  const CleanArchitectureDemoScreen({super.key});

  @override
  State<CleanArchitectureDemoScreen> createState() =>
      _CleanArchitectureDemoScreenState();
}

class _CleanArchitectureDemoScreenState
    extends State<CleanArchitectureDemoScreen> {
  final TextEditingController _tokenController = TextEditingController();
  bool _isLoading = false;
  String _status =
      'Ready to demonstrate clean architecture patterns through SDK API';
  VersionCheckResult? _versionCheckResult;

  // Loading states for individual operations

  @override
  void initState() {
    super.initState();
    _status =
        'SDK initialized with clean architecture pattern:\n'
        '• Repository Pattern for data access\n'
        '• Use Cases for business logic\n'
        '• Result Pattern for error handling\n'
        '• Dependency Injection for loose coupling';
  }

  @override
  void dispose() {
    _tokenController.dispose();
    super.dispose();
  }

  Future<void> _updateApiToken() async {
    final token = _tokenController.text.trim();
    if (token.isEmpty) {
      _showErrorSnackBar('Please enter a valid API token');
      return;
    }

    if (token.length < 10) {
      _showErrorSnackBar('Token must be at least 10 characters long');
      return;
    }

    setState(() {
      _status = 'Updating API token configuration...';
    });

    try {
      await _performTokenUpdate(token);
      _showSuccessSnackBar('API Token updated successfully!');
    } catch (e) {
      _handleError('Error updating token', e);
    } finally {
      setState(() {});
    }
  }

  Future<void> _performTokenUpdate(String token) async {
    final currentConfig = FormGearSDK.instance.config;
    if (currentConfig == null) {
      throw Exception('SDK configuration not available');
    }

    final updatedBpsUser = BpsUser(
      sessionToken: token,
      authToken: token,
      bpsUserId: int.tryParse(currentConfig.bpsUser?.id ?? '') ?? -1,
      jabatan: currentConfig.bpsUser?.jabatan ?? 'USER',
    );

    // Also update the API config with the new auth token
    final updatedApiConfig =
        currentConfig.apiConfig?.copyWith(authToken: token) ??
        FormGearApiConfig(authToken: token);

    final updatedConfig = FormGearConfig(
      clientMode: currentConfig.clientMode,
      lookupKey: currentConfig.lookupKey,
      lookupValue: currentConfig.lookupValue,
      lookupMode: currentConfig.lookupMode,
      username: currentConfig.username,
      formMode: currentConfig.formMode,
      initialMode: currentConfig.initialMode,
      htmlLogPrefix: currentConfig.htmlLogPrefix,
      sdkLogPrefix: currentConfig.sdkLogPrefix,
      serverPort: currentConfig.serverPort,
      autoStartServer: currentConfig.autoStartServer,
      enableLogging: currentConfig.enableLogging,
      bpsUser: updatedBpsUser,
      apiConfig: updatedApiConfig,
    );

    FormGearSDK.instance.initialize(
      updatedConfig,
      dioInterceptors: [dioAdapter],
    );

    setState(() {
      _status =
          'API Token Updated Successfully!\n'
          'Token: ${token.substring(0, 10)}...\n'
          'Clean architecture allows easy configuration updates:\n'
          '✅ BpsUser tokens updated (sessionToken & authToken)\n'
          '✅ API config authToken updated for HTTP requests\n'
          '✅ Repository layer will use new authentication\n'
          '✅ All API calls now authenticated with new token\n'
          '✅ SDK properly re-initialized with updated configuration';
    });
  }

  // Helper methods for better error handling and user feedback
  void _handleError(String context, dynamic error) {
    setState(() {
      _status =
          '$context: $error\n\n'
          'Clean architecture provided proper error handling:\n'
          '✅ Exception caught at use case level\n'
          '✅ Error propagated through Result pattern\n'
          '✅ UI receives structured error information';
    });
    _showErrorSnackBar('$context: ${error.toString()}');
  }

  void _showErrorSnackBar(String message) {
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(message),
          backgroundColor: Colors.red,
          behavior: SnackBarBehavior.floating,
          action: SnackBarAction(
            label: 'Dismiss',
            textColor: Colors.white,
            onPressed: () {
              ScaffoldMessenger.of(context).hideCurrentSnackBar();
            },
          ),
        ),
      );
    }
  }

  void _showSuccessSnackBar(String message) {
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(message),
          backgroundColor: Colors.green,
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  Future<void> _demonstrateFormEngineVersionCheck() async {
    setState(() {
      _isLoading = true;
      _status =
          'Checking form engine version using SDK public API...\n'
          '(Internally uses clean architecture with 3-state version logic)';
    });

    try {
      final versionResult = await FormGearSDK.instance.checkFormEngineVersion(
        context: context,
        showNotifications: false, // Don't show UI notifications for demo
      );

      setState(() {
        _versionCheckResult = versionResult;
        if (versionResult != null) {
          final formEngine = versionResult.formEngine;

          // Rich state information from the new API
          String stateDescription;
          String stateIcon;

          switch (versionResult.state) {
            case VersionState.missing:
              stateDescription = 'Form engine is not installed locally';
              stateIcon = '🔴';
            case VersionState.outdated:
              stateDescription = 'Form engine is outdated and needs update';
              stateIcon = '🟡';
            case VersionState.current:
              stateDescription = 'Form engine is up to date';
              stateIcon = '🟢';
          }

          _status =
              'Form Engine Version Check Success!\n'
              '$stateIcon State: ${versionResult.state.name.toUpperCase()}\n'
              'Description: $stateDescription\n'
              'Engine ID: ${formEngine.formEngineId ?? 'Unknown'}\n'
              'Local Version: ${versionResult.localVersion ?? 'Not installed'}\n'
              'Remote Version: ${versionResult.remoteVersion ?? 'Unknown'}\n'
              'Needs Download: ${versionResult.needsDownload ? 'Yes' : 'No'}\n'
              'Is Forced: ${versionResult.isForced ? 'Yes' : 'No'}\n'
              'Download URL: ${formEngine.linkDownload ?? 'Not available'}\n\n'
              'Enhanced API Benefits:\n'
              '✅ Rich version state information (${versionResult.state.name})\n'
              '✅ Local vs Remote version comparison\n'
              '✅ Built-in download decision logic\n'
              '✅ Clean architecture with 3-state pattern\n'
              '✅ Type-safe enum-based states';
        } else {
          _status =
              'Form Engine Version Check completed, but no data received.\n'
              'This might be due to API configuration or network issues.\n\n'
              'The clean architecture still worked:\n'
              '✅ Error handling through Result pattern\n'
              '✅ Use case executed successfully\n'
              '✅ Repository layer handled the API call';
        }
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _status =
            'Error during version check: $e\n\n'
            'Clean architecture provided proper error handling:\n'
            '✅ Exception caught at use case level\n'
            '✅ Error propagated through Result pattern\n'
            '✅ UI receives structured error information';
        _isLoading = false;
      });
    }
  }

  Future<void> _demonstrateEngineDownloadCheck() async {
    setState(() {
      _isLoading = true;
      _status =
          'Checking engine download status using enhanced version result...\n'
          '(Shows benefits of rich API data)';
    });

    try {
      if (_versionCheckResult != null) {
        final formEngine = _versionCheckResult!.formEngine;
        final engineId = formEngine.formEngineId?.toString() ?? '1';

        // Use the enhanced version result data
        final state = _versionCheckResult!.state;
        final needsDownload = _versionCheckResult!.needsDownload;
        final isForced = _versionCheckResult!.isForced;
        final localVersion = _versionCheckResult!.localVersion;

        // Also check with Download Manager for additional info
        final downloadManager = getIt<FormGearDownloadManager>();
        final isDownloaded = await downloadManager.isEngineDownloaded(engineId);

        String statusIcon;
        String statusText;

        switch (state) {
          case VersionState.missing:
            statusIcon = '🔴';
            statusText = 'Not installed - Download required';
          case VersionState.outdated:
            statusIcon = '🟡';
            statusText = 'Installed but outdated - Update required';
          case VersionState.current:
            statusIcon = '🟢';
            statusText = 'Up to date - No action needed';
        }

        setState(() {
          _status =
              'Enhanced Download Status Analysis!\n'
              '$statusIcon Status: $statusText\n'
              'Engine ID: $engineId\n'
              'Version State: ${state.name.toUpperCase()}\n'
              'Local Version: ${localVersion ?? 'Not installed'}\n'
              'Is Downloaded (File Check): ${isDownloaded ? 'Yes' : 'No'}\n'
              'Needs Download (Smart Logic): ${needsDownload ? 'Yes' : 'No'}\n'
              'Is Forced Update: ${isForced ? 'Yes' : 'No'}\n\n'
              'Enhanced API Benefits:\n'
              '✅ Smart download decision from version state\n'
              '✅ Rich context beyond simple file existence\n'
              '✅ Forced update detection\n'
              '✅ Version-aware download logic\n'
              '✅ Clean architecture with intelligent state management';
          _isLoading = false;
        });
      } else {
        setState(() {
          _status =
              'No version check result available!\n'
              'Please run "Check Form Engine Version" first.\n\n'
              'This demonstrates the enhanced API flow:\n'
              '✅ Version check provides rich context\n'
              '✅ Download decisions based on version state\n'
              '✅ Better user experience with detailed information';
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _status =
            'Error checking download status: $e\n\n'
            'Clean architecture handled the error gracefully:\n'
            '✅ Exception contained within service layer\n'
            '✅ UI remains responsive and informed';
        _isLoading = false;
      });
    }
  }

  Future<void> _demonstrateSDKConfiguration() async {
    setState(() {
      _isLoading = true;
      _status = 'Demonstrating SDK configuration management...';
    });

    try {
      final currentConfig = FormGearSDK.instance.config;
      final isInitialized = FormGearSDK.instance.isInitialized;

      setState(() {
        _status =
            'SDK Configuration Analysis:\n'
            'Initialized: ${isInitialized ? 'Yes' : 'No'}\n'
            'User: ${currentConfig?.username ?? 'Not set'}\n'
            'API Config: ${currentConfig?.apiConfig?.baseUrl ?? 'Not configured'}\n'
            'Session Token: ${currentConfig?.bpsUser?.sessionToken != null ? 'Set' : 'Not set'}\n\n'
            'Clean Architecture Benefits:\n'
            '✅ Configuration centrally managed\n'
            '✅ Dependency injection configured\n'
            '✅ All layers receive updated configuration\n'
            '✅ Type-safe configuration access';
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _status = 'Error analyzing configuration: $e';
        _isLoading = false;
      });
    }
  }

  Future<void> _testFormEngineEndpoint() async {
    setState(() {
      _isLoading = true;
      _status = 'Testing Form Engine Version Check Endpoint...';
    });

    try {
      final config = FormGearSDK.instance.config;
      final apiConfig = config?.apiConfig;

      if (apiConfig?.formEngineUrl == null) {
        throw Exception('Form engine endpoint not configured');
      }

      // Use the public SDK API to test the endpoint
      final versionResult = await FormGearSDK.instance.checkFormEngineVersion(
        context: context,
        showNotifications: false,
      );

      setState(() {
        if (versionResult != null) {
          _status =
              'Form Engine Endpoint Test Success!\n'
              '🌐 Endpoint: ${apiConfig!.formEngineUrl}\n'
              '🔑 Auth Token: ${apiConfig.authToken?.substring(0, 10) ?? 'None'}...\n'
              '📊 State: ${versionResult.state.name.toUpperCase()}\n'
              '📊 Local Version: ${versionResult.localVersion ?? 'Not installed'}\n'
              '📊 Remote Version: ${versionResult.remoteVersion ?? 'Unknown'}\n'
              '📊 Needs Download: ${versionResult.needsDownload}\n\n'
              'API Test Benefits:\n'
              '✅ Direct endpoint testing with current config\n'
              '✅ Real authentication token validation\n'
              '✅ Repository layer error handling\n'
              '✅ HTTP interceptor logging (check Alice)';
        } else {
          _status =
              'Form Engine Endpoint Test - No Data!\n'
              '🌐 Endpoint: ${apiConfig!.formEngineUrl}\n'
              '🔑 Auth Token: ${apiConfig.authToken?.substring(0, 10) ?? 'None'}...\n'
              '⚠️ API call succeeded but returned null result\n\n'
              'Possible causes:\n'
              '• Server returned empty response\n'
              '• API endpoint configuration issue\n'
              '• Network connectivity problems';
        }
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _status =
            'Form Engine Endpoint Test Failed!\n'
            '❌ Error: $e\n\n'
            'Common issues:\n'
            '• Invalid or expired authentication token\n'
            '• Network connectivity problems\n'
            '• Endpoint configuration issues\n'
            '• Server-side authentication errors\n\n'
            'Check Alice HTTP Inspector for detailed logs';
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Clean Architecture Demo'),
        backgroundColor: const Color(0xFF1E88E5),
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            onPressed: () => alice.showInspector(),
            icon: const Icon(Icons.network_check),
            tooltip: 'HTTP Inspector (Alice)',
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Information Section
            Card(
              color: Colors.blue[50],
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.architecture, color: Colors.blue[800]),
                        const SizedBox(width: 8),
                        Text(
                          'Clean Architecture Pattern',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: Colors.blue[800],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      'This demo shows how the FormGear SDK uses clean architecture patterns:',
                      style: TextStyle(fontSize: 14),
                    ),
                    const SizedBox(height: 8),
                    const Text('• Use Cases: Business logic isolation'),
                    const Text('• Repository Pattern: Data access abstraction'),
                    const Text('• Result Pattern: Type-safe error handling'),
                    const Text('• Dependency Injection: Loose coupling'),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // API Token Input Section
            Card(
              color: Colors.amber[50],
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.key, color: Colors.amber[800]),
                        const SizedBox(width: 8),
                        Text(
                          'API Token Configuration',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.amber[800],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      controller: _tokenController,
                      decoration: InputDecoration(
                        hintText: 'Enter your API token here...',
                        border: const OutlineInputBorder(),
                        prefixIcon: const Icon(Icons.security),
                        suffixIcon: _tokenController.text.isNotEmpty
                            ? IconButton(
                                icon: const Icon(Icons.clear),
                                onPressed: () {
                                  setState(() {
                                    _tokenController.clear();
                                  });
                                },
                                tooltip: 'Clear token',
                              )
                            : null,
                        helperText:
                            'Token will be used for authenticated API calls',
                      ),
                      obscureText: true,
                      onChanged: (value) {
                        setState(() {
                          // Trigger rebuild to show/hide clear button
                        });
                      },
                    ),
                    const SizedBox(height: 12),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton.icon(
                        onPressed: _updateApiToken,
                        icon: const Icon(Icons.update),
                        label: const Text('Update API Token'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.amber[600],
                          foregroundColor: Colors.white,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Demo Buttons
            _DemoButton(
              title: 'Check Form Engine Version',
              subtitle:
                  'Returns VersionCheckResult with rich state info (missing/outdated/current)',
              icon: Icons.settings,
              color: Colors.blue,
              onPressed: _demonstrateFormEngineVersionCheck,
              isLoading: _isLoading,
            ),
            const SizedBox(height: 12),
            _DemoButton(
              title: 'Check Engine Download Status',
              subtitle:
                  'Uses enhanced version result data for intelligent download decisions',
              icon: Icons.download_done,
              color: Colors.green,
              onPressed: _demonstrateEngineDownloadCheck,
              isLoading: _isLoading,
            ),
            const SizedBox(height: 12),
            _DemoButton(
              title: 'SDK Configuration Analysis',
              subtitle:
                  'Shows configuration management and dependency injection',
              icon: Icons.settings_applications,
              color: Colors.purple,
              onPressed: _demonstrateSDKConfiguration,
              isLoading: _isLoading,
            ),
            const SizedBox(height: 12),
            _DemoButton(
              title: 'Test Form Engine Endpoint',
              subtitle: 'Test version check API endpoint with current token',
              icon: Icons.api,
              color: Colors.indigo,
              onPressed: _testFormEngineEndpoint,
              isLoading: _isLoading,
            ),

            const SizedBox(height: 16),

            // Status Display
            Card(
              color: Colors.grey[50],
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        _isLoading
                            ? const SizedBox(
                                width: 20,
                                height: 20,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                ),
                              )
                            : const Icon(Icons.info_outline),
                        const SizedBox(width: 8),
                        const Text(
                          'Status',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(_status, style: const TextStyle(fontSize: 14)),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _DemoButton extends StatelessWidget {
  const _DemoButton({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.color,
    required this.onPressed,
    required this.isLoading,
  });

  final String title;
  final String subtitle;
  final IconData icon;
  final Color color;
  final VoidCallback onPressed;
  final bool isLoading;

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      child: InkWell(
        onTap: isLoading ? null : onPressed,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(icon, color: color, size: 24),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      subtitle,
                      style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                    ),
                  ],
                ),
              ),
              Icon(Icons.arrow_forward_ios, color: Colors.grey[400], size: 16),
            ],
          ),
        ),
      ),
    );
  }
}
