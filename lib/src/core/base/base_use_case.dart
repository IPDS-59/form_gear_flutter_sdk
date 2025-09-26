abstract class BaseUseCase<Result, Param, Repository> {
  const BaseUseCase(this.repo);

  final Repository repo;

  Future<Result> call(Param param);
}

abstract class BaseNoParamUseCase<Result, Repository> {
  const BaseNoParamUseCase(this.repo);

  final Repository repo;

  Future<Result> call();
}
