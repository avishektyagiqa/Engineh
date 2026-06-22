import { test } from "../../utils/support/tests";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import CandidatesPage from "../../pages/dashboard/candidates_page/candidiates_page_helpers";
import { Constants } from "../../utils/constants";

test.describe("Form view filters functionality under advanced search in candidate section", () => {
    test.beforeEach(async ({ page }, testInfo) => {
        const login = new LoginPage(page);
        const dashboard = new DashboardHelpers(page);
        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);

        await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await dashboard.clickOnYesButton();
        await dashboard.navigateToCandidateSection();
    });

    test("[test-017] Verify form view filters functionality", async ({ page }, testInfo) => {
        const candidatePage = new CandidatesPage(page);
        const dashboard = new DashboardHelpers(page);

        const phoneNumber = Constants.generateRandomPhoneNumber();
        const randString = Constants.randStr();
        const email = randString + Constants.USERS.testEmail.USERNAME;
        const userType = "Spanish Speaking";

        await candidatePage.createNewCandidate(
            email,
            phoneNumber,
            Constants.USERS.testEmail.FIRSTNAME,
            Constants.USERS.testEmail.LASTNAME,
            testInfo.project.name,
            userType
        );

        await page.waitForTimeout(5000);
        await candidatePage.clickOnCloseButton();
        await dashboard.clickOnSearchIconCandidatePage();
        await candidatePage.clickOnAdvancedSearchIcon();
        await candidatePage.clickOnAdvancedSearchFormViewSection();
        await candidatePage.checkSpanishSpeakingCheckbox();
        await candidatePage.clickOnAdvancedSearchButton();
        await page.waitForTimeout(5000);
        await dashboard.clearAllSearchFilters();
        await candidatePage.verifyAllRowsHaveTypeSpanishSpeaking();
        await page.reload();
        await candidatePage.deleteCandidateFromTheTable();
    });
});