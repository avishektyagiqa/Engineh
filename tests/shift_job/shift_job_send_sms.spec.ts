import { test } from "@playwright/test";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import { Constants } from "../../utils/constants";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import ShiftJobHelpers from "../../pages/dashboard/shift_job/shift_job_helpers";

test.describe.skip('Shift Job section, send sms functionality', () => {
    test.beforeEach(async ({ page }, testInfo) => {
        const login = new LoginPage(page);
        const dashboard = new DashboardHelpers(page);
        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);

        await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await dashboard.clickOnYesButton();
    });

    test('Shift job send sms functionality', async ({ page }, testInfo) => {
        const dashboard = new DashboardHelpers(page);
        const shiftJob = new ShiftJobHelpers(page);
        const bookingSection = 'Temporary Bookings Staging'

        await page.waitForTimeout(5000);

        await shiftJob.clickOnYesButton();
        await dashboard.navigateToDashboardsSection('Shift Job Calendar');

        await shiftJob.chooseRandomDayOnCalendar();
        // await shiftJob.selectRandomTime();
        await shiftJob.submitShiftJobForm(testInfo.project.name, bookingSection);
        await shiftJob.performMultipleYesClicks(4, 6000);

        // Handle "Don't send" popup
        await shiftJob.performMultipleDontSendClicks();
        await page.waitForTimeout(10000);

        // Open and filter logs
        await dashboard.openMoreSection();
        await dashboard.clickOnAllLogsButton();
        await shiftJob.clickOnEmailSmsPushNotificationLogButton();
        await shiftJob.selectChannel(2); // 2 = SMS
        await shiftJob.closeLogsModal();
        await dashboard.navigateToDashboardsSection('Shift Job Calendar');
        await page.waitForTimeout(10000);
        await shiftJob.clickSecondClearButton();
        await shiftJob.searchAndVerifyShiftJobInTable("testuser@enginehire.ca", 'test candidate');
        // await shiftJob.deleteShiftJobFromTheTable();

        // Optional log date validation (commented out)
        // const logText = await shiftJob.getLatestEmailDateText();
        // const logDateMatch = logText.match(/\w+ \w+ \d+ \d{4}/);
        // if (!logDateMatch) throw new Error(`Could not extract log date from: "${logText}"`);
        // const logDate = logDateMatch[0].split(' ').slice(1).join(' ');
        // console.log('Log date (from SMS):', logDate);

        // Optional cleanup
        // await shiftJob.deleteShiftJobFromCalendar();
        // await shiftJob.verifyNewlyCreatedShiftJobIsVisibleOnTable();
        // await shiftJob.deleteShiftJobFromTheTable();
        // await dashboard.verifyEmptyTableState();
    });

    test.afterEach(async ({ page }, testInfo) => {
        const login = new LoginPage(page);
        const dashboard = new DashboardHelpers(page);
        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);
        const shiftJob = new ShiftJobHelpers(page);
        const email = 'testuser@enginehire.ca';
        const candidateName = 'test candidate';

        await login.userLoginAfterLogOut(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await dashboard.clickOnYesButton();
        await dashboard.navigateToDashboardsSection('Shift Job Calendar');
        await shiftJob.clickNextYearArrowMultiple(2);
        await shiftJob.searchAndVerifyShiftJobInTable(email, candidateName);
        await shiftJob.deleteShiftJobFromTheTable();
    });
});
