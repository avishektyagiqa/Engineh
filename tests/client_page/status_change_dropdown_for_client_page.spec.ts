import { expect, test } from "../../utils/support/tests";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import ClientPage from "../../pages/dashboard/client_page/client_page_helpers";
import { Constants } from "../../utils/constants";

test.describe("Client section", () => {
  let uniqueString: string;
  let phoneNumber: string;

  const getSectionName = (projectName: string): string => {
    const isStaging = projectName.includes("staging") || projectName.includes("stage");
    const isProd = projectName.includes("production") || projectName.includes("prod");
    if (isProd) return "Clients";
    if (isStaging) return "Families";

    return "Clients";
  };

  test.beforeEach(async ({ page }, testInfo) => {
    const login = new LoginPage(page);
    const dashboard = new DashboardHelpers(page);
    const clientPage = new ClientPage(page);
    const sectionName = getSectionName(testInfo.project.name);
    const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);

    uniqueString = Constants.randStr();
    phoneNumber = Constants.generateRandomPhoneNumber();

    await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
    await expect(page).toHaveURL(/.*agent-dashboard/);
    await dashboard.clickOnYesButton();
    await dashboard.navigateToDashboardsSection(sectionName);

    await clientPage.createNewClient(
        uniqueString + Constants.USERS.testEmail.USERNAME,
        phoneNumber,
        Constants.USERS.testEmail.FIRSTNAME,
        Constants.USERS.testEmail.LASTNAME,
        testInfo.project.name
    );
    await clientPage.clickOnCloseButton();
  });

  test("[test-066] Verify status dropdown is visible, scrollable and persists Active status after reload. Bug: 44671415343", async ({ page }) => {
    const clientPage = new ClientPage(page);
    const email = uniqueString + Constants.USERS.testEmail.USERNAME;

    await clientPage.searchForClient(email);
    await clientPage.openStatusDropdownForFirstResult();
    await clientPage.validateStatusDropdownVisibleAndScrollable();
    await clientPage.selectStatusAndValidate();

    await page.reload();

    await clientPage.searchForClient(email);
    await page.waitForTimeout(2000);
    await clientPage.validateClientStatusInRow(email);
  });

  test.afterEach(async ({ page }, testInfo) => {
    const clientPage = new ClientPage(page);
    const email = uniqueString + Constants.USERS.testEmail.USERNAME;

    await clientPage.searchForClient(email);
    await clientPage.deleteClientFromClientTable();
  });
});