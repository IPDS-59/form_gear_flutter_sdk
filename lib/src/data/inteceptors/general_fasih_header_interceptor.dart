import 'package:dio/dio.dart';

class GeneralFasihHeaderInterceptor extends Interceptor {
  const GeneralFasihHeaderInterceptor({this.deviceInfo});

  final String? deviceInfo;

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    options.headers.addAll({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent':
          deviceInfo ??
          'Dalvik/2.1.0 (Linux; U; Android 8.1.0; '
              'Android SDK built for x86 Build/OSM1.180201.021)',
    });

    handler.next(options);
  }
}
