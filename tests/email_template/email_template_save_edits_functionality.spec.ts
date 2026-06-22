import { test } from "../../utils/support/tests";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import { Constants } from "../../utils/constants";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import EmailTemplatesHelpers from "../../pages/email_templates/email_templates_helpers";

test.describe("Bug: Edits to an email template do not stay. Id: 28757269321", () => {
    test.beforeEach(async ({ page }, testInfo) => {
        const login = new LoginPage(page);
        const dashboard = new DashboardHelpers(page);
        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);

        await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await dashboard.clickOnYesButton();
    });

    test("[test-031] Verify email template save after edit (Bug 28757269321)", async ({ page }, testInfo) => {
        const dashboard = new DashboardHelpers(page);
        const emailTemplate = new EmailTemplatesHelpers(page);
        const templateName = "Job Email Blast (with referral)";
        const randString = Constants.randStr();
        const { BLOCK_SEL, EDITABLE_SEL, OVERLAY_SEL } = await emailTemplate.getSelectors(testInfo.project.name);

        await dashboard.openMoreSection();
        await emailTemplate.clickOnEmailTemplates();
        await emailTemplate.searchTemplateViaName(templateName);
        await emailTemplate.clickOnProgressStep();
        await dashboard.waitForSpinnerToDisappear();
        await emailTemplate.clickOnSelectDesignTemplateButton();
        await page.waitForTimeout(5000);
        await emailTemplate.clickOnTemplateEditButton();
        await emailTemplate.updateTemplateContent(randString, BLOCK_SEL, EDITABLE_SEL, OVERLAY_SEL);
        await page.waitForTimeout(20000);
        await emailTemplate.clickOnTemplateEditButton();
        await emailTemplate.validateTemplateContent(randString, BLOCK_SEL, EDITABLE_SEL, OVERLAY_SEL);
    });
});