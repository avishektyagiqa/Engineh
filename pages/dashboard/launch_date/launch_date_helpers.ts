import {launchDateLocators} from './launch_date_locators'
import BasePage from "../../../base/base_page";
import {expect, Page} from "@playwright/test";


export class launchDateHelpers extends BasePage{
    constructor(public page: Page) {
        super(page);
    }

    async clickOnLaunchDate(){
        await this.page.locator(launchDateLocators.launchDateSection).click();
    }

    async selectDate(launchDate:string, projectName?: string) {
        const input = this.page.getByPlaceholder("YYYY-MM-DD");
        await input.click()
        await input.fill(launchDate)
        await this.page.keyboard.press("Enter");
        await this.page.locator(launchDateLocators.completedStepButton).nth(0).click();
    }

    async validateLaunchDateText() {
        await this.page.locator(launchDateLocators.addButton).click();
        await this.page.locator(launchDateLocators.scheduledDateText).isVisible();
        await this.page.locator(launchDateLocators.resetChecklistButton).click();
        await this.page.locator(launchDateLocators.confirmReset).click();
        const element = this.page.locator(launchDateLocators.scheduledDateText);
        await expect(element).not.toBeVisible();
    }
}