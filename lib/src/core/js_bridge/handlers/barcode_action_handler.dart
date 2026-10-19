import 'package:form_gear_engine_sdk/form_gear_engine_sdk.dart';
import 'package:form_gear_engine_sdk/src/core/js_bridge/handlers/action_handler_contract.dart';
import 'package:form_gear_engine_sdk/src/core/services/navigator_context_provider.dart';
import 'package:form_gear_engine_sdk/src/utils/utils.dart';

/// Handler for barcode/QR scanning actions (BARCODE, QR_SCAN).
///
/// The SDK has no scanner: it asks the host through
/// [FormGearUiHandler.scanBarcode].
class BarcodeActionHandler with ActionHandlerContract {
  @override
  List<String> get supportedActions => ['BARCODE', 'QR_SCAN'];

  @override
  Future<ActionInfoJs> handle(
    String action,
    String dataKey,
    String data,
  ) async {
    try {
      FormGearLogger.webview('Barcode scan action for dataKey: $dataKey');

      final handler = FormGearSDK.instance.uiHandler;
      final context = NavigatorContextProvider.instance.context;
      if (context == null) {
        return ActionInfoJs(
          success: false,
          error: 'No valid context available for barcode scanner',
        );
      }

      final scan = handler == null
          ? null
          : await handler.scanBarcode(
              context,
              BarcodeScanRequest(
                dataKey: dataKey,
                title: 'Scan Barcode - $dataKey',
              ),
            );
      if (scan == null) {
        return ActionInfoJs(
          success: false,
          error: 'Pemindai tidak tersedia di aplikasi ini',
        );
      }
      if (scan.cancelled) {
        FormGearLogger.webview('Barcode scan cancelled by user');
        return ActionInfoJs(
          success: false,
          error: 'Barcode scan cancelled by user',
        );
      }

      final result = scan.text!;
      FormGearLogger.webview('Barcode scan completed: $result');
      // Notify FormGear JS of the scanned barcode value
      await notifyJavaScript(
        action: 'BARCODE',
        result: result,
        dataKey: dataKey,
      );
      return ActionInfoJs(success: true, result: result);
    } on Exception catch (e) {
      FormGearLogger.webviewError('Barcode scan error: $e');
      return ActionInfoJs(
        success: false,
        error: ErrorSanitizer.sanitizeWithContext('Barcode scan', e.toString()),
      );
    }
  }
}
