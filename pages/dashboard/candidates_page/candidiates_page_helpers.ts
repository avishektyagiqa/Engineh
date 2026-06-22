import BasePage from "../../../base/base_page";
import {BrowserContext, expect, Page} from "@playwright/test";
import {CandidatesPageLocators} from "./candidates_page_locators";
import {ClientPageLocators} from "../client_page/client_page_locators";
import {Locator} from "playwright";
import {Browser} from "@playwright/test";

import {PlacementJobLocators} from "../placement_job/placement_job_locators";


export default class CandidatesPage extends BasePage {
    constructor(public page: Page) {
        super(page);
    }

    async clickOnAddCandidateButton(){
        await this.clickOnElement(CandidatesPageLocators.addNewCandidateButton);
    }

    async fillAddCandidateEmail(email: string) {
        await this.fillInputField(CandidatesPageLocators.emailInputField, email)
    }

    async fillPhoneNumber(phone: any){
        await this.fillInputField(CandidatesPageLocators.phoneNumberInputField, phone)
    }

    async fillFirstName(firstName: string){
        await this.fillInputField(CandidatesPageLocators.firstNameInputField, firstName);
    }

    async fillLastName(lastName: string){
        await this.fillInputField(CandidatesPageLocators.lastNameInputField, lastName);
    }

    async clickOnAddButton(){
        await this.clickOnModal();
        await this.clickOnElement(CandidatesPageLocators.addButton);
    }

    async clickOnModal(){
        await this.clickOnElement(CandidatesPageLocators.noteDialogModal);
    }

    async clickOnDontSendButton(){
        await this.clickOnElement(CandidatesPageLocators.dontSendButton);
    }

    async clickOnDeleteCandidateButton(){
        await this.clickOnElement(CandidatesPageLocators.deleteCandidateButton);
    }

    async clickOnDeleteButton(){
        await this.clickOnElement(CandidatesPageLocators.deleteButton);
    }

    async clickOnAdvancedSearchIcon(){
        await this.clickOnElement(CandidatesPageLocators.advancedSearchIcon);
    }

    async clickOnAdvancedSearchFormViewSection(){
        await this.clickOnElement(CandidatesPageLocators.advancedSearchFormViewSection);
    }

    async checkSpanishSpeakingCheckbox(){
        await this.clickOnElement(CandidatesPageLocators.spanishSpeakingCheckbox);
    }

    async clickOnAdvancedSearchButton(){
        const searchButton = this.page.locator(CandidatesPageLocators.advancedSearchButton).last();
        await expect(searchButton).toBeEnabled();
        await searchButton.click();
    }

    async closeTheModalWindow() {
        const closeButton = this.page.locator('i.close-button-tour-handle');
        await closeButton.waitFor({ state: 'visible' });

        // Bypass overlay by directly triggering the click in the DOM
        await closeButton.evaluate((el) => (el as HTMLElement).click());
    }

    async createNewCandidate(
        userName: string,
        phone: any,
        firstName: string,
        lastName: string,
        projectName: string,
        userType?: string
    ) {
        await this.page.waitForTimeout(10000);
        await this.clickOnAddCandidateButton();

        const isProd =
            projectName.includes('production') ||
            projectName.includes('dev');

        await this.selectProfileBuilderForCandidate('Candidate Application');


        await this.fillAddCandidateEmail(userName);
        await this.fillPhoneNumber(phone);
        await this.fillFirstName(firstName);
        await this.fillLastName(lastName);

        if (userType && !isProd) {
            await this.selectUserType(userType);
        }

        await this.clickOnAddButton();
    }


    async selectUserType(userType: string){
        const selector = this.page.locator(CandidatesPageLocators.userTypeDropdown).nth(2);
        const searchOptionsInput = this.page.locator('[id="multi-select-with-label-selector1"]');
        const suggestion = this.page.locator(`//span[contains(text(), "${userType}")]`).last();

        await selector.click();
        await searchOptionsInput.fill(userType);
        await suggestion.click();
    }

    async deleteCandidate() {
      await this.clickOnDeleteCandidateButton();
      await this.clickOnDeleteButton();
    }

    async searchCandidateByName(name: string){
      await this.fillInputField(CandidatesPageLocators.searchField, name)
    }

    async searchCandidateByEmail(email: string){
        // await this.fillInputField(CandidatesPageLocators.searchField, email)
        const searchField = this.page.locator(CandidatesPageLocators.searchField);
        const candidateRow = this.page.locator('table tbody tr', { hasText: email });

        for (let attempt = 1; attempt <= 5; attempt++) {
            console.log(`Search attempt ${attempt} for candidate: ${email}`);

            await searchField.fill('');
            await searchField.fill(email);

            await this.page.waitForLoadState('networkidle').catch(() => {});

            if (await candidateRow.isVisible({ timeout: 5000 }).catch(() => false)) {
                return;
            }

            await this.page.waitForTimeout(2000);
        }

        throw new Error(`Candidate was not found after search: ${email}`);
    }

    async verifyEmptyTableState(){
      const validationMessage = this.page.locator(
        CandidatesPageLocators.emptyTableText,
      );
      await expect(validationMessage).toBeVisible();
    }

    async clickOnNoteBar(){
      await this.clickOnElement(CandidatesPageLocators.noteButton)
    }

    async clickOnAddNoteButton(){
      await this.clickOnElement(CandidatesPageLocators.addNoteButton)
    }

    async clickOnAdminsToNotifyField(){
      await this.clickOnElement(CandidatesPageLocators.adminsToNotifyField)
    }

    async enterNoteIntoInputBox(note: any){
      await this.fillInputField(CandidatesPageLocators.noteInputBox, note)
    }

    async clickOnModalAddNoteButton(){
      await this.clickOnElement(CandidatesPageLocators.modalAddNoteButton)
    }

    async clickOnCloseButton(){
      await this.clickOnElement(CandidatesPageLocators.closeButton)
    }

    async selectCandidate(){
        await this.clickOnElement(CandidatesPageLocators.selectCandidateCheckbox);
    }

    async addNoteForCandidate(note: any){
      await this.clickOnNoteBar();
      await this.clickOnAddNoteButton();
      await this.enterNoteIntoInputBox(note);
      await this.clickOnModalAddNoteButton();
      // await this.clickOnCloseButton();
    }

    async addNoteForCandidateViaNotifyingAdmin(note: any){
      await this.clickOnNoteBar();
      await this.clickOnAddNoteButton();
      await this.enterNoteIntoInputBox(note);
      await this.page.locator(CandidatesPageLocators.adminsToNotifyField).scrollIntoViewIfNeeded();
      await this.clickOnAdminsToNotifyField();

      await this.page.waitForTimeout(5000);
      // await this.clickOnModalAddNoteButton();
      // await this.clickOnCloseButton();
    }

    async validateCandidateListCountInCandidateTable(count: number, email: string) {
      const rows = this.page.locator(CandidatesPageLocators.candidateList);
      await expect(rows.filter({hasText: email})).toHaveCount(count)
    }

    async validateCreatedCandidateIsVisible(email: string) {
      const candidateRow = this.page.locator(CandidatesPageLocators.candidateList).filter({ hasText: email });
      await expect(candidateRow).toBeVisible();
    }

    async openCandidateInfo(email: string){
      const candidateRow = this.page.locator(CandidatesPageLocators.candidateList).filter({ hasText: email });
      await candidateRow.click();
    }

    async clickOnDeleteSelectedButton(){
        await this.clickOnElement(CandidatesPageLocators.deleteSelectedButton);
    }

    async clickOnSchemaIcon(){
        await this.clickOnElement(CandidatesPageLocators.schemaIcon);
    }

    async deleteCandidateFromTheTable(){
        const checkbox = this.page.locator(CandidatesPageLocators.selectCandidateCheckbox).first();
        await checkbox.scrollIntoViewIfNeeded();
        await this.clickOnElement(CandidatesPageLocators.selectCandidateCheckbox);
        await this.clickOnDeleteSelectedButton();
        await this.clickOnDeleteButton();
    }

    async openNoteByClickingOnIt(note: string){
      await this.clickOnElement(CandidatesPageLocators.noteTextLocator(note));
    }

    async deleteNote(note: string){
        const noteContainer = this.page.locator(`//pre[contains(text(),"${note}")]`
            + `/ancestor::div[contains(@class,"note")]`
        );

        const count = await noteContainer.count();
        for (let i = 0; i < count; i++) {
            await noteContainer.first().locator('[data-action="delete"]').click();
        }
      // await this.openNoteByClickingOnIt(note);
      // await this.clickOnElement(CandidatesPageLocators.deleteNoteButton);
      // await this.clickOnElement(ClientPageLocators.confirmDelete);
    }

    async validateDeletedNoteIsNotVisible(note: string){
      //await this.validateElementIsNotDisplayed(CandidatesPageLocators.noteTextLocator(note));
        const selector = `//pre[contains(text(),"${note}")]`;
        const locator = this.page.locator(selector);


        const initialCount = await locator.count();
        console.log(`Notes with text "${note}" before validation: ${initialCount}`);

        await expect(locator).toHaveCount(0, { timeout: 20000 });
        return true;
    }

    async selectProfileBuilderForCandidate(valueToSelect: string) {
        const placeholderSelector = '//span[@class="multiselect__placeholder" and normalize-space(.)="Start typing to filter"]';
        const suggestionSelector = `//span[contains(text(),"${valueToSelect}")]`;

        const placeholder = this.page.locator(placeholderSelector).last(); // Profile Builder input
        const suggestion = this.page.locator(suggestionSelector).first();

        await placeholder.waitFor({ state: 'visible', timeout: 5000 });
        await placeholder.click();
        await this.page.keyboard.type(valueToSelect, { delay: 50 });
        await suggestion.waitFor({ state: 'visible', timeout: 5000 });
        await suggestion.click();
        await this.page.mouse.click(0, 0);
    }

    async verifyAllRowsHaveTypeSpanishSpeaking() {
        const rows = this.page.locator('[data-test-id="data-table-row"]');
        const rowCount = await rows.count();

        for (let i = 0; i < rowCount; i++) {
            const row = rows.nth(i);
            const typeText = await row.locator('span.badge.badge-pill.mx-1').innerText();
            expect(typeText.trim()).toBe("Spanish Speaking");
        }
    }

    async checkIfScrollable(containerLocator: Locator) {
        // Get the scrollHeight and clientHeight of the container
        const dims = await containerLocator.evaluate(el => ({
            scrollHeight: el.scrollHeight,
            clientHeight: el.clientHeight
        }));

        // Use expect to validate if the container is scrollable
        expect(dims.scrollHeight > dims.clientHeight).toBe(true); // This will be true if scrollable
        console.log('The container is scrollable');
    }
    async goToAdminView(){
        await this.clickOnElement(CandidatesPageLocators.adminView);
    }
    async goToProfileView() {
        await this.clickOnElement(CandidatesPageLocators.profileView);
    }
    async goToAvailableJobs() {
        await this.page.locator(PlacementJobLocators.availableJobsOnCandidateProfile).click();
    }
    async validateReferenceStatusIsVisible() {
        const refStatus = this.page.locator(CandidatesPageLocators.referenceStatus);
        expect(refStatus.isVisible());
    }
    async validateWarningIconIsVisible() {
        const warningIcon = this.page.locator(CandidatesPageLocators.warningIcon);
        expect(warningIcon.isVisible());
    }
    async validateReferenceStatusIsNotVisible() {
        const refStatus = this.page.locator(CandidatesPageLocators.referenceStatus);
        await expect(refStatus).not.toBeVisible();
    }
    async validateWarningIconIsNotVisible() {
        const warningIcon = this.page.locator(CandidatesPageLocators.warningIcon);
        await expect(warningIcon).not.toBeVisible();
    }
    async editContactInfo(name:string, projectName:any) {
        const isProd =
            projectName.includes('production') ||
            projectName.includes('dev');
        if (isProd) {
            await this.page.locator(CandidatesPageLocators.contactInfoEdit).nth(1).click();
            await this.page.locator(CandidatesPageLocators.contactEditNameField).nth(1).fill(name);
            await this.page.locator(CandidatesPageLocators.saveContactInfoSave).click();
        } else {
            await this.page.locator(CandidatesPageLocators.contactInfoEdit).nth(1).click();
            await this.page.locator(CandidatesPageLocators.contactEditNameField).nth(1).fill(name);
            await this.page.locator(CandidatesPageLocators.saveContactInfoSave).click();
        }
    }
    async validateContactInfoIsEdited(name:string) {
        const elementText = await this.page.locator('[class="detail-info"] span').nth(1).innerText();
        expect(elementText).toMatch(name);
    }
    async openFilterOnCandidateSection() {
        await this.page.locator(CandidatesPageLocators.filterButtonInCandidateSearch).nth(0).click();
    }
    async validateTheSearchInFilterIsVisible() {
        const searchField =  this.page.locator(CandidatesPageLocators.candidateKeywordSearch).nth(0);
        await expect(searchField).toBeVisible();
    }
    async validateResumeView() {
        const resume = this.page.locator(CandidatesPageLocators.resumeView)
            .or(this.page.locator('[class="p-2 no-print preview-in-dialog"]'));
        await this.page.locator(CandidatesPageLocators.resumeViewButton)
            .or(this.page.locator('button[class="mylisting-button dark-button btn-desktop-visible"]'))
            .nth(0).click();
        await expect(resume).toBeVisible();
    }
    async goToMyScheduleTabInProfile() {
        await this.page.locator(CandidatesPageLocators.myScheduleTab).isVisible();
        await this.page.locator(CandidatesPageLocators.myScheduleTab).click();
    }
    async clickOnRecurringAvailability() {
        await this.page.locator(CandidatesPageLocators.recurringAvailability).isVisible();
        await this.page.locator(CandidatesPageLocators.recurringAvailability).click();
    }
    async goRecurringAvailabilitySetting() {
        await this.page.locator(CandidatesPageLocators.recurringAvailabilitySetting).nth(0).isVisible();
        await this.page.locator(CandidatesPageLocators.recurringAvailabilitySetting).nth(0).click();
    }
    async validateMaxNumOfHoursIsVisible() {
        const maxNumHoursText = this.page.locator(CandidatesPageLocators.maximumNumOfHours);
        await expect(maxNumHoursText).toBeVisible();

    }
    async validateAdminProfileMoreSectionsVisibleForCandidate() {
        const adminViewButton = this.page.locator(ClientPageLocators.adminView);
        const profileViewButton = this.page.locator(CandidatesPageLocators.profileView);
        const moreSection = this.page.locator(ClientPageLocators.moreSection);
        await expect(adminViewButton).toBeVisible();
        await expect(profileViewButton).toBeVisible();
        await expect(moreSection).toBeVisible();
    }
    async validateAddPhotoVideoButton() {
        const addPhotoButton = this.page.locator('//button[contains(text()," Add Photo or Video ")]');
        await expect(addPhotoButton).toBeVisible();
    }
    async validateUploadDocumentButton() {
        const addPhotoButton = this.page.locator('(//i[contains(text(), "upload_file")])[2]')
            .or(this.page.locator('(//button[contains(text(),"Upload Admin Only Document")])[1]'));
        await expect(addPhotoButton).toBeVisible();
    }
    async validateAddedDocName() {
        const documentName = this.page.locator(CandidatesPageLocators.addedDocumentName);
        await expect(documentName).toBeVisible();
    }
    async openInIncognito(
        browser: Browser,
        url: string
    ): Promise<{ context: BrowserContext; page: Page }> {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(url);
        return { context, page };
    }
    async clickOnAiJobAnalysis() {
        const AIJobButton = this.page.locator(PlacementJobLocators.AIJobAnalysis).first();
        await AIJobButton.click();
    }

    async validateAIJobAnalysisWorkingCorrectly() {
        const toastNotification = this.page.getByText('AI Job Analysis completed. The jobs have now been re-ordered based on the analysis.');
        await expect(toastNotification).toBeVisible();

        const matchingJobs = this.page.locator('[class="ai-analysis-info mx-6 my-1"]', {hasText: 'Match Score:'}).first();
        await expect(matchingJobs).not.toContainText('Match Score: 0%');
        await expect(matchingJobs).toBeVisible();
    }

    async submitAIJobAnalysisFunctionality(email:string) {
        await this.searchCandidateByEmail(email);
        await this.openCandidateInfo(email);
        await this.goToProfileView();
        await this.goToAvailableJobs();
        await this.page.waitForTimeout(6000);
        await this.clickOnAiJobAnalysis();
        await this.validateAIJobAnalysisWorkingCorrectly();
        await this.clickOnCloseButton();
    }

    async changeSecondaryStatus(status: string) {
        const secondaryStatus = this.page.locator(CandidatesPageLocators.statusDropdown).nth(1);
        await expect(secondaryStatus).toBeVisible();
        await secondaryStatus.click();

        const section = this.page.locator('[class="card-standard panel--info-card variant-default padding-md"]').first();
        const option = section.locator(`//span[contains(text(), "${status}")]`);

        await option.click();
    }

    async openSearchAndFilterTools() {
        await this.clickOnElement(CandidatesPageLocators.searchAndFilterTool);
    }

    async filterBySecondStatusInSearchAndFilterTool(statusName: string) {
        const filterDropdown = this.page.locator('[class="multiselect mb-2 w-100"]').nth(2);
        const option = this.page.locator('ul[role="listbox"] li[role="option"]')
            .filter({hasText: statusName});
        await expect(filterDropdown).toBeVisible()
        await filterDropdown.click();
        await option.nth(0).click();

        await this.page.waitForTimeout(7000);
    }

    async validateStatusIsApplied() {
        const toastModal = this.page.locator('.toasted.success-toast');
        await expect(toastModal).toContainText(/Status updated\./i, {
            timeout: 20000,
        });
    }

    async deleteAllCandidatesWithStatusInTable(statusName: string) {
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
            console.log(`No candidates found with status "${statusName}".`);
            return;
        }

        for (let i = 0; i < rowCount; i++) {
            await expect(rows.nth(i)).toContainText(statusName);
        }

        await this.page.waitForLoadState('domcontentloaded');
        const checkbox = this.page.locator('table thead input[type="checkbox"]').last();

        await expect(checkbox).toBeVisible({ timeout: 30000 });
        await expect(checkbox).toBeEnabled({ timeout: 30000 });

        await checkbox.check();
        await expect(checkbox).toBeChecked();
        // const checkbox = this.page
        //     .locator('table thead input[type="checkbox"]')
        //     .nth(0);
        //
        // await expect(checkbox).toBeAttached({ timeout: 10000 });
        //
        // await checkbox.setChecked(true);
        //
        // await expect(checkbox).toBeChecked({ timeout: 10000 });

        const deleteButton = this.page.locator(CandidatesPageLocators.deleteSelectedButton);
        await deleteButton.waitFor({ state: 'visible', timeout: 5000 });
        await deleteButton.click();

        const confirmButton = this.page.locator(CandidatesPageLocators.confirmDelete);
        await confirmButton.waitFor({ state: 'visible', timeout: 5000 });
        await confirmButton.click();
    }
}