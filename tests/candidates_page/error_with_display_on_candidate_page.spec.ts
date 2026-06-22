import { test } from "../../utils/support/tests";
import { Constants } from "../../utils/constants";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import ClientPage from "../../pages/dashboard/client_page/client_page_helpers";
import CandidatesPage from "../../pages/dashboard/candidates_page/candidiates_page_helpers";
import InterviewHelpers from "../../pages/dashboard/interview_section/interview_helpers";

test.describe("Validate that admin, profile and more sections are visible", () => {
    test.beforeEach(async ({ page }, testInfo) => {
        const login = new LoginPage(page);
        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);
        await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
    });

    test("[test-016] Validate that admin, profile and more sections are visible (Bug 34036229946)", async ({ page }) => {
        const clientHelpers = new ClientPage(page);
        const dashboard = new DashboardHelpers(page);
        const candidateEmail = "testcandidate@enginehire.ca";
        const candidateHelpers = new CandidatesPage(page);
        const interviewHelpers = new InterviewHelpers(page);

        await dashboard.waitForSpinnerToDisappear();
        await interviewHelpers.clickCandidateTab();
        await interviewHelpers.searchForCandidatePage(candidateEmail);
        await page.waitForTimeout(2000);
        await clientHelpers.clickOnClientPage();
        await candidateHelpers.goToProfileView();
        await candidateHelpers.validateAdminProfileMoreSectionsVisibleForCandidate();
        await candidateHelpers.validateAddPhotoVideoButton();
        await candidateHelpers.validateUploadDocumentButton();
    });
});