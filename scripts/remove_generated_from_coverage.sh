#!/bin/bash
# Script to remove generated files from code coverage report
# This ensures our coverage metrics reflect only hand-written code

COVERAGE_FILE="coverage/lcov.info"
TEMP_FILE="coverage/lcov_filtered.info"

if [ ! -f "$COVERAGE_FILE" ]; then
  echo "Error: Coverage file not found at $COVERAGE_FILE"
  echo "Run 'flutter test --coverage' first"
  exit 1
fi

echo "Filtering generated files from coverage report..."

# Use lcov to remove generated files
# Remove:
# - *.g.dart (json_serializable generated files)
# - *.config.dart (injectable generated files)
# - *.freezed.dart (freezed generated files)
# - *.gr.dart (auto_route generated files)
# - *.gm.dart (mockito generated files)
# - *.module.dart (injectable modules)

lcov --remove "$COVERAGE_FILE" \
  '*.g.dart' \
  '*.config.dart' \
  '*.freezed.dart' \
  '*.gr.dart' \
  '*.gm.dart' \
  '*.module.dart' \
  --ignore-errors unused \
  --output-file "$TEMP_FILE"

# Check if lcov command was successful
if [ $? -eq 0 ]; then
  mv "$TEMP_FILE" "$COVERAGE_FILE"
  echo "✅ Generated files removed from coverage report"

  # Display coverage summary
  echo ""
  echo "Coverage Summary:"
  lcov --summary "$COVERAGE_FILE"
else
  echo "❌ Error: Failed to filter coverage report"
  echo "Make sure 'lcov' is installed: brew install lcov"
  rm -f "$TEMP_FILE"
  exit 1
fi