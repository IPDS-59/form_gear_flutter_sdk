// On-device smoke test of the webview_flutter bridge for both engines.
// Run: flutter test integration_test/bridge_smoke_test.dart -d <device>
import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:example/main.dart' as app;
import 'package:example/screens/demo_template_loader.dart';
import 'package:example/screens/home_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:form_gear_engine_sdk/form_gear_engine_sdk.dart';
import 'package:form_gear_engine_sdk/src/core/listeners/examples/file_system_listener.dart';
import 'package:form_gear_engine_sdk/src/presentation/bloc/form_gear_webview_bloc.dart';
import 'package:form_gear_engine_sdk/src/utils/webview_navigation_helper.dart';
import 'package:integration_test/integration_test.dart';

class _RecordingListener extends FileSystemFormDataListener {
  final results = <(SaveSubmitData, SaveSubmitResult)>[];

  @override
  Future<SaveSubmitResult> handleSaveOrSubmit(SaveSubmitData data) async {
    final result = await super.handleSaveOrSubmit(data);
    results.add((data, result));
    return result;
  }
}

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('both engines: shim, bridge round-trip, lookup, exit save', (
    tester,
  ) async {
    app.main();
    final listener = _RecordingListener();
    FormGearSDK.instance.setFormDataListener(listener);

    Future<T> until<T>(
      String what,
      Future<T?> Function() probe, {
      int seconds = 30,
    }) async {
      for (var i = 0; i < seconds * 2; i++) {
        final v = await probe();
        if (v != null) return v;
        await tester.pump(const Duration(milliseconds: 500));
      }
      throw TimeoutException('timed out waiting for $what');
    }

    await until(
      'home',
      () async => find.byType(HomeScreen).evaluate().isEmpty ? null : true,
    );

    final seen = <Object>[];
    for (final engine in ['1', '2']) {
      final data = await DemoTemplateLoader.loadAllAssignmentData();
      Map<String, dynamic> m(Object? v) =>
          Map<String, dynamic>.from((v as Map?) ?? const {});
      final assignment = AssignmentContext(
        assignmentId: 'smoke_engine_$engine',
        templateId: 'demo_template',
        surveyId: 'smoke',
        formEngineId: engine,
        config: const AssignmentConfig(
          lookupMode: FormGearLookupMode.online,
          formMode: FormGearFormMode.open,
          clientMode: FormGearClientMode.capi,
        ),
        data: AssignmentData(
          template: m(data['template']),
          validation: m(data['validation']),
          reference: m(data['reference']),
          response: m(data['response']),
          media: m(data['media']),
          preset: m(data['preset']),
          remark: m(data['remark']),
          principals: const [],
          userInfo: const {'name': 'smoke_user', 'role': 'ENUMERATOR'},
        ),
      );

      final home = tester.element(find.byType(HomeScreen));
      unawaited(
        FormGearSDK.instance.openFormWithAssignment(
          context: home,
          assignment: assignment,
          title: 'Smoke engine $engine',
        ),
      );

      final controller = await until('webview', () async {
        final w = find.byWidgetPredicate(
          (w) => w.runtimeType.toString() == 'WebViewWidget',
        );
        if (w.evaluate().isEmpty) return null;
        final c = tester
            .element(w.last)
            .read<FormGearWebViewBloc>()
            .state
            .controller;
        return c == null || seen.contains(c) ? null : c;
      });
      seen.add(controller);
      debugPrint(
        'SMOKE[$engine] webviews in tree: ${find.byWidgetPredicate((w) => w.runtimeType.toString() == 'WebViewWidget').evaluate().length}',
      );

      Future<Map<String, dynamic>?> js(String expr) async {
        final raw = await controller.runJavaScriptReturningResult(
          'JSON.stringify($expr)',
        );
        var v = raw is String ? raw : raw.toString();
        // Android returns the JSON string JSON-quoted.
        if (v.startsWith('"')) v = jsonDecode(v) as String;
        final decoded = jsonDecode(v);
        return decoded is Map<String, dynamic> ? decoded : null;
      }

      final ready = engine == '2'
          ? 'typeof window.fasihForm === "object"'
          : 'document.querySelectorAll("#FormGear-root *, #root *").length > 20';
      final state = await until('engine $engine render', () async {
        final s = await js(
          '{ready: $ready, android: typeof window.Android, '
          'fasihForm: typeof window.fasihForm, '
          'bridge: typeof (window.flutter_inappwebview || {}).callHandler, '
          'lastError: window.__fgLastError || null, '
          'nodes: document.querySelectorAll("body *").length, '
          'href: location.href, '
          'body: document.body ? document.body.innerText.slice(0, 120) : null}',
        );
        if (s?['ready'] != true) debugPrint('SMOKE[$engine] waiting: $s');
        return s?['ready'] == true ? s : null;
      });
      debugPrint('SMOKE[$engine] page: ${jsonEncode(state)}');

      // Async round-trip: JS -> FormGearBridge channel -> Dart -> resolve.
      await controller.runJavaScript(
        'window.__rt = null; window.flutter_inappwebview'
        '.callHandler("getUserName")'
        '.then(function (v) { window.__rt = {ok: true, v: v}; },'
        ' function (e) { window.__rt = {ok: false, e: String(e)}; });',
      );
      final rt = await until('round-trip', () => js('window.__rt'));
      debugPrint('SMOKE[$engine] callHandler(getUserName): ${jsonEncode(rt)}');

      // Lookup fetch from the about:blank page to the local server.
      await controller.runJavaScript(
        'window.__lk = null; fetch("http://127.0.0.1:3310/lookup?id=x&v=1&c=[]")'
        '.then(function (r) { window.__lk = {status: r.status}; },'
        ' function (e) { window.__lk = {error: String(e)}; });',
      );
      final lk = await until('lookup fetch', () => js('window.__lk'));
      debugPrint('SMOKE[$engine] lookup fetch: ${jsonEncode(lk)}');

      final vis = await js(
        '(function(){var e=document.elementFromPoint(innerWidth/2,innerHeight/3);'
        'var r=document.body.getBoundingClientRect();'
        'return {w:innerWidth,h:innerHeight,bodyH:r.height,'
        'center:e?e.tagName+"."+e.className:null,'
        'sheets:document.styleSheets.length};})()',
      );
      debugPrint('SMOKE[$engine] layout: ${jsonEncode(vis)}');
      debugPrint('SMOKE[$engine] SCREENSHOT_NOW');
      await tester.pump(const Duration(seconds: 5));

      // Real exit path: the same script the back button runs.
      final before = listener.results.length;
      await WebViewNavigationHelper.callMobileExit(controller);
      final saved = await until(
        'exit save',
        () async =>
            listener.results.length > before ? listener.results.last : null,
        seconds: 15,
      ).then<Object?>((r) => r, onError: (Object e) => e);

      if (saved is (SaveSubmitData, SaveSubmitResult)) {
        final (d, r) = saved;
        debugPrint(
          'SMOKE[$engine] exit save: flag=${d.flag} '
          'engine=${d.engineType.displayName} success=${r.isSuccess} '
          'meta=${jsonEncode(r.metadata)} id=${r.submissionId}',
        );
        for (final f in (r.metadata?['saved_files'] as List? ?? const [])) {
          final file = File(f as String);
          final text = file.readAsStringSync().replaceAll(RegExp(r'\s+'), ' ');
          debugPrint(
            'SMOKE[$engine] file ${file.uri.pathSegments.last}: '
            '${text.length} bytes: ${text.substring(0, text.length.clamp(0, 160))}',
          );
        }
      } else {
        debugPrint('SMOKE[$engine] exit save: NONE ($saved)');
      }

      final after = await js('{lastError: window.__fgLastError || null}');
      debugPrint('SMOKE[$engine] after: ${jsonEncode(after)}');

      Navigator.of(home).pop();
      await tester.pump(const Duration(seconds: 2));

      expect(state['bridge'], 'function');
      expect(state['lastError'], isNull);
      if (engine == '2') expect(state['android'], 'object');
      expect(rt['ok'], isTrue);
    }
  });
}
