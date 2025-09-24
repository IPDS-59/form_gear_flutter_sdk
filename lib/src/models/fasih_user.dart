import 'package:equatable/equatable.dart';
import 'package:json_annotation/json_annotation.dart';

part 'fasih_user.g.dart';

@JsonSerializable()
class FasihUser extends Equatable {
  const FasihUser({
    required this.id,
    required this.name,

    required this.username,
    required this.position,
    required this.organization,
    this.photo,
  });

  factory FasihUser.fromJson(Map<String, dynamic> json) =>
      _$FasihUserFromJson(json);
  final String id;
  final String name;

  final String? photo;
  final String username;
  final String position;
  final String organization;

  Map<String, dynamic> toJson() => _$FasihUserToJson(this);

  @override
  List<Object?> get props => [
    id,
    name,
    photo,
    username,
    position,
    organization,
  ];
}
