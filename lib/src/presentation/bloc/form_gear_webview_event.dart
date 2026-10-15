part of 'form_gear_webview_bloc.dart';

abstract class FormGearWebViewEvent extends Equatable {
  const FormGearWebViewEvent();

  @override
  List<Object?> get props => [];
}

class InitializeWebView extends FormGearWebViewEvent {
  const InitializeWebView(this.controller);

  final WebViewController controller;

  @override
  List<Object?> get props => [controller];
}

class UpdateLoadingProgress extends FormGearWebViewEvent {
  const UpdateLoadingProgress(this.progress);

  final int progress;

  @override
  List<Object?> get props => [progress];
}

class WebViewLoadStart extends FormGearWebViewEvent {
  const WebViewLoadStart(this.url);

  final String url;

  @override
  List<Object?> get props => [url];
}

class WebViewLoadStop extends FormGearWebViewEvent {
  const WebViewLoadStop(this.url);

  final String url;

  @override
  List<Object?> get props => [url];
}

class WebViewLoadError extends FormGearWebViewEvent {
  const WebViewLoadError({
    required this.url,
    required this.code,
    required this.message,
  });

  final String url;
  final int code;
  final String message;

  @override
  List<Object?> get props => [url, code, message];
}

class RetryInitialization extends FormGearWebViewEvent {
  const RetryInitialization();
}
