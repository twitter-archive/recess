Feature: text output format

  In order to easily read and understand recess report
  As a developer
  I want to be able to generate test results in human-readable output format

  Scenario: RECESS generates output in text format

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
    And I run recess with "--format text --stripColors" parameters

    Then output should be
    """

Analyzing the following files: %{path}

FILE: %{path}
STATUS: Busted
FAILURES: 2 failures

Element selectors should not be overqualified
       5. .test.test2

Incorrect property order for rule ".test.test2"

Correct order below:

       6.  width: 33;
       7.  height: 12px;
       8.  color: white;

    """
