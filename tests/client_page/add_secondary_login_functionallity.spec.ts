import { expect, test } from "../../utils/support/tests";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import ClientPage from "../../pages/dashboard/client_page/client_page_helpers";
import { Constants } from "../../utils/constants";

test.describe("Client section", () => {

    test.use({
        permissions: ['geolocation'],
        geolocation: { latitude: 40.7128, longitude: -74.0060 },
    });


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
        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);
        const sectionName = getSectionName(testInfo.project.name);

        await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await expect(page).toHaveURL(/.*agent-dashboard/);
        await dashboard.clickOnYesButton();
        await dashboard.navigateToDashboardsSection(sectionName);
    });


    test("[test-068] Add secondary login functionality", async ({ page }, testInfo) => {
        const clientPage = new ClientPage(page);
        const dashboard = new DashboardHelpers(page);
        const secondEmail = "secondary_user12@yopmail.com"
        const randString = "Secondary User"
        const clientEmail = "test@gmail.com";

        await page.waitForTimeout(5000);
        await clientPage.searchForClient(clientEmail);
        await page.waitForTimeout(5000);
        await clientPage.clickOnClientPage();
        await clientPage.addSecondaryLoginForClient(randString, secondEmail);
        await dashboard.waitForSpinnerToDisappear();
        await clientPage.verifySecondaryLoginAdded();
    })

    test.afterEach(async ({ page }, testInfo) => {
        const login= new LoginPage(page);
        const dashboard = new DashboardHelpers(page);
        const clientPage = new ClientPage(page);
        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);
        const sectionName = getSectionName(testInfo.project.name);
        const clientEmail = "test@gmail.com"
        const clientCredentials = "secondary_user12@yopmail.com"

        await dashboard.logoutFromAccount();
        await login.userLoginAfterLogOut(loginPath, clientCredentials, clientCredentials);
        await dashboard.clickOnYesButton();
        await login.logoutFromClientAccountAndLogin(loginPath, clientCredentials, clientCredentials);
        await login.userLoginAfterLogOut(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await dashboard.navigateToDashboardsSection(sectionName);
        await page.waitForTimeout(5000);
        await clientPage.searchForClient(clientEmail);
        await page.waitForTimeout(5000);
        await clientPage.clickOnClientPage();
        await clientPage.deleteSecondaryLogin();
    })
})

