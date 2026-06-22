import { expect, test } from "../../utils/support/tests";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import CandidatesPage from "../../pages/dashboard/candidates_page/candidiates_page_helpers";
import { Constants } from "../../utils/constants";

test.describe("Candidate section", () => {
    test.beforeEach(async ({ page }, testInfo) => {
        const login = new LoginPage(page);
        const dashboard = new DashboardHelpers(page);
        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);

        await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await expect(page).toHaveURL(/.*agent-dashboard/);
        await dashboard.clickOnYesButton();
        await dashboard.navigateToCandidateSection();
    });

    test("[test-007] Add new candidate", async ({ page }, testInfo) => {
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

        await candidatePage.clickOnCloseButton();
        await page.reload();
        await dashboard.clearAllSearchFilters();
        await candidatePage.searchCandidateByName(email);
        await candidatePage.validateCreatedCandidateIsVisible(email);
        await candidatePage.deleteCandidateFromTheTable();
    });

    test("[test-008] Delete newly created candidate", async ({ page }, testInfo) => {
        const candidatePage = new CandidatesPage(page);
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

        await candidatePage.deleteCandidate();
        await candidatePage.searchCandidateByName(email);
        await candidatePage.verifyEmptyTableState();
    });

    test("[test-009] Search and view profile candidate", async ({ page }, testInfo) => {
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

        await candidatePage.clickOnCloseButton();
        await page.reload();
        await dashboard.clearAllSearchFilters();
        await candidatePage.searchCandidateByName(email);
        await page.reload();
        await candidatePage.validateCandidateListCountInCandidateTable(1, email);
        await candidatePage.deleteCandidateFromTheTable();
    });
});
