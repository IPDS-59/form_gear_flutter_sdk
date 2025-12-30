/// States for audio recorder
sealed class AudioRecorderState {}

class AudioRecorderInitial extends AudioRecorderState {}

class AudioRecorderCheckingPermissions extends AudioRecorderState {}

class AudioRecorderNeedsPermissions extends AudioRecorderState {}

class AudioRecorderPermissionDenied extends AudioRecorderState {
  AudioRecorderPermissionDenied(this.message);

  final String message;
}

class AudioRecorderReady extends AudioRecorderState {}

class AudioRecorderRecording extends AudioRecorderState {
  AudioRecorderRecording({
    required this.duration,
    required this.filePath,
    this.isPaused = false,
  });

  final Duration duration;
  final String filePath;
  final bool isPaused;
}

class AudioRecorderPaused extends AudioRecorderState {
  AudioRecorderPaused({required this.duration, required this.filePath});

  final Duration duration;
  final String filePath;
}

class AudioRecorderStopped extends AudioRecorderState {
  AudioRecorderStopped({required this.filePath, required this.duration});

  final String filePath;
  final Duration duration;
}

class AudioRecorderShowingConfirmation extends AudioRecorderState {
  AudioRecorderShowingConfirmation({
    required this.filePath,
    required this.duration,
    this.isPlaying = false,
    this.playbackPosition = Duration.zero,
    this.totalDuration,
  });

  final String filePath;
  final Duration duration;
  final bool isPlaying;
  final Duration playbackPosition;
  final Duration? totalDuration;
}

class AudioRecorderPlayback extends AudioRecorderState {
  AudioRecorderPlayback({
    required this.filePath,
    required this.duration,
    required this.playbackPosition,
    required this.totalDuration,
    this.isPlaying = false,
  });

  final String filePath;
  final Duration duration;
  final Duration playbackPosition;
  final Duration totalDuration;
  final bool isPlaying;
}

class AudioRecorderCompleted extends AudioRecorderState {
  AudioRecorderCompleted({required this.filePath, required this.duration});

  final String filePath;
  final Duration duration;
}

class AudioRecorderError extends AudioRecorderState {
  AudioRecorderError(this.message);

  final String message;
}
