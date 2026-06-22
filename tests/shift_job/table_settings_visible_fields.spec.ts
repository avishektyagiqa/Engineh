import { test } from "../../utils/support/tests";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import { Constants } from "../../utils/constants";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import ShiftJobHelpers from "../../pages/dashboard/shift_job/shift_job_helpers";

test.describe("Shift Job section, Conflicts Column Appears Twice Bug ID: 34057362489", () => {
    test.beforeEach(async ({ page }, testInfo) => {
        const login = new LoginPage(page);
        const dashboard = new DashboardHelpers(page);
        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);

        await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await dashboard.clickOnYesButton();
    });

    test(
        "[test-048] Verify no duplicate “Conflicts” field appears in candidate table when broadcasting a shift job (Bug 34057362489)",
        async ({ page }, testInfo) => {
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
            await shiftJob.validateOnlyOneConflictSectionIsVisible();
            await dashboard.clickOnCloseButton();
            await shiftJob.searchAndVerifyShiftJobInTable(email, candidateName);
            await shiftJob.deleteShiftJobFromTheTable();
        }
    );
});