import 'package:flutter/material.dart';

class UpdateGreetingWidget extends StatelessWidget {
  const UpdateGreetingWidget({
    required this.emoji,
    super.key,
  });

  final String emoji;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const Text(
          'Hello,',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w400,
            color: Color(0xFF6B7280),
          ),
        ),
        const SizedBox(width: 12),
        Text(
          emoji,
          style: const TextStyle(fontSize: 24),
        ),
      ],
    );
  }
}
