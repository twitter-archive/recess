Then(/^output should be in jUnit format$/) do
  xsd = Nokogiri::XML::Schema(File.read(path_to_junit_xsd))
  doc = Nokogiri::XML(@stdout)
  expect(xsd.valid?(doc)).to be_true, <<EOF
=== jUnit.xsd validation failed for the following output: ===
#{@stdout}
=============================================================
EOF
end

Then(/^generated jUnit report should contain (\d+) errors?$/) do |num_errors|
  doc = Nokogiri::XML(@stdout)
  expect(doc.xpath("count(//error)").to_i).to eq num_errors.to_i
end

Then(/^error \#(\d+) should be "(.*?)" in line (\d+)$/) do |error_number, name, line|
  doc = Nokogiri::XML(@stdout)
  error = doc.xpath("//error")[error_number.to_i - 1]

  expect(error).to_not be_nil
  expect(error.attr("message")).to match name
  expect(error.attr("message")).to match /line #{line}/
end

Then(/^generated jUnit report should contain (\d+) testcases?$/) do |num_cases|
  doc = Nokogiri::XML(@stdout)
  expect(doc.xpath("count(//testcase)").to_i).to eq num_cases.to_i
end

Then(/^error \#(\d+) should be "(.*?)" in first file line (\d+)$/) do |error_number, name, line|
  doc = Nokogiri::XML(@stdout)
  error = doc.xpath("//error")[error_number.to_i - 1]

  expect(error).to_not be_nil
  expect(error.attr("message")).to match name
  expect(error.attr("message")).to match /line #{line}/
  expect(error.parent().attr("name")).to eq @input_file_1.path
end

Then(/^error \#(\d+) should be "(.*?)" in second file line (\d+)$/) do |error_number, name, line|
  doc = Nokogiri::XML(@stdout)
  error = doc.xpath("//error")[error_number.to_i - 1]

  expect(error).to_not be_nil
  expect(error.attr("message")).to match name
  expect(error.attr("message")).to match /line #{line}/
  expect(error.parent().attr("name")).to eq @input_file_2.path
end
