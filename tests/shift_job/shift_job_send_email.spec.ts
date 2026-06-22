import { test } from "@playwright/test";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import { Constants } from "../../utils/constants";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import ShiftJobHelpers from "../../pages/dashboard/shift_job/shift_job_helpers";

test.describe('Shift Job section', () => {
    test.beforeEach(async ({ page }, testInfo) => {
        const login = new LoginPage(page);
        const dashboard = new DashboardHelpers(page);
        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);

        await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await dashboard.clickOnYesButton();
    });

    test("[test-055] Send email functionality", async ({ page } ,testInfo) => {
        const dashboard = new DashboardHelpers(page);
        const shiftJob = new ShiftJobHelpers(page);
        const bookingSection = 'Temporary Bookings Staging'

        await page.waitForTimeout(10000);
        await shiftJob.clickOnYesButton();
        await dashboard.navigateToDashboardsSection('Shift Job Calendar');
        await shiftJob.chooseRandomDayOnCalendar();

        const bookingDateText = await shiftJob.getBookingDateText();
        const bookingDateMatch = bookingDateText.match(/\w+ \w+ \d+ \d{4}/);
        if (!bookingDateMatch) throw new Error(`Could not extract booking date from: "${bookingDateText}"`);

        const bookingDate = bookingDateMatch[0].split(' ').slice(1).join(' ');
        console.log('📅 Booking date (from modal):', bookingDate);

        await shiftJob.submitShiftJobForm(testInfo.project.name, bookingSection);
        await shiftJob.performMultipleYesClicks(5, 6000);

        const isProd =
            testInfo.project.name.includes('production') ||
            testInfo.project.name.includes('dev');

        if(isProd){
            await shiftJob.sendEmailMultipleTimes(2, 10000);
        } else {await shiftJob.sendEmailMultipleTimes(2, 10000);
        }

        await dashboard.openMoreSection();
        await dashboard.clickOnAllLogsButton();
        await shiftJob.clickOnEmailSmsPushNotificationLogButton();
        await shiftJob.selectChannel(0);
        await shiftJob.validateEmailIsSentAndVisible();
        await shiftJob.closeLogsModal();
        await dashboard.navigateToDashboardsSection('Shift Job Calendar');
        await page.waitForTimeout(10000);
        await shiftJob.clickNextYearArrowMultiple(2);
        await shiftJob.clickSecondClearButton();
        await shiftJob.searchAndVerifyShiftJobInTable("testuser@enginehire.ca", 'test candidate');
    });

    test.afterEach(async ({ page }, testInfo) => {
        const login = new LoginPage(page);
        const dashboard = new DashboardHelpers(page);
        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);
        const shiftJob = new ShiftJobHelpers(page);
        const email = 'testuser@enginehire.ca';

        await login.userLoginAfterLogOut(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await dashboard.clickOnYesButton();
        await dashboard.navigateToDashboardsSection('Shift Job Calendar');
        await shiftJob.clickNextYearArrowMultiple(2);
        await shiftJob.searchInTable(email);
        await shiftJob.deleteShiftJobFromTheTable();
    });
});
