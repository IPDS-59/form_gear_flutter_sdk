import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:form_gear_engine_sdk/src/presentation/bloc/audio_recorder_bloc.dart';

/// Buttons shown when recording is stopped - save or discard
class AudioStoppedButtonsWidget extends StatelessWidget {
  const AudioStoppedButtonsWidget({
    required this.filePath,
    super.key,
  });

  final String filePath;

  @override
  Widget build(BuildContext context) => ClipRect(
    child: AnimatedSwitcher(
      duration: const Duration(milliseconds: 400),
      transitionBuilder: (Widget child, Animation<double> animation) =>
          FadeTransition(
            opacity: animation,
            child: SlideTransition(
              position:
                  Tween<Offset>(
                    begin: const Offset(0, 0.2),
                    end: Offset.zero,
                  ).animate(
                    CurvedAnimation(
                      parent: animation,
                      curve: Curves.easeOutCubic,
                    ),
                  ),
              child: child,
            ),
          ),
      child: Column(
        key: const ValueKey('stopped'),
        children: [
          _SaveButton(filePath: filePath),
          const SizedBox(height: 16),
          const _DiscardButton(),
        ],
      ),
    ),
  );
}

class _SaveButton extends StatelessWidget {
  const _SaveButton({required this.filePath});

  final String filePath;

  @override
  Widget build(BuildContext context) => SizedBox(
    width: double.infinity,
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
        onPressed: () => Navigator.of(context).pop(filePath),
        icon: const Icon(Icons.check_circle, color: Colors.white),
        label: const Text(
          'Simpan Audio',
          style: TextStyle(
            fontSize: 18,
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

class _DiscardButton extends StatelessWidget {
  const _DiscardButton();

  @override
  Widget build(BuildContext context) => TextButton(
    onPressed: () {
      context.read<AudioRecorderBloc>().add(CancelRecording());
      Navigator.of(context).pop();
    },
    child: const Text(
      'Buang Rekaman',
      style: TextStyle(
        fontSize: 16,
        color: Color(0xFF6B7280),
        fontWeight: FontWeight.w500,
      ),
    ),
  );
}
