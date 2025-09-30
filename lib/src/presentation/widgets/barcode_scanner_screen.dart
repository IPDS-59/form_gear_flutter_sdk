import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:form_gear_engine_sdk/src/presentation/bloc/barcode_scanner_bloc.dart';
import 'package:form_gear_engine_sdk/src/presentation/painters/scanner_overlay_painter.dart'
    as painter;
import 'package:mobile_scanner/mobile_scanner.dart';

/// Refactored barcode scanner with BLoC and app lifecycle handling
class BarcodeScannerScreen extends StatefulWidget {
  const BarcodeScannerScreen({
    required this.title,
    super.key,
  });

  final String title;

  @override
  State<BarcodeScannerScreen> createState() => _BarcodeScannerScreenState();
}

class _BarcodeScannerScreenState extends State<BarcodeScannerScreen>
    with TickerProviderStateMixin, WidgetsBindingObserver {
  // Animation controllers for visual effects
  late AnimationController _scanLineController;
  late AnimationController _detectionController;
  late AnimationController _pulseController;
  late AnimationController _successController;

  // Animation values
  late Animation<double> _scanLineAnimation;
  late Animation<double> _detectionScaleAnimation;
  late Animation<double> _detectionOpacityAnimation;
  late Animation<double> _pulseAnimation;
  late Animation<double> _successAnimation;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _initializeAnimations();
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _scanLineController.dispose();
    _detectionController.dispose();
    _pulseController.dispose();
    _successController.dispose();
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    super.didChangeAppLifecycleState(state);
    // Handle app lifecycle changes
    switch (state) {
      case AppLifecycleState.paused:
      case AppLifecycleState.inactive:
      case AppLifecycleState.hidden:
        context.read<BarcodeScannerBloc>().add(const PauseScanning());
      case AppLifecycleState.resumed:
        context.read<BarcodeScannerBloc>().add(const ResumeScanning());
      case AppLifecycleState.detached:
        context.read<BarcodeScannerBloc>().add(const DisposeScanner());
    }
  }

  void _initializeAnimations() {
    // Continuous scan line animation (up and down)
    _scanLineController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    )..repeat(reverse: true);

    _scanLineAnimation =
        Tween<double>(
          begin: 0,
          end: 1,
        ).animate(
          CurvedAnimation(
            parent: _scanLineController,
            curve: Curves.easeInOut,
          ),
        );

    // Detection highlight animation
    _detectionController = AnimationController(
      duration: const Duration(milliseconds: 600),
      vsync: this,
    );

    _detectionScaleAnimation =
        Tween<double>(
          begin: 0.8,
          end: 1,
        ).animate(
          CurvedAnimation(
            parent: _detectionController,
            curve: Curves.elasticOut,
          ),
        );

    _detectionOpacityAnimation =
        Tween<double>(
          begin: 0,
          end: 1,
        ).animate(
          CurvedAnimation(
            parent: _detectionController,
            curve: Curves.easeOut,
          ),
        );

    // Pulse animation for detected codes
    _pulseController = AnimationController(
      duration: const Duration(milliseconds: 1000),
      vsync: this,
    );

    _pulseAnimation =
        Tween<double>(
          begin: 1,
          end: 1.2,
        ).animate(
          CurvedAnimation(
            parent: _pulseController,
            curve: Curves.easeInOut,
          ),
        );

    // Success check animation
    _successController = AnimationController(
      duration: const Duration(milliseconds: 400),
      vsync: this,
    );

    _successAnimation =
        Tween<double>(
          begin: 0,
          end: 1,
        ).animate(
          CurvedAnimation(
            parent: _successController,
            curve: Curves.elasticOut,
          ),
        );
  }

  void _onToggleFlash() {
    context.read<BarcodeScannerBloc>().add(const ToggleFlash());
  }

  void _onSwitchCamera() {
    context.read<BarcodeScannerBloc>().add(const SwitchCamera());
  }

  Widget _buildCameraView(BarcodeScannerState state) {
    // Only show camera when scanner is ready and has controller
    final controller = context.read<BarcodeScannerBloc>().controller;

    if (controller == null ||
        state.status == BarcodeScannerStatus.disposed ||
        state.status == BarcodeScannerStatus.initializing ||
        state.status == BarcodeScannerStatus.error) {
      return Container(color: Colors.black);
    }

    // MobileScanner widget will use the controller that's already started
    // The BLoC listens to controller.barcodes stream in _onStartScanning
    return MobileScanner(
      controller: controller,
    );
  }

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<BarcodeScannerBloc, BarcodeScannerState>(
      listener: (context, state) {
        if (state.status == BarcodeScannerStatus.detected) {
          // Trigger detection animations
          _detectionController.forward();
          _pulseController.repeat(reverse: true);
          _successController.forward();
        } else if (state.status == BarcodeScannerStatus.scanning) {
          // Reset animations when detection is cleared
          _detectionController.reset();
          _pulseController.stop();
          _successController.reset();
        } else if (state.status == BarcodeScannerStatus.completed) {
          // Return result
          if (state.selectedBarcode != null) {
            Navigator.of(context).pop(state.selectedBarcode);
          }
        } else if (state.status == BarcodeScannerStatus.ready) {
          // Start scanning when ready
          context.read<BarcodeScannerBloc>().add(const StartScanning());
        }
      },
      builder: (context, state) {
        if (state.status == BarcodeScannerStatus.error) {
          return _buildErrorView(state.errorMessage ?? 'Unknown error');
        }

        if (state.status == BarcodeScannerStatus.initializing) {
          return _buildLoadingView();
        }

        return _buildScannerView(state);
      },
    );
  }

  Widget _buildErrorView(String errorMessage) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        title: Text(widget.title),
        backgroundColor: Colors.transparent,
        foregroundColor: Colors.white,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.error_outline,
              color: Colors.red,
              size: 64,
            ),
            const SizedBox(height: 16),
            Text(
              'Scanner Error',
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              errorMessage,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: Colors.white70,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () {
                context.read<BarcodeScannerBloc>().add(
                  const InitializeScanner(),
                );
              },
              child: const Text('Retry'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLoadingView() {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        title: Text(widget.title),
        backgroundColor: Colors.transparent,
        foregroundColor: Colors.white,
      ),
      body: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircularProgressIndicator(
              color: Color(0xFF1E88E5),
            ),
            SizedBox(height: 16),
            Text(
              'Initializing Scanner...',
              style: TextStyle(
                color: Colors.white,
                fontSize: 16,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildScannerView(BarcodeScannerState state) {
    return Scaffold(
      backgroundColor: Colors.black,
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        title: Text(
          widget.title,
          style: const TextStyle(
            fontWeight: FontWeight.w600,
          ),
        ),
        backgroundColor: Colors.transparent,
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          if (state.hasFlash)
            AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              decoration: BoxDecoration(
                color: state.isFlashOn
                    ? const Color(0xFF1E88E5).withValues(alpha: 0.2)
                    : Colors.transparent,
                borderRadius: BorderRadius.circular(8),
              ),
              child: IconButton(
                icon: Icon(
                  state.isFlashOn ? Icons.flash_on : Icons.flash_off,
                  color: state.isFlashOn
                      ? const Color(0xFF1E88E5)
                      : Colors.white,
                ),
                onPressed: _onToggleFlash,
              ),
            ),
          IconButton(
            icon: const Icon(Icons.flip_camera_ios),
            onPressed: _onSwitchCamera,
          ),
        ],
      ),
      body: Stack(
        children: [
          // Camera view
          Positioned.fill(
            child: _buildCameraView(state),
          ),

          // Scanning overlay with viewfinder
          Positioned.fill(
            child: AnimatedBuilder(
              animation: Listenable.merge([
                _scanLineAnimation,
                _detectionScaleAnimation,
                _pulseAnimation,
                _successAnimation,
              ]),
              builder: (context, child) {
                // Convert BLoC DetectedBarcode to Painter DetectedBarcode
                final painterBarcodes = state.detectedBarcodes
                    .map(
                      (b) => painter.DetectedBarcode(
                        bounds: b.bounds,
                        data: b.data,
                        type: b.type,
                      ),
                    )
                    .toList();

                return CustomPaint(
                  painter: painter.ScannerOverlayPainter(
                    scanLineProgress: _scanLineAnimation.value,
                    detectedBarcodes: painterBarcodes,
                    detectionScale: _detectionScaleAnimation.value,
                    detectionOpacity: _detectionOpacityAnimation.value,
                    pulseScale: _pulseAnimation.value,
                    hasDetection: state.hasDetection,
                    successProgress: _successAnimation.value,
                  ),
                );
              },
            ),
          ),

          // Instruction overlay
          Positioned(
            bottom: 100,
            left: 24,
            right: 24,
            child: AnimatedOpacity(
              opacity: state.hasDetection ? 0.7 : 1.0,
              duration: const Duration(milliseconds: 300),
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 16,
                ),
                decoration: BoxDecoration(
                  color: Colors.black.withValues(alpha: 0.8),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: const Color(0xFF1E88E5).withValues(alpha: 0.3),
                  ),
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      state.hasDetection
                          ? Icons.check_circle
                          : Icons.qr_code_scanner,
                      color: state.hasDetection
                          ? const Color(0xFF10B981)
                          : const Color(0xFF1E88E5),
                      size: 32,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      state.hasDetection
                          ? 'QR Code Terdeteksi!'
                          : 'Arahkan kamera ke QR code atau barcode',
                      style: TextStyle(
                        color: state.hasDetection
                            ? const Color(0xFF10B981)
                            : Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    if (!state.hasDetection) ...[
                      const SizedBox(height: 4),
                      Text(
                        'Pastikan kode berada dalam area scan',
                        style: TextStyle(
                          color: Colors.grey.shade400,
                          fontSize: 14,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
