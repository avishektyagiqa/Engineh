import { test } from "@playwright/test";
import { Constants } from "../../utils/constants";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import ClientPage from "../../pages/dashboard/client_page/client_page_helpers";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import ShiftJobHelpers from "../../pages/dashboard/shift_job/shift_job_helpers";

test.describe('Client section', () => {
  let uniqueString: string;
  let phoneNumber: string;
  let clientEmail: string;

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
    const clientPage = new ClientPage(page);
    const sectionName = getSectionName(testInfo.project.name);

    const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);

    uniqueString = Constants.randStr();
    phoneNumber = Constants.generateRandomPhoneNumber();
    clientEmail = uniqueString + Constants.USERS.testEmail.USERNAME;

    await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
    await dashboard.clickOnYesButton();
    await dashboard.navigateToDashboardsSection(sectionName);

    await clientPage.createNewClient(
        clientEmail,
        phoneNumber,
        Constants.USERS.testEmail.FIRSTNAME,
        Constants.USERS.testEmail.LASTNAME,
        testInfo.project.name
    );
  });

  test("[test-075] Edit client contact information details", async ({ page }, testInfo) => {
    const clientPage = new ClientPage(page);
    const dashboard = new DashboardHelpers(page);
    const randString = Constants.randStr();

    const projectName = testInfo.project.name;
    const env = (projectName ?? "").toLowerCase();
    const isStagingOrLocal =
        env.includes("stag") ||
        env.includes("local");
    const isProd = env.includes("prod");

    await clientPage.goToProfileView();
    await clientPage.navigateToContactInfoSection();

    if (isStagingOrLocal) {
      await clientPage.editContactInfoSection(randString);
      await dashboard.waitForSpinnerToDisappear();
    }

    if (isProd) {
      await clientPage.editContactInfoFields(randString);
      await dashboard.waitForSpinnerToDisappear();
    }

    await dashboard.closeProfile();
    await page.reload();
    await clientPage.searchClientByName(clientEmail);
    await clientPage.clickOnClientPage();

    await clientPage.goToProfileView();
    await clientPage.navigateToContactInfoSection();

    if (isStagingOrLocal) {
      await clientPage.validateDataAfterEditIsUpdatedStg(randString);
    }

    if (isProd) {
      await clientPage.validateDataAfterEditIsUpdatedProd(randString);
    }
  });

  test.afterEach(async ({ page }, testInfo) => {
    const login = new LoginPage(page);
    const dashboard = new DashboardHelpers(page);
    const clientPage = new ClientPage(page);
    const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);

    await login.userLoginAfterLogOut(loginPath, credentials.USERNAME, credentials.PASSWORD);
    await dashboard.clickOnYesButton();
    await dashboard.navigateToDashboardsSection(getSectionName(testInfo.project.name));
    await clientPage.searchClientByName(clientEmail);
    await clientPage.deleteClientFromClientTable();
  });
});