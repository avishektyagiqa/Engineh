import { expect, test } from "../../utils/support/tests";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import TodoPage from "../../pages/to_do_tasks/personal_to_do_helpers";
import ShiftJobHelpers from "../../pages/dashboard/shift_job/shift_job_helpers";
import { Constants } from "../../utils/constants";
import {ToDoLocators} from "../../pages/to_do_tasks/personal_to_do_locators";

test.describe("Personal To Do email notification", () => {
    test.beforeEach(async ({ page }, testInfo) => {
        const login = new LoginPage(page);
        const dashboard = new DashboardHelpers(page);
        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);

        await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await expect(page).toHaveURL(/.*agent-dashboard/);
        await dashboard.clickOnYesButton();
    });

    test("[test-065] Validate creation one To Do task triggers only one email notification", async ({ page }) => {
        const todoPage = new TodoPage(page);
        const dashboard = new DashboardHelpers(page);
        const shiftJob = new ShiftJobHelpers(page);
        const taskTitle = `Test task ${Date.now()}`;

        await todoPage.openToDoFullView();
        await todoPage.createNewTaskWithTitle(taskTitle);
        await todoPage.clickOnSendButton();

        await dashboard.openMoreSection();
        await dashboard.clickOnAllLogsButton();
        await shiftJob.clickOnEmailSmsPushNotificationLogButton();
        await shiftJob.selectChannel(0);

        const searchIcon = page.locator('//i[contains(text(), "search")]');
        const searchSubject = page.locator('[placeholder="Search by subject line"]')
        await searchIcon.click();
        await searchSubject.fill('Gagik Vardanyan assigned you a task');
        await page.waitForTimeout(3000);

        const emailItems = await page.locator('[class="log-item--body--items"]').count();
        expect(emailItems).toBeGreaterThanOrEqual(1);

        const closeButton =  page.locator('i.material-symbols-outlined', { hasText: 'close' });
        await closeButton.click();
    });

    test.afterEach(async ({page}, testInfo) => {
        const login = new LoginPage(page);
        const dashboard = new DashboardHelpers(page);
        const todoPage = new TodoPage(page);
        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);

        await login.userLoginAfterLogOut(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await dashboard.clickOnYesButton();

        await todoPage.openToDoFullView();
        await todoPage.deleteNewlyCreatedTask();
    })
});