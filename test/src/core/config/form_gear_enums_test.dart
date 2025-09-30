import 'package:flutter_test/flutter_test.dart';
import 'package:form_gear_engine_sdk/src/core/config/form_gear_client_mode.dart';
import 'package:form_gear_engine_sdk/src/core/config/form_gear_form_mode.dart';
import 'package:form_gear_engine_sdk/src/core/config/form_gear_initial_mode.dart';
import 'package:form_gear_engine_sdk/src/core/config/form_gear_lookup_mode.dart';

void main() {
  group('FormGearClientMode Tests', () {
    test('should have correct enum values', () {
      expect(FormGearClientMode.values.length, equals(3));
      expect(FormGearClientMode.cawi.value, equals(1));
      expect(FormGearClientMode.capi.value, equals(2));
      expect(FormGearClientMode.test.value, equals(3));
    });

    test('should have correct enum names', () {
      expect(FormGearClientMode.cawi.name, equals('cawi'));
      expect(FormGearClientMode.capi.name, equals('capi'));
      expect(FormGearClientMode.test.name, equals('test'));
    });

    test('should be usable in switch statements', () {
      String getModeName(FormGearClientMode mode) {
        switch (mode) {
          case FormGearClientMode.cawi:
            return 'CAWI';
          case FormGearClientMode.capi:
            return 'CAPI';
          case FormGearClientMode.test:
            return 'TEST';
        }
      }

      expect(getModeName(FormGearClientMode.cawi), equals('CAWI'));
      expect(getModeName(FormGearClientMode.capi), equals('CAPI'));
      expect(getModeName(FormGearClientMode.test), equals('TEST'));
    });

    test('should iterate through all values', () {
      final values = FormGearClientMode.values;

      expect(values, contains(FormGearClientMode.cawi));
      expect(values, contains(FormGearClientMode.capi));
      expect(values, contains(FormGearClientMode.test));
    });

    test('should have unique values', () {
      final values = FormGearClientMode.values
          .map((mode) => mode.value)
          .toSet();

      expect(values.length, equals(FormGearClientMode.values.length));
    });

    test('should be usable in equality comparisons', () {
      const mode1 = FormGearClientMode.capi;
      const mode2 = FormGearClientMode.capi;
      const mode3 = FormGearClientMode.cawi;

      expect(mode1, equals(mode2));
      expect(mode1, isNot(equals(mode3)));
    });
  });

  group('FormGearFormMode Tests', () {
    test('should have correct enum values', () {
      expect(FormGearFormMode.values.length, equals(5));
      expect(FormGearFormMode.open.value, equals(1));
      expect(FormGearFormMode.rejected.value, equals(2));
      expect(FormGearFormMode.submitted.value, equals(3));
      expect(FormGearFormMode.approved.value, equals(4));
      expect(FormGearFormMode.debug.value, equals(5));
    });

    test('should have correct enum names', () {
      expect(FormGearFormMode.open.name, equals('open'));
      expect(FormGearFormMode.rejected.name, equals('rejected'));
      expect(FormGearFormMode.submitted.name, equals('submitted'));
      expect(FormGearFormMode.approved.name, equals('approved'));
      expect(FormGearFormMode.debug.name, equals('debug'));
    });

    test('should be usable in switch statements', () {
      String getStatusLabel(FormGearFormMode mode) {
        switch (mode) {
          case FormGearFormMode.open:
            return 'Open';
          case FormGearFormMode.rejected:
            return 'Rejected';
          case FormGearFormMode.submitted:
            return 'Submitted';
          case FormGearFormMode.approved:
            return 'Approved';
          case FormGearFormMode.debug:
            return 'Debug';
        }
      }

      expect(getStatusLabel(FormGearFormMode.open), equals('Open'));
      expect(getStatusLabel(FormGearFormMode.rejected), equals('Rejected'));
      expect(getStatusLabel(FormGearFormMode.submitted), equals('Submitted'));
      expect(getStatusLabel(FormGearFormMode.approved), equals('Approved'));
      expect(getStatusLabel(FormGearFormMode.debug), equals('Debug'));
    });

    test('should iterate through all values', () {
      final values = FormGearFormMode.values;

      expect(values, contains(FormGearFormMode.open));
      expect(values, contains(FormGearFormMode.rejected));
      expect(values, contains(FormGearFormMode.submitted));
      expect(values, contains(FormGearFormMode.approved));
      expect(values, contains(FormGearFormMode.debug));
    });

    test('should have unique values', () {
      final values = FormGearFormMode.values.map((mode) => mode.value).toSet();

      expect(values.length, equals(FormGearFormMode.values.length));
    });

    test('should represent form lifecycle states', () {
      // Open -> Submitted -> Approved flow
      expect(
        FormGearFormMode.open.value,
        lessThan(FormGearFormMode.submitted.value),
      );
      expect(
        FormGearFormMode.submitted.value,
        lessThan(FormGearFormMode.approved.value),
      );

      // Rejected is alternative path
      expect(FormGearFormMode.rejected.value, isPositive);
    });
  });

  group('FormGearLookupMode Tests', () {
    test('should have correct enum values', () {
      expect(FormGearLookupMode.values.length, equals(3));
      expect(FormGearLookupMode.online.value, equals(1));
      expect(FormGearLookupMode.offline.value, equals(2));
      expect(FormGearLookupMode.local.value, equals(3));
    });

    test('should have correct enum names', () {
      expect(FormGearLookupMode.online.name, equals('online'));
      expect(FormGearLookupMode.offline.name, equals('offline'));
      expect(FormGearLookupMode.local.name, equals('local'));
    });

    test('should be usable in switch statements', () {
      String getDescription(FormGearLookupMode mode) {
        switch (mode) {
          case FormGearLookupMode.online:
            return 'Fetch from API';
          case FormGearLookupMode.offline:
            return 'Use cached data';
          case FormGearLookupMode.local:
            return 'Use bundled assets';
        }
      }

      expect(
        getDescription(FormGearLookupMode.online),
        equals('Fetch from API'),
      );
      expect(
        getDescription(FormGearLookupMode.offline),
        equals('Use cached data'),
      );
      expect(
        getDescription(FormGearLookupMode.local),
        equals('Use bundled assets'),
      );
    });

    test('should iterate through all values', () {
      final values = FormGearLookupMode.values;

      expect(values, contains(FormGearLookupMode.online));
      expect(values, contains(FormGearLookupMode.offline));
      expect(values, contains(FormGearLookupMode.local));
    });

    test('should have unique values', () {
      final values = FormGearLookupMode.values
          .map((mode) => mode.value)
          .toSet();

      expect(values.length, equals(FormGearLookupMode.values.length));
    });

    test('should be usable in equality comparisons', () {
      const mode1 = FormGearLookupMode.offline;
      const mode2 = FormGearLookupMode.offline;
      const mode3 = FormGearLookupMode.online;

      expect(mode1, equals(mode2));
      expect(mode1, isNot(equals(mode3)));
    });
  });

  group('FormGearInitialMode Tests', () {
    test('should have correct enum values', () {
      expect(FormGearInitialMode.values.length, equals(2));
      expect(FormGearInitialMode.initial.value, equals(1));
      expect(FormGearInitialMode.assignment.value, equals(2));
    });

    test('should have correct enum names', () {
      expect(FormGearInitialMode.initial.name, equals('initial'));
      expect(FormGearInitialMode.assignment.name, equals('assignment'));
    });

    test('should be usable in switch statements', () {
      String getDescription(FormGearInitialMode mode) {
        switch (mode) {
          case FormGearInitialMode.initial:
            return 'New form creation';
          case FormGearInitialMode.assignment:
            return 'Assignment based form';
        }
      }

      expect(
        getDescription(FormGearInitialMode.initial),
        equals('New form creation'),
      );
      expect(
        getDescription(FormGearInitialMode.assignment),
        equals('Assignment based form'),
      );
    });

    test('should iterate through all values', () {
      final values = FormGearInitialMode.values;

      expect(values, contains(FormGearInitialMode.initial));
      expect(values, contains(FormGearInitialMode.assignment));
    });

    test('should have unique values', () {
      final values = FormGearInitialMode.values
          .map((mode) => mode.value)
          .toSet();

      expect(values.length, equals(FormGearInitialMode.values.length));
    });
  });

  group('FASIH Integration Scenarios', () {
    test('should use CAPI mode for mobile data collection', () {
      const mode = FormGearClientMode.capi;

      expect(mode.value, equals(2));
      expect(mode.name, equals('capi'));
    });

    test('should use CAWI mode for web-based surveys', () {
      const mode = FormGearClientMode.cawi;

      expect(mode.value, equals(1));
      expect(mode.name, equals('cawi'));
    });

    test('should use offline lookup for field data collection', () {
      const mode = FormGearLookupMode.offline;

      expect(mode.value, equals(2));
      expect(mode.name, equals('offline'));
    });

    test('should use online lookup for real-time validation', () {
      const mode = FormGearLookupMode.online;

      expect(mode.value, equals(1));
      expect(mode.name, equals('online'));
    });

    test('should track form lifecycle with form modes', () {
      // Typical FASIH workflow
      const initialState = FormGearFormMode.open;
      const submittedState = FormGearFormMode.submitted;
      const finalState = FormGearFormMode.approved;

      expect(initialState.value, lessThan(submittedState.value));
      expect(submittedState.value, lessThan(finalState.value));
    });

    test('should handle rejected forms separately', () {
      const rejectedState = FormGearFormMode.rejected;

      expect(rejectedState.value, equals(2));
      expect(rejectedState, isNot(equals(FormGearFormMode.open)));
      expect(rejectedState, isNot(equals(FormGearFormMode.submitted)));
    });

    test('should support test mode for development', () {
      const clientMode = FormGearClientMode.test;
      const lookupMode = FormGearLookupMode.local;
      const formMode = FormGearFormMode.debug;

      expect(clientMode.value, equals(3));
      expect(lookupMode.value, equals(3));
      expect(formMode.value, equals(5));
    });
  });

  group('Enum Value Mapping', () {
    test('should map client mode values correctly', () {
      final modesByValue = <int, FormGearClientMode>{
        for (final mode in FormGearClientMode.values) mode.value: mode,
      };

      expect(modesByValue[1], equals(FormGearClientMode.cawi));
      expect(modesByValue[2], equals(FormGearClientMode.capi));
      expect(modesByValue[3], equals(FormGearClientMode.test));
    });

    test('should map form mode values correctly', () {
      final modesByValue = <int, FormGearFormMode>{
        for (final mode in FormGearFormMode.values) mode.value: mode,
      };

      expect(modesByValue[1], equals(FormGearFormMode.open));
      expect(modesByValue[2], equals(FormGearFormMode.rejected));
      expect(modesByValue[3], equals(FormGearFormMode.submitted));
      expect(modesByValue[4], equals(FormGearFormMode.approved));
      expect(modesByValue[5], equals(FormGearFormMode.debug));
    });

    test('should map lookup mode values correctly', () {
      final modesByValue = <int, FormGearLookupMode>{
        for (final mode in FormGearLookupMode.values) mode.value: mode,
      };

      expect(modesByValue[1], equals(FormGearLookupMode.online));
      expect(modesByValue[2], equals(FormGearLookupMode.offline));
      expect(modesByValue[3], equals(FormGearLookupMode.local));
    });
  });
}
