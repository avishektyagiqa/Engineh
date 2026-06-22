import { test } from "../../utils/support/tests";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import { Constants } from "../../utils/constants";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import ShiftJobHelpers from "../../pages/dashboard/shift_job/shift_job_helpers";
import ClientPage from "../../pages/dashboard/client_page/client_page_helpers";

test.describe("Shift Job section", () => {
    test.beforeEach(async ({ page }, testInfo) => {
        const login = new LoginPage(page);
        const dashboard = new DashboardHelpers(page);
        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);

        await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await dashboard.clickOnYesButton();
    });

    test(
        "[test-049] Unassign candidate after creating a shift job",
        async ({ page }, testInfo) => {
            const dashboard = new DashboardHelpers(page);
            const shiftJob = new ShiftJobHelpers(page);
            const clientPage = new ClientPage(page);

            const email = "testuser@enginehire.ca";
            const bookingSection = "Temporary Bookings Staging";

            await shiftJob.clickOnYesButton();
            await dashboard.navigateToDashboardsSection("Shift Job Calendar");
            await shiftJob.chooseRandomDayOnCalendar();
            await shiftJob.submitShiftJobForm(testInfo.project.name, bookingSection, true);
            await shiftJob.performMultipleYesClicks(4);
            await shiftJob.performMultipleDontSendClicks();
            await shiftJob.openCreatedShiftJobFromTable(email);
            await shiftJob.verifyShiftJobCurrentStatus("Assigned");
            await shiftJob.clickOnUnassignCandidateButton();
            await shiftJob.verifyConfirmUnassignCandidateModalTextIsVisible();
            await shiftJob.confirmUnassignCandidateByClickingYes();
            await page.waitForTimeout(5000);

            // await shiftJob.verifyUnassignedCandidateTextIsVisible();
            const isStaging = testInfo.project.name.toLowerCase().includes("staging");
            if (isStaging) {
                await clientPage.clickOnDontSendButton();
            }

            await page.waitForTimeout(5000);
            await shiftJob.verifyShiftJobCurrentStatus("Requested");
            await shiftJob.closeCreatedShiftJobModal();
        }
    );

    test.afterEach(async ({ page }, testInfo) => {
        if (testInfo.status === "skipped") return;
        const login = new LoginPage(page);
        const dashboard = new DashboardHelpers(page);
        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);
        const shiftJob = new ShiftJobHelpers(page);
        const email = "testuser@enginehire.ca";

        await login.userLoginAfterLogOut(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await dashboard.clickOnYesButton();
        await dashboard.navigateToDashboardsSection("Shift Job Calendar");
        await shiftJob.clickNextYearArrowMultiple(2);
        await shiftJob.searchInTable(email);
        await shiftJob.deleteShiftJobFromTheTable();
    });
});