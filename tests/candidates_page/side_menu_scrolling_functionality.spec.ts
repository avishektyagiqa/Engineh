import { expect, test } from "../../utils/support/tests";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import CandidatesPage from "../../pages/dashboard/candidates_page/candidiates_page_helpers";
import { Constants } from "../../utils/constants";

test.describe("Side menu scrolling functionality", () => {
    test.beforeEach(async ({ page }, testInfo) => {
        const login = new LoginPage(page);
        const dashboard = new DashboardHelpers(page);
        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);

        await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await expect(page).toHaveURL(/.*agent-dashboard/);
        await dashboard.clickOnYesButton();
        await dashboard.navigateToCandidateSection();
    });

    test("[test-021] Verify side menu scrolling functionality", async ({ page }, testInfo) => {
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

        await page.waitForTimeout(5000);

        const container = page.locator('[class="list-menu-item-not-float list-item-in-dialog"]');
        await candidatePage.checkIfScrollable(container);

        // await candidatePage.verifyProfileMenu([
        //   'Top',
        //   'Checklist',
        //   'Evaluations',
        //   'Bio & Highlights',
        //   'All Contact Information',
        //   'Emergency Contact',
        //   'Type of Position',
        //   'Application Details',
        //   'References',
        //   'Employment History',
        //   'Education',
        //   'Other Information',
        //   'Membership Subscriptions',
        //   'Badges',
        //   'Documents',
        //   'Photo Gallery',
        //   'Introduction Video'
        // ]);
        // await page.waitForTimeout(40000);
        // await candidatePage.clickOnCloseButton();
        // await dashboard.clearAllSearchFilters();
        // await candidatePage.searchCandidateByName(email);
        // await candidatePage.validateCreatedCandidateIsVisible(email);
        //await candidatePage.deleteCandidateFromTheTable();
    });
});