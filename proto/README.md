# FormGear Protocol Buffers

Protocol Buffer definitions for FormGear SDK, organized by domain.

## Structure

```text
proto/
├── engine/              # Form engine assets
│   ├── engine_type.proto
│   ├── engine_version.proto
│   └── engine_assets.proto
├── media/               # Media handling (images, GPS, audio)
│   ├── media_type.proto
│   ├── location.proto
│   ├── media_item.proto
│   └── media_collection.proto
├── response/            # Form responses
│   ├── response_value_type.proto
│   ├── field_response.proto
│   └── form_response.proto
├── template/            # Form templates and components
│   ├── component_option.proto
│   ├── size_constraint.proto
│   ├── component.proto
│   └── form_template.proto
└── validation/          # Validation rules
    ├── validation_type.proto
    ├── validation_rules.proto
    ├── validation_rule.proto
    └── validation_collection.proto
```

## Benefits

- **60-70% size reduction** vs JSON
- **10x faster** parsing
- **Type-safe** serialization across Dart/JS
- **Backward compatible** field versioning
- **Efficient** binary format for storage/network

## Code Generation

Generate Dart classes from proto definitions:

```bash
bash scripts/generate_proto.sh
```

Generated files are placed in `lib/src/proto/` maintaining the same directory structure.

## Usage in Example App

See the example app's protobuf demo screen for real-world usage demonstrations.
