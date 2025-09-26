import 'package:form_gear_engine_sdk/src/core/base/result.dart';
import 'package:form_gear_engine_sdk/src/models/form_engine_response.dart';

/// Repository interface for form engine operations
abstract class FormEngineRepository {
  /// Check form engine version from FASIH API
  Future<Result<FormEngineResponse>> checkFormEngineVersion([
    String? formEngineId,
  ]);

  /// Check if form engine is downloaded locally
  Future<bool> isFormEngineDownloaded(String engineId);
}
