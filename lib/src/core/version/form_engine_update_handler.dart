import 'package:flutter/widgets.dart';
import 'package:form_gear_engine_sdk/src/core/base/result.dart';
import 'package:form_gear_engine_sdk/src/models/version_check_result.dart';

/// Downloads and installs the engine of a [VersionCheckResult].
///
/// [onProgress] gets whole percents (0-100). Completes with `Success` once
/// the engine is installed, otherwise a `Failure` holding an `AppFailure`.
typedef FormEngineDownloader =
    Future<Result<void>> Function({void Function(int progress)? onProgress});

/// Lets the host draw its own UI when a form engine must be downloaded or
/// updated, instead of the SDK's built-in update screen.
///
/// Register it with `FormGearSDK.instance.formEngineUpdateHandler = ...`.
/// Without a handler the SDK keeps its built-in screen.
abstract class FormEngineUpdateHandler {
  /// Called by `FormGearSDK.checkFormEngineVersion` when the engine is
  /// missing or outdated, and the SDK would have shown its update screen.
  ///
  /// That is: every time for a forced update ([VersionCheckResult.isForced]),
  /// otherwise only when `showNotifications` is true. A forced update must
  /// not be dismissible. Call [download] to install the engine.
  Future<void> onUpdateRequired(
    BuildContext context,
    VersionCheckResult result,
    FormEngineDownloader download,
  );
}
