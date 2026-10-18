import 'dart:io';

import 'package:form_gear_engine_sdk/src/core/form_gear_sdk.dart';

/// Runs a fresh camera photo through the host's
/// `FormGearUiHandler.processCapturedPhoto`. A host without a handler, or a
/// failing one, leaves the photo as taken.
Future<File> processCapturedPhoto(String path) async {
  final photo = File(path);
  final handler = FormGearSDK.instance.uiHandler;
  if (handler == null) return photo;
  try {
    return await handler.processCapturedPhoto(photo);
  } on Object {
    return photo;
  }
}
