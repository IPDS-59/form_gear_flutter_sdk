part of 'form_gear_webview_bloc.dart';

abstract class FormGearWebViewEvent extends Equatable {
  const FormGearWebViewEvent();

  @override
  List<Object?> get props => [];
}

class InitializeWebView extends FormGearWebViewEvent {
  const InitializeWebView(this.controller, [this.htmlContent]);

  final InAppWebViewController controller;
  final String? htmlContent;

  @override
  List<Object?> get props => [controller, htmlContent];
}

class InjectBridge extends FormGearWebViewEvent {
  const InjectBridge(this.controller, {this.force = false});

  final InAppWebViewController controller;
  final bool force;

  @override
  List<Object?> get props => [controller, force];
}

class UpdateLoadingProgress extends FormGearWebViewEvent {
  const UpdateLoadingProgress(this.progress);

  final int progress;

  @override
  List<Object?> get props => [progress];
}

class WebViewLoadStart extends FormGearWebViewEvent {
  const WebViewLoadStart(this.controller, this.url);

  final InAppWebViewController controller;
  final String url;

  @override
  List<Object?> get props => [controller, url];
}

class WebViewLoadStop extends FormGearWebViewEvent {
  const WebViewLoadStop(this.controller, this.url);

  final InAppWebViewController controller;
  final String url;

  @override
  List<Object?> get props => [controller, url];
}

class WebViewLoadError extends FormGearWebViewEvent {
  const WebViewLoadError({
    required this.controller,
    required this.url,
    required this.code,
    required this.message,
  });

  final InAppWebViewController controller;
  final String url;
  final int code;
  final String message;

  @override
  List<Object?> get props => [controller, url, code, message];
}

class VerifyBridgeInjection extends FormGearWebViewEvent {
  const VerifyBridgeInjection(this.controller);

  final InAppWebViewController controller;

  @override
  List<Object?> get props => [controller];
}

class RetryInitialization extends FormGearWebViewEvent {
  const RetryInitialization();
}
