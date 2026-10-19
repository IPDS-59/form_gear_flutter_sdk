import 'package:flutter/painting.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:form_gear_engine_sdk/src/presentation/widgets/form_gear_webview.dart';

void main() {
  test('sets the four inset variables and one reusable style element', () {
    final js = buildSafeAreaScript(
      const EdgeInsets.only(left: 1, top: 24, right: 2, bottom: 16),
    );
    expect(js, contains("'--safe-area-inset-top','24.0px'"));
    expect(js, contains("'--safe-area-inset-bottom','16.0px'"));
    expect(js, contains("'--safe-area-inset-left','1.0px'"));
    expect(js, contains("'--safe-area-inset-right','2.0px'"));
    expect(js, contains("getElementById('fg-safe-area')"));
    expect(js, contains(safeAreaCss));
  });

  test('css pads the engine mount element with !important', () {
    expect(safeAreaCss, startsWith('#fasih-form{'));
    expect(safeAreaCss, contains('padding:var(--safe-area-inset-top)'));
    expect(safeAreaCss, endsWith('!important}'));
  });

  test('css makes the section drawer and dialogs full-bleed', () {
    expect(safeAreaCss, contains('@media (max-width:767.98px){.sidebar-span{'));
    expect(safeAreaCss, contains('position:fixed!important'));
    expect(
      safeAreaCss,
      contains('padding-top:calc(1.25rem + var(--safe-area-inset-top))'),
    );
    expect(safeAreaCss, contains('[role=dialog]{'));
    expect(safeAreaCss, isNot(contains('`')));
  });
}
