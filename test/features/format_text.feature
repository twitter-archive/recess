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

  Scenario: RECESS generates output in standard format for several files

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
    And I run recess with "--format text --stripColors" parameters and two input files

    Then output should be
    """
Analyzing the following files: %{path1}, %{path2}

FILE: %{path1}
STATUS: Busted
FAILURES: 2 failures

Element selectors should not be overqualified
       5. .test.test2

Incorrect property order for rule ".test.test2"

  Correct order below:

       6.  width: 33;
       7.  height: 12px;
       8.  color: white;

FILE: %{path2}
STATUS: Busted
FAILURES: 1 failure

Id's should not be styled
       1. #sample-id

    """
