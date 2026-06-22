import { expect, test } from "../../utils/support/tests";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import { Constants } from "../../utils/constants";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import {BurdenCalculatorLocators} from "../../pages/burden_calculator/burden_calculator_locators";
import BurdenCalculatorHelpers from "../../pages/burden_calculator/burden_calculator_helpers";

test.describe("Burden Calculator Form", () => {
    test.beforeEach(async ({ page }, testInfo) => {
        const login = new LoginPage(page);
        const dashboard = new DashboardHelpers(page);
        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);

        await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await expect(page).toHaveURL(/.*agent-dashboard/);
        await dashboard.clickOnYesButton();
    });

    test("[test-059] Validate burden calculator functionality. Ticket: 44478595253", async ({page}) => {
        const dashboard = new DashboardHelpers(page);
        const calculatorPage = new BurdenCalculatorHelpers(page);

        await dashboard.openMoreSection();
        await dashboard.openCalculatorSection();
        await dashboard.waitForSpinnerToDisappear();

        await calculatorPage.clickOnGearIcon();
        await calculatorPage.submitCreateNewTemplate();
        await calculatorPage.deleteNewlyCreatedTemplate();

    });
})