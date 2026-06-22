import { expect, test } from "../../utils/support/tests";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import { Constants } from "../../utils/constants";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import InterviewHelpers from "../../pages/dashboard/interview_section/interview_helpers";
import CandidatesPage from "../../pages/dashboard/candidates_page/candidiates_page_helpers";
import AdminViewHelpers from "../../pages/dashboard/admin_view_section/admin_view_helpers";

test.describe("Validate locations dropdown", () => {
    test.beforeEach(async ({ page }, testInfo) => {
        const login = new LoginPage(page);
        const dashboard = new DashboardHelpers(page);
        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);

        await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await expect(page).toHaveURL(/.*agent-dashboard/);
        await dashboard.clickOnYesButton();
    });

    test("[test-020] Validate locations dropdown", async ({ page }) => {
        const interview = new InterviewHelpers(page);
        const candidateHelpers = new CandidatesPage(page);
        const adminView = new AdminViewHelpers(page);
        const candidateEmail = "testcandidate@enginehire.ca";

        await interview.clickCandidateTab();
        await interview.searchForCandidatePage(candidateEmail);
        await interview.clickOnCandidatePage();
        await candidateHelpers.goToAdminView();
        await page.waitForTimeout(5000);
        await adminView.validateLocationDropdown();
    });
});