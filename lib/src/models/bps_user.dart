import 'package:equatable/equatable.dart';
import 'package:json_annotation/json_annotation.dart';

part 'bps_user.g.dart';

@JsonSerializable()
class BpsUser extends Equatable {
  const BpsUser({
    this.bpsUserId,
    this.eselon2,
    this.eselon3,
    this.jabatan,
    this.kodeJabatan,
    this.kodeOrg,
    this.nipBaru,
    this.nipLama,
    this.org,
    this.passwordBpsUser,
    this.sessionToken,
    this.authToken,
  });

  factory BpsUser.fromJson(Map<String, dynamic> json) =>
      _$BpsUserFromJson(json);

  /// BPS User ID from FASIH system
  @JsonKey(name: 'id')
  final int? bpsUserId;

  /// Echelon 2 organization level
  final String? eselon2;

  /// Echelon 3 organization level
  final String? eselon3;

  /// Job position/title
  final String? jabatan;

  /// Job position code
  final String? kodeJabatan;

  /// Organization code
  final String? kodeOrg;

  /// New employee ID number
  final String? nipBaru;

  /// Old employee ID number
  final String? nipLama;

  /// Organization name
  final String? org;

  /// BPS user password (usually not exposed)
  @JsonKey(name: 'password')
  final String? passwordBpsUser;

  /// Session authentication token from BPS SSO
  final String? sessionToken;

  /// Alternative authentication token for API access
  final String? authToken;

  /// Computed properties for backward compatibility
  String? get id => bpsUserId?.toString();
  String? get name => jabatan;
  String? get username => nipBaru;
  String? get position => jabatan;
  String? get organization => org;

  Map<String, dynamic> toJson() => _$BpsUserToJson(this);

  @override
  List<Object?> get props => [
    bpsUserId,
    eselon2,
    eselon3,
    jabatan,
    kodeJabatan,
    kodeOrg,
    nipBaru,
    nipLama,
    org,
    passwordBpsUser,
    sessionToken,
    authToken,
  ];
}
