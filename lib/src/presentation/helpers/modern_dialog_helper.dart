import 'package:flutter/material.dart';

/// Modern dialog helper for FormGear design system
class ModernDialogHelper {
  ModernDialogHelper._();

  static Future<void> showResultDialog({
    required BuildContext context,
    required String title,
    required String message,
    required IconData icon,
    Color? iconColor,
    String? buttonText,
    VoidCallback? onButtonPressed,
    bool showSuccessIndicators = true,
  }) {
    return showDialog<void>(
      context: context,
      builder: (context) => ModernResultDialog(
        title: title,
        message: message,
        icon: icon,
        iconColor: iconColor ?? const Color(0xFF1E88E5),
        buttonText: buttonText ?? 'Selesai',
        onButtonPressed: onButtonPressed,
        showSuccessIndicators: showSuccessIndicators,
      ),
    );
  }
}

/// Modern result dialog following FormGear design system
class ModernResultDialog extends StatelessWidget {
  const ModernResultDialog({
    required this.title,
    required this.message,
    required this.icon,
    required this.iconColor,
    required this.buttonText,
    this.onButtonPressed,
    this.showSuccessIndicators = true,
    super.key,
  });

  final String title;
  final String message;
  final IconData icon;
  final Color iconColor;
  final String buttonText;
  final VoidCallback? onButtonPressed;
  final bool showSuccessIndicators;

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: Colors.transparent,
      elevation: 0,
      child: Container(
        constraints: const BoxConstraints(maxWidth: 320),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.1),
              blurRadius: 20,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Header with icon and close button
            Container(
              padding: const EdgeInsets.fromLTRB(24, 24, 24, 16),
              child: Row(
                children: [
                  Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: iconColor.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(
                      icon,
                      color: iconColor,
                      size: 24,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Text(
                      title,
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w600,
                        color: Color(0xFF1F2937),
                      ),
                    ),
                  ),
                  GestureDetector(
                    onTap: () => Navigator.of(context).pop(),
                    child: Container(
                      width: 32,
                      height: 32,
                      decoration: BoxDecoration(
                        color: Colors.grey.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Icon(
                        Icons.close,
                        size: 18,
                        color: Color(0xFF6B7280),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Content
            Container(
              padding: const EdgeInsets.fromLTRB(24, 0, 24, 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // File path or message display
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.grey.withValues(alpha: 0.05),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: Colors.grey.withValues(alpha: 0.1),
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(
                              Icons.folder_outlined,
                              size: 16,
                              color: Colors.grey.shade600,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              'File Location:',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w500,
                                color: Colors.grey.shade600,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          _formatFilePath(message),
                          style: const TextStyle(
                            fontSize: 13,
                            fontFamily: 'monospace',
                            color: Color(0xFF1F2937),
                            height: 1.4,
                          ),
                        ),
                      ],
                    ),
                  ),

                  if (showSuccessIndicators) ...[
                    const SizedBox(height: 20),
                    // Success indicators
                    _buildSuccessIndicator(
                      'File Saved Successfully',
                      'Audio file has been saved to media directory',
                      Icons.check_circle_outline,
                      Colors.green,
                    ),
                    const SizedBox(height: 12),
                    _buildSuccessIndicator(
                      'FASIH Compatible',
                      'Follows BPS directory structure and naming patterns',
                      Icons.verified_outlined,
                      const Color(0xFF1E88E5),
                    ),
                  ],

                  const SizedBox(height: 24),

                  // Action button
                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: Container(
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [
                            Color(0xFF1E88E5),
                            Color(0xFF1976D2),
                          ],
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                        ),
                        borderRadius: BorderRadius.circular(12),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(
                              0xFF1E88E5,
                            ).withValues(alpha: 0.3),
                            blurRadius: 8,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: ElevatedButton(
                        onPressed:
                            onButtonPressed ??
                            () => Navigator.of(context).pop(),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.transparent,
                          shadowColor: Colors.transparent,
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: Text(
                          buttonText,
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSuccessIndicator(
    String title,
    String subtitle,
    IconData icon,
    Color indicatorColor,
  ) {
    return Row(
      children: [
        Container(
          width: 24,
          height: 24,
          decoration: BoxDecoration(
            color: indicatorColor.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(6),
          ),
          child: Icon(
            icon,
            size: 14,
            color: indicatorColor,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: Color(0xFF1F2937),
                ),
              ),
              Text(
                subtitle,
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey.shade600,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  String _formatFilePath(String path) {
    // Clean up the path message
    var cleanPath = path;
    if (cleanPath.startsWith('File saved: ')) {
      cleanPath = cleanPath.substring(12);
    } else if (cleanPath.startsWith('Result: ')) {
      cleanPath = cleanPath.substring(8);
    }

    // Break long paths into multiple lines for better readability
    final parts = cleanPath.split('/');
    if (parts.length > 4) {
      final buffer = StringBuffer();
      for (var i = 0; i < parts.length; i++) {
        buffer.write(parts[i]);
        if (i < parts.length - 1) {
          buffer.write('/');
          // Add line break every 3-4 segments
          if ((i + 1) % 3 == 0 && i < parts.length - 2) {
            buffer.write('\n');
          }
        }
      }
      return buffer.toString();
    }
    return cleanPath;
  }
}
