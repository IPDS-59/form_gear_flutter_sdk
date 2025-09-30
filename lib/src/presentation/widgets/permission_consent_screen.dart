import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';

/// Model for permission consent item
class PermissionConsentItem {
  const PermissionConsentItem({
    required this.permission,
    required this.title,
    required this.description,
    required this.icon,
    this.color = const Color(0xFF1E88E5),
  });

  final Permission permission;
  final String title;
  final String description;
  final IconData icon;
  final Color color;
}

/// Reusable permission consent screen with FormGear design system
/// Following the force update screen design pattern
class PermissionConsentScreen extends StatelessWidget {
  const PermissionConsentScreen({
    required this.title,
    required this.subtitle,
    required this.permissions,
    required this.onPermissionsGranted,
    this.onPermissionsDenied,
    this.ctaText = 'Berikan Izin',
    this.skipText,
    this.emoji = '🔐',
    super.key,
  });

  final String title;
  final String subtitle;
  final List<PermissionConsentItem> permissions;
  final VoidCallback onPermissionsGranted;
  final VoidCallback? onPermissionsDenied;
  final String ctaText;
  final String? skipText;
  final String emoji;

  static Future<void> show({
    required BuildContext context,
    required String title,
    required String subtitle,
    required List<PermissionConsentItem> permissions,
    required VoidCallback onPermissionsGranted,
    VoidCallback? onPermissionsDenied,
    String ctaText = 'Berikan Izin',
    String? skipText,
    String emoji = '🔐',
  }) {
    return Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (context) => PermissionConsentScreen(
          title: title,
          subtitle: subtitle,
          permissions: permissions,
          onPermissionsGranted: onPermissionsGranted,
          onPermissionsDenied: onPermissionsDenied,
          ctaText: ctaText,
          skipText: skipText,
          emoji: emoji,
        ),
        fullscreenDialog: true,
        settings: const RouteSettings(name: 'permission_consent'),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: skipText != null,
      child: Scaffold(
        backgroundColor: Colors.grey[50],
        appBar: skipText != null
            ? AppBar(
                backgroundColor: Colors.transparent,
                elevation: 0,
                leading: IconButton(
                  icon: const Icon(Icons.arrow_back_ios_new_rounded),
                  color: Colors.black87,
                  onPressed: () => Navigator.of(context).pop(),
                ),
              )
            : null,
        body: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(32),
            child: LayoutBuilder(
              builder: (context, constraints) {
                return SizedBox(
                  height: constraints.maxHeight,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Spacer(),
                      // Greeting section with emoji
                      Center(
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Text(
                              'Halo,',
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
                        ),
                      ),
                      const SizedBox(height: 32),
                      // Main message
                      Text(
                        title,
                        style: const TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.w600,
                          color: Color(0xFF1F2937),
                          height: 1.3,
                        ),
                        textAlign: TextAlign.left,
                      ),
                      const SizedBox(height: 16),
                      Text(
                        subtitle,
                        style: TextStyle(
                          fontSize: 16,
                          color: Colors.grey.shade600,
                          height: 1.5,
                        ),
                        textAlign: TextAlign.left,
                      ),
                      const SizedBox(height: 32),
                      // Permission items
                      ...permissions.map(_buildPermissionItem),
                      const SizedBox(height: 40),
                      // Signature
                      const Center(
                        child: Text(
                          'FormGear Permission Manager',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                            color: Color(0xFF9CA3AF),
                          ),
                        ),
                      ),
                      const Spacer(flex: 2),
                      // CTA button
                      _buildCtaButton(context),
                      if (skipText != null) ...[
                        const SizedBox(height: 16),
                        _buildSkipButton(context),
                      ],
                      const Spacer(),
                    ],
                  ),
                );
              },
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildPermissionItem(PermissionConsentItem item) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: item.color.withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: item.color.withValues(alpha: 0.2),
        ),
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: item.color.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(
              item.icon,
              color: item.color,
              size: 24,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.title,
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: item.color,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  item.description,
                  style: const TextStyle(
                    fontSize: 14,
                    color: Color(0xFF6B7280),
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCtaButton(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 56,
      child: Container(
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            colors: [Color(0xFF1E88E5), Color(0xFF42D9FF)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
          borderRadius: BorderRadius.circular(28),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFF1E88E5).withValues(alpha: 0.3),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: ElevatedButton(
          onPressed: () => _handlePermissionRequest(context),
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.transparent,
            shadowColor: Colors.transparent,
            elevation: 0,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(28),
            ),
          ),
          child: Text(
            ctaText,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: Colors.white,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSkipButton(BuildContext context) {
    return TextButton(
      onPressed: () {
        Navigator.of(context).pop();
        onPermissionsDenied?.call();
      },
      child: Text(
        skipText!,
        style: const TextStyle(
          fontSize: 16,
          color: Color(0xFF6B7280),
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }

  Future<void> _handlePermissionRequest(BuildContext context) async {
    try {
      // Request all permissions
      final statuses = <Permission, PermissionStatus>{};

      for (final item in permissions) {
        final status = await item.permission.request();
        statuses[item.permission] = status;
      }

      // Check if all permissions are granted
      final allGranted = statuses.values.every((status) => status.isGranted);

      if (allGranted) {
        if (context.mounted) {
          Navigator.of(context).pop();
          onPermissionsGranted();
        }
      } else {
        // Show error and handle denied permissions
        if (context.mounted) {
          _showPermissionDeniedDialog(context, statuses);
        }
      }
    } on Exception catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Gagal meminta izin: $e'),
            backgroundColor: Colors.red.shade600,
          ),
        );
      }
    }
  }

  void _showPermissionDeniedDialog(
    BuildContext context,
    Map<Permission, PermissionStatus> statuses,
  ) {
    final deniedPermissions = statuses.entries
        .where((entry) => !entry.value.isGranted)
        .map(
          (entry) => permissions.firstWhere(
            (item) => item.permission == entry.key,
          ),
        )
        .toList();

    showDialog<void>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Izin Diperlukan'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Aplikasi memerlukan izin berikut untuk berfungsi dengan baik:',
            ),
            const SizedBox(height: 12),
            ...deniedPermissions.map(
              (item) => Padding(
                padding: const EdgeInsets.symmetric(vertical: 4),
                child: Row(
                  children: [
                    Icon(item.icon, size: 16, color: item.color),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        item.title,
                        style: const TextStyle(fontSize: 14),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              Navigator.of(context).pop();
              onPermissionsDenied?.call();
            },
            child: const Text('Batal'),
          ),
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              _handlePermissionRequest(context);
            },
            child: const Text('Coba Lagi'),
          ),
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              openAppSettings();
            },
            child: const Text('Pengaturan'),
          ),
        ],
      ),
    );
  }
}
