import { test } from "../../utils/support/tests";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import { Constants } from "../../utils/constants";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import ShiftJobHelpers from "../../pages/dashboard/shift_job/shift_job_helpers";

test.describe("Shift Job section, broadcast checkbox", () => {
    let sharedPage: any;

    test.beforeEach(async ({ page }, testInfo) => {
        sharedPage = page; // keep your pattern (used in afterEach)

        const login = new LoginPage(page);
        const dashboard = new DashboardHelpers(page);
        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);

        await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await dashboard.clickOnYesButton();
    });

    test("[test-044] Create shift job without candidate, uncheck broadcast checkbox", async ({ page }, testInfo) => {
        const dashboard = new DashboardHelpers(page);
        const shiftJob = new ShiftJobHelpers(page);
        const email = "testuser@enginehire.ca";
        const bookingSection = "Temporary Bookings Staging";

        await shiftJob.clickOnYesButton();
        await dashboard.navigateToDashboardsSection("Shift Job Calendar");
        await shiftJob.chooseRandomDayOnCalendar();
        await shiftJob.submitShiftJobForm(testInfo.project.name, bookingSection, false, true, false, true);
        await shiftJob.performMultipleYesClicks(4);
        await shiftJob.performMultipleDontSendClicks();
        await shiftJob.openCreatedShiftJobFromTable(email);
        await shiftJob.verifyShiftJobCurrentStatus("Requested");
        await shiftJob.closeCreatedShiftJobModal();
    });

    test.afterEach(async ({ page }, testInfo) => {
        // If the test was skipped (DB gating), do not run cleanup
        if (testInfo.status === "skipped") return;

        const p = sharedPage ?? page;

        const login = new LoginPage(p);
        const dashboard = new DashboardHelpers(p);
        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);
        const shiftJob = new ShiftJobHelpers(p);
        const email = "testuser@enginehire.ca";

        await login.userLoginAfterLogOut(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await dashboard.clickOnYesButton();
        await dashboard.navigateToDashboardsSection("Shift Job Calendar");
        await shiftJob.clickNextYearArrowMultiple(2);
        await shiftJob.searchInTable(email);
        await shiftJob.deleteShiftJobFromTheTable();
    });
});