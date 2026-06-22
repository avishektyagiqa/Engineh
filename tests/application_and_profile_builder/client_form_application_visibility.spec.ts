import { expect, test } from "../../utils/support/tests";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import { Constants } from "../../utils/constants";
import ApplicationAndProfileBuilderPage from "../../pages/application_and_profile_builder/application_and_profile_builder_helpers";

test.describe("Application and profile builder section", () => {

    test.beforeEach(async ({ page }, testInfo) => {
        const login = new LoginPage(page);
        const dashboard = new DashboardHelpers(page);
        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);

        await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await expect(page).toHaveURL(/.*agent-dashboard/);
        await dashboard.clickOnYesButton();
    });

    test("[test-052] Fill client application form. Bug ID:41010424664", async ({ page }, testInfo) => {
        const projectName = testInfo.project.name;
        const env = (projectName ?? "").toLowerCase();
        const isStagingOrLocal =
            env.includes("staging") ||
            env.includes("localhost") ||
            env.includes("local");
        const isProd = env.includes("prod");
        console.log({ projectName, env, isStagingOrLocal, isProd });
        const dashboard = new DashboardHelpers(page);
        const applications = new ApplicationAndProfileBuilderPage(page);
        const builderName = "test client application 3";

        await dashboard.openMoreSection();
        await dashboard.clickOnApplicationAndProfileBuilder();
        await applications.searchBuilderName(builderName);
        //if (isStagingOrLocal) {
        await applications.fillApplicationFormStaging();
        // }
        //
        // if (isProd) {
        //     await applications.fillApplicationFormProduction();
        // }
    })
});