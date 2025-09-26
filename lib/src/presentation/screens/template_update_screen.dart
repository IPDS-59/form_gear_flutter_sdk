import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:form_gear_engine_sdk/src/models/models.dart';
import 'package:form_gear_engine_sdk/src/presentation/bloc/template_update/template_update_bloc.dart';

class TemplateUpdateScreen extends StatelessWidget {
  const TemplateUpdateScreen({
    required this.versionResult,
    required this.templateName,
    required this.onDownload,
    super.key,
  });

  final VersionCheckResult versionResult;
  final String templateName;
  final Future<void> Function() onDownload;

  static Future<void> show({
    required BuildContext context,
    required VersionCheckResult versionResult,
    required String templateName,
    required Future<void> Function() onDownload,
  }) {
    return Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (context) => BlocProvider(
          create: (context) => TemplateUpdateBloc(
            versionResult: versionResult,
            templateName: templateName,
            onDownload: onDownload,
          ),
          child: TemplateUpdateScreen(
            versionResult: versionResult,
            templateName: templateName,
            onDownload: onDownload,
          ),
        ),
        fullscreenDialog: true,
        settings: RouteSettings(
          name: 'template_update',
          arguments: {'canPop': !versionResult.isForced},
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<TemplateUpdateBloc, TemplateUpdateState>(
      builder: (context, state) {
        return PopScope(
          canPop: !versionResult.isForced || state.isCompleted,
          child: Scaffold(
            backgroundColor: Colors.grey[50],
            appBar: !versionResult.isForced
                ? AppBar(
                    backgroundColor: Colors.transparent,
                    elevation: 0,
                    leading: IconButton(
                      icon: const Icon(Icons.arrow_back_ios_new_rounded),
                      color: Colors.black87,
                      onPressed: state.isDownloading
                          ? null
                          : () => Navigator.of(context).pop(),
                    ),
                  )
                : null,
            body: Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Color(0xFFF8FEFF), // Very light FormGear blue
                    Color(0xFFFFFFFF), // Pure white
                  ],
                ),
              ),
              child: SafeArea(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Column(
                    children: [
                      const Spacer(),
                      _buildFormGearLogo(),
                      const SizedBox(height: 32),
                      _buildUpdateIcon(context),
                      const SizedBox(height: 24),
                      _buildTitle(context),
                      const SizedBox(height: 12),
                      _buildSubtitle(context),
                      const SizedBox(height: 32),
                      _buildMessage(context),
                      const Spacer(flex: 2),
                      _buildDownloadButton(context, state),
                      if (!versionResult.isForced && !state.isDownloading) ...[
                        const SizedBox(height: 16),
                        _buildSkipButton(context),
                      ],
                      const SizedBox(height: 32),
                    ],
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildFormGearLogo() {
    return Container(
      width: 80,
      height: 80,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF1E88E5).withValues(alpha: 0.1),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      padding: const EdgeInsets.all(16),
      child: SvgPicture.asset(
        'packages/form_gear_engine_sdk/assets/logo/form-gear.svg',
        width: 48,
        height: 48,
      ),
    );
  }

  Widget _buildUpdateIcon(BuildContext context) {
    final emoji = _getEmoji();
    final iconData = _getIconData();
    final color = versionResult.isForced
        ? const Color(0xFFFF6B6B) // Soft red for forced updates
        : const Color(0xFF1E88E5); // FormGear primary blue

    return Container(
      width: 100,
      height: 100,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            color.withValues(alpha: 0.1),
            color.withValues(alpha: 0.05),
          ],
        ),
        shape: BoxShape.circle,
        boxShadow: [
          BoxShadow(
            color: color.withValues(alpha: 0.2),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Stack(
        alignment: Alignment.center,
        children: [
          Icon(iconData, size: 36, color: color),
          Positioned(
            top: 8,
            right: 8,
            child: Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.1),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Center(
                child: Text(
                  emoji,
                  style: const TextStyle(fontSize: 16),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTitle(BuildContext context) {
    final title = _getTitle();
    final words = title.split(' ');

    return RichText(
      textAlign: TextAlign.center,
      text: TextSpan(
        style: Theme.of(context).textTheme.headlineMedium?.copyWith(
          fontWeight: FontWeight.w700,
          color: const Color(0xFF1F2937),
          letterSpacing: -0.5,
          height: 1.2,
        ),
        children: words.map((word) {
          final isHighlighted = _isHighlightedWord(word);
          return TextSpan(
            text: '$word ',
            style: isHighlighted
                ? TextStyle(
                    background: Paint()
                      ..color = const Color(0xFF1E88E5).withValues(alpha: 0.15)
                      ..strokeWidth = 24.0
                      ..strokeCap = StrokeCap.round
                      ..style = PaintingStyle.stroke,
                    color: const Color(0xFF1E88E5),
                    fontWeight: FontWeight.w800,
                  )
                : null,
          );
        }).toList(),
      ),
    );
  }

  Widget _buildSubtitle(BuildContext context) {
    return Text(
      _getSubtitle(),
      style: Theme.of(context).textTheme.bodyLarge?.copyWith(
        color: const Color(0xFF6B7280),
        height: 1.5,
        fontSize: 16,
        fontWeight: FontWeight.w400,
      ),
      textAlign: TextAlign.center,
    );
  }

  Widget _buildMessage(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: const Color(0xFF1E88E5).withValues(alpha: 0.1),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF1E88E5).withValues(alpha: 0.08),
            blurRadius: 24,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF1E88E5), Color(0xFF42D9FF)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  Icons.info_outline_rounded,
                  color: Colors.white,
                  size: 16,
                ),
                SizedBox(width: 6),
                Text(
                  'Template Info',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 0.5,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          _buildRichMessage(context),
        ],
      ),
    );
  }

  Widget _buildDownloadButton(
    BuildContext context,
    TemplateUpdateState state,
  ) {
    final isForced = versionResult.isForced;
    final gradient = isForced
        ? const LinearGradient(
            colors: [Color(0xFFFF6B6B), Color(0xFFEE5A52)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          )
        : const LinearGradient(
            colors: [Color(0xFF1E88E5), Color(0xFF42D9FF)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          );

    return Container(
      width: double.infinity,
      height: 60,
      decoration: BoxDecoration(
        gradient: state.isDownloading ? null : gradient,
        borderRadius: BorderRadius.circular(30),
        boxShadow: state.isDownloading
            ? null
            : [
                BoxShadow(
                  color:
                      (isForced
                              ? const Color(0xFFFF6B6B)
                              : const Color(0xFF1E88E5))
                          .withValues(alpha: 0.4),
                  blurRadius: 16,
                  offset: const Offset(0, 8),
                ),
              ],
      ),
      child: ElevatedButton(
        onPressed: state.isDownloading
            ? null
            : () => context.read<TemplateUpdateBloc>().add(
                const TemplateStartDownloadEvent(),
              ),
        style: ElevatedButton.styleFrom(
          backgroundColor: state.isDownloading
              ? const Color(0xFFF3F4F6)
              : Colors.transparent,
          shadowColor: Colors.transparent,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(30),
          ),
        ),
        child: state.isDownloading
            ? Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  SizedBox(
                    width: 24,
                    height: 24,
                    child: CircularProgressIndicator(
                      strokeWidth: 2.5,
                      valueColor: const AlwaysStoppedAnimation<Color>(
                        Color(0xFF1E88E5),
                      ),
                      value: state.progress > 0 ? state.progress / 100 : null,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Downloading Template...',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Color(0xFF374151),
                        ),
                      ),
                      Text(
                        '${state.progress}% completed',
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                          color: Color(0xFF6B7280),
                        ),
                      ),
                    ],
                  ),
                ],
              )
            : Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    _getButtonIcon(),
                    color: Colors.white,
                    size: 20,
                  ),
                  const SizedBox(width: 12),
                  Text(
                    _getButtonText(),
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: Colors.white,
                      letterSpacing: 0.5,
                    ),
                  ),
                ],
              ),
      ),
    );
  }

  Widget _buildSkipButton(BuildContext context) {
    return TextButton(
      onPressed: () => Navigator.of(context).pop(),
      child: Text(
        'Skip for now',
        style: TextStyle(
          color: Colors.grey[600],
          fontSize: 14,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }

  IconData _getIconData() {
    switch (versionResult.state) {
      case VersionState.missing:
        return Icons.download_rounded;
      case VersionState.outdated:
        return Icons.system_update_rounded;
      case VersionState.current:
        return Icons.refresh_rounded;
    }
  }

  String _getTitle() {
    switch (versionResult.state) {
      case VersionState.missing:
        return versionResult.isForced
            ? 'Required Download'
            : '$templateName Template Not Found';
      case VersionState.outdated:
        return versionResult.isForced
            ? 'Critical Update Required'
            : 'Template Update Available';
      case VersionState.current:
        return 'Already Up to Date';
    }
  }

  String _getSubtitle() {
    switch (versionResult.state) {
      case VersionState.missing:
        return '$templateName template needs to be downloaded to continue';
      case VersionState.outdated:
        return 'A new version of $templateName template is available';
      case VersionState.current:
        return 'You have the latest $templateName template version';
    }
  }

  String _getMessage() {
    final result = versionResult;
    switch (result.state) {
      case VersionState.missing:
        final message =
            '$templateName template is not available on your device.';
        if (result.remoteVersion != null) {
          return '$message\n\nVersion ${result.remoteVersion} needs to be '
              'downloaded.';
        }
        return message;

      case VersionState.outdated:
        return '$templateName template on your device is not the latest '
            'version.\n\n'
            'Current version: v${result.localVersion}\n'
            'Latest version: v${result.remoteVersion}';

      case VersionState.current:
        return '$templateName template on your device is the latest '
            'version (v${result.localVersion}).\n\n'
            'Would you like to re-download it anyway?';
    }
  }

  String _getButtonText() {
    switch (versionResult.state) {
      case VersionState.missing:
        return 'Download Now';
      case VersionState.outdated:
        return 'Update Now';
      case VersionState.current:
        return 'Re-download';
    }
  }

  IconData _getButtonIcon() {
    switch (versionResult.state) {
      case VersionState.missing:
        return Icons.download_rounded;
      case VersionState.outdated:
        return Icons.system_update_rounded;
      case VersionState.current:
        return Icons.refresh_rounded;
    }
  }

  String _getEmoji() {
    switch (versionResult.state) {
      case VersionState.missing:
        return versionResult.isForced ? '🚨' : '📦';
      case VersionState.outdated:
        return versionResult.isForced ? '⚠️' : '🔄';
      case VersionState.current:
        return '✨';
    }
  }

  bool _isHighlightedWord(String word) {
    final cleanWord = word.replaceAll(RegExp(r'[^\w]'), '').toLowerCase();
    const highlightWords = [
      'required',
      'critical',
      'update',
      'download',
      'template',
      'missing',
      'available',
      'outdated',
      'latest',
    ];
    return highlightWords.contains(cleanWord);
  }

  Widget _buildRichMessage(BuildContext context) {
    final message = _getMessage();
    final parts = message.split('\n');

    return Column(
      children: parts.map((part) {
        if (part.trim().isEmpty) {
          return const SizedBox(height: 8);
        }

        return Padding(
          padding: const EdgeInsets.only(bottom: 8),
          child: _buildMessagePart(context, part),
        );
      }).toList(),
    );
  }

  Widget _buildMessagePart(BuildContext context, String text) {
    // Check if this is a version line
    if (text.contains('version:') || text.contains('Version')) {
      return _buildVersionLine(context, text);
    }

    return Text(
      text,
      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
        color: const Color(0xFF374151),
        height: 1.5,
        fontSize: 15,
      ),
      textAlign: TextAlign.center,
    );
  }

  Widget _buildVersionLine(BuildContext context, String text) {
    final words = text.split(' ');
    return RichText(
      textAlign: TextAlign.center,
      text: TextSpan(
        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
          color: const Color(0xFF374151),
          height: 1.5,
          fontSize: 15,
        ),
        children: words.map((word) {
          if (word.startsWith('v') && RegExp(r'^v[\d.]+$').hasMatch(word)) {
            return TextSpan(
              text: '$word ',
              style: TextStyle(
                background: Paint()
                  ..color = const Color(0xFF42D9FF).withValues(alpha: 0.2)
                  ..strokeWidth = 18.0
                  ..strokeCap = StrokeCap.round
                  ..style = PaintingStyle.stroke,
                color: const Color(0xFF1E88E5),
                fontWeight: FontWeight.w700,
                fontFamily: 'monospace',
              ),
            );
          }
          return TextSpan(text: '$word ');
        }).toList(),
      ),
    );
  }
}
