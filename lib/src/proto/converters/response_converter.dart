import 'package:fixnum/fixnum.dart';
import 'package:form_gear_engine_sdk/src/proto/response/field_response.pb.dart';
import 'package:form_gear_engine_sdk/src/proto/response/form_response.pb.dart';
import 'package:form_gear_engine_sdk/src/proto/response/response_value_type.pb.dart';

/// Converts FormGear JSON response to Protobuf format
class ResponseConverter {
  /// Convert JSON map to FormResponse protobuf
  static FormResponse fromJson(Map<String, dynamic> json) {
    final response = FormResponse()
      ..templateId = json['templateId'] as String? ?? ''
      ..assignmentId = json['assignmentId'] as String? ?? ''
      ..userId = json['userId'] as String? ?? ''
      ..isCompleted = json['isCompleted'] as bool? ?? false;

    if (json['timestamp'] != null) {
      response.timestamp = Int64(json['timestamp'] as int);
    }
    if (json['startTime'] != null) {
      response.startTime = Int64(json['startTime'] as int);
    }
    if (json['endTime'] != null) {
      response.endTime = Int64(json['endTime'] as int);
    }

    // Convert responses map to field responses
    if (json['responses'] != null) {
      final responsesMap = json['responses'] as Map<String, dynamic>;
      for (final entry in responsesMap.entries) {
        response.responses.add(_convertFieldResponse(entry.key, entry.value));
      }
    }

    return response;
  }

  static FieldResponse _convertFieldResponse(String dataKey, dynamic value) {
    final field = FieldResponse()..dataKey = dataKey;

    if (value is String) {
      field.type = ResponseValueType.STRING;
      field.stringValue = value;
    } else if (value is num) {
      field.type = ResponseValueType.NUMBER;
      field.numberValue = value.toDouble();
    } else if (value is bool) {
      field.type = ResponseValueType.BOOLEAN;
      field.booleanValue = value;
    } else if (value is List) {
      field.type = ResponseValueType.ARRAY;
      // For now, store as JSON string
      // TODO: Proper array handling
    } else if (value is Map) {
      field.type = ResponseValueType.OBJECT;
      // For now, store as JSON string
      // TODO: Proper object handling
    }

    return field;
  }
}
