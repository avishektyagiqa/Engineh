import { expect, test } from "../../utils/support/tests";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import { Constants } from "../../utils/constants";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import InterviewHelpers from "../../pages/dashboard/interview_section/interview_helpers";
import CandidatesPage from "../../pages/dashboard/candidates_page/candidiates_page_helpers";

test.describe("Candidate section", () => {
    test.beforeEach(async ({ page }, testInfo) => {
        const login = new LoginPage(page);
        const dashboard = new DashboardHelpers(page);
        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);

        await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await expect(page).toHaveURL(/.*agent-dashboard/);
        await dashboard.clickOnYesButton();
    });

    test("[test-011] Validate the Avoiding OT setting is added (Bug 34413742639)", async ({ page }) => {
        const interview = new InterviewHelpers(page);
        const candidateHelpers = new CandidatesPage(page);
        const candidateEmail = "testcandidate@enginehire.ca";
        const dashboard = new DashboardHelpers(page);

        await interview.clickCandidateTab();
        await interview.searchForCandidatePage(candidateEmail);
        await interview.clickOnCandidatePage();
        await candidateHelpers.goToProfileView();
        await candidateHelpers.goToMyScheduleTabInProfile();
        await dashboard.waitForSpinnerToDisappear();
        await candidateHelpers.clickOnRecurringAvailability();
        await candidateHelpers.validateMaxNumOfHoursIsVisible();
    });
});