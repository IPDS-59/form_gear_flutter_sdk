import 'package:flutter/material.dart';
import 'package:form_gear_engine_sdk/src/presentation/bloc/audio_recorder_bloc.dart';

/// Duration display widget for audio recording with pulse animation
class AudioDurationDisplayWidget extends StatelessWidget {
  const AudioDurationDisplayWidget({
    required this.state,
    required this.pulseAnimation,
    super.key,
  });

  final AudioRecorderState state;
  final Animation<double> pulseAnimation;

  String _formatDuration(Duration duration) {
    final minutes = duration.inMinutes;
    final seconds = duration.inSeconds % 60;
    return '${minutes.toString().padLeft(2, '0')}:'
        '${seconds.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    var duration = Duration.zero;
    var targetColor = const Color(0xFF1E88E5);
    var shouldPulse = false;

    if (state is AudioRecorderRecording) {
      duration = (state as AudioRecorderRecording).duration;
      targetColor = const Color(0xFF1E88E5);
      shouldPulse = true;
    } else if (state is AudioRecorderPaused) {
      duration = (state as AudioRecorderPaused).duration;
      targetColor = const Color(0xFF6B7280);
      shouldPulse = false;
    } else if (state is AudioRecorderStopped) {
      duration = (state as AudioRecorderStopped).duration;
      targetColor = const Color(0xFF10B981);
      shouldPulse = false;
    }

    return AnimatedBuilder(
      animation: pulseAnimation,
      builder: (context, child) {
        return Transform.scale(
          scale: shouldPulse ? pulseAnimation.value : 1.0,
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 300),
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
            decoration: BoxDecoration(
              color: targetColor.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: targetColor, width: 2),
              boxShadow: shouldPulse
                  ? [
                      BoxShadow(
                        color: targetColor.withValues(alpha: 0.3),
                        blurRadius: 8,
                        spreadRadius: 2,
                      ),
                    ]
                  : null,
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                AnimatedSwitcher(
                  duration: const Duration(milliseconds: 300),
                  child: Icon(
                    shouldPulse ? Icons.fiber_manual_record : Icons.access_time,
                    key: ValueKey(shouldPulse),
                    size: 20,
                    color: targetColor,
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  _formatDuration(duration),
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    fontFamily: 'monospace',
                    color: targetColor,
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
