/// Host side of the native FASIH bridge methods that need the app:
/// `dispatchFinalResult`, `connectorApi` and `sendEvent`.
///
/// Register it with `FormGearSDK.instance.formEngineEventListener = ...`.
abstract class FormEngineEventListener {
  /// FasihForm's answer to `trigger-finalize` (`FormGearSDK.finalizeForm`).
  ///
  /// [hasErrors] is native's `summary.error.length > 0`. Native then asks the
  /// server whether approval is allowed and shows the approve/reject dialog.
  Future<void> onFinalResult({
    required String data,
    required String remark,
    required String principal,
    required String summary,
    required bool hasErrors,
  });

  /// Native `connectorApi`: POST [payload] (`{assignmentId, body}`) as JSON to
  /// `/mobile/connector/api/hit/{name}` and return the raw response body.
  ///
  /// On an HTTP error return the error body. Offline, native returns
  /// `{"error":"No internet connection","status":0}`. `null` becomes
  /// `{"success":false,"message":"API call failed"}`; a throw becomes
  /// `{"success":false,"message":"<error>"}`. The page gets it as a Promise;
  /// native returns it synchronously (webview_flutter has no sync bridge).
  Future<String?> onConnectorApi(String name, Map<String, dynamic> payload);

  /// Native `sendEvent`: forward [param] to analytics. Native only sends it
  /// when the `form_engine_send_event` remote-config flag is on.
  Future<void> onSendEvent(String assignmentId, String param);
}
