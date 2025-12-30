import 'package:flutter/material.dart';
import 'package:form_gear_engine_sdk/src/presentation/bloc/audio_recorder_bloc.dart';
import 'package:form_gear_engine_sdk/src/presentation/widgets/audio_recorder/audio_paused_buttons_widget.dart';
import 'package:form_gear_engine_sdk/src/presentation/widgets/audio_recorder/audio_ready_button_widget.dart';
import 'package:form_gear_engine_sdk/src/presentation/widgets/audio_recorder/audio_recording_buttons_widget.dart';
import 'package:form_gear_engine_sdk/src/presentation/widgets/audio_recorder/audio_stopped_buttons_widget.dart';

/// Control buttons widget for audio recording
class AudioControlButtonsWidget extends StatelessWidget {
  const AudioControlButtonsWidget({
    required this.state,
    required this.assignmentId,
    required this.fileName,
    super.key,
  });

  final AudioRecorderState state;
  final String assignmentId;
  final String fileName;

  @override
  Widget build(BuildContext context) {
    if (state is AudioRecorderStopped) {
      return AudioStoppedButtonsWidget(
        filePath: (state as AudioRecorderStopped).filePath,
      );
    } else if (state is AudioRecorderRecording) {
      return const AudioRecordingButtonsWidget();
    } else if (state is AudioRecorderPaused) {
      return const AudioPausedButtonsWidget();
    } else {
      return AudioReadyButtonWidget(
        assignmentId: assignmentId,
        fileName: fileName,
      );
    }
  }
}
