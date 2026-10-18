import 'package:flutter/foundation.dart';
import 'package:form_gear_engine_sdk/src/core/form_gear_sdk.dart';
import 'package:form_gear_engine_sdk/src/core/services/navigator_context_provider.dart';

/// Tells the host's `FormGearUiHandler.onMockLocation` that a position came
/// from a mock provider. Does not wait for the host, and a failing host or a
/// missing form page is ignored: the position is still given to the form.
void reportMockLocation({required bool isMocked}) {
  if (!isMocked) return;
  final handler = FormGearSDK.instance.uiHandler;
  final context = NavigatorContextProvider.instance.context;
  if (handler == null || context == null) return;
  try {
    handler.onMockLocation(context).catchError((Object _) {});
  } on Object catch (e) {
    debugPrint('onMockLocation: $e');
  }
}
