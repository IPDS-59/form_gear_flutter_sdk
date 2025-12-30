import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';

/// Permission denied view for audio recording
class AudioPermissionWidget extends StatelessWidget {
  const AudioPermissionWidget({super.key});

  void _openAppSettings() {
    openAppSettings();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Spacer(flex: 2),
        const Center(
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                'Oops,',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w400,
                  color: Color(0xFF6B7280),
                ),
              ),
              SizedBox(width: 12),
              Text(
                '🔒',
                style: TextStyle(fontSize: 24),
              ),
            ],
          ),
        ),
        const SizedBox(height: 32),
        RichText(
          textAlign: TextAlign.left,
          text: const TextSpan(
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.w600,
              color: Color(0xFF1F2937),
              height: 1.3,
            ),
            children: [
              TextSpan(text: 'Akses '),
              TextSpan(
                text: 'mikrofon',
                style: TextStyle(
                  color: Color(0xFFE91E63),
                  fontWeight: FontWeight.w700,
                ),
              ),
              TextSpan(
                text:
                    ' diperlukan untuk merekam audio. '
                    'Silakan aktifkan di pengaturan!',
              ),
            ],
          ),
        ),
        const SizedBox(height: 40),
        const Center(
          child: Text(
            'FormGear Audio Recorder',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: Color(0xFF9CA3AF),
            ),
          ),
        ),
        const Spacer(flex: 3),
        _buildPermissionButton(),
        const Spacer(),
      ],
    );
  }

  Widget _buildPermissionButton() {
    return SizedBox(
      width: double.infinity,
      height: 56,
      child: Container(
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            colors: [Color(0xFFE91E63), Color(0xFFC2185B)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
          borderRadius: BorderRadius.circular(28),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFFE91E63).withValues(alpha: 0.3),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: ElevatedButton(
          onPressed: _openAppSettings,
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.transparent,
            shadowColor: Colors.transparent,
            elevation: 0,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(28),
            ),
          ),
          child: const Text(
            'Buka Pengaturan',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: Colors.white,
            ),
          ),
        ),
      ),
    );
  }
}
