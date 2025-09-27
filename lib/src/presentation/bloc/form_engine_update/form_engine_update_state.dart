part of 'form_engine_update_bloc.dart';

class FormEngineUpdateState extends Equatable {
  const FormEngineUpdateState({
    required this.isDownloading,
    required this.progress,
    required this.isCompleted,
    this.error,
  });

  factory FormEngineUpdateState.initial() {
    return const FormEngineUpdateState(
      isDownloading: false,
      progress: 0,
      isCompleted: false,
    );
  }

  final bool isDownloading;
  final int progress;
  final bool isCompleted;
  final String? error;

  FormEngineUpdateState copyWith({
    bool? isDownloading,
    int? progress,
    bool? isCompleted,
    String? error,
  }) {
    return FormEngineUpdateState(
      isDownloading: isDownloading ?? this.isDownloading,
      progress: progress ?? this.progress,
      isCompleted: isCompleted ?? this.isCompleted,
      error: error ?? this.error,
    );
  }

  @override
  List<Object?> get props => [isDownloading, progress, isCompleted, error];
}
