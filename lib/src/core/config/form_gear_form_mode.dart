/// Official FormGear form modes
enum FormGearFormMode {
  /// Form is open for editing
  open(1),

  /// Form has been rejected
  rejected(2),

  /// Form has been submitted
  submitted(3),

  /// Form has been approved
  approved(4);

  const FormGearFormMode(this.value);
  final int value;
}
