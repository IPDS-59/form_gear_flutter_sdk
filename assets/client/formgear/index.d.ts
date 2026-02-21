/**
 * FormGear - Dynamic Form Engine
 *
 * A powerful form rendering library built with SolidJS for creating
 * dynamic questionnaires and data collection forms.
 */

// =============================================================================
// Modern API
// =============================================================================

import type { FormGearOptions, FormGearInstance } from './types';

/**
 * Creates a new FormGear instance with the modern options-based API.
 *
 * @param options - Configuration options for the form
 * @returns FormGear instance with programmatic methods
 *
 * @example
 * ```typescript
 * import { createFormGear, ClientMode, FormMode } from 'form-gear';
 *
 * const form = createFormGear({
 *   data: {
 *     template: templateJson,
 *     validation: validationJson,
 *   },
 *   config: {
 *     clientMode: ClientMode.CAWI,
 *     formMode: FormMode.OPEN,
 *   },
 *   callbacks: {
 *     onSave: (response) => console.log('Saved:', response),
 *   },
 * });
 *
 * // Use instance methods
 * form.validate();
 * form.save();
 * form.destroy();
 * ```
 */
export declare function createFormGear(options: FormGearOptions): FormGearInstance;

/**
 * Current version of the FormGear library
 */
export declare const gearVersion: string;

// =============================================================================
// Enums
// =============================================================================

export {
  ClientMode,
  FormMode,
  InitialMode,
  LookupMode,
  OptionType,
  ValidationType,
  ControlType,
  DEFAULT_CONFIG,
} from './types';

// =============================================================================
// Type Exports
// =============================================================================

export type {
  // Configuration
  FormGearConfig,
  FormGearOptions,
  FormGearInstance,
  FormGearData,
  FormGearResponse,
  FormGearCallbacks,
  MobileHandlers,

  // Callbacks/Handlers
  ResponseCallback,
  UploadHandler,
  GpsHandler,
  OfflineSearchHandler,
  OnlineSearchHandler,
  ExitHandler,
  OpenMapHandler,

  // Component types
  Option,
  RangeInput,
  LengthInput,
  SizeInput,
  SourceAPI,
  ApiResponse,
  ComponentType,
  FormComponentProps,
  FormComponentConfig,
  FormComponentBase,

  // Store types
  Language,
  Locale,
  LocaleState,
  Summary,
  Counter,
  ValidationRule,
  TestFunction,
  ValidationDetail,
  ValidationState,
  Answer,
  Auxiliary,
  ResponseDetail,
  ResponseState,
  Predata,
  PresetDetail,
  PresetState,
  MediaDetail,
  MediaState,
  Comment,
  Note,
  RemarkDetail,
  RemarkState,
  TemplateComponent,
  TemplateDetail,
  TemplateState,
  ReferenceDetail,
  ReferenceState,
  SidebarDetail,
  SidebarState,
  ComponentMaps,
  HistoryState,
  FormState,

  // Platform bridge
  PlatformBridge,
} from './types';

// =============================================================================
// Native Bridge (Platform Communication)
// =============================================================================

export {
  // Factory functions
  createBridge,
  getBridge,
  resetBridge,
  detectPlatform,

  // Platform-specific bridges
  createAndroidBridge,
  createIOSBridge,
  createFlutterInAppWebViewBridge,
  createFlutterChannelBridge,
  createWebBridge,

  // Detection helpers
  isAndroidAvailable,
  isIOSAvailable,
  isFlutterAvailable,
  isFlutterInAppWebViewAvailable,
  isFlutterChannelAvailable,
  isWebAvailable,

  // Utility functions
  isNativeApp,
  isMobile,
  getPlatformName,
} from './bridge';

export type {
  // Bridge types
  NativeBridge,
  Platform,
  BridgeConfig,
  PlatformDetection,
  GpsPhotoResult,
  Coordinates,
  UploadResult,
  ScanResult,
  FormGearOutput,
  IOSMessage,
  FlutterMessage,
} from './bridge';
