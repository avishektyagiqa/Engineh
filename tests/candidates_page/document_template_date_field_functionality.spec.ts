import { expect, test } from "../../utils/support/tests";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import CandidatesPage from "../../pages/dashboard/candidates_page/candidiates_page_helpers";
import { Constants } from "../../utils/constants";

test.describe("Document template section", () => {
    test.beforeEach(async ({ page }, testInfo) => {
        const login = new LoginPage(page);
        const dashboard = new DashboardHelpers(page);

        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);

        await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await expect(page).toHaveURL(/.*agent-dashboard/);

        await dashboard.clickOnYesButton();
        await dashboard.navigateToCandidateSection();
    });

    test("[test-015] Verify document template date field functionality", async ({ page }, testInfo) => {
        const candidatePage = new CandidatesPage(page);
        const dashboard = new DashboardHelpers(page);

        const phoneNumber = Constants.generateRandomPhoneNumber();
        const randString = Constants.randStr();
        const email = randString + Constants.USERS.testEmail.USERNAME;

        await candidatePage.createNewCandidate(
            email,
            phoneNumber,
            Constants.USERS.testEmail.FIRSTNAME,
            Constants.USERS.testEmail.LASTNAME,
            testInfo.project.name
        );

        await page.waitForTimeout(5000);
        await dashboard.clickOnProfileSection();
        await page.waitForTimeout(10000);

        await dashboard.selectTemplate("W-4");
        await dashboard.clickAddDocTemplateButton();

        const projectName = testInfo.project.name.toLowerCase();
        const isStagingOrLocalhost = projectName.includes("staging") || projectName.includes("localhost");

        if (isStagingOrLocalhost) {
            await dashboard.clickDontSendButton();
        }

        await dashboard.clickSignButton();
    });
});