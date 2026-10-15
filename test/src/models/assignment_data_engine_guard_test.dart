import 'package:flutter_test/flutter_test.dart';
import 'package:form_gear_engine_sdk/form_gear_engine_sdk.dart';

AssignmentData _data({
  Map<String, dynamic> template = const {},
  Map<String, dynamic> validation = const {},
}) =>
    AssignmentData.empty().copyWith(template: template, validation: validation);

void main() {
  group('AssignmentData.hasRenderableTemplate', () {
    test('false for missing, empty or wrong-shaped components', () {
      expect(_data().hasRenderableTemplate, isFalse);
      expect(
        _data(template: {'components': <dynamic>[]}).hasRenderableTemplate,
        isFalse,
      );
      expect(
        _data(
          template: {
            'components': [<dynamic>[]],
          },
        ).hasRenderableTemplate,
        isFalse,
      );
      // FasihDataHandler's old default shape.
      expect(
        _data(
          template: {
            'template': {'fields': <dynamic>[]},
          },
        ).hasRenderableTemplate,
        isFalse,
      );
    });

    test('true for nested and flat component lists', () {
      expect(
        _data(
          template: {
            'components': [
              [
                {'dataKey': 'a'},
              ],
            ],
          },
        ).hasRenderableTemplate,
        isTrue,
      );
      expect(
        _data(
          template: {
            'components': [
              {'dataKey': 'a'},
            ],
          },
        ).hasRenderableTemplate,
        isTrue,
      );
    });
  });

  group('AssignmentData.normalizedForEngine', () {
    test('adds testFunctions to empty or fallback-shaped validation', () {
      expect(_data().normalizedForEngine().validation, {
        'testFunctions': <dynamic>[],
      });
      expect(
        _data(
          validation: {
            'validation': {'rules': <dynamic>[]},
          },
        ).normalizedForEngine().validation['testFunctions'],
        isEmpty,
      );
    });

    test('keeps valid validation untouched', () {
      final data = _data(
        validation: {
          'testFunctions': [
            {'dataKey': 'a'},
          ],
        },
      );
      expect(identical(data.normalizedForEngine(), data), isTrue);
    });
  });
}
