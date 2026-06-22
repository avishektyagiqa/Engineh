import { test } from "../../utils/support/tests";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import ClientPage from "../../pages/dashboard/client_page/client_page_helpers";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import { Constants } from "../../utils/constants";

test.describe("Client section", () => {
  let uniqueString: string;
  let phoneNumber: string;

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

    await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
    await dashboard.clickOnYesButton();
    await dashboard.navigateToDashboardsSection(sectionName);

    await clientPage.createNewClient(
        uniqueString + Constants.USERS.testEmail.USERNAME,
        phoneNumber,
        Constants.USERS.testEmail.FIRSTNAME,
        Constants.USERS.testEmail.LASTNAME,
        testInfo.project.name
    );
  });

  test("[test-024] add admin note", async ({ page }) => {
    const clientPage = new ClientPage(page);
    const note = "something";
    const email = uniqueString + Constants.USERS.testEmail.USERNAME;

    await clientPage.clickOnCloseButton();
    await clientPage.addAdminNote(email, note);
    await clientPage.validateAddedNote(note, email);
    await clientPage.closeNotesModal();
    await clientPage.deleteClientFromClientTable();
  });
});
