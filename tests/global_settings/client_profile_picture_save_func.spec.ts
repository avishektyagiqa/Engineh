import { test } from "@playwright/test";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import { Constants } from "../../utils/constants";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import ProfilePictureScopeHelpers from "../../pages/global_settings/profile__picture_scope/profile_picture_scope_save_helpers"


test.describe('Profile picture scope save functionality', () => {

    test.beforeEach(async ({page}, testInfo) => {
        const login = new LoginPage(page);
        const dashboard = new DashboardHelpers(page);
        const {loginPath, credentials} = Constants.getLoginConfig(testInfo.project.name);

        await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await dashboard.clickOnYesButton();
    });

    test('[test-060] Profile picture scope save functionality test. Bug ID: 31744177997', async ({ page }) => {
        const dashboard = new DashboardHelpers(page);
        const profilePicture = new ProfilePictureScopeHelpers(page);

        await dashboard.openMoreSection();
        await dashboard.openGlobalSettings();
        await dashboard.waitForSpinnerToDisappear();
        await profilePicture.goToProfilePictureScope();
        await profilePicture.chooseFromProfilePictureScopeAndValidateVisibility("Public");
        await profilePicture.validateSelectedScope("Public");
        await profilePicture.chooseFromProfilePictureScopeAndValidateVisibility("Private");
        await profilePicture.validateSelectedScope("Private");
    });
});