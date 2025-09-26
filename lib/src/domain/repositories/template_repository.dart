import 'package:form_gear_engine_sdk/src/core/base/result.dart';
import 'package:form_gear_engine_sdk/src/models/custom_data_template.dart';
import 'package:form_gear_engine_sdk/src/models/list_lookup_notif_response.dart';

/// Repository interface for template-related operations
abstract class TemplateRepository {
  /// Get custom template data by template ID and version
  Future<Result<CustomDataTemplate>> getCustomTemplateData(
    String templateId,
    String templateVersion,
  );

  /// Get lookup data by survey ID
  Future<Result<ListLookupNotifResponse>> getLookupData(String surveyId);

  /// Check if template data is available offline
  Future<bool> isTemplateDataAvailable(String templateId);

  /// Cache template data for offline use
  Future<Result<void>> cacheTemplateData(
    String templateId,
    CustomDataTemplate templateData,
  );
}
