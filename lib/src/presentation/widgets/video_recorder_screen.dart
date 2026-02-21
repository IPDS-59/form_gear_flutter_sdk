import 'dart:async';
import 'dart:io';

import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:form_gear_engine_sdk/src/utils/fasih_media_helper.dart';

/// Video recorder screen using the camera package directly.
///
/// Uses [CameraController] instead of the system camera intent to avoid
/// Android OEM camera apps returning null after stopping a recording.
class VideoRecorderScreen extends StatefulWidget {
  const VideoRecorderScreen({
    required this.title,
    required this.assignmentId,
    required this.fileName,
    this.dataKey,
    super.key,
  });

  final String title;
  final String assignmentId;
  final String fileName;
  final String? dataKey;

  @override
  State<VideoRecorderScreen> createState() => _VideoRecorderScreenState();
}

enum _VideoState { initializing, ready, recording, saving, error }

class _VideoRecorderScreenState extends State<VideoRecorderScreen>
    with WidgetsBindingObserver {
  CameraController? _controller;
  _VideoState _videoState = _VideoState.initializing;
  String? _errorMessage;
  Timer? _timer;
  int _secondsElapsed = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _initCamera();
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _timer?.cancel();
    _controller?.dispose();
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    super.didChangeAppLifecycleState(state);
    switch (state) {
      case AppLifecycleState.inactive:
      case AppLifecycleState.paused:
        _handleBackgrounded();
      case AppLifecycleState.resumed:
        if (_controller == null && mounted) _initCamera();
      case AppLifecycleState.hidden:
      case AppLifecycleState.detached:
        break;
    }
  }

  /// Handles the app going to background or becoming inactive.
  ///
  /// Nulls out [_controller] first so no other code path can use it while the
  /// async stop/dispose sequence is running. If a recording was in progress it
  /// is stopped and saved before the controller is disposed, then the screen
  /// is popped with the saved filename so the caller can process the result.
  Future<void> _handleBackgrounded() async {
    _timer?.cancel();
    final controller = _controller;
    _controller = null; // Prevent further use immediately.

    if (controller == null || !controller.value.isInitialized) return;

    if (controller.value.isRecordingVideo) {
      if (mounted) setState(() => _videoState = _VideoState.saving);
      try {
        final video = await controller.stopVideoRecording();
        await controller.dispose();

        final saved = await FasihMediaHelper.saveMediaFile(
          assignmentId: widget.assignmentId,
          sourceFile: File(video.path),
          fileName: widget.fileName,
          mediaType: 'video',
        );

        if (!mounted) return;
        Navigator.of(context).pop(saved ? widget.fileName : null);
        return;
      } on Exception catch (_) {
        await controller.dispose();
        if (mounted) setState(() => _videoState = _VideoState.ready);
        return;
      }
    }

    await controller.dispose();
    if (mounted) setState(() => _videoState = _VideoState.ready);
  }

  Future<void> _initCamera() async {
    setState(() => _videoState = _VideoState.initializing);
    try {
      final cameras = await availableCameras();
      if (cameras.isEmpty) {
        _setError('No camera available on this device');
        return;
      }

      final backCamera = cameras.firstWhere(
        (c) => c.lensDirection == CameraLensDirection.back,
        orElse: () => cameras.first,
      );

      final controller = CameraController(
        backCamera,
        ResolutionPreset.high,
      );

      await controller.initialize();

      if (!mounted) return;
      _controller = controller;
      setState(() => _videoState = _VideoState.ready);
    } on CameraException catch (e) {
      _setError('Camera error: ${e.description ?? e.code}');
    } on Exception catch (e) {
      _setError('Camera initialization failed: $e');
    }
  }

  void _setError(String message) {
    if (!mounted) return;
    setState(() {
      _videoState = _VideoState.error;
      _errorMessage = message;
    });
  }

  Future<void> _startRecording() async {
    final controller = _controller;
    if (controller == null || !controller.value.isInitialized) return;

    try {
      await controller.startVideoRecording();
      _secondsElapsed = 0;
      _timer = Timer.periodic(const Duration(seconds: 1), (_) {
        if (mounted) setState(() => _secondsElapsed++);
      });
      setState(() => _videoState = _VideoState.recording);
    } on CameraException catch (e) {
      _setError('Failed to start recording: ${e.description ?? e.code}');
    }
  }

  Future<void> _stopRecording() async {
    _timer?.cancel();
    final controller = _controller;
    if (controller == null || !controller.value.isRecordingVideo) return;

    setState(() => _videoState = _VideoState.saving);

    try {
      final video = await controller.stopVideoRecording();

      final saved = await FasihMediaHelper.saveMediaFile(
        assignmentId: widget.assignmentId,
        sourceFile: File(video.path),
        fileName: widget.fileName,
        mediaType: 'video',
      );

      if (!mounted) return;

      if (saved) {
        Navigator.of(context).pop(widget.fileName);
      } else {
        _setError('Failed to save video file');
      }
    } on CameraException catch (e) {
      _setError('Failed to stop recording: ${e.description ?? e.code}');
    } on Exception catch (e) {
      _setError('Failed to save video: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        leading: IconButton(
          icon: Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(
              Icons.arrow_back_ios_new_rounded,
              size: 20,
              color: Colors.white,
            ),
          ),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: Text(
          widget.title,
          style: const TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      body: switch (_videoState) {
        _VideoState.initializing => const _VideoStatusView(
          message: 'Initializing camera...',
        ),
        _VideoState.saving => const _VideoStatusView(
          message: 'Saving video...',
        ),
        _VideoState.error => _VideoErrorView(
          message: _errorMessage ?? 'An unexpected error occurred',
          onRetry: _initCamera,
        ),
        _VideoState.ready || _VideoState.recording =>
          _controller == null
              ? const SizedBox.shrink()
              : _CameraView(
                  controller: _controller!,
                  isRecording: _videoState == _VideoState.recording,
                  secondsElapsed: _secondsElapsed,
                  onStartRecording: _startRecording,
                  onStopRecording: _stopRecording,
                ),
      },
    );
  }
}

// ---------------------------------------------------------------------------
// Private widget classes
// ---------------------------------------------------------------------------

class _VideoStatusView extends StatelessWidget {
  const _VideoStatusView({required this.message});

  final String message;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const CircularProgressIndicator(color: Colors.white),
          const SizedBox(height: 16),
          Text(
            message,
            style: const TextStyle(color: Colors.white, fontSize: 16),
          ),
        ],
      ),
    );
  }
}

class _VideoErrorView extends StatelessWidget {
  const _VideoErrorView({
    required this.message,
    required this.onRetry,
  });

  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.error_outline, color: Colors.red, size: 64),
            const SizedBox(height: 16),
            Text(
              message,
              style: const TextStyle(color: Colors.white, fontSize: 15),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: onRetry,
              icon: const Icon(Icons.refresh),
              label: const Text('Retry'),
            ),
          ],
        ),
      ),
    );
  }
}

class _CameraView extends StatelessWidget {
  const _CameraView({
    required this.controller,
    required this.isRecording,
    required this.secondsElapsed,
    required this.onStartRecording,
    required this.onStopRecording,
  });

  final CameraController controller;
  final bool isRecording;
  final int secondsElapsed;
  final VoidCallback onStartRecording;
  final VoidCallback onStopRecording;

  @override
  Widget build(BuildContext context) {
    return Stack(
      fit: StackFit.expand,
      children: [
        CameraPreview(controller),
        if (isRecording)
          Positioned(
            top: MediaQuery.of(context).padding.top + kToolbarHeight + 8,
            left: 0,
            right: 0,
            child: Center(
              child: _RecordingTimerBadge(secondsElapsed: secondsElapsed),
            ),
          ),
        Positioned(
          bottom: 48,
          left: 0,
          right: 0,
          child: _RecordControls(
            isRecording: isRecording,
            onTap: isRecording ? onStopRecording : onStartRecording,
          ),
        ),
      ],
    );
  }
}

class _RecordingTimerBadge extends StatelessWidget {
  const _RecordingTimerBadge({required this.secondsElapsed});

  final int secondsElapsed;

  String get _formatted {
    final m = (secondsElapsed ~/ 60).toString().padLeft(2, '0');
    final s = (secondsElapsed % 60).toString().padLeft(2, '0');
    return '$m:$s';
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.black.withValues(alpha: 0.65),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.red.withValues(alpha: 0.6)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 10,
            height: 10,
            decoration: const BoxDecoration(
              color: Colors.red,
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 8),
          Text(
            _formatted,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.w600,
              fontFamily: 'monospace',
            ),
          ),
        ],
      ),
    );
  }
}

class _RecordControls extends StatelessWidget {
  const _RecordControls({
    required this.isRecording,
    required this.onTap,
  });

  final bool isRecording;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          isRecording ? 'Tap to stop recording' : 'Tap to start recording',
          style: TextStyle(
            color: Colors.white.withValues(alpha: 0.75),
            fontSize: 14,
          ),
        ),
        const SizedBox(height: 16),
        GestureDetector(
          onTap: onTap,
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            width: 76,
            height: 76,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: Colors.white, width: 4),
            ),
            child: Center(
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                width: isRecording ? 30 : 56,
                height: isRecording ? 30 : 56,
                decoration: BoxDecoration(
                  color: Colors.red,
                  borderRadius: BorderRadius.circular(isRecording ? 6 : 28),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
