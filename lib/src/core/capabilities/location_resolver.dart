import 'package:form_gear_engine_sdk/src/core/capabilities/capability_broker.dart';
import 'package:form_gear_engine_sdk/src/core/capabilities/form_gear_capabilities.dart';
import 'package:form_gear_engine_sdk/src/utils/mock_location.dart';

/// The one place the location actions (`LOCATION`, `CAMERA_GPS`, execute
/// `LOCATION`, client `gpsHandler`) get a position: the host's
/// [FormGearCapabilities.locate]. A host without it gives the form a
/// [CapabilityException.unsupported].
///
/// Returns null when the user cancelled. A mock position is reported to
/// `FormGearUiHandler.onMockLocation` and still returned.
Future<LocationFix?> resolveLocation({
  required String dataKey,
  String assignmentId = 'current_assignment',
  String purpose = 'location',
  Duration timeout = const Duration(seconds: 10),
  CapabilityBroker? broker,
}) async {
  final fix = await (broker ?? CapabilityBroker.current).locate(
    dataKey: dataKey,
    assignmentId: assignmentId,
    timeout: timeout,
  );
  if (fix != null) reportMockLocation(isMocked: fix.isMock);
  return fix;
}
