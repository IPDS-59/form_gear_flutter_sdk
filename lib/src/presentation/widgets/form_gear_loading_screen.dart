import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

/// A modern loading screen widget for FormGear with logo and animated progress
class FormGearLoadingScreen extends StatelessWidget {
  const FormGearLoadingScreen({
    required this.loadingProgress,
    super.key,
  });

  /// The current loading progress (0-100)
  final int loadingProgress;

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

            // Loading text with modern typography
            Text(
              'Loading FormGear...',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.w600,
                color: const Color(0xFF1F2937), // Dark gray
                letterSpacing: -0.5,
              ),
            ),
            const SizedBox(height: 8),

            // Subtitle text
            Text(
              'Preparing your form experience',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: const Color(0xFF6B7280), // Medium gray
                fontWeight: FontWeight.w400,
              ),
            ),
            const SizedBox(height: 40),

            // Modern progress bar with rounded corners and gradient
            _ProgressBar(loadingProgress: loadingProgress),
            const SizedBox(height: 16),

            // Progress percentage with modern styling
            _ProgressPercentage(loadingProgress: loadingProgress),
          ],
        ),
      ),
    );
  }
}

/// Animated logo widget with pulse effect
class _AnimatedLogo extends StatelessWidget {
  const _AnimatedLogo();

  @override
  Widget build(BuildContext context) {
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0.8, end: 1),
      duration: const Duration(milliseconds: 500),
      builder: (_, value, _) {
        return Transform.scale(
          scale: value,
          child: Container(
            width: 120,
            height: 120,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.08),
                  blurRadius: 20,
                  offset: const Offset(0, 8),
                ),
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.04),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            padding: const EdgeInsets.all(24),
            child: SvgPicture.asset(
              'packages/form_gear_engine_sdk/assets/logo/form-gear.svg',
              width: 72,
              height: 72,
            ),
          ),
        );
      },
    );
  }
}

/// Progress bar widget
class _ProgressBar extends StatelessWidget {
  const _ProgressBar({
    required this.loadingProgress,
  });

  final int loadingProgress;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 240,
      height: 6,
      decoration: BoxDecoration(
        color: const Color(0xFFE5E7EB), // Light gray background
        borderRadius: BorderRadius.circular(3),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(3),
        child: LinearProgressIndicator(
          value: loadingProgress > 0 ? loadingProgress / 100 : null,
          backgroundColor: Colors.transparent,
          valueColor: AlwaysStoppedAnimation<Color>(
            Theme.of(context).primaryColor,
          ),
          minHeight: 6,
        ),
      ),
    );
  }
}

/// Progress percentage widget
class _ProgressPercentage extends StatelessWidget {
  const _ProgressPercentage({
    required this.loadingProgress,
  });

  final int loadingProgress;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: Theme.of(context).primaryColor.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        '$loadingProgress%',
        style: Theme.of(context).textTheme.labelMedium?.copyWith(
          color: Theme.of(context).primaryColor,
          fontWeight: FontWeight.w600,
          fontSize: 12,
        ),
      ),
    );
  }
}
