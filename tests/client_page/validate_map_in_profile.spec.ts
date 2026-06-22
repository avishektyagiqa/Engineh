import { expect, test } from "../../utils/support/tests";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import { Constants } from "../../utils/constants";
import { DashboardLocators } from "../../pages/dashboard/dashboard_locators";

test.describe("Client profile section", () => {

    const getSectionName = (projectName: string): string => {
        const isStaging = projectName.includes("staging") || projectName.includes("stage");
        const isProd = projectName.includes("production") || projectName.includes("prod");
        if (isProd) return "Clients" ;
        if (isStaging) return "Families";

        return 'Clients';
    };

    test.beforeEach(async ({ page }, testInfo) => {
        const login = new LoginPage(page);
        const dashboard = new DashboardHelpers(page);
        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);

        await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await expect(page).toHaveURL(/.*agent-dashboard/);
        await dashboard.clickOnYesButton();
        await page.waitForTimeout(2000);
        const sectionName = getSectionName(testInfo.project.name);
        await dashboard.navigateToDashboardsSection(sectionName);
    });

    test("[test-027] Validate map visibility in client profile", async ({ page }) => {
        const overlay = page.locator(".overlay-panel");
        await overlay.waitFor({ state: "hidden" });

        const search = page.locator(DashboardLocators.searchField);
        await search.focus();
        await page.keyboard.type("isar@gmail.com", { delay: 50 });

        await page.getByText("isar@gmail.com").click();
        await page.locator('#svg-spinner').waitFor({ state: 'hidden'});

        await expect(page.locator("#mapContainerUserPanelMapDialog")).toBeVisible();
    });
});
