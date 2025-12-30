import 'package:flutter/material.dart';

/// Provides navigation context to action handlers.
///
/// This service solves the anti-pattern of accessing BuildContext via
/// `WidgetsBinding.instance.rootElement` by providing a properly managed
/// context getter that can be used for navigation operations.
///
/// Usage:
/// 1. Register the context getter from the widget that manages navigation:
///    ```dart
///    NavigatorContextProvider.instance.register(
///      () => mounted ? context : null,
///    );
///    ```
///
/// 2. In handlers, get the context:
///    ```dart
///    final context = NavigatorContextProvider.instance.context;
///    if (context == null) return; // Handle no context available
///    Navigator.of(context).push(...);
///    ```
///
/// 3. Unregister when done:
///    ```dart
///    NavigatorContextProvider.instance.unregister();
///    ```
class NavigatorContextProvider {
  NavigatorContextProvider._();

  static final NavigatorContextProvider _instance =
      NavigatorContextProvider._();

  /// Singleton instance
  static NavigatorContextProvider get instance => _instance;

  /// Function that returns the current BuildContext if available
  BuildContext? Function()? _contextGetter;

  /// Registers a context getter for use by action handlers.
  ///
  /// The getter should return null if the widget is not mounted.
  ///
  /// Call this from the WebView widget's didChangeDependencies.
  // ignore: use_setters_to_change_properties
  void register(BuildContext? Function() contextGetter) {
    _contextGetter = contextGetter;
  }

  /// Unregisters the current context getter.
  ///
  /// Call this from the WebView widget's dispose.
  void unregister() {
    _contextGetter = null;
  }

  /// Gets the current navigation context if available.
  ///
  /// Returns null if:
  /// - No context getter is registered
  /// - The widget is not mounted
  /// - The context is no longer valid
  BuildContext? get context {
    final getter = _contextGetter;
    if (getter == null) {
      return null;
    }

    final ctx = getter();
    if (ctx == null || !ctx.mounted) {
      return null;
    }

    return ctx;
  }

  /// Checks if a valid context is available.
  bool get hasContext => context != null;
}
