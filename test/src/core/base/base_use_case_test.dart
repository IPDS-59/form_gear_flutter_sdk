import 'package:flutter_test/flutter_test.dart';
import 'package:form_gear_engine_sdk/src/core/base/base_use_case.dart';

// Test repository
class TestRepository {
  String getData(int id) => 'Data $id';
  String getAllData() => 'All Data';
}

// Test use case with parameter
class GetDataUseCase extends BaseUseCase<String, int, TestRepository> {
  const GetDataUseCase(super.repo);

  @override
  Future<String> call(int param) async {
    return repo.getData(param);
  }
}

// Test use case without parameter
class GetAllDataUseCase extends BaseNoParamUseCase<String, TestRepository> {
  const GetAllDataUseCase(super.repo);

  @override
  Future<String> call() async {
    return repo.getAllData();
  }
}

void main() {
  group('BaseUseCase Tests', () {
    late TestRepository repository;
    late GetDataUseCase useCase;

    setUp(() {
      repository = TestRepository();
      useCase = GetDataUseCase(repository);
    });

    group('Construction', () {
      test('should initialize with repository', () {
        expect(useCase.repo, equals(repository));
      });

      test('should support creating multiple instances', () {
        final useCase1 = GetDataUseCase(TestRepository());
        final useCase2 = GetDataUseCase(TestRepository());

        expect(useCase1, isA<GetDataUseCase>());
        expect(useCase2, isA<GetDataUseCase>());
      });
    });

    group('Execution', () {
      test('should call repository method with parameter', () async {
        final result = await useCase(42);

        expect(result, equals('Data 42'));
      });

      test('should call repository method with different parameters', () async {
        final result1 = await useCase(1);
        final result2 = await useCase(2);
        final result3 = await useCase(100);

        expect(result1, equals('Data 1'));
        expect(result2, equals('Data 2'));
        expect(result3, equals('Data 100'));
      });

      test('should support multiple invocations', () async {
        await useCase(1);
        await useCase(2);
        final result = await useCase(3);

        expect(result, equals('Data 3'));
      });
    });

    group('Type Safety', () {
      test('should maintain type safety for Result type', () async {
        final result = await useCase(42);

        expect(result, isA<String>());
      });

      test('should maintain type safety for Param type', () {
        expect(useCase, isA<BaseUseCase<String, int, TestRepository>>());
      });

      test('should maintain type safety for Repository type', () {
        expect(useCase.repo, isA<TestRepository>());
      });
    });
  });

  group('BaseNoParamUseCase Tests', () {
    late TestRepository repository;
    late GetAllDataUseCase useCase;

    setUp(() {
      repository = TestRepository();
      useCase = GetAllDataUseCase(repository);
    });

    group('Construction', () {
      test('should initialize with repository', () {
        expect(useCase.repo, equals(repository));
      });

      test('should support creating multiple instances', () {
        final useCase1 = GetAllDataUseCase(TestRepository());
        final useCase2 = GetAllDataUseCase(TestRepository());

        expect(useCase1, isA<GetAllDataUseCase>());
        expect(useCase2, isA<GetAllDataUseCase>());
      });
    });

    group('Execution', () {
      test('should call repository method without parameter', () async {
        final result = await useCase();

        expect(result, equals('All Data'));
      });

      test('should return same result on multiple calls', () async {
        final result1 = await useCase();
        final result2 = await useCase();
        final result3 = await useCase();

        expect(result1, equals('All Data'));
        expect(result2, equals('All Data'));
        expect(result3, equals('All Data'));
      });
    });

    group('Type Safety', () {
      test('should maintain type safety for Result type', () async {
        final result = await useCase();

        expect(result, isA<String>());
      });

      test('should maintain type safety for Repository type', () {
        expect(useCase.repo, isA<TestRepository>());
      });
    });
  });

  group('Real-world Use Case Patterns', () {
    test('should support Result pattern integration', () async {
      final repository = TestRepository();
      final useCase = GetDataUseCase(repository);

      final result = await useCase(123);

      expect(result, isNotEmpty);
      expect(result, contains('123'));
    });

    test('should support dependency injection pattern', () {
      final mockRepo = TestRepository();
      final useCase = GetDataUseCase(mockRepo);

      expect(useCase.repo, same(mockRepo));
    });

    test('should support clean architecture separation', () {
      // Domain layer (use case) should only depend on repository interface
      final repository = TestRepository();
      final useCase = GetDataUseCase(repository);

      expect(useCase, isA<BaseUseCase<dynamic, dynamic, dynamic>>());
      expect(useCase.repo, isA<TestRepository>());
    });
  });
}
