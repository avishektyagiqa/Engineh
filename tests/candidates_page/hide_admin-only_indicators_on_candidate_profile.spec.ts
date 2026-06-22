import { test } from "../../utils/support/tests";
import CandidatesPage from "../../pages/dashboard/candidates_page/candidiates_page_helpers";
import { Constants } from "../../utils/constants";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import InterviewHelpers from "../../pages/dashboard/interview_section/interview_helpers";

test.describe("Candidate section", () => {
    test.beforeEach(async ({ page }, testInfo) => {
        const login = new LoginPage(page);
        const dashboard = new DashboardHelpers(page);
        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);

        await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await dashboard.clickOnYesButton();
        await dashboard.navigateToCandidateSection();
    });

    test("[test-018] Validate that admin-only indicators are not visible on candidate profile", async ({ page }) => {
        const candidatePage = new CandidatesPage(page);
        const interviewHelpers = new InterviewHelpers(page);
        const loginPage = new LoginPage(page);
        const dashboard = new DashboardHelpers(page);

        const candidateEmail = "testingmail@tmail.com";
        const candidatePassword = "test123";

        await interviewHelpers.searchForCandidatePage(candidateEmail);
        await interviewHelpers.clickOnCandidatePage();
        await candidatePage.goToProfileView();
        await candidatePage.validateReferenceStatusIsVisible();
        await candidatePage.validateWarningIconIsVisible();

        await dashboard.closeProfile();
        await dashboard.logoutFromAccount();

        await loginPage.enterUserName(candidateEmail);
        await loginPage.enterPassword(candidatePassword);
        await loginPage.clickOnLoginButton();

        await candidatePage.validateWarningIconIsNotVisible();
        await candidatePage.validateReferenceStatusIsNotVisible();
    });
});