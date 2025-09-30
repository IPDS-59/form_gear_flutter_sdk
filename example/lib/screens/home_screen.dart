import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:form_gear_engine_sdk/src/presentation/widgets/media_demo_screen.dart';
import 'simple_typed_bridge_test_screen.dart';
import 'form_engine_selection_screen.dart';
import 'clean_architecture_demo_screen.dart';
import 'version_update_demo_screen.dart';
import 'loading_screen_demo.dart';
import 'assignment_demo_screen.dart';
import 'form_data_listener_demo_screen.dart';
import '../download_demo_page_enhanced.dart';
import '../main.dart'; // For Alice access

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: const Text('Form Gear SDK Demo'),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // FormGear Logo Section
            Container(
              padding: const EdgeInsets.symmetric(vertical: 20),
              child: Column(
                children: [
                  Container(
                    width: 120,
                    height: 120,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.1),
                          blurRadius: 20,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(16),
                      child: Container(
                        color: Colors.white,
                        padding: const EdgeInsets.all(8),
                        child: SvgPicture.asset(
                          'packages/form_gear_engine_sdk/assets/logo/form-gear.svg',
                          fit: BoxFit.contain,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Form Gear SDK',
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF1E88E5),
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF42D9FF), Color(0xFF1E88E5)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Text(
                      'ENGINE DEMO',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        letterSpacing: 1.2,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Core Features Section
            const Text(
              'Core Features:',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            _buildDemoCard(
              context,
              title: 'Launch Form Engine',
              subtitle: 'Test different form engine implementations',
              icon: Icons.rocket_launch,
              gradientColors: [Color(0xFF1E88E5), Color(0xFF1976D2)],
              onTap: () => Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const FormEngineSelectionScreen(),
                ),
              ),
            ),
            const SizedBox(height: 12),
            _buildDemoCard(
              context,
              title: 'Assignment-Based Configuration',
              subtitle: 'Dynamic configuration per template/assignment',
              icon: Icons.assignment,
              gradientColors: [Color(0xFF9C27B0), Color(0xFF673AB7)],
              onTap: () => Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const AssignmentDemoScreen(),
                ),
              ),
            ),
            const SizedBox(height: 12),
            _buildDemoCard(
              context,
              title: 'SaveOrSubmit Listener',
              subtitle: 'Test custom data persistence strategies',
              icon: Icons.save_alt,
              gradientColors: [Color(0xFF4CAF50), Color(0xFF2E7D32)],
              onTap: () => Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const FormDataListenerDemoScreen(),
                ),
              ),
            ),
            const SizedBox(height: 12),
            _buildDemoCard(
              context,
              title: 'Media Features',
              subtitle: 'Audio recording and barcode scanning',
              icon: Icons.perm_media,
              gradientColors: [Color(0xFFE91E63), Color(0xFFC2185B)],
              onTap: () => Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const MediaDemoScreen(),
                ),
              ),
            ),

            const SizedBox(height: 24),
            const Text(
              'Additional Demos:',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            _buildDemoCard(
              context,
              title: 'Download Demo',
              subtitle: 'Asset download and management',
              icon: Icons.download,
              gradientColors: [Color(0xFF42D9FF), Color(0xFF00BCD4)],
              onTap: () => Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const EnhancedDownloadDemoPage(),
                ),
              ),
            ),
            const SizedBox(height: 12),
            _buildDemoCard(
              context,
              title: 'Clean Architecture Demo',
              subtitle: 'Repository pattern and use cases',
              icon: Icons.architecture,
              gradientColors: [Color(0xFF9C27B0), Color(0xFF673AB7)],
              onTap: () => Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const CleanArchitectureDemoScreen(),
                ),
              ),
            ),
            const SizedBox(height: 12),
            _buildDemoCard(
              context,
              title: 'Version Update Demo',
              subtitle: 'Version checking and updates',
              icon: Icons.system_update,
              gradientColors: [Color(0xFFFF9800), Color(0xFFFF6F00)],
              onTap: () => Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const VersionUpdateDemoScreen(),
                ),
              ),
            ),
            const SizedBox(height: 12),
            _buildDemoCard(
              context,
              title: 'Loading Screen Demo',
              subtitle: 'Loading states and animations',
              icon: Icons.hourglass_empty,
              gradientColors: [Color(0xFF8BC34A), Color(0xFF689F38)],
              onTap: () => Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const LoadingScreenDemo(),
                ),
              ),
            ),
            const SizedBox(height: 32),
            const Divider(),
            const SizedBox(height: 16),
            const Text(
              'SDK Features (Auto-Registered):',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 12),
            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('🔧 Simple Typed Bridge System'),
                Text('📷 Camera Action (Auto-handled)'),
                Text('📁 File Picker Action (Auto-handled)'),
                Text('📍 Location Action (Auto-handled)'),
                Text('🔒 Internal Permission Management'),
                Text('🎯 Custom Handler Support'),
              ],
            ),
          ],
        ),
      ),
      floatingActionButton: Column(
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          // Alice HTTP Inspector Button
          Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(28),
              gradient: const LinearGradient(
                colors: [Color(0xFFFF5722), Color(0xFFE64A19)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFFFF5722).withValues(alpha: 0.4),
                  blurRadius: 12,
                  offset: const Offset(0, 6),
                ),
              ],
            ),
            child: FloatingActionButton(
              onPressed: () => alice.showInspector(),
              heroTag: "alice_inspector",
              backgroundColor: Colors.transparent,
              elevation: 0,
              child: const Icon(Icons.network_check, color: Colors.white),
            ),
          ),
          const SizedBox(height: 16),
          // SDK Integration Button
          Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(28),
              gradient: const LinearGradient(
                colors: [Color(0xFF4CAF50), Color(0xFF45A049)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF4CAF50).withValues(alpha: 0.4),
                  blurRadius: 12,
                  offset: const Offset(0, 6),
                ),
              ],
            ),
            child: FloatingActionButton.extended(
              onPressed: () => Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const SimpleTypedBridgeTestScreen(),
                ),
              ),
              icon: const Icon(Icons.analytics, color: Colors.white),
              label: const Text(
                'SDK Integration',
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.w600,
                ),
              ),
              backgroundColor: Colors.transparent,
              elevation: 0,
              heroTag: "sdk_integration",
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDemoCard(
    BuildContext context, {
    required String title,
    required String subtitle,
    required IconData icon,
    required List<Color> gradientColors,
    required VoidCallback onTap,
  }) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        gradient: LinearGradient(
          colors: gradientColors,
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        boxShadow: [
          BoxShadow(
            color: gradientColors.first.withValues(alpha: 0.3),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(12),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(icon, color: Colors.white, size: 24),
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
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        subtitle,
                        style: TextStyle(
                          fontSize: 13,
                          color: Colors.white.withValues(alpha: 0.8),
                        ),
                      ),
                    ],
                  ),
                ),
                Icon(
                  Icons.arrow_forward_ios,
                  color: Colors.white.withValues(alpha: 0.7),
                  size: 16,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
