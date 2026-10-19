import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:form_gear_engine_sdk/src/core/capabilities/capability_broker.dart';
import 'package:form_gear_engine_sdk/src/core/ui/barcode_scan.dart';

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

  /// A bar the host draws above the form, for a visible way out (iOS has no
  /// system back button). Tapping its close action should call [requestExit],
  /// which asks [confirmExit], saves the form and closes the page. The bar owns
  /// the top safe area: with a bar the engine gets a top inset of 0. Return
  /// `null` (the default) for no bar.
  Widget? buildHeader(
    BuildContext context,
    Future<void> Function() requestExit,
  ) => null;

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

  /// Keeps the web view inside the safe area (the default). Return `false`
  /// to let it fill the whole page: the engine then draws under the system
  /// bars and the host owns the page colour. The insets reach the engine as the
  /// CSS variables `--safe-area-inset-top|right|bottom|left` (in px) on
  /// `<html>`, so its own header and footer can pad themselves.
  bool get useSafeArea => true;

  /// Lets the host change a photo the user just took with the camera, for
  /// example to stamp the time and place on it. Return the file to keep: the
  /// same file or a new one. Gallery and file picks do not pass here. If this
  /// throws, the SDK keeps the original photo.
  Future<File> processCapturedPhoto(File photo) async => photo;

  /// Called when the device reports a location from a mock provider (a fake
  /// GPS app) while the form asks for the position. The position is still
  /// given to the form. Show a warning here, or close the form if the host
  /// does not accept faked positions. [context] is the form page's. The
  /// default does nothing.
  Future<void> onMockLocation(BuildContext context) async {}

  /// Scans one barcode or QR code for a `BARCODE` or `QR_SCAN` form field. The
  /// SDK has no scanner of its own: the host opens its camera screen here and
  /// returns the code, or [BarcodeScanResult.cancelled] when the user leaves.
  /// Return `null` (the default) when the host has no scanner: the form then
  /// shows that scanning is not available. [context] is the form page's.
  ///
  /// Deprecated: provide `FormGearCapabilities.scan` instead. The default now
  /// forwards to it, so a host that moves the method keeps the same types.
  @Deprecated('Provide FormGearCapabilities.scan instead')
  Future<BarcodeScanResult?> scanBarcode(
    BuildContext context,
    BarcodeScanRequest request,
  ) => CapabilityBroker.current.scan(context, request);

  /// The status and navigation bar style for the form page. Return `null` to
  /// pick transparent bars with icons that fit the page brightness.
  SystemUiOverlayStyle? systemOverlayStyle(BuildContext context) => null;
}
