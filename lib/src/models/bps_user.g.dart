// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'bps_user.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

BpsUser _$BpsUserFromJson(Map<String, dynamic> json) => BpsUser(
  bpsUserId: (json['id'] as num?)?.toInt(),
  eselon2: json['eselon2'] as String?,
  eselon3: json['eselon3'] as String?,
  jabatan: json['jabatan'] as String?,
  kodeJabatan: json['kodeJabatan'] as String?,
  kodeOrg: json['kodeOrg'] as String?,
  nipBaru: json['nipBaru'] as String?,
  nipLama: json['nipLama'] as String?,
  org: json['org'] as String?,
  passwordBpsUser: json['password'] as String?,
  sessionToken: json['sessionToken'] as String?,
  authToken: json['authToken'] as String?,
);

Map<String, dynamic> _$BpsUserToJson(BpsUser instance) => <String, dynamic>{
  'id': instance.bpsUserId,
  'eselon2': instance.eselon2,
  'eselon3': instance.eselon3,
  'jabatan': instance.jabatan,
  'kodeJabatan': instance.kodeJabatan,
  'kodeOrg': instance.kodeOrg,
  'nipBaru': instance.nipBaru,
  'nipLama': instance.nipLama,
  'org': instance.org,
  'password': instance.passwordBpsUser,
  'sessionToken': instance.sessionToken,
  'authToken': instance.authToken,
};
