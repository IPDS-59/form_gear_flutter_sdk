# FormGear SDK Scripts

This directory contains utility scripts for the FormGear SDK development workflow.

## Coverage Report Generator

### `generate_coverage_report.sh`

A comprehensive script for generating detailed test coverage reports that can be used both locally and in CI environments.

#### Features

- **Full Coverage Analysis**: Runs all tests and generates complete coverage data
- **Changed Files Only**: Analyzes coverage only for files changed compared to a base branch
- **Multiple Output Formats**: Supports markdown, console, or both
- **Detailed Per-File Breakdown**: Shows line and function coverage for each file
- **Smart CI Integration**: Handles scenarios where tests don't exist or fail
- **Branch Comparison**: Compares changes against any base branch (default: develop)

#### Usage

**Local Development:**

```bash
# Full coverage report (runs all tests)
./scripts/generate_coverage_report.sh --full

# Coverage for changed files only (compared to develop)
./scripts/generate_coverage_report.sh --changed-only

# Coverage for changed files compared to main
./scripts/generate_coverage_report.sh --changed-only --base-branch main

# Console output instead of markdown
./scripts/generate_coverage_report.sh --format console

# Both console and markdown output
./scripts/generate_coverage_report.sh --format both
```

**CI Integration:**

The script is automatically used in the CI workflow with intelligent coverage scope:

- **Full Coverage**: For core changes or pull requests
- **Changed Files Only**: For regular Dart file changes
- **Minimal Testing**: For non-Dart changes

#### Output

The script generates:

1. **Markdown Report** (`coverage_report.md`):

   - Overall coverage statistics
   - Per-file coverage breakdown
   - Coverage quality assessment
   - Raw coverage data

2. **Console Output**:
   - Colored status messages
   - Quick coverage summary
   - Progress indicators

#### Examples

**Full Coverage Report:**

```bash
./scripts/generate_coverage_report.sh --full --format both
```

**Changed Files Analysis:**

```bash
./scripts/generate_coverage_report.sh --changed-only --base-branch develop
```

**Help:**

```bash
./scripts/generate_coverage_report.sh --help
```

#### CI Behavior

The CI workflow uses this script to:

1. **Detect Changes**: Automatically determines which files changed
2. **Smart Coverage**: Runs full coverage for important changes, partial for others
3. **Detailed Reports**: Generates comprehensive coverage reports for PR comments
4. **Fallback Handling**: Gracefully handles cases with no tests or test failures

#### Coverage Thresholds

- **Excellent**: ≥80% line coverage 🟢
- **Good**: ≥60% line coverage 🟡
- **Needs Improvement**: <60% line coverage 🔴

#### Requirements

- Flutter SDK installed
- Git repository (for changed file detection)
- `bc` calculator (usually pre-installed on most systems)

#### Troubleshooting

**No test files found:**

- Add test files to the `test/` directory
- Follow Flutter testing conventions (`*_test.dart`)

**Coverage file not generated:**

- Ensure tests pass with `flutter test`
- Check that `flutter test --coverage` works manually

**Changed files not detected:**

- Verify you're in a git repository
- Check that the base branch exists
- Ensure git has proper remote tracking
