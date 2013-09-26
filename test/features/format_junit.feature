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
    And generated jUnit report should contain 1 testcase
    And generated jUnit report should contain 2 errors
    And error #1 should be "Element selectors should not be overqualified" in line 5
    And error #2 should be "Incorrect property order" in line 6

  Scenario: RECESS generates output in jUnit format for several files

    Given the first input file contains the following CSS
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
    Given the second input file contains the following CSS
    """
#sample-id {
    text-decoration: underline;
}
    """
    And I run recess with "--format junit" parameters and two input files

    Then output should be in jUnit format
    And generated jUnit report should contain 2 testcases
    And generated jUnit report should contain 3 errors
    And error #1 should be "Element selectors should not be overqualified" in first file line 5
    And error #2 should be "Incorrect property order" in first file line 6
    And error #3 should be "Id's should not be styled" in second file line 1

 Scenario: RECESS handles CSS parse errors gracefully when outputting jUnit data

    Given the input file contains the following CSS
    """
a {
  text-decoration: underline;
    """
    And I run recess with "--format junit" parameters

    Then output should be in jUnit format
    And generated jUnit report should contain 1 testcase
    And generated jUnit report should contain 1 error
    And error #1 should be "missing closing `}`" in line 2
