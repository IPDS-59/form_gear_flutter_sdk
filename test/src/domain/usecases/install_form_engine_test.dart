import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';

import 'package:archive/archive.dart';
import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:form_gear_engine_sdk/src/core/base/failure.dart';
import 'package:form_gear_engine_sdk/src/core/base/result.dart';
import 'package:form_gear_engine_sdk/src/core/constants/directory_constants.dart';
import 'package:form_gear_engine_sdk/src/domain/usecases/install_form_engine_usecase.dart';
import 'package:form_gear_engine_sdk/src/domain/usecases/is_form_engine_downloaded_usecase.dart';
import 'package:form_gear_engine_sdk/src/models/models.dart';
import 'package:mocktail/mocktail.dart';
import 'package:path_provider_platform_interface/path_provider_platform_interface.dart';

import '../../../helpers/test_path_provider_platform.dart';

class MockIsDownloaded extends Mock implements IsFormEngineDownloadedUseCase {}

/// Answers every request with [status] and [body], no network involved.
class _StubAdapter implements HttpClientAdapter {
  _StubAdapter(this.status, this.body);

  final int status;
  final List<int> body;

  @override
  Future<ResponseBody> fetch(
    RequestOptions options,
    Stream<Uint8List>? requestStream,
    Future<void>? cancelFuture,
  ) async => ResponseBody.fromBytes(
    body,
    status,
    headers: {
      Headers.contentLengthHeader: ['${body.length}'],
    },
  );

  @override
  void close({bool force = false}) {}
}

List<int> _zipOf(Map<String, String> files) {
  final archive = Archive();
  files.forEach((name, text) {
    final bytes = utf8.encode(text);
    archive.addFile(ArchiveFile(name, bytes.length, bytes));
  });
  return ZipEncoder().encode(archive);
}

void main() {
  late Directory tmp;
  late MockIsDownloaded isDownloaded;

  FormEngineEntity entity({String? link = 'https://x.test/e.zip'}) =>
      FormEngineEntity(formEngineId: 1, version: '9.9.9', linkDownload: link);

  InstallFormEngineUseCase useCase(int status, List<int> body) =>
      InstallFormEngineUseCase(
        Dio()..httpClientAdapter = _StubAdapter(status, body),
        isDownloaded,
      );

  setUp(() {
    tmp = Directory.systemTemp.createTempSync('dl_engine_');
    PathProviderPlatform.instance = TestPathProviderPlatform(
      applicationDocumentsPath: tmp.path,
    );
    isDownloaded = MockIsDownloaded();
    when(() => isDownloaded(any())).thenAnswer((_) async => true);
  });

  tearDown(() => tmp.deleteSync(recursive: true));

  group('InstallFormEngineUseCase', () {
    test('downloads, extracts, saves version and reports percent', () async {
      // Arrange
      final zip = _zipOf({'index.html': '<html/>'});
      final progress = <int>[];

      // Act
      final result = await useCase(200, zip)(
        entity(),
        '1',
        onProgress: progress.add,
      );

      // Assert
      expect(result, isA<Success<void>>());
      final dir = await DirectoryConstants.getFormEngineDirectory('1');
      expect(File('${dir.path}/index.html').existsSync(), isTrue);
      expect(
        File('${dir.path}/version.json').readAsStringSync(),
        '{"version":"9.9.9"}',
      );
      expect(progress, isNotEmpty);
      expect(progress.last, 100);
    });

    test('fails with DataFailure when there is no download link', () async {
      final result = await useCase(200, [])(entity(link: null), '1');

      expect(result, isA<Failure<void>>());
      expect(result.errorOrNull, isA<DataFailure>());
    });

    test('fails with ServerFailure on a non-200 response', () async {
      final result = await useCase(404, utf8.encode('nope'))(entity(), '1');

      expect(result.errorOrNull, isA<ServerFailure>());
    });

    test('fails when the engine is still missing after extraction', () async {
      when(() => isDownloaded('1')).thenAnswer((_) async => false);

      final result = await useCase(200, _zipOf({'a.txt': 'a'}))(entity(), '1');

      expect(result.errorOrNull, isA<DataFailure>());
    });
  });
}
