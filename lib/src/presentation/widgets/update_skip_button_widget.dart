import 'package:flutter/material.dart';

class UpdateSkipButtonWidget extends StatefulWidget {
  const UpdateSkipButtonWidget({
    required this.onPressed,
    this.text = 'Lewati untuk sekarang',
    super.key,
  });

  final VoidCallback? onPressed;
  final String text;

  @override
  State<UpdateSkipButtonWidget> createState() => _UpdateSkipButtonWidgetState();
}

class _UpdateSkipButtonWidgetState extends State<UpdateSkipButtonWidget>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;

  @override
  void initState() {
    super.initState();

    _animationController = AnimationController(
      duration: const Duration(milliseconds: 400),
      vsync: this,
    );

    _fadeAnimation =
        Tween<double>(
          begin: 0.0,
          end: 1.0,
        ).animate(
          CurvedAnimation(
            parent: _animationController,
            curve: Curves.easeOut,
          ),
        );

    _slideAnimation =
        Tween<Offset>(
          begin: const Offset(0, 0.5),
          end: Offset.zero,
        ).animate(
          CurvedAnimation(
            parent: _animationController,
            curve: Curves.easeOut,
          ),
        );

    // Start animation when widget appears
    _animationController.forward();
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: _fadeAnimation,
      child: SlideTransition(
        position: _slideAnimation,
        child: SizedBox(
          width: double.infinity,
          height: 48,
          child: TextButton(
            onPressed: widget.onPressed,
            style: TextButton.styleFrom(
              backgroundColor: Colors.transparent,
              foregroundColor: const Color(0xFF6B7280),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(24),
                side: BorderSide(
                  color: const Color(0xFF6B7280).withValues(alpha: 0.3),
                  width: 1,
                ),
              ),
            ),
            child: Text(
              widget.text,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w500,
                color: Color(0xFF6B7280),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
