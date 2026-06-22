import { test } from "../../utils/support/tests";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import { Constants } from "../../utils/constants";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import PlacementJobHelpers from "../../pages/dashboard/placement_job/placement_job_helpers";

test.use({
    permissions: ["geolocation"],
    geolocation: { latitude: 40.7128, longitude: -74.006 },
});

test.describe("Placement Job section", () => {
    test("[test-038] Validate the board is visible on candidate's profile (Bug 33637891895)", async ({ page }, testInfo) => {
        const login = new LoginPage(page);
        const placementJob = new PlacementJobHelpers(page);
        const candidateEmail = Constants.USERS.existingCandidate.USERNAME;
        const candidatePassword = Constants.USERS.existingCandidate.PASSWORD;
        const dashboard = new DashboardHelpers(page);
        const { loginPath } = Constants.getLoginConfig(testInfo.project.name);

        await login.userLogin(loginPath, candidateEmail, candidatePassword);
        await dashboard.clickOnYesButton();

        await placementJob.goToAvailableJobs();
        await placementJob.validateJobIsVisible("Nanny for Infant");
    });
});