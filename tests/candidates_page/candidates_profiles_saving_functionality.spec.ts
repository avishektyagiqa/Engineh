import { expect, test } from "../../utils/support/tests";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import { Constants } from "../../utils/constants";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import InterviewHelpers from "../../pages/dashboard/interview_section/interview_helpers";
import CandidatesPage from "../../pages/dashboard/candidates_page/candidiates_page_helpers";

test.describe("Validate candidate contact information saving functionality", () => {
    test.beforeEach(async ({ page }, testInfo) => {
        const login = new LoginPage(page);
        const dashboard = new DashboardHelpers(page);
        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);

        await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await expect(page).toHaveURL(/.*agent-dashboard/);
        await dashboard.clickOnYesButton();
    });

    test("[test-013] Validate candidate contact information saving functionality", async ({ page }, testInfo) => {
        const interview = new InterviewHelpers(page);
        const candidateHelpers = new CandidatesPage(page);
        const candidateEmail = "testmail@tmail.com";

        await interview.clickCandidateTab();
        await interview.searchForCandidatePage(candidateEmail);
        await interview.clickOnCandidatePage();
        await candidateHelpers.goToProfileView();
        await candidateHelpers.editContactInfo("test", testInfo.project.name);
        await page.waitForTimeout(5000);
        await candidateHelpers.validateContactInfoIsEdited("test");
        await candidateHelpers.editContactInfo("automation", testInfo.project.name);
    });
});
