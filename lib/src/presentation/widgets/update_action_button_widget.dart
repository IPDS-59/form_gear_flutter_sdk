import 'dart:async';
import 'package:flutter/material.dart';
import 'package:percent_indicator/percent_indicator.dart';

class UpdateActionButtonWidget extends StatefulWidget {
  const UpdateActionButtonWidget({
    required this.onPressed,
    required this.text,
    this.isLoading = false,
    this.loadingText,
    this.progress,
    this.isCompleted = false,
    this.completedText = 'Unduhan Selesai!',
    this.isForced = false,
    super.key,
  });

  final VoidCallback? onPressed;
  final String text;
  final bool isLoading;
  final String? loadingText;
  final int? progress;
  final bool isCompleted;
  final String completedText;
  final bool isForced;

  @override
  State<UpdateActionButtonWidget> createState() =>
      _UpdateActionButtonWidgetState();
}

class _UpdateActionButtonWidgetState extends State<UpdateActionButtonWidget>
    with TickerProviderStateMixin {
  late AnimationController _buttonController;
  late AnimationController _progressController;
  late AnimationController _completionController;
  late AnimationController _downloadArrowController;
  late Animation<double> _buttonAnimation;
  late Animation<double> _progressAnimation;
  late Animation<double> _completionAnimation;
  late Animation<double> _checkScaleAnimation;
  late Animation<double> _downloadArrowAnimation;

  int _currentTextIndex = 0;
  Timer? _textCycleTimer;
  Timer? _countdownTimer;
  int _countdownSeconds = 5;

  final List<String> _loadingTexts = [
    'Mengunduh...',
    'Sedang mempersiapkan...',
    'Hanya beberapa menit...',
    'Hampir selesai...',
    'Tunggu sebentar...',
    'Proses berlangsung...',
  ];

  @override
  void initState() {
    super.initState();

    _buttonController = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );

    _progressController = AnimationController(
      duration: const Duration(milliseconds: 400),
      vsync: this,
    );

    _completionController = AnimationController(
      duration: const Duration(milliseconds: 600),
      vsync: this,
    );

    _downloadArrowController = AnimationController(
      duration: const Duration(seconds: 1),
      vsync: this,
    );

    _buttonAnimation =
        Tween<double>(
          begin: 1,
          end: 0.95,
        ).animate(
          CurvedAnimation(
            parent: _buttonController,
            curve: Curves.easeInOut,
          ),
        );

    _progressAnimation =
        Tween<double>(
          begin: 0,
          end: 1,
        ).animate(
          CurvedAnimation(
            parent: _progressController,
            curve: Curves.easeInOut,
          ),
        );

    _completionAnimation =
        Tween<double>(
          begin: 0,
          end: 1,
        ).animate(
          CurvedAnimation(
            parent: _completionController,
            curve: Curves.easeOut,
          ),
        );

    _checkScaleAnimation =
        Tween<double>(
          begin: 0,
          end: 1,
        ).animate(
          CurvedAnimation(
            parent: _completionController,
            curve: const Interval(0.2, 0.8, curve: Curves.elasticOut),
          ),
        );

    _downloadArrowAnimation =
        Tween<double>(
          begin: -4,
          end: 4,
        ).animate(
          CurvedAnimation(
            parent: _downloadArrowController,
            curve: Curves.easeInOut,
          ),
        );
  }

  @override
  void didUpdateWidget(UpdateActionButtonWidget oldWidget) {
    super.didUpdateWidget(oldWidget);

    if (widget.isLoading != oldWidget.isLoading) {
      if (widget.isLoading) {
        _buttonController.forward();
        _progressController.forward();
        _completionController.reset();
        _downloadArrowController.repeat(reverse: true);
        _startTextCycling();
      } else {
        _buttonController.reverse();
        _progressController.reverse();
        _downloadArrowController.stop();
        _stopTextCycling();
      }
    }

    if (widget.isCompleted != oldWidget.isCompleted) {
      if (widget.isCompleted) {
        _stopTextCycling();
        _completionController.forward();

        if (widget.isForced) {
          // For forced updates, start countdown timer
          _startCountdownTimer();
        } else {
          // For optional updates, auto-dismiss after showing success
          Future<void>.delayed(const Duration(seconds: 2), () {
            if (mounted && widget.isCompleted) {
              Navigator.of(context).pop();
            }
          });
        }
      } else {
        _completionController.reset();
        _stopCountdownTimer();
      }
    }
  }

  void _startTextCycling() {
    _currentTextIndex = 0;
    _textCycleTimer = Timer.periodic(const Duration(seconds: 2), (timer) {
      if (mounted) {
        setState(() {
          _currentTextIndex = (_currentTextIndex + 1) % _loadingTexts.length;
        });
      }
    });
  }

  void _stopTextCycling() {
    _textCycleTimer?.cancel();
    _textCycleTimer = null;
  }

  void _startCountdownTimer() {
    _countdownSeconds = 5;
    _countdownTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (mounted) {
        setState(() {
          _countdownSeconds--;
        });

        if (_countdownSeconds <= 0) {
          _stopCountdownTimer();
          if (mounted) {
            Navigator.of(context).pop();
          }
        }
      }
    });
  }

  void _stopCountdownTimer() {
    _countdownTimer?.cancel();
    _countdownTimer = null;
  }

  @override
  void dispose() {
    _stopTextCycling();
    _stopCountdownTimer();
    _buttonController.dispose();
    _progressController.dispose();
    _completionController.dispose();
    _downloadArrowController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: Listenable.merge([
        _buttonController,
        _progressController,
        _completionController,
        _downloadArrowController,
      ]),
      builder: (context, child) {
        return Column(
          children: [
            // Progress bar with smooth show/hide animation
            AnimatedContainer(
              duration: const Duration(milliseconds: 400),
              curve: Curves.easeInOut,
              height: (widget.isLoading || widget.isCompleted) ? 20 : 0,
              margin: const EdgeInsets.only(bottom: 12),
              child: Center(
                child: AnimatedOpacity(
                  opacity: widget.isCompleted ? 1.0 : _progressAnimation.value,
                  duration: const Duration(milliseconds: 400),
                  child: Builder(
                    builder: (context) {
                      final screenWidth = MediaQuery.sizeOf(context).width;
                      final progressWidth =
                          screenWidth - 64; // 32px padding on each side

                      return LinearPercentIndicator(
                        width: progressWidth,
                        lineHeight: 8,
                        percent: widget.isCompleted
                            ? 1.0
                            : (widget.progress != null
                                  ? widget.progress! / 100.0
                                  : 0.0),
                        backgroundColor: widget.isCompleted
                            ? const Color(0xFF10B981).withValues(alpha: 0.2)
                            : const Color(0xFF1E88E5).withValues(alpha: 0.2),
                        linearGradient: LinearGradient(
                          colors: widget.isCompleted
                              ? [
                                  const Color(0xFF10B981),
                                  const Color(0xFF059669),
                                ]
                              : [
                                  const Color(0xFF1E88E5),
                                  const Color(0xFF42D9FF),
                                ],
                        ),
                        barRadius: const Radius.circular(4),
                        animation: true,
                        animateFromLastPercent: true,
                      );
                    },
                  ),
                ),
              ),
            ),
            // Main button with scale animation
            Transform.scale(
              scale: _buttonAnimation.value,
              child: SizedBox(
                width: double.infinity,
                height: 56,
                child: Container(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: widget.isCompleted
                          ? [const Color(0xFF10B981), const Color(0xFF059669)]
                          : [const Color(0xFF1E88E5), const Color(0xFF42D9FF)],
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                    ),
                    borderRadius: BorderRadius.circular(28),
                    boxShadow: [
                      BoxShadow(
                        color: widget.isCompleted
                            ? const Color(0xFF10B981).withValues(alpha: 0.3)
                            : const Color(0xFF1E88E5).withValues(alpha: 0.3),
                        blurRadius: 12,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: ElevatedButton(
                    onPressed:
                        (widget.isLoading ||
                            (widget.isCompleted && widget.isForced))
                        ? null
                        : widget.onPressed,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.transparent,
                      shadowColor: Colors.transparent,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(28),
                      ),
                    ),
                    child: AnimatedSwitcher(
                      duration: const Duration(milliseconds: 300),
                      child: widget.isCompleted
                          ? Row(
                              key: const ValueKey('completed'),
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Transform.scale(
                                  scale: _checkScaleAnimation.value,
                                  child: const Icon(
                                    Icons.check_circle,
                                    color: Colors.white,
                                    size: 24,
                                  ),
                                ),
                                const SizedBox(width: 12),
                                FadeTransition(
                                  opacity: _completionAnimation,
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Text(
                                        widget.completedText,
                                        style: const TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.w600,
                                          color: Colors.white,
                                        ),
                                        textAlign: TextAlign.center,
                                      ),
                                      if (widget.isForced &&
                                          _countdownTimer != null) ...[
                                        const SizedBox(height: 2),
                                        Text(
                                          'Otomatis tutup dalam '
                                          '$_countdownSeconds detik',
                                          style: const TextStyle(
                                            fontSize: 12,
                                            fontWeight: FontWeight.normal,
                                            color: Colors.white,
                                          ),
                                          textAlign: TextAlign.center,
                                        ),
                                      ],
                                    ],
                                  ),
                                ),
                              ],
                            )
                          : widget.isLoading
                          ? Row(
                              key: const ValueKey('loading'),
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                SizedBox(
                                  width: 20,
                                  height: 20,
                                  child: Transform.translate(
                                    offset: Offset(
                                      0,
                                      _downloadArrowAnimation.value,
                                    ),
                                    child: const Icon(
                                      Icons.arrow_downward,
                                      color: Colors.white,
                                      size: 20,
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 12),
                                AnimatedSize(
                                  duration: const Duration(milliseconds: 500),
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      AnimatedSwitcher(
                                        duration: const Duration(
                                          milliseconds: 500,
                                        ),
                                        child: Text(
                                          _loadingTexts[_currentTextIndex],
                                          key: ValueKey(_currentTextIndex),
                                          style: const TextStyle(
                                            fontSize: 16,
                                            fontWeight: FontWeight.w600,
                                            color: Colors.white,
                                          ),
                                        ),
                                      ),
                                      if (widget.progress != null)
                                        Text(
                                          '${widget.progress}%',
                                          style: const TextStyle(
                                            fontSize: 12,
                                            fontWeight: FontWeight.w500,
                                            color: Colors.white70,
                                          ),
                                        ),
                                    ],
                                  ),
                                ),
                              ],
                            )
                          : Text(
                              key: const ValueKey('normal'),
                              widget.text,
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w600,
                                color: Colors.white,
                              ),
                            ),
                    ),
                  ),
                ),
              ),
            ),
          ],
        );
      },
    );
  }
}
