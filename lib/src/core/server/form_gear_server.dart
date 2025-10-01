import 'dart:convert';
import 'dart:io';

import 'package:form_gear_engine_sdk/src/core/constants/directory_constants.dart';
import 'package:form_gear_engine_sdk/src/utils/form_gear_logger.dart';
import 'package:path_provider/path_provider.dart';
import 'package:shelf/shelf.dart';
import 'package:shelf/shelf_io.dart' as shelf_io;
import 'package:shelf_static/shelf_static.dart';

/// HTTP server for serving FormGear assets and lookup data
class FormGearServer {
  FormGearServer({
    this.port = 3310,
    this.lookupAssetPath = 'assets/lookup',
  });

  HttpServer? _server;
  String? _baseUrl;
  final int port;
  final String? lookupAssetPath;

  /// Starts the HTTP server
  Future<String?> start() async {
    try {
      // Get the BPS data directory for static file serving
      final appDocDir = await getApplicationDocumentsDirectory();
      final dataDir = Directory('${appDocDir.path}/BPS');

      // Create static file handler for FormGear/BPS assets
      final staticHandler = createStaticHandler(
        dataDir.path,
        defaultDocument: 'index.html',
      );

      // Create cascade: try static files first, then custom routing for lookups
      final handler = const Pipeline()
          .addMiddleware(logRequests())
          .addMiddleware(_corsMiddleware())
          .addHandler(
            Cascade().add(staticHandler).add(_apiRouter).handler,
          );

      // Try to start server with port fallback if port is in use
      var currentPort = port;
      const maxRetries = 5;

      for (var attempt = 0; attempt < maxRetries; attempt++) {
        try {
          _server = await shelf_io.serve(handler, '127.0.0.1', currentPort);
          _baseUrl = 'http://127.0.0.1:${_server!.port}';

          FormGearLogger.sdk('FormGear HTTP Server started on $_baseUrl');
          FormGearLogger.sdk('Serving static files from: ${dataDir.path}');
          return _baseUrl;
        } on SocketException catch (e) {
          if (e.osError?.errorCode == 98 && attempt < maxRetries - 1) {
            // EADDRINUSE
            currentPort++;
            FormGearLogger.sdk(
              'Port ${currentPort - 1} in use, trying $currentPort',
            );
            continue;
          }
          rethrow;
        }
      }

      throw Exception(
        'Unable to find available port after $maxRetries attempts',
      );
    } on Exception catch (e) {
      FormGearLogger.sdkError('Failed to start FormGear server: $e');
      return null;
    }
  }

  /// Stops the HTTP server
  Future<void> stop() async {
    if (_server != null) {
      await _server!.close();
      _server = null;
      _baseUrl = null;
      FormGearLogger.sdk('FormGear HTTP Server stopped');
    }
  }

  /// CORS middleware for cross-origin requests
  Middleware _corsMiddleware() {
    return (Handler innerHandler) {
      return (Request request) async {
        final response = await innerHandler(request);
        return response.change(
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        );
      };
    };
  }

  /// API router for dynamic content (lookup requests)
  Future<Response> _apiRouter(Request request) async {
    final path = request.url.path;
    final method = request.method;

    // Handle preflight OPTIONS requests
    if (method == 'OPTIONS') {
      return Response.ok(
        '',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      );
    }

    // Route lookup requests
    if (path == 'lookup' && method == 'GET') {
      return _handleLookup(request);
    }

    return Response.notFound('API endpoint not found');
  }

  /// Handles lookup requests - serves from local documents directory
  Future<Response> _handleLookup(Request request) async {
    try {
      final params = request.url.queryParameters;
      final lookupId = params['id'];
      final version = params['v'] ?? '1';
      final conditions = params['c'] ?? '[]';

      if (lookupId == null) {
        return Response.badRequest(
          body: jsonEncode({'error': 'Missing id parameter'}),
          headers: {'Content-Type': 'application/json'},
        );
      }

      FormGearLogger.sdk(
        'Loading lookup: $lookupId v$version (conditions: $conditions)',
      );

      // Load lookup data from local directory
      final lookupDir = await DirectoryConstants.getLookupDirectory(lookupId);
      final lookupFile = File('${lookupDir.path}/$version.json');

      if (!await lookupFile.exists()) {
        return Response.notFound(
          jsonEncode({
            'error':
                'Lookup data not found: $lookupId v$version. '
                'Please ensure lookup is downloaded before use.',
          }),
        );
      }

      // Load and parse lookup data
      String? lookupData;
      try {
        lookupData = await lookupFile.readAsString();
      } on FileSystemException catch (e) {
        FormGearLogger.serverError('Failed to read lookup file: $e');
        return Response.internalServerError(
          body: jsonEncode({'error': 'Failed to load local lookup data'}),
          headers: {'Content-Type': 'application/json'},
        );
      }

      return Response.ok(
        jsonEncode(lookupData),
        headers: {'Content-Type': 'application/json'},
      );
    } on Exception catch (e) {
      FormGearLogger.sdkError('Failed to load lookup data: $e');
      return Response.internalServerError(
        body: jsonEncode({'error': 'Failed to load lookup data'}),
        headers: {'Content-Type': 'application/json'},
      );
    }
  }

  /// Gets the base URL of the server
  String? get baseUrl => _baseUrl;

  /// Checks if server is running
  bool get isRunning => _server != null;
}
