import 'package:flutter/widgets.dart';

/// Events for audio recorder
sealed class AudioRecorderEvent {}

class InitializeRecorder extends AudioRecorderEvent {}

class RequestPermissions extends AudioRecorderEvent {}

class PermissionsGranted extends AudioRecorderEvent {}

class PermissionsDenied extends AudioRecorderEvent {}

class StartRecording extends AudioRecorderEvent {
  StartRecording({required this.assignmentId, required this.fileName});

  final String assignmentId;
  final String fileName;
}

class StopRecording extends AudioRecorderEvent {}

class PauseRecording extends AudioRecorderEvent {}

class ResumeRecording extends AudioRecorderEvent {}

class CancelRecording extends AudioRecorderEvent {}

class UpdateDuration extends AudioRecorderEvent {
  UpdateDuration(this.duration);

  final Duration duration;
}

class UpdatePlaybackPosition extends AudioRecorderEvent {
  UpdatePlaybackPosition(this.position);

  final Duration position;
}

class PlaybackCompleted extends AudioRecorderEvent {}

class AppLifecycleChanged extends AudioRecorderEvent {
  AppLifecycleChanged(this.state);

  final AppLifecycleState state;
}

class ShowConfirmationDialog extends AudioRecorderEvent {}

class StartPlayback extends AudioRecorderEvent {}

class StopPlayback extends AudioRecorderEvent {}

class KeepRecording extends AudioRecorderEvent {}

class DeleteRecording extends AudioRecorderEvent {}

class ReRecordAudio extends AudioRecorderEvent {
  ReRecordAudio({required this.assignmentId, required this.fileName});

  final String assignmentId;
  final String fileName;
}
