import { test } from "../../utils/support/tests";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import { Constants } from "../../utils/constants";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import EmailTemplatesHelpers from "../../pages/email_templates/email_templates_helpers";
import SmsTemplatesHelpers from "../../pages/sms_templates/sms_templates_helpers";

test.describe(
    'Automation for new feature: Add an email and sms template trigger "Candidate left _ star review" "Client left _ star review id 29834913361',
    () => {
        test.beforeEach(async ({ page }, testInfo) => {
            const login = new LoginPage(page);
            const dashboard = new DashboardHelpers(page);
            const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);

            await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
            await dashboard.clickOnYesButton();
        });

        test("[test-029] Verify all the triggers are in the dropdown (Bug 29834913361)", async ({ page }, testInfo) => {
            const dashboard = new DashboardHelpers(page);
            const emailTemplate = new EmailTemplatesHelpers(page);
            const smsTemplate = new SmsTemplatesHelpers(page);

            await dashboard.openMoreSection();
            await emailTemplate.clickOnEmailTemplates();
            await smsTemplate.addTemplate();
            await smsTemplate.createTemplate();
            await smsTemplate.validateTriggers();
            await smsTemplate.closeCreateTemplate();
        });
    }
);
