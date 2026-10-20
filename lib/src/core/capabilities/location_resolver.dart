// The built-in fallback uses the deprecated helper until 1.0.0.
// ignore_for_file: deprecated_member_use_from_same_package

import 'package:form_gear_engine_sdk/src/core/capabilities/capability_broker.dart';
import 'package:form_gear_engine_sdk/src/core/capabilities/form_gear_capabilities.dart';
import 'package:form_gear_engine_sdk/src/utils/location_service_helper.dart';
import 'package:form_gear_engine_sdk/src/utils/mock_location.dart';

/// The one place the location actions (`LOCATION`, `CAMERA_GPS`, execute
/// `LOCATION`, client `gpsHandler`) get a position: the host's
/// [FormGearCapabilities.locate] when it provides one, else the built-in
/// geolocator path (deprecated, removed at 1.0.0).
///
/// Returns null when the user cancelled. Throws a [CapabilityException] (host)
/// (built-in too, code `failed`) when there is no position.
/// A mock position is reported to `FormGearUiHandler.onMockLocation` either
/// way and still returned.
Future<LocationFix?> resolveLocation({
  required String dataKey,
  String assignmentId = 'current_assignment',
  String purpose = 'location',
  Duration timeout = const Duration(seconds: 10),
  CapabilityBroker? broker,
}) async {
  final host = broker ?? CapabilityBroker.current;
  if (host.provides(CapabilityKind.locate)) {
    final fix = await host.locate(
      dataKey: dataKey,
      assignmentId: assignmentId,
      timeout: timeout,
    );
    if (fix != null) reportMockLocation(isMocked: fix.isMock);
    return fix;
  }
  return await _builtIn(purpose, timeout);
}

Future<LocationFix> _builtIn(String purpose, Duration timeout) async {
  final access = await LocationServiceHelper.ensureLocationAccess(
    contextDescription: purpose,
  );
  if (!access.success) {
    throw CapabilityException(
      CapabilityErrorCode.failed,
      access.errorMessage ?? 'Location access failed',
    );
  }
  final result = await LocationServiceHelper.getCurrentLocation(
    timeLimit: timeout,
  );
  final p = result.position;
  if (!result.success || p == null) {
    throw CapabilityException(
      CapabilityErrorCode.failed,
      result.errorMessage ?? 'Failed to get location',
    );
  }
  // The helper already reported a mock position to the UI handler.
  return LocationFix(
    latitude: p.latitude,
    longitude: p.longitude,
    accuracy: p.accuracy,
    timestamp: p.timestamp,
  );
}
