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

  Future<void> _onStartDownload(
    FormEngineStartDownloadEvent event,
    Emitter<FormEngineUpdateState> emit,
  ) async {
    emit(state.copyWith(isDownloading: true, progress: 0));

    try {
      await onDownload();
      add(const FormEngineDownloadCompletedEvent());
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
