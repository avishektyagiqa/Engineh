import { test, expect } from "../../utils/support/tests";
import CandidatesPage from "../../pages/dashboard/candidates_page/candidiates_page_helpers";
import {CandidatesPageLocators} from "../../pages/dashboard/candidates_page/candidates_page_locators";
import { Constants } from "../../utils/constants";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";

test.describe("Candidate page section", () => {
    test.beforeEach(async ({ page }, testInfo) => {
        const login = new LoginPage(page);
        const dashboard = new DashboardHelpers(page);
        const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);

        await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
        await dashboard.clickOnYesButton();
    });

    test("[test-054] Validate shared candidate profile page is accessible. Bug ID:41758136836", async ({ page, browser }) => {
        const dashboard = new DashboardHelpers(page);
        const candidatesPage = new CandidatesPage(page);
        const email = "testcandidate@gmail.com";

        await dashboard.navigateToCandidateSection();
        await candidatesPage.searchCandidateByEmail(email);

        const candidateList = page.locator(CandidatesPageLocators.candidateEmailLocator);
        await candidateList.click();
        await candidatesPage.goToProfileView();

        const { context: incognitoContext, page: incognitoPage } =
            await candidatesPage.openInIncognito(browser, Constants.candidatePageUrl);

        await expect(incognitoPage).toHaveURL(Constants.candidatePageUrl);

        await incognitoContext.close();
        await dashboard.checkPageIsBlank();
    });
});