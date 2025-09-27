import 'package:flutter/material.dart';
import 'package:form_gear_engine_sdk/src/models/models.dart';

class UpdateVersionInfoWidget extends StatelessWidget {
  const UpdateVersionInfoWidget({
    required this.versionResult,
    super.key,
  });

  final VersionCheckResult versionResult;

  @override
  Widget build(BuildContext context) {
    if (versionResult.state == VersionState.current) {
      return _buildCurrentVersion();
    }

    return _buildVersionComparison();
  }

  Widget _buildCurrentVersion() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1E88E5).withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: const Color(0xFF1E88E5).withValues(alpha: 0.3),
        ),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: const Color(0xFF1E88E5).withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Icon(
              Icons.check_circle,
              color: Color(0xFF1E88E5),
              size: 20,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Current Version',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                    color: Color(0xFF6B7280),
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  'v${versionResult.localVersion}',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF1E88E5),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildVersionComparison() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: const Color(0xFFE5E7EB),
        ),
      ),
      child: Column(
        children: [
          _buildVersionRow(
            'Current Version',
            versionResult.localVersion ?? 'Not installed',
            Icons.smartphone,
            versionResult.localVersion != null
                ? const Color(0xFF6B7280)
                : const Color(0xFFEF4444),
          ),
          const SizedBox(height: 12),
          Container(
            height: 1,
            color: const Color(0xFFE5E7EB),
          ),
          const SizedBox(height: 12),
          _buildVersionRow(
            'Latest Version',
            versionResult.remoteVersion ?? 'Unknown',
            Icons.cloud_download,
            const Color(0xFF1E88E5),
          ),
        ],
      ),
    );
  }

  Widget _buildVersionRow(
    String label,
    String version,
    IconData icon,
    Color color,
  ) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(
            icon,
            color: color,
            size: 20,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                  color: Color(0xFF6B7280),
                ),
              ),
              const SizedBox(height: 2),
              Text(
                'v$version',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: color,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
