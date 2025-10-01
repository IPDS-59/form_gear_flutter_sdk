import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:form_gear_engine_sdk/src/models/file_upload_data.dart';

void main() {
  group('FileUploadData Tests', () {
    late File testFile;

    setUp(() {
      testFile = File('/path/to/test/file.jpg');
    });

    group('Construction', () {
      test('should create FileUploadData with all required parameters', () {
        final data = FileUploadData(
          assignmentId: 'assignment_001',
          templateId: 'template_001',
          dataKey: 'photo_field',
          file: testFile,
          fileName: 'test_photo.jpg',
          fileUri: 'file:///path/to/test/file.jpg',
        );

        expect(data.assignmentId, equals('assignment_001'));
        expect(data.templateId, equals('template_001'));
        expect(data.dataKey, equals('photo_field'));
        expect(data.file, equals(testFile));
        expect(data.fileName, equals('test_photo.jpg'));
        expect(data.fileUri, equals('file:///path/to/test/file.jpg'));
        expect(data.metadata, isNull);
      });

      test('should create FileUploadData with metadata', () {
        final metadata = {
          'mimeType': 'image/jpeg',
          'size': 1024,
          'timestamp': '2024-01-01T10:00:00Z',
        };

        final data = FileUploadData(
          assignmentId: 'assignment_001',
          templateId: 'template_001',
          dataKey: 'photo_field',
          file: testFile,
          fileName: 'test_photo.jpg',
          fileUri: 'file:///path/to/test/file.jpg',
          metadata: metadata,
        );

        expect(data.metadata, equals(metadata));
        expect(data.metadata!['mimeType'], equals('image/jpeg'));
        expect(data.metadata!['size'], equals(1024));
      });
    });

    group('Equality', () {
      test('should be equal when all properties match', () {
        final data1 = FileUploadData(
          assignmentId: 'assignment_001',
          templateId: 'template_001',
          dataKey: 'photo_field',
          file: testFile,
          fileName: 'test_photo.jpg',
          fileUri: 'file:///path/to/test/file.jpg',
        );

        final data2 = FileUploadData(
          assignmentId: 'assignment_001',
          templateId: 'template_001',
          dataKey: 'photo_field',
          file: testFile,
          fileName: 'test_photo.jpg',
          fileUri: 'file:///path/to/test/file.jpg',
        );

        expect(data1, equals(data2));
        expect(data1.hashCode, equals(data2.hashCode));
      });

      test('should not be equal when assignmentId differs', () {
        final data1 = FileUploadData(
          assignmentId: 'assignment_001',
          templateId: 'template_001',
          dataKey: 'photo_field',
          file: testFile,
          fileName: 'test_photo.jpg',
          fileUri: 'file:///path/to/test/file.jpg',
        );

        final data2 = FileUploadData(
          assignmentId: 'assignment_002',
          templateId: 'template_001',
          dataKey: 'photo_field',
          file: testFile,
          fileName: 'test_photo.jpg',
          fileUri: 'file:///path/to/test/file.jpg',
        );

        expect(data1, isNot(equals(data2)));
      });

      test('should not be equal when metadata differs', () {
        final data1 = FileUploadData(
          assignmentId: 'assignment_001',
          templateId: 'template_001',
          dataKey: 'photo_field',
          file: testFile,
          fileName: 'test_photo.jpg',
          fileUri: 'file:///path/to/test/file.jpg',
          metadata: const {'key': 'value1'},
        );

        final data2 = FileUploadData(
          assignmentId: 'assignment_001',
          templateId: 'template_001',
          dataKey: 'photo_field',
          file: testFile,
          fileName: 'test_photo.jpg',
          fileUri: 'file:///path/to/test/file.jpg',
          metadata: const {'key': 'value2'},
        );

        expect(data1, isNot(equals(data2)));
      });
    });

    group('copyWith', () {
      test('should create copy with modified assignmentId', () {
        final original = FileUploadData(
          assignmentId: 'assignment_001',
          templateId: 'template_001',
          dataKey: 'photo_field',
          file: testFile,
          fileName: 'test_photo.jpg',
          fileUri: 'file:///path/to/test/file.jpg',
        );

        final copied = original.copyWith(assignmentId: 'assignment_002');

        expect(copied.assignmentId, equals('assignment_002'));
        expect(copied.templateId, equals(original.templateId));
        expect(copied.dataKey, equals(original.dataKey));
      });

      test('should create copy with modified metadata', () {
        final original = FileUploadData(
          assignmentId: 'assignment_001',
          templateId: 'template_001',
          dataKey: 'photo_field',
          file: testFile,
          fileName: 'test_photo.jpg',
          fileUri: 'file:///path/to/test/file.jpg',
        );

        final newMetadata = {'mimeType': 'image/png'};
        final copied = original.copyWith(metadata: newMetadata);

        expect(copied.metadata, equals(newMetadata));
        expect(copied.assignmentId, equals(original.assignmentId));
      });

      test('should keep original values when not specified', () {
        final original = FileUploadData(
          assignmentId: 'assignment_001',
          templateId: 'template_001',
          dataKey: 'photo_field',
          file: testFile,
          fileName: 'test_photo.jpg',
          fileUri: 'file:///path/to/test/file.jpg',
          metadata: const {'key': 'value'},
        );

        final copied = original.copyWith();

        expect(copied, equals(original));
      });
    });

    group('toString', () {
      test('should have formatted string representation', () {
        final data = FileUploadData(
          assignmentId: 'assignment_001',
          templateId: 'template_001',
          dataKey: 'photo_field',
          file: testFile,
          fileName: 'test_photo.jpg',
          fileUri: 'file:///path/to/test/file.jpg',
        );

        final string = data.toString();

        expect(string, contains('FileUploadData'));
        expect(string, contains('assignment_001'));
        expect(string, contains('template_001'));
        expect(string, contains('photo_field'));
        expect(string, contains('test_photo.jpg'));
      });
    });

    group('Props', () {
      test('should include all properties in props list', () {
        final metadata = {'key': 'value'};
        final data = FileUploadData(
          assignmentId: 'assignment_001',
          templateId: 'template_001',
          dataKey: 'photo_field',
          file: testFile,
          fileName: 'test_photo.jpg',
          fileUri: 'file:///path/to/test/file.jpg',
          metadata: metadata,
        );

        final props = data.props;

        expect(props.length, equals(7));
        expect(props[0], equals('assignment_001'));
        expect(props[1], equals('template_001'));
        expect(props[2], equals('photo_field'));
        expect(props[3], equals(testFile));
        expect(props[4], equals('test_photo.jpg'));
        expect(props[5], equals('file:///path/to/test/file.jpg'));
        expect(props[6], equals(metadata));
      });
    });

    group('Use Cases', () {
      test('should handle camera photo upload data', () {
        final data = FileUploadData(
          assignmentId: 'survey_2024_001',
          templateId: 'family_survey',
          dataKey: 'household_photo',
          file: File('/storage/media/photo_123.jpg'),
          fileName: 'photo_123.jpg',
          fileUri: 'file:///storage/media/photo_123.jpg',
          metadata: const {
            'mimeType': 'image/jpeg',
            'source': 'camera',
            'timestamp': '2024-01-01T10:30:00Z',
            'gpsCoordinates': '-6.2088,106.8456',
          },
        );

        expect(data.assignmentId, equals('survey_2024_001'));
        expect(data.metadata!['source'], equals('camera'));
        expect(data.metadata!['gpsCoordinates'], isNotNull);
      });

      test('should handle document upload data', () {
        final data = FileUploadData(
          assignmentId: 'survey_2024_002',
          templateId: 'business_survey',
          dataKey: 'business_license',
          file: File('/storage/documents/license.pdf'),
          fileName: 'business_license.pdf',
          fileUri: 'file:///storage/documents/license.pdf',
          metadata: const {
            'mimeType': 'application/pdf',
            'source': 'file_picker',
            'fileSize': 2048576,
          },
        );

        expect(data.dataKey, equals('business_license'));
        expect(data.fileName, endsWith('.pdf'));
        expect(data.metadata!['fileSize'], equals(2048576));
      });

      test('should handle audio recording upload data', () {
        final data = FileUploadData(
          assignmentId: 'survey_2024_003',
          templateId: 'interview_survey',
          dataKey: 'interview_audio',
          file: File('/storage/audio/interview_001.m4a'),
          fileName: 'interview_001.m4a',
          fileUri: 'file:///storage/audio/interview_001.m4a',
          metadata: const {
            'mimeType': 'audio/mp4',
            'source': 'audio_recorder',
            'duration': 1800,
          },
        );

        expect(data.dataKey, equals('interview_audio'));
        expect(data.metadata!['duration'], equals(1800));
      });
    });
  });
}
