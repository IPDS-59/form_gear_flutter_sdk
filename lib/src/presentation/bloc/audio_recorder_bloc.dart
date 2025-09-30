import 'dart:async';
import 'dart:io';

import 'package:flutter/widgets.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:form_gear_engine_sdk/src/core/constants/directory_constants.dart';
import 'package:just_audio/just_audio.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:record/record.dart';

/// Events for audio recorder
abstract class AudioRecorderEvent {}

class InitializeRecorder extends AudioRecorderEvent {}

class RequestPermissions extends AudioRecorderEvent {}

class PermissionsGranted extends AudioRecorderEvent {}

class PermissionsDenied extends AudioRecorderEvent {}

class StartRecording extends AudioRecorderEvent {
  StartRecording({
    required this.assignmentId,
    required this.fileName,
  });

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
  ReRecordAudio({
    required this.assignmentId,
    required this.fileName,
  });

  final String assignmentId;
  final String fileName;
}

/// States for audio recorder
abstract class AudioRecorderState {}

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
  AudioRecorderPaused({
    required this.duration,
    required this.filePath,
  });

  final Duration duration;
  final String filePath;
}

class AudioRecorderStopped extends AudioRecorderState {
  AudioRecorderStopped({
    required this.filePath,
    required this.duration,
  });

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
  AudioRecorderCompleted({
    required this.filePath,
    required this.duration,
  });

  final String filePath;
  final Duration duration;
}

class AudioRecorderError extends AudioRecorderState {
  AudioRecorderError(this.message);

  final String message;
}

/// BLoC for audio recording with permission handling
class AudioRecorderBloc extends Bloc<AudioRecorderEvent, AudioRecorderState> {
  AudioRecorderBloc() : super(AudioRecorderInitial()) {
    on<InitializeRecorder>(_onInitializeRecorder);
    on<RequestPermissions>(_onRequestPermissions);
    on<PermissionsGranted>(_onPermissionsGranted);
    on<PermissionsDenied>(_onPermissionsDenied);
    on<StartRecording>(_onStartRecording);
    on<StopRecording>(_onStopRecording);
    on<PauseRecording>(_onPauseRecording);
    on<ResumeRecording>(_onResumeRecording);
    on<CancelRecording>(_onCancelRecording);
    on<UpdateDuration>(_onUpdateDuration);
    on<AppLifecycleChanged>(_onAppLifecycleChanged);
    on<ShowConfirmationDialog>(_onShowConfirmationDialog);
    on<StartPlayback>(_onStartPlayback);
    on<StopPlayback>(_onStopPlayback);
    on<UpdatePlaybackPosition>(_onUpdatePlaybackPosition);
    on<PlaybackCompleted>(_onPlaybackCompleted);
    on<KeepRecording>(_onKeepRecording);
    on<DeleteRecording>(_onDeleteRecording);
    on<ReRecordAudio>(_onReRecordAudio);
  }

  final AudioRecorder _recorder = AudioRecorder();
  final AudioPlayer _audioPlayer = AudioPlayer();
  Timer? _durationTimer;
  StreamSubscription<Duration>? _positionSubscription;
  StreamSubscription<Duration?>? _durationSubscription;
  StreamSubscription<PlayerState>? _playerStateSubscription;
  Duration _currentDuration = Duration.zero;
  String? _currentFilePath;
  int _elapsedSeconds = 0;

  @override
  Future<void> close() {
    _durationTimer?.cancel();
    _positionSubscription?.cancel();
    _durationSubscription?.cancel();
    _playerStateSubscription?.cancel();
    _recorder.dispose();
    _audioPlayer.dispose();
    return super.close();
  }

  Future<void> _onInitializeRecorder(
    InitializeRecorder event,
    Emitter<AudioRecorderState> emit,
  ) async {
    emit(AudioRecorderCheckingPermissions());

    // Check if microphone permission is already granted
    final microphoneStatus = await Permission.microphone.status;

    if (microphoneStatus.isGranted) {
      emit(AudioRecorderReady());
    } else {
      emit(AudioRecorderNeedsPermissions());
    }
  }

  Future<void> _onRequestPermissions(
    RequestPermissions event,
    Emitter<AudioRecorderState> emit,
  ) async {
    // This will be handled by the permission consent screen
    // The screen will call PermissionsGranted or PermissionsDenied
    emit(AudioRecorderNeedsPermissions());
  }

  Future<void> _onPermissionsGranted(
    PermissionsGranted event,
    Emitter<AudioRecorderState> emit,
  ) async {
    emit(AudioRecorderReady());
  }

  Future<void> _onPermissionsDenied(
    PermissionsDenied event,
    Emitter<AudioRecorderState> emit,
  ) async {
    emit(
      AudioRecorderPermissionDenied(
        'Izin mikrofon diperlukan untuk merekam audio.',
      ),
    );
  }

  Future<void> _onStartRecording(
    StartRecording event,
    Emitter<AudioRecorderState> emit,
  ) async {
    try {
      // Build file path following FASIH pattern
      _currentFilePath = await _buildFilePath(
        event.assignmentId,
        event.fileName,
      );

      // Start recording
      await _recorder.start(
        const RecordConfig(),
        path: _currentFilePath!,
      );

      // Reset duration and start timer
      _currentDuration = Duration.zero;
      _elapsedSeconds = 0;
      _startDurationTimer();

      emit(
        AudioRecorderRecording(
          duration: _currentDuration,
          filePath: _currentFilePath!,
        ),
      );
    } on Exception catch (e) {
      emit(AudioRecorderError('Failed to start recording: $e'));
    }
  }

  Future<void> _onStopRecording(
    StopRecording event,
    Emitter<AudioRecorderState> emit,
  ) async {
    try {
      await _recorder.stop();
      _durationTimer?.cancel();

      if (_currentFilePath != null) {
        // Show confirmation dialog instead of directly stopping
        emit(
          AudioRecorderShowingConfirmation(
            filePath: _currentFilePath!,
            duration: _currentDuration,
          ),
        );
      } else {
        emit(AudioRecorderError('No recording file path'));
      }
    } on Exception catch (e) {
      emit(AudioRecorderError('Failed to stop recording: $e'));
    }
  }

  Future<void> _onPauseRecording(
    PauseRecording event,
    Emitter<AudioRecorderState> emit,
  ) async {
    try {
      await _recorder.pause();
      _durationTimer?.cancel();

      if (_currentFilePath != null) {
        emit(
          AudioRecorderPaused(
            duration: _currentDuration,
            filePath: _currentFilePath!,
          ),
        );
      }
    } on Exception catch (e) {
      emit(AudioRecorderError('Failed to pause recording: $e'));
    }
  }

  Future<void> _onResumeRecording(
    ResumeRecording event,
    Emitter<AudioRecorderState> emit,
  ) async {
    try {
      await _recorder.resume();
      // Resume timer without resetting elapsed time
      _startDurationTimer();

      if (_currentFilePath != null) {
        emit(
          AudioRecorderRecording(
            duration: _currentDuration,
            filePath: _currentFilePath!,
          ),
        );
      }
    } on Exception catch (e) {
      emit(AudioRecorderError('Failed to resume recording: $e'));
    }
  }

  Future<void> _onCancelRecording(
    CancelRecording event,
    Emitter<AudioRecorderState> emit,
  ) async {
    try {
      await _recorder.stop();
      _durationTimer?.cancel();

      // Delete the recorded file
      if (_currentFilePath != null) {
        final file = File(_currentFilePath!);
        if (file.existsSync()) {
          await file.delete();
        }
      }

      emit(AudioRecorderReady());
    } on Exception {
      emit(AudioRecorderReady()); // Still return to ready state
    }
  }

  void _onUpdateDuration(
    UpdateDuration event,
    Emitter<AudioRecorderState> emit,
  ) {
    _currentDuration = event.duration;
    if (!emit.isDone &&
        _currentFilePath != null &&
        state is AudioRecorderRecording) {
      emit(
        AudioRecorderRecording(
          duration: _currentDuration,
          filePath: _currentFilePath!,
        ),
      );
    }
  }

  void _onAppLifecycleChanged(
    AppLifecycleChanged event,
    Emitter<AudioRecorderState> emit,
  ) {
    switch (event.state) {
      case AppLifecycleState.paused:
      case AppLifecycleState.inactive:
        // Pause recording when app goes to background
        if (state is AudioRecorderRecording) {
          add(PauseRecording());
        }
      case AppLifecycleState.resumed:
        // Resume recording when app comes back to foreground
        if (state is AudioRecorderPaused) {
          add(ResumeRecording());
        }
      case AppLifecycleState.detached:
        // Stop recording if app is being terminated
        if (state is AudioRecorderRecording || state is AudioRecorderPaused) {
          add(StopRecording());
        }
      case AppLifecycleState.hidden:
        // Similar to paused
        if (state is AudioRecorderRecording) {
          add(PauseRecording());
        }
    }
  }

  Future<void> _onShowConfirmationDialog(
    ShowConfirmationDialog event,
    Emitter<AudioRecorderState> emit,
  ) async {
    if (_currentFilePath != null) {
      emit(
        AudioRecorderShowingConfirmation(
          filePath: _currentFilePath!,
          duration: _currentDuration,
        ),
      );
    }
  }

  Future<void> _onStartPlayback(
    StartPlayback event,
    Emitter<AudioRecorderState> emit,
  ) async {
    try {
      if (state is AudioRecorderShowingConfirmation) {
        final currentState = state as AudioRecorderShowingConfirmation;

        // Cancel any existing subscriptions first
        await _positionSubscription?.cancel();
        await _durationSubscription?.cancel();
        await _playerStateSubscription?.cancel();

        // Set up audio source
        await _audioPlayer.setFilePath(currentState.filePath);

        // Set up position stream with emit.isDone check and throttling
        _positionSubscription = _audioPlayer.positionStream
            .where((position) => !isClosed && !emit.isDone)
            .listen((position) {
              add(UpdatePlaybackPosition(position));
            });

        // Set up duration stream with emit.isDone check
        _durationSubscription = _audioPlayer.durationStream.listen((duration) {
          if (duration != null &&
              !isClosed &&
              !emit.isDone &&
              state is AudioRecorderShowingConfirmation) {
            final currentState = state as AudioRecorderShowingConfirmation;
            if (!emit.isDone) {
              emit(
                AudioRecorderShowingConfirmation(
                  filePath: currentState.filePath,
                  duration: currentState.duration,
                  isPlaying: currentState.isPlaying,
                  playbackPosition: currentState.playbackPosition,
                  totalDuration: duration,
                ),
              );
            }
          }
        });

        // Set up player state stream to detect completion with emit check
        _playerStateSubscription = _audioPlayer.playerStateStream.listen((
          playerState,
        ) {
          if (playerState.processingState == ProcessingState.completed) {
            if (!isClosed && !emit.isDone) {
              add(PlaybackCompleted());
            }
          }
        });

        // Update UI state to playing immediately before starting playback
        emit(
          AudioRecorderShowingConfirmation(
            filePath: currentState.filePath,
            duration: currentState.duration,
            isPlaying: true,
            playbackPosition: currentState.playbackPosition,
            totalDuration: currentState.totalDuration,
          ),
        );

        // Start playback after UI state is updated
        await _audioPlayer.play();
      }
    } on Exception catch (e) {
      if (!emit.isDone) {
        emit(AudioRecorderError('Failed to start playback: $e'));
      }
    }
  }

  Future<void> _onStopPlayback(
    StopPlayback event,
    Emitter<AudioRecorderState> emit,
  ) async {
    try {
      // Stop audio player and reset position first
      await _audioPlayer.stop();
      await _audioPlayer.seek(Duration.zero);

      // Cancel subscriptions
      await _positionSubscription?.cancel();
      await _durationSubscription?.cancel();
      await _playerStateSubscription?.cancel();

      // Update UI state after all cleanup is done
      if (!emit.isDone && state is AudioRecorderShowingConfirmation) {
        final currentState = state as AudioRecorderShowingConfirmation;
        emit(
          AudioRecorderShowingConfirmation(
            filePath: currentState.filePath,
            duration: currentState.duration,
            totalDuration: currentState.totalDuration,
          ),
        );
      }
    } on Exception catch (e) {
      if (!emit.isDone) {
        emit(AudioRecorderError('Failed to stop playback: $e'));
      }
    }
  }

  Future<void> _onKeepRecording(
    KeepRecording event,
    Emitter<AudioRecorderState> emit,
  ) async {
    if (state is AudioRecorderShowingConfirmation) {
      final currentState = state as AudioRecorderShowingConfirmation;
      emit(
        AudioRecorderCompleted(
          filePath: currentState.filePath,
          duration: currentState.duration,
        ),
      );
    }
  }

  Future<void> _onUpdatePlaybackPosition(
    UpdatePlaybackPosition event,
    Emitter<AudioRecorderState> emit,
  ) async {
    if (!emit.isDone && state is AudioRecorderShowingConfirmation) {
      final currentState = state as AudioRecorderShowingConfirmation;
      emit(
        AudioRecorderShowingConfirmation(
          filePath: currentState.filePath,
          duration: currentState.duration,
          isPlaying: currentState.isPlaying,
          playbackPosition: event.position,
          totalDuration: currentState.totalDuration,
        ),
      );
    }
  }

  Future<void> _onPlaybackCompleted(
    PlaybackCompleted event,
    Emitter<AudioRecorderState> emit,
  ) async {
    // Stop the player and cancel subscriptions
    await _audioPlayer.stop();
    await _positionSubscription?.cancel();
    await _durationSubscription?.cancel();
    await _playerStateSubscription?.cancel();

    if (!emit.isDone && state is AudioRecorderShowingConfirmation) {
      final currentState = state as AudioRecorderShowingConfirmation;
      emit(
        AudioRecorderShowingConfirmation(
          filePath: currentState.filePath,
          duration: currentState.duration,
          totalDuration: currentState.totalDuration,
        ),
      );
    }
  }

  Future<void> _onDeleteRecording(
    DeleteRecording event,
    Emitter<AudioRecorderState> emit,
  ) async {
    try {
      // Stop any ongoing playback
      await _audioPlayer.stop();
      await _positionSubscription?.cancel();
      await _durationSubscription?.cancel();
      await _playerStateSubscription?.cancel();

      if (state is AudioRecorderShowingConfirmation) {
        final currentState = state as AudioRecorderShowingConfirmation;

        // Delete the recording file
        final file = File(currentState.filePath);
        if (file.existsSync()) {
          file.deleteSync();
        }

        // Reset to ready state
        _currentFilePath = null;
        _currentDuration = Duration.zero;
        _elapsedSeconds = 0;

        emit(AudioRecorderReady());
      }
    } on Exception catch (e) {
      emit(AudioRecorderError('Failed to delete recording: $e'));
    }
  }

  Future<void> _onReRecordAudio(
    ReRecordAudio event,
    Emitter<AudioRecorderState> emit,
  ) async {
    try {
      // Stop any ongoing playback
      await _audioPlayer.stop();
      await _positionSubscription?.cancel();
      await _durationSubscription?.cancel();
      await _playerStateSubscription?.cancel();

      if (state is AudioRecorderShowingConfirmation) {
        final currentState = state as AudioRecorderShowingConfirmation;

        // Delete the current recording
        final file = File(currentState.filePath);
        if (file.existsSync()) {
          file.deleteSync();
        }

        // Reset state and start new recording
        _currentDuration = Duration.zero;
        _elapsedSeconds = 0;

        // Start new recording
        add(
          StartRecording(
            assignmentId: event.assignmentId,
            fileName: event.fileName,
          ),
        );
      }
    } on Exception catch (e) {
      emit(AudioRecorderError('Failed to start re-recording: $e'));
    }
  }

  void _startDurationTimer() {
    _durationTimer?.cancel();
    _durationTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (!isClosed) {
        _elapsedSeconds++;
        add(UpdateDuration(Duration(seconds: _elapsedSeconds)));
      } else {
        timer.cancel();
      }
    });
  }

  Future<String> _buildFilePath(String assignmentId, String fileName) async {
    // Use DirectoryConstants to get FASIH-compliant media directory
    final mediaDir = await DirectoryConstants.getMediaDirectory(assignmentId);
    return '${mediaDir.path}/$fileName';
  }
}
