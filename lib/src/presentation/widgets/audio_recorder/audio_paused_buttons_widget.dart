import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:form_gear_engine_sdk/src/presentation/bloc/audio_recorder_bloc.dart';

/// Buttons shown when recording is paused - resume and stop
class AudioPausedButtonsWidget extends StatelessWidget {
  const AudioPausedButtonsWidget({super.key});

  @override
  Widget build(BuildContext context) => ClipRect(
    child: AnimatedSwitcher(
      duration: const Duration(milliseconds: 400),
      transitionBuilder: (Widget child, Animation<double> animation) =>
          FadeTransition(
            opacity: animation,
            child: ScaleTransition(
              scale: Tween<double>(begin: 0.8, end: 1).animate(
                CurvedAnimation(
                  parent: animation,
                  curve: Curves.easeOutBack,
                ),
              ),
              child: child,
            ),
          ),
      child: const Row(
        key: ValueKey('paused'),
        children: [
          Expanded(child: _ResumeButton()),
          SizedBox(width: 16),
          Expanded(child: _StopButton()),
        ],
      ),
    ),
  );
}

class _ResumeButton extends StatelessWidget {
  const _ResumeButton();

  @override
  Widget build(BuildContext context) => SizedBox(
    height: 56,
    child: Container(
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF10B981), Color(0xFF059669)],
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
        ),
        borderRadius: BorderRadius.circular(28),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF10B981).withValues(alpha: 0.3),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: ElevatedButton.icon(
        onPressed: () =>
            context.read<AudioRecorderBloc>().add(ResumeRecording()),
        icon: const Icon(Icons.play_arrow, color: Colors.white),
        label: const Text(
          'Lanjut',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: Colors.white,
          ),
        ),
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.transparent,
          shadowColor: Colors.transparent,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(28),
          ),
        ),
      ),
    ),
  );
}

class _StopButton extends StatelessWidget {
  const _StopButton();

  @override
  Widget build(BuildContext context) => SizedBox(
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
      child: ElevatedButton.icon(
        onPressed: () => context.read<AudioRecorderBloc>().add(StopRecording()),
        icon: const Icon(Icons.stop, color: Colors.white),
        label: const Text(
          'Stop',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: Colors.white,
          ),
        ),
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.transparent,
          shadowColor: Colors.transparent,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(28),
          ),
        ),
      ),
    ),
  );
}
