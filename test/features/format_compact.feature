Feature: compact output format

  In order to simplify integration with IDEs
  As a developer
  I want to be able to generate test results in compact text format

  Scenario: RECESS generates output in compact format

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
    And I run recess with "--format compact --stripColors" parameters

    Then output should be
    """
%{path}:5:Element selectors should not be overqualified
%{path}:6:Incorrect property order for rule ".test.test2"

  Correct order below:

    """

  Scenario: RECESS generates output in compact format for several files

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
    And I run recess with "--format compact --stripColors" parameters and two input files

    Then output should be
    """
%{path1}:5:Element selectors should not be overqualified
%{path1}:6:Incorrect property order for rule ".test.test2"

  Correct order below:

%{path2}:1:Id's should not be styled
    """
