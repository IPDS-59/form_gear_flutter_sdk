import 'package:flutter/material.dart';
import 'package:form_gear_engine_sdk/form_gear_engine_sdk.dart';
import '../main.dart'; // For Alice access

/// Demonstrates clean architecture patterns through FormGear SDK
/// Focuses on local architecture patterns without remote API dependencies
class CleanArchitectureDemoScreen extends StatefulWidget {
  const CleanArchitectureDemoScreen({super.key});

  @override
  State<CleanArchitectureDemoScreen> createState() =>
      _CleanArchitectureDemoScreenState();
}

class _CleanArchitectureDemoScreenState
    extends State<CleanArchitectureDemoScreen> {
  bool _isLoading = false;
  String _status =
      'Ready to demonstrate clean architecture patterns through SDK';
  String _selectedDemo = '';

  @override
  void initState() {
    super.initState();
    _status =
        '🏗️ FormGear SDK Clean Architecture\n\n'
        'This demo showcases architectural patterns:\n'
        '• Repository Pattern for data access\n'
        '• Use Cases for business logic\n'
        '• Result Pattern for error handling\n'
        '• Dependency Injection for loose coupling\n'
        '• Separation of concerns across layers';
  }

  void _demonstrateResultPattern() {
    setState(() {
      _selectedDemo = 'Result Pattern';
      _status =
          '✅ Result Pattern Demonstration\n\n'
          'Type-safe error handling without exceptions:\n\n'
          '```dart\n'
          'sealed class Result<T> {\n'
          '  const Result();\n'
          '}\n\n'
          'final class Success<T> extends Result<T> {\n'
          '  const Success(this.data);\n'
          '  final T data;\n'
          '}\n\n'
          'final class Failure<T> extends Result<T> {\n'
          '  const Failure(this.error);\n'
          '  final Object error;\n'
          '}\n'
          '```\n\n'
          'Benefits:\n'
          '✅ Explicit error handling\n'
          '✅ Type-safe operations\n'
          '✅ No unexpected exceptions\n'
          '✅ Composable with fold/map/flatMap\n'
          '✅ Railway-oriented programming';
    });
  }

  void _demonstrateRepositoryPattern() {
    setState(() {
      _selectedDemo = 'Repository Pattern';
      _status =
          '📦 Repository Pattern Demonstration\n\n'
          'Clean separation between domain and data layers:\n\n'
          '```dart\n'
          '// Domain layer - Repository interface\n'
          'abstract class FormEngineRepository {\n'
          '  Future<Result<FormEngineResponse>>\n'
          '      checkFormEngineVersion([String? id]);\n'
          '  Future<bool> isFormEngineDownloaded(String id);\n'
          '}\n\n'
          '// Data layer - Implementation\n'
          '@LazySingleton(as: FormEngineRepository)\n'
          'class FormEngineRepositoryImpl\n'
          '    implements FormEngineRepository {\n'
          '  // Concrete implementation with data sources\n'
          '}\n'
          '```\n\n'
          'Benefits:\n'
          '✅ Testable with mock repositories\n'
          '✅ Swappable data sources\n'
          '✅ Business logic independent of data\n'
          '✅ Single Responsibility Principle\n'
          '✅ Interface Segregation';
    });
  }

  void _demonstrateUseCasePattern() {
    setState(() {
      _selectedDemo = 'Use Case Pattern';
      _status =
          '🎯 Use Case Pattern Demonstration\n\n'
          'Business logic isolated in reusable use cases:\n\n'
          '```dart\n'
          'abstract class BaseUseCase<Output, Input, Repo> {\n'
          '  const BaseUseCase(this.repo);\n'
          '  final Repo repo;\n'
          '  Future<Output> call(Input param);\n'
          '}\n\n'
          '@LazySingleton()\n'
          'class CheckFormEngineVersionUseCase\n'
          '    extends BaseUseCase<\n'
          '        Result<FormEngineResponse>,\n'
          '        String?,\n'
          '        FormEngineRepository> {\n'
          '\n'
          '  @override\n'
          '  Future<Result<FormEngineResponse>> call(\n'
          '    [String? formEngineId]\n'
          '  ) async {\n'
          '    final engineId = formEngineId ??\n'
          '        FormEngineType.formGear.id.toString();\n'
          '    return repo.checkFormEngineVersion(engineId);\n'
          '  }\n'
          '}\n'
          '```\n\n'
          'Benefits:\n'
          '✅ Single Responsibility per use case\n'
          '✅ Reusable business logic\n'
          '✅ Easy to test independently\n'
          '✅ Clear input/output contracts\n'
          '✅ Composable operations';
    });
  }

  void _demonstrateDependencyInjection() {
    setState(() {
      _selectedDemo = 'Dependency Injection';
      _status =
          '💉 Dependency Injection Demonstration\n\n'
          'Loose coupling with GetIt + Injectable:\n\n'
          '```dart\n'
          '// Automatic registration\n'
          '@LazySingleton()\n'
          'class MyService { }\n\n'
          '@LazySingleton(as: MyRepository)\n'
          'class MyRepositoryImpl\n'
          '    implements MyRepository { }\n\n'
          '// Module for complex dependencies\n'
          '@module\n'
          'abstract class RegisterModule {\n'
          '  @lazySingleton\n'
          '  Dio dio(FormGearApiConfig config) {\n'
          '    // Configure with interceptors\n'
          '  }\n'
          '}\n\n'
          '// Usage\n'
          'final service = getIt<MyService>();\n'
          'final repo = getIt<MyRepository>();\n'
          '```\n\n'
          'Benefits:\n'
          '✅ Automatic dependency resolution\n'
          '✅ Easy mocking for tests\n'
          '✅ Loose coupling between layers\n'
          '✅ Single source of truth\n'
          '✅ Compile-time safety';
    });
  }

  void _demonstrateLayerSeparation() {
    setState(() {
      _selectedDemo = 'Layer Separation';
      _status =
          '🏢 Layer Separation Demonstration\n\n'
          'Clean Architecture with clear boundaries:\n\n'
          '```\n'
          'lib/src/\n'
          '├── domain/              # Business Logic\n'
          '│   ├── repositories/    # Repository interfaces\n'
          '│   └── usecases/        # Business use cases\n'
          '│\n'
          '├── data/                # Data Layer\n'
          '│   ├── repositories/    # Repository implementations\n'
          '│   ├── datasources/     # Remote/Local data sources\n'
          '│   └── models/          # Data models with JSON\n'
          '│\n'
          '├── core/                # Shared Infrastructure\n'
          '│   ├── base/            # Base classes (Result, UseCase)\n'
          '│   ├── di/              # Dependency injection\n'
          '│   ├── config/          # Configuration models\n'
          '│   └── constants/       # App constants\n'
          '│\n'
          '└── presentation/        # UI Layer\n'
          '    ├── widgets/         # Reusable widgets\n'
          '    ├── screens/         # App screens\n'
          '    └── bloc/            # State management\n'
          '```\n\n'
          'Dependencies flow:\n'
          'Presentation → Domain ← Data ← Core\n\n'
          'Benefits:\n'
          '✅ Clear separation of concerns\n'
          '✅ Testable business logic\n'
          '✅ Independent layer development\n'
          '✅ Easy to maintain and scale\n'
          '✅ SOLID principles applied';
    });
  }

  void _demonstrateErrorHandling() {
    setState(() {
      _selectedDemo = 'Error Handling';
      _status =
          '⚠️ Error Handling Demonstration\n\n'
          'Structured error handling with Failure types:\n\n'
          '```dart\n'
          'sealed class Failure implements Exception {\n'
          '  const Failure(this.message);\n'
          '  final String message;\n'
          '}\n\n'
          'class ServerFailure extends Failure { }\n'
          'class NetworkFailure extends Failure { }\n'
          'class DataFailure extends Failure { }\n'
          'class AuthFailure extends Failure { }\n\n'
          '// Usage in repository\n'
          'Future<Result<Data>> getData() async {\n'
          '  try {\n'
          '    final response = await api.fetch();\n'
          '    return Success(response);\n'
          '  } on DioException catch (e) {\n'
          '    if (e.response?.statusCode == 401) {\n'
          '      return Failure(AuthFailure("Unauthorized"));\n'
          '    }\n'
          '    return Failure(NetworkFailure(e.message));\n'
          '  }\n'
          '}\n\n'
          '// Usage in UI\n'
          'result.fold(\n'
          '  (error) => showError(error.message),\n'
          '  (data) => showData(data),\n'
          ');\n'
          '```\n\n'
          'Benefits:\n'
          '✅ Type-safe error handling\n'
          '✅ Consistent error patterns\n'
          '✅ Easy error recovery\n'
          '✅ Clear error categorization\n'
          '✅ No silent failures';
    });
  }

  void _demonstrateConfigurationManagement() async {
    setState(() {
      _isLoading = true;
      _selectedDemo = 'Configuration Management';
      _status = 'Analyzing SDK configuration...';
    });

    try {
      final currentConfig = FormGearSDK.instance.config;
      final isInitialized = FormGearSDK.instance.isInitialized;

      setState(() {
        _status =
            '⚙️ Configuration Management Analysis\n\n'
            'Current SDK State:\n'
            '• Initialized: ${isInitialized ? '✅ Yes' : '❌ No'}\n'
            '• User: ${currentConfig?.username ?? 'Not set'}\n'
            '• Client Mode: ${currentConfig?.clientMode.name ?? 'Not set'}\n'
            '• Form Mode: ${currentConfig?.formMode.name ?? 'Not set'}\n'
            '• Lookup Mode: ${currentConfig?.lookupMode.name ?? 'Not set'}\n'
            '• Server Port: ${currentConfig?.serverPort ?? 'Not set'}\n'
            '• Logging: ${currentConfig?.enableLogging == true ? 'Enabled' : 'Disabled'}\n\n'
            'Configuration Pattern:\n'
            '```dart\n'
            'final config = FormGearConfig(\n'
            '  clientMode: FormGearClientMode.capi,\n'
            '  lookupMode: FormGearLookupMode.offline,\n'
            '  formMode: FormGearFormMode.open,\n'
            '  bpsUser: const BpsUser(...),\n'
            ');\n\n'
            'await FormGearSDK.instance.initialize(config);\n'
            '```\n\n'
            'Benefits:\n'
            '✅ Centralized configuration\n'
            '✅ Type-safe enum values\n'
            '✅ Immutable config objects\n'
            '✅ Easy to update and test\n'
            '✅ Compile-time safety';
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _status = '❌ Error analyzing configuration: $e';
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
            // Information Card
            _ArchitectureInfoCard(),
            const SizedBox(height: 16),

            // Demo Section Title
            const Text(
              'Architecture Patterns:',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),

            // Demo Buttons
            _DemoButton(
              title: 'Result Pattern',
              subtitle: 'Type-safe error handling without exceptions',
              icon: Icons.check_circle_outline,
              color: Colors.green,
              isSelected: _selectedDemo == 'Result Pattern',
              onPressed: _demonstrateResultPattern,
            ),
            const SizedBox(height: 12),

            _DemoButton(
              title: 'Repository Pattern',
              subtitle: 'Data access abstraction and testability',
              icon: Icons.storage,
              color: Colors.blue,
              isSelected: _selectedDemo == 'Repository Pattern',
              onPressed: _demonstrateRepositoryPattern,
            ),
            const SizedBox(height: 12),

            _DemoButton(
              title: 'Use Case Pattern',
              subtitle: 'Business logic isolation and reusability',
              icon: Icons.business_center,
              color: Colors.purple,
              isSelected: _selectedDemo == 'Use Case Pattern',
              onPressed: _demonstrateUseCasePattern,
            ),
            const SizedBox(height: 12),

            _DemoButton(
              title: 'Dependency Injection',
              subtitle: 'Loose coupling with GetIt + Injectable',
              icon: Icons.link,
              color: Colors.orange,
              isSelected: _selectedDemo == 'Dependency Injection',
              onPressed: _demonstrateDependencyInjection,
            ),
            const SizedBox(height: 12),

            _DemoButton(
              title: 'Layer Separation',
              subtitle: 'Clean architecture with clear boundaries',
              icon: Icons.layers,
              color: Colors.teal,
              isSelected: _selectedDemo == 'Layer Separation',
              onPressed: _demonstrateLayerSeparation,
            ),
            const SizedBox(height: 12),

            _DemoButton(
              title: 'Error Handling',
              subtitle: 'Structured failures and recovery',
              icon: Icons.error_outline,
              color: Colors.red,
              isSelected: _selectedDemo == 'Error Handling',
              onPressed: _demonstrateErrorHandling,
            ),
            const SizedBox(height: 12),

            _DemoButton(
              title: 'Configuration Management',
              subtitle: 'Real-time SDK configuration analysis',
              icon: Icons.settings,
              color: Colors.indigo,
              isSelected: _selectedDemo == 'Configuration Management',
              onPressed: _demonstrateConfigurationManagement,
              isAsync: true,
            ),

            const SizedBox(height: 24),

            // Status Display
            _StatusCard(status: _status, isLoading: _isLoading),
          ],
        ),
      ),
    );
  }
}

// Widget Classes (following the pattern of using widget classes instead of methods)

class _ArchitectureInfoCard extends StatelessWidget {
  const _ArchitectureInfoCard();

  @override
  Widget build(BuildContext context) {
    return Card(
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
                  'Clean Architecture Patterns',
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
              'Explore how FormGear SDK implements clean architecture:',
              style: TextStyle(fontSize: 14),
            ),
            const SizedBox(height: 8),
            const Text('• Separation of concerns across layers'),
            const Text('• SOLID principles in practice'),
            const Text('• Testable and maintainable codebase'),
            const Text('• Scalable architecture patterns'),
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
    required this.isSelected,
    required this.onPressed,
    this.isAsync = false,
  });

  final String title;
  final String subtitle;
  final IconData icon;
  final Color color;
  final bool isSelected;
  final VoidCallback onPressed;
  final bool isAsync;

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: isSelected ? 8 : 2,
      color: isSelected ? color.withOpacity(0.1) : null,
      child: InkWell(
        onTap: onPressed,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.15),
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
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: isSelected ? color : null,
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
              if (isSelected)
                Icon(Icons.check_circle, color: color, size: 20)
              else
                Icon(
                  Icons.arrow_forward_ios,
                  color: Colors.grey[400],
                  size: 16,
                ),
            ],
          ),
        ),
      ),
    );
  }
}

class _StatusCard extends StatelessWidget {
  const _StatusCard({required this.status, required this.isLoading});

  final String status;
  final bool isLoading;

  @override
  Widget build(BuildContext context) {
    return Card(
      color: Colors.grey[50],
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                if (isLoading)
                  const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                else
                  const Icon(Icons.info_outline),
                const SizedBox(width: 8),
                const Text(
                  'Details',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ],
            ),
            const SizedBox(height: 12),
            SelectableText(
              status,
              style: const TextStyle(
                fontSize: 13,
                fontFamily: 'monospace',
                height: 1.4,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
