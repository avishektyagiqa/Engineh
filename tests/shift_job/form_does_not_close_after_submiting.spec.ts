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

    test("[test-045] the form does not close after submitting (Bug 35530549814)", async ({ page }, testInfo) => {
        const dashboard = new DashboardHelpers(page);
        const shiftJob = new ShiftJobHelpers(page);

        const email = "testuser@enginehire.ca";
        const candidateName = "test candidate";
        const bookingSection = "Temporary Bookings Staging";

        await shiftJob.clickOnYesButton();
        await dashboard.navigateToDashboardsSection("Shift Job Calendar");
        await shiftJob.chooseRandomDayOnCalendar();
        await shiftJob.submitShiftJobForm(testInfo.project.name, bookingSection);
        await dashboard.waitForSpinnerToDisappear();
        await shiftJob.performMultipleYesClicks(4);
        await shiftJob.performMultipleDontSendClicks();
        await shiftJob.validateShiftJobFormClosed();
        await shiftJob.searchAndVerifyShiftJobInTable(email, candidateName);
    });

    test.afterEach(async ({ page }, testInfo) => {
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