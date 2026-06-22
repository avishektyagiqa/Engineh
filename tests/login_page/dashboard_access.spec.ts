import { test, expect } from '../../utils/support/tests';
import LoginPage from '../../pages/Login_page/login_page_helpers';
import { Constants } from '../../utils/constants';

test.describe('Validate that the my dashboard button is not visible', () => {
    test('[test-002] validate that the my dashboard button is not visible', async ({ page }, testInfo) => {
        const login = new LoginPage(page);

        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);

        await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await expect(page).toHaveURL(/.*agent-dashboard/);
        await login.validateMyDashboardButtonNotVisible();
    });
});