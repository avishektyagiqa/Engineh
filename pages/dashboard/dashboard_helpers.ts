import {expect, Page} from "@playwright/test";
import BasePage from "../../base/base_page";
import {DashboardLocators} from "./dashboard_locators";
import {ShiftJobLocators} from "./shift_job/shift_job_locators";

export default class DashboardHelpers extends BasePage {
    constructor(public page: Page) {
        super(page);
    }

    async checkPageIsBlank () {
        await this.page.waitForLoadState('domcontentloaded');

        const isBlank = await this.page.evaluate(() => {
            return !document.body || document.body.innerText.trim().length === 0;
        });

        if (isBlank) {
            throw new Error("Page is blank");
        } else {
            console.log('Page is fully loaded and visible');
        }
    }

    async selectSectionFromDashboard(sectionName: string){
        const dashboardSection = this.page.locator('.nav-link .nav-link-container .nav-link-label', {
            hasText: sectionName
        });

        await dashboardSection.first().click();
    }

    async navigateToCandidateSection(){
      await this.selectSectionFromDashboard('Candidates');
    }

    async navigateToDashboardsSection(section: string){
       await this.selectSectionFromDashboard(section);
    }

    async clickOnSearchIcon(){
        await this.clickOnElement(DashboardLocators.searchIcon);
    }

    async clickOnSearchIconCandidatePage() {
        await this.clickOnElement(DashboardLocators.searchIconCandidatePage);
    }

    async clickOnSchemaIcon(){
        await this.clickOnElement(DashboardLocators.schemaIcon);
    }

    async selectWorkflow(workflow: string){
        await this.clickOnElement(DashboardLocators.workflowButton(workflow));
    }

    async openMoreSection() {
        await this.hoverOverElement(DashboardLocators.moreSection);
    }

    async openCalculatorSection() {
        await this.clickOnElement(DashboardLocators.calculatorSection);
    }

    async openGlobalSettings(){
        await this.clickOnElement(DashboardLocators.globalSettingsButton);
    }
    async clickOnAllLogsButton(){
        await this.clickOnElement(DashboardLocators.allLogsButton);
    }
    async searchInGlobalSettings(settingName: string){
        await this.page.locator(DashboardLocators.searchInGlobalSettings).fill(settingName);
    }

    async clickOnApplicationAndProfileBuilder(){
        await this.clickOnElement(DashboardLocators.appAndProfileBuilder);
    }

    async validateProcessFlowTitleIsVisible(){
        await this.validateElementIsVisibleWithText(DashboardLocators.processFlowTitle,"Process Flow");
    }

    async verifyEmptyTableState(){
        const validationMessage = this.page.locator(
            DashboardLocators.emptyTableText,
        );
        await expect(validationMessage).toBeVisible();
    }

    async clearAllSearchFilters() {

        const clearButtons = this.page.locator(DashboardLocators.filterClearButton);
        const count = await clearButtons.count();

        for (let i = 0; i < count; i++) {
            const button = clearButtons.nth(i);

            // Check if the button is visible before clicking
            const isVisible = await button.isVisible();
            if (isVisible) {
                await button.scrollIntoViewIfNeeded();
                await button.click({force: true});
            }
        }
    }

    async clickOnYesButton() {
        const yesButton = await this.page.$(ShiftJobLocators.yesButton);
        if (yesButton && await yesButton.isVisible()) {
            await yesButton.click();
        }
        // else: do nothing
    }

    async clickOnProfileSection() {
        await this.clickOnElement(DashboardLocators.profileSection);
    }

    async selectTemplate(template: string) {
        const selector = '//span[contains(text(),"Select template to add")]';
        const input = this.page.locator(selector).nth(0);
        const option = this.page.locator('//span[contains(text(),"W-4")]').nth(0);

        // Scroll to the input
        await input.click();
        await option.click();
    }

    async clickAddDocTemplateButton() {
        await this.clickOnElement(DashboardLocators.addDocumentTemplateButton)
    }

    async clickDeleteDocumentTemplateButton() {
        const deleteTemplate = this.page.locator('.material-symbols-outlined', {hasText: "delete"});
        await deleteTemplate.last().click();
        await this.clickOnElement(DashboardLocators.confirmDeleteTemplateButton);
    }

    async clickDontSendButton(){
        await this.clickOnElement(DashboardLocators.dontSendButton);
    }

    async clickSignButton() {
        await this.clickOnElement(DashboardLocators.signButton);
    }

    async clickOnDashboardDropdownForMobile(){
        await this.page.locator(DashboardLocators.dashboardDropdownMobile).nth(1).click();
    }

    async validateCloseButtonIsVisible(){
        const closeButton = this.page.locator(DashboardLocators.closeButton).last();
        await closeButton.waitFor({state: 'attached'})
        await expect(closeButton).toBeVisible();
        await closeButton.click();
    }

    async waitForSpinnerToDisappear(timeout = 120000): Promise<void> {
        await this.page.locator('#svg-spinner').waitFor({ state: 'hidden', timeout });
    }

    async closeProfile() {
        await this.page.locator(DashboardLocators.closeButton).first().click();
    }

    async logoutFromAccount() {
        await this.hoverOverElement(DashboardLocators.moreSection)
        //await this.page.locator(DashboardLocators.moreSection).hover({force: true});
        await this.page.waitForTimeout(1000);
        const logoutButton = this.page.locator(DashboardLocators.logoutButton);
        await logoutButton.waitFor({state: "attached"});
        await logoutButton.click();
        //await this.page.locator(DashboardLocators.logoutButton).click();
    }

    async clickOnCloseButton() {
        const closeModalButton = this.page.locator('[data-test-id="modal-dialog-close-button"]');
        await closeModalButton.click({force: true});
        await this.clickOnElement(DashboardLocators.closeButton);
    }
}

