import { test } from "../../utils/support/tests";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import { Constants } from "../../utils/constants";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import ShiftJobHelpers from "../../pages/dashboard/shift_job/shift_job_helpers";

test.describe("Shift Job section", () => {
    test.beforeEach(async ({ page }, testInfo) => {
        const login = new LoginPage(page);
        const dashboard = new DashboardHelpers(page);
        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);

        await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await dashboard.clickOnYesButton();
    });

    test("[test-040] Validate that the candidate's and client's dropdowns are correct (id 30620720299)", async ({ page }, testInfo) => {
        const dashboard = new DashboardHelpers(page);
        const shiftJob = new ShiftJobHelpers(page);

        const bookingSection = "Temporary Bookings Staging";
        const clientEmail = "testuser@enginehire.ca";
        const candidateEmail = "testcandidate@enginehire.ca";

        await shiftJob.clickOnYesButton();
        await dashboard.navigateToDashboardsSection("Shift Job Calendar");
        await shiftJob.chooseRandomDayOnCalendar();
        await shiftJob.validateClientAndCandidatesDropdowns(
            testInfo.project.name,
            bookingSection,
            clientEmail,
            candidateEmail
        );
        await page.waitForTimeout(5000);
    });
});