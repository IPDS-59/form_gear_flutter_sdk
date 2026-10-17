import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:form_gear_engine_sdk/form_gear_engine_sdk.dart';

class _Defaults extends FormGearUiHandler {
  const _Defaults();
}

void main() {
  testWidgets('every default means use the built-in UI', (tester) async {
    late BuildContext context;
    await tester.pumpWidget(
      Builder(
        builder: (c) {
          context = c;
          return const SizedBox();
        },
      ),
    );
    const handler = _Defaults();
    expect(await handler.confirmExit(context), isNull);
    expect(handler.buildLoading(context, 10), isNull);
    expect(handler.buildError(context, 'x', () {}), isNull);
    expect(await handler.showError(context, 'x'), isFalse);
    expect(handler.systemOverlayStyle(context), isNull);
    expect(handler.edgeToEdge, isTrue);
    expect(handler.useSafeArea, isTrue);
  });
}
