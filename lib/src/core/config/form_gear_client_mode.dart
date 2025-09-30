/// Official FormGear client modes
enum FormGearClientMode {
  /// CAWI - Computer Assisted Web Interviewing (Web app)
  cawi(1),

  /// CAPI - Computer Assisted Personal Interviewing (Mobile app)
  capi(2),

  /// Test mode for development and testing
  test(3);

  const FormGearClientMode(this.value);
  final int value;
}
