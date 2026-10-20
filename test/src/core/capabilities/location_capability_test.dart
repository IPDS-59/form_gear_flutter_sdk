import 'dart:convert';
import 'dart:io';

import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:form_gear_engine_sdk/form_gear_engine_sdk.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/handlers/client_action_handler.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/handlers/execute_handler.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/handlers/location_action_handler.dart';
import 'package:form_gear_engine_sdk/src/core/services/navigator_context_provider.dart';

/// A scripted host that only does `locate`.
class _LocateHost extends FormGearCapabilities {
  _LocateHost({this.fix, this.error, this.supported = true});

  final LocationFix? fix;
  final Object? error;
  final bool supported;
  final requests = <LocateRequest>[];

  @override
  CapabilitySupport support(CapabilityKind kind) =>
      supported && kind == CapabilityKind.locate
      ? const CapabilitySupport.supported()
      : const CapabilitySupport.unsupported();

  @override
  Future<LocationFix?> locate(LocateRequest request) async {
    requests.add(request);
    if (error != null) Error.throwWithStackTrace(error!, StackTrace.current);
    return fix;
  }
}

class _MockWatcher extends FormGearUiHandler {
  _MockWatcher();

  int mockReports = 0;

  @override
  Future<void> onMockLocation(BuildContext context) async => mockReports++;
}

const _palu = LocationFix(
  latitude: -0.89,
  longitude: 119.87,
  accuracy: 5,
  provider: 'fused',
);

void main() {
  late _MockWatcher ui;

  setUp(() {
    ui = _MockWatcher();
    FormGearSDK.instance.uiHandler = ui;
  });

  tearDown(() {
    FormGearSDK.instance
      ..capabilities = null
      ..uiHandler = null;
    NavigatorContextProvider.instance.unregister();
  });

  Future<void> withContext(WidgetTester t) async {
    await t.pumpWidget(
      Builder(
        builder: (c) {
          NavigatorContextProvider.instance.register(() => c);
          return const SizedBox();
        },
      ),
    );
  }

  Future<ActionInfoJs> run(WidgetTester t, String action) async => (await t
      .runAsync(() => LocationActionHandler().handle(action, 'gps', '')))!;

  test('the default host does not provide locate', () {
    expect(const _Bare().support(CapabilityKind.locate).supported, isFalse);
    expect(
      () => const _Bare().locate(
        LocateRequest(
          context: _Ctx(),
          dataKey: 'k',
          assignmentId: 'a',
          cancel: CapabilityCancelToken(),
          tempDir: Directory.systemTemp,
        ),
      ),
      throwsA(isA<CapabilityException>()),
    );
  });

  group('LOCATION', () {
    testWidgets('answers with the host fix as "lat,lng"', (t) async {
      await withContext(t);
      final host = _LocateHost(fix: _palu);
      FormGearSDK.instance.capabilities = host;

      final r = await run(t, 'LOCATION');

      expect(r.success, isTrue);
      expect(r.result, '-0.89,119.87');
      expect(host.requests.single.dataKey, 'gps');
      expect(host.requests.single.accuracy, LocateAccuracy.high);
      expect(ui.mockReports, 0);
    });

    testWidgets('a mock fix still answers and reports onMockLocation', (
      t,
    ) async {
      await withContext(t);
      FormGearSDK.instance.capabilities = _LocateHost(
        fix: const LocationFix(latitude: 1, longitude: 2, isMock: true),
      );

      final r = await run(t, 'LOCATION');
      await t.pump();

      expect(r.success, isTrue);
      expect(r.result, '1.0,2.0');
      expect(ui.mockReports, 1);
    });

    testWidgets('cancel answers "Location cancelled"', (t) async {
      await withContext(t);
      FormGearSDK.instance.capabilities = _LocateHost();

      final r = await run(t, 'LOCATION');

      expect(r.success, isFalse);
      expect(r.error, 'Location cancelled');
    });

    testWidgets('denied shows the host sentence', (t) async {
      await withContext(t);
      FormGearSDK.instance.capabilities = _LocateHost(
        error: const CapabilityException.denied('Izin lokasi ditolak'),
      );

      final r = await run(t, 'LOCATION');

      expect(r.success, isFalse);
      expect(r.error, 'Izin lokasi ditolak');
    });

    testWidgets('a timeout from the host is an error reply', (t) async {
      await withContext(t);
      FormGearSDK.instance.capabilities = _LocateHost(
        error: const CapabilityException(
          CapabilityErrorCode.failed,
          'Lokasi belum ketemu',
        ),
      );

      final r = await run(t, 'LOCATION');

      expect(r.success, isFalse);
      expect(r.error, 'Lokasi belum ketemu');
    });

    testWidgets('a host without locate falls back to the built-in path', (
      t,
    ) async {
      await withContext(t);
      final host = _LocateHost(fix: _palu, supported: false);
      FormGearSDK.instance.capabilities = host;

      final r = await run(t, 'LOCATION');

      // No geolocator plugin in a unit test: the built-in path fails on its
      // own, and the host is never asked.
      expect(host.requests, isEmpty);
      expect(r.success, isFalse);
    });
  });

  group('CAMERA_GPS', () {
    testWidgets('keeps the JSON shape native sends', (t) async {
      await withContext(t);
      FormGearSDK.instance.capabilities = _LocateHost(
        fix: LocationFix(
          latitude: -0.89,
          longitude: 119.87,
          accuracy: 5,
          provider: 'fused',
          timestamp: DateTime.utc(2026, 10, 20, 3),
        ),
      );

      final r = await run(t, 'CAMERA_GPS');

      expect(r.success, isTrue);
      final json = jsonDecode(r.result!) as Map<String, dynamic>;
      expect(json['coordinat'], {'latitude': -0.89, 'longitude': 119.87});
      expect(json['accuracy'], 5);
      expect(json['provider'], 'fused');
      expect(json['timestamp'], '2026-10-20T03:00:00.000Z');
    });
  });

  group('execute LOCATION', () {
    testWidgets('uses the host fix', (t) async {
      await withContext(t);
      final host = _LocateHost(fix: _palu);
      FormGearSDK.instance.capabilities = host;

      final r = (await t.runAsync(
        () => ExecuteHandler().callback(['LOCATION', 'gps', '']),
      ))!;

      expect(r.success, isTrue);
      expect(r.result, '-0.89,119.87');
      expect(host.requests, hasLength(1));
    });
  });

  group('client gpsHandler', () {
    testWidgets('returns the fix through onLocationUpdate', (t) async {
      await withContext(t);
      FormGearSDK.instance.capabilities = _LocateHost(fix: _palu);
      Map<String, dynamic>? seen;
      final handler = ClientActionHandler(
        onLocationUpdate: (data) async => seen = data,
      ).createHandlers().firstWhere((h) => h.handlerName == 'gpsHandler');

      final r = (await t.runAsync(() => handler.callback(['x'])))!;

      expect(r.success, isTrue);
      expect(seen?['latitude'], -0.89);
      expect(seen?['accuracy'], 5);
    });
  });
}

class _Bare extends FormGearCapabilities {
  const _Bare();
}

class _Ctx extends Fake implements BuildContext {}
