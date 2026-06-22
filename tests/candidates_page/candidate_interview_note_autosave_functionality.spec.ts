import { expect, test } from "../../utils/support/tests";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import { Constants } from "../../utils/constants";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import InterviewHelpers from "../../pages/dashboard/interview_section/interview_helpers";

test.describe("interview_section section Interview_bug_29533640469", () => {
    test.beforeEach(async ({ page }, testInfo) => {
        const login = new LoginPage(page);
        const dashboard = new DashboardHelpers(page);
        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);

        await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await expect(page).toHaveURL(/.*agent-dashboard/);
        await dashboard.clickOnYesButton();
    });

    test("[test-012] Reloading updating during interviews (Bug 29533640469)", async ({ page }) => {
        const interview = new InterviewHelpers(page);
        const candidateEmail = "testcandidate@enginehire.ca";

        await interview.clickCandidateTab();
        await interview.searchForCandidatePage(candidateEmail);
        await interview.clickOnCandidatePage();
        await interview.clickOnMoreTab();
        const text = await interview.typeInTextBoxUsingFill();
        await page.waitForTimeout(5000);
        await interview.validateText(text);
    });
});