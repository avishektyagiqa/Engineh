import { test, expect } from '../../utils/support/tests';
import LoginPage from '../../pages/Login_page/login_page_helpers';
import { Constants } from '../../utils/constants';

test.describe('Login functionality', () => {
    test('[test-001] valid login', async ({ page }, testInfo) => {
        const login = new LoginPage(page);

        // Uses project name (e.g., "production - chromium") to pick /login/858 vs /login/664 and creds
        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);

        await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await expect(page).toHaveURL(/.*agent-dashboard/);
    });
});