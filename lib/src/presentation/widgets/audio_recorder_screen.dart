import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:form_gear_engine_sdk/src/presentation/bloc/audio_recorder_bloc.dart';
import 'package:form_gear_engine_sdk/src/presentation/widgets/permission_consent_screen.dart';
import 'package:permission_handler/permission_handler.dart';

/// Audio recorder screen with BLoC state management and permissions
/// Following FASIH patterns for media file management
class AudioRecorderScreen extends StatelessWidget {
  const AudioRecorderScreen({
    required this.title,
    required this.assignmentId,
    required this.fileName,
    this.dataKey,
    this.templateName,
    super.key,
  });

  final String title;
  final String assignmentId;
  final String fileName;
  final String? dataKey;
  final String? templateName;

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => AudioRecorderBloc()..add(InitializeRecorder()),
      child: _AudioRecorderView(
        title: title,
        assignmentId: assignmentId,
        fileName: fileName,
        dataKey: dataKey,
        templateName: templateName,
      ),
    );
  }
}

class _AudioRecorderView extends StatefulWidget {
  const _AudioRecorderView({
    required this.title,
    required this.assignmentId,
    required this.fileName,
    this.dataKey,
    this.templateName,
  });

  final String title;
  final String assignmentId;
  final String fileName;
  final String? dataKey;
  final String? templateName;

  @override
  State<_AudioRecorderView> createState() => _AudioRecorderViewState();
}

class _AudioRecorderViewState extends State<_AudioRecorderView>
    with WidgetsBindingObserver, TickerProviderStateMixin {
  late AnimationController _pulseController;
  late AnimationController _waveController;
  late AnimationController _contextSwitchController;
  late Animation<double> _pulseAnimation;
  late Animation<double> _waveAnimation;
  late Animation<double> _contextSwitchAnimation;
  bool _showTemplate = true;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _pulseController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );
    _waveController = AnimationController(
      duration: const Duration(milliseconds: 2000),
      vsync: this,
    );
    _contextSwitchController = AnimationController(
      duration: const Duration(milliseconds: 600),
      vsync: this,
    );

    _pulseAnimation =
        Tween<double>(
          begin: 1,
          end: 1.2,
        ).animate(
          CurvedAnimation(
            parent: _pulseController,
            curve: Curves.elasticOut,
          ),
        );

    _waveAnimation =
        Tween<double>(
          begin: 0,
          end: 1,
        ).animate(
          CurvedAnimation(
            parent: _waveController,
            curve: Curves.easeInOut,
          ),
        );

    _contextSwitchAnimation =
        Tween<double>(
          begin: 0,
          end: 1,
        ).animate(
          CurvedAnimation(
            parent: _contextSwitchController,
            curve: Curves.easeInOut,
          ),
        );

    // Start context switching animation if both template and dataKey exist
    if (widget.templateName != null && widget.dataKey != null) {
      Future.delayed(const Duration(seconds: 2), () {
        if (mounted) {
          _startContextSwitching();
        }
      });
    }
  }

  void _startContextSwitching() {
    _contextSwitchController.forward().then((_) {
      if (mounted) {
        setState(() {
          _showTemplate = !_showTemplate;
        });
        _contextSwitchController.reverse().then((_) {
          if (mounted) {
            Future.delayed(const Duration(seconds: 3), () {
              if (mounted) {
                _startContextSwitching();
              }
            });
          }
        });
      }
    });
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _pulseController.dispose();
    _waveController.dispose();
    _contextSwitchController.dispose();
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    super.didChangeAppLifecycleState(state);
    // Send lifecycle changes to BLoC
    context.read<AudioRecorderBloc>().add(AppLifecycleChanged(state));
  }

  String _formatDuration(Duration duration) {
    final minutes = duration.inMinutes;
    final seconds = duration.inSeconds % 60;
    return '${minutes.toString().padLeft(2, '0')}:'
        '${seconds.toString().padLeft(2, '0')}';
  }

  void _openAppSettings() {
    openAppSettings();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        leading: IconButton(
          icon: Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.9),
              borderRadius: BorderRadius.circular(12),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.1),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
          ),
          color: Colors.black87,
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: Text(
          widget.title,
          style: const TextStyle(
            color: Colors.black87,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      body: BlocConsumer<AudioRecorderBloc, AudioRecorderState>(
        listener: (context, state) {
          if (state is AudioRecorderCompleted) {
            _pulseController.stop();
            _waveController.stop();
            Navigator.of(context).pop(state.filePath);
          } else if (state is AudioRecorderShowingConfirmation) {
            _pulseController.stop();
            _waveController.stop();
          } else if (state is AudioRecorderRecording) {
            _pulseController.repeat(reverse: true);
            _waveController.repeat();
          } else if (state is AudioRecorderPaused) {
            _pulseController.stop();
            _waveController.stop();
          } else if (state is AudioRecorderReady) {
            _pulseController.reset();
            _waveController.reset();
          } else if (state is AudioRecorderError) {
            _pulseController.stop();
            _waveController.stop();
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.message),
                backgroundColor: Colors.red.shade600,
              ),
            );
          } else if (state is AudioRecorderNeedsPermissions) {
            _showPermissionConsentScreen(context);
          }
        },
        builder: (context, state) {
          return SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              child: SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                child: ConstrainedBox(
                  constraints: BoxConstraints(
                    minHeight:
                        MediaQuery.of(context).size.height -
                        MediaQuery.of(context).padding.top -
                        MediaQuery.of(context).padding.bottom -
                        kToolbarHeight -
                        32, // Account for padding
                  ),
                  child: IntrinsicHeight(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        if (state is AudioRecorderCheckingPermissions)
                          Expanded(child: _buildLoadingView())
                        else if (state is AudioRecorderPermissionDenied)
                          Expanded(child: _buildPermissionDeniedView(state))
                        else if (state is AudioRecorderNeedsPermissions)
                          Expanded(child: _buildLoadingView())
                        else if (state is AudioRecorderShowingConfirmation)
                          Expanded(
                            child: _buildConfirmationView(context, state),
                          )
                        else
                          Expanded(child: _buildRecordingView(context, state)),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildPermissionDeniedView(AudioRecorderPermissionDenied state) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Spacer(flex: 2),
        // Greeting section with emoji
        const Center(
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                'Oops,',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w400,
                  color: Color(0xFF6B7280),
                ),
              ),
              SizedBox(width: 12),
              Text(
                '🔒',
                style: TextStyle(fontSize: 24),
              ),
            ],
          ),
        ),
        const SizedBox(height: 32),
        // Main message
        RichText(
          textAlign: TextAlign.left,
          text: const TextSpan(
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.w600,
              color: Color(0xFF1F2937),
              height: 1.3,
            ),
            children: [
              TextSpan(text: 'Akses '),
              TextSpan(
                text: 'mikrofon',
                style: TextStyle(
                  color: Color(0xFFE91E63),
                  fontWeight: FontWeight.w700,
                ),
              ),
              TextSpan(
                text:
                    ' diperlukan untuk merekam audio. '
                    'Silakan aktifkan di pengaturan!',
              ),
            ],
          ),
        ),
        const SizedBox(height: 40),
        // Signature
        const Center(
          child: Text(
            'FormGear Audio Recorder',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: Color(0xFF9CA3AF),
            ),
          ),
        ),
        const Spacer(flex: 3),
        // Action button
        _buildPermissionButton(),
        const Spacer(),
      ],
    );
  }

  Widget _buildRecordingView(BuildContext context, AudioRecorderState state) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: 20),
        // Greeting section with emoji
        Center(
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text(
                'Hello,',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w400,
                  color: Color(0xFF6B7280),
                ),
              ),
              const SizedBox(width: 12),
              Text(
                _getRecordingEmoji(state),
                style: const TextStyle(fontSize: 22),
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),
        // Main message
        RichText(
          textAlign: TextAlign.left,
          text: TextSpan(
            style: const TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w600,
              color: Color(0xFF1F2937),
              height: 1.4,
            ),
            children: _getMainMessageSpans(state),
          ),
        ),
        const SizedBox(height: 20),
        // Recording context info
        if (widget.dataKey != null || widget.templateName != null) ...[
          _buildRecordingContextInfo(),
          const SizedBox(height: 20),
        ],
        // Waveform visualization
        AnimatedSize(
          duration: const Duration(milliseconds: 400),
          curve: Curves.easeInOut,
          child: AnimatedSwitcher(
            duration: const Duration(milliseconds: 400),
            switchInCurve: Curves.easeInOut,
            switchOutCurve: Curves.easeInOut,
            transitionBuilder: (Widget child, Animation<double> animation) {
              return FadeTransition(
                opacity: animation,
                child: SlideTransition(
                  position:
                      Tween<Offset>(
                        begin: const Offset(0, -0.2),
                        end: Offset.zero,
                      ).animate(
                        CurvedAnimation(
                          parent: animation,
                          curve: Curves.easeOutCubic,
                        ),
                      ),
                  child: child,
                ),
              );
            },
            child:
                (state is AudioRecorderRecording ||
                    state is AudioRecorderPaused)
                ? Column(
                    key: const ValueKey('waveform'),
                    children: [
                      Center(child: _buildWaveformVisualization(state)),
                      const SizedBox(height: 20),
                    ],
                  )
                : const SizedBox.shrink(key: ValueKey('no-waveform')),
          ),
        ),
        // Duration display
        Center(child: _buildDurationDisplay(state)),
        const SizedBox(height: 24),
        // Signature
        const Center(
          child: Text(
            'FormGear Audio Recorder',
            style: TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.w400,
              color: Color(0xFF9CA3AF),
            ),
          ),
        ),
        const SizedBox(height: 16),
        // Control buttons
        _buildModernControlButtons(context, state),
        const SizedBox(height: 20),
      ],
    );
  }

  String _getRecordingEmoji(AudioRecorderState state) {
    if (state is AudioRecorderRecording) {
      return '🎙️';
    } else if (state is AudioRecorderPaused) {
      return '⏸️';
    } else if (state is AudioRecorderStopped) {
      return '✅';
    } else {
      return '🎵';
    }
  }

  List<TextSpan> _getMainMessageSpans(AudioRecorderState state) {
    if (state is AudioRecorderRecording) {
      return [
        const TextSpan(text: 'Sedang '),
        const TextSpan(
          text: 'merekam',
          style: TextStyle(
            color: Color(0xFFE91E63),
            fontWeight: FontWeight.w700,
          ),
        ),
        const TextSpan(
          text: ' audio Anda. Tap tombol pause atau stop!',
        ),
      ];
    } else if (state is AudioRecorderPaused) {
      return [
        const TextSpan(text: 'Rekaman '),
        const TextSpan(
          text: 'dijeda',
          style: TextStyle(
            color: Color(0xFFF59E0B),
            fontWeight: FontWeight.w700,
          ),
        ),
        const TextSpan(
          text: '. Tap resume untuk melanjutkan atau stop!',
        ),
      ];
    } else if (state is AudioRecorderStopped) {
      return [
        const TextSpan(text: 'Rekaman '),
        const TextSpan(
          text: 'selesai',
          style: TextStyle(
            color: Color(0xFF10B981),
            fontWeight: FontWeight.w700,
          ),
        ),
        const TextSpan(text: '! Tap simpan untuk menyimpan file audio.'),
      ];
    } else {
      return [
        const TextSpan(text: 'Siap untuk '),
        const TextSpan(
          text: 'merekam',
          style: TextStyle(
            color: Color(0xFF1E88E5),
            fontWeight: FontWeight.w700,
          ),
        ),
        const TextSpan(text: ' audio? Tap tombol record untuk memulai!'),
      ];
    }
  }

  Widget _buildDurationDisplay(AudioRecorderState state) {
    var duration = Duration.zero;
    var targetColor = const Color(0xFF1E88E5);
    var shouldPulse = false;

    if (state is AudioRecorderRecording) {
      duration = state.duration;
      targetColor = const Color(0xFF1E88E5);
      shouldPulse = true;
    } else if (state is AudioRecorderPaused) {
      duration = state.duration;
      targetColor = const Color(0xFF6B7280);
      shouldPulse = false;
    } else if (state is AudioRecorderStopped) {
      duration = state.duration;
      targetColor = const Color(0xFF10B981);
      shouldPulse = false;
    }

    return AnimatedBuilder(
      animation: _pulseAnimation,
      builder: (context, child) {
        return Transform.scale(
          scale: shouldPulse ? _pulseAnimation.value : 1.0,
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 300),
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
            decoration: BoxDecoration(
              color: targetColor.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: targetColor, width: 2),
              boxShadow: shouldPulse
                  ? [
                      BoxShadow(
                        color: targetColor.withValues(alpha: 0.3),
                        blurRadius: 8,
                        spreadRadius: 2,
                      ),
                    ]
                  : null,
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                AnimatedSwitcher(
                  duration: const Duration(milliseconds: 300),
                  child: Icon(
                    shouldPulse ? Icons.fiber_manual_record : Icons.access_time,
                    key: ValueKey(shouldPulse),
                    size: 20,
                    color: targetColor,
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  _formatDuration(duration),
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    fontFamily: 'monospace',
                    color: targetColor,
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildWaveformVisualization(AudioRecorderState state) {
    return AnimatedBuilder(
      animation: _waveAnimation,
      builder: (context, child) {
        return Container(
          height: 80,
          width: 280,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          decoration: BoxDecoration(
            color: Colors.grey.withValues(alpha: 0.05),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: Colors.grey.withValues(alpha: 0.1),
            ),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            crossAxisAlignment: CrossAxisAlignment.end,
            children: List.generate(20, (index) {
              const baseHeight = 8.0;
              final random = math.Random();
              final animatedHeight = state is AudioRecorderRecording
                  ? baseHeight +
                        (math.sin(
                              _waveAnimation.value * 2 * math.pi + index * 0.3,
                            ) *
                            15) +
                        (random.nextDouble() * 10)
                  : baseHeight + (math.sin(index * 0.3) * 8);

              final color = state is AudioRecorderRecording
                  ? const Color(0xFF1E88E5)
                  : const Color(0xFF6B7280);

              return AnimatedContainer(
                duration: Duration(
                  milliseconds: state is AudioRecorderRecording ? 100 : 300,
                ),
                width: 3,
                height: animatedHeight.clamp(4.0, 30.0),
                decoration: BoxDecoration(
                  color: color.withValues(
                    alpha: state is AudioRecorderRecording
                        ? 0.7 +
                              (math.sin(
                                    _waveAnimation.value * 4 * math.pi + index,
                                  ) *
                                  0.3)
                        : 0.5,
                  ),
                  borderRadius: BorderRadius.circular(2),
                ),
              );
            }),
          ),
        );
      },
    );
  }

  Widget _buildPermissionButton() {
    return SizedBox(
      width: double.infinity,
      height: 56,
      child: Container(
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            colors: [Color(0xFFE91E63), Color(0xFFC2185B)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
          borderRadius: BorderRadius.circular(28),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFFE91E63).withValues(alpha: 0.3),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: ElevatedButton(
          onPressed: _openAppSettings,
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.transparent,
            shadowColor: Colors.transparent,
            elevation: 0,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(28),
            ),
          ),
          child: const Text(
            'Buka Pengaturan',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: Colors.white,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildModernControlButtons(
    BuildContext context,
    AudioRecorderState state,
  ) {
    if (state is AudioRecorderStopped) {
      return ClipRect(
        child: AnimatedSwitcher(
          duration: const Duration(milliseconds: 400),
          transitionBuilder: (Widget child, Animation<double> animation) {
            return FadeTransition(
              opacity: animation,
              child: SlideTransition(
                position:
                    Tween<Offset>(
                      begin: const Offset(0, 0.2),
                      end: Offset.zero,
                    ).animate(
                      CurvedAnimation(
                        parent: animation,
                        curve: Curves.easeOutCubic,
                      ),
                    ),
                child: child,
              ),
            );
          },
          child: Column(
            key: const ValueKey('stopped'),
            children: [
              // Save button
              SizedBox(
                width: double.infinity,
                height: 56,
                child: Container(
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF10B981), Color(0xFF059669)],
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                    ),
                    borderRadius: BorderRadius.circular(28),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFF10B981).withValues(alpha: 0.3),
                        blurRadius: 12,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: ElevatedButton.icon(
                    onPressed: () => Navigator.of(context).pop(state.filePath),
                    icon: const Icon(Icons.check_circle, color: Colors.white),
                    label: const Text(
                      'Simpan Audio',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                        color: Colors.white,
                      ),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.transparent,
                      shadowColor: Colors.transparent,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(28),
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              // Discard button
              TextButton(
                onPressed: () {
                  context.read<AudioRecorderBloc>().add(CancelRecording());
                  Navigator.of(context).pop();
                },
                child: const Text(
                  'Buang Rekaman',
                  style: TextStyle(
                    fontSize: 16,
                    color: Color(0xFF6B7280),
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ],
          ),
        ),
      );
    } else if (state is AudioRecorderRecording) {
      // Recording state - show pause and stop buttons
      return ClipRect(
        child: AnimatedSwitcher(
          duration: const Duration(milliseconds: 400),
          transitionBuilder: (Widget child, Animation<double> animation) {
            return FadeTransition(
              opacity: animation,
              child: ScaleTransition(
                scale:
                    Tween<double>(
                      begin: 0.8,
                      end: 1,
                    ).animate(
                      CurvedAnimation(
                        parent: animation,
                        curve: Curves.easeOutBack,
                      ),
                    ),
                child: child,
              ),
            );
          },
          child: Row(
            key: const ValueKey('recording'),
            children: [
              // Pause button
              Expanded(
                child: SizedBox(
                  height: 56,
                  child: Container(
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFFF59E0B), Color(0xFFD97706)],
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                      ),
                      borderRadius: BorderRadius.circular(28),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFFF59E0B).withValues(alpha: 0.3),
                          blurRadius: 12,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: ElevatedButton.icon(
                      onPressed: () {
                        context.read<AudioRecorderBloc>().add(PauseRecording());
                      },
                      icon: const Icon(Icons.pause, color: Colors.white),
                      label: const Text(
                        'Jeda',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Colors.white,
                        ),
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.transparent,
                        shadowColor: Colors.transparent,
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(28),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 16),
              // Stop button
              Expanded(
                child: SizedBox(
                  height: 56,
                  child: Container(
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFFE91E63), Color(0xFFC2185B)],
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                      ),
                      borderRadius: BorderRadius.circular(28),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFFE91E63).withValues(alpha: 0.3),
                          blurRadius: 12,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: ElevatedButton.icon(
                      onPressed: () {
                        context.read<AudioRecorderBloc>().add(StopRecording());
                      },
                      icon: const Icon(Icons.stop, color: Colors.white),
                      label: const Text(
                        'Stop',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Colors.white,
                        ),
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.transparent,
                        shadowColor: Colors.transparent,
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(28),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      );
    } else if (state is AudioRecorderPaused) {
      // Paused state - show resume and stop buttons
      return ClipRect(
        child: AnimatedSwitcher(
          duration: const Duration(milliseconds: 400),
          transitionBuilder: (Widget child, Animation<double> animation) {
            return FadeTransition(
              opacity: animation,
              child: ScaleTransition(
                scale:
                    Tween<double>(
                      begin: 0.8,
                      end: 1,
                    ).animate(
                      CurvedAnimation(
                        parent: animation,
                        curve: Curves.easeOutBack,
                      ),
                    ),
                child: child,
              ),
            );
          },
          child: Row(
            key: const ValueKey('paused'),
            children: [
              // Resume button
              Expanded(
                child: SizedBox(
                  height: 56,
                  child: Container(
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF10B981), Color(0xFF059669)],
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                      ),
                      borderRadius: BorderRadius.circular(28),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF10B981).withValues(alpha: 0.3),
                          blurRadius: 12,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: ElevatedButton.icon(
                      onPressed: () {
                        context.read<AudioRecorderBloc>().add(
                          ResumeRecording(),
                        );
                      },
                      icon: const Icon(Icons.play_arrow, color: Colors.white),
                      label: const Text(
                        'Lanjut',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Colors.white,
                        ),
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.transparent,
                        shadowColor: Colors.transparent,
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(28),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 16),
              // Stop button
              Expanded(
                child: SizedBox(
                  height: 56,
                  child: Container(
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFFE91E63), Color(0xFFC2185B)],
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                      ),
                      borderRadius: BorderRadius.circular(28),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFFE91E63).withValues(alpha: 0.3),
                          blurRadius: 12,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: ElevatedButton.icon(
                      onPressed: () {
                        context.read<AudioRecorderBloc>().add(StopRecording());
                      },
                      icon: const Icon(Icons.stop, color: Colors.white),
                      label: const Text(
                        'Stop',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Colors.white,
                        ),
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.transparent,
                        shadowColor: Colors.transparent,
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(28),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      );
    } else {
      // Ready state - show start recording button
      return ClipRect(
        child: AnimatedSwitcher(
          duration: const Duration(milliseconds: 400),
          transitionBuilder: (Widget child, Animation<double> animation) {
            return FadeTransition(
              opacity: animation,
              child: ScaleTransition(
                scale:
                    Tween<double>(
                      begin: 0.8,
                      end: 1,
                    ).animate(
                      CurvedAnimation(
                        parent: animation,
                        curve: Curves.elasticOut,
                      ),
                    ),
                child: child,
              ),
            );
          },
          child: SizedBox(
            key: const ValueKey('ready'),
            width: double.infinity,
            height: 56,
            child: Container(
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF1E88E5), Color(0xFF42D9FF)],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                ),
                borderRadius: BorderRadius.circular(28),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF1E88E5).withValues(alpha: 0.3),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: ElevatedButton.icon(
                onPressed: () {
                  context.read<AudioRecorderBloc>().add(
                    StartRecording(
                      assignmentId: widget.assignmentId,
                      fileName: widget.fileName,
                    ),
                  );
                },
                icon: const Icon(Icons.mic, color: Colors.white),
                label: const Text(
                  'Mulai Rekam',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                  ),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.transparent,
                  shadowColor: Colors.transparent,
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(28),
                  ),
                ),
              ),
            ),
          ),
        ),
      );
    }
  }

  Widget _buildRecordingContextInfo() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            const Color(0xFF1E88E5).withValues(alpha: 0.08),
            const Color(0xFF42D9FF).withValues(alpha: 0.05),
          ],
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: const Color(0xFF1E88E5).withValues(alpha: 0.2),
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF1E88E5).withValues(alpha: 0.1),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF1E88E5), Color(0xFF42D9FF)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF1E88E5).withValues(alpha: 0.3),
                      blurRadius: 6,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: const Icon(
                  Icons.mic_outlined,
                  color: Colors.white,
                  size: 20,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Konteks Perekaman',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF1E88E5),
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'Audio ini akan disimpan untuk survey',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                        color: Colors.grey.shade600,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          if (widget.dataKey != null || widget.templateName != null) ...[
            const SizedBox(height: 20),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.7),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: Colors.grey.withValues(alpha: 0.1),
                ),
              ),
              child: widget.templateName != null && widget.dataKey != null
                  ? AnimatedBuilder(
                      animation: _contextSwitchAnimation,
                      builder: (context, child) {
                        return Column(
                          children: [
                            SizedBox(
                              height: 60,
                              child: Stack(
                                children: [
                                  // Template info
                                  AnimatedPositioned(
                                    duration: const Duration(milliseconds: 600),
                                    curve: Curves.easeInOut,
                                    top: _showTemplate
                                        ? 0
                                        : -60 *
                                              (1 -
                                                  _contextSwitchAnimation
                                                      .value),
                                    left: 0,
                                    right: 0,
                                    child: AnimatedOpacity(
                                      duration: const Duration(
                                        milliseconds: 300,
                                      ),
                                      opacity: _showTemplate ? 1.0 : 0.0,
                                      child: _buildEnhancedInfoRow(
                                        'Template Survey',
                                        widget.templateName!,
                                        Icons.description_outlined,
                                        const Color(0xFF10B981),
                                      ),
                                    ),
                                  ),
                                  // Field input info
                                  AnimatedPositioned(
                                    duration: const Duration(milliseconds: 600),
                                    curve: Curves.easeInOut,
                                    top: !_showTemplate
                                        ? 0
                                        : 60 *
                                              (1 -
                                                  _contextSwitchAnimation
                                                      .value),
                                    left: 0,
                                    right: 0,
                                    child: AnimatedOpacity(
                                      duration: const Duration(
                                        milliseconds: 300,
                                      ),
                                      opacity: !_showTemplate ? 1.0 : 0.0,
                                      child: _buildEnhancedInfoRow(
                                        'Field Input',
                                        widget.dataKey!,
                                        Icons.input_outlined,
                                        const Color(0xFF8B5CF6),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 12),
                            // Indicator dots
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                _buildIndicatorDot(_showTemplate),
                                const SizedBox(width: 8),
                                _buildIndicatorDot(!_showTemplate),
                              ],
                            ),
                          ],
                        );
                      },
                    )
                  : Column(
                      children: [
                        if (widget.templateName != null)
                          _buildEnhancedInfoRow(
                            'Template Survey',
                            widget.templateName!,
                            Icons.description_outlined,
                            const Color(0xFF10B981),
                          ),
                        if (widget.dataKey != null &&
                            widget.templateName == null)
                          _buildEnhancedInfoRow(
                            'Field Input',
                            widget.dataKey!,
                            Icons.input_outlined,
                            const Color(0xFF8B5CF6),
                          ),
                      ],
                    ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildEnhancedInfoRow(
    String label,
    String value,
    IconData icon,
    Color color,
  ) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 32,
          height: 32,
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(
            icon,
            size: 16,
            color: color,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: color,
                  letterSpacing: 0.5,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                value,
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF1F2937),
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildIndicatorDot(bool isActive) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 300),
      width: isActive ? 16 : 6,
      height: 6,
      decoration: BoxDecoration(
        color: isActive
            ? const Color(0xFF1E88E5)
            : Colors.grey.withValues(alpha: 0.3),
        borderRadius: BorderRadius.circular(3),
      ),
    );
  }

  Widget _buildLoadingView() {
    return const Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Spacer(flex: 2),
        Center(
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                'Sedang memeriksa,',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w400,
                  color: Color(0xFF6B7280),
                ),
              ),
              SizedBox(width: 12),
              Text(
                '⏳',
                style: TextStyle(fontSize: 24),
              ),
            ],
          ),
        ),
        SizedBox(height: 32),
        Center(
          child: CircularProgressIndicator(
            color: Color(0xFF1E88E5),
          ),
        ),
        SizedBox(height: 24),
        Text(
          'Memeriksa izin aplikasi...',
          style: TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.w600,
            color: Color(0xFF1F2937),
            height: 1.3,
          ),
          textAlign: TextAlign.left,
        ),
        Spacer(flex: 3),
      ],
    );
  }

  void _showPermissionConsentScreen(BuildContext context) {
    const permissions = [
      PermissionConsentItem(
        permission: Permission.microphone,
        title: 'Akses Mikrofon',
        description:
            'Dibutuhkan untuk merekam audio dengan kualitas terbaik. '
            'File audio akan disimpan di penyimpanan internal aplikasi.',
        icon: Icons.mic,
        color: Color(0xFFE91E63),
      ),
    ];

    PermissionConsentScreen.show(
      context: context,
      title: 'Izin diperlukan untuk merekam audio',
      subtitle:
          'Aplikasi memerlukan akses mikrofon untuk merekam audio. '
          'File audio akan disimpan secara otomatis di penyimpanan internal '
          'aplikasi dan hanya digunakan untuk keperluan formulir.',
      permissions: permissions,
      emoji: '🎙️',
      onPermissionsGranted: () {
        context.read<AudioRecorderBloc>().add(PermissionsGranted());
      },
      onPermissionsDenied: () {
        context.read<AudioRecorderBloc>().add(PermissionsDenied());
      },
    );
  }

  Widget _buildConfirmationView(
    BuildContext context,
    AudioRecorderShowingConfirmation state,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: 20),
        // Header with emoji and title
        Center(
          child: Column(
            children: [
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: const Color(0xFF10B981).withValues(alpha: 0.1),
                  shape: BoxShape.circle,
                ),
                child: const Text(
                  '✅',
                  style: TextStyle(fontSize: 40),
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                'Rekaman Selesai!',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF1F2937),
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Durasi: ${_formatDuration(state.duration)}',
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.grey[600],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 32),

        // Playback section
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.05),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            children: [
              const Text(
                'Preview Rekaman',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF1F2937),
                ),
              ),
              const SizedBox(height: 20),

              // Progress bar (only show if audio has duration)
              if (state.totalDuration != null) ...[
                Column(
                  children: [
                    // Time display
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          _formatDuration(state.playbackPosition),
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w500,
                            color: Color(0xFF6B7280),
                            fontFamily: 'monospace',
                          ),
                        ),
                        Text(
                          _formatDuration(state.totalDuration!),
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w500,
                            color: Color(0xFF6B7280),
                            fontFamily: 'monospace',
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    // Progress bar
                    Container(
                      height: 6,
                      decoration: BoxDecoration(
                        color: Colors.grey.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(3),
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(3),
                        child: LinearProgressIndicator(
                          value:
                              (state.playbackPosition.inMilliseconds /
                                      state.totalDuration!.inMilliseconds)
                                  .clamp(0.0, 1.0),
                          backgroundColor: Colors.transparent,
                          valueColor: AlwaysStoppedAnimation<Color>(
                            state.isPlaying
                                ? const Color(0xFF1E88E5)
                                : const Color(0xFF6B7280),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
              ],

              // Playback button
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: state.isPlaying
                        ? [
                            const Color(0xFFEF4444),
                            const Color(0xFFDC2626),
                          ]
                        : [
                            const Color(0xFF1E88E5),
                            const Color(0xFF1976D2),
                          ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color:
                          (state.isPlaying
                                  ? const Color(0xFFEF4444)
                                  : const Color(0xFF1E88E5))
                              .withValues(alpha: 0.3),
                      blurRadius: 12,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Material(
                  color: Colors.transparent,
                  child: InkWell(
                    borderRadius: BorderRadius.circular(40),
                    onTap: () {
                      if (state.isPlaying) {
                        context.read<AudioRecorderBloc>().add(StopPlayback());
                      } else {
                        context.read<AudioRecorderBloc>().add(StartPlayback());
                      }
                    },
                    child: Icon(
                      state.isPlaying ? Icons.stop : Icons.play_arrow,
                      color: Colors.white,
                      size: 32,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 12),
              Text(
                state.isPlaying
                    ? (state.totalDuration != null
                          ? 'Memutar ${_formatDuration(state.playbackPosition)} / ${_formatDuration(state.totalDuration!)}'
                          : 'Sedang memutar...')
                    : 'Tap untuk memutar',
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.grey[600],
                ),
              ),
            ],
          ),
        ),
        const Spacer(),

        // Action buttons
        Column(
          children: [
            // Keep recording button
            SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton(
                onPressed: () {
                  context.read<AudioRecorderBloc>().add(KeepRecording());
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF10B981),
                  foregroundColor: Colors.white,
                  elevation: 0,
                  shadowColor: const Color(0xFF10B981).withValues(alpha: 0.3),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.check_circle_rounded, size: 24),
                    SizedBox(width: 12),
                    Text(
                      'Simpan Rekaman',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),

            // Secondary actions row
            Row(
              children: [
                // Re-record button
                Expanded(
                  child: SizedBox(
                    height: 48,
                    child: OutlinedButton(
                      onPressed: () {
                        context.read<AudioRecorderBloc>().add(
                          ReRecordAudio(
                            assignmentId: widget.assignmentId,
                            fileName: widget.fileName,
                          ),
                        );
                      },
                      style: OutlinedButton.styleFrom(
                        foregroundColor: const Color(0xFF1E88E5),
                        side: const BorderSide(
                          color: Color(0xFF1E88E5),
                          width: 2,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.refresh_rounded, size: 20),
                          SizedBox(width: 8),
                          Text(
                            'Rekam Ulang',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                // Delete button
                Expanded(
                  child: SizedBox(
                    height: 48,
                    child: OutlinedButton(
                      onPressed: () {
                        context.read<AudioRecorderBloc>().add(
                          DeleteRecording(),
                        );
                      },
                      style: OutlinedButton.styleFrom(
                        foregroundColor: const Color(0xFFEF4444),
                        side: const BorderSide(
                          color: Color(0xFFEF4444),
                          width: 2,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.delete_rounded, size: 20),
                          SizedBox(width: 8),
                          Text(
                            'Hapus',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
        const SizedBox(height: 20),
      ],
    );
  }
}
