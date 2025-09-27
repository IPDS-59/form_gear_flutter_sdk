/// Official FormGear initial modes
enum FormGearInitialMode {
  /// Initial form creation
  initial(1),

  /// Form assignment
  assign(2);

  const FormGearInitialMode(this.value);
  final int value;
}
