// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'fasih_user.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FasihUser _$FasihUserFromJson(Map<String, dynamic> json) => FasihUser(
  id: json['id'] as String,
  name: json['name'] as String,
  username: json['username'] as String,
  position: json['position'] as String,
  organization: json['organization'] as String,
  photo: json['photo'] as String?,
);

Map<String, dynamic> _$FasihUserToJson(FasihUser instance) => <String, dynamic>{
  'id': instance.id,
  'name': instance.name,
  'photo': instance.photo,
  'username': instance.username,
  'position': instance.position,
  'organization': instance.organization,
};
