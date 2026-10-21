import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:form_gear_engine_sdk/form_gear_engine_sdk.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test('the minified jQuery ships and the full one does not', () async {
    const base = 'packages/form_gear_engine_sdk/assets/vendor';
    final min = await rootBundle.loadString('$base/jquery-3.5.1.min.js');
    expect(min, contains('jQuery v3.5.1'));
    expect(
      () => rootBundle.loadString('$base/jquery-3.5.1.js'),
      throwsA(anything),
    );
  });
}
