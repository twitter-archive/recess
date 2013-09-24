RSpec::Matchers.define :match_lines do |expected|
  def normalize(string)
    string.lines.map{ |l| l.strip }.reject {|l| l.empty? } .join("\n")
  end

  match do |actual|
    normalized_actual = normalize(actual)
    normalized_expected = normalize(expected)

    expect(normalized_actual).to eq normalized_expected
  end

  failure_message_for_should do |actual|
    normalized_actual = normalize(actual)
    normalized_expected = normalize(expected)

    expect(normalized_actual).to eq normalized_expected
  end
end
