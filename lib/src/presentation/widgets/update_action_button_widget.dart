import 'dart:async';
import 'package:flutter/material.dart';

class UpdateActionButtonWidget extends StatefulWidget {
  const UpdateActionButtonWidget({
    required this.onPressed,
    required this.text,
    this.isLoading = false,
    this.loadingText,
    this.progress,
    this.isCompleted = false,
    this.completedText = 'Unduhan Selesai!',
    super.key,
  });

  final VoidCallback? onPressed;
  final String text;
  final bool isLoading;
  final String? loadingText;
  final int? progress;
  final bool isCompleted;
  final String completedText;

  @override
  State<UpdateActionButtonWidget> createState() =>
      _UpdateActionButtonWidgetState();
}

class _UpdateActionButtonWidgetState extends State<UpdateActionButtonWidget>
    with TickerProviderStateMixin {
  late AnimationController _buttonController;
  late AnimationController _progressController;
  late AnimationController _completionController;
  late Animation<double> _buttonAnimation;
  late Animation<double> _progressAnimation;
  late Animation<double> _completionAnimation;
  late Animation<double> _checkScaleAnimation;

  int _currentTextIndex = 0;
  Timer? _textCycleTimer;

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
  }

  @override
  void didUpdateWidget(UpdateActionButtonWidget oldWidget) {
    super.didUpdateWidget(oldWidget);

    if (widget.isLoading != oldWidget.isLoading) {
      if (widget.isLoading) {
        _buttonController.forward();
        _progressController.forward();
        _completionController.reset();
        _startTextCycling();
      } else {
        _buttonController.reverse();
        _progressController.reverse();
        _stopTextCycling();
      }
    }

    if (widget.isCompleted != oldWidget.isCompleted) {
      if (widget.isCompleted) {
        _stopTextCycling();
        _completionController.forward();
        // Auto-dismiss after showing success for 2 seconds
        Future.delayed(const Duration(seconds: 2), () {
          if (mounted && widget.isCompleted) {
            Navigator.of(context).pop();
          }
        });
      } else {
        _completionController.reset();
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

  @override
  void dispose() {
    _stopTextCycling();
    _buttonController.dispose();
    _progressController.dispose();
    _completionController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: Listenable.merge([
        _buttonController,
        _progressController,
        _completionController,
      ]),
      builder: (context, child) {
        return Column(
          children: [
            // Progress bar with smooth show/hide animation
            AnimatedContainer(
              duration: const Duration(milliseconds: 400),
              curve: Curves.easeInOut,
              height: (widget.isLoading || widget.isCompleted) ? 8 : 0,
              margin: const EdgeInsets.only(bottom: 12),
              child: AnimatedOpacity(
                opacity: widget.isCompleted ? 1.0 : _progressAnimation.value,
                duration: const Duration(milliseconds: 400),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(4),
                  child: LinearProgressIndicator(
                    value: widget.isCompleted
                        ? 1.0
                        : (widget.progress != null
                              ? widget.progress! / 100.0
                              : null),
                    backgroundColor: widget.isCompleted
                        ? const Color(0xFF10B981).withValues(alpha: 0.2)
                        : const Color(0xFF1E88E5).withValues(alpha: 0.2),
                    valueColor: AlwaysStoppedAnimation<Color>(
                      widget.isCompleted
                          ? const Color(0xFF10B981)
                          : const Color(0xFF1E88E5),
                    ),
                    minHeight: 8,
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
                    onPressed: widget.isLoading ? null : widget.onPressed,
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
                                  child: Text(
                                    widget.completedText,
                                    style: const TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w600,
                                      color: Colors.white,
                                    ),
                                  ),
                                ),
                              ],
                            )
                          : widget.isLoading
                          ? Row(
                              key: const ValueKey('loading'),
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                const SizedBox(
                                  width: 20,
                                  height: 20,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2.5,
                                    valueColor: AlwaysStoppedAnimation<Color>(
                                      Colors.white,
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  crossAxisAlignment: CrossAxisAlignment.start,
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
