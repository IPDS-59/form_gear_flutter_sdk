// dart format width=80
// GENERATED CODE - DO NOT MODIFY BY HAND

// **************************************************************************
// InjectableConfigGenerator
// **************************************************************************

// ignore_for_file: type=lint
// coverage:ignore-file

// ignore_for_file: no_leading_underscores_for_library_prefixes
import 'package:dio/dio.dart' as _i361;
import 'package:form_gear_engine_sdk/src/core/config/form_gear_api_config.dart'
    as _i100;
import 'package:form_gear_engine_sdk/src/core/di/injection.dart' as _i621;
import 'package:form_gear_engine_sdk/src/core/download/form_gear_download_manager.dart'
    as _i714;
import 'package:form_gear_engine_sdk/src/core/download/template_download_manager.dart'
    as _i535;
import 'package:form_gear_engine_sdk/src/core/version/form_gear_version_manager.dart'
    as _i771;
import 'package:form_gear_engine_sdk/src/core/version/template_version_manager.dart'
    as _i1069;
import 'package:form_gear_engine_sdk/src/data/datasources/form_engine_remote_data_source.dart'
    as _i242;
import 'package:form_gear_engine_sdk/src/data/datasources/template_remote_data_source.dart'
    as _i393;
import 'package:form_gear_engine_sdk/src/data/repositories/download_repository_impl.dart'
    as _i323;
import 'package:form_gear_engine_sdk/src/data/repositories/file_repository_impl.dart'
    as _i1070;
import 'package:form_gear_engine_sdk/src/data/repositories/form_engine_repository_impl.dart'
    as _i1069;
import 'package:form_gear_engine_sdk/src/data/repositories/template_repository_impl.dart'
    as _i1019;
import 'package:form_gear_engine_sdk/src/data/repositories/version_repository_impl.dart'
    as _i609;
import 'package:form_gear_engine_sdk/src/data/repositories/zip_repository_impl.dart'
    as _i542;
import 'package:form_gear_engine_sdk/src/domain/repositories/download_repository.dart'
    as _i170;
import 'package:form_gear_engine_sdk/src/domain/repositories/file_repository.dart'
    as _i260;
import 'package:form_gear_engine_sdk/src/domain/repositories/form_engine_repository.dart'
    as _i458;
import 'package:form_gear_engine_sdk/src/domain/repositories/template_repository.dart'
    as _i299;
import 'package:form_gear_engine_sdk/src/domain/repositories/version_repository.dart'
    as _i906;
import 'package:form_gear_engine_sdk/src/domain/repositories/zip_repository.dart'
    as _i422;
import 'package:form_gear_engine_sdk/src/domain/usecases/check_form_engine_version_usecase.dart'
    as _i876;
import 'package:form_gear_engine_sdk/src/domain/usecases/download_form_engine_usecase.dart'
    as _i985;
import 'package:form_gear_engine_sdk/src/domain/usecases/download_template_usecase.dart'
    as _i612;
import 'package:form_gear_engine_sdk/src/domain/usecases/extract_form_engine_usecase.dart'
    as _i356;
import 'package:form_gear_engine_sdk/src/domain/usecases/extract_template_usecase.dart'
    as _i87;
import 'package:form_gear_engine_sdk/src/domain/usecases/get_custom_template_data_usecase.dart'
    as _i732;
import 'package:form_gear_engine_sdk/src/domain/usecases/get_local_form_engine_version_usecase.dart'
    as _i190;
import 'package:form_gear_engine_sdk/src/domain/usecases/get_local_template_version_usecase.dart'
    as _i471;
import 'package:form_gear_engine_sdk/src/domain/usecases/get_lookup_data_usecase.dart'
    as _i560;
import 'package:form_gear_engine_sdk/src/domain/usecases/is_form_engine_downloaded_usecase.dart'
    as _i186;
import 'package:form_gear_engine_sdk/src/domain/usecases/save_form_engine_version_usecase.dart'
    as _i58;
import 'package:form_gear_engine_sdk/src/domain/usecases/save_template_version_usecase.dart'
    as _i980;
import 'package:get_it/get_it.dart' as _i174;
import 'package:injectable/injectable.dart' as _i526;

// initializes the registration of main-scope dependencies inside of GetIt
_i174.GetIt $initGetIt(
  _i174.GetIt getIt, {
  String? environment,
  _i526.EnvironmentFilter? environmentFilter,
}) {
  final gh = _i526.GetItHelper(getIt, environment, environmentFilter);
  final registerModule = _$RegisterModule();
  gh.lazySingleton<_i361.Dio>(
    () => registerModule.dio(gh<_i100.FormGearApiConfig>()),
  );
  gh.lazySingleton<_i170.DownloadRepository>(
    () => _i323.DownloadRepositoryImpl(gh<_i361.Dio>()),
  );
  gh.lazySingleton<_i393.TemplateRemoteDataSource>(
    () => _i393.TemplateRemoteDataSourceImpl(
      apiConfig: gh<_i100.FormGearApiConfig>(),
      dio: gh<_i361.Dio>(),
    ),
  );
  gh.lazySingleton<_i242.FormEngineRemoteDataSource>(
    () => _i242.FormEngineRemoteDataSourceImpl(
      apiConfig: gh<_i100.FormGearApiConfig>(),
      dio: gh<_i361.Dio>(),
    ),
  );
  gh.lazySingleton<_i714.FormGearDownloadManager>(
    () => _i714.FormGearDownloadManager(gh<_i361.Dio>()),
  );
  gh.lazySingleton<_i260.FileRepository>(() => _i1070.FileRepositoryImpl());
  gh.lazySingleton<_i299.TemplateRepository>(
    () => _i1019.TemplateRepositoryImpl(
      remoteDataSource: gh<_i393.TemplateRemoteDataSource>(),
    ),
  );
  gh.lazySingleton<_i560.GetLookupDataUseCase>(
    () => _i560.GetLookupDataUseCase(gh<_i299.TemplateRepository>()),
  );
  gh.lazySingleton<_i732.GetCustomTemplateDataUseCase>(
    () => _i732.GetCustomTemplateDataUseCase(gh<_i299.TemplateRepository>()),
  );
  gh.lazySingleton<_i906.VersionRepository>(
    () =>
        _i609.VersionRepositoryImpl(fileRepository: gh<_i260.FileRepository>()),
  );
  gh.lazySingleton<_i422.ZipRepository>(
    () => _i542.ZipRepositoryImpl(fileRepository: gh<_i260.FileRepository>()),
  );
  gh.lazySingleton<_i985.DownloadFormEngineUseCase>(
    () => _i985.DownloadFormEngineUseCase(gh<_i170.DownloadRepository>()),
  );
  gh.lazySingleton<_i612.DownloadTemplateUseCase>(
    () => _i612.DownloadTemplateUseCase(gh<_i170.DownloadRepository>()),
  );
  gh.lazySingleton<_i458.FormEngineRepository>(
    () => _i1069.FormEngineRepositoryImpl(
      remoteDataSource: gh<_i242.FormEngineRemoteDataSource>(),
      downloadManager: gh<_i714.FormGearDownloadManager>(),
    ),
  );
  gh.lazySingleton<_i876.CheckFormEngineVersionUseCase>(
    () => _i876.CheckFormEngineVersionUseCase(gh<_i458.FormEngineRepository>()),
  );
  gh.lazySingleton<_i186.IsFormEngineDownloadedUseCase>(
    () => _i186.IsFormEngineDownloadedUseCase(gh<_i458.FormEngineRepository>()),
  );
  gh.lazySingleton<_i87.ExtractTemplateUseCase>(
    () => _i87.ExtractTemplateUseCase(gh<_i422.ZipRepository>()),
  );
  gh.lazySingleton<_i356.ExtractFormEngineUseCase>(
    () => _i356.ExtractFormEngineUseCase(gh<_i422.ZipRepository>()),
  );
  gh.lazySingleton<_i471.GetLocalTemplateVersionUseCase>(
    () => _i471.GetLocalTemplateVersionUseCase(gh<_i906.VersionRepository>()),
  );
  gh.lazySingleton<_i58.SaveFormEngineVersionUseCase>(
    () => _i58.SaveFormEngineVersionUseCase(gh<_i906.VersionRepository>()),
  );
  gh.lazySingleton<_i190.GetLocalFormEngineVersionUseCase>(
    () => _i190.GetLocalFormEngineVersionUseCase(gh<_i906.VersionRepository>()),
  );
  gh.lazySingleton<_i980.SaveTemplateVersionUseCase>(
    () => _i980.SaveTemplateVersionUseCase(gh<_i906.VersionRepository>()),
  );
  gh.lazySingleton<_i535.TemplateDownloadManager>(
    () => _i535.TemplateDownloadManager(
      gh<_i612.DownloadTemplateUseCase>(),
      gh<_i87.ExtractTemplateUseCase>(),
      gh<_i980.SaveTemplateVersionUseCase>(),
      gh<_i471.GetLocalTemplateVersionUseCase>(),
    ),
  );
  gh.lazySingleton<_i771.FormGearVersionManager>(
    () => _i771.FormGearVersionManager(
      gh<_i876.CheckFormEngineVersionUseCase>(),
      gh<_i186.IsFormEngineDownloadedUseCase>(),
      gh<_i361.Dio>(),
    ),
  );
  gh.lazySingleton<_i1069.TemplateVersionManager>(
    () => _i1069.TemplateVersionManager(gh<_i535.TemplateDownloadManager>()),
  );
  return getIt;
}

class _$RegisterModule extends _i621.RegisterModule {}
