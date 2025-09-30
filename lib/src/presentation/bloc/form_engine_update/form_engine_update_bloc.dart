import 'dart:async';

import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:form_gear_engine_sdk/src/models/models.dart';

part 'form_engine_update_event.dart';
part 'form_engine_update_state.dart';

class FormEngineUpdateBloc
    extends Bloc<FormEngineUpdateEvent, FormEngineUpdateState> {
  FormEngineUpdateBloc({
    required this.versionResult,
    required this.onDownload,
  }) : super(FormEngineUpdateState.initial()) {
    on<FormEngineStartDownloadEvent>(_onStartDownload);
    on<FormEngineUpdateProgressEvent>(_onUpdateProgress);
    on<FormEngineDownloadCompletedEvent>(_onDownloadCompleted);
    on<FormEngineDownloadFailedEvent>(_onDownloadFailed);
  }

  final VersionCheckResult versionResult;
  final Future<void> Function() onDownload;

  /// Public method to update progress from outside the BLoC
  /// This allows download callbacks to report progress directly
  void updateProgress(int progress) {
    add(FormEngineUpdateProgressEvent(progress));
  }

  Future<void> _onStartDownload(
    FormEngineStartDownloadEvent event,
    Emitter<FormEngineUpdateState> emit,
  ) async {
    emit(state.copyWith(isDownloading: true, progress: 0));

    try {
      // Check if this is a server download by looking for download URL
      final hasDownloadUrl =
          versionResult.formEngine.linkDownload != null &&
          versionResult.formEngine.linkDownload!.isNotEmpty;

      if (hasDownloadUrl) {
        // For server downloads, execute without blocking the BLoC
        // The download manager will report progress via updateProgress()
        // We use unawaited here to allow progress events to be processed
        // while the download is running
        unawaited(
          onDownload()
              .then((_) {
                // Download completed successfully
                add(const FormEngineDownloadCompletedEvent());
              })
              .catchError((Object error) {
                // Download failed
                add(FormEngineDownloadFailedEvent(error.toString()));
              }),
        );
      } else {
        // Only for asset downloads (demo mode), simulate progress
        // This provides better UX when copying from bundled assets
        for (var i = 1; i <= 10; i++) {
          await Future<void>.delayed(const Duration(milliseconds: 100));
          add(FormEngineUpdateProgressEvent(i * 10));
        }
        await onDownload();
        add(const FormEngineDownloadCompletedEvent());
      }
    } on Exception catch (e) {
      add(FormEngineDownloadFailedEvent(e.toString()));
    }
  }

  void _onUpdateProgress(
    FormEngineUpdateProgressEvent event,
    Emitter<FormEngineUpdateState> emit,
  ) {
    emit(state.copyWith(progress: event.progress));
  }

  void _onDownloadCompleted(
    FormEngineDownloadCompletedEvent event,
    Emitter<FormEngineUpdateState> emit,
  ) {
    emit(state.copyWith(isDownloading: false, isCompleted: true));
  }

  void _onDownloadFailed(
    FormEngineDownloadFailedEvent event,
    Emitter<FormEngineUpdateState> emit,
  ) {
    emit(state.copyWith(isDownloading: false, error: event.error));
  }
}
