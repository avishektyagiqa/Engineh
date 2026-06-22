import { test } from "../../utils/support/tests";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import SignatureHelpers from "../../pages/dashboard/signature_field/signature_field_helpers";
import { Constants } from "../../utils/constants";

test.describe("Image based templates signature field's test", () => {
    test.beforeEach(async ({ page }, testInfo) => {
        const login = new LoginPage(page);
        const dashboard = new DashboardHelpers(page);
        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);

        await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await dashboard.clickOnYesButton();
        await dashboard.navigateToCandidateSection();
    });

    test("[test-050] Verify signature field", async ({ page }, testInfo) => {
        const dashboard = new DashboardHelpers(page);
        const signatureHelpers = new SignatureHelpers(page);

        const templateName = "Image based for test";

        await dashboard.openMoreSection();
        await signatureHelpers.openDocTemplates();
        await signatureHelpers.searchImageBasedTemplate(templateName);
        await signatureHelpers.inspectTemplate();
        await page.waitForTimeout(2000);
        await signatureHelpers.signTemplate();
    });
});