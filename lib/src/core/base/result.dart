import 'package:equatable/equatable.dart';
import 'package:flutter/foundation.dart';

/// A generic result type that represents either success or failure
sealed class Result<T> extends Equatable {
  const Result();
}

/// Represents a successful result with data
@immutable
final class Success<T> extends Result<T> {
  const Success(this.data);

  final T data;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Success<T> &&
          runtimeType == other.runtimeType &&
          data == other.data;

  @override
  String toString() => 'Success(data: $data)';

  @override
  List<Object?> get props => [data];
}

/// Represents a failure result with error
@immutable
final class Failure<T> extends Result<T> {
  const Failure(this.error, [this.stackTrace]);

  final Object error;
  final StackTrace? stackTrace;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Failure<T> &&
          runtimeType == other.runtimeType &&
          error == other.error;

  @override
  String toString() => 'Failure(error: $error)';

  @override
  List<Object?> get props => [error, stackTrace];
}

/// Extension methods for Result type
extension ResultExtension<T> on Result<T> {
  /// Returns true if the result is a success
  bool get isSuccess => this is Success<T>;

  /// Returns true if the result is a failure
  bool get isFailure => this is Failure<T>;

  /// Returns the data if success, null otherwise
  T? get dataOrNull => switch (this) {
    Success<T>(:final data) => data,
    Failure<T>() => null,
  };

  /// Returns the error if failure, null otherwise
  Object? get errorOrNull => switch (this) {
    Success<T>() => null,
    Failure<T>(:final error) => error,
  };

  /// Executes onSuccess callback if result is success
  Result<T> onSuccess(void Function(T data) onSuccess) {
    if (this case Success<T>(:final data)) {
      onSuccess(data);
    }
    return this;
  }

  /// Executes onFailure callback if result is failure
  Result<T> onFailure(void Function(Object error) onFailure) {
    if (this case Failure<T>(:final error)) {
      onFailure(error);
    }
    return this;
  }

  /// Maps the data if result is success
  Result<R> map<R>(R Function(T data) mapper) {
    return switch (this) {
      Success<T>(:final data) => Success(mapper(data)),
      Failure<T>(:final error, :final stackTrace) => Failure(error, stackTrace),
    };
  }

  /// Flat maps the result
  Result<R> flatMap<R>(Result<R> Function(T data) mapper) {
    return switch (this) {
      Success<T>(:final data) => mapper(data),
      Failure<T>(:final error, :final stackTrace) => Failure(error, stackTrace),
    };
  }

  /// Folds the result into a single value
  R fold<R>(
    R Function(Object error) onFailure,
    R Function(T data) onSuccess,
  ) {
    return switch (this) {
      Success<T>(:final data) => onSuccess(data),
      Failure<T>(:final error) => onFailure(error),
    };
  }
}
