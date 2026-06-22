import {expect, test} from "../../utils/support/tests";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import {Constants} from "../../utils/constants";
import PlacementJobHelpers from "../../pages/dashboard/placement_job/placement_job_helpers";

test.describe("Placement Job section", () => {
    const formData = Constants.PlacementFormData;
    const getSectionName = (projectName: string): string => {
        const isProd = projectName.includes("production") || projectName.includes("dev");
        return isProd ? "Placements" : "Placement Jobs";
    };
    test.beforeEach(async ({page}, testInfo) => {
        const login = new LoginPage(page);
        const dashboard = new DashboardHelpers(page);
        const {loginPath, credentials} = Constants.getLoginConfig(testInfo.project.name);

        await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await expect(page).toHaveURL(/.*agent-dashboard/);
        await dashboard.clickOnYesButton();
    });

    test("[test-056] Search by position number not working on placement job. BUG: 42138338605", async ({page}, testInfo) => {
        let jobTitle: string;
        const dashboard = new DashboardHelpers(page);
        const placementJob = new PlacementJobHelpers(page);
        const sectionName = getSectionName(testInfo.project.name);
        const randString = Constants.randStr();
        jobTitle = `${formData.jobTitle}${randString}`;

        await test.step("1. Search for placement job name by unique title", async () => {
            await dashboard.navigateToDashboardsSection(sectionName);
            await placementJob.goToTableView();
            await placementJob.getPlacementJobByTitle();
            await placementJob.validateSearchPlacementJobByTitle(jobTitle);
        })
        await test.step("2. Field label inconsistency", async () => {
            await page.reload();
            await placementJob.goToTableView();
            await placementJob.placementJobTableSettings();
        })


    })
});