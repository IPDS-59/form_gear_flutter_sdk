part of 'form_gear_webview_bloc.dart';

enum WebViewStatus { initial, initializing, ready, loading, loaded, error }

class FormGearWebViewState extends Equatable {
  const FormGearWebViewState({
    this.status = WebViewStatus.initial,
    this.controller,
    this.currentUrl = '',
    this.loadingProgress = 0,
    this.errorMessage,
  });

  final WebViewStatus status;
  final WebViewController? controller;
  final String currentUrl;
  final int loadingProgress;
  final String? errorMessage;

  bool get isLoading => status == WebViewStatus.loading;
  bool get hasError => status == WebViewStatus.error;
  bool get isReady =>
      status == WebViewStatus.ready || status == WebViewStatus.loaded;

  FormGearWebViewState copyWith({
    WebViewStatus? status,
    WebViewController? controller,
    String? currentUrl,
    int? loadingProgress,
    String? errorMessage,
  }) {
    return FormGearWebViewState(
      status: status ?? this.status,
      controller: controller ?? this.controller,
      currentUrl: currentUrl ?? this.currentUrl,
      loadingProgress: loadingProgress ?? this.loadingProgress,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }

  @override
  List<Object?> get props => [
    status,
    controller,
    currentUrl,
    loadingProgress,
    errorMessage,
  ];
}
