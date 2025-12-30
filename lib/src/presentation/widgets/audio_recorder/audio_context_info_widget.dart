import 'package:flutter/material.dart';

/// Context info widget showing recording context details
class AudioContextInfoWidget extends StatelessWidget {
  const AudioContextInfoWidget({
    required this.dataKey,
    required this.templateName,
    required this.showTemplate,
    required this.contextSwitchAnimation,
    super.key,
  });

  final String? dataKey;
  final String? templateName;
  final bool showTemplate;
  final Animation<double> contextSwitchAnimation;

  @override
  Widget build(BuildContext context) {
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
          if (dataKey != null || templateName != null) ...[
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
              child: templateName != null && dataKey != null
                  ? AnimatedBuilder(
                      animation: contextSwitchAnimation,
                      builder: (context, child) {
                        return Column(
                          children: [
                            SizedBox(
                              height: 60,
                              child: Stack(
                                children: [
                                  AnimatedPositioned(
                                    duration: const Duration(milliseconds: 600),
                                    curve: Curves.easeInOut,
                                    top: showTemplate
                                        ? 0
                                        : -60 *
                                              (1 -
                                                  contextSwitchAnimation.value),
                                    left: 0,
                                    right: 0,
                                    child: AnimatedOpacity(
                                      duration: const Duration(
                                        milliseconds: 300,
                                      ),
                                      opacity: showTemplate ? 1.0 : 0.0,
                                      child: _buildEnhancedInfoRow(
                                        'Template Survey',
                                        templateName!,
                                        Icons.description_outlined,
                                        const Color(0xFF10B981),
                                      ),
                                    ),
                                  ),
                                  AnimatedPositioned(
                                    duration: const Duration(milliseconds: 600),
                                    curve: Curves.easeInOut,
                                    top: !showTemplate
                                        ? 0
                                        : 60 *
                                              (1 -
                                                  contextSwitchAnimation.value),
                                    left: 0,
                                    right: 0,
                                    child: AnimatedOpacity(
                                      duration: const Duration(
                                        milliseconds: 300,
                                      ),
                                      opacity: !showTemplate ? 1.0 : 0.0,
                                      child: _buildEnhancedInfoRow(
                                        'Field Input',
                                        dataKey!,
                                        Icons.input_outlined,
                                        const Color(0xFF8B5CF6),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 12),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                _buildIndicatorDot(showTemplate),
                                const SizedBox(width: 8),
                                _buildIndicatorDot(!showTemplate),
                              ],
                            ),
                          ],
                        );
                      },
                    )
                  : Column(
                      children: [
                        if (templateName != null)
                          _buildEnhancedInfoRow(
                            'Template Survey',
                            templateName!,
                            Icons.description_outlined,
                            const Color(0xFF10B981),
                          ),
                        if (dataKey != null && templateName == null)
                          _buildEnhancedInfoRow(
                            'Field Input',
                            dataKey!,
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
}
