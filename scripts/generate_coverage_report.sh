#!/bin/bash

# FormGear SDK Coverage Report Generator
# Can be used locally or in CI to generate detailed test coverage reports
# Handles both full and partial coverage scenarios

set -e

# Colors for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
COVERAGE_FILE="coverage/lcov.info"
REPORT_FILE="coverage_report.md"
MIN_COVERAGE_THRESHOLD=60
GOOD_COVERAGE_THRESHOLD=80

# Parse command line arguments
FULL_COVERAGE=false
CHANGED_FILES_ONLY=false
BASE_BRANCH=""
OUTPUT_FORMAT="markdown"  # markdown, console, both

while [[ $# -gt 0 ]]; do
  case $1 in
    --full)
      FULL_COVERAGE=true
      shift
      ;;
    --changed-only)
      CHANGED_FILES_ONLY=true
      shift
      ;;
    --base-branch)
      BASE_BRANCH="$2"
      shift 2
      ;;
    --format)
      OUTPUT_FORMAT="$2"
      shift 2
      ;;
    --help)
      echo "Usage: $0 [OPTIONS]"
      echo ""
      echo "Options:"
      echo "  --full              Generate full coverage report (runs all tests)"
      echo "  --changed-only      Only show coverage for changed files"
      echo "  --base-branch BRANCH  Compare against specific branch (default: develop)"
      echo "  --format FORMAT     Output format: markdown, console, both (default: markdown)"
      echo "  --help              Show this help message"
      echo ""
      echo "Examples:"
      echo "  $0                                    # Full coverage, markdown output"
      echo "  $0 --changed-only --base-branch main # Only changed files vs main"
      echo "  $0 --format both                     # Output to both console and markdown"
      exit 0
      ;;
    *)
      echo "Unknown option $1"
      exit 1
      ;;
  esac
done

# Set default base branch if not specified
if [[ -z "$BASE_BRANCH" ]]; then
  BASE_BRANCH="develop"
fi

print_header() {
  if [[ "$OUTPUT_FORMAT" == "console" || "$OUTPUT_FORMAT" == "both" ]]; then
    echo -e "${BLUE}=== FormGear SDK Coverage Report ===${NC}"
    echo ""
  fi
}

print_info() {
  if [[ "$OUTPUT_FORMAT" == "console" || "$OUTPUT_FORMAT" == "both" ]]; then
    echo -e "${BLUE}ℹ️  $1${NC}"
  fi
}

print_success() {
  if [[ "$OUTPUT_FORMAT" == "console" || "$OUTPUT_FORMAT" == "both" ]]; then
    echo -e "${GREEN}✅ $1${NC}"
  fi
}

print_warning() {
  if [[ "$OUTPUT_FORMAT" == "console" || "$OUTPUT_FORMAT" == "both" ]]; then
    echo -e "${YELLOW}⚠️  $1${NC}"
  fi
}

print_error() {
  if [[ "$OUTPUT_FORMAT" == "console" || "$OUTPUT_FORMAT" == "both" ]]; then
    echo -e "${RED}❌ $1${NC}"
  fi
}

# Function to get changed Dart files
get_changed_dart_files() {
  local base_branch="$1"

  # Check if we're in a git repository
  if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "Not in a git repository. Cannot determine changed files."
    return 1
  fi

  # Check if base branch exists
  if ! git show-ref --verify --quiet "refs/heads/$base_branch" && ! git show-ref --verify --quiet "refs/remotes/origin/$base_branch"; then
    print_warning "Base branch '$base_branch' not found. Using current changes only."
    git diff --name-only HEAD^ HEAD | grep '\.dart$' || true
  else
    # Get changed files compared to base branch
    if git show-ref --verify --quiet "refs/remotes/origin/$base_branch"; then
      git diff --name-only "origin/$base_branch"...HEAD | grep '\.dart$' || true
    else
      git diff --name-only "$base_branch"...HEAD | grep '\.dart$' || true
    fi
  fi
}

# Function to run tests and generate coverage
generate_coverage() {
  print_info "Generating test coverage..."

  # Check if test directory exists
  if [[ ! -d "test" ]]; then
    print_warning "No test directory found. Creating minimal coverage data."
    mkdir -p coverage
    echo "TN:" > "$COVERAGE_FILE"
    echo "SF:lib/src/core/form_gear_sdk.dart" >> "$COVERAGE_FILE"
    echo "LF:0" >> "$COVERAGE_FILE"
    echo "LH:0" >> "$COVERAGE_FILE"
    echo "end_of_record" >> "$COVERAGE_FILE"
    return 0
  fi

  # Count test files
  TEST_COUNT=$(find test -name '*_test.dart' 2>/dev/null | wc -l)

  if [[ "$TEST_COUNT" -eq 0 ]]; then
    print_warning "No test files found. Creating minimal coverage data."
    mkdir -p coverage
    echo "TN:" > "$COVERAGE_FILE"
    echo "SF:lib/src/core/form_gear_sdk.dart" >> "$COVERAGE_FILE"
    echo "LF:0" >> "$COVERAGE_FILE"
    echo "LH:0" >> "$COVERAGE_FILE"
    echo "end_of_record" >> "$COVERAGE_FILE"
    return 0
  fi

  print_info "Found $TEST_COUNT test files. Running tests with coverage..."

  # Run tests with coverage
  if flutter test --coverage --reporter=expanded; then
    print_success "Tests completed successfully"
  else
    print_error "Tests failed, but continuing with coverage analysis"
  fi

  # Verify coverage file exists
  if [[ ! -f "$COVERAGE_FILE" ]]; then
    print_error "Coverage file not generated. Tests may have failed completely."
    return 1
  fi
}

# Function to filter coverage data for changed files only
filter_coverage_for_changed_files() {
  local changed_files="$1"
  local temp_coverage="coverage/lcov_filtered.info"

  if [[ -z "$changed_files" ]]; then
    print_warning "No changed Dart files found. Showing full coverage."
    return 0
  fi

  print_info "Filtering coverage for changed files only..."

  # Create filtered coverage file
  > "$temp_coverage"

  local in_relevant_file=false
  local current_file=""

  while IFS= read -r line; do
    if [[ "$line" =~ ^SF: ]]; then
      current_file="${line#SF:}"
      in_relevant_file=false

      # Check if this file is in our changed files list
      while IFS= read -r changed_file; do
        if [[ "$current_file" == *"$changed_file"* ]]; then
          in_relevant_file=true
          break
        fi
      done <<< "$changed_files"

      if [[ "$in_relevant_file" == true ]]; then
        echo "$line" >> "$temp_coverage"
      fi
    elif [[ "$in_relevant_file" == true ]]; then
      echo "$line" >> "$temp_coverage"
    fi
  done < "$COVERAGE_FILE"

  # Use filtered coverage if it has content
  if [[ -s "$temp_coverage" ]]; then
    cp "$temp_coverage" "$COVERAGE_FILE"
    print_success "Filtered coverage data for changed files"
  else
    print_warning "No coverage data for changed files. Using full coverage."
  fi

  rm -f "$temp_coverage"
}

# Function to generate markdown report
generate_markdown_report() {
  local changed_files_only="$1"
  local changed_files="$2"

  print_info "Generating markdown coverage report..."

  cat > "$REPORT_FILE" << 'EOF'
# 📊 Test Coverage Report

EOF

  if [[ "$changed_files_only" == true ]]; then
    echo "**Scope**: Changed files only" >> "$REPORT_FILE"
    if [[ -n "$changed_files" ]]; then
      echo "" >> "$REPORT_FILE"
      echo "**Changed Files:**" >> "$REPORT_FILE"
      while IFS= read -r file; do
        echo "- \`$file\`" >> "$REPORT_FILE"
      done <<< "$changed_files"
    fi
  else
    echo "**Scope**: Full codebase coverage" >> "$REPORT_FILE"
  fi

  echo "" >> "$REPORT_FILE"

  if [[ ! -f "$COVERAGE_FILE" ]] || [[ ! -s "$COVERAGE_FILE" ]]; then
    cat >> "$REPORT_FILE" << 'EOF'
## ⚠️ No Coverage Data Available

Coverage report could not be generated. This can happen when:
- No test files exist in the repository
- Tests failed to execute completely
- Coverage collection was disabled

**Recommendations:**
- Add unit tests to the `test/` directory
- Ensure tests pass with `flutter test`
- Run with `flutter test --coverage` to generate coverage data

EOF
    return 0
  fi

  # Extract coverage statistics
  local total_lines=$(grep "^LF:" "$COVERAGE_FILE" | awk -F: '{sum += $2} END {print sum+0}')
  local hit_lines=$(grep "^LH:" "$COVERAGE_FILE" | awk -F: '{sum += $2} END {print sum+0}')
  local total_functions=$(grep "^FNF:" "$COVERAGE_FILE" | awk -F: '{sum += $2} END {print sum+0}')
  local hit_functions=$(grep "^FNH:" "$COVERAGE_FILE" | awk -F: '{sum += $2} END {print sum+0}')

  local line_coverage="0.0"
  local function_coverage="0.0"

  if [[ "$total_lines" -gt 0 ]]; then
    line_coverage=$(awk "BEGIN {printf \"%.1f\", ($hit_lines/$total_lines)*100}")
  fi

  if [[ "$total_functions" -gt 0 ]]; then
    function_coverage=$(awk "BEGIN {printf \"%.1f\", ($hit_functions/$total_functions)*100}")
  fi

  # Overall coverage section
  cat >> "$REPORT_FILE" << EOF
## 🎯 Overall Coverage

| Metric | Coverage | Details |
|--------|----------|---------|
| **Lines** | **${line_coverage}%** | ${hit_lines}/${total_lines} lines covered |
| **Functions** | **${function_coverage}%** | ${hit_functions}/${total_functions} functions covered |

EOF

  # Coverage quality assessment
  local coverage_int=$(echo "$line_coverage" | cut -d. -f1)

  if [[ "$coverage_int" -ge "$GOOD_COVERAGE_THRESHOLD" ]]; then
    echo "🟢 **Excellent coverage** (≥${GOOD_COVERAGE_THRESHOLD}%)" >> "$REPORT_FILE"
  elif [[ "$coverage_int" -ge "$MIN_COVERAGE_THRESHOLD" ]]; then
    echo "🟡 **Good coverage** (≥${MIN_COVERAGE_THRESHOLD}%)" >> "$REPORT_FILE"
  else
    echo "🔴 **Needs improvement** (<${MIN_COVERAGE_THRESHOLD}%)" >> "$REPORT_FILE"
  fi

  echo "" >> "$REPORT_FILE"

  # Per-file coverage breakdown
  cat >> "$REPORT_FILE" << 'EOF'
## 📁 File Coverage Breakdown

| File | Line Coverage | Lines Covered | Functions Covered |
|------|---------------|---------------|-------------------|
EOF

  # Parse LCOV file for per-file coverage
  awk '
  BEGIN {
    file = "";
    lines_found = 0; lines_hit = 0;
    funcs_found = 0; funcs_hit = 0;
  }
  /^SF:/ {
    if (file != "" && lines_found > 0) {
      line_coverage = (lines_hit / lines_found) * 100;
      func_coverage = (funcs_found > 0) ? (funcs_hit / funcs_found) * 100 : 0;

      # Extract display filename
      display_file = file;
      # Remove full path, keep lib/ prefix if it exists
      if (match(display_file, /lib\//)) {
        display_file = substr(display_file, match(display_file, /lib\//));
      } else {
        # For files outside lib/, show basename only
        n = split(display_file, parts, "/");
        display_file = parts[n];
      }

      printf "| `%s` | **%.1f%%** | %d/%d | %d/%d |\n",
        display_file, line_coverage, lines_hit, lines_found, funcs_hit, funcs_found;
    }
    file = $0; gsub(/^SF:/, "", file);
    lines_found = 0; lines_hit = 0; funcs_found = 0; funcs_hit = 0;
  }
  /^LF:/ {
    lines_found = $0;
    gsub(/^LF:/, "", lines_found);
    lines_found = int(lines_found);
  }
  /^LH:/ {
    lines_hit = $0;
    gsub(/^LH:/, "", lines_hit);
    lines_hit = int(lines_hit);
  }
  /^FNF:/ {
    funcs_found = $0;
    gsub(/^FNF:/, "", funcs_found);
    funcs_found = int(funcs_found);
  }
  /^FNH:/ {
    funcs_hit = $0;
    gsub(/^FNH:/, "", funcs_hit);
    funcs_hit = int(funcs_hit);
  }
  END {
    if (file != "" && lines_found > 0) {
      line_coverage = (lines_hit / lines_found) * 100;
      func_coverage = (funcs_found > 0) ? (funcs_hit / funcs_found) * 100 : 0;

      # Extract display filename
      display_file = file;
      # Remove full path, keep lib/ prefix if it exists
      if (match(display_file, /lib\//)) {
        display_file = substr(display_file, match(display_file, /lib\//));
      } else {
        # For files outside lib/, show basename only
        n = split(display_file, parts, "/");
        display_file = parts[n];
      }

      printf "| `%s` | **%.1f%%** | %d/%d | %d/%d |\n",
        display_file, line_coverage, lines_hit, lines_found, funcs_hit, funcs_found;
    }
  }
  ' "$COVERAGE_FILE" >> "$REPORT_FILE"

  # Additional details
  cat >> "$REPORT_FILE" << EOF

## 📊 Summary

| Component | Status |
|-----------|--------|
| Tests | ✅ Executed |
| Line Coverage | ${line_coverage}% |
| Function Coverage | ${function_coverage}% |
| Total Files | $(grep -c "^SF:" "$COVERAGE_FILE") |

---

<details>
<summary>📊 Raw Coverage Data</summary>

\`\`\`
Total Lines: $total_lines
Covered Lines: $hit_lines
Total Functions: $total_functions
Covered Functions: $hit_functions
Line Coverage: ${line_coverage}%
Function Coverage: ${function_coverage}%
\`\`\`

</details>

**Generated on:** $(date)
**Flutter SDK:** $(flutter --version | head -n1)

EOF

  print_success "Markdown report generated: $REPORT_FILE"
}

# Function to display console report
display_console_report() {
  if [[ "$OUTPUT_FORMAT" != "console" && "$OUTPUT_FORMAT" != "both" ]]; then
    return 0
  fi

  if [[ ! -f "$COVERAGE_FILE" ]] || [[ ! -s "$COVERAGE_FILE" ]]; then
    print_warning "No coverage data available for console display"
    return 0
  fi

  local total_lines=$(grep "^LF:" "$COVERAGE_FILE" | awk -F: '{sum += $2} END {print sum+0}')
  local hit_lines=$(grep "^LH:" "$COVERAGE_FILE" | awk -F: '{sum += $2} END {print sum+0}')
  local line_coverage="0.0"

  if [[ "$total_lines" -gt 0 ]]; then
    line_coverage=$(awk "BEGIN {printf \"%.1f\", ($hit_lines/$total_lines)*100}")
  fi

  echo ""
  echo -e "${BLUE}📊 Coverage Summary:${NC}"
  echo -e "   Lines: ${GREEN}${line_coverage}%${NC} (${hit_lines}/${total_lines})"

  local coverage_int=$(echo "$line_coverage" | cut -d. -f1)
  if [[ "$coverage_int" -ge "$GOOD_COVERAGE_THRESHOLD" ]]; then
    echo -e "   Quality: ${GREEN}🟢 Excellent${NC}"
  elif [[ "$coverage_int" -ge "$MIN_COVERAGE_THRESHOLD" ]]; then
    echo -e "   Quality: ${YELLOW}🟡 Good${NC}"
  else
    echo -e "   Quality: ${RED}🔴 Needs improvement${NC}"
  fi

  echo ""
}

# Main execution
main() {
  print_header

  # Determine if we should show only changed files
  local changed_files=""
  if [[ "$CHANGED_FILES_ONLY" == true ]]; then
    print_info "Getting changed files compared to $BASE_BRANCH..."
    changed_files=$(get_changed_dart_files "$BASE_BRANCH")

    if [[ -z "$changed_files" ]]; then
      print_warning "No changed Dart files found. Falling back to full coverage."
      CHANGED_FILES_ONLY=false
    else
      print_info "Found changed files:"
      while IFS= read -r file; do
        print_info "  - $file"
      done <<< "$changed_files"
    fi
  fi

  # Generate coverage
  if ! generate_coverage; then
    print_error "Failed to generate coverage data"
    exit 1
  fi

  # Filter coverage if needed
  if [[ "$CHANGED_FILES_ONLY" == true && -n "$changed_files" ]]; then
    filter_coverage_for_changed_files "$changed_files"
  fi

  # Generate reports
  if [[ "$OUTPUT_FORMAT" == "markdown" || "$OUTPUT_FORMAT" == "both" ]]; then
    generate_markdown_report "$CHANGED_FILES_ONLY" "$changed_files"
  fi

  display_console_report

  # Final status
  if [[ -f "$COVERAGE_FILE" && -s "$COVERAGE_FILE" ]]; then
    print_success "Coverage analysis completed successfully"

    if [[ "$OUTPUT_FORMAT" == "markdown" || "$OUTPUT_FORMAT" == "both" ]]; then
      echo ""
      print_info "📄 Detailed report available at: $REPORT_FILE"
    fi
  else
    print_warning "Coverage analysis completed with limited data"
  fi
}

# Run main function
main "$@"