import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:form_gear_engine_sdk/form_gear_engine_sdk.dart';
import 'package:form_gear_engine_sdk/src/core/engine/handler_factory.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/bridge_channel.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/handlers/native_bridge_handlers.dart';

class _Listener implements FormEngineEventListener {
  final calls = <String, Object?>{};
  Future<String?> Function() connectorResult = () async => '{"ok":1}';

  @override
  Future<void> onFinalResult({
    required String data,
    required String remark,
    required String principal,
    required String summary,
    required bool hasErrors,
  }) async => calls['final'] = [data, remark, principal, hasErrors];

  @override
  Future<String?> onConnectorApi(
    String name,
    Map<String, dynamic> payload,
  ) {
    calls['connector'] = [name, payload];
    return connectorResult();
  }

  @override
  Future<void> onSendEvent(String assignmentId, String param) async =>
      calls['event'] = [assignmentId, param];
}

void main() {
  late _Listener listener;
  final handlers = {
    for (final h in createNativeBridgeHandlers()) h.handlerName: h,
  };

  // What the page receives, as JsBridge would settle it.
  Future<Object?> call(String name, List<dynamic> args) async =>
      JsBridge.bridgeValue(name, await handlers[name]!.callback(args));

  setUp(() {
    listener = _Listener();
    FormGearSDK.instance.formEngineEventListener = listener;
  });
  tearDown(() => FormGearSDK.instance.formEngineEventListener = null);

  test('factory registers all four native-only bridge methods', () {
    final names = HandlerFactory.createRequiredHandlers(
      currentFormConfig: null,
      config: null,
      getCurrentAssignment: () => null,
    ).map((h) => h.handlerName);
    expect(
      names,
      containsAll([
        'dispatchFinalResult',
        'connectorApi',
        'sendEvent',
        's3refreshUrl',
      ]),
    );
  });

  group('connectorApi', () {
    test('wraps param as native payload and returns the raw body', () async {
      final result = await call('connectorApi', ['cek_nik', '{"nik":"123"}']);

      expect(result, '{"ok":1}');
      expect(listener.calls['connector'], [
        'cek_nik',
        {
          'body': {'nik': '123'},
        },
      ]);
    });

    test('null body becomes native "API call failed"', () async {
      listener.connectorResult = () async => null;
      expect(
        await call('connectorApi', ['x', '{}']),
        '{"success":false,"message":"API call failed"}',
      );
    });

    test('errors become {success:false, message}', () async {
      listener.connectorResult = () async => throw Exception('boom');
      final viaThrow = await call('connectorApi', ['x', '{}']);
      final viaBadParam = await call('connectorApi', ['x', 'not json']);
      FormGearSDK.instance.formEngineEventListener = null;
      final viaNoListener = await call('connectorApi', ['x', '{}']);

      for (final r in [viaThrow, viaBadParam, viaNoListener]) {
        expect(jsonDecode(r! as String), containsPair('success', false));
      }
      expect(viaThrow, contains('boom'));
    });
  });

  group('dispatchFinalResult', () {
    test('hasErrors follows summary.error', () async {
      await call('dispatchFinalResult', ['d', 'r', 'p', '{"error":[1]}']);
      expect(listener.calls['final'], ['d', 'r', 'p', true]);

      await call('dispatchFinalResult', ['d', 'r', 'p', '{"error":[]}']);
      expect(listener.calls['final'], ['d', 'r', 'p', false]);
    });

    test('malformed summary throws like native', () {
      expect(
        () => handlers['dispatchFinalResult']!.callback(['d', 'r', 'p', '{}']),
        throwsA(isA<TypeError>()),
      );
    });
  });

  test('sendEvent forwards with native "0" when no assignment', () async {
    await call('sendEvent', ['{"e":"open"}']);
    expect(listener.calls['event'], ['0', '{"e":"open"}']);
  });

  test('s3refreshUrl is a native-matching no-op', () async {
    expect(await call('s3refreshUrl', ['{}']), {'success': true});
    expect(listener.calls, isEmpty);
  });
}
