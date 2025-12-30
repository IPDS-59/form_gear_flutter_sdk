import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:form_gear_engine_sdk/src/presentation/bloc/audio_recorder_bloc.dart';
import 'package:form_gear_engine_sdk/src/presentation/widgets/audio_recorder/audio_recorder.dart';
import 'package:form_gear_engine_sdk/src/presentation/widgets/permission_consent_screen.dart';
import 'package:permission_handler/permission_handler.dart';

/// Audio recorder screen with BLoC state management and permissions
/// Following FASIH patterns for media file management
class AudioRecorderScreen extends StatelessWidget {
  const AudioRecorderScreen({
    required this.title,
    required this.assignmentId,
    required this.fileName,
    this.dataKey,
    this.templateName,
    super.key,
  });

  final String title;
  final String assignmentId;
  final String fileName;
  final String? dataKey;
  final String? templateName;

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => AudioRecorderBloc()..add(InitializeRecorder()),
      child: _AudioRecorderView(
        title: title,
        assignmentId: assignmentId,
        fileName: fileName,
        dataKey: dataKey,
        templateName: templateName,
      ),
    );
  }
}

class _AudioRecorderView extends StatefulWidget {
  const _AudioRecorderView({
    required this.title,
    required this.assignmentId,
    required this.fileName,
    this.dataKey,
    this.templateName,
  });

  final String title;
  final String assignmentId;
  final String fileName;
  final String? dataKey;
  final String? templateName;

  @override
  State<_AudioRecorderView> createState() => _AudioRecorderViewState();
}

class _AudioRecorderViewState extends State<_AudioRecorderView>
    with WidgetsBindingObserver, TickerProviderStateMixin {
  late AnimationController _pulseController;
  late AnimationController _waveController;
  late AnimationController _contextSwitchController;
  late Animation<double> _pulseAnimation;
  late Animation<double> _waveAnimation;
  late Animation<double> _contextSwitchAnimation;
  bool _showTemplate = true;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _initAnimations();
    _startContextSwitchingIfNeeded();
  }

  void _initAnimations() {
    _pulseController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );
    _waveController = AnimationController(
      duration: const Duration(milliseconds: 2000),
      vsync: this,
    );
    _contextSwitchController = AnimationController(
      duration: const Duration(milliseconds: 600),
      vsync: this,
    );

    _pulseAnimation = Tween<double>(begin: 1, end: 1.2).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.elasticOut),
    );

    _waveAnimation = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _waveController, curve: Curves.easeInOut),
    );

    _contextSwitchAnimation = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(
        parent: _contextSwitchController,
        curve: Curves.easeInOut,
      ),
    );
  }

  void _startContextSwitchingIfNeeded() {
    if (widget.templateName != null && widget.dataKey != null) {
      Future.delayed(const Duration(seconds: 2), () {
        if (mounted) _startContextSwitching();
      });
    }
  }

  void _startContextSwitching() {
    _contextSwitchController.forward().then((_) {
      if (mounted) {
        setState(() => _showTemplate = !_showTemplate);
        _contextSwitchController.reverse().then((_) {
          if (mounted) {
            Future.delayed(const Duration(seconds: 3), () {
              if (mounted) _startContextSwitching();
            });
          }
        });
      }
    });
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _pulseController.dispose();
    _waveController.dispose();
    _contextSwitchController.dispose();
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    super.didChangeAppLifecycleState(state);
    context.read<AudioRecorderBloc>().add(AppLifecycleChanged(state));
  }

  void _handleStateChange(BuildContext context, AudioRecorderState state) {
    if (state is AudioRecorderCompleted) {
      _pulseController.stop();
      _waveController.stop();
      Navigator.of(context).pop(state.filePath);
    } else if (state is AudioRecorderShowingConfirmation) {
      _pulseController.stop();
      _waveController.stop();
    } else if (state is AudioRecorderRecording) {
      _pulseController.repeat(reverse: true);
      _waveController.repeat();
    } else if (state is AudioRecorderPaused) {
      _pulseController.stop();
      _waveController.stop();
    } else if (state is AudioRecorderReady) {
      _pulseController.reset();
      _waveController.reset();
    } else if (state is AudioRecorderError) {
      _pulseController.stop();
      _waveController.stop();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(state.message),
          backgroundColor: Colors.red.shade600,
        ),
      );
    } else if (state is AudioRecorderNeedsPermissions) {
      _showPermissionConsentScreen(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      extendBodyBehindAppBar: true,
      appBar: _buildAppBar(context),
      body: BlocConsumer<AudioRecorderBloc, AudioRecorderState>(
        listener: _handleStateChange,
        builder: _buildBody,
      ),
    );
  }

  PreferredSizeWidget _buildAppBar(BuildContext context) {
    return AppBar(
      backgroundColor: Colors.transparent,
      elevation: 0,
      surfaceTintColor: Colors.transparent,
      leading: IconButton(
        icon: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.9),
            borderRadius: BorderRadius.circular(12),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.1),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
        ),
        color: Colors.black87,
        onPressed: () => Navigator.of(context).pop(),
      ),
      title: Text(
        widget.title,
        style: const TextStyle(
          color: Colors.black87,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }

  Widget _buildBody(BuildContext context, AudioRecorderState state) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          child: ConstrainedBox(
            constraints: BoxConstraints(
              minHeight:
                  MediaQuery.of(context).size.height -
                  MediaQuery.of(context).padding.top -
                  MediaQuery.of(context).padding.bottom -
                  kToolbarHeight -
                  32,
            ),
            child: IntrinsicHeight(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (state is AudioRecorderCheckingPermissions)
                    const Expanded(child: AudioLoadingWidget())
                  else if (state is AudioRecorderPermissionDenied)
                    const Expanded(child: AudioPermissionWidget())
                  else if (state is AudioRecorderNeedsPermissions)
                    const Expanded(child: AudioLoadingWidget())
                  else if (state is AudioRecorderShowingConfirmation)
                    Expanded(
                      child: AudioConfirmationWidget(
                        state: state,
                        assignmentId: widget.assignmentId,
                        fileName: widget.fileName,
                      ),
                    )
                  else
                    Expanded(
                      child: AudioRecordingView(
                        state: state,
                        dataKey: widget.dataKey,
                        templateName: widget.templateName,
                        assignmentId: widget.assignmentId,
                        fileName: widget.fileName,
                        showTemplate: _showTemplate,
                        pulseAnimation: _pulseAnimation,
                        waveAnimation: _waveAnimation,
                        contextSwitchAnimation: _contextSwitchAnimation,
                      ),
                    ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  void _showPermissionConsentScreen(BuildContext context) {
    const permissions = [
      PermissionConsentItem(
        permission: Permission.microphone,
        title: 'Akses Mikrofon',
        description:
            'Dibutuhkan untuk merekam audio dengan kualitas terbaik. '
            'File audio akan disimpan di penyimpanan internal aplikasi.',
        icon: Icons.mic,
        color: Color(0xFFE91E63),
      ),
    ];

    PermissionConsentScreen.show(
      context: context,
      title: 'Izin diperlukan untuk merekam audio',
      subtitle:
          'Aplikasi memerlukan akses mikrofon untuk merekam audio. '
          'File audio akan disimpan secara otomatis di penyimpanan internal '
          'aplikasi dan hanya digunakan untuk keperluan formulir.',
      permissions: permissions,
      emoji: '🎙️',
      onPermissionsGranted: () {
        context.read<AudioRecorderBloc>().add(PermissionsGranted());
      },
      onPermissionsDenied: () {
        context.read<AudioRecorderBloc>().add(PermissionsDenied());
      },
    );
  }
}
