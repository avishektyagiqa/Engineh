import {expect, test} from "../../utils/support/tests";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import {Constants} from "../../utils/constants";
import PlacementJobHelpers from "../../pages/dashboard/placement_job/placement_job_helpers";
import CandidatesPage from "../../pages/dashboard/candidates_page/candidiates_page_helpers";

test.describe.skip("Placement Job section", () => {
    test.beforeEach(async ({page}, testInfo) => {
        const login = new LoginPage(page);
        const dashboard = new DashboardHelpers(page);
        const {loginPath, credentials} = Constants.getLoginConfig(testInfo.project.name);

        await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await expect(page).toHaveURL(/.*agent-dashboard/);
        await dashboard.clickOnYesButton();
    });

    test.use({
        permissions: ['geolocation'],
        geolocation: { latitude: 40.7128, longitude: -74.0060 },
    });

    const getDashboardSection = (projectName: string): string => {
        const isProd = projectName.includes("production") || projectName.includes("dev");
        return isProd ? "Placements" : "Placement Jobs";
    };

    test("[test-058] AI: Analyse placement jobs for a candidate", async ({page}, testInfo) => {
        const dashboard = new DashboardHelpers(page);
        const placementJob = new PlacementJobHelpers(page);
        const candidatePage = new CandidatesPage(page);
        const email = 'testcandidate@enginehire.ca';
        const title = 'Job For Testing DO NOT DELETE'
        const city ='New York';
        const country = 'USA';
        const state = 'Brooklyn';
        const dashboardSection = getDashboardSection(testInfo.project.name);

        await dashboard.navigateToDashboardsSection(dashboardSection);
        await dashboard.waitForSpinnerToDisappear();

        await placementJob.newPlacementJobForAI(
            title,
            city,
            country,
            state
        );

        await dashboard.navigateToCandidateSection();
        await candidatePage.submitAIJobAnalysisFunctionality(email);

        await dashboard.navigateToDashboardsSection(dashboardSection);
        await dashboard.waitForSpinnerToDisappear();
        await placementJob.deletePlacementAllJobsWithTitle(title);
        await placementJob.validateDeletedJobIsNotDisplayed(title);
    });
});
