import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:form_gear_engine_sdk/src/models/models.dart';
import 'package:form_gear_engine_sdk/src/presentation/bloc/form_engine_update/form_engine_update_bloc.dart';
import 'package:form_gear_engine_sdk/src/presentation/widgets/update_action_button_widget.dart';
import 'package:form_gear_engine_sdk/src/presentation/widgets/update_greeting_widget.dart';
import 'package:form_gear_engine_sdk/src/presentation/widgets/update_main_message_widget.dart';
import 'package:form_gear_engine_sdk/src/presentation/widgets/update_signature_widget.dart';
import 'package:form_gear_engine_sdk/src/presentation/widgets/update_skip_button_widget.dart';
import 'package:form_gear_engine_sdk/src/presentation/widgets/update_version_info_widget.dart';

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
                padding: const EdgeInsets.all(32),
                child: Column(
                  children: [
                    const Spacer(),
                    UpdateGreetingWidget(emoji: _getGreetingEmoji()),
                    const SizedBox(height: 32),
                    UpdateMainMessageWidget(
                      message: _getMainMessage(),
                      highlightWords: _getHighlightWords(),
                    ),
                    const SizedBox(height: 24),
                    UpdateVersionInfoWidget(versionResult: versionResult),
                    const SizedBox(height: 40),
                    const UpdateSignatureWidget(),
                    const Spacer(flex: 2),
                    UpdateActionButtonWidget(
                      onPressed: state.isDownloading
                          ? null
                          : () => context.read<FormEngineUpdateBloc>().add(
                              const FormEngineStartDownloadEvent(),
                            ),
                      text: _getButtonText(),
                      isLoading: state.isDownloading,
                      loadingText: 'Downloading...',
                      progress: state.progress,
                      isCompleted: state.isCompleted,
                      isForced: versionResult.isForced,
                    ),
                    AnimatedSize(
                      duration: const Duration(milliseconds: 400),
                      curve: Curves.easeInOut,
                      child: AnimatedSwitcher(
                        duration: const Duration(milliseconds: 300),
                        child:
                            (!versionResult.isForced &&
                                !state.isDownloading &&
                                !state.isCompleted)
                            ? Column(
                                key: const ValueKey('skip-section'),
                                children: [
                                  const SizedBox(height: 16),
                                  UpdateSkipButtonWidget(
                                    onPressed: () =>
                                        Navigator.of(context).pop(),
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
    final engineName = versionResult.formEngine.formEngineId == 1
        ? 'FormGear'
        : 'FasihForm';
    switch (versionResult.state) {
      case VersionState.missing:
        return versionResult.isForced
            ? 'Maaf! Engine $engineName diperlukan untuk perangkat ini. '
                  'Silakan unduh untuk melanjutkan!'
            : 'Hai! Engine $engineName tidak tersedia di perangkat Anda. '
                  'Apakah Anda ingin mengunduhnya?';
      case VersionState.outdated:
        return versionResult.isForced
            ? 'Maaf! Engine $engineName Anda sudah usang di perangkat ini. '
                  'Silakan perbarui untuk melanjutkan!'
            : 'Hai! Versi baru engine $engineName tersedia. '
                  'Apakah Anda ingin memperbaruinya?';
      case VersionState.current:
        return 'Bagus! Anda memiliki versi engine $engineName terbaru. '
            'Apakah Anda ingin mengunduh ulang?';
    }
  }

  List<String> _getHighlightWords() {
    return [
      'formgear',
      'fasihform',
      'engine',
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
