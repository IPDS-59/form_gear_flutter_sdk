import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:form_gear_engine_sdk/src/models/models.dart';
import 'package:form_gear_engine_sdk/src/presentation/bloc/form_engine_update/form_engine_update_bloc.dart';

class FormEngineUpdateScreen extends StatelessWidget {
  const FormEngineUpdateScreen({
    required this.versionResult,
    required this.onDownload,
    super.key,
  });

  final VersionCheckResult versionResult;
  final Future<void> Function() onDownload;

  static Future<void> show({
    required BuildContext context,
    required VersionCheckResult versionResult,
    required Future<void> Function() onDownload,
  }) {
    return Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (context) => BlocProvider(
          create: (context) => FormEngineUpdateBloc(
            versionResult: versionResult,
            onDownload: onDownload,
          ),
          child: FormEngineUpdateScreen(
            versionResult: versionResult,
            onDownload: onDownload,
          ),
        ),
        fullscreenDialog: true,
        settings: RouteSettings(
          name: 'form_engine_update',
          arguments: {'canPop': !versionResult.isForced},
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<FormEngineUpdateBloc, FormEngineUpdateState>(
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
            body: SafeArea(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Column(
                  children: [
                    const Spacer(),
                    _buildIcon(context),
                    const SizedBox(height: 40),
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
        );
      },
    );
  }

  Widget _buildIcon(BuildContext context) {
    final theme = Theme.of(context);
    final color = versionResult.isForced ? Colors.red : theme.primaryColor;
    final iconData = _getIconData();

    return Container(
      width: 120,
      height: 120,
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        shape: BoxShape.circle,
      ),
      child: Center(
        child: Container(
          width: 80,
          height: 80,
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.15),
            shape: BoxShape.circle,
          ),
          child: Icon(iconData, size: 40, color: color),
        ),
      ),
    );
  }

  Widget _buildTitle(BuildContext context) {
    return Text(
      _getTitle(),
      style: Theme.of(context).textTheme.headlineSmall?.copyWith(
        fontWeight: FontWeight.bold,
        color: Colors.black87,
      ),
      textAlign: TextAlign.center,
    );
  }

  Widget _buildSubtitle(BuildContext context) {
    return Text(
      _getSubtitle(),
      style: Theme.of(context).textTheme.bodyLarge?.copyWith(
        color: Colors.grey[600],
        height: 1.4,
      ),
      textAlign: TextAlign.center,
    );
  }

  Widget _buildMessage(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Column(
        children: [
          Icon(
            Icons.info_outline_rounded,
            color: theme.primaryColor.withValues(alpha: 0.7),
            size: 28,
          ),
          const SizedBox(height: 12),
          Text(
            _getMessage(),
            style: theme.textTheme.bodyMedium?.copyWith(
              color: Colors.black87,
              height: 1.5,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildDownloadButton(
    BuildContext context,
    FormEngineUpdateState state,
  ) {
    final theme = Theme.of(context);

    return SizedBox(
      width: double.infinity,
      height: 56,
      child: ElevatedButton(
        onPressed: state.isDownloading
            ? null
            : () => context.read<FormEngineUpdateBloc>().add(
                const FormEngineStartDownloadEvent(),
              ),
        style: ElevatedButton.styleFrom(
          backgroundColor: versionResult.isForced
              ? Colors.red
              : theme.primaryColor,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(28),
          ),
          elevation: 0,
          disabledBackgroundColor: Colors.grey[300],
        ),
        child: state.isDownloading
            ? Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Text(
                    'Downloading... ${state.progress}%',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              )
            : Text(
                _getButtonText(),
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
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
            : 'FormGear Engine Not Found';
      case VersionState.outdated:
        return versionResult.isForced
            ? 'Critical Update Required'
            : 'Engine Update Available';
      case VersionState.current:
        return 'Already Up to Date';
    }
  }

  String _getSubtitle() {
    switch (versionResult.state) {
      case VersionState.missing:
        return 'FormGear engine needs to be downloaded to continue';
      case VersionState.outdated:
        return 'A new version of FormGear engine is available';
      case VersionState.current:
        return 'You have the latest engine version installed';
    }
  }

  String _getMessage() {
    final result = versionResult;
    switch (result.state) {
      case VersionState.missing:
        const message = 'FormGear engine is not available on your device.';
        if (result.remoteVersion != null) {
          return '$message\n\nVersion ${result.remoteVersion} needs to be '
              'downloaded.';
        }
        return message;

      case VersionState.outdated:
        return 'FormGear engine on your device is not the latest '
            'version.\n\n'
            'Current version: v${result.localVersion}\n'
            'Latest version: v${result.remoteVersion}';

      case VersionState.current:
        return 'FormGear engine on your device is the latest version '
            '(v${result.localVersion}).\n\n'
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
}
