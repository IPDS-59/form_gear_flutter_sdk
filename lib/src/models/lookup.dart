import 'package:equatable/equatable.dart';
import 'package:json_annotation/json_annotation.dart';

part 'lookup.g.dart';

/// Lookup data model matching FASIH domain structure
@JsonSerializable()
class Lookup extends Equatable {
  const Lookup({
    required this.id,
    this.version,
  });

  factory Lookup.fromJson(Map<String, dynamic> json) => _$LookupFromJson(json);

  final String id;
  final String? version;

  Map<String, dynamic> toJson() => _$LookupToJson(this);

  @override
  List<Object?> get props => [id, version];

  Lookup copyWith({
    String? id,
    String? version,
  }) {
    return Lookup(
      id: id ?? this.id,
      version: version ?? this.version,
    );
  }

  @override
  String toString() => 'Lookup(id: $id, version: $version)';
}
