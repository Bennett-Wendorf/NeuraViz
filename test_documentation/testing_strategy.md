# Front End Testing
The application front end will be tested using a combination of automated and manual testing. [Automated testing](#front-end-automated-testing) will be done using Playwright. Manual testing will be done based on procedures  outlined in this document and test cases found in `test_cases.md`.

## Front End Automated Testing
Automated front end testing uses Playwright as a framework for running end-to-end tests. These tests can be found in the `src/frontend/tests` directory.

## Front End Manual Testing
At least one test case should be created for each feature added to the application. As a general rule of thumb, each project in Jira should have at least one test case associated with it. These test cases should be created in the `test_cases.md` file. On top of that, it is worth adding test cases for each button or input, with an attempt to create these test cases using boundary value analysis to determine possible inputs.

For each feature, there should also be at least one end-to-end test that runs through the entire process of using that feature.

As much as possible, manual testing should be limited, and automated testing should be used instead. However, there are some things that are difficult to test automatically, and so manual testing is necessary.

Manual tests for the feature should be created and run during the testing phase of each project, with regression testing being done at least once a month.

# Back End Testing
The majority of backend testing will be done through the use of automated unit testing (see [Back End Automated Testing](#back-end-automated-testing) for more info). In addition, there will also be a few procedures and test cases for manual testing of the backend as it pertains to the application as a whole.

## Back End Automated Testing
Automated backend testing uses Pytest as a framework for running unit tests. These tests can be found in a variety of files in the `src/backend/tests` directory. 

Also in that directory you will find a directory for `expected_results`, generally formatted as json output that is expected back from backend API endpoints.

The final directory in the `src/backend/tests` directory is `file_inputs`, which contains a variety of input files that are similar to what a user would be expected to upload.