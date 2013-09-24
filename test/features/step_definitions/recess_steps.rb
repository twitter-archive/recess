Given(/^the input file contains the following CSS$/) do |string|
  @input_file = Tempfile.new('junit-test-css')
  @input_file.write(string)
end

Given(/^I run recess with "(.*?)" parameters$/) do |arg1|
  @stdout = `../bin/recess #{@input_file.path} #{arg1}`
end
