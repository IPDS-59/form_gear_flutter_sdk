/// Official FormGear lookup modes
enum FormGearLookupMode {
  /// Online lookup from API
  online(1),

  /// Offline lookup from local data
  offline(2),

  /// Local lookup from bundled assets (for testing)
  local(3);

  const FormGearLookupMode(this.value);
  final int value;
}
