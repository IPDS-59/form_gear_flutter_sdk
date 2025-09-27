part of 'template_update_bloc.dart';

abstract class TemplateUpdateEvent extends Equatable {
  const TemplateUpdateEvent();

  @override
  List<Object?> get props => [];
}

class TemplateStartDownloadEvent extends TemplateUpdateEvent {
  const TemplateStartDownloadEvent();
}

class TemplateUpdateProgressEvent extends TemplateUpdateEvent {
  const TemplateUpdateProgressEvent(this.progress);
  final int progress;

  @override
  List<Object?> get props => [progress];
}

class TemplateDownloadCompletedEvent extends TemplateUpdateEvent {
  const TemplateDownloadCompletedEvent();
}

class TemplateDownloadFailedEvent extends TemplateUpdateEvent {
  const TemplateDownloadFailedEvent(this.error);
  final String error;

  @override
  List<Object?> get props => [error];
}
