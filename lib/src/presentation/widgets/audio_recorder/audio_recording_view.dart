import 'package:flutter/material.dart';
import 'package:form_gear_engine_sdk/src/presentation/bloc/audio_recorder_bloc.dart';
import 'package:form_gear_engine_sdk/src/presentation/widgets/audio_recorder/audio_context_info_widget.dart';
import 'package:form_gear_engine_sdk/src/presentation/widgets/audio_recorder/audio_control_buttons_widget.dart';
import 'package:form_gear_engine_sdk/src/presentation/widgets/audio_recorder/audio_duration_display_widget.dart';
import 'package:form_gear_engine_sdk/src/presentation/widgets/audio_recorder/audio_waveform_widget.dart';

/// Main recording view widget containing all recording UI components
class AudioRecordingView extends StatelessWidget {
  const AudioRecordingView({
    required this.state,
    required this.assignmentId,
    required this.fileName,
    required this.showTemplate,
    required this.pulseAnimation,
    required this.waveAnimation,
    required this.contextSwitchAnimation,
    this.dataKey,
    this.templateName,
    super.key,
  });

  final AudioRecorderState state;
  final String? dataKey;
  final String? templateName;
  final String assignmentId;
  final String fileName;
  final bool showTemplate;
  final Animation<double> pulseAnimation;
  final Animation<double> waveAnimation;
  final Animation<double> contextSwitchAnimation;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: 20),
        _AudioGreetingSection(state: state),
        const SizedBox(height: 24),
        _AudioMainMessage(state: state),
        const SizedBox(height: 20),
        if (dataKey != null || templateName != null) ...[
          AudioContextInfoWidget(
            dataKey: dataKey,
            templateName: templateName,
            showTemplate: showTemplate,
            contextSwitchAnimation: contextSwitchAnimation,
          ),
          const SizedBox(height: 20),
        ],
        _AudioWaveformSection(state: state, waveAnimation: waveAnimation),
        Center(
          child: AudioDurationDisplayWidget(
            state: state,
            pulseAnimation: pulseAnimation,
          ),
        ),
        const SizedBox(height: 24),
        const Center(
          child: Text(
            'FormGear Audio Recorder',
            style: TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.w400,
              color: Color(0xFF9CA3AF),
            ),
          ),
        ),
        const SizedBox(height: 16),
        AudioControlButtonsWidget(
          state: state,
          assignmentId: assignmentId,
          fileName: fileName,
        ),
        const SizedBox(height: 20),
      ],
    );
  }
}

class _AudioGreetingSection extends StatelessWidget {
  const _AudioGreetingSection({required this.state});

  final AudioRecorderState state;

  String _getRecordingEmoji() {
    if (state is AudioRecorderRecording) return '🎙️';
    if (state is AudioRecorderPaused) return '⏸️';
    if (state is AudioRecorderStopped) return '✅';
    return '🎵';
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Text(
            'Hello,',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w400,
              color: Color(0xFF6B7280),
            ),
          ),
          const SizedBox(width: 12),
          Text(
            _getRecordingEmoji(),
            style: const TextStyle(fontSize: 22),
          ),
        ],
      ),
    );
  }
}

class _AudioMainMessage extends StatelessWidget {
  const _AudioMainMessage({required this.state});

  final AudioRecorderState state;

  List<TextSpan> _getMainMessageSpans() {
    if (state is AudioRecorderRecording) {
      return [
        const TextSpan(text: 'Sedang '),
        const TextSpan(
          text: 'merekam',
          style: TextStyle(
            color: Color(0xFFE91E63),
            fontWeight: FontWeight.w700,
          ),
        ),
        const TextSpan(text: ' audio Anda. Tap tombol pause atau stop!'),
      ];
    } else if (state is AudioRecorderPaused) {
      return [
        const TextSpan(text: 'Rekaman '),
        const TextSpan(
          text: 'dijeda',
          style: TextStyle(
            color: Color(0xFFF59E0B),
            fontWeight: FontWeight.w700,
          ),
        ),
        const TextSpan(text: '. Tap resume untuk melanjutkan atau stop!'),
      ];
    } else if (state is AudioRecorderStopped) {
      return [
        const TextSpan(text: 'Rekaman '),
        const TextSpan(
          text: 'selesai',
          style: TextStyle(
            color: Color(0xFF10B981),
            fontWeight: FontWeight.w700,
          ),
        ),
        const TextSpan(text: '! Tap simpan untuk menyimpan file audio.'),
      ];
    } else {
      return [
        const TextSpan(text: 'Siap untuk '),
        const TextSpan(
          text: 'merekam',
          style: TextStyle(
            color: Color(0xFF1E88E5),
            fontWeight: FontWeight.w700,
          ),
        ),
        const TextSpan(text: ' audio? Tap tombol record untuk memulai!'),
      ];
    }
  }

  @override
  Widget build(BuildContext context) {
    return RichText(
      textAlign: TextAlign.left,
      text: TextSpan(
        style: const TextStyle(
          fontSize: 22,
          fontWeight: FontWeight.w600,
          color: Color(0xFF1F2937),
          height: 1.4,
        ),
        children: _getMainMessageSpans(),
      ),
    );
  }
}

class _AudioWaveformSection extends StatelessWidget {
  const _AudioWaveformSection({
    required this.state,
    required this.waveAnimation,
  });

  final AudioRecorderState state;
  final Animation<double> waveAnimation;

  @override
  Widget build(BuildContext context) {
    return AnimatedSize(
      duration: const Duration(milliseconds: 400),
      curve: Curves.easeInOut,
      child: AnimatedSwitcher(
        duration: const Duration(milliseconds: 400),
        switchInCurve: Curves.easeInOut,
        switchOutCurve: Curves.easeInOut,
        transitionBuilder: (Widget child, Animation<double> animation) {
          return FadeTransition(
            opacity: animation,
            child: SlideTransition(
              position:
                  Tween<Offset>(
                    begin: const Offset(0, -0.2),
                    end: Offset.zero,
                  ).animate(
                    CurvedAnimation(
                      parent: animation,
                      curve: Curves.easeOutCubic,
                    ),
                  ),
              child: child,
            ),
          );
        },
        child: (state is AudioRecorderRecording || state is AudioRecorderPaused)
            ? Column(
                key: const ValueKey('waveform'),
                children: [
                  Center(
                    child: AudioWaveformWidget(
                      state: state,
                      waveAnimation: waveAnimation,
                    ),
                  ),
                  const SizedBox(height: 20),
                ],
              )
            : const SizedBox.shrink(key: ValueKey('no-waveform')),
      ),
    );
  }
}
