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

    test("[test-076] Verify all tabs in Shift Job menu bar is visible, accesable and no errors appears",
        async ({ page }, testInfo) => {
            const dashboard = new DashboardHelpers(page);
            const shiftJob = new ShiftJobHelpers(page);

            const projectName = testInfo.project.name;
            const env = (projectName ?? "").toLowerCase();
            const isProd =
                env.includes("production") ||
                env.includes("dev");
            const isStaging =
                env.includes("stag");

            await shiftJob.clickOnYesButton();
            await dashboard.navigateToDashboardsSection("Shift Job Calendar");
            await dashboard.waitForSpinnerToDisappear();

            await shiftJob.clickOnDaySectionAndVerifyItsVisible();
            await shiftJob.clickOnWeekSectionAndVerifyItsVisible();
            await shiftJob.clickOnMonthSectionAndVerifyItsVisible();
            await shiftJob.clickOnSchedulerSectionAndVerifyItsVisible();
            await shiftJob.clickOnTableSection();
            await shiftJob.clickOnAnalyticsSection();

            if (isStaging) {
                await shiftJob.clickOnTimeOffSectionAndValidateIsVisible();
                await shiftJob.clickOnShiftReportsSection();
            }
        }
    );
});