import 'package:flutter/material.dart';

class UpdateMainMessageWidget extends StatelessWidget {
  const UpdateMainMessageWidget({
    required this.message,
    required this.highlightWords,
    super.key,
  });

  final String message;
  final List<String> highlightWords;

  @override
  Widget build(BuildContext context) {
    final words = message.split(' ');

    return RichText(
      textAlign: TextAlign.center,
      text: TextSpan(
        style: const TextStyle(
          fontSize: 28,
          fontWeight: FontWeight.w600,
          color: Color(0xFF1F2937),
          height: 1.3,
        ),
        children: words.map((word) {
          final isHighlighted = _isHighlightedWord(word);
          return TextSpan(
            text: '$word ',
            style: isHighlighted
                ? const TextStyle(
                    color: Color(0xFF1E88E5),
                    fontWeight: FontWeight.w800,
                  )
                : null,
          );
        }).toList(),
      ),
    );
  }

  bool _isHighlightedWord(String word) {
    final cleanWord = word.replaceAll(RegExp(r'[^\w]'), '').toLowerCase();
    return highlightWords.contains(cleanWord);
  }
}
