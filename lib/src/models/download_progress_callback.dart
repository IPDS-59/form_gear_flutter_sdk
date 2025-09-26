/// Progress callback for download operations
typedef DownloadProgressCallback =
    void Function(
      int bytesReceived,
      int totalBytes,
    );
