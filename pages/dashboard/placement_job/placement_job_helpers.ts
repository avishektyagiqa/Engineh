import {expect, Page} from "@playwright/test";
import BasePage from "../../../base/base_page";
import {PlacementJobLocators} from "./placement_job_locators";
import ShiftJobHelpers from "../shift_job/shift_job_helpers";

export default class PlacementJobHelpers extends BasePage {
    constructor(public page: Page) {
        super(page);
    }

    async clickOnPostJobButton(){
        await this.clickOnElement(PlacementJobLocators.postJobButton);
    }

    async fillTitle(title: string) {
        await this.page.waitForTimeout(5000)
        const titleField = this.page.locator(PlacementJobLocators.titleInputField);

        await titleField.scrollIntoViewIfNeeded();
        await this.fillInputField(PlacementJobLocators.titleInputField, title);
    }

    async fillAddress(address: string){
        await this.fillInputField(PlacementJobLocators.addressInputField, address);
    }

    async fillCity(city: string){
        await this.fillInputField(PlacementJobLocators.cityInputField, city);
    }

    async fillCountry(country: string){
        await this.fillInputField(PlacementJobLocators.countryInputFiled, country);

    }

    async fillState(state: string){
        await this.fillInputField(PlacementJobLocators.stateInputField, state);
    }

    async fillZipCode(zipCode: number, projectName: string) {
        await this.fillInputField(
            PlacementJobLocators.zipCodeInputField,
            zipCode.toString()
        );
    }

    async fillCompensation(compensation: string){
        await this.fillInputField(PlacementJobLocators.compensationInputField, compensation);
    }

    async fillStartDate(startDate: string){
        await this.fillInputField(PlacementJobLocators.startDateInputField, startDate);
    }

    async fillChildrenField(children: string){
        await this.fillInputField(PlacementJobLocators.childrenField, children);
    }

    async fillScheduleField(schedule: string){
        await this.fillInputField(PlacementJobLocators.scheduleField, schedule);
    }

    async fillCaregiverQualitiesField(caregiverQualities: string){
        await this.fillInputField(PlacementJobLocators.caregiverQualitiesField, caregiverQualities);

    }

    async fillDailyTasks(tasks:string){
        await this.fillInputField(PlacementJobLocators.dailyTasksField,tasks);
    }

    async fillFamilyComments(comment: string){
        await this.fillInputField(PlacementJobLocators.familyCommentsField, comment);
    }

    // async fillPostCode(postCode: string) {
    //     const selector = `${PlacementJobLocators.placementJobInputFieldsProd} >> nth=5`;
    //     await this.fillInputField(selector, postCode);
    // }

    async checkBabyCareCheckbox(){
        await this.page.locator(PlacementJobLocators.babyCareCheckbox).check();

    }

    async clickOnPostButton(){
        await this.clickOnElement(PlacementJobLocators.postButton);
    }

    async clickOnSearchIcon(){
        await this.clickOnElement(PlacementJobLocators.placementJobSearchIcon);
    }

    async clickOnSearchToggle() {
        await this.clickOnElement(PlacementJobLocators.searchToggle);
    }

    async clickOnCloseButton(){
        await this.clickOnElement(PlacementJobLocators.closeButton);
    }

    async closeJobCreatedModal(){
        await this.clickOnCloseButton();
    }

    async createNewPlacementJob(
        email: string,
        clientIndex: number,
        title: string,
        address: string,
        city: string,
        country: string,
        state: string,
        zip: number,
        compensation: string,
        startDate: string,
        children: string,
        schedule: string,
        caregiverQualities: string,
        tasks: string,
        comment: string,
        projectName: string
    ) {
        const shiftJob = new ShiftJobHelpers(this.page);
        await this.clickOnPostJobButton();

        const env = (projectName ?? "").toLowerCase();
        const isStagingOrLocal =
            env.includes("staging") ||
            env.includes("localhost") ||
            env.includes("local");

        if (isStagingOrLocal) {
            await shiftJob.selectFamilies(email);
        } else {
            await shiftJob.selectFamilies(email);
        }

        await this.fillTitle(title);
        await this.fillAddress(address);
        await this.fillCity(city);
        await this.fillCountry(country);
        await this.fillState(state);
        await this.fillZipCode(zip, projectName);
        // await this.selectJobCategories('Full Time', 3)
        await this.fillCompensation(compensation);
        await this.fillStartDate(startDate);
        await this.fillChildrenField(children);
        await this.fillScheduleField(schedule);
        // await this.fillCaregiverQualitiesField(caregiverQualities);

        // Only run this in staging
        const isProd = projectName.includes('production') || projectName.includes('dev')
        if (!isProd) {
            await this.fillDailyTasks(tasks);
            await this.fillFamilyComments(comment);
            await this.checkBabyCareCheckbox();
        }

        if(isProd){
            await this.selectLocation();
        }
        await this.clickOnPostButton();
    }


    async clickOnDeleteIcon(){
        const placementJobDeleteIcon = this.page.locator('(//i[contains(text(), "delete")])[2]');

        await expect(async () => {
            await expect(placementJobDeleteIcon).toBeVisible();
            await expect(placementJobDeleteIcon).toBeEnabled();
            await placementJobDeleteIcon.click();
        }).toPass();
        // await placementJobDeleteIcon.scrollIntoViewIfNeeded()
        // await placementJobDeleteIcon.isEnabled()
        // await placementJobDeleteIcon.click();
        //await this.clickOnElement(PlacementJobLocators.placementJobDeleteIcon);
    }

    async clickOnAddNoteIcon(){
        const addNoteIcon = this.page.locator(PlacementJobLocators.addNoteIcon).first();
        await addNoteIcon.click();
    }

    async clickOnDeleteNoteIcon(){
        const deleteNoteIcon = this.page.locator(PlacementJobLocators.deleteNoteIcon).first();
        await deleteNoteIcon.waitFor({state: 'attached'});
        await deleteNoteIcon.scrollIntoViewIfNeeded();
        await deleteNoteIcon.waitFor({state: 'visible'});
        //await this.clickOnElement(PlacementJobLocators.deleteNoteIcon);
        await deleteNoteIcon.click();
    }

    async clickOnDeleteButton(){
        await this.clickOnElement(PlacementJobLocators.placementJobDeleteButton);
    }

    async addNoteForPlacementJob(placementJobTitle: string, note: string){
        await this.searchPlacementJob(placementJobTitle);
        await this.page.keyboard.press("Enter");
        await this.clickOnAddNoteIcon();
        await this.fillInputField(PlacementJobLocators.noteInputBox, note);
        await this.clickOnElement(PlacementJobLocators.addNoteButton);
        await this.page.waitForTimeout(5000);
    }

    async deleteNote(){
        await this.clickOnDeleteNoteIcon();
        await this.clickOnDeleteButton();
    }

    async deletePlacementJob(jobTitle: string){
        await this.searchPlacementJob(jobTitle);
        await this.clickOnDeleteIcon();
        await this.clickOnDeleteButton();
    }

    async deletePlacementAllJobsWithTitle(title: string) {
        await this.searchPlacementJob(title);

        const getJobPosters = () => this.page.locator('[class="job-item-container mt-1"]');

        let count = await getJobPosters().count();
        console.log(`Matched jobs with this title: ${count}`);

        while (count > 0) {
            await this.clickOnDeleteIcon();
            await this.clickOnDeleteButton();

            try {
                await getJobPosters().first().waitFor({ state: 'detached', timeout: 10000 }).catch(() => {});
                count = await getJobPosters().count();
            } catch {
                // Page may have navigated or context closed after last deletion
                count = 0;
            }
        }

        try {
            await expect(getJobPosters()).toHaveCount(0);
        } catch {
            // Already navigated away — considered clean
        }

        console.log(`Matched jobs with this title: ${count}`);
    }

    async searchPlacementJob(jobTitle: string): Promise<void> {
        await this.clickOnSearchToggle()
        await this.fillInputField(PlacementJobLocators.placementJobSearchBar, jobTitle);
        await this.page.keyboard.press('Enter');
    }


    async selectLocation() {
        await this.page.locator(PlacementJobLocators.locationField).nth(2).click()
        await this.page.locator(PlacementJobLocators.chooseLocation).click();
    }

    // async selectJobCategories (jobCategories: string, index: number) {
    //     const selector = `(//*[@id="multiselect-select-field"])[${index}]`;
    //     const input = this.page.locator(selector);
    //
    //     await input.scrollIntoViewIfNeeded();
    //
    //     const elementHandle = await input.elementHandle();
    //     if (elementHandle) {
    //         await elementHandle.evaluate((el, value) => {
    //             el.focus();
    //             el.dispatchEvent(new Event('click', { bubbles: true }));
    //             el.dispatchEvent(new Event('focus', { bubbles: true }));
    //             (el as HTMLInputElement).value = value;
    //             el.dispatchEvent(new Event('input', { bubbles: true }));
    //         }, jobCategories);
    //     } else {
    //         throw new Error('Could not find input field');
    //     }
    //
    //     const suggestion = this.page.locator(`//span[contains(text(),"${jobCategories}")]`);
    //     await suggestion.click();
    // }

    async validateJobCreatedModal(){
        const jobCreatedModal = this.page.locator('[data-test-id="result-dialog-title"]');
        await jobCreatedModal.waitFor({state: 'visible'});
        await expect(jobCreatedModal).toHaveText('Job created!');
        // await expect(
        //     this.page.locator('[data-test-id="result-dialog-title"]')
        // ).toHaveText('Job created!');
    }

    async validateCreatedJobTitle(title: string) {
        const locator = PlacementJobLocators.createdJobTitle(title);
        await this.validateElementIsDisplayed(locator);
    }

    async validateDeletedJobIsNotDisplayed(jobTitle: string) {
        const placementJobLocator = PlacementJobLocators.createdJobTitle(jobTitle);
        const locator = this.page.locator(placementJobLocator);

        await expect(locator).not.toBeVisible();
    }

    async validateAddedNoteIsVisible(note: string){
        await this.validateElementIsVisibleWithText(PlacementJobLocators.noteContent, note);
    }

    async validateDeletedNoteIsNotVisible(note: string){
        await this. validateElementWithTextIsNotVisible(PlacementJobLocators.noteContentText, note)
    }
    async validateAddress(expectedText: string) {
        const addressText = await this.page.locator(PlacementJobLocators.checkAddress).nth(0).innerText();
        expect(addressText).toMatch(expectedText);
    }
    async validateState(expectedText: string) {
        const stateText = await this.page.locator(PlacementJobLocators.checkState).nth(0).innerText();
        expect(stateText).toMatch(expectedText);
    }
    async validateZip(expectedText: any) {
        const zipText = await this.page.locator(PlacementJobLocators.checkZipCode).nth(0).innerText();
        expect(expectedText.toString()).toMatch(zipText);
    }
    async validateCompensation(expectedText: string) {
        const compensationText = await this.page.locator(PlacementJobLocators.checkCompensation).nth(0).innerText();
        expect(compensationText).toMatch(expectedText);
    }
    async validateChildren(expectedText: string) {
        const childrenText = await this.page.locator(PlacementJobLocators.checkChildren).nth(0).innerText();
        expect(childrenText).toMatch(expectedText);
    }
    async validateSchedule(expectedText: string) {
        const scheduleText = await this.page.locator(PlacementJobLocators.checkSchedule).nth(0).innerText();
        expect(scheduleText).toMatch(expectedText)
    }
    async validateStartDate(expectedText: string) {
        const startDateText = await this.page.locator(PlacementJobLocators.checkStart).nth(0).innerText();
        expect(startDateText).toMatch(expectedText);
    }
    async validateCountry(expectedText: string) {
        const startDateText = await this.page.locator(PlacementJobLocators.checkCountry).nth(0).innerText();
        expect(startDateText).toMatch(expectedText);
    }
    async changeStatus(status:string) {
        await this.page.locator(PlacementJobLocators.jobStatus).nth(0).click();
        await this.page.locator(`(//span[contains(text(),"${status}")])[1]`).click();
        await this.page.waitForTimeout(3000);
        await this.page.reload()
    }
    async goToAvailableJobs() {
        await this.page.locator(PlacementJobLocators.availableJobsOnCandidateProfile).click();
    }
    async validateJobIsNotVisible(jobTitle: string) {
        const title = await this.page.locator(PlacementJobLocators.jobTitleOnCandidateProfile)
            .or(this.page.locator('.job--title'))
            .nth(0)
            .innerText();
        expect(title).not.toContain(jobTitle);
    }
    async validateJobIsVisible(jobTitle: string) {
        const title = await this.page.locator(PlacementJobLocators.jobTitleOnCandidateProfile)
            .or(this.page.locator('.job--title'))
            .nth(0)
            .innerText();
        expect(title).toContain(jobTitle);
    }
    async goToTableView() {
        await this.clickOnElement(PlacementJobLocators.switchToTableView);
    }
    async getPlacementJobByTitle() {
        const jobColumn = this.page
            .locator('[data-test-id="jobs-Title"]')
            .filter({ hasText: 'Nanny for Infant Twins' });

        await jobColumn.first().waitFor({ state: 'visible', timeout: 15000 });

        const jobTitle = (await jobColumn.first().innerText()).trim();
        if (!jobTitle) throw new Error("First job doesn't have a title.");

        await this.page.locator('#searchBar').fill(jobTitle);
        await this.page.keyboard.press('Enter');

        return jobTitle;
    }
    async validateSearchPlacementJobByTitle(jobTitle: string) {
        const search = this.page.locator(PlacementJobLocators.placementJobSearchBar);
        await search.fill(jobTitle);
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(3000);

        const result = this.page.locator('[data-test-id="jobs-Title"]');
        const count = await result.count();
        expect(count).toBeGreaterThanOrEqual(1);
    }
    async placementJobTableSettings() {
        const tableTitle = this.page.locator('[data-test-id="jobs-Title"]');
        await expect(tableTitle).toContainText("Title");

        await this.clickOnElement(PlacementJobLocators.placementJobTableGearIcon);
        await this.clickOnElement(PlacementJobLocators.labelsDropdown);
        const dropdown = this.page.locator('input[id="multiselect-select-field"]')
        await dropdown.fill('Title');

        const suggestion = this.page.locator('(//span[contains(text(), "Title")])[2]');
        await expect(suggestion).toBeVisible();
        await this.clickOnElement(PlacementJobLocators.closeEditButton);
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
    async newPlacementJobForAI(title:string,city:string,country:string,state:string) {
        await this.clickOnPostJobButton();
        await this.fillTitle(title);
        await this.fillCity(city);
        await this.fillCountry(country);
        await this.fillState(state);
        await this.clickOnPostButton();
        await this.validateJobCreatedModal();
        await this.closeJobCreatedModal();

        await this.searchPlacementJob(title);
        await this.validateCreatedJobTitle(title);
    }

    //async clearFiltersOnAvailableJobs() {
        //await this.page.locator(PlacementJobLocators.filterCleaningOnCandidateProfileAvailableJos).nth(1).click();
    // }
}
