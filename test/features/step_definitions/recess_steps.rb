Given(/^the input file contains the following CSS$/) do |string|
  @input_file = Tempfile.new('junit-test-css')
  @input_file.write(string)
  @input_file.close
end

Given(/^I run recess with "(.*?)" parameters$/) do |arg1|
  @stdout = `../bin/recess #{@input_file.path} #{arg1}`
end

Then(/^output should be$/) do |string|
  expect(@stdout).to match_lines (string % { :path => @input_file.path } )
end
