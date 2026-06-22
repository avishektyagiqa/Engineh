# enginehire-automation

## Code Structure

```
root
├── qatesting/
│   ├── .idea/
│   ├──  base/
|   |   ├── base_page.ts
│   ├── pages/
|   |   ├── application_and_profile_builder/
|   |   |   ├── application_and_profile_builder_helpers.ts/
|   |   |   ├── application_and_profile_builder_locators.ts/
|   |   ├── dashboard/
|   |   |   ├── candidate_page/
|   |   |   |   ├── candidate_page_locators.ts
|   |   |   |   ├── candidate_page_helpers.ts
|   |   |   ├── client_page/
|   |   |   |   ├── client_page_locators.ts
|   |   |   |   ├── client_page_helpers.ts
|   |   |   ├── placement_job/
|   |   |   |   ├── placement_job_helpers.ts
|   |   |   |   ├── placement_job_locators.ts
|   |   |   ├── shift_job/
|   |   |   |   ├── shift_job_helpers.ts
|   |   |   |   ├── shift_job_locators.ts
|   |   |   ├── dashboard_helpers.ts
|   |   |   ├── dashboard_locators.ts
|   |   ├── email_templates/
|   |   |   ├── email_templates_helpers.ts
|   |   |   ├── email_templates_locators.ts
|   |   ├── Login_page/
|   |   |   ├── login_page_locators.ts
|   |   |   ├── login_page_helpers.ts
|   ├── tests/
|   |   ├── application_and_profile_builder/
|   |   |   ├── create_application_builder.spec.ts
|   |   ├── candidate_page/
|   |   |   ├── add_candidate_note.spec.ts
|   |   |   ├── add_new_candidate.spec.ts
|   |   |   ├── apply_filter_candidates.spec.ts
|   |   |   ├── change_secondary_status.spec.ts
|   |   |   ├── document_template_date_field_functionality.spec.ts
|   |   |   ├── form_view_filters_functionality.spec.ts
|   |   |   ├── side_menu_scrolling_functionality.spec.ts
|   |   |   ├── view_process_flow.spec.ts
|   |   ├── client_page/
|   |   |   ├── add_admin_notes.spec.ts
|   |   |   ├── add_and_delete_client.spec.ts
|   |   |   ├── add_and_delete_doc.spec.ts
|   |   |   ├── edit_client_details.spec.ts
|   |   |   ├── view_process_flow_for_clients.spec.ts
|   |   ├── email_templates/
|   |   |   ├── email_template_save_edits_functionality.spec.ts
|   |   ├── login_page/
|   |   |   ├── login_functionality.spec.ts
|   |   ├── placement_job/
|   |   |   ├── add_delete_placement_job_note.spec.ts
|   |   |   ├── create_placement_job.spec.ts
|   |   |   ├── delete_placement_job.spec.ts
|   |   ├── shift_job/
|   |   |   ├── create_and_delete_shift_job.spec.ts
|   |   |   ├── shift_job_send_email.spec.ts
|   |   |   ├── shift_job_send_sms.spec.ts
|   ├── utils/
|   |   ├── Constants.ts
├── .gitignore
├── package.json
├── package-lock.json
├── playwright.config.ts
├── README.md
└── tsconfig.json
```
- `qatesting/`:  Main directory containing the Playwright test automation framework files.
    - `.idea/`: IntelliJ project configuration files (auto-generated).
    - `base/`: Contains base classes and common utilities for the testing framework.
        - `base_page.ts`: Defines the BasePage class with common methods used across different page objects.
    - `pages/`: Directory containing page-specific modules.
        - `dashboard/`: Main dashboard page group.
            - `candidate_page/`: Contains files related to the candidate section.
               - `candidate_page_locators.ts`: Locators for elements on the candidate page.
               - `candidate_page_helpers.ts`: Helper methods for interacting with the candidate page.
            - `client_page`: Contains files related to the client section.
               - `client_page_helpers.ts`: Locators for elements on the client page.
               - `client_page_locators.ts`: Helper methods for interacting with the client page.
            - `dashboard_helpers.ts`: Shared helper functions used across dashboard-related pages.
            - `dashboard_locators.ts`: Shared locators for dashboard-level elements.
        - `login_page/`: Contains files related to the login page.
            - `login_page_helpers.ts`: Helper functions for the login page.
            - `login_page_locators.ts`: Locators for elements on the login page.
    - `test-results/`: Stores the test result files generated after each test run.
        - `.last-run.json`: A file containing details about the last test run.
    - `tests/`: Contains the test files organized by modules.
        - `candidates_page/`:
            - `add_candidate_note.spec.ts`: Test for adding notes to a candidate.
            - `add_new_candidate.spec.ts`: Test for adding a new candidate.
            - `apply_filter_candidates.spec.ts`: Test for filtering candidates.
            - `change-secondary_status.spec.ts`: Test for changing a candidate’s secondary status.
            - `view_process_flow.spec.ts`: Test for viewing candidate process flow.
        - `client_page`:
            - `add_admin_notes.spec.ts`: Test for adding admin notes to a client.
            - `add_and_delete_client.spec.ts`: Test for adding and deleting a client.
            - `add_and_delete_doc>spec.ts`: Test for managing client documents.
            - `edit_client_details.spec.ts`: Test for editing client information.
            - `view_process_flow_for_clients.spec.ts`: Test for viewing client process flow.
        - `login_page/`: Contains test cases related to login functionality.
            - `login_page_functionality.spec.ts`: Tests for verifying the login process.
    - `utils/`: Contains utility scripts used across the testing framework.
        - `constants.ts`: Defines constants used across the testing framework.
- `.gitignore`: Lists files and directories that should be ignored by Git.
- `package.json`: Configuration file for npm, specifying project dependencies and scripts.
- `package-lock.json`: Automatically generated file to lock the versions of dependencies installed.
- `playwright.config.ts`: Configuration file for Playwright, defining test settings and environment.
- `README.md`: Provides an overview of the project, including structure and usage instructions.
- `tsconfig.json`: TypeScript configuration file specifying compiler options.

### 1. Clone the Repository
```bash
git clone https://github.com/Enginehire-Inc/qatesting.git
cd qatesting
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Tests
```bash
npx playwright test
```
To run a specific test file:
```bash
npx playwright test tests/test_name.spec.ts
```

### 4. View HTML Report
```bash
npx playwright show-report
```


### Install Playwright Browsers(if not yet installed)
```bash
npx playwright install
```
