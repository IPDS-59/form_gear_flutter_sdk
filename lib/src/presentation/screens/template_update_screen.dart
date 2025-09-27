import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:form_gear_engine_sdk/src/models/models.dart';
import 'package:form_gear_engine_sdk/src/presentation/bloc/template_update/template_update_bloc.dart';
import 'package:form_gear_engine_sdk/src/presentation/widgets/update_action_button_widget.dart';
import 'package:form_gear_engine_sdk/src/presentation/widgets/update_greeting_widget.dart';
import 'package:form_gear_engine_sdk/src/presentation/widgets/update_main_message_widget.dart';
import 'package:form_gear_engine_sdk/src/presentation/widgets/update_signature_widget.dart';
import 'package:form_gear_engine_sdk/src/presentation/widgets/update_skip_button_widget.dart';
import 'package:form_gear_engine_sdk/src/presentation/widgets/update_version_info_widget.dart';

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
            body: ColoredBox(
              color: const Color(0xFFF5F5F7),
              child: SafeArea(
                child: Padding(
                  padding: const EdgeInsets.all(32),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Spacer(),
                      Center(
                        child: UpdateGreetingWidget(emoji: _getGreetingEmoji()),
                      ),
                      const SizedBox(height: 32),
                      UpdateMainMessageWidget(
                        message: _getMainMessage(),
                        highlightWords: _getHighlightWords(),
                      ),
                      const SizedBox(height: 24),
                      UpdateVersionInfoWidget(versionResult: versionResult),
                      const SizedBox(height: 40),
                      const Center(child: UpdateSignatureWidget()),
                      const Spacer(flex: 2),
                      UpdateActionButtonWidget(
                        onPressed: state.isDownloading
                            ? null
                            : () => context.read<TemplateUpdateBloc>().add(
                                const TemplateStartDownloadEvent(),
                              ),
                        text: _getButtonText(),
                        isLoading: state.isDownloading,
                        loadingText: 'Downloading...',
                        progress: state.progress,
                        isCompleted: state.isCompleted,
                        completedText: 'Unduhan Selesai!',
                      ),
                      AnimatedSize(
                        duration: const Duration(milliseconds: 400),
                        curve: Curves.easeInOut,
                        child: AnimatedSwitcher(
                          duration: const Duration(milliseconds: 300),
                          child:
                              (!versionResult.isForced && !state.isDownloading)
                              ? Column(
                                  key: const ValueKey('skip-section'),
                                  children: [
                                    const SizedBox(height: 16),
                                    UpdateSkipButtonWidget(
                                      onPressed: () =>
                                          Navigator.of(context).pop(),
                                      text: 'Lewati untuk sekarang',
                                    ),
                                  ],
                                )
                              : const SizedBox.shrink(
                                  key: ValueKey('no-skip'),
                                ),
                        ),
                      ),
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

  String _getButtonText() {
    return 'Oke, mengerti';
  }

  String _getGreetingEmoji() {
    switch (versionResult.state) {
      case VersionState.missing:
        return versionResult.isForced ? '😰' : '📦';
      case VersionState.outdated:
        return versionResult.isForced ? '⚠️' : '🔄';
      case VersionState.current:
        return '😊';
    }
  }

  String _getMainMessage() {
    switch (versionResult.state) {
      case VersionState.missing:
        return versionResult.isForced
            ? 'Maaf! Template $templateName diperlukan untuk perangkat ini. '
                  'Silakan unduh untuk melanjutkan!'
            : 'Hai! Template $templateName tidak tersedia di perangkat Anda. '
                  'Apakah Anda ingin mengunduhnya?';
      case VersionState.outdated:
        return versionResult.isForced
            ? 'Maaf! Template $templateName Anda sudah usang di perangkat ini. '
                  'Silakan perbarui untuk melanjutkan!'
            : 'Hai! Versi baru template $templateName tersedia. '
                  'Apakah Anda ingin memperbaruinya?';
      case VersionState.current:
        return 'Bagus! Anda memiliki versi template $templateName terbaru. '
            'Apakah Anda ingin mengunduh ulang?';
    }
  }

  List<String> _getHighlightWords() {
    return [
      templateName.toLowerCase(),
      'template',
      'diperlukan',
      'unduh',
      'perbarui',
      'melanjutkan',
      'usang',
      'terbaru',
      'tersedia',
      'maaf',
      'silakan',
      'hai',
      'bagus',
    ];
  }
}
