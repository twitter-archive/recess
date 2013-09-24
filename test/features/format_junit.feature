Feature: jUnit output format

  In order to simplify integration with CI servers
  As a developer
  I want to be able to generate test results in jUnit XML format understood by CI servers

  Scenario: RECESS generates output in jUnit format

    Given the input file contains the following CSS
    """
a {
  text-decoration: underline;
}

.test.test2 {
  color: white;
  width: 33;
  height: 12px;
}
    """
    And I run recess with "--format junit" parameters

    Then output should be in jUnit format
    And generated jUnit report should contain 2 errors
    And error #1 should be "Element selectors should not be overqualified" in line 5
    And error #2 should be "Incorrect property order" in line 6
