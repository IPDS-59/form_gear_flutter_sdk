/// Enum representing the different types of form engines supported by FASIH
enum FormEngineType {
  /// FormGear engine (ID: 1)
  formGear(1, 'FormGear'),

  /// FasihForm engine (ID: 2)
  fasihForm(2, 'FasihForm');

  const FormEngineType(this.id, this.displayName);

  /// The numeric ID used in FASIH API
  final int id;

  /// Human-readable display name
  final String displayName;

  /// Get FormEngineType from numeric ID
  static FormEngineType? fromId(int? id) {
    if (id == null) return null;

    for (final type in FormEngineType.values) {
      if (type.id == id) return type;
    }
    return null;
  }

  /// Get FormEngineType from string ID
  static FormEngineType? fromString(String? idString) {
    final id = int.tryParse(idString ?? '');
    return fromId(id);
  }

  @override
  String toString() => displayName;
}
