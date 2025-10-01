import 'dart:io';

import 'package:path_provider_platform_interface/path_provider_platform_interface.dart';

/// Mock PathProviderPlatform for testing
class TestPathProviderPlatform extends PathProviderPlatform {
  TestPathProviderPlatform({
    this.applicationDocumentsPath,
    this.temporaryPath,
    this.applicationSupportPath,
  });

  final String? applicationDocumentsPath;
  final String? temporaryPath;
  final String? applicationSupportPath;

  @override
  Future<String?> getApplicationDocumentsPath() async {
    return applicationDocumentsPath ?? Directory.systemTemp.path;
  }

  @override
  Future<String?> getTemporaryPath() async {
    return temporaryPath ?? Directory.systemTemp.path;
  }

  @override
  Future<String?> getApplicationSupportPath() async {
    return applicationSupportPath ?? Directory.systemTemp.path;
  }

  @override
  Future<String?> getDownloadsPath() async {
    throw UnsupportedError('getDownloadsPath not supported in tests');
  }

  @override
  Future<String?> getExternalStoragePath() async {
    throw UnsupportedError('getExternalStoragePath not supported in tests');
  }

  @override
  Future<List<String>?> getExternalCachePaths() async {
    throw UnsupportedError('getExternalCachePaths not supported in tests');
  }

  @override
  Future<List<String>?> getExternalStoragePaths({
    StorageDirectory? type,
  }) async {
    throw UnsupportedError('getExternalStoragePaths not supported in tests');
  }

  @override
  Future<String?> getLibraryPath() async {
    throw UnsupportedError('getLibraryPath not supported in tests');
  }
}
