import 'dart:async';

/// Runs save/submit jobs one at a time per key (assignment).
///
/// The engines emit `save` on mount and on every section change without
/// awaiting the bridge, so saves for one assignment arrive overlapped. A
/// droppable job (auto-SAVE) is skipped when a newer droppable job for the
/// same key is already queued behind it: latest wins. Non-droppable jobs
/// (SUBMIT) always run, in order.
class SerialSaveQueue {
  const SerialSaveQueue._();

  static final _tails = <String, Future<void>>{};
  static final _latestDroppable = <String, int>{};
  static int _seq = 0;

  /// Queues [job] for [key]; completes with `null` if it was superseded.
  static Future<T?> run<T>(
    String key,
    Future<T> Function() job, {
    bool droppable = false,
  }) {
    final id = ++_seq;
    if (droppable) _latestDroppable[key] = id;

    final result = (_tails[key] ?? Future<void>.value()).then<T?>((_) {
      if (droppable && _latestDroppable[key] != id) return null;
      return job();
    });

    final tail = result.then<void>((_) {}, onError: (Object _) {});
    _tails[key] = tail;
    unawaited(
      tail.whenComplete(() {
        if (identical(_tails[key], tail)) {
          _tails.remove(key);
          _latestDroppable.remove(key);
        }
      }),
    );
    return result;
  }
}
