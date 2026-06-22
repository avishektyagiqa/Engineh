import { expect, test } from "../../utils/support/tests";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import { Constants } from "../../utils/constants";
import ApplicationAndProfileBuilderPage from "../../pages/application_and_profile_builder/application_and_profile_builder_helpers";
import {
    ApplicationAndProfileBuilderLocators
} from "../../pages/application_and_profile_builder/application_and_profile_builder_locators";

test.describe("Application and profile builder section", () => {
    let applicationBuilder: ApplicationAndProfileBuilderPage;
    let fillText: string;

    test.beforeEach(async ({ page }, testInfo) => {
        applicationBuilder = new ApplicationAndProfileBuilderPage(page);
        fillText = Constants.genNewName();

        const login = new LoginPage(page);
        const dashboard = new DashboardHelpers(page);
        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);

        await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await expect(page).toHaveURL(/.*agent-dashboard/);
        await dashboard.clickOnYesButton();
    });

    test.afterEach(async ({}, testInfo) => {
        // ✅ do not clean up if skipped (or if setup didn't finish)
        if (testInfo.status === "skipped") return;

        await applicationBuilder.delBuilder(fillText);
    });

    test("[test-023] Create application builder", async ({ page }) => {
        const dashboard = new DashboardHelpers(page);
        const questionText = "Question 1";

        await dashboard.openMoreSection();
        await dashboard.clickOnApplicationAndProfileBuilder();

        await applicationBuilder.clickOnAddButton();
        await applicationBuilder.fillNameField(fillText);
        await applicationBuilder.clickOnApplicationRadioButton();
        await applicationBuilder.clickOnCandidateRadioButton();
        await applicationBuilder.clickOnAddFieldButton();
        await applicationBuilder.typeQuestion(questionText);
        await applicationBuilder.chooseFieldType();

        await dashboard.clickOnYesButton();

        await applicationBuilder.clickSubmit();
        await dashboard.waitForSpinnerToDisappear();
        await applicationBuilder.validateTheBuilderIsCreated(fillText);

        await page.waitForTimeout(2000);
    });

});