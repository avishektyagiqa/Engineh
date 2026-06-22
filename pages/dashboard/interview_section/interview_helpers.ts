import BasePage from "../../../base/base_page";
import {expect, Page } from "@playwright/test";
import {InterviewLocators} from "./interview_locators";
import DashboardHelpers from "../dashboard_helpers";


export default class InterviewHelpers extends BasePage {
    dashboard: DashboardHelpers;
    constructor(public page: Page) {
        super(page);
        this.dashboard = new DashboardHelpers(page);
    }

    async clickCandidateTab() {
        await this.dashboard.waitForSpinnerToDisappear();
        await this.clickOnElement(InterviewLocators.candidateTable);
    }
    async searchForCandidatePage(candidateEmail:string) {
        await this.dashboard.waitForSpinnerToDisappear();
        await this.fillInputField(InterviewLocators.searchCandidate, candidateEmail);
    }
    async clickOnCandidatePage() {
        await this.dashboard.waitForSpinnerToDisappear();
        await this.page.locator(InterviewLocators.candidate).nth(0).click();
    }
    async clickOnMoreTab() {
        await this.dashboard.waitForSpinnerToDisappear();
        await this.page.waitForTimeout(7000)
        const moreTab = this.page.locator('[data-test-id="menu-bar-more"]');
        await expect(moreTab).toBeVisible();
        await moreTab.hover();
        await this.page.locator(InterviewLocators.interviewSection).click();
    }
    async typeInTextBoxUsingFill(): Promise<string> {
        const box = this.page.locator(InterviewLocators.textBox).first();
        await this.dashboard.waitForSpinnerToDisappear();
        for (let i = 0; i < 10; i++) {
            const currentText = await box.innerText();
            await box.fill(currentText + 'test');
            await this.page.waitForTimeout(500);
        }
        return await box.innerText();
    }
    async validateText(expectedText:string) {
        const text = await this.page.locator(InterviewLocators.textBox).first().innerText();
        expect(text).toMatch(expectedText);
    }
}