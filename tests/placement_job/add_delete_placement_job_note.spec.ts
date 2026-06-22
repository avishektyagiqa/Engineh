import { test } from "../../utils/support/tests";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import { Constants } from "../../utils/constants";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import PlacementJobHelpers from "../../pages/dashboard/placement_job/placement_job_helpers";

test.describe("Placement Job section, add note", () => {
    const NOTE_TEXT = "test";

    let randString: string;
    let jobTitle: string;

    let placementJob: PlacementJobHelpers;
    let dashboard: DashboardHelpers;

    const getFutureDateISO = (daysAhead: number): string => {
        const date = new Date();
        date.setDate(date.getDate() + daysAhead);
        return date.toISOString().slice(0, 10); // YYYY-MM-DD
    };

    const getSectionName = (projectName: string): string => {
        const isProd = projectName.includes("production") || projectName.includes("dev");
        return isProd ? "Placements" : "Placement Jobs";
    };

    test.beforeEach(async ({ page }, testInfo) => {
        const login = new LoginPage(page);
        dashboard = new DashboardHelpers(page);
        placementJob = new PlacementJobHelpers(page);

        randString = Constants.randStr();
        jobTitle = `${Constants.PlacementFormData.jobTitle}${randString}`;

        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);

        await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await page.waitForTimeout(3000);
        await dashboard.clickOnYesButton();

        const sectionName = getSectionName(testInfo.project.name);
        await dashboard.navigateToDashboardsSection(sectionName);

        const startDateISO = getFutureDateISO(7);

        await placementJob.createNewPlacementJob(
            Constants.PlacementFormData.email,
            Constants.PlacementFormData.clientIndex,
            jobTitle,
            Constants.PlacementFormData.address,
            Constants.PlacementFormData.city,
            Constants.PlacementFormData.country,
            Constants.PlacementFormData.state,
            Constants.PlacementFormData.zip,
            Constants.PlacementFormData.compensation,
            startDateISO,
            Constants.PlacementFormData.children,
            Constants.PlacementFormData.schedule,
            Constants.PlacementFormData.caregiverQualities,
            Constants.PlacementFormData.caregiverQualities,
            Constants.PlacementFormData.comment,
            testInfo.project.name
        );

        await page.waitForTimeout(5000);
        await placementJob.validateJobCreatedModal();
        await placementJob.closeJobCreatedModal();
        await page.waitForTimeout(5000);
    });

    test("[test-034] Add note for placement job", async () => {
        await placementJob.addNoteForPlacementJob(jobTitle, NOTE_TEXT);
        await placementJob.validateAddedNoteIsVisible(NOTE_TEXT);
    });

    test("[test-035] Delete added note", async () => {
        await placementJob.addNoteForPlacementJob(jobTitle, NOTE_TEXT);
        await placementJob.deleteNote();
        await placementJob.validateDeletedNoteIsNotVisible(NOTE_TEXT);
    });

    test.afterEach(async ({}, testInfo) => {
        if (testInfo.status === "skipped") return;

        await placementJob.clickOnDeleteIcon();
        await placementJob.clickOnDeleteButton();
    });
});