import 'dart:async';

/// Which way a bridge event travelled.
enum FormGearBridgeDirection {
  /// The page called the host (`callHandler`), the host answered.
  jsToHost,

  /// The host ran JavaScript in the page.
  hostToJs,

  /// Not a call: a page lifecycle, console or JS error event.
  local,
}

/// What a bridge event describes.
enum FormGearBridgeKind {
  /// A page-to-host handler call with its result or error.
  call,

  /// Host JavaScript run in the page (a settle of a call, or a push).
  push,

  /// A `console.*` message from the page.
  console,

  /// A JavaScript error from the page (console error level).
  jsError,

  /// Page load start/stop/error and engine/template facts.
  lifecycle,
}

/// One observed bridge event. Plain data, safe to keep in a ring buffer.
class FormGearBridgeEvent {
  /// Creates an event; the observer assigns [id] and [time].
  const FormGearBridgeEvent({
    required this.id,
    required this.time,
    required this.direction,
    required this.kind,
    required this.channel,
    this.method,
    this.args,
    this.result,
    this.error,
    this.durationMs,
    this.assignmentId,
    this.sessionId,
  });

  /// Monotonic per process, starting at 1.
  final int id;
  final DateTime time;
  final FormGearBridgeDirection direction;
  final FormGearBridgeKind kind;

  /// The handler name for a call (`getUserId`, `saveAnswer`, ...), `js` for
  /// host JavaScript, `console`, or `lifecycle`.
  final String channel;

  /// A finer name: the lifecycle step (`pageStarted`, `pageFinished`,
  /// `pageError`, `engineReady`), the console level, or the JS function a push
  /// calls.
  final String? method;

  /// Raw arguments: the handler arguments, the JS source, or the lifecycle
  /// details.
  final Object? args;
  final Object? result;
  final String? error;

  /// For a call: from the page's call to the host's answer.
  final int? durationMs;

  /// The assignment of the open form, if known.
  final String? assignmentId;

  /// One id per opened form, shared by all its events.
  final String? sessionId;

  /// A copy with changed payload fields, used by redactors.
  FormGearBridgeEvent copyWith({Object? args, Object? result, String? error}) =>
      FormGearBridgeEvent(
        id: id,
        time: time,
        direction: direction,
        kind: kind,
        channel: channel,
        method: method,
        args: args ?? this.args,
        result: result ?? this.result,
        error: error ?? this.error,
        durationMs: durationMs,
        assignmentId: assignmentId,
        sessionId: sessionId,
      );
}

/// Rewrites an event before it is published, for example to mask tokens.
typedef FormGearBridgeRedactor =
    FormGearBridgeEvent Function(FormGearBridgeEvent event);

/// Publishes [FormGearBridgeEvent]s. Opt-in and free when nobody listens:
/// producers call [emit] with a builder that only runs while a listener is
/// attached.
class FormGearBridgeObserver {
  FormGearBridgeObserver._();

  /// The one observer of the process.
  static final FormGearBridgeObserver instance = FormGearBridgeObserver._();

  final StreamController<FormGearBridgeEvent> _controller =
      StreamController<FormGearBridgeEvent>.broadcast();
  var _nextId = 1;

  /// Rewrites every event before it is published. Null by default, so a
  /// debugger sees raw payloads; set it to mask tokens and answers.
  FormGearBridgeRedactor? redactor;

  /// The assignment of the open form; set by the SDK.
  String? assignmentId;

  /// One id per opened form; set by the SDK.
  String? sessionId;

  /// All events, broadcast.
  Stream<FormGearBridgeEvent> get events => _controller.stream;

  /// Whether anyone listens. Producers check this before doing any work.
  bool get isObserving => _controller.hasListener;

  /// Builds and publishes an event if somebody listens.
  void emit({
    required FormGearBridgeDirection direction,
    required FormGearBridgeKind kind,
    required String channel,
    String? method,
    Object? args,
    Object? result,
    String? error,
    int? durationMs,
  }) {
    if (!_controller.hasListener) return;
    var event = FormGearBridgeEvent(
      id: _nextId++,
      time: DateTime.now(),
      direction: direction,
      kind: kind,
      channel: channel,
      method: method,
      args: args,
      result: result,
      error: error,
      durationMs: durationMs,
      assignmentId: assignmentId,
      sessionId: sessionId,
    );
    final redact = redactor;
    if (redact != null) event = redact(event);
    _controller.add(event);
  }

  /// Masks values of keys that look secret (token, authorization, password,
  /// secret, cookie) in maps and JSON-ish strings. Opt in with
  /// `observer.redactor = FormGearBridgeObserver.redactSecrets`.
  static FormGearBridgeEvent redactSecrets(FormGearBridgeEvent e) {
    Object? mask(Object? v) {
      if (v is Map) {
        return {
          for (final entry in v.entries)
            entry.key: _secretKey.hasMatch('${entry.key}')
                ? '***'
                : mask(entry.value),
        };
      }
      if (v is List) return [for (final x in v) mask(x)];
      if (v is String) {
        return v.replaceAllMapped(
          RegExp(
            r'("(?:[^"]*(?:token|authorization|password|secret|cookie)[^"]*)"\s*:\s*)"[^"]*"',
            caseSensitive: false,
          ),
          (m) => '${m[1]}"***"',
        );
      }
      return v;
    }

    return e.copyWith(args: mask(e.args), result: mask(e.result));
  }

  static final _secretKey = RegExp(
    'token|authorization|password|secret|cookie',
    caseSensitive: false,
  );
}
