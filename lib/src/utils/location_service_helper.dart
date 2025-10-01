import 'package:form_gear_engine_sdk/src/utils/form_gear_logger.dart';
import 'package:geolocator/geolocator.dart';

/// Helper class for managing location services and permissions
/// Provides unified methods for checking, requesting, and handling location
/// access
class LocationServiceHelper {
  /// Private constructor to prevent instantiation
  LocationServiceHelper._();

  /// Result of location service check and setup
  static const Duration _settingsDelay = Duration(seconds: 2);
  static const Duration _locationTimeout = Duration(seconds: 10);

  /// Comprehensive location service setup with automatic settings redirect
  ///
  /// Returns [LocationServiceResult] with status and optional error message
  /// Automatically attempts to open location settings if services are disabled
  static Future<LocationServiceResult> ensureLocationAccess({
    bool openSettingsOnDisabled = true,
    String? contextDescription,
  }) async {
    final context = contextDescription ?? 'location access';

    try {
      // Step 1: Check if location services are enabled
      final serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        if (openSettingsOnDisabled) {
          FormGearLogger.webview(
            'Location services disabled for $context, opening settings',
          );

          final settingsResult = await _handleLocationServicesDisabled();
          if (!settingsResult.success) {
            return settingsResult;
          }
        } else {
          return LocationServiceResult.failure(
            'Location services are disabled. '
            'Please enable location services in your device settings.',
          );
        }
      }

      // Step 2: Check and request location permissions
      final permissionResult = await _handleLocationPermissions();
      if (!permissionResult.success) {
        return permissionResult;
      }

      FormGearLogger.webview('Location access granted for $context');
      return LocationServiceResult.success();
    } on Exception catch (e) {
      FormGearLogger.webviewError('Location access setup failed: $e');
      return LocationServiceResult.failure('Location access setup failed: $e');
    }
  }

  /// Get current location with proper settings and error handling
  ///
  /// Returns [LocationResult] with position data or error information
  static Future<LocationResult> getCurrentLocation({
    LocationAccuracy accuracy = LocationAccuracy.high,
    Duration? timeLimit,
  }) async {
    try {
      final position = await Geolocator.getCurrentPosition(
        locationSettings: LocationSettings(
          accuracy: accuracy,
          timeLimit: timeLimit ?? _locationTimeout,
        ),
      );

      FormGearLogger.webview(
        'Location acquired: ${position.latitude},${position.longitude}',
      );

      return LocationResult.success(position);
    } on Exception catch (e) {
      FormGearLogger.webviewError('Failed to get current location: $e');
      return LocationResult.failure('Failed to get location: $e');
    }
  }

  /// Check location permission status without requesting
  static Future<LocationPermission> getPermissionStatus() async {
    return Geolocator.checkPermission();
  }

  /// Check if location services are enabled
  static Future<bool> areLocationServicesEnabled() async {
    return Geolocator.isLocationServiceEnabled();
  }

  /// Open device location settings
  static Future<bool> openLocationSettings() async {
    try {
      return await Geolocator.openLocationSettings();
    } on Exception catch (e) {
      FormGearLogger.webviewError('Failed to open location settings: $e');
      return false;
    }
  }

  /// Open app-specific location permission settings
  static Future<bool> openAppSettings() async {
    try {
      return await Geolocator.openAppSettings();
    } on Exception catch (e) {
      FormGearLogger.webviewError('Failed to open app settings: $e');
      return false;
    }
  }

  /// Handle the case when location services are disabled
  static Future<LocationServiceResult> _handleLocationServicesDisabled() async {
    try {
      // Try to open location settings
      await Geolocator.openLocationSettings();

      // Wait for user to potentially enable location services
      await Future<void>.delayed(_settingsDelay);

      // Check again if location services are now enabled
      final newServiceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!newServiceEnabled) {
        return LocationServiceResult.failure(
          'Location services are disabled. Please enable location services '
          'in your device settings and try again.',
        );
      }

      FormGearLogger.webview('Location services enabled by user');
      return LocationServiceResult.success();
    } on Exception catch (e) {
      FormGearLogger.webviewError('Failed to open location settings: $e');
      return LocationServiceResult.failure(
        'Location services are disabled. Please manually enable location '
        'services in your device settings and try again.',
      );
    }
  }

  /// Handle location permission checking and requesting
  static Future<LocationServiceResult> _handleLocationPermissions() async {
    try {
      // Check current permission status
      var permission = await Geolocator.checkPermission();

      // Request permission if denied
      if (permission == LocationPermission.denied) {
        FormGearLogger.webview('Requesting location permission');
        permission = await Geolocator.requestPermission();

        if (permission == LocationPermission.denied) {
          return LocationServiceResult.failure('Location permission denied');
        }
      }

      // Handle permanently denied permission
      if (permission == LocationPermission.deniedForever) {
        FormGearLogger.webview(
          'Location permission permanently denied, opening app settings',
        );

        try {
          await Geolocator.openAppSettings();
          return LocationServiceResult.failure(
            'Location permission permanently denied. Please enable location '
            'access for this app in your device settings.',
          );
        } on Exception catch (e) {
          FormGearLogger.webviewError('Failed to open app settings: $e');
          return LocationServiceResult.failure(
            'Location permission permanently denied. Please manually enable '
            'location access for this app in your device settings.',
          );
        }
      }

      return LocationServiceResult.success();
    } on Exception catch (e) {
      FormGearLogger.webviewError('Permission handling failed: $e');
      return LocationServiceResult.failure('Permission handling failed: $e');
    }
  }
}

/// Result of location service operations
class LocationServiceResult {
  /// Create a LocationServiceResult with success status and optional error
  const LocationServiceResult._({
    required this.success,
    this.errorMessage,
  });

  /// Create a successful result
  factory LocationServiceResult.success() {
    return const LocationServiceResult._(success: true);
  }

  /// Create a failure result with error message
  factory LocationServiceResult.failure(String errorMessage) {
    return LocationServiceResult._(
      success: false,
      errorMessage: errorMessage,
    );
  }

  final bool success;
  final String? errorMessage;

  @override
  String toString() {
    return success
        ? 'LocationServiceResult.success'
        : 'LocationServiceResult.failure($errorMessage)';
  }
}

/// Result of location acquisition operations
class LocationResult {
  /// Create a LocationResult with success status, position, and optional error
  const LocationResult._({
    required this.success,
    this.position,
    this.errorMessage,
  });

  /// Create a successful result with position
  factory LocationResult.success(Position position) {
    return LocationResult._(
      success: true,
      position: position,
    );
  }

  /// Create a failure result with error message
  factory LocationResult.failure(String errorMessage) {
    return LocationResult._(
      success: false,
      errorMessage: errorMessage,
    );
  }

  final bool success;
  final Position? position;
  final String? errorMessage;

  @override
  String toString() {
    return success
        ? 'LocationResult.success(${position?.latitude},${position?.longitude})'
        : 'LocationResult.failure($errorMessage)';
  }
}
