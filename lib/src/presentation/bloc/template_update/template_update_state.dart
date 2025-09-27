part of 'template_update_bloc.dart';

class TemplateUpdateState extends Equatable {
  const TemplateUpdateState({
    required this.isDownloading,
    required this.progress,
    required this.isCompleted,
    this.error,
  });

  factory TemplateUpdateState.initial() {
    return const TemplateUpdateState(
      isDownloading: false,
      progress: 0,
      isCompleted: false,
    );
  }

  final bool isDownloading;
  final int progress;
  final bool isCompleted;
  final String? error;

  TemplateUpdateState copyWith({
    bool? isDownloading,
    int? progress,
    bool? isCompleted,
    String? error,
  }) {
    return TemplateUpdateState(
      isDownloading: isDownloading ?? this.isDownloading,
      progress: progress ?? this.progress,
      isCompleted: isCompleted ?? this.isCompleted,
      error: error ?? this.error,
    );
  }

  @override
  List<Object?> get props => [isDownloading, progress, isCompleted, error];
}
