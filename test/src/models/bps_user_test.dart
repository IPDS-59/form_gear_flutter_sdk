import 'package:flutter_test/flutter_test.dart';
import 'package:form_gear_engine_sdk/src/models/bps_user.dart';

void main() {
  group('BpsUser Tests', () {
    group('Construction', () {
      test('should create BpsUser with all parameters', () {
        const user = BpsUser(
          bpsUserId: 12345,
          eselon2: 'ESE2001',
          eselon3: 'ESE3001',
          jabatan: 'ENUMERATOR',
          kodeJabatan: 'JBT001',
          kodeOrg: 'ORG001',
          nipBaru: '123456789',
          nipLama: '987654321',
          org: 'BPS Jawa Barat',
          passwordBpsUser: 'secret',
          sessionToken: 'session-token',
          authToken: 'auth-token',
        );

        expect(user.bpsUserId, equals(12345));
        expect(user.eselon2, equals('ESE2001'));
        expect(user.eselon3, equals('ESE3001'));
        expect(user.jabatan, equals('ENUMERATOR'));
        expect(user.kodeJabatan, equals('JBT001'));
        expect(user.kodeOrg, equals('ORG001'));
        expect(user.nipBaru, equals('123456789'));
        expect(user.nipLama, equals('987654321'));
        expect(user.org, equals('BPS Jawa Barat'));
        expect(user.passwordBpsUser, equals('secret'));
        expect(user.sessionToken, equals('session-token'));
        expect(user.authToken, equals('auth-token'));
      });

      test('should create BpsUser with default null values', () {
        const user = BpsUser();

        expect(user.bpsUserId, isNull);
        expect(user.eselon2, isNull);
        expect(user.eselon3, isNull);
        expect(user.jabatan, isNull);
        expect(user.kodeJabatan, isNull);
        expect(user.kodeOrg, isNull);
        expect(user.nipBaru, isNull);
        expect(user.nipLama, isNull);
        expect(user.org, isNull);
        expect(user.passwordBpsUser, isNull);
        expect(user.sessionToken, isNull);
        expect(user.authToken, isNull);
      });
    });

    group('Computed Properties', () {
      test('should compute id from bpsUserId', () {
        const user = BpsUser(bpsUserId: 12345);

        expect(user.id, equals('12345'));
      });

      test('should return null for id when bpsUserId is null', () {
        const user = BpsUser();

        expect(user.id, isNull);
      });

      test('should compute name from jabatan', () {
        const user = BpsUser(jabatan: 'ENUMERATOR');

        expect(user.name, equals('ENUMERATOR'));
      });

      test('should return null for name when jabatan is null', () {
        const user = BpsUser();

        expect(user.name, isNull);
      });

      test('should compute username from nipBaru', () {
        const user = BpsUser(nipBaru: '123456789');

        expect(user.username, equals('123456789'));
      });

      test('should return null for username when nipBaru is null', () {
        const user = BpsUser();

        expect(user.username, isNull);
      });

      test('should compute position from jabatan', () {
        const user = BpsUser(jabatan: 'SUPERVISOR');

        expect(user.position, equals('SUPERVISOR'));
      });

      test('should return null for position when jabatan is null', () {
        const user = BpsUser();

        expect(user.position, isNull);
      });

      test('should compute organization from org', () {
        const user = BpsUser(org: 'BPS Jawa Barat');

        expect(user.organization, equals('BPS Jawa Barat'));
      });

      test('should return null for organization when org is null', () {
        const user = BpsUser();

        expect(user.organization, isNull);
      });
    });

    group('Equality', () {
      test('should be equal when all properties match', () {
        const user1 = BpsUser(
          bpsUserId: 12345,
          nipBaru: '123456789',
          jabatan: 'ENUMERATOR',
        );
        const user2 = BpsUser(
          bpsUserId: 12345,
          nipBaru: '123456789',
          jabatan: 'ENUMERATOR',
        );

        expect(user1, equals(user2));
      });

      test('should not be equal when bpsUserId differs', () {
        const user1 = BpsUser(
          bpsUserId: 12345,
          nipBaru: '123456789',
        );
        const user2 = BpsUser(
          bpsUserId: 54321,
          nipBaru: '123456789',
        );

        expect(user1, isNot(equals(user2)));
      });

      test('should not be equal when nipBaru differs', () {
        const user1 = BpsUser(
          bpsUserId: 12345,
          nipBaru: '123456789',
        );
        const user2 = BpsUser(
          bpsUserId: 12345,
          nipBaru: '987654321',
        );

        expect(user1, isNot(equals(user2)));
      });

      test('should not be equal when jabatan differs', () {
        const user1 = BpsUser(
          bpsUserId: 12345,
          jabatan: 'ENUMERATOR',
        );
        const user2 = BpsUser(
          bpsUserId: 12345,
          jabatan: 'SUPERVISOR',
        );

        expect(user1, isNot(equals(user2)));
      });
    });

    group('JSON Serialization', () {
      test('should serialize to JSON with all fields', () {
        const user = BpsUser(
          bpsUserId: 12345,
          eselon2: 'ESE2001',
          jabatan: 'ENUMERATOR',
          nipBaru: '123456789',
          org: 'BPS Jawa Barat',
          sessionToken: 'token',
        );

        final json = user.toJson();

        expect(json['id'], equals(12345));
        expect(json['eselon2'], equals('ESE2001'));
        expect(json['jabatan'], equals('ENUMERATOR'));
        expect(json['nipBaru'], equals('123456789'));
        expect(json['org'], equals('BPS Jawa Barat'));
        expect(json['sessionToken'], equals('token'));
      });

      test('should serialize to JSON with null values', () {
        const user = BpsUser();

        final json = user.toJson();

        expect(json['id'], isNull);
        expect(json['eselon2'], isNull);
        expect(json['jabatan'], isNull);
        expect(json['nipBaru'], isNull);
      });

      test('should deserialize from JSON', () {
        final json = <String, dynamic>{
          'id': 12345,
          'eselon2': 'ESE2001',
          'eselon3': 'ESE3001',
          'jabatan': 'ENUMERATOR',
          'kodeJabatan': 'JBT001',
          'kodeOrg': 'ORG001',
          'nipBaru': '123456789',
          'nipLama': '987654321',
          'org': 'BPS Jawa Barat',
          'password': 'secret',
          'sessionToken': 'session-token',
          'authToken': 'auth-token',
        };

        final user = BpsUser.fromJson(json);

        expect(user.bpsUserId, equals(12345));
        expect(user.eselon2, equals('ESE2001'));
        expect(user.eselon3, equals('ESE3001'));
        expect(user.jabatan, equals('ENUMERATOR'));
        expect(user.kodeJabatan, equals('JBT001'));
        expect(user.kodeOrg, equals('ORG001'));
        expect(user.nipBaru, equals('123456789'));
        expect(user.nipLama, equals('987654321'));
        expect(user.org, equals('BPS Jawa Barat'));
        expect(user.passwordBpsUser, equals('secret'));
        expect(user.sessionToken, equals('session-token'));
        expect(user.authToken, equals('auth-token'));
      });

      test('should handle JSON field name mapping for id', () {
        final json = <String, dynamic>{
          'id': 12345,
        };

        final user = BpsUser.fromJson(json);

        expect(user.bpsUserId, equals(12345));
        expect(user.id, equals('12345'));
      });

      test('should handle JSON field name mapping for password', () {
        final json = <String, dynamic>{
          'password': 'secret',
        };

        final user = BpsUser.fromJson(json);

        expect(user.passwordBpsUser, equals('secret'));
      });
    });

    group('FASIH Integration Scenarios', () {
      test('should represent enumerator user', () {
        const user = BpsUser(
          bpsUserId: 1001,
          nipBaru: '199012345678',
          jabatan: 'ENUMERATOR',
          org: 'BPS Provinsi Jawa Barat',
          kodeOrg: '3200',
          sessionToken: 'enum-session-token',
        );

        expect(user.position, equals('ENUMERATOR'));
        expect(user.organization, equals('BPS Provinsi Jawa Barat'));
        expect(user.username, equals('199012345678'));
      });

      test('should represent supervisor user', () {
        const user = BpsUser(
          bpsUserId: 2001,
          nipBaru: '198512345678',
          jabatan: 'SUPERVISOR',
          org: 'BPS Provinsi DKI Jakarta',
          kodeOrg: '3100',
          sessionToken: 'super-session-token',
        );

        expect(user.position, equals('SUPERVISOR'));
        expect(user.organization, equals('BPS Provinsi DKI Jakarta'));
        expect(user.username, equals('198512345678'));
      });

      test('should handle both sessionToken and authToken', () {
        const user = BpsUser(
          bpsUserId: 3001,
          nipBaru: '199512345678',
          sessionToken: 'session-from-sso',
          authToken: 'bearer-token-from-api',
        );

        expect(user.sessionToken, equals('session-from-sso'));
        expect(user.authToken, equals('bearer-token-from-api'));
      });
    });
  });
}
