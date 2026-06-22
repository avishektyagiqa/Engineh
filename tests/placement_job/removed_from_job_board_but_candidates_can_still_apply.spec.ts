import { expect, test } from "../../utils/support/tests";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import { Constants } from "../../utils/constants";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import ShiftJobHelpers from "../../pages/dashboard/shift_job/shift_job_helpers";
import PlacementJobHelpers from "../../pages/dashboard/placement_job/placement_job_helpers";

test.use({
    permissions: ["geolocation"],
    geolocation: { latitude: 40.7128, longitude: -74.0060 },
});

test.describe("Placement Job section", () => {
    test.beforeEach(async ({ page }, testInfo) => {
        const login = new LoginPage(page);
        const dashboard = new DashboardHelpers(page);
        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);

        await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await expect(page).toHaveURL(/.*agent-dashboard/);
        await dashboard.clickOnYesButton();
    });

    test.afterEach(async ({ page }, testInfo) => {
        if (testInfo.status === "skipped") return;

        const placementJob = new PlacementJobHelpers(page);
        await placementJob.clickOnDeleteIcon();
        await placementJob.clickOnDeleteButton();
        await placementJob.validateDeletedJobIsNotDisplayed(Constants.PlacementFormData.jobTitle);
    });

    test("[test-039] Removed from job board but candidates can still apply", async ({ page }, testInfo) => {
        const dashboard = new DashboardHelpers(page);
        const login = new LoginPage(page);
        const shiftJob = new ShiftJobHelpers(page);
        const placementJob = new PlacementJobHelpers(page);

        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);

        const randString = Constants.randStr();

        await page.waitForTimeout(10000);
        await shiftJob.clickOnYesButton();

        const isProd = testInfo.project.name.includes("production");
        const isDev = testInfo.project.name.includes("dev");
        const dashboardSection = (isProd  || isDev) ? "Placements" : "Placement Jobs";
        await dashboard.navigateToDashboardsSection(dashboardSection);

        await placementJob.createNewPlacementJob(
            Constants.PlacementFormData.email,
            Constants.PlacementFormData.clientIndex,
            Constants.PlacementFormData.jobTitle + randString,
            Constants.PlacementFormData.address,
            Constants.PlacementFormData.city,
            Constants.PlacementFormData.country,
            Constants.PlacementFormData.state,
            Constants.PlacementFormData.zip,
            Constants.PlacementFormData.compensation,
            Constants.PlacementFormData.startDate,
            Constants.PlacementFormData.children,
            Constants.PlacementFormData.schedule,
            Constants.PlacementFormData.caregiverQualities,
            Constants.PlacementFormData.caregiverQualities,
            Constants.PlacementFormData.comment,
            testInfo.project.name
        );

        await placementJob.validateJobCreatedModal();
        await placementJob.closeJobCreatedModal();

        await page.waitForTimeout(5000);
        await placementJob.changeStatus("Closed");

        await dashboard.logoutFromAccount();

        const candidateEmail = Constants.USERS.existingCandidate.USERNAME;
        const candidatePassword = Constants.USERS.existingCandidate.PASSWORD;

        await login.userLoginAfterLogOut(loginPath, candidateEmail, candidatePassword);
        await dashboard.clickOnYesButton();

        await placementJob.goToAvailableJobs();
        await placementJob.validateJobIsNotVisible(randString);

        await login.userLoginAfterLogOut(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await expect(page).toHaveURL(/.*agent-dashboard/);
        await dashboard.navigateToDashboardsSection(dashboardSection);
    });
});