part of 'form_engine_update_bloc.dart';

abstract class FormEngineUpdateEvent extends Equatable {
  const FormEngineUpdateEvent();

  @override
  List<Object?> get props => [];
}

class FormEngineStartDownloadEvent extends FormEngineUpdateEvent {
  const FormEngineStartDownloadEvent();
}

class FormEngineUpdateProgressEvent extends FormEngineUpdateEvent {
  const FormEngineUpdateProgressEvent(this.progress);
  final int progress;

  @override
  List<Object?> get props => [progress];
}

class FormEngineDownloadCompletedEvent extends FormEngineUpdateEvent {
  const FormEngineDownloadCompletedEvent();
}

class FormEngineDownloadFailedEvent extends FormEngineUpdateEvent {
  const FormEngineDownloadFailedEvent(this.error);
  final String error;

  @override
  List<Object?> get props => [error];
}
