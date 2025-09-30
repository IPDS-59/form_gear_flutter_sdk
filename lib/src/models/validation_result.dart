import 'package:equatable/equatable.dart';

/// Validation result for data validation operations
class ValidationResult extends Equatable {
  const ValidationResult({required this.isValid, this.error});

  final bool isValid;
  final String? error;

  @override
  List<Object?> get props => [isValid, error];
}
