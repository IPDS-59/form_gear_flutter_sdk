import 'dart:async';
import 'dart:io';

import 'package:flutter/widgets.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:form_gear_engine_sdk/src/core/constants/directory_constants.dart';
import 'package:form_gear_engine_sdk/src/presentation/bloc/audio_recorder/audio_recorder_event.dart';
import 'package:form_gear_engine_sdk/src/presentation/bloc/audio_recorder/audio_recorder_state.dart';
import 'package:just_audio/just_audio.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:record/record.dart';

export 'audio_recorder_event.dart';
export 'audio_recorder_state.dart';

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
      _currentFilePath = await _buildFilePath(
        event.assignmentId,
        event.fileName,
      );

      await _recorder.start(const RecordConfig(), path: _currentFilePath!);

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

      if (_currentFilePath != null) {
        final file = File(_currentFilePath!);
        if (file.existsSync()) {
          await file.delete();
        }
      }

      emit(AudioRecorderReady());
    } on Exception {
      emit(AudioRecorderReady());
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
        if (state is AudioRecorderRecording) {
          add(PauseRecording());
        }
      case AppLifecycleState.resumed:
        if (state is AudioRecorderPaused) {
          add(ResumeRecording());
        }
      case AppLifecycleState.detached:
        if (state is AudioRecorderRecording || state is AudioRecorderPaused) {
          add(StopRecording());
        }
      case AppLifecycleState.hidden:
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

        await _positionSubscription?.cancel();
        await _durationSubscription?.cancel();
        await _playerStateSubscription?.cancel();

        await _audioPlayer.setFilePath(currentState.filePath);

        _positionSubscription = _audioPlayer.positionStream
            .where((position) => !isClosed && !emit.isDone)
            .listen((position) {
              add(UpdatePlaybackPosition(position));
            });

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

        _playerStateSubscription = _audioPlayer.playerStateStream.listen((
          playerState,
        ) {
          if (playerState.processingState == ProcessingState.completed) {
            if (!isClosed && !emit.isDone) {
              add(PlaybackCompleted());
            }
          }
        });

        emit(
          AudioRecorderShowingConfirmation(
            filePath: currentState.filePath,
            duration: currentState.duration,
            isPlaying: true,
            playbackPosition: currentState.playbackPosition,
            totalDuration: currentState.totalDuration,
          ),
        );

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
      await _audioPlayer.stop();
      await _audioPlayer.seek(Duration.zero);

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
      await _audioPlayer.stop();
      await _positionSubscription?.cancel();
      await _durationSubscription?.cancel();
      await _playerStateSubscription?.cancel();

      if (state is AudioRecorderShowingConfirmation) {
        final currentState = state as AudioRecorderShowingConfirmation;

        final file = File(currentState.filePath);
        if (file.existsSync()) {
          file.deleteSync();
        }

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
      await _audioPlayer.stop();
      await _positionSubscription?.cancel();
      await _durationSubscription?.cancel();
      await _playerStateSubscription?.cancel();

      if (state is AudioRecorderShowingConfirmation) {
        final currentState = state as AudioRecorderShowingConfirmation;

        final file = File(currentState.filePath);
        if (file.existsSync()) {
          file.deleteSync();
        }

        _currentDuration = Duration.zero;
        _elapsedSeconds = 0;

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
    final mediaDir = await DirectoryConstants.getMediaDirectory(assignmentId);
    return '${mediaDir.path}/$fileName';
  }
}
