import 'package:form_gear_engine_sdk/src/core/base/result.dart';
import 'package:form_gear_engine_sdk/src/models/assignment.dart';

/// Repository interface for FormGear data operations
/// Provides abstraction for data loading, saving, and management
/// following FASIH data patterns
abstract class FormDataRepository {
  /// Load template JSON for the given template ID
  Future<Result<String>> getTemplate(String templateId);

  /// Load validation rules JSON for the given template ID
  Future<Result<String>> getValidation(String templateId);

  /// Load previous response data for the given assignment ID
  Future<Result<String>> getResponse(String assignmentId);

  /// Load preset/pre-defined data for the given assignment ID
  Future<Result<String>> getPreset(String assignmentId);

  /// Load media file references for the given assignment ID
  Future<Result<String>> getMedia(String assignmentId);

  /// Load remarks/comments for the given assignment ID
  Future<Result<String>> getRemark(String assignmentId);

  /// Load reference/lookup data for the given assignment ID
  Future<Result<String>> getReference(String assignmentId);

  /// Get current user name
  Future<Result<String>> getUserName();

  /// Get current user role
  Future<Result<String>> getUserRole();

  /// Get form mode (open, closed, review, etc.)
  Future<Result<String>> getFormMode();

  /// Get whether this is a new form
  Future<Result<String>> getIsNew();

  /// Get principal collection data
  Future<Result<String>> getPrincipalCollection();

  /// Get user role for petugas (field staff)
  Future<Result<String>> getRolePetugas();

  /// Save form response data
  Future<Result<bool>> saveOrSubmit({
    required String assignmentId,
    required String data,
    required String remark,
    required String principal,
    required String reference,
    required String media,
    required String flag,
  });

  /// Save FASIH form data (simplified version)
  Future<Result<bool>> saveOrSubmitFasihForm({
    required String assignmentId,
    required String data,
    required String remark,
    required String principal,
    required String flag,
  });

  /// Get assignment by ID
  Future<Result<Assignment>> getAssignment(String assignmentId);

  /// Update assignment
  Future<Result<bool>> updateAssignment(Assignment assignment);
}
