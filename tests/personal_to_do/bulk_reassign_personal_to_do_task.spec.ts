import { expect, test } from "../../utils/support/tests";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import TodoPage from "../../pages/to_do_tasks/personal_to_do_helpers";
import { Constants } from "../../utils/constants";
import {ToDoLocators} from "../../pages/to_do_tasks/personal_to_do_locators";

test.describe("Personal To Do functionality", () => {
    test.beforeEach(async ({page}, testInfo) => {
        const login = new LoginPage(page);
        const dashboard = new DashboardHelpers(page);
        const {loginPath, credentials} = Constants.getLoginConfig(testInfo.project.name);

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

    test("[test-064] Bulk reassign/assign personal do to tasks",
        async ({page}) => {
            const todoPage = new TodoPage(page);
            const taskTitle = `Test task ${Date.now()}`;

            await todoPage.openToDoFullView();
            await todoPage.createNewTaskAndValidateAssignedToGagik(taskTitle);
            await todoPage.bulkAssignToOtherAdmin(taskTitle);
        });
});