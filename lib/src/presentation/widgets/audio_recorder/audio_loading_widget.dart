import 'package:flutter/material.dart';

/// Loading view for audio recording permission check
class AudioLoadingWidget extends StatelessWidget {
  const AudioLoadingWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return const Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Spacer(flex: 2),
        Center(
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                'Sedang memeriksa,',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w400,
                  color: Color(0xFF6B7280),
                ),
              ),
              SizedBox(width: 12),
              Text(
                '⏳',
                style: TextStyle(fontSize: 24),
              ),
            ],
          ),
        ),
        SizedBox(height: 32),
        Center(
          child: CircularProgressIndicator(
            color: Color(0xFF1E88E5),
          ),
        ),
        SizedBox(height: 24),
        Text(
          'Memeriksa izin aplikasi...',
          style: TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.w600,
            color: Color(0xFF1F2937),
            height: 1.3,
          ),
          textAlign: TextAlign.left,
        ),
        Spacer(flex: 3),
      ],
    );
  }
}
