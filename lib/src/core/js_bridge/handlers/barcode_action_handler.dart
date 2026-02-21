import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:form_gear_engine_sdk/form_gear_engine_sdk.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/handlers/action_handler_contract.dart';
import 'package:form_gear_engine_sdk/src/core/services/navigator_context_provider.dart';
import 'package:form_gear_engine_sdk/src/presentation/bloc/barcode_scanner_bloc.dart';
import 'package:form_gear_engine_sdk/src/presentation/widgets/barcode_scanner_screen.dart';
import 'package:form_gear_engine_sdk/src/utils/utils.dart';
import 'package:permission_handler/permission_handler.dart';

/// Handler for barcode/QR scanning actions (BARCODE, QR_SCAN)
class BarcodeActionHandler with ActionHandlerContract {
  @override
  List<String> get supportedActions => ['BARCODE', 'QR_SCAN'];

  @override
  Future<ActionInfoJs> handle(
    String action,
    String dataKey,
    String data,
  ) async {
    return _handleBarcode(dataKey, data);
  }

  /// Handle barcode/QR scan action using presentation layer widget
  Future<ActionInfoJs> _handleBarcode(String dataKey, String data) async {
    try {
      FormGearLogger.webview('Barcode scan action for dataKey: $dataKey');

      final cameraStatus = await Permission.camera.request();
      if (!cameraStatus.isGranted) {
        return ActionInfoJs(
          success: false,
          error: 'Camera permission required for barcode scanning',
        );
      }

      final context = _getCurrentContext();
      if (context == null) {
        return ActionInfoJs(
          success: false,
          error: 'No valid context available for barcode scanner',
        );
      }

      final scannedResult = await Navigator.of(context).push<String?>(
        MaterialPageRoute<String?>(
          builder: (context) => BlocProvider(
            create: (context) =>
                BarcodeScannerBloc()..add(const InitializeScanner()),
            child: BarcodeScannerScreen(
              title: 'Scan Barcode - $dataKey',
            ),
          ),
        ),
      );

      if (scannedResult != null && scannedResult.isNotEmpty) {
        FormGearLogger.webview('Barcode scan completed: $scannedResult');

        // Notify FormGear JS of the scanned barcode value
        await notifyJavaScript(
          action: 'BARCODE',
          result: scannedResult,
          dataKey: dataKey,
        );

        return ActionInfoJs(success: true, result: scannedResult);
      } else {
        FormGearLogger.webview('Barcode scan cancelled by user');
        return ActionInfoJs(
          success: false,
          error: 'Barcode scan cancelled by user',
        );
      }
    } on Exception catch (e) {
      FormGearLogger.webviewError('Barcode scan error: $e');
      return ActionInfoJs(
        success: false,
        error: ErrorSanitizer.sanitizeWithContext('Barcode scan', e.toString()),
      );
    }
  }

  /// Get the current BuildContext from the NavigatorContextProvider
  BuildContext? _getCurrentContext() =>
      NavigatorContextProvider.instance.context;
}
