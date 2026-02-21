import 'package:form_gear_engine_sdk/src/core/js_bridge/js_handler_base.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/models/response_models.dart';
import 'package:form_gear_engine_sdk/src/utils/form_gear_logger.dart';

/// Handler for offline lookup searches
/// This handler is called by FormGear JavaScript when performing
/// offline lookup queries
class OfflineSearchHandler extends JSHandler<ListInfoJs> {
  OfflineSearchHandler({
    this.onSearchOffline,
  });

  /// Callback to perform the actual offline search
  /// Takes lookupId, version, and conditions as parameters
  /// Returns a list of matching lookup data
  final Future<List<dynamic>> Function(
    String lookupId,
    String version,
    List<dynamic> conditions,
  )?
  onSearchOffline;

  @override
  String get handlerName => 'searchOffline';

  @override
  Future<ListInfoJs> callback(List<dynamic> arguments) async {
    try {
      // Parse arguments - can be either positional or named
      String lookupId;
      String version;
      List<dynamic> conditions;

      if (arguments.length == 1 && arguments[0] is Map) {
        // Named arguments: { lookupId, version, conditions }
        final args = arguments[0] as Map<String, dynamic>;
        lookupId = args['lookupId']?.toString() ?? '';
        version = args['version']?.toString() ?? '';
        final rawConditions = args['conditions'];
        if (rawConditions is List) {
          conditions = rawConditions;
        } else {
          // String or other types default to empty list
          conditions = <dynamic>[];
        }
      } else if (arguments.length >= 3) {
        // Positional arguments: lookupId, version, conditions
        lookupId = arguments[0]?.toString() ?? '';
        version = arguments[1]?.toString() ?? '';
        final rawConditions = arguments[2];
        if (rawConditions is List) {
          conditions = rawConditions;
        } else {
          conditions = <dynamic>[];
        }
      } else {
        FormGearLogger.webviewError(
          'Invalid arguments for searchOffline: $arguments',
        );
        return ListInfoJs(
          success: false,
          error: 'Invalid arguments',
        );
      }

      FormGearLogger.webview(
        'Offline search: lookupId=$lookupId, version=$version, '
        'conditions=${conditions.length} items',
      );

      if (onSearchOffline != null) {
        final results = await onSearchOffline!(lookupId, version, conditions);
        FormGearLogger.webview(
          'Offline search returned ${results.length} results',
        );
        return ListInfoJs(success: true, data: results);
      }

      // Default: return empty results if no callback provided
      FormGearLogger.webview(
        'No offline search callback provided, returning empty',
      );
      return ListInfoJs(success: true, data: const <dynamic>[]);
    } on Exception catch (e, stackTrace) {
      FormGearLogger.webviewError('Offline search error: $e\n$stackTrace');
      return ListInfoJs(
        success: false,
        error: 'Offline search failed: $e',
      );
    }
  }
}
