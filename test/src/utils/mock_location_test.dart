import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:form_gear_engine_sdk/form_gear_engine_sdk.dart';
import 'package:form_gear_engine_sdk/src/core/services/navigator_context_provider.dart';
import 'package:form_gear_engine_sdk/src/utils/mock_location.dart';

class _Handler extends FormGearUiHandler {
  _Handler({this.fail = false});

  final bool fail;
  int calls = 0;

  @override
  Future<void> onMockLocation(BuildContext context) async {
    calls++;
    if (fail) throw StateError('host failed');
  }
}

void main() {
  tearDown(() {
    FormGearSDK.instance.uiHandler = null;
    NavigatorContextProvider.instance.unregister();
  });

  testWidgets('a mocked position reaches the host with the form context', (
    tester,
  ) async {
    late BuildContext context;
    await tester.pumpWidget(
      Builder(
        builder: (c) {
          context = c;
          return const SizedBox();
        },
      ),
    );
    final handler = _Handler();
    FormGearSDK.instance.uiHandler = handler;
    NavigatorContextProvider.instance.register(() => context);

    reportMockLocation(isMocked: false);
    expect(handler.calls, 0);
    reportMockLocation(isMocked: true);
    expect(handler.calls, 1);
  });

  testWidgets('no handler, no page or a failing host are ignored', (
    tester,
  ) async {
    late BuildContext context;
    await tester.pumpWidget(
      Builder(
        builder: (c) {
          context = c;
          return const SizedBox();
        },
      ),
    );
    reportMockLocation(isMocked: true);
    final handler = _Handler(fail: true);
    FormGearSDK.instance.uiHandler = handler;
    reportMockLocation(isMocked: true);
    expect(handler.calls, 0);
    NavigatorContextProvider.instance.register(() => context);
    reportMockLocation(isMocked: true);
    await tester.pump();
    expect(handler.calls, 1);
  });
}
