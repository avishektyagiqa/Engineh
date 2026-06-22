import { expect, test } from "../../utils/support/tests";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import TodoPage from "../../pages/to_do_tasks/personal_to_do_helpers";
import { ToDoLocators } from "../../pages/to_do_tasks/personal_to_do_locators";
import { Constants } from "../../utils/constants";

test.describe("Personal To Do functionality", () => {
    test.beforeEach(async ({ page }, testInfo) => {
        const login = new LoginPage(page);
        const dashboard = new DashboardHelpers(page);
        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);

        await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await expect(page).toHaveURL(/.*agent-dashboard/);
        await dashboard.clickOnYesButton();
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

    test("[test-061] Create, validate and delete a personal To Do task. Bug ticket: 44644957473",
        async ({ page }) => {
        const todoPage = new TodoPage(page);
        const taskTitle = `Test task ${Date.now()}`;

        await todoPage.openToDoFullView();
        await todoPage.createNewTaskWithTitle(taskTitle);
    });

    test("[test-062] Switch To Do view to Kanban and back to list, navigate to the settings",
        async ({ page }, testInfo) => {
        const todoPage = new TodoPage(page);
        const taskTitle = `Test task ${Date.now()}`;
        const projectName = testInfo.project.name;
        const env = (projectName ?? "").toLowerCase();
        const isProd =
            env.includes("production") ||
            env.includes("dev");

        await todoPage.openToDoFullView();
        await todoPage.createNewTaskWithTitle(taskTitle)
        if (isProd) {
            await todoPage.changeToDoViewToKanban();
        }
        const kanbanBoard = page.locator(ToDoLocators.kanbanView);
        await expect(kanbanBoard).toBeVisible();

        if (isProd) {
            await todoPage.changeToDoViewToList();
        }
        const tableView = page.locator(ToDoLocators.tableView);
        await expect(tableView).toBeVisible();

        await todoPage.settingsAccesableFroGlobalSettings();
        const settingsCheckbox = page.locator(ToDoLocators.settingsCheckbox);
        await expect(settingsCheckbox).toBeVisible();
    });
});
