import 'package:form_gear_engine_sdk/src/core/base/result.dart';
import 'package:form_gear_engine_sdk/src/models/models.dart';

/// Callback type for download progress updates
typedef DownloadProgressCallback =
    void Function(
      int bytesReceived,
      int totalBytes,
    );

/// Repository interface for HTTP download operations
abstract class DownloadRepository {
  /// Download a file from URL to local path
  ///
  /// Parameters:
  /// - [url]: URL to download from
  /// - [destinationPath]: Local file path to save to
  /// - [headers]: Optional HTTP headers
  /// - [onProgress]: Optional progress callback
  /// - [timeout]: Optional timeout duration
  /// - [maxRetries]: Maximum retry attempts on failure
  ///
  /// Returns `Result<DownloadResult>` with download status and details
  Future<Result<DownloadResult>> downloadFile({
    required String url,
    required String destinationPath,
    Map<String, String>? headers,
    DownloadProgressCallback? onProgress,
    Duration? timeout,
    int maxRetries = 3,
  });

  /// Download a file to a temporary location
  ///
  /// Parameters:
  /// - [url]: URL to download from
  /// - [headers]: Optional HTTP headers
  /// - [onProgress]: Optional progress callback
  /// - [timeout]: Optional timeout duration
  /// - [maxRetries]: Maximum retry attempts on failure
  ///
  /// Returns `Result<String>` with temporary file path
  Future<Result<String>> downloadToTemp({
    required String url,
    Map<String, String>? headers,
    DownloadProgressCallback? onProgress,
    Duration? timeout,
    int maxRetries = 3,
  });

  /// Cancel an ongoing download
  ///
  /// Parameters:
  /// - [url]: URL of the download to cancel
  ///
  /// Returns `Result<void>` indicating success or failure
  Future<Result<void>> cancelDownload(String url);

  /// Check if a download is currently active for the given URL
  ///
  /// Parameters:
  /// - [url]: URL to check
  ///
  /// Returns true if download is active
  bool isDownloadActive(String url);

  /// Get list of active downloads
  ///
  /// Returns list of URLs currently being downloaded
  List<String> getActiveDownloads();

  /// Build HTTP headers for FASIH-compatible requests
  ///
  /// Parameters:
  /// - [url]: Request URL for conditional header logic
  /// - [additionalHeaders]: Optional additional headers to include
  ///
  /// Returns Map of HTTP headers
  Map<String, String> buildHeaders({
    String? url,
    Map<String, String>? additionalHeaders,
  });

  /// Check if remote download is properly configured
  ///
  /// Returns true if configuration is valid for remote downloads
  bool isRemoteConfigured();

  /// Dispose resources and cancel all active downloads
  Future<void> dispose();
}
