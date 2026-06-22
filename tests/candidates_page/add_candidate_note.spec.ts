import { test } from "../../utils/support/tests";
import CandidatesPage from "../../pages/dashboard/candidates_page/candidiates_page_helpers";
import { Constants } from "../../utils/constants";
import LoginPage from "../../pages/Login_page/login_page_helpers";
import DashboardHelpers from "../../pages/dashboard/dashboard_helpers";
import ClientPage from "../../pages/dashboard/client_page/client_page_helpers";

test.describe("Candidate section", () => {
  test.beforeEach(async ({ page }, testInfo) => {
    const login = new LoginPage(page);
    const dashboard = new DashboardHelpers(page);
    const { loginPath, credentials } = Constants.getLoginConfig(testInfo.project.name);

    await login.userLogin(loginPath, credentials.USERNAME, credentials.PASSWORD);
    await dashboard.clickOnYesButton();
    await dashboard.navigateToCandidateSection();
  });

  test("[test-004] Add Candidate note", async ({ page }, testInfo) => {
    const candidatePage = new CandidatesPage(page);
    const note = Constants.randStr();
    const phoneNumber = Constants.generateRandomPhoneNumber();
    const randStr = Constants.randStr();

    await candidatePage.createNewCandidate(
        randStr + Constants.USERS.testEmail.USERNAME,
        phoneNumber,
        Constants.USERS.testEmail.FIRSTNAME,
        Constants.USERS.testEmail.LASTNAME,
        testInfo.project.name
    );

    await candidatePage.addNoteForCandidate(note);
    await candidatePage.deleteCandidate();
  });

  test("[test-005] Delete admin note {candidate}", async ({ page }, testInfo) => {
    const candidatePage = new CandidatesPage(page);
    const note = Constants.randStr();
    const phoneNumber = Constants.generateRandomPhoneNumber();
    const randStr = Constants.randStr();

    await candidatePage.createNewCandidate(
        randStr + Constants.USERS.testEmail.USERNAME,
        phoneNumber,
        Constants.USERS.testEmail.FIRSTNAME,
        Constants.USERS.testEmail.LASTNAME,
        testInfo.project.name
    );

    await candidatePage.addNoteForCandidate(note);
    await candidatePage.deleteNote(note);
    await candidatePage.validateDeletedNoteIsNotVisible(note);
    await candidatePage.deleteCandidate();
  });

  test("[test-006] Add admin note {Candidate}", async ({ page }, testInfo) => {
    const candidatePage = new CandidatesPage(page);
    const clientPage = new ClientPage(page);
    const uniqueString = Constants.randStr();
    const note = Constants.randStr();
    const phoneNumber = Constants.generateRandomPhoneNumber();

    const email = uniqueString + Constants.USERS.testEmail.USERNAME;

    await candidatePage.createNewCandidate(
        email,
        phoneNumber,
        Constants.USERS.testEmail.FIRSTNAME,
        Constants.USERS.testEmail.LASTNAME,
        testInfo.project.name
    );

    await page.waitForTimeout(5000);
    await candidatePage.clickOnCloseButton();
    await page.reload();
    await clientPage.addAdminNote(email, note);
    await clientPage.validateAddedNote(note, email);
    await clientPage.closeNotesModal();
    await candidatePage.deleteCandidateFromTheTable();
  });
});
