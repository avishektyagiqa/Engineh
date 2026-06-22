import { expect, test } from "../../utils/support/tests";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import ClientPage from "../../pages/dashboard/client_page/client_page_helpers";
import { Constants } from "../../utils/constants";

test.describe("Client section", () => {

    const getSectionName = (projectName: string): string => {
        const isStaging = projectName.includes("staging") || projectName.includes("stage");
        const isProd = projectName.includes("prod") || projectName.includes("dev");
        if (isProd) return "Clients" ;
        if (isStaging) return "Families";

        return 'Clients';
    };

    test.beforeEach(async ({ page }, testInfo) => {
        const login = new LoginPage(page);
        const dashboard = new DashboardHelpers(page);
        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);
        const sectionName = getSectionName(testInfo.project.name);

        await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await expect(page).toHaveURL(/.*agent-dashboard/);
        await dashboard.clickOnYesButton();
        await dashboard.navigateToDashboardsSection(sectionName);
    });

    test("[test-057] Clients view getting reset if doing anything on other screen. Bug:41368805669", async ({ page }, testInfo) => {
        const clientPage = new ClientPage(page);
        const dashboard = new DashboardHelpers(page);

        await page.waitForTimeout(10000);
        await clientPage.switchClientView();
        await clientPage.validateViewIsChangedAndSaved();
        await clientPage.clickOnClientPage();
        await page.waitForTimeout(10000)

        await clientPage.validateAdminProfileMoreSectionsVisibleForClient()
        await clientPage.goToProfileView();
        await clientPage.selectTemplate('W-9');
        await dashboard.clickAddDocTemplateButton();
        await dashboard.waitForSpinnerToDisappear();
        await dashboard.clickDeleteDocumentTemplateButton();
        await dashboard.waitForSpinnerToDisappear();
        await clientPage.clickOnCloseButton();
        await clientPage.validateViewIsChangedAndSaved();
    });
});