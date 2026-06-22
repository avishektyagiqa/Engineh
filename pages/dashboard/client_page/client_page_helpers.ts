import BasePage from "../../../base/base_page";
import {expect, Page, test} from "@playwright/test";
import {ClientPageLocators} from "./client_page_locators";
import {CandidatesPageLocators} from "../candidates_page/candidates_page_locators";
import DashboardHelpers from "../dashboard_helpers";
import {InterviewLocators} from "../interview_section/interview_locators";
import {ShiftJobLocators} from "../shift_job/shift_job_locators";
import {
  ApplicationAndProfileBuilderLocators
} from "../../application_and_profile_builder/application_and_profile_builder_locators";


export default class ClientPage extends BasePage {
  constructor(public page: Page) {
    super(page);
  }

  clientEmail = "testuser@enginehire.ca";

  async clickOnAddClientButton(){
    await this.clickOnElement(ClientPageLocators.addClientButton)
  }

  async fillAddCandidateEmail(email: string) {
    await this.fillInputField(ClientPageLocators.emailInputField, email)
  }

  async fillPhoneNumber(phone: any){
    await this.fillInputField(ClientPageLocators.phoneNumberInputField, phone)
  }

  async fillFirstName(firstName: string){
    await this.fillInputField(ClientPageLocators.firstNameInputField, firstName);
  }

  async fillLastName(lastName: string){
    await this.fillInputField(ClientPageLocators.lastNameInputField, lastName);
  }

  async clickOnAddButton(){
    await this.clickOnElement(ClientPageLocators.addButton);
  }

  async clickOnDontSendButton() {
    const button = this.page.locator(ClientPageLocators.dontSendButton);

    try {
      await button.scrollIntoViewIfNeeded();
      await button.waitFor({ state: 'visible', timeout: 5000 });

      // Try clicking normally
      await button.click();
    } catch (error) {
      console.warn("Normal click failed, trying force click...");

      // Try force click if normal click didn't work
      if (await button.isVisible()) {
        await button.click({ force: true });
      } else {
        console.error("Don't Send button not visible even for force click.");
      }
    }
  }

  async clickOnDeleteClientButton(){
    await this.clickOnElement(ClientPageLocators.deleteClientButton);
  }

  async clickOnDeleteButton(){
    await this.clickOnElement(CandidatesPageLocators.deleteButton);

  }

  async createNewClient(
      userName: string,
      phone: any,
      firstName: string,
      lastName: string,
      projectName: string
  ) {
    await this.clickOnAddClientButton();

    await this.fillAddCandidateEmail(userName);
    await this.fillPhoneNumber(phone);
    await this.fillFirstName(firstName);
    await this.fillLastName(lastName);

    const isProd =
        projectName.includes('production') ||
        projectName.includes('dev');

      await this.selectProfileBuilder('Client Registrations');


    await this.clickOnAddButton();

    if (isProd) {
      await this.clickOnDontSendButton();
    } else {
      await this.page.waitForTimeout(500);
    }
  }


  async addAdminNote(clientName: string, note: string){
    const dashboard = new DashboardHelpers(this.page);
    await this.searchClientByName(clientName);
    await this.page.reload();
    await dashboard.clearAllSearchFilters();
    await this.clickOnAddAdminNotesButton();
    await this.fillInputField(ClientPageLocators.noteTextField, note);
    await this.clickOnElement(CandidatesPageLocators.modalAddNoteButton);
    await this.page.waitForTimeout(5000);
  }

  async clickOnCloseButton(){
    await this.clickOnElement(ClientPageLocators.adminModalCloseButton)
  }

  async closeNotesModal(){
    await this.clickOnElement(ClientPageLocators.notesModalCancelButton)
  }

  async deleteClientFromClientTable(){
    const clientCheckbox = this.page.locator(ClientPageLocators.selectClientCheckbox).first();
    await this.page.waitForTimeout(1000);
    await clientCheckbox.scrollIntoViewIfNeeded();
    await clientCheckbox.click();
    await this.clickOnElement(ClientPageLocators.deleteSelectedButton);
    await this.clickOnElement(ClientPageLocators.confirmDelete);
  }

  async deleteClient() {
    await this.clickOnDeleteClientButton();
    await this.clickOnDeleteButton();
  }

  async searchClientByName(name: string){
    await this.fillInputField(CandidatesPageLocators.searchField, name);
  }

  async validateCreatedClientIsVisible(email: string) {
    const candidateRow = this.page.locator(ClientPageLocators.clientTable).filter({ hasText: email });
    await this.page.waitForTimeout(1000);
    await expect(candidateRow).toBeVisible();
  }

  async validateDeletedClientIsNotVisible(email: string) {
    await this.searchClientByName(email);

    const candidateRow = this.page.locator(ClientPageLocators.clientTable).filter({ hasText: email });
    await this.page.waitForTimeout(1000); // optional wait for results to settle
    await expect(candidateRow).toHaveCount(0);
  }

  async clickOnAddAdminNotesButton(){
    await this.clickOnElement(ClientPageLocators.addAdminNotesButton)
  }

  async clickOnSchemaIcon(){
    await this.clickOnElement(ClientPageLocators.schemaIcon)
  }

  async validateAddedNote(note: string, userName: string){
    const dashboard = new DashboardHelpers(this.page);
    await this.searchClientByName(userName);
    await dashboard.clearAllSearchFilters();

    await this.clickOnAddAdminNotesButton();
    const addedNoteModal = this.page.locator(
      ClientPageLocators.addedNoteModal,
    );
    await expect(addedNoteModal).toBeVisible();
    await expect(addedNoteModal).toContainText(note);
  }

  async selectProfileBuilder(valueToSelect: string) {
    const placeholderSelector = '[data-test-id="multi-select-with-label-application_form"]';
    const suggestionSelector = `//span[contains(text(),"${valueToSelect}")]`;

    const placeholder = this.page.locator(placeholderSelector).first(); // last() to get Profile Builder, not Location
    const suggestion = this.page.locator(suggestionSelector).first();

    await placeholder.waitFor({ state: 'visible', timeout: 5000 });
    await placeholder.click();


    await this.page.keyboard.type(valueToSelect, { delay: 50 });

    await suggestion.waitFor({ state: 'visible', timeout: 5000 });
    await suggestion.click();

    await this.page.mouse.click(0, 0);
  }
   async goToClientTabOnMobile(){
    await this.page.locator(ClientPageLocators.clientTableMobile).click();
   }
   async searchForClient(clientEmail:string){
    await this.page.locator(ClientPageLocators.searchClientField).fill(clientEmail);
   }
  async clickOnClientPage() {
    await this.page.locator(ClientPageLocators.clientPage).nth(1).click();
  }
  async validateAdminProfileMoreSectionsVisibleForClient() {
      const adminViewButton = this.page.locator(ClientPageLocators.adminView);
      const profileViewButton = this.page.locator(ClientPageLocators.profileView);
      const moreSection = this.page.locator(ClientPageLocators.moreSection);
      await expect(adminViewButton).toBeVisible();
      await expect(profileViewButton).toBeVisible();
      await expect(moreSection).toBeVisible();
  }
  async goToProfileView() {
    await this.clickOnElement(ClientPageLocators.profileView);
  }
  async validateUploadDocumentButton() {
    const addPhotoButton = this.page.locator('(//i[contains(text(), "upload_file")])[2]')
        .or(this.page.locator('(//button[contains(text(),"Upload Admin Only Document")])[1]'));
    await expect(addPhotoButton).toBeVisible();
  }
  async switchClientView() {
    const view2Tab = this.page.locator('(//span[@class="mylisting-chip--container"])[2]');
    await view2Tab.click();
  }
  async validateViewIsChangedAndSaved() {
    const view2Tab = this.page.locator('(//span[@class="mylisting-chip--container"])[2]');
    await expect(view2Tab).toBeVisible();
    await expect(view2Tab).toContainText('View 2');

    const clientViewResult = this.page.locator(ClientPageLocators.clientPageView2Table);
    await expect(clientViewResult).toBeVisible();
    await expect(clientViewResult).toContainText('test12@yopmail.com');
  }
  async selectTemplate(template: string) {
    const selector = this.page.locator('[class="add-item-container mb-2 col-lg-6"]');
    const input = this.page.getByPlaceholder('Select template to add');
    const option = this.page.locator('//span[contains(text(),"W-9 {Just for testing}")]');

    // Scroll to the input
    await selector.click();
    await input.fill('W-9');
    await option.click();
  }

  async openStatusDropdownForFirstResult() {
    // const firstRow = this.page.locator('[data-test-id="data-table-row"]').first();
    const trigger = this.page.locator(ClientPageLocators.statusDropdownTrigger);
    await trigger.click();
  }

  async validateStatusDropdownVisibleAndScrollable() {
    const dropdownContent = this.page.locator(ClientPageLocators.statusDropdownContent);
    await expect(dropdownContent).toBeVisible();
    const isScrollable = await dropdownContent.evaluate(
        (el) => el.scrollHeight > el.clientHeight || getComputedStyle(el).overflowY !== 'hidden'
    );
    expect(isScrollable).toBe(true);
  }

  async selectStatusAndValidate() {
    const option = this.page
        .locator(ClientPageLocators.statusDropdownOptions)
        .filter({ hasText: "Active" })
        .first();
    await expect(option).toBeVisible({ timeout: 5000 });
    await option.click();

    await this.clickOnElement(ClientPageLocators.acceptModalButton);
    await this.waitForSpinnerToDisappear();
  }

  async validateClientStatusInRow(clientName: string) {
    await this.searchForClient(clientName)
    const row = this.page
        .locator('[data-test-id="data-table-row"]')
        .filter({ hasText: clientName })
        .first();
    const statusCell = row.locator('[data-test-id="-Status"]');
    await expect(statusCell).toContainText("Active");
  }

  async waitForSpinnerToDisappear(timeout = 120000): Promise<void> {
    await this.page.locator('#svg-spinner').waitFor({ state: 'hidden', timeout });
  }

  async addSecondaryLoginForClient(randString: string, secondEmail:string) {
    const menuBarSecondaryPassword = this.page.locator(ClientPageLocators.menuBarPasswordsTab);
    await menuBarSecondaryPassword.click();

    const addLoginButton = this.page.locator(ClientPageLocators.addSecondaryLogin);
    await addLoginButton.click();

    const secondaryName = this.page.locator(ClientPageLocators.fieldSecondaryName);
    await secondaryName.click();
    await secondaryName.fill(randString);
    const secondaryEmail = this.page.locator(ClientPageLocators.fieldSecondaryEmail);
    await secondaryEmail.click();
    await secondaryEmail.fill(secondEmail);
    const secondaryPassword = this.page.locator(ClientPageLocators.fieldSecondaryPassword);
    await secondaryPassword.click();
    await secondaryPassword.fill(secondEmail);

    await this.clickOnElement(ClientPageLocators.submitButton);
  }

  async verifySecondaryLoginAdded() {
    const addedLogin = this.page.locator('//li//span[contains(text(), "Secondary User — secondary_user12@yopmail.com")]');
    await expect(addedLogin).toBeVisible();
    await expect(addedLogin).toContainText('Secondary User — secondary_user12@yopmail.com');

    await this.clickOnCloseButton();
  }

  async deleteSecondaryLogin() {
    const menuBarSecondaryPassword = this.page.locator(ClientPageLocators.menuBarPasswordsTab);
    await menuBarSecondaryPassword.click();

    const addedLogin = this.page.locator('//span[contains(text(), "Secondary User — secondary_user12@yopmail.com")]');
    await this.clickOnElement(ClientPageLocators.deleteSecondaryLoginButton);
    await this.clickOnElement(ClientPageLocators.acceptModalButton);

    await expect(addedLogin).not.toBeVisible();
    await expect(addedLogin).toHaveCount(0);
  }

  async openSearchAndFilterTools() {
    await this.clickOnElement(ClientPageLocators.searchAndFilterTool);
  }

  async filterByStatusInSearchAndFilterTool(statusName: string) {
    const filterDropdown = this.page.locator('[class="multiselect mb-2 w-100"]').first();
    const optionsList = this.page.locator('[id="listbox-null"]').first();
    const option = optionsList.locator(`//span[contains(text(), "${statusName}")]`)
    await expect(filterDropdown).toBeVisible()
    await filterDropdown.click();
    await option.click();

    await this.page.waitForTimeout(15000)
  }

  async deleteAllClientsWithStatusInTable(statusName: string) {
    //assert that table filtered by status
    const statusTag = this.page.locator('.multiselect__tag', {
      hasText: statusName,
    });

    if (!(await statusTag.isVisible().catch(() => false))) {
      console.log(`Status filter "${statusName}" is not applied. Skipping delete.`);
      return;
    }

    await expect(statusTag).toBeVisible();
    await expect(statusTag).toContainText(statusName);

    const rows = this.page.locator('table tbody tr');
    const rowCount = await rows.count();

    if (rowCount === 0) {
      console.log(`No candidates found with status "${statusName}". Skipping delete.`);
      return;
    }

    for (let i = 0; i < rowCount; i++) {
      await expect(rows.nth(i)).toContainText(statusName);
    }

    const checkbox = this.page.locator(ShiftJobLocators.allJobsCheckboxInTable);
    await checkbox.check();

    const deleteButton = this.page.locator(ShiftJobLocators.deleteSelectedButton);
    await deleteButton.waitFor({ state: 'visible', timeout: 5000 });
    await deleteButton.click();

    const confirmButton = this.page.locator(ShiftJobLocators.confirmDelete);
    await confirmButton.waitFor({ state: 'visible', timeout: 5000 });
    await confirmButton.click();
  }

  async navigateToContactInfoSection() {
    const infoSection = this.page.locator(`[id="client-client-dashboard-Contact Info"]`);
    await infoSection.scrollIntoViewIfNeeded();
    await expect(infoSection).toBeVisible();
  }

  async editContactInfoSection(randString: string) {
    const firstNameInput = this.page.locator('input[data-test-id="text-box-with-label-billing_first_name"]');
    await firstNameInput.waitFor({ state: 'visible' });
    await firstNameInput.waitFor({ state: 'attached' });
    await firstNameInput.fill(randString);
    await expect(firstNameInput).toHaveValue(randString);

    const lastNameInput = this.page.locator('[data-test-id="text-box-with-label-billing_last_name"] input');
    await lastNameInput.waitFor({ state: 'visible' });
    await lastNameInput.waitFor({ state: 'attached' });
    await lastNameInput.fill(randString);
    await expect(lastNameInput).toHaveValue(randString);

    const saveButton = this.page.locator(ClientPageLocators.saveButton);
    await saveButton.nth(1).click();
  }

  async editContactInfoFields(randString: string) {
    const editButton =  this.page.locator(ClientPageLocators.editProfileSection);
    await editButton.nth(0).click();

    const firstName = this.page.locator('input[data-test-id="text-box-with-label-first_name"]');
    const lastName = this.page.locator('input[data-test-id="text-box-with-label-last_name"]');

    await firstName.click();
    await firstName.fill(randString);
    await expect(firstName).toHaveValue(randString);

    await lastName.click({force: true});
    await lastName.fill(randString);
    await expect(lastName).toHaveValue(randString);

    const saveButton = this.page.locator(ClientPageLocators.saveButton);
    await saveButton.first().click();

    await this.page.waitForTimeout(15000)
  }

  async validateDataAfterEditIsUpdatedProd(randString: string) {
    await this.clickOnElement(ClientPageLocators.editProfileSection);
    const firstName = this.page.locator('input[data-test-id="text-box-with-label-first_name"]');
    await expect(firstName).toHaveValue(randString);

    const lastName = this.page.locator('input[data-test-id="text-box-with-label-last_name"]');
    await expect(lastName).toHaveValue(randString);
  }

  async validateDataAfterEditIsUpdatedStg(randString: string) {
    const firstNameInput = this.page.locator('input[data-test-id="text-box-with-label-billing_first_name"]');
    await firstNameInput.waitFor({ state: 'visible' });
    await firstNameInput.waitFor({ state: 'attached' });
    await expect(firstNameInput).toHaveValue(randString);

    const lastNameInput = this.page.locator('[data-test-id="text-box-with-label-billing_last_name"] input');
    await lastNameInput.waitFor({ state: 'visible' });
    await lastNameInput.waitFor({ state: 'attached' });
  }
}