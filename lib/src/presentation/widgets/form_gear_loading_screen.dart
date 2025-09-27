import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

/// A modern loading screen widget for FormGear with logo and animated progress
class FormGearLoadingScreen extends StatefulWidget {
  const FormGearLoadingScreen({
    required this.loadingProgress,
    super.key,
  });

  /// The current loading progress (0-100)
  final int loadingProgress;

  @override
  State<FormGearLoadingScreen> createState() => _FormGearLoadingScreenState();
}

class _FormGearLoadingScreenState extends State<FormGearLoadingScreen> {
  int _currentTextIndex = 0;
  Timer? _textCycleTimer;

  final List<String> _loadingTexts = [
    'Memulai FormGear...',
    'Menyiapkan environment...',
    'Memuat komponen...',
    'Mengonfigurasi sistem...',
    'Hampir siap...',
    'Finishing touches...',
  ];

  @override
  void initState() {
    super.initState();
    _startTextCycling();
  }

  @override
  void dispose() {
    _stopTextCycling();
    super.dispose();
  }

  @override
  void didUpdateWidget(FormGearLoadingScreen oldWidget) {
    super.didUpdateWidget(oldWidget);

    // Update text based on progress changes
    if (widget.loadingProgress != oldWidget.loadingProgress) {
      _updateTextBasedOnProgress();
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

  void _updateTextBasedOnProgress() {
    final progress = widget.loadingProgress;
    int newIndex;

    if (progress < 20) {
      newIndex = 0; // Memulai FormGear...
    } else if (progress < 40) {
      newIndex = 1; // Menyiapkan environment...
    } else if (progress < 60) {
      newIndex = 2; // Memuat komponen...
    } else if (progress < 80) {
      newIndex = 3; // Mengonfigurasi sistem...
    } else if (progress < 95) {
      newIndex = 4; // Hampir siap...
    } else {
      newIndex = 5; // Finishing touches...
    }

    if (newIndex != _currentTextIndex && mounted) {
      setState(() {
        _currentTextIndex = newIndex;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            Color(0xFFF8F9FA), // Light gray-white
            Color(0xFFFFFFFF), // Pure white
          ],
        ),
      ),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Animated FormGear logo with subtle pulse effect
            const _AnimatedLogo(),
            const SizedBox(height: 32),

            // Loading text with modern typography and animation
            AnimatedSwitcher(
              duration: const Duration(milliseconds: 500),
              child: Text(
                _loadingTexts[_currentTextIndex],
                key: ValueKey(_currentTextIndex),
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.w600,
                  color: const Color(0xFF1F2937), // Dark gray
                  letterSpacing: -0.5,
                ),
              ),
            ),
            const SizedBox(height: 8),

            // Subtitle text with animation
            AnimatedSwitcher(
              duration: const Duration(milliseconds: 400),
              child: Text(
                _getSubtitleText(),
                key: ValueKey('${_currentTextIndex}_subtitle'),
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: const Color(0xFF6B7280), // Medium gray
                  fontWeight: FontWeight.w400,
                ),
              ),
            ),
            const SizedBox(height: 40),

            // Modern progress bar with rounded corners and gradient
            _ProgressBar(loadingProgress: widget.loadingProgress),
            const SizedBox(height: 16),

            // Progress percentage with modern styling
            _ProgressPercentage(loadingProgress: widget.loadingProgress),
          ],
        ),
      ),
    );
  }

  String _getSubtitleText() {
    final progress = widget.loadingProgress;

    if (progress < 20) {
      return 'Memulai pengalaman form terbaik';
    } else if (progress < 40) {
      return 'Menyiapkan semua yang diperlukan';
    } else if (progress < 60) {
      return 'Memuat fitur-fitur canggih';
    } else if (progress < 80) {
      return 'Mengoptimalkan performa';
    } else if (progress < 95) {
      return 'Tinggal sedikit lagi';
    } else {
      return 'Siap untuk digunakan!';
    }
  }
}

/// Animated logo widget with continuous pulse and shimmer effects
class _AnimatedLogo extends StatefulWidget {
  const _AnimatedLogo();

  @override
  State<_AnimatedLogo> createState() => _AnimatedLogoState();
}

class _AnimatedLogoState extends State<_AnimatedLogo>
    with TickerProviderStateMixin {
  late AnimationController _pulseController;
  late AnimationController _shimmerController;
  late Animation<double> _pulseAnimation;
  late Animation<double> _shimmerAnimation;

  @override
  void initState() {
    super.initState();

    // Continuous pulse animation
    _pulseController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );
    _pulseAnimation =
        Tween<double>(
          begin: 0.95,
          end: 1.05,
        ).animate(
          CurvedAnimation(
            parent: _pulseController,
            curve: Curves.easeInOut,
          ),
        );

    // Shimmer animation
    _shimmerController = AnimationController(
      duration: const Duration(milliseconds: 2500),
      vsync: this,
    );
    _shimmerAnimation =
        Tween<double>(
          begin: 0,
          end: 1,
        ).animate(
          CurvedAnimation(
            parent: _shimmerController,
            curve: Curves.linear,
          ),
        );

    // Start continuous animations
    _pulseController.repeat(reverse: true);
    _shimmerController.repeat();
  }

  @override
  void dispose() {
    _pulseController.dispose();
    _shimmerController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: Listenable.merge([_pulseController, _shimmerController]),
      builder: (context, child) {
        return Transform.scale(
          scale: _pulseAnimation.value,
          child: SizedBox(
            width: 120,
            height: 120,
            child: Stack(
              children: [
                // Main logo without background
                Center(
                  child: SvgPicture.asset(
                    'packages/form_gear_engine_sdk/assets/logo/form-gear.svg',
                    width: 88,
                    height: 88,
                  ),
                ),
                // Shimmer overlay
                Positioned.fill(
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(16),
                    child: Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment(
                            -2.0 + (_shimmerAnimation.value * 4.0),
                            -2.0 + (_shimmerAnimation.value * 4.0),
                          ),
                          end: Alignment(
                            -0.5 + (_shimmerAnimation.value * 4.0),
                            -0.5 + (_shimmerAnimation.value * 4.0),
                          ),
                          colors: [
                            Colors.transparent,
                            const Color(0xFF1E88E5).withValues(alpha: 0.08),
                            const Color(0xFF42D9FF).withValues(alpha: 0.15),
                            const Color(0xFF1E88E5).withValues(alpha: 0.08),
                            Colors.transparent,
                          ],
                          stops: const [0.0, 0.35, 0.5, 0.65, 1.0],
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

/// Progress bar widget with FormGear brand colors
class _ProgressBar extends StatelessWidget {
  const _ProgressBar({
    required this.loadingProgress,
  });

  final int loadingProgress;

  @override
  Widget build(BuildContext context) {
    final progress = loadingProgress > 0 ? loadingProgress / 100.0 : 0.0;

    return Container(
      width: 240,
      height: 8,
      decoration: BoxDecoration(
        color: const Color(0xFFE5E7EB), // Light gray background
        borderRadius: BorderRadius.circular(4),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(4),
        child: Stack(
          children: [
            // Gradient progress bar
            FractionallySizedBox(
              alignment: Alignment.centerLeft,
              widthFactor: progress,
              child: Container(
                height: 8,
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      Color(0xFF1E88E5), // FormGear primary blue
                      Color(0xFF42D9FF), // FormGear light blue
                    ],
                  ),
                  borderRadius: BorderRadius.all(Radius.circular(4)),
                ),
              ),
            ),
            // Subtle shine effect
            if (loadingProgress > 0 && loadingProgress < 100)
              Positioned(
                left: (240 * progress) - 20,
                child: Container(
                  width: 20,
                  height: 8,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        Colors.white.withValues(alpha: 0),
                        Colors.white.withValues(alpha: 0.3),
                        Colors.white.withValues(alpha: 0),
                      ],
                    ),
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

/// Progress percentage widget with FormGear brand colors
class _ProgressPercentage extends StatelessWidget {
  const _ProgressPercentage({
    required this.loadingProgress,
  });

  final int loadingProgress;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            const Color(0xFF1E88E5).withValues(alpha: 0.1),
            const Color(0xFF42D9FF).withValues(alpha: 0.1),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: const Color(0xFF1E88E5).withValues(alpha: 0.2),
        ),
      ),
      child: Text(
        '$loadingProgress%',
        style: Theme.of(context).textTheme.labelMedium?.copyWith(
          color: const Color(0xFF1E88E5),
          fontWeight: FontWeight.w700,
          fontSize: 13,
          letterSpacing: 0.5,
        ),
      ),
    );
  }
}
