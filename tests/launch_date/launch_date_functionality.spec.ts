import { test } from "../../utils/support/tests";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import { Constants } from "../../utils/constants";
import { launchDateHelpers } from "../../pages/dashboard/launch_date/launch_date_helpers";

test.describe("Validate that the launch date cleaning functionality works properly", () => {
    test.beforeEach(async ({ page }, testInfo) => {
        const login = new LoginPage(page);
        const dashboard = new DashboardHelpers(page);
        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);

        await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await dashboard.clickOnYesButton();
        await dashboard.navigateToCandidateSection();
    });

    test("[test-033] Verify that the launch date cleaning functionality works as expected", async ({ page }) => {
        const launchDate = "2027-11-16";
        const launchDateHelpersObj = new launchDateHelpers(page);

        await launchDateHelpersObj.clickOnLaunchDate();
        await launchDateHelpersObj.selectDate(launchDate);
        await launchDateHelpersObj.validateLaunchDateText();
    });
});