import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// Lets the host draw the small pieces of UI the SDK shows around a form, so
/// they match the host's design system. Every method has a default that
/// returns "use the built-in UI", so a host overrides only what it needs.
///
/// Register it with `FormGearSDK.instance.uiHandler = MyHandler()`.
/// The engine download and update screen has its own hook,
/// `FormEngineUpdateHandler`.
abstract class FormGearUiHandler {
  /// Creates a handler. Extend this class (do not implement it) so methods
  /// added in later versions keep their defaults.
  const FormGearUiHandler();

  /// Asks the user to confirm leaving the form. Return `true` to leave,
  /// `false` to stay, or `null` to show the SDK's own dialog.
  Future<bool?> confirmExit(BuildContext context) async => null;

  /// The full-screen loader drawn over the form while it loads. [progress]
  /// is 0-100. Return `null` to use the SDK's own loader.
  Widget? buildLoading(BuildContext context, int progress) => null;

  /// The inline error shown when the form fails to load. Call [retry] to try
  /// again. Return `null` to use the SDK's own banner.
  Widget? buildError(
    BuildContext context,
    String message,
    VoidCallback retry,
  ) => null;

  /// Shows a failure of the engine version check. Return `true` when the host
  /// showed it, `false` to let the SDK show its own dialog.
  Future<bool> showError(BuildContext context, String message) async => false;

  /// Draws the form page edge to edge, under transparent system bars. The
  /// form content stays inside the safe area, so nothing hides behind a bar.
  /// Defaults to `true`; return `false` to keep the host's own system UI.
  bool get edgeToEdge => true;

  /// The status and navigation bar style for the form page. Return `null` to
  /// pick transparent bars with icons that fit the page brightness.
  SystemUiOverlayStyle? systemOverlayStyle(BuildContext context) => null;
}
