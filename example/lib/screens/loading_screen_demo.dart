import 'package:flutter/material.dart';
import 'package:form_gear_engine_sdk/src/presentation/widgets/form_gear_loading_screen.dart';

class LoadingScreenDemo extends StatefulWidget {
  const LoadingScreenDemo({super.key});

  @override
  State<LoadingScreenDemo> createState() => _LoadingScreenDemoState();
}

class _LoadingScreenDemoState extends State<LoadingScreenDemo> {
  int _loadingProgress = 0;
  late Stream<int> _progressStream;

  @override
  void initState() {
    super.initState();
    _startProgressSimulation();
  }

  void _startProgressSimulation() {
    _progressStream = Stream.periodic(
      const Duration(milliseconds: 100),
      (tick) {
        final progress = (tick * 2).clamp(0, 100);
        if (progress >= 100) {
          return 100;
        }
        return progress;
      },
    ).take(51); // 51 ticks to reach 100

    _progressStream.listen((progress) {
      if (mounted) {
        setState(() {
          _loadingProgress = progress;
        });
      }
    });
  }

  void _resetProgress() {
    setState(() {
      _loadingProgress = 0;
    });
    _startProgressSimulation();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Loading Screen Demo'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        actions: [
          IconButton(
            onPressed: _resetProgress,
            icon: const Icon(Icons.refresh),
            tooltip: 'Reset Progress',
          ),
        ],
      ),
      body: FormGearLoadingScreen(loadingProgress: _loadingProgress),
    );
  }
}