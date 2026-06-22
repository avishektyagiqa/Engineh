import { expect, test } from "../../utils/support/tests";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import ApplicationAndProfileBuilderPage from "../../pages/application_and_profile_builder/application_and_profile_builder_helpers";
import ShiftJobHelpers from "../../pages/dashboard/shift_job/shift_job_helpers";
import { Constants } from "../../utils/constants";
import { ApplicationAndProfileBuilderLocators } from "../../pages/application_and_profile_builder/application_and_profile_builder_locators";
import ClientPage from "../../pages/dashboard/client_page/client_page_helpers";

test.describe("Application and profile builder section", () => {

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

        await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await expect(page).toHaveURL(/.*agent-dashboard/);
        await dashboard.clickOnYesButton();
    });

    test("[test-067] Verify notification settings and email log after client form submission", async ({ page }, testInfo) => {
        const dashboard = new DashboardHelpers(page);
        const applications = new ApplicationAndProfileBuilderPage(page);
        const shiftJob = new ShiftJobHelpers(page);
        const notificationEmail = "testuser@enginehire.ca";
        const builderNameStg = "client application";
        const builderNameProd = "Client Registrations"

        await dashboard.openMoreSection();
        await dashboard.clickOnApplicationAndProfileBuilder();

        const projectName = testInfo.project.name;
        const env = (projectName ?? "").toLowerCase();
        const isStagingOrLocal =
            env.includes("staging") ||
            env.includes("localhost") ||
            env.includes("local");
        const isProd = env.includes("prod");

        if (isStagingOrLocal) {
            await applications.searchBuilderName(builderNameStg);
        }
        if (isProd) {
            await applications.searchBuilderName(builderNameProd);
        }

        await applications.clickGearIconForFirstResult();
        await applications.clickOnNotificationsTab();
        await applications.validateNotificationSettings(notificationEmail);
        await applications.closeSettingsModal();

        if (isStagingOrLocal) {
            await applications.fillApplicationFormStagingInIncognito();
        } else {
            await applications.fillApplicationFormProductionInIncognito();
        }

        await dashboard.openMoreSection();
        await dashboard.clickOnAllLogsButton();

        await shiftJob.clickOnEmailSmsPushNotificationLogButton();
        await shiftJob.selectChannel(0);

        if (isStagingOrLocal) {
            await applications.searchAndValidateEmailLogForClientForm("New test client application 3 Form Submission");
        }
        if (isProd) {
            await applications.searchAndValidateEmailLogForClientForm("Form Submission Summary - Jobs Direct");
        }

        await dashboard.clickOnCloseButton();
    });

     test.afterEach(async ({ page }, testInfo) => {
        const login = new LoginPage(page);
        const dashboard = new DashboardHelpers(page);
        const clientPage = new ClientPage(page);
        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);
        const sectionName = getSectionName(testInfo.project.name);

        await login.userLoginAfterLogOut(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await expect(page).toHaveURL(/.*agent-dashboard/);
        await dashboard.clickOnYesButton();
        await dashboard.navigateToDashboardsSection(sectionName);
        await clientPage.openSearchAndFilterTools();
        await clientPage.filterByStatusInSearchAndFilterTool("Applied");
        await clientPage.deleteAllClientsWithStatusInTable("Applied");
    });
 });