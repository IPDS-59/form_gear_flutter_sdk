/// FormGear SDK Listeners
///
/// This module provides a comprehensive listener architecture for handling
/// save/submit operations from FormGear and FasihForm engines.
///
/// The listener architecture allows SDK users to implement their own data
/// persistence and caching strategies while following FASIH patterns.
library;

// Error handling utilities
export 'error_handler.dart';
export 'examples/database_listener.dart';
export 'examples/file_system_listener.dart';
// Example implementations
export 'examples/simple_listener.dart';
// Core listener interfaces and base classes
export 'form_data_listener.dart';
// Data models for save/submit operations
export 'save_submit_data.dart';
export 'save_submit_result.dart';
