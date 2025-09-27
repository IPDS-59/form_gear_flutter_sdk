/// Base class for all failures in the application
abstract class AppFailure implements Exception {
  const AppFailure(this.message, [this.code]);

  final String message;
  final String? code;

  @override
  String toString() => 'AppFailure(message: $message, code: $code)';
}

/// Network-related failures
class NetworkFailure extends AppFailure {
  const NetworkFailure(super.message, [super.code]);
}

/// Server-related failures
class ServerFailure extends AppFailure {
  const ServerFailure(super.message, [super.code]);
}

/// Client-related failures (4xx errors)
class ClientFailure extends AppFailure {
  const ClientFailure(super.message, [super.code]);
}

/// Authentication/Authorization failures
class AuthFailure extends AppFailure {
  const AuthFailure(super.message, [super.code]);
}

/// Data parsing failures
class DataFailure extends AppFailure {
  const DataFailure(super.message, [super.code]);
}

/// Cache-related failures
class CacheFailure extends AppFailure {
  const CacheFailure(super.message, [super.code]);
}

/// Unknown/Unexpected failures
class UnknownFailure extends AppFailure {
  const UnknownFailure(super.message, [super.code]);
}
