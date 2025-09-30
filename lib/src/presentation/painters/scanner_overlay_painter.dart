import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';

/// Data class for detected barcode information
class DetectedBarcode {
  const DetectedBarcode({
    required this.bounds,
    required this.data,
    required this.type,
  });

  final List<Offset>? bounds;
  final String data;
  final BarcodeType type;
}

/// Custom painter for scanner overlay with animated detection borders
class ScannerOverlayPainter extends CustomPainter {
  const ScannerOverlayPainter({
    required this.scanLineProgress,
    required this.detectedBarcodes,
    required this.detectionScale,
    required this.detectionOpacity,
    required this.pulseScale,
    required this.hasDetection,
    required this.successProgress,
  });

  final double scanLineProgress;
  final List<DetectedBarcode> detectedBarcodes;
  final double detectionScale;
  final double detectionOpacity;
  final double pulseScale;
  final bool hasDetection;
  final double successProgress;

  @override
  void paint(Canvas canvas, Size size) {
    // Create overlay with transparent scanning area
    final overlayPaint = Paint()
      ..color = Colors.black.withValues(alpha: 0.6)
      ..style = PaintingStyle.fill;

    // Define scanning area (viewfinder)
    final scanAreaSize = math.min(size.width, size.height) * 0.7;
    final scanAreaRect = Rect.fromCenter(
      center: Offset(size.width / 2, size.height / 2),
      width: scanAreaSize,
      height: scanAreaSize,
    );

    // Draw overlay with cutout for scanning area
    final overlayPath = Path()
      ..addRect(Rect.fromLTWH(0, 0, size.width, size.height))
      ..addRRect(
        RRect.fromRectAndRadius(scanAreaRect, const Radius.circular(16)),
      )
      ..fillType = PathFillType.evenOdd;

    canvas.drawPath(overlayPath, overlayPaint);

    // Draw viewfinder corners
    _drawViewfinderCorners(canvas, scanAreaRect);

    // Draw scanning line animation
    if (!hasDetection) {
      _drawScanLine(canvas, scanAreaRect);
    }

    // Note: Shape-following barcode borders removed for cleaner UI

    // Draw success check indicator
    if (hasDetection && successProgress > 0) {
      _drawSuccessCheck(canvas, scanAreaRect);
    }
  }

  void _drawViewfinderCorners(Canvas canvas, Rect scanArea) {
    // Change color to green when detected
    final cornerColor = hasDetection
        ? const Color(0xFF10B981)
        : const Color(0xFF1E88E5);

    final cornerPaint = Paint()
      ..color = cornerColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = hasDetection ? 5 : 4
      ..strokeCap = StrokeCap.round;

    const cornerLength = 30.0;
    const cornerRadius = 16.0;

    // Top-left corner
    canvas.drawPath(
      Path()
        ..moveTo(scanArea.left, scanArea.top + cornerLength)
        ..lineTo(scanArea.left, scanArea.top + cornerRadius)
        ..quadraticBezierTo(
          scanArea.left,
          scanArea.top,
          scanArea.left + cornerRadius,
          scanArea.top,
        )
        ..lineTo(scanArea.left + cornerLength, scanArea.top),
      cornerPaint,
    );

    // Top-right corner
    canvas.drawPath(
      Path()
        ..moveTo(scanArea.right - cornerLength, scanArea.top)
        ..lineTo(scanArea.right - cornerRadius, scanArea.top)
        ..quadraticBezierTo(
          scanArea.right,
          scanArea.top,
          scanArea.right,
          scanArea.top + cornerRadius,
        )
        ..lineTo(scanArea.right, scanArea.top + cornerLength),
      cornerPaint,
    );

    // Bottom-left corner
    canvas.drawPath(
      Path()
        ..moveTo(scanArea.left, scanArea.bottom - cornerLength)
        ..lineTo(scanArea.left, scanArea.bottom - cornerRadius)
        ..quadraticBezierTo(
          scanArea.left,
          scanArea.bottom,
          scanArea.left + cornerRadius,
          scanArea.bottom,
        )
        ..lineTo(scanArea.left + cornerLength, scanArea.bottom),
      cornerPaint,
    );

    // Bottom-right corner
    canvas.drawPath(
      Path()
        ..moveTo(scanArea.right - cornerLength, scanArea.bottom)
        ..lineTo(scanArea.right - cornerRadius, scanArea.bottom)
        ..quadraticBezierTo(
          scanArea.right,
          scanArea.bottom,
          scanArea.right,
          scanArea.bottom - cornerRadius,
        )
        ..lineTo(scanArea.right, scanArea.bottom - cornerLength),
      cornerPaint,
    );
  }

  void _drawScanLine(Canvas canvas, Rect scanArea) {
    final scanLinePaint = Paint()
      ..shader =
          LinearGradient(
            colors: [
              const Color(0xFF1E88E5).withValues(alpha: 0),
              const Color(0xFF1E88E5).withValues(alpha: 0.8),
              const Color(0xFF1E88E5).withValues(alpha: 0),
            ],
            stops: const [0, 0.5, 1],
          ).createShader(
            Rect.fromLTWH(
              scanArea.left,
              0,
              scanArea.width,
              4,
            ),
          )
      ..style = PaintingStyle.fill;

    final scanLineY = scanArea.top + (scanArea.height * scanLineProgress);

    canvas.drawRRect(
      RRect.fromRectAndRadius(
        Rect.fromLTWH(
          scanArea.left + 20,
          scanLineY - 2,
          scanArea.width - 40,
          4,
        ),
        const Radius.circular(2),
      ),
      scanLinePaint,
    );
  }

  void _drawSuccessCheck(Canvas canvas, Rect scanArea) {
    // Draw animated checkmark in center of scan area
    final center = scanArea.center;
    final checkSize = 60.0 * successProgress;

    // Background circle
    final backgroundPaint = Paint()
      ..color = const Color(0xFF10B981).withValues(alpha: 0.9)
      ..style = PaintingStyle.fill;

    canvas.drawCircle(center, checkSize * 0.7, backgroundPaint);

    // Border circle
    final borderPaint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3;

    canvas.drawCircle(center, checkSize * 0.7, borderPaint);

    // Draw checkmark
    if (successProgress > 0.3) {
      final checkPaint = Paint()
        ..color = Colors.white
        ..style = PaintingStyle.stroke
        ..strokeWidth = 4
        ..strokeCap = StrokeCap.round
        ..strokeJoin = StrokeJoin.round;

      final checkProgress = ((successProgress - 0.3) / 0.7).clamp(0.0, 1.0);
      final checkPath = Path();

      // Check mark coordinates
      final checkStart = Offset(center.dx - checkSize * 0.25, center.dy);
      final checkMiddle = Offset(
        center.dx - checkSize * 0.05,
        center.dy + checkSize * 0.2,
      );
      final checkEnd = Offset(
        center.dx + checkSize * 0.3,
        center.dy - checkSize * 0.2,
      );

      if (checkProgress < 0.5) {
        // Draw first part of check (left to middle)
        final progress = checkProgress * 2;
        checkPath.moveTo(checkStart.dx, checkStart.dy);
        checkPath.lineTo(
          checkStart.dx + (checkMiddle.dx - checkStart.dx) * progress,
          checkStart.dy + (checkMiddle.dy - checkStart.dy) * progress,
        );
      } else {
        // Draw complete first part and second part
        final progress = (checkProgress - 0.5) * 2;
        checkPath.moveTo(checkStart.dx, checkStart.dy);
        checkPath.lineTo(checkMiddle.dx, checkMiddle.dy);
        checkPath.lineTo(
          checkMiddle.dx + (checkEnd.dx - checkMiddle.dx) * progress,
          checkMiddle.dy + (checkEnd.dy - checkMiddle.dy) * progress,
        );
      }

      canvas.drawPath(checkPath, checkPaint);
    }
  }

  @override
  bool shouldRepaint(ScannerOverlayPainter oldDelegate) {
    return oldDelegate.scanLineProgress != scanLineProgress ||
        oldDelegate.detectedBarcodes != detectedBarcodes ||
        oldDelegate.detectionScale != detectionScale ||
        oldDelegate.detectionOpacity != detectionOpacity ||
        oldDelegate.pulseScale != pulseScale ||
        oldDelegate.hasDetection != hasDetection ||
        oldDelegate.successProgress != successProgress;
  }
}
