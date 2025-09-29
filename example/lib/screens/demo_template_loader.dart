import 'dart:convert';
import 'package:flutter/services.dart';

/// Helper class to load demo template data from assets
class DemoTemplateLoader {
  static const String basePath = 'assets/Template/demo';

  /// Load template JSON from assets
  static Future<Map<String, dynamic>> loadTemplate() async {
    final jsonString = await rootBundle.loadString(
      '$basePath/demo_template.json',
    );
    return json.decode(jsonString);
  }

  /// Load validation JSON from assets
  static Future<Map<String, dynamic>> loadValidation() async {
    final jsonString = await rootBundle.loadString(
      '$basePath/demo_validation.json',
    );
    return json.decode(jsonString);
  }

  /// Load reference JSON from assets
  static Future<Map<String, dynamic>> loadReference() async {
    final jsonString = await rootBundle.loadString(
      '$basePath/demo_reference.json',
    );
    return json.decode(jsonString);
  }

  /// Load response JSON from assets (for existing assignment)
  static Future<Map<String, dynamic>> loadResponse() async {
    final jsonString = await rootBundle.loadString(
      '$basePath/demo_response.json',
    );
    return json.decode(jsonString);
  }

  /// Load media JSON from assets (for existing assignment)
  static Future<Map<String, dynamic>> loadMedia() async {
    try {
      final jsonString = await rootBundle.loadString(
        '$basePath/demo_media.json',
      );
      return json.decode(jsonString);
    } catch (e) {
      // Return empty media if file is too large or missing
      return {
        'details': {'media': <dynamic>[]},
      };
    }
  }

  /// Load preset JSON from assets
  static Future<Map<String, dynamic>> loadPreset() async {
    final jsonString = await rootBundle.loadString(
      '$basePath/demo_preset.json',
    );
    return json.decode(jsonString);
  }

  /// Load remark JSON from assets
  static Future<Map<String, dynamic>> loadRemark() async {
    final jsonString = await rootBundle.loadString(
      '$basePath/demo_remark.json',
    );
    return json.decode(jsonString);
  }

  /// Load all assignment data for existing assignment scenario
  static Future<Map<String, dynamic>> loadAllAssignmentData() async {
    final template = await loadTemplate();
    final validation = await loadValidation();
    final reference = await loadReference();
    final response = await loadResponse();
    final media = await loadMedia();
    final preset = await loadPreset();
    final remark = await loadRemark();

    return {
      'template': template,
      'validation': validation,
      'reference': reference,
      'response': response,
      'media': media,
      'preset': preset,
      'remark': remark,
    };
  }

  /// Load minimal data for new assignment scenario (only template and validation)
  static Future<Map<String, dynamic>> loadNewAssignmentData() async {
    final template = await loadTemplate();
    final validation = await loadValidation();
    final reference = await loadReference();

    return {
      'template': template,
      'validation': validation,
      'reference': reference,
      'response': {'description': '', 'dataKey': '', 'answers': <dynamic>[]},
      'media': {'dataKey': '', 'media': <dynamic>[]},
      'preset': {'description': '', 'dataKey': '', 'predata': <dynamic>[]},
      'remark': {'dataKey': 'default_remark', 'notes': <dynamic>[]},
    };
  }
}
