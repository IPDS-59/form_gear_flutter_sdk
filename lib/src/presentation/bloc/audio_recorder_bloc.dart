import 'dart:async';
import 'dart:io';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:form_gear_engine_sdk/src/core/constants/directory_constants.dart';
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
  }

  final AudioRecorder _recorder = AudioRecorder();
  Timer? _durationTimer;
  Duration _currentDuration = Duration.zero;
  String? _currentFilePath;
  int _elapsedSeconds = 0;

  @override
  Future<void> close() {
    _durationTimer?.cancel();
    _recorder.dispose();
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
        emit(
          AudioRecorderStopped(
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
    if (_currentFilePath != null && state is AudioRecorderRecording) {
      emit(
        AudioRecorderRecording(
          duration: _currentDuration,
          filePath: _currentFilePath!,
        ),
      );
    }
  }

  void _startDurationTimer() {
    _durationTimer?.cancel();
    _durationTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      _elapsedSeconds++;
      add(UpdateDuration(Duration(seconds: _elapsedSeconds)));
    });
  }

  Future<String> _buildFilePath(String assignmentId, String fileName) async {
    // Use DirectoryConstants to get FASIH-compliant media directory
    final mediaDir = await DirectoryConstants.getMediaDirectory(assignmentId);
    return '${mediaDir.path}/$fileName';
  }
}
