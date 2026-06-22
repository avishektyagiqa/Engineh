import { test } from "../../utils/support/tests";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import { Constants } from "../../utils/constants";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import EmailTemplatesHelpers from "../../pages/email_templates/email_templates_helpers";
import SmsTemplatesHelpers from "../../pages/sms_templates/sms_templates_helpers";

test.describe.skip("Automation for new feature: email template AI generate", () => {
    test.beforeEach(async ({ page }, testInfo) => {
        const login = new LoginPage(page);
        const dashboard = new DashboardHelpers(page);
        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);

        await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await dashboard.clickOnYesButton();
    });

    test("[test-030] email template AI generate (Id 34942546262)", async ({ page }, testInfo) => {
        const dashboard = new DashboardHelpers(page);
        const emailTemplate = new EmailTemplatesHelpers(page);
        const smsTemplate = new SmsTemplatesHelpers(page);

        await dashboard.openMoreSection();
        await emailTemplate.clickOnEmailTemplates();
        await smsTemplate.addTemplate();
        await emailTemplate.AIgenerateTemplate("Create an email to confirm a booking for a candidate.");
        await emailTemplate.closeTemplateGeneratedModal();
        await emailTemplate.clickOnProgressStep();
        await emailTemplate.validateContent();
        await page.waitForTimeout(5000);
    });
});