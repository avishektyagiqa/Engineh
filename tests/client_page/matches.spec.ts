import { test } from "@playwright/test";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import ClientPage from "../../pages/dashboard/client_page/client_page_helpers";
import MatchesPage from "../../pages/dashboard/matches_page/matches_page_helpers";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import { Constants } from "../../utils/constants";

test.describe("Client Matches", () => {

    test.skip(({ baseURL }) => !baseURL?.includes('enginehire.io'), 'This test is for production only');

    test("[test-071] add and delete candidate match", async ({ page }, testInfo) => {

        test.skip(
            !testInfo.project.name.includes('production'),
            'This test is for production only'
        );

        const login = new LoginPage(page);
        const clientPage = new ClientPage(page);
        const matchesPage = new MatchesPage(page);
        const dashboard = new DashboardHelpers(page);

        await login.userLogin(
            "/login/858",
            Constants.USERS.prodAutomationUser.USERNAME,
            Constants.USERS.prodAutomationUser.PASSWORD
        );

        // Dismiss any optional dialogs after login
        await dashboard.clickOnYesButton();

        // Navigate to Clients via dashboard nav
        await dashboard.navigateToDashboardsSection("Clients");

        await clientPage.searchForClient(
            "test advamce do not delete"
        );

        await clientPage.clickOnClientPage("test advamce do not delete");

        await matchesPage.addMatchWithStatus(
            "testcandidate@gmail.com",
            "Potential Fit"
        );

        await matchesPage.validateMatchAdded(
            "test candidate"
        );

        await matchesPage.deleteMatch();

        await matchesPage.validateMatchDeleted(
            "test candidate"
        );
    });

    test("[test-077] schedule candidate interview from my candidates", async ({ page }, testInfo) => {

        test.skip(
            !testInfo.project.name.includes('production'),
            'This test is for production only'
        );

        const login = new LoginPage(page);
        const clientPage = new ClientPage(page);
        const matchesPage = new MatchesPage(page);
        const dashboard = new DashboardHelpers(page);

        await login.userLogin(
            "/login/858",
            Constants.USERS.prodAutomationUser.USERNAME,
            Constants.USERS.prodAutomationUser.PASSWORD
        );

        // Dismiss any optional dialogs after login
        await dashboard.clickOnYesButton();

        // Navigate to Clients via dashboard nav
        await dashboard.navigateToDashboardsSection("Clients");

        await clientPage.searchForClient(
            "test advamce do not delete"
        );

        await clientPage.clickOnClientPage("test advamce do not delete");

        await matchesPage.addMatchWithStatus(
            "testcandidate@gmail.com",
            "Interview Process"
        );

        await matchesPage.deleteMatchFromAdminDashboard();

        await matchesPage.validateMatchDeleted(
            "test candidate"
        );
    });

    test("[test-078] add and delete candidate match with status Not Interested After Interview", async ({ page }, testInfo) => {

        test.skip(
            !testInfo.project.name.includes('production'),
            'This test is for production only'
        );

        const login = new LoginPage(page);
        const clientPage = new ClientPage(page);
        const matchesPage = new MatchesPage(page);
        const dashboard = new DashboardHelpers(page);

        await login.userLogin(
            "/login/858",
            Constants.USERS.prodAutomationUser.USERNAME,
            Constants.USERS.prodAutomationUser.PASSWORD
        );

        // Dismiss any optional dialogs after login
        await dashboard.clickOnYesButton();

        // Navigate to Clients via dashboard nav
        await dashboard.navigateToDashboardsSection("Clients");

        await clientPage.searchForClient(
            "test advamce do not delete"
        );

        await clientPage.clickOnClientPage("test advamce do not delete");

        await matchesPage.addMatchWithStatus(
            "testcandidate@gmail.com",
            "Not Interested After Interview"
        );

        await matchesPage.deleteMatchFromAdminDashboard();

        await matchesPage.validateMatchDeleted(
            "test candidate"
        );
    });

    test("[test-082] bulk add and delete candidate match", async ({ page }, testInfo) => {

        test.skip(
            !testInfo.project.name.includes('production'),
            'This test is for production only'
        );

        const login = new LoginPage(page);
        const clientPage = new ClientPage(page);
        const matchesPage = new MatchesPage(page);
        const dashboard = new DashboardHelpers(page);

        await login.userLogin(
            "/login/858",
            Constants.USERS.prodAutomationUser.USERNAME,
            Constants.USERS.prodAutomationUser.PASSWORD
        );

        // Dismiss any optional dialogs after login
        await dashboard.clickOnYesButton();

        // Navigate to Clients via dashboard nav
        await dashboard.navigateToDashboardsSection("Clients");

        await clientPage.searchForClient(
            "test advamce do not delete"
        );

        await clientPage.clickOnClientPage("test advamce do not delete");

        // Navigate to matches tab
        await matchesPage.clickOnAdminTab();
        await matchesPage.clickOnMatchesTab();
        await matchesPage.waitForOverlayToDisappear();

        // Add first candidate: "Automation test Please do not"
        await matchesPage.addMatchWithoutNavigation(
            "test",
            "Potential Fit",
            "Automation test Please do not"
        );

        // Add second candidate: "test candidate -"
        await matchesPage.addMatchWithoutNavigation(
            "test",
            "Potential Fit",
            "test candidate -"
        );

        // Validate both matches are added
        await matchesPage.validateMatchAdded("Automation test Please do not");
        await matchesPage.validateMatchAdded("test candidate");

        // Bulk Delete the first 2 candidates
        await matchesPage.deleteBulkMatches(2);

        // Validate both matches are deleted
        await matchesPage.validateMatchDeleted("Automation test Please do not");
        await matchesPage.validateMatchDeleted("test candidate");
    });

    test("[test-084] add and delete candidate matches with different statuses", async ({ page }, testInfo) => {

        test.skip(
            !testInfo.project.name.includes('production'),
            'This test is for production only'
        );

        const login = new LoginPage(page);
        const clientPage = new ClientPage(page);
        const matchesPage = new MatchesPage(page);
        const dashboard = new DashboardHelpers(page);

        await login.userLogin(
            "/login/858",
            Constants.USERS.prodAutomationUser.USERNAME,
            Constants.USERS.prodAutomationUser.PASSWORD
        );

        // Dismiss any optional dialogs after login
        await dashboard.clickOnYesButton();

        // Navigate to Clients via dashboard nav
        await dashboard.navigateToDashboardsSection("Clients");

        await clientPage.searchForClient(
            "test advamce do not delete"
        );

        await clientPage.clickOnClientPage("test advamce do not delete");

        // Navigate to matches tab
        await matchesPage.clickOnAdminTab();
        await matchesPage.clickOnMatchesTab();
        await matchesPage.waitForOverlayToDisappear();

        // 1. Add "test candidate" with "Hired" status
        await matchesPage.addMatchWithoutNavigation(
            "test",
            "Hired",
            "test candidate -"
        );
        await matchesPage.validateMatchAdded("test candidate");
        await matchesPage.deleteMatch();
        await matchesPage.validateMatchDeleted("test candidate");

        // 2. Add "test candidate" with "Declined" status
        await matchesPage.addMatchWithoutNavigation(
            "test",
            "Declined",
            "test candidate -"
        );
        await matchesPage.validateMatchAdded("test candidate");
        await matchesPage.deleteMatch();
        await matchesPage.validateMatchDeleted("test candidate");

        // 3. Add "test candidate" with "Hired - On Holiday" status
        await matchesPage.addMatchWithoutNavigation(
            "test",
            "Hired - On Holiday",
            "test candidate -"
        );
        await matchesPage.validateMatchAdded("test candidate");
        await matchesPage.deleteMatch();
        await matchesPage.validateMatchDeleted("test candidate");

        // 4. Add "test candidate" with "Not Interested After Trial" status
        await matchesPage.addMatchWithoutNavigation(
            "test",
            "Not Interested After Trial",
            "test candidate -"
        );
        await matchesPage.validateMatchAdded("test candidate");
        await matchesPage.deleteMatch();
        await matchesPage.validateMatchDeleted("test candidate");

        // 5. Add "test candidate" with "Offer Extended" status
        await matchesPage.addMatchWithoutNavigation(
            "test ",
            "Offer Extended",
            "test candidate - testcandidate@gmail.com"
        );
        await matchesPage.validateMatchAdded("test candidate");
        await matchesPage.deleteMatch();
        await matchesPage.validateMatchDeleted("test candidate");
    });

    test("[test-085] Adding note for the candidate from the matches section", async ({ page }, testInfo) => {

        test.skip(
            !testInfo.project.name.includes('production'),
            'This test is for production only'
        );

        const login = new LoginPage(page);
        const clientPage = new ClientPage(page);
        const matchesPage = new MatchesPage(page);
        const dashboard = new DashboardHelpers(page);

        await login.userLogin(
            "/login/858",
            Constants.USERS.prodAutomationUser.USERNAME,
            Constants.USERS.prodAutomationUser.PASSWORD
        );

        // Dismiss any optional dialogs after login
        await dashboard.clickOnYesButton();

        // Navigate to Clients via dashboard nav
        await dashboard.navigateToDashboardsSection("Clients");

        await clientPage.searchForClient(
            "test advamce do not delete"
        );

        await clientPage.clickOnClientPage("test advamce do not delete");

        // Navigate to matches tab
        await matchesPage.clickOnAdminTab();
        await matchesPage.clickOnMatchesTab();
        await matchesPage.waitForOverlayToDisappear();

        // Add candidate: "test candidate - testcandidate@gmail.com" with status "Hired"
        await matchesPage.addMatchWithoutNavigation(
            "test",
            "Hired",
            "test candidate - testcandidate@gmail.com"
        );

        await matchesPage.validateMatchAdded("test candidate");

        // Add Note
        await matchesPage.addCandidateNote("test123");

        // View Note
        await matchesPage.viewCandidateNote("test123");

        // Delete Match
        await matchesPage.deleteMatch();

        // Validate Match Deleted
        await matchesPage.validateMatchDeleted("test candidate");
    });

});