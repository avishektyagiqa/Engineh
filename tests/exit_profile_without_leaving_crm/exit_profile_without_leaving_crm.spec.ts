import { devices } from "@playwright/test";
import { test } from "../../utils/support/tests";

import { Constants } from "../../utils/constants";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import ClientPage from "../../pages/dashboard/client_page/client_page_helpers";
import InterviewHelpers from "../../pages/dashboard/interview_section/interview_helpers";

test.use({
    ...devices["Pixel 5"],
    browserName: "chromium",
});

test.describe("Profile exit functionality", () => {
    test.beforeEach(async ({ page }, testInfo) => {
        const login = new LoginPage(page);
        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);
        await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
    });

    test("[test-032] Validate that the user can exit the profile without leaving crm", async ({ page }) => {
        const clientHelpers = new ClientPage(page);
        const interviewHelpers = new InterviewHelpers(page);
        const dashboard = new DashboardHelpers(page);
        const clientEmail = "testuser@enginehire.ca";
        const candidateEmail = "testcandidate@enginehire.ca";

        await dashboard.clickOnDashboardDropdownForMobile();
        await dashboard.navigateToCandidateSection();
        await interviewHelpers.searchForCandidatePage(candidateEmail);
        await interviewHelpers.clickOnCandidatePage();
        await dashboard.validateCloseButtonIsVisible();
        await page.waitForTimeout(5000);

        await dashboard.clickOnDashboardDropdownForMobile();
        await clientHelpers.goToClientTabOnMobile();
        await dashboard.waitForSpinnerToDisappear();
        await clientHelpers.searchForClient(clientEmail);
        await clientHelpers.clickOnClientPage();
        await dashboard.validateCloseButtonIsVisible();
    });
});
