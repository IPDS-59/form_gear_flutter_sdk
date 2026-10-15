import 'dart:convert';
import 'dart:io';

enum Fixture {
  checkFormEngineVersion('check_form_engine_version_fixture.json');

  const Fixture(this.value);

  final String value;
}

String fixture(String name) => File('test/fixtures/$name').readAsStringSync();

Map<String, dynamic> jsonFromFixture(Fixture name) {
  final jsonString = fixture(name.value);
  final data = jsonDecode(jsonString) as Map<String, dynamic>;

  return data;
}
