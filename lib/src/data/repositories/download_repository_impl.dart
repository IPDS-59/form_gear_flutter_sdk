import 'dart:async';

import 'package:dio/dio.dart';
import 'package:form_gear_engine_sdk/src/core/base/result.dart';
import 'package:form_gear_engine_sdk/src/core/config/form_gear_api_config.dart';
import 'package:form_gear_engine_sdk/src/core/constants/directory_constants.dart';
import 'package:form_gear_engine_sdk/src/domain/repositories/download_repository.dart'
    hide DownloadProgressCallback;
import 'package:form_gear_engine_sdk/src/models/bps_user.dart';
import 'package:form_gear_engine_sdk/src/models/download_progress_callback.dart';
import 'package:form_gear_engine_sdk/src/models/download_result.dart';
import 'package:form_gear_engine_sdk/src/utils/form_gear_logger.dart';
import 'package:injectable/injectable.dart';
import 'package:path_provider/path_provider.dart';

@LazySingleton(as: DownloadRepository)
/// Implementation of DownloadRepository for Dio download operations
class DownloadRepositoryImpl implements DownloadRepository {
  DownloadRepositoryImpl(this._dio);

  /// Dio client for downloads
  final Dio _dio;

  /// Active downloads tracking
  final Map<String, CancelToken> _activeDownloads = {};

  /// Remote server configuration
  static FormGearApiConfig? _apiConfig;
  static bool _useRemoteDownload = false;

  /// Configure remote download settings
  static void configure({
    FormGearApiConfig? apiConfig,
    String? authToken,
    BpsUser? user,
    Map<String, String>? customHeaders,
    bool useRemoteDownload = true,
  }) {
    _apiConfig = apiConfig;
    _useRemoteDownload = useRemoteDownload;

    FormGearLogger.sdk(
      'Download repository configured: useRemote=$useRemoteDownload, '
      'hasApiConfig=${apiConfig != null}',
    );
  }

  @override
  Future<Result<DownloadResult>> downloadFile({
    required String url,
    required String destinationPath,
    Map<String, String>? headers,
    DownloadProgressCallback? onProgress,
    Duration? timeout,
    int maxRetries = 3,
  }) async {
    final dataDir = await DirectoryConstants.getBpsDirectory();
    final fullDestinationPath = '${dataDir.path}/$destinationPath';

    for (var attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        FormGearLogger.sdk(
          'Downloading from $url (attempt $attempt/$maxRetries)',
        );

        // Create cancel token for this download
        final cancelToken = CancelToken();
        final downloadKey = url;
        _activeDownloads[downloadKey] = cancelToken;

        // Use Dio download with interceptors
        final response = await _dio.download(
          url,
          fullDestinationPath,
          options: Options(
            headers: headers, // Additional headers if needed
            responseType: ResponseType.bytes,
            followRedirects: true,
            receiveTimeout: timeout ?? const Duration(minutes: 5),
            sendTimeout: timeout ?? const Duration(minutes: 5),
          ),
          onReceiveProgress: onProgress != null
              ? (received, total) => onProgress(received, total)
              : null,
          cancelToken: cancelToken,
        );

        _activeDownloads.remove(downloadKey);

        if (response.statusCode == 200) {
          FormGearLogger.sdk('Download completed: $fullDestinationPath');

          return Success(
            DownloadResult(
              success: true,
              localPath: fullDestinationPath,
            ),
          );
        } else {
          throw DioException(
            requestOptions: RequestOptions(path: url),
            message: 'HTTP ${response.statusCode}',
          );
        }
      } on DioException catch (e) {
        FormGearLogger.sdkError(
          'Dio error on attempt $attempt for $url: ${e.message}',
        );
        if (attempt == maxRetries) {
          return Success(
            DownloadResult(
              success: false,
              error: 'Download timed out after $maxRetries attempts',
            ),
          );
        }
        // Wait before retry with exponential backoff
        await Future<void>.delayed(Duration(seconds: attempt * 2));
      } catch (e) {
        FormGearLogger.sdkError(
          'Download failed on attempt $attempt: $e',
        );
        if (attempt == maxRetries) {
          return Success(
            DownloadResult(
              success: false,
              error: 'Download failed after $maxRetries attempts: $e',
            ),
          );
        }
        // Wait before retry
        await Future<void>.delayed(Duration(seconds: attempt * 2));
      }
    }

    return Success(
      DownloadResult(
        success: false,
        error: 'Download failed after $maxRetries attempts',
      ),
    );
  }

  @override
  Future<Result<String>> downloadToTemp({
    required String url,
    Map<String, String>? headers,
    DownloadProgressCallback? onProgress,
    Duration? timeout,
    int maxRetries = 3,
  }) async {
    try {
      final tempDir = await getTemporaryDirectory();
      final tempFileName =
          'formgear_temp_${DateTime.now().millisecondsSinceEpoch}';
      final tempFilePath = '${tempDir.path}/$tempFileName';

      final downloadResult = await downloadFile(
        url: url,
        destinationPath: tempFilePath,
        headers: headers,
        onProgress: onProgress,
        timeout: timeout,
        maxRetries: maxRetries,
      );

      if (downloadResult case Success(:final data)) {
        if (data.success) {
          return Success(data.localPath ?? tempFilePath);
        } else {
          return Failure(
            Exception(data.error ?? 'Unknown download error'),
            StackTrace.current,
          );
        }
      } else {
        return downloadResult as Failure<String>;
      }
    } catch (e, stackTrace) {
      return Failure(e, stackTrace);
    }
  }

  @override
  Future<Result<void>> cancelDownload(String url) async {
    try {
      final cancelToken = _activeDownloads[url];
      if (cancelToken != null) {
        cancelToken.cancel('Download cancelled by user');
        _activeDownloads.remove(url);
        FormGearLogger.sdk('Cancelled download: $url');
      }
      return const Success(null);
    } catch (e, stackTrace) {
      return Failure(e, stackTrace);
    }
  }

  @override
  bool isDownloadActive(String url) {
    return _activeDownloads.containsKey(url);
  }

  @override
  List<String> getActiveDownloads() {
    return _activeDownloads.keys.toList();
  }

  @override
  Map<String, String> buildHeaders({
    String? url,
    Map<String, String>? additionalHeaders,
  }) {
    // Note: Most headers are now handled by Dio interceptors automatically
    // This method is kept for compatibility and additional headers if needed
    final headers = <String, String>{};

    // Add any additional headers passed in
    if (additionalHeaders != null) {
      headers.addAll(additionalHeaders);
    }

    return headers;
  }

  @override
  bool isRemoteConfigured() {
    return _useRemoteDownload && _apiConfig != null;
  }

  @override
  Future<void> dispose() async {
    for (final cancelToken in _activeDownloads.values) {
      cancelToken.cancel('Repository disposed');
    }
    _activeDownloads.clear();
  }

  // Authentication and header logic now handled by Dio interceptors
}
