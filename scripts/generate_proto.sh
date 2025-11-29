#!/bin/bash

# Script to generate Dart code from Protocol Buffer definitions
# Requires: protoc compiler installed (brew install protobuf on macOS)

set -e

echo "Generating Dart code from Protocol Buffers..."

# Get the project root directory (parent of scripts directory)
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Proto source directory
PROTO_DIR="$PROJECT_ROOT/proto"

# Output directory for generated Dart files
OUTPUT_DIR="$PROJECT_ROOT/lib/src/proto"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Activate protoc_plugin if not already activated
dart pub global activate protoc_plugin

# Add pub-cache to PATH for this session
export PATH="$PATH:$HOME/.pub-cache/bin"

# Get the protoc plugin path
PROTOC_PLUGIN_PATH="$(which protoc-gen-dart)"

if [ -z "$PROTOC_PLUGIN_PATH" ]; then
  echo "Error: protoc-gen-dart not found in PATH"
  echo "Please ensure dart pub global activate protoc_plugin has been run"
  exit 1
fi

# Change to proto directory
cd "$PROTO_DIR"

# Find all proto files recursively
PROTO_FILES=$(find . -name "*.proto" | sort)

echo "Found proto files:"
echo "$PROTO_FILES"
echo ""

# Generate Dart code for all proto files
protoc \
  --dart_out="$OUTPUT_DIR" \
  --plugin="protoc-gen-dart=$PROTOC_PLUGIN_PATH" \
  -I. \
  $PROTO_FILES

echo "✓ Dart code generated successfully in $OUTPUT_DIR"

# Run dart format on generated files
echo "Formatting generated files..."
dart format "$OUTPUT_DIR"

echo "✓ All done!"
