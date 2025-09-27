import 'package:flutter/material.dart';

class UpdateSignatureWidget extends StatelessWidget {
  const UpdateSignatureWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return const Column(
      children: [
        Text(
          'Salam hangat,',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w400,
            color: Color(0xFF6B7280),
          ),
        ),
        SizedBox(height: 4),
        Text(
          'Tim FormGear',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w500,
            color: Color(0xFF374151),
          ),
        ),
      ],
    );
  }
}
