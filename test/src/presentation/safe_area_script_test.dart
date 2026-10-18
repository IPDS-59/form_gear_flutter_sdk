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

  test('css pads the body and offsets sticky bottom bars', () {
    expect(safeAreaCss, contains('padding:var(--safe-area-inset-top)'));
    expect(safeAreaCss, contains('.sticky.bottom-0{bottom:var('));
    expect(safeAreaCss, isNot(contains('`')));
  });
}
