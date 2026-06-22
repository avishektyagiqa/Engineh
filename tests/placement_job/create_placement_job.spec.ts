import { expect, test } from "../../utils/support/tests";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import { Constants } from "../../utils/constants";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import ShiftJobHelpers from "../../pages/dashboard/shift_job/shift_job_helpers";
import PlacementJobHelpers from "../../pages/dashboard/placement_job/placement_job_helpers";

test.describe("Placement Job section", () => {
    const WAIT_AFTER_LOGIN_MS = 10_000;
    const formData = Constants.PlacementFormData;

    let dashboard: DashboardHelpers;
    let shiftJob: ShiftJobHelpers;
    let placementJob: PlacementJobHelpers;
    let jobTitle: string;

    const getDashboardSection = (projectName: string): string => {
        const isProd = projectName.includes("production") || projectName.includes("dev");
        return isProd ? "Placements" : "Placement Jobs";
    };

    test.beforeEach(async ({ page }, testInfo) => {
        const login = new LoginPage(page);
        dashboard = new DashboardHelpers(page);
        shiftJob = new ShiftJobHelpers(page);
        placementJob = new PlacementJobHelpers(page);

        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);

        const randString = Constants.randStr();
        jobTitle = `${formData.jobTitle}${randString}`;

        await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await expect(page).toHaveURL(/.*agent-dashboard/);
        await dashboard.clickOnYesButton();

        await page.waitForTimeout(WAIT_AFTER_LOGIN_MS);
        await shiftJob.clickOnYesButton();

        const dashboardSection = getDashboardSection(testInfo.project.name);
        await dashboard.navigateToDashboardsSection(dashboardSection);

        //Assert that placement job page loads successfully - if not - throw Error
        await dashboard.waitForSpinnerToDisappear();
        await dashboard.checkPageIsBlank();
    });

    test.afterEach(async ({}, testInfo) => {
        if (testInfo.status === "skipped") return;

        await placementJob.clickOnDeleteIcon();
        await placementJob.clickOnDeleteButton();
        await placementJob.validateDeletedJobIsNotDisplayed(jobTitle);
    });

    test("[test-036] Add new placement job and delete", async ({}, testInfo) => {
        await placementJob.createNewPlacementJob(
            formData.email,
            formData.clientIndex,
            jobTitle,
            formData.address,
            formData.city,
            formData.country,
            formData.state,
            formData.zip,
            formData.compensation,
            formData.startDate,
            formData.children,
            formData.schedule,
            formData.caregiverQualities,
            formData.caregiverQualities,
            formData.comment,
            testInfo.project.name
        );

        await placementJob.validateJobCreatedModal();
        await placementJob.closeJobCreatedModal();

        await placementJob.searchPlacementJob(jobTitle);
        await placementJob.validateCreatedJobTitle(formData.jobTitle);
        await placementJob.validateAddress(formData.address);
        await placementJob.validateState(formData.state);
        await placementJob.validateZip(formData.zip);
        await placementJob.validateCompensation(formData.compensation);
        await placementJob.validateSchedule(formData.schedule);
        await placementJob.validateStartDate(formData.startDate);
        await placementJob.validateChildren(formData.children);
        await placementJob.validateCountry(formData.country);
    });
});