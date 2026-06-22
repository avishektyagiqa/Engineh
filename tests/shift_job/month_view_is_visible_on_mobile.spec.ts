import { devices } from "@playwright/test";
import { test } from "../../utils/support/tests";
import { Constants } from "../../utils/constants";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import ShiftJobHelpers from "../../pages/dashboard/shift_job/shift_job_helpers";
import { type Page } from "@playwright/test";

async function installWelcomeModalAutoCloser(page: Page) {
    const closeWelcomeModalScript = () => {
        const closeModal = () => {
            const closeButton = document.querySelector<HTMLElement>('[data-test-id="welcome-message-close-button"]');

            if (closeButton) {
                closeButton.click();
            }
        };

        closeModal();

        const observer = new MutationObserver(() => {
            closeModal();
        });

        const startObserver = () => {
            if (document.body) {
                observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                });
            }
        };

        if (document.body) {
            startObserver();
        } else {
            document.addEventListener("DOMContentLoaded", startObserver, { once: true });
        }
    };

    await page.addInitScript(closeWelcomeModalScript);

    try {
        await page.evaluate(closeWelcomeModalScript);
    } catch {
        console.log("ignore if page is navigating");
    }
}

test.use({
    ...devices["iPhone 13 Pro"],
    browserName: "chromium",
});

test.describe("Shift Jobs", () => {
    test.beforeEach(async ({ page }, testInfo) => {
        await installWelcomeModalAutoCloser(page);
        const login = new LoginPage(page);
        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);
        await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
    });

    test("[test-053] Validate that in month view data displays correctly. Bug ID: 41139512733", async ({ page }, testInfo) => {
        const dashboard = new DashboardHelpers(page);
        const shiftJob = new ShiftJobHelpers(page);

        const email = "testuser@enginehire.ca";
        const candidateName = "test candidate";
        const bookingSection = "Temporary Bookings Staging";

        await shiftJob.clickOnYesButton();
        await dashboard.clickOnDashboardDropdownForMobile();
        await dashboard.navigateToDashboardsSection("Shift Job Calendar");

        await shiftJob.verifyWeekdaysAreVisible()
        await shiftJob.verifyDaysAreVisible()
        await shiftJob.verifyRowsAreVisible()

        await shiftJob.chooseRandomDayOnCalendar();
        await shiftJob.submitShiftJobForm(testInfo.project.name, bookingSection);
        await shiftJob.performMultipleYesClicks(4);
        await shiftJob.performMultipleDontSendClicks();
        await shiftJob.searchAndVerifyShiftJobInTableOnMobile(email, candidateName);
    });

    test.afterEach(async ({ page }, testInfo) => {
        const login = new LoginPage(page);
        const dashboard = new DashboardHelpers(page);
        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);
        const shiftJob = new ShiftJobHelpers(page);

        const email = "testuser@enginehire.ca";

        await login.userLoginAfterLogOut(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await dashboard.clickOnYesButton();
        await dashboard.clickOnDashboardDropdownForMobile();
        await dashboard.navigateToDashboardsSection("Shift Job Calendar");
        await shiftJob.clickNextYearArrowMultiple(2);
        await shiftJob.searchInTableMobile(email);
        await shiftJob.deleteShiftJobFromTheTable();
    });
});