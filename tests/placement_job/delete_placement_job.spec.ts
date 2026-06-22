import { expect, test } from "../../utils/support/tests";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import { Constants } from "../../utils/constants";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import PlacementJobHelpers from "../../pages/dashboard/placement_job/placement_job_helpers";

const getDashboardSectionName = (projectName: string): string => {
    const normalized = projectName.toLowerCase();
    const isProd = normalized.includes("production") || normalized.includes("dev");
    return isProd ? "Placements" : "Placement Jobs";
};

const getFutureDateISO = (daysAhead = 7): string => {
    const date = new Date();
    date.setDate(date.getDate() + daysAhead);
    return date.toISOString().slice(0, 10);
};

test.describe("Placement Job section", () => {
    test.beforeEach(async ({ page }, testInfo) => {
        const login = new LoginPage(page);
        const dashboard = new DashboardHelpers(page);
        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);

        await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await expect(page).toHaveURL(/.*agent-dashboard/);
        await dashboard.clickOnYesButton();
    });

    test("[test-037] Delete newly created placement job", async ({ page }, testInfo) => {
        const dashboard = new DashboardHelpers(page);
        const placementJob = new PlacementJobHelpers(page);

        const sectionName = getDashboardSectionName(testInfo.project.name);
        await dashboard.navigateToDashboardsSection(sectionName);

        const {
            email,
            clientIndex,
            jobTitle: baseJobTitle,
            address,
            city,
            country,
            state,
            zip,
            compensation,
            children,
            schedule,
            caregiverQualities,
            comment,
        } = Constants.PlacementFormData;

        const randString = Constants.randStr();
        const jobTitle = `${baseJobTitle} ${randString}`;
        const startDateISO = getFutureDateISO(7);

        await placementJob.createNewPlacementJob(
            email,
            clientIndex,
            jobTitle,
            address,
            city,
            country,
            state,
            zip,
            compensation,
            startDateISO,
            children,
            schedule,
            caregiverQualities,
            caregiverQualities,
            comment,
            testInfo.project.name
        );

        await placementJob.validateJobCreatedModal();
        await placementJob.closeJobCreatedModal();

        await placementJob.validateCreatedJobTitle(jobTitle);
        await placementJob.deletePlacementJob(jobTitle);
        await placementJob.validateDeletedJobIsNotDisplayed(jobTitle);
    });
});