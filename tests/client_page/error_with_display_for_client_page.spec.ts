import { test } from "../../utils/support/tests";
import { Constants } from "../../utils/constants";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import ClientPage from "../../pages/dashboard/client_page/client_page_helpers";
import CandidatesPage from "../../pages/dashboard/candidates_page/candidiates_page_helpers";

test.describe("Validate that admin, profile and more sections are visible", () => {

    const getSectionName = (projectName: string): string => {
        const isStaging = projectName.includes("staging") || projectName.includes("stage");
        const isProd = projectName.includes("production") || projectName.includes("prod");
        if (isProd) return "Clients" ;
        if (isStaging) return "Families";

        return 'Clients';
    };

    test.beforeEach(async ({ page }, testInfo) => {
        const login = new LoginPage(page);
        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);
        const dashboard = new DashboardHelpers(page);
        await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);

        const sectionName = getSectionName(testInfo.project.name);
        await dashboard.navigateToDashboardsSection(sectionName);
        await dashboard.waitForSpinnerToDisappear();
    });

    test("[test-026] Validate that admin, profile and more sections are visible (Bug 34036229946)", async ({ page }) => {
        const clientHelpers = new ClientPage(page);
        const clientEmail = "testuser@enginehire.ca";
        const candidateHelpers = new CandidatesPage(page);

        await clientHelpers.searchForClient(clientEmail);
        await page.waitForTimeout(2000);
        await clientHelpers.clickOnClientPage();
        await clientHelpers.goToProfileView();
        await clientHelpers.validateAdminProfileMoreSectionsVisibleForClient();
        await candidateHelpers.validateAddPhotoVideoButton();
        await clientHelpers.validateUploadDocumentButton();
    });
});