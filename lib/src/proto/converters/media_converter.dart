import 'package:fixnum/fixnum.dart';
import 'package:form_gear_engine_sdk/src/proto/media/location.pb.dart';
import 'package:form_gear_engine_sdk/src/proto/media/media_collection.pb.dart';
import 'package:form_gear_engine_sdk/src/proto/media/media_item.pb.dart';
import 'package:form_gear_engine_sdk/src/proto/media/media_type.pb.dart';

/// Converts FormGear JSON media to Protobuf format
class MediaConverter {
  /// Convert JSON map to MediaCollection protobuf
  static MediaCollection fromJson(Map<String, dynamic> json) {
    final collection = MediaCollection()
      ..assignmentId = json['assignmentId'] as String? ?? '';

    if (json['items'] != null) {
      for (final itemJson in json['items'] as List) {
        collection.items.add(
          _convertMediaItem(itemJson as Map<String, dynamic>),
        );
      }
    }

    return collection;
  }

  static MediaItem _convertMediaItem(Map<String, dynamic> json) {
    final item = MediaItem()
      ..mediaId = json['mediaId'] as String? ?? ''
      ..filePath = json['filePath'] as String? ?? '';

    // Type
    final typeStr = json['type'] as String? ?? 'UNKNOWN';
    item.type = _parseMediaType(typeStr);

    // File size
    if (json['fileSize'] != null) {
      item.fileSize = Int64(json['fileSize'] as int);
    }

    // Timestamp
    if (json['timestamp'] != null) {
      item.timestamp = Int64(json['timestamp'] as int);
    }

    // GPS data
    if (json['gpsData'] != null) {
      final gpsJson = json['gpsData'] as Map<String, dynamic>;
      item.gpsData = Location()
        ..latitude = gpsJson['latitude'] as double? ?? 0.0
        ..longitude = gpsJson['longitude'] as double? ?? 0.0
        ..accuracy = gpsJson['accuracy'] as double? ?? 0.0
        ..altitude = gpsJson['altitude'] as double? ?? 0.0;

      if (gpsJson['timestamp'] != null) {
        item.gpsData.timestamp = Int64(gpsJson['timestamp'] as int);
      }
    }

    // Duration for audio/video
    if (json['duration'] != null) {
      item.duration = Int64(json['duration'] as int);
    }

    // Metadata
    if (json['metadata'] != null) {
      final metadata = json['metadata'] as Map<String, dynamic>;
      for (final entry in metadata.entries) {
        item.metadata[entry.key] = entry.value.toString();
      }
    }

    return item;
  }

  static MediaType _parseMediaType(String type) {
    switch (type.toUpperCase()) {
      case 'IMAGE':
        return MediaType.IMAGE;
      case 'AUDIO':
        return MediaType.AUDIO;
      case 'VIDEO':
        return MediaType.VIDEO;
      case 'GPS':
        return MediaType.GPS;
      case 'SIGNATURE':
        return MediaType.SIGNATURE;
      case 'FILE':
        return MediaType.FILE;
      default:
        return MediaType.UNKNOWN;
    }
  }
}
