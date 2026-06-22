import { expect, test } from "../../utils/support/tests";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import { Constants } from "../../utils/constants";
import CandidatesPage from "../../pages/dashboard/candidates_page/candidiates_page_helpers";

test.describe("Candidate section", () => {
  test.beforeEach(async ({ page }, testInfo) => {
    const login = new LoginPage(page);
    const dashboard = new DashboardHelpers(page);

    const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);

    await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
    await expect(page).toHaveURL(/.*agent-dashboard/);
    await dashboard.navigateToCandidateSection();
  });

  test("[test-010] Apply filter candidate", async ({ page }, testInfo) => {
    const candidatePage = new CandidatesPage(page);
    const phoneNumber = Constants.generateRandomPhoneNumber();
    const randString = Constants.randStr();

    await candidatePage.createNewCandidate(
        randString + Constants.USERS.testEmail.USERNAME,
        phoneNumber,
        Constants.USERS.testEmail.FIRSTNAME,
        Constants.USERS.testEmail.LASTNAME,
        testInfo.project.name
    );

    await candidatePage.deleteCandidate();
  });
});