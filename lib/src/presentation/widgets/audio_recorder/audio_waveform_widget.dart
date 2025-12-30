import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:form_gear_engine_sdk/src/presentation/bloc/audio_recorder_bloc.dart';

/// Waveform visualization widget for audio recording
class AudioWaveformWidget extends StatelessWidget {
  const AudioWaveformWidget({
    required this.state,
    required this.waveAnimation,
    super.key,
  });

  final AudioRecorderState state;
  final Animation<double> waveAnimation;

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: waveAnimation,
      builder: (context, child) {
        return Container(
          height: 80,
          width: 280,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          decoration: BoxDecoration(
            color: Colors.grey.withValues(alpha: 0.05),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: Colors.grey.withValues(alpha: 0.1),
            ),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            crossAxisAlignment: CrossAxisAlignment.end,
            children: List.generate(20, (index) {
              const baseHeight = 8.0;
              final random = math.Random();
              final animatedHeight = state is AudioRecorderRecording
                  ? baseHeight +
                        (math.sin(
                              waveAnimation.value * 2 * math.pi + index * 0.3,
                            ) *
                            15) +
                        (random.nextDouble() * 10)
                  : baseHeight + (math.sin(index * 0.3) * 8);

              final color = state is AudioRecorderRecording
                  ? const Color(0xFF1E88E5)
                  : const Color(0xFF6B7280);

              return AnimatedContainer(
                duration: Duration(
                  milliseconds: state is AudioRecorderRecording ? 100 : 300,
                ),
                width: 3,
                height: animatedHeight.clamp(4.0, 30.0),
                decoration: BoxDecoration(
                  color: color.withValues(
                    alpha: state is AudioRecorderRecording
                        ? 0.7 +
                              (math.sin(
                                    waveAnimation.value * 4 * math.pi + index,
                                  ) *
                                  0.3)
                        : 0.5,
                  ),
                  borderRadius: BorderRadius.circular(2),
                ),
              );
            }),
          ),
        );
      },
    );
  }
}
