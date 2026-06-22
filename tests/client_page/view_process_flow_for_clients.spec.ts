import { test } from "../../utils/support/tests";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import ClientPage from "../../pages/dashboard/client_page/client_page_helpers";
import { Constants } from "../../utils/constants";

test.describe("Client section, view process flow for client", () => {

    const getSectionName = (projectName: string): string => {
        const isStaging = projectName.includes("staging") || projectName.includes("stage");
        const isProd = projectName.includes("production") || projectName.includes("prod");
        if (isProd) return "Clients" ;
        if (isStaging) return "Families";

        return 'Clients';
    };

    test.beforeEach(async ({ page }, testInfo) => {
        const login = new LoginPage(page);
        const dashboard = new DashboardHelpers(page);
        const sectionName = getSectionName(testInfo.project.name);
        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);

        await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await dashboard.clickOnYesButton();
        await dashboard.navigateToDashboardsSection(sectionName);
    });

    test("[test-028] View process flow for client", async ({ page }, testInfo) => {
        const dashboard = new DashboardHelpers(page);
        const clientPage = new ClientPage(page);

        await clientPage.clickOnSchemaIcon();
        await dashboard.validateProcessFlowTitleIsVisible();
    });
});