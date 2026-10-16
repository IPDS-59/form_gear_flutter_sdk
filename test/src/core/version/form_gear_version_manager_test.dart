import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:form_gear_engine_sdk/form_gear_engine_sdk.dart';
import 'package:form_gear_engine_sdk/src/core/version/form_gear_version_manager.dart';
import 'package:form_gear_engine_sdk/src/domain/usecases/check_form_engine_version_usecase.dart';
import 'package:form_gear_engine_sdk/src/domain/usecases/get_local_form_engine_version_usecase.dart';
import 'package:form_gear_engine_sdk/src/domain/usecases/install_form_engine_usecase.dart';
import 'package:form_gear_engine_sdk/src/domain/usecases/is_form_engine_downloaded_usecase.dart';
import 'package:form_gear_engine_sdk/src/presentation/screens/form_engine_update_screen.dart';
import 'package:mocktail/mocktail.dart';

class MockCheck extends Mock implements CheckFormEngineVersionUseCase {}

class MockIsDownloaded extends Mock implements IsFormEngineDownloadedUseCase {}

class MockLocalVersion extends Mock
    implements GetLocalFormEngineVersionUseCase {}

class MockInstall extends Mock implements InstallFormEngineUseCase {}

class FakeEntity extends Fake implements FormEngineEntity {}

class RecordingHandler implements FormEngineUpdateHandler {
  final calls = <VersionCheckResult>[];
  late FormEngineDownloader download;

  @override
  Future<void> onUpdateRequired(
    BuildContext context,
    VersionCheckResult result,
    FormEngineDownloader download,
  ) async {
    calls.add(result);
    this.download = download;
  }
}

void main() {
  late MockCheck check;
  late MockIsDownloaded isDownloaded;
  late MockInstall install;
  late FormGearVersionManager manager;

  setUpAll(() => registerFallbackValue(FakeEntity()));

  /// Server says engine 1 is `9.9.9`; nothing is installed (state: missing).
  void serverHas({bool force = false}) {
    final entity = FormEngineEntity(
      formEngineId: 1,
      version: '9.9.9',
      linkDownload: 'https://x.test/e.zip',
      isForce: force,
    );
    when(
      () => check(any()),
    ).thenAnswer((_) async => Success(FormEngineResponse(data: entity)));
    when(() => isDownloaded(any())).thenAnswer((_) async => false);
  }

  Future<VersionCheckResult?> run(
    WidgetTester tester, {
    FormEngineUpdateHandler? handler,
    bool showNotifications = true,
  }) async {
    VersionCheckResult? result;
    await tester.pumpWidget(
      MaterialApp(
        home: Builder(
          builder: (context) => TextButton(
            onPressed: () async =>
                result = await manager.checkFormEngineVersion(
                  context: context,
                  engineId: '1',
                  showNotifications: showNotifications,
                  updateHandler: handler,
                ),
            child: const Text('go'),
          ),
        ),
      ),
    );
    await tester.tap(find.text('go'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 100));
    return result;
  }

  setUp(() {
    check = MockCheck();
    isDownloaded = MockIsDownloaded();
    install = MockInstall();
    manager = FormGearVersionManager(
      check,
      isDownloaded,
      MockLocalVersion(),
      install,
    );
    serverHas();
  });

  group('FormGearVersionManager update UI', () {
    testWidgets('with a handler, calls it instead of the built-in screen', (
      tester,
    ) async {
      final handler = RecordingHandler();

      final result = await run(tester, handler: handler);

      expect(handler.calls, [result]);
      expect(find.byType(FormEngineUpdateScreen), findsNothing);
    });

    testWidgets('a forced update also goes to the handler', (tester) async {
      serverHas(force: true);
      final handler = RecordingHandler();

      await run(tester, handler: handler, showNotifications: false);

      expect(handler.calls.single.isForced, isTrue);
      expect(find.byType(FormEngineUpdateScreen), findsNothing);
    });

    testWidgets('a non-forced update stays silent without notifications', (
      tester,
    ) async {
      final handler = RecordingHandler();

      await run(tester, handler: handler, showNotifications: false);

      expect(handler.calls, isEmpty);
    });

    testWidgets('the handler download runs the install use case', (
      tester,
    ) async {
      when(
        () => install(any(), any(), onProgress: any(named: 'onProgress')),
      ).thenAnswer((_) async => const Success(null));
      final handler = RecordingHandler();
      await run(tester, handler: handler);
      final seen = <int>[];

      final outcome = await handler.download(onProgress: seen.add);

      expect(outcome, isA<Success<void>>());
      final captured =
          verify(
                () => install(
                  any(),
                  '1',
                  onProgress: captureAny(named: 'onProgress'),
                ),
              ).captured.single
              as void Function(int)?;
      captured?.call(42);
      expect(seen, [42]);
    });

    testWidgets('without a handler, shows the built-in update screen', (
      tester,
    ) async {
      await run(tester);

      // The screen overflows under the test font; only its presence matters.
      tester.takeException();
      expect(find.byType(FormEngineUpdateScreen), findsOneWidget);
    });
  });

  group('FormGearVersionManager.downloadFormEngine', () {
    test('installs the engine the server describes', () async {
      when(
        () => install(any(), any(), onProgress: any(named: 'onProgress')),
      ).thenAnswer((_) async => const Success(null));

      final result = await manager.downloadFormEngine('1');

      expect(result, isA<Success<void>>());
      verify(
        () => install(any(), '1', onProgress: any(named: 'onProgress')),
      ).called(1);
    });

    test('fails when the server lookup fails', () async {
      when(
        () => check(any()),
      ).thenAnswer((_) async => const Failure(NetworkFailure('offline')));

      final result = await manager.downloadFormEngine('1');

      expect(result.errorOrNull, isA<NetworkFailure>());
      verifyNever(
        () => install(any(), any(), onProgress: any(named: 'onProgress')),
      );
    });
  });
}
