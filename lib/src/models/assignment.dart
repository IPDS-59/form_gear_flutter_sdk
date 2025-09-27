import 'package:equatable/equatable.dart';
import 'package:json_annotation/json_annotation.dart';

part 'assignment.g.dart';

/// Assignment entity representing a FormGear survey assignment
/// Follows FASIH data structure patterns for survey data collection
@JsonSerializable()
class Assignment extends Equatable {
  const Assignment({
    required this.id,
    required this.surveyId,
    required this.periodeId,
    required this.templateId,
    required this.currentUserId,
    this.preDefinedData,
    this.isEncrypt = false,
    this.offlineSend = false,
    this.latitude,
    this.longitude,
    this.accuracy,
    this.assignmentStatusId,
    this.isDone,
    this.createdAt,
    this.updatedAt,
  });

  factory Assignment.fromJson(Map<String, dynamic> json) =>
      _$AssignmentFromJson(json);

  /// Unique identifier for the assignment
  final String id;

  /// Survey identifier this assignment belongs to
  final String surveyId;

  /// Period identifier for the survey
  final String periodeId;

  /// Template identifier used for form structure
  final String templateId;

  /// Current user ID assigned to this survey
  final String currentUserId;

  /// Pre-defined form data (JSON string)
  final String? preDefinedData;

  /// Whether the assignment data should be encrypted
  final bool isEncrypt;

  /// Whether the assignment is in offline send queue
  final bool offlineSend;

  /// GPS latitude coordinate
  final double? latitude;

  /// GPS longitude coordinate
  final double? longitude;

  /// GPS accuracy in meters
  final double? accuracy;

  /// Assignment status ID (open, pending, submitted, etc.)
  final int? assignmentStatusId;

  /// Whether the assignment is completed
  final bool? isDone;

  /// When the assignment was created
  final DateTime? createdAt;

  /// When the assignment was last updated
  final DateTime? updatedAt;

  /// Directory path for assignment data files (FASIH naming convention)
  String get answerPath => 'BPS/assignments/$id';

  /// Path to data.json file
  String get dataPath => '$answerPath/data.json';

  /// Path to media.json file
  String get mediaPath => '$answerPath/media.json';

  /// Path to principal.json file
  String get principalPath => '$answerPath/principal.json';

  /// Path to remark.json file
  String get remarkPath => '$answerPath/remark.json';

  /// Path to reference.json file
  String get referencePath => '$answerPath/reference.json';

  /// Directory path for media files
  String get mediaDirectory => '$answerPath/media/';

  Map<String, dynamic> toJson() => _$AssignmentToJson(this);

  Assignment copyWith({
    String? id,
    String? surveyId,
    String? periodeId,
    String? templateId,
    String? currentUserId,
    String? preDefinedData,
    bool? isEncrypt,
    bool? offlineSend,
    double? latitude,
    double? longitude,
    double? accuracy,
    int? assignmentStatusId,
    bool? isDone,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Assignment(
      id: id ?? this.id,
      surveyId: surveyId ?? this.surveyId,
      periodeId: periodeId ?? this.periodeId,
      templateId: templateId ?? this.templateId,
      currentUserId: currentUserId ?? this.currentUserId,
      preDefinedData: preDefinedData ?? this.preDefinedData,
      isEncrypt: isEncrypt ?? this.isEncrypt,
      offlineSend: offlineSend ?? this.offlineSend,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      accuracy: accuracy ?? this.accuracy,
      assignmentStatusId: assignmentStatusId ?? this.assignmentStatusId,
      isDone: isDone ?? this.isDone,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  @override
  List<Object?> get props => [
    id,
    surveyId,
    periodeId,
    templateId,
    currentUserId,
    preDefinedData,
    isEncrypt,
    offlineSend,
    latitude,
    longitude,
    accuracy,
    assignmentStatusId,
    isDone,
    createdAt,
    updatedAt,
  ];
}
