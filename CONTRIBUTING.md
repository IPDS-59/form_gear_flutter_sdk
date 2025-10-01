# Contributing to FormGear Engine SDK

Thank you for considering contributing to the FormGear Engine SDK! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Contributing Workflow](#contributing-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Community Guidelines](#community-guidelines)

## Code of Conduct

This project adheres to a code of conduct that we expect all contributors to follow. Please be respectful, inclusive, and professional in all interactions.

## Getting Started

### Prerequisites

- Flutter SDK (stable channel)
- Dart SDK (compatible with stable Flutter)
- Git
- A code editor (VS Code recommended)

### Quick Start

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub, then:
   git clone https://github.com/your-username/form_gear_flutter_sdk.git
   cd form_gear_flutter_sdk
   ```

2. **Install dependencies**
   ```bash
   flutter pub get
   cd example && flutter pub get
   ```

3. **Run tests**
   ```bash
   flutter test
   ```

4. **Run the example app**
   ```bash
   cd example
   flutter run
   ```

## Development Setup

### VS Code Configuration

The project includes VS Code launch configurations in `.vscode/launch.json`:

- **Debug Mode**: Launch FormGear Example (Debug)
- **Release Mode**: Launch FormGear Example (Release)
- **Profile Mode**: Launch FormGear Example (Profile)
- **Android**: Launch FormGear Example (Android)
- **iOS**: Launch FormGear Example (iOS)

### Required Extensions

- Flutter
- Dart
- GitLens (recommended)
- Bracket Pair Colorizer (recommended)

## Project Structure

```
lib/src/
├── core/                    # Infrastructure & Cross-cutting
│   ├── base/                # Base classes (UseCase, Result)
│   ├── config/              # Configuration models
│   ├── constants/           # FASIH directory constants
│   ├── di/                  # Dependency Injection (GetIt)
│   ├── download/            # Download management
│   ├── js_bridge/           # WebView-Flutter communication
│   ├── server/              # Local HTTP server
│   ├── version/             # Version management
│   └── form_gear_sdk.dart   # Main SDK entry point
├── domain/                  # Business Logic Layer
│   ├── repositories/        # Repository interfaces
│   └── usecases/            # Business logic use cases
├── data/                    # Data Layer
│   ├── repositories/        # Repository implementations
│   ├── datasources/         # Remote/Local data sources
│   └── interceptors/        # HTTP interceptors
├── presentation/            # UI Layer
│   └── widgets/             # Reusable Flutter widgets
├── models/                  # Data models & entities
└── utils/                   # Utilities & helpers
```

## Contributing Workflow

### Branching Strategy

We use **Git Flow** workflow:

- `main` - Production ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `release/*` - Release preparation
- `hotfix/*` - Critical fixes

### Development Process

1. **Create a feature branch**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow coding standards
   - Write tests for new functionality
   - Update documentation

3. **Test your changes**
   ```bash
   flutter test
   flutter analyze
   dart format .
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   # Create PR via GitHub UI targeting `develop` branch
   ```

## Coding Standards

### Dart/Flutter Guidelines

- Follow [Effective Dart](https://dart.dev/guides/language/effective-dart) guidelines
- Use `very_good_analysis` linting rules
- Maximum line length: 80 characters
- Use meaningful variable and function names
- Add dartdoc comments for public APIs

### Architecture Principles

- **Clean Architecture**: Separate concerns across layers
- **Repository Pattern**: Abstract data sources
- **Use Cases**: Encapsulate business logic
- **Result Pattern**: Type-safe error handling
- **Dependency Injection**: Use GetIt with Injectable

### Code Formatting

Always run before committing:
```bash
dart format .
dart fix --apply
flutter analyze
```

### Naming Conventions

- **Files**: `snake_case.dart`
- **Classes**: `PascalCase`
- **Variables/Functions**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Private members**: `_prefixedWithUnderscore`

## Testing Guidelines

### Test Structure

- **Unit Tests**: Test individual functions/classes
- **Integration Tests**: Test component interactions
- **Widget Tests**: Test UI components

### Testing Requirements

- All new code must have tests
- Aim for >90% code coverage
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### Test Categories

1. **Domain Layer Tests**
   ```dart
   // Example: Use case tests
   test('should return FormEngineResponse when repository succeeds', () async {
     // Arrange
     when(() => mockRepository.checkVersion('1')).thenAnswer(
       (_) async => Success(responseData),
     );

     // Act
     final result = await useCase('1');

     // Assert
     expect(result, isA<Success<FormEngineResponse>>());
   });
   ```

2. **Repository Tests**
   - Test success/failure scenarios
   - Mock data sources
   - Verify proper error mapping

3. **Data Source Tests**
   - Test HTTP requests/responses
   - Test error handling
   - Mock external dependencies

### Running Tests

```bash
# Run all tests
flutter test

# Run with coverage
flutter test --coverage
genhtml coverage/lcov.info -o coverage/html

# Run specific test file
flutter test test/src/domain/usecases/check_form_engine_version_test.dart
```

## Documentation

### Code Documentation

- Add dartdoc comments for all public APIs
- Include usage examples
- Document parameters and return values
- Explain complex logic

### README Updates

When adding new features:
- Update installation instructions
- Add usage examples
- Update feature list
- Include any breaking changes

### Changelog

- Follow [Keep a Changelog](https://keepachangelog.com/) format
- Add entries for all user-facing changes
- Categorize changes: Added, Changed, Deprecated, Removed, Fixed, Security

## Pull Request Process

### PR Checklist

Before submitting a PR, ensure:

- [ ] Code follows project standards
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] PR fills out the template completely
- [ ] Branch is up to date with `develop`
- [ ] Commits follow conventional format

### PR Template

Use the provided YAML PR template which includes:
- Summary and change type
- Component modifications
- Testing information
- Documentation updates
- Review focus areas

### Review Process

1. **Automated Checks**: CI must pass
2. **Peer Review**: At least one approval required
3. **Maintainer Review**: Core team member approval
4. **Merge**: Squash and merge to develop

## Issue Reporting

### Before Creating an Issue

- Search existing issues
- Check documentation
- Try latest version
- Prepare minimal reproduction

### Issue Types

Use the appropriate template:

- **🐛 Bug Report**: For bugs and errors
- **✨ Feature Request**: For new features
- **❓ Question**: For usage questions
- **📖 Documentation**: For doc improvements

### Bug Reports Must Include

- FormGear SDK version
- Flutter/Dart versions
- Platform (iOS/Android/Web)
- Steps to reproduce
- Expected vs actual behavior
- Code sample (minimal)
- Error logs/stack trace

## Community Guidelines

### Communication Channels

- **GitHub Issues**: Bug reports, feature requests
- **GitHub Discussions**: Questions, ideas, showcases
- **Pull Requests**: Code contributions

### Being a Good Contributor

- **Be respectful**: Treat everyone with kindness
- **Be patient**: Reviews take time
- **Be helpful**: Help others in discussions
- **Be clear**: Write clear descriptions and comments
- **Be collaborative**: Work together towards solutions

### Recognition

Contributors will be:
- Listed in README acknowledgments
- Credited in release notes
- Given contributor badges
- Invited to become maintainers (outstanding contributors)

## Development Resources

### Useful Commands

```bash
# Code generation
flutter packages pub run build_runner build --delete-conflicting-outputs

# Dependency analysis
flutter pub deps

# Build example app
cd example && flutter build apk --release

# Generate HTML for testing
ruby scripts/generate_html.rb 1 demo
```

### FASIH Integration

When working on FASIH-related features:
- Follow BPS directory structure exactly
- Use FASIH-compatible headers
- Test with FASIH backend endpoints
- Ensure version compatibility

### Debugging Tips

1. **WebView Issues**: Use bridge test page
2. **Asset Loading**: Check directory constants
3. **API Calls**: Use network inspection
4. **Version Conflicts**: Check DirectoryConstants paths

## Getting Help

If you need help:

1. **Check Documentation**: README, CLAUDE.md
2. **Search Issues**: Existing issues and discussions
3. **Create Question Issue**: Use question template
4. **Join Discussions**: GitHub discussions

## License

By contributing to FormGear Engine SDK, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to FormGear Engine SDK! Your contributions help make form development easier for Indonesian government data collection and beyond. 🚀