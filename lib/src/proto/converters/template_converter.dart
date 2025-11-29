import 'package:form_gear_engine_sdk/src/proto/template/component.pb.dart';
import 'package:form_gear_engine_sdk/src/proto/template/component_option.pb.dart';
import 'package:form_gear_engine_sdk/src/proto/template/form_template.pb.dart';
import 'package:form_gear_engine_sdk/src/proto/template/size_constraint.pb.dart';

/// Converts FormGear JSON template to Protobuf format
class TemplateConverter {
  /// Convert JSON map to FormTemplate protobuf
  static FormTemplate fromJson(Map<String, dynamic> json) {
    final template = FormTemplate()
      ..description = json['description'] as String? ?? ''
      ..dataKey = json['dataKey'] as String? ?? ''
      ..title = json['title'] as String? ?? ''
      ..acronym = json['acronym'] as String? ?? ''
      ..version = json['version'] as String? ?? '';

    if (json['components'] != null) {
      final components = json['components'] as List;
      for (final section in components) {
        template.components.add(_convertComponentSection(section as List));
      }
    }

    return template;
  }

  static ComponentSection _convertComponentSection(List<dynamic> components) {
    final section = ComponentSection();
    for (final componentJson in components) {
      section.components.add(
        _convertComponent(componentJson as Map<String, dynamic>),
      );
    }
    return section;
  }

  static Component _convertComponent(Map<String, dynamic> json) {
    final component = Component()
      ..label = json['label'] as String? ?? ''
      ..dataKey = json['dataKey'] as String? ?? ''
      ..description = json['description'] as String? ?? ''
      ..type = json['type'] as int? ?? 0
      ..required = json['required'] as bool? ?? false;

    // Conditional rendering
    if (json['enableCondition'] != null) {
      component.enableCondition = json['enableCondition'] as String;
    }
    if (json['componentEnable'] != null) {
      component.componentEnable.addAll(
        (json['componentEnable'] as List).cast<String>(),
      );
    }

    // Input-specific properties
    if (json['rows'] != null) component.rows = json['rows'] as int;
    if (json['cols'] != null) component.cols = json['cols'] as int;
    if (json['decimalLength'] != null) {
      component.decimalLength = json['decimalLength'] as int;
    }

    // Options
    if (json['options'] != null) {
      for (final optionJson in json['options'] as List) {
        final option = ComponentOption()
          ..label = optionJson['label'] as String? ?? ''
          ..value = optionJson['value'] as String? ?? '';
        component.options.add(option);
      }
    }

    // Size constraints
    if (json['sizeInput'] != null) {
      for (final sizeJson in json['sizeInput'] as List) {
        final size = SizeConstraint()
          ..min = sizeJson['min'] as int? ?? 0
          ..max = sizeJson['max'] as int? ?? 0;
        component.sizeInput.add(size);
      }
    }

    // Nested components
    if (json['components'] != null) {
      final components = json['components'] as List;
      for (final section in components) {
        component.components.add(_convertComponentSection(section as List));
      }
    }

    return component;
  }
}
