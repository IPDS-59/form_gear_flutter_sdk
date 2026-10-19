// The built-in recorder is the deprecated fallback for a host without the
// capability (removed in 1.0.0), so its own file may use and keep it.
// ignore_for_file: deprecated_member_use_from_same_package, deprecated_consistency, remove_deprecations_in_breaking_versions

import 'package:flutter/material.dart';
import 'package:form_gear_engine_sdk/src/presentation/helpers/modern_dialog_helper.dart';
import 'package:form_gear_engine_sdk/src/presentation/widgets/audio_recorder_screen.dart';

/// Demo screen for testing audio recording and barcode scanning widgets
/// Following FormGear design system and FASIH patterns
class MediaDemoScreen extends StatelessWidget {
  const MediaDemoScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Media Demo'),
        backgroundColor: Colors.blue.shade800,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Header
            const Text(
              'FormGear Media Widgets Demo',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              'Test audio recording',
              style: TextStyle(fontSize: 16, color: Colors.grey.shade600),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 48),

            // Audio Recording Card
            _MediaCard(
              title: 'Audio Recording',
              subtitle: 'Record audio with FASIH media management',
              icon: Icons.mic,
              color: Colors.red,
              onTap: () => _openAudioRecorder(context),
            ),

            const Spacer(),

            // Info section
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.blue.shade50,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.blue.shade200),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(
                        Icons.info_outline,
                        color: Colors.blue.shade700,
                        size: 20,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        'FASIH Integration',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          color: Colors.blue.shade700,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '• Files saved to BPS/assignments/[id]/media/\n'
                    '• Media references tracked in media.json\n'
                    '• Permission handling with BLoC state management\n'
                    '• FASIH-compatible file naming patterns',
                    style: TextStyle(fontSize: 14, color: Colors.blue.shade600),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _openAudioRecorder(BuildContext context) {
    Navigator.of(context)
        .push<String?>(
          MaterialPageRoute<String?>(
            builder: (context) => const AudioRecorderScreen(
              title: 'Demo Audio Recording',
              assignmentId: 'demo_assignment_001',
              fileName: 'demo_audio_recording.m4a',
              dataKey: 'Audio Response for User Feedback',
              templateName: 'Family Characteristics Survey Demo',
            ),
          ),
        )
        .then((result) {
          if (result != null) {
            _showResultDialog(
              context,
              'Audio Recording Complete',
              'File saved: $result',
              Icons.mic,
              Colors.red,
            );
          }
        });
  }

  void _showResultDialog(
    BuildContext context,
    String title,
    String message,
    IconData icon,
    Color color,
  ) {
    ModernDialogHelper.showResultDialog(
      context: context,
      title: title,
      message: message,
      icon: icon,
      iconColor: color,
    );
  }
}

class _MediaCard extends StatelessWidget {
  const _MediaCard({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.color,
    required this.onTap,
  });

  final String title;
  final String subtitle;
  final IconData icon;
  final Color color;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Row(
            children: [
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, size: 32, color: color),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      subtitle,
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey.shade600,
                      ),
                    ),
                  ],
                ),
              ),
              Icon(
                Icons.arrow_forward_ios,
                color: Colors.grey.shade400,
                size: 16,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
