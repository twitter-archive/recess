Given(/^the input file contains the following CSS$/) do |string|
  @input_file = Tempfile.new('junit-test-css')
  @input_file.write(string)
  @input_file.close
end

Given(/^the first input file contains the following CSS$/) do |string|
  @input_file_1 = Tempfile.new('junit-test-css')
  @input_file_1.write(string)
  @input_file_1.close
end

Given(/^the second input file contains the following CSS$/) do |string|
  @input_file_2 = Tempfile.new('junit-test-css')
  @input_file_2.write(string)
  @input_file_2.close
end

Given(/^I run recess with "(.*?)" parameters$/) do |arg1|
  @stdout = `../bin/recess #{@input_file.path} #{arg1}`
end

Given(/^I run recess with "(.*?)" parameters and two input files$/) do |arg1|
  @stdout = `../bin/recess #{@input_file_1.path} #{@input_file_2.path} #{arg1}`
end

Then(/^output should be$/) do |string|
  interpolated = string % {
    :name => @input_file && File.basename(@input_file.path) ,
    :path => @input_file && @input_file.path,
    :name1 => @input_file_1 && File.basename(@input_file_1.path),
    :path1 => @input_file_1 && @input_file_1.path,
    :name2 => @input_file_2 && File.basename(@input_file_2.path),
    :path2 => @input_file_2 && @input_file_2.path
  }
  expect(@stdout).to match_lines(interpolated)
end
