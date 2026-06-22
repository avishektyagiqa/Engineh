import { test } from "../../utils/support/tests";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import { Constants } from "../../utils/constants";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import ShiftJobHelpers from "../../pages/dashboard/shift_job/shift_job_helpers";

test.describe("Shift Job section, Broadcast distance column (Bug 31940985348)", () => {
    test.beforeEach(async ({ page }, testInfo) => {
        const login = new LoginPage(page);
        const dashboard = new DashboardHelpers(page);
        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);

        await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await dashboard.clickOnYesButton();
    });

    test("[test-042] Verify broadcast distance column visibility (Bug 31940985348)", async ({ page }, testInfo) => {
        const dashboard = new DashboardHelpers(page);
        const shiftJob = new ShiftJobHelpers(page);
        const email = "testuser@enginehire.ca";
        const candidateName = "test candidate";
        const bookingSection = "Temporary Bookings Staging";

        await shiftJob.clickOnYesButton();
        await dashboard.navigateToDashboardsSection("Shift Job Calendar");
        await shiftJob.chooseRandomDayOnCalendar();
        await shiftJob.submitShiftJobForm(testInfo.project.name, bookingSection);
        await shiftJob.performMultipleYesClicks(4);
        await shiftJob.performMultipleDontSendClicks();
        await page.waitForTimeout(10000);
        await shiftJob.goToBroadcast();
        await shiftJob.uncheckCheckboxes();
        await shiftJob.clearFilters();
        await shiftJob.validateDistanceIsVisible();
        await dashboard.clickOnCloseButton();
        await shiftJob.searchAndVerifyShiftJobInTable(email, candidateName);
    });

    test.afterEach(async ({ page }, testInfo) => {
        // If DB gating skipped this test, don't run cleanup
        if (testInfo.status === "skipped") return;

        const login = new LoginPage(page);
        const dashboard = new DashboardHelpers(page);
        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);
        const shiftJob = new ShiftJobHelpers(page);
        const email = "testuser@enginehire.ca";
        const candidateName = "test candidate";

        await login.userLoginAfterLogOut(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await dashboard.clickOnYesButton();
        await dashboard.navigateToDashboardsSection("Shift Job Calendar");
        await shiftJob.clickNextYearArrowMultiple(2);
        await shiftJob.searchAndVerifyShiftJobInTable(email, candidateName);
        await shiftJob.deleteShiftJobFromTheTable();
    });
});