# ADR 0001: Host UI handler, edge-to-edge form page, and bridge events

Status: accepted. Release: 0.6.0 (minor, additive).

## Problem

The SDK draws small pieces of UI around a form: the loader, the exit
dialog, the load error and the version-check error dialog. A host app with
its own design system cannot restyle them. The form page also did not draw
edge to edge, so the system bars covered or letterboxed the form. A host
debugger also had no view of the JS bridge.

## UI inventory (0.5.1)

| Piece | File | Host hook before | Hook now |
| --- | --- | --- | --- |
| Engine download / update screen | `presentation/screens/form_engine_update_screen.dart` | `FormEngineUpdateHandler` | unchanged |
| Loader over the form | `presentation/widgets/form_gear_loading_screen.dart` | none | `FormGearUiHandler.buildLoading` |
| Load error banner | `form_gear_webview.dart` | none | `FormGearUiHandler.buildError` |
| Exit confirmation | `exit_confirmation_dialog.dart` | none | `FormGearUiHandler.confirmExit` |
| Version-check error dialog | `core/version/form_gear_version_manager.dart` | none | `FormGearUiHandler.showError` |
| Form host page (Scaffold, system bars) | `core/engine/webview_builder.dart` | none | `edgeToEdge`, `systemOverlayStyle` |
| Barcode, audio, video recorders, permission consent | `presentation/widgets/*` | none | not changed (task screens, not chrome) |

The SDK has no Android or iOS native code, so there is no Activity or theme
to change; the form page is a Flutter route.

## Decision

1. `FormGearUiHandler`: one abstract base class with default methods that
   mean "use the built-in UI". Hosts extend it and override only what they
   need. Register with `FormGearSDK.instance.uiHandler`.
2. Edge to edge is on by default on the form page: `SystemUiMode.edgeToEdge`,
   transparent bars with icon brightness from the theme, and the WebView stays
   inside a `SafeArea`. `FormGearUiHandler.edgeToEdge` returns false to opt
   out, and `systemOverlayStyle` restyles the bars.
3. `FormGearSDK.bridgeEvents`: a broadcast `Stream<FormGearBridgeEvent>` of the
   JS bridge, free while nobody listens. `FormGearSDK.evaluateJavascript` runs
   JS in the open form for debuggers. A redactor hook is opt-in.

## Alternatives

- Builders in `FormGearConfig` (one callback per widget): more verbose, and a
  new widget needs a new config field. A base class with defaults grows
  without breaking hosts.
- Headless controllers only (the host draws everything): too much for hosts
  that only want a themed dialog.
- Theme tokens injection: cannot change structure, only colors.

## Semver and migration

Additive only: a new class, new optional parameters, and new getters. No host
code changes needed. One visible default change: the form page is now edge to
edge. A host that wants the old look returns `false` from `edgeToEdge`.

## Bridge event model

`FormGearBridgeEvent` fields: `id` (monotonic from 1), `time`, `direction`
(`jsToHost`, `hostToJs`, `local`), `kind` (`call`, `push`, `console`,
`jsError`, `lifecycle`), `channel`, `method`, `args`, `result`, `error`,
`durationMs`, `assignmentId`, `sessionId`.

- `call`: the page called a host handler. `channel` and `method` are the
  handler name. `args` are the raw arguments, `result` is the value sent back
  to the page, `error` is set when the handler threw, `durationMs` runs from
  the page call to the host answer.
- `push`: the host ran JavaScript. `channel` is `js`. `args` is the source. The
  settle of every call shows as `method: __fgBridgeResolve`.
- `console` and `jsError`: `channel` is `console`, `method` is the level, `args`
  is the message. Error level is `jsError`.
- `lifecycle`: `method` is `formOpened`, `formClosed`, `pageStarted`,
  `pageFinished` or `pageError`.

All events of one opened form share `sessionId` and `assignmentId`. Payloads
are raw by default. `FormGearSDK.instance.bridgeRedactor =
FormGearBridgeObserver.redactSecrets` masks token-like keys.
