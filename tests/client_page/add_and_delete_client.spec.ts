import { expect, test } from "../../utils/support/tests";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import ClientPage from "../../pages/dashboard/client_page/client_page_helpers";
import { Constants } from "../../utils/constants";

test.describe("Client section", () => {

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

  test("[test-025] Add new client and delete", async ({ page }, testInfo) => {
    const clientPage = new ClientPage(page);
    const dashboard = new DashboardHelpers(page);
    const randString = Constants.randStr();
    const phoneNumber = Constants.generateRandomPhoneNumber();
    const email = randString + Constants.USERS.testEmail.USERNAME;

    await clientPage.createNewClient(
        email,
        phoneNumber,
        Constants.USERS.testEmail.FIRSTNAME,
        Constants.USERS.testEmail.LASTNAME,
        testInfo.project.name
    );

    await clientPage.clickOnCloseButton();
    await dashboard.clearAllSearchFilters();
    await clientPage.validateCreatedClientIsVisible(email);
    await clientPage.deleteClientFromClientTable();
    await clientPage.validateDeletedClientIsNotVisible(email);
  });
});
