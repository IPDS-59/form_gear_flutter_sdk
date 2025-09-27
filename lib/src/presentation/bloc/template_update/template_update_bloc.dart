import 'dart:async';

import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:form_gear_engine_sdk/src/models/models.dart';

part 'template_update_event.dart';
part 'template_update_state.dart';

class TemplateUpdateBloc
    extends Bloc<TemplateUpdateEvent, TemplateUpdateState> {
  TemplateUpdateBloc({
    required this.versionResult,
    required this.templateName,
    required this.onDownload,
  }) : super(TemplateUpdateState.initial()) {
    on<TemplateStartDownloadEvent>(_onStartDownload);
    on<TemplateUpdateProgressEvent>(_onUpdateProgress);
    on<TemplateDownloadCompletedEvent>(_onDownloadCompleted);
    on<TemplateDownloadFailedEvent>(_onDownloadFailed);
  }

  final VersionCheckResult versionResult;
  final String templateName;
  final Future<void> Function() onDownload;

  Future<void> _onStartDownload(
    TemplateStartDownloadEvent event,
    Emitter<TemplateUpdateState> emit,
  ) async {
    emit(state.copyWith(isDownloading: true, progress: 0));

    try {
      await onDownload();
      add(const TemplateDownloadCompletedEvent());
    } on Exception catch (e) {
      add(TemplateDownloadFailedEvent(e.toString()));
    }
  }

  void _onUpdateProgress(
    TemplateUpdateProgressEvent event,
    Emitter<TemplateUpdateState> emit,
  ) {
    emit(state.copyWith(progress: event.progress));
  }

  void _onDownloadCompleted(
    TemplateDownloadCompletedEvent event,
    Emitter<TemplateUpdateState> emit,
  ) {
    emit(state.copyWith(isDownloading: false, isCompleted: true));
  }

  void _onDownloadFailed(
    TemplateDownloadFailedEvent event,
    Emitter<TemplateUpdateState> emit,
  ) {
    emit(state.copyWith(isDownloading: false, error: event.error));
  }
}
