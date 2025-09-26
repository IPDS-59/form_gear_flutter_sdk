import 'package:equatable/equatable.dart';

/// Interface for JSON serializable objects (following web_view pattern)
abstract class JsonCodable extends Equatable {
  Map<String, dynamic> toJson();
}

/// Base abstract class for JavaScript handlers (following web_view pattern)
abstract class JSHandler<T extends JsonCodable> {
  /// The unique handler name for this JS bridge method
  String get handlerName;

  /// Handle the JavaScript call and return typed response
  Future<T> callback(List<dynamic> arguments);
}

/// Typedef for handler callback function
typedef JSHandlerCallbackAlias =
    Future<JsonCodable> Function(
      List<dynamic> arguments,
    );
