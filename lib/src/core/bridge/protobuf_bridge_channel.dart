import 'dart:convert';
import 'dart:typed_data';

import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:form_gear_engine_sdk/src/proto/response/form_response.pb.dart';
import 'package:form_gear_engine_sdk/src/proto/template/form_template.pb.dart';
import 'package:form_gear_engine_sdk/src/utils/form_gear_logger.dart';

/// WebView bridge channel that uses Protobuf for efficient data transfer
class ProtobufBridgeChannel {
  final InAppWebViewController controller;

  ProtobufBridgeChannel(this.controller);

  /// Send FormTemplate to WebView as base64-encoded protobuf
  Future<void> sendTemplate(FormTemplate template) async {
    final bytes = template.writeToBuffer();
    final base64Data = base64Encode(bytes);

    FormGearLogger.sdk(
      'Sending template via protobuf: ${bytes.length} bytes '
      '(vs ${_estimateJsonSize(template)} JSON bytes)',
    );

    await controller.evaluateJavascript(
      source:
          '''
      (function() {
        const base64 = '$base64Data';
        const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

        // Dispatch event with protobuf data
        window.dispatchEvent(new CustomEvent('formgear:template:protobuf', {
          detail: {
            bytes: bytes,
            size: bytes.length
          }
        }));
      })();
    ''',
    );
  }

  /// Send FormResponse to WebView as base64-encoded protobuf
  Future<void> sendResponse(FormResponse response) async {
    final bytes = response.writeToBuffer();
    final base64Data = base64Encode(bytes);

    FormGearLogger.sdk(
      'Sending response via protobuf: ${bytes.length} bytes',
    );

    await controller.evaluateJavascript(
      source:
          '''
      (function() {
        const base64 = '$base64Data';
        const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

        window.dispatchEvent(new CustomEvent('formgear:response:protobuf', {
          detail: {
            bytes: bytes,
            size: bytes.length
          }
        }));
      })();
    ''',
    );
  }

  /// Receive protobuf data from WebView (base64-encoded)
  T receiveProtobuf<T>(String base64Data, T Function(Uint8List) decoder) {
    final bytes = base64Decode(base64Data);
    FormGearLogger.sdk('Received protobuf: ${bytes.length} bytes');
    return decoder(bytes);
  }

  /// Compare: Send as JSON for comparison
  Future<void> sendTemplateAsJson(Map<String, dynamic> template) async {
    final jsonString = jsonEncode(template);

    FormGearLogger.sdk(
      'Sending template via JSON: ${jsonString.length} bytes',
    );

    await controller.evaluateJavascript(
      source:
          '''
      (function() {
        const data = $jsonString;

        window.dispatchEvent(new CustomEvent('formgear:template:json', {
          detail: {
            data: data,
            size: JSON.stringify(data).length
          }
        }));
      })();
    ''',
    );
  }

  int _estimateJsonSize(FormTemplate template) {
    // Rough estimate - actual JSON would be larger
    return template.title.length +
        template.description.length +
        (template.components.length * 100);
  }
}
