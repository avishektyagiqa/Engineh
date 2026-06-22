import { test, expect } from "@playwright/test";
import CandidatesPage from "../../pages/dashboard/candidates_page/candidiates_page_helpers";
import { Constants } from "../../utils/constants";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";

test.describe('Candidate section', () => {

  test.beforeEach(async ({ page }, testInfo) => {
    const login = new LoginPage(page);
    const dashboard = new DashboardHelpers(page);
    const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);

    await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
    await expect(page).toHaveURL(/.*agent-dashboard/);
    await dashboard.clickOnYesButton();
    await dashboard.navigateToCandidateSection();
  });

  test("[test-069] Change secondary status for candidate", async ({ page }, testInfo) => {
    const candidatePage = new CandidatesPage(page);
    const dashboard = new DashboardHelpers(page);
    const uniqueStr = Constants.randStr();
    const phoneNumber = Constants.generateRandomPhoneNumber();
    const email = uniqueStr + Constants.USERS.testEmail.USERNAME;

    await candidatePage.createNewCandidate(
        email,
        phoneNumber,
        Constants.USERS.testEmail.FIRSTNAME,
        Constants.USERS.testEmail.LASTNAME,
        testInfo.project.name
    );

    await dashboard.waitForSpinnerToDisappear();

    await candidatePage.changeSecondaryStatus("Application Complete");
    await dashboard.waitForSpinnerToDisappear();
    await candidatePage.validateStatusIsApplied();
    await candidatePage.clickOnCloseButton();
    await page.reload();

    await candidatePage.openSearchAndFilterTools();
    await candidatePage.filterBySecondStatusInSearchAndFilterTool("Application Complete");
    await page.waitForTimeout(10000);

    //await candidatePage.deleteAllCandidatesWithStatusInTable("Application Complete");
  });
});