import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:form_gear_engine_sdk/form_gear_engine_sdk.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/bridge_channel.dart';

class _Handler extends JSHandler<JsonCodable> {
  _Handler(this.handlerName, this.run);

  @override
  final String handlerName;
  final JsonCodable Function(List<dynamic>) run;

  @override
  Future<JsonCodable> callback(List<dynamic> arguments) async => run(arguments);
}

void main() {
  final observer = FormGearBridgeObserver.instance;

  tearDown(() => observer.redactor = null);

  test('emit is free and silent while nobody listens', () {
    expect(observer.isObserving, isFalse);
    observer.emit(
      direction: FormGearBridgeDirection.local,
      kind: FormGearBridgeKind.lifecycle,
      channel: 'lifecycle',
    );
  });

  test('a JS call publishes a call event with result and duration', () async {
    final events = <FormGearBridgeEvent>[];
    final sub = observer.events.listen(events.add);
    final bridge = JsBridge(
      origin: Object(),
      runJavaScript: (_) async {},
      handlers: [
        _Handler('getUserId', (_) => StringInfoJs(success: true, value: 'u1')),
        _Handler('boom', (_) => throw StateError('nope')),
      ],
    );

    await bridge.onMessage(
      jsonEncode({'id': 1, 'name': 'getUserId', 'args': <dynamic>[]}),
    );
    await bridge.onMessage(
      jsonEncode({
        'id': 2,
        'name': 'boom',
        'args': ['x'],
      }),
    );
    await Future<void>.delayed(Duration.zero);
    await sub.cancel();

    final calls = events
        .where((e) => e.kind == FormGearBridgeKind.call)
        .toList();
    expect(calls.map((e) => e.channel), ['getUserId', 'boom']);
    expect(calls[0].direction, FormGearBridgeDirection.jsToHost);
    expect(calls[0].result, 'u1');
    expect(calls[0].durationMs, isNotNull);
    expect(calls[1].error, contains('nope'));
    expect(calls[1].args, ['x']);
    // The settle script run in the page shows up as a host push.
    expect(
      events.where((e) => e.kind == FormGearBridgeKind.push),
      hasLength(2),
    );
    expect(
      events.map((e) => e.id),
      orderedEquals([...events.map((e) => e.id)]..sort()),
    );
  });

  test('redactSecrets masks token-like keys, off unless installed', () async {
    final events = <FormGearBridgeEvent>[];
    final sub = observer.events.listen(events.add);
    observer.emit(
      direction: FormGearBridgeDirection.jsToHost,
      kind: FormGearBridgeKind.call,
      channel: 'getToken',
      args: [
        {'Authorization': 'Bearer abc', 'name': 'ok'},
      ],
      result: '{"access_token":"abc","x":1}',
    );
    observer.redactor = FormGearBridgeObserver.redactSecrets;
    observer.emit(
      direction: FormGearBridgeDirection.jsToHost,
      kind: FormGearBridgeKind.call,
      channel: 'getToken',
      args: [
        {'Authorization': 'Bearer abc', 'name': 'ok'},
      ],
      result: '{"access_token":"abc","x":1}',
    );
    await Future<void>.delayed(Duration.zero);
    await sub.cancel();

    expect(events[0].args.toString(), contains('Bearer abc'));
    expect(events[1].args.toString(), isNot(contains('Bearer abc')));
    expect(events[1].args.toString(), contains('ok'));
    expect(events[1].result, isNot(contains('"abc"')));
    expect(events[1].result, contains('"x":1'));
  });
}
