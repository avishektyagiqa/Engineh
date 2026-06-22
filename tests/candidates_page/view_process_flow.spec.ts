import { test } from "../../utils/support/tests";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import CandidatesPage from "../../pages/dashboard/candidates_page/candidiates_page_helpers";
import { Constants } from "../../utils/constants";

test.describe("Candidate section, view process flow", () => {
  test.beforeEach(async ({ page }, testInfo) => {
    const login = new LoginPage(page);

    // Uses project name (e.g., "production - chromium") to pick env + creds + /login/{id}
    const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);

    await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
  });

  test("[test-022] View process flow {Candidate}", async ({ page }) => {
    const dashboard = new DashboardHelpers(page);
    const candidatePage = new CandidatesPage(page);

    await dashboard.navigateToCandidateSection();
    await page.waitForTimeout(5000);
    await candidatePage.clickOnSchemaIcon();
    await dashboard.validateProcessFlowTitleIsVisible();
  });
});
