require 'tempfile'
require 'nokogiri'
require 'rspec/expectations'

def path_to_junit_xsd
  "features/support/JUnit.xsd"
end

def path_to_recess_executable
  "../bin/recess"
end
