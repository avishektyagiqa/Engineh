import BasePage from "../../base/base_page";
import {BurdenCalculatorLocators} from "./burden_calculator_locators";
import {expect, Page} from "@playwright/test";
import {Constants} from "../../utils/constants";

export default class BurdenCalculatorHelpers extends BasePage  {
    constructor(public page: Page) {
        super(page);
    }

    async clickOnGearIcon() {
        await this.clickOnElement(BurdenCalculatorLocators.gearIcon);
    }

    async changeCalculatorName() {
        const randString = Constants.randStr();
        await this.clickOnElement(BurdenCalculatorLocators.calculatorNameSection);
        const nameField = this.page.locator(BurdenCalculatorLocators.calculatorNameField);
        await nameField.fill('Calculator for testing ' + randString);
        await this.clickOnElement(BurdenCalculatorLocators.modalCancelButton);
        await this.page.reload();
        const title = this.page.locator(BurdenCalculatorLocators.calcTitle);
        await expect(title).toHaveText('Calculator for testing ' + randString);
    }

    async addNewSections() {
        const randNumber = Constants.rand(0, 6);
        const randString = Constants.randStr();
        await this.clickOnElement(BurdenCalculatorLocators.addSectionButton);

        const addField = this.page.locator('button[class="add-button"]', {hasText: "+ Add Field"});
        const fieldValue = this.page.locator(BurdenCalculatorLocators.fieldValue);

        await addField.click();
        await fieldValue.click();
        await fieldValue.fill(randNumber.toString());

        const addSubtractField  = this.page.locator('button[class="add-button"]', {hasText: "+ Subtract Field"});
        const subtractValue = this.page.locator('[placeholder="Value"]').nth(1);

        await addSubtractField.click();
        await subtractValue.click();
        await subtractValue.fill(randNumber.toString());

        const addMultiplier = this.page.locator('button[class="add-button multiply-btn"]', {hasText: "× Add Multiplier"});
        const multiplierValue = this.page.locator(BurdenCalculatorLocators.multiplyFieldsName);

        await addMultiplier.click();
        await multiplierValue.click();
        await multiplierValue.fill(randString);

    }

    async submitCreateNewTemplate() {
        const randNumber = Constants.rand(1,7);
        const randString = Constants.randStr();

        await this.changeCalculatorName();
        const billRate =  this.page.locator(BurdenCalculatorLocators.billRate);
        await billRate.click();
        await billRate.fill(String(randNumber));

        const staffPay = this.page.locator(BurdenCalculatorLocators.staffPay);
        await staffPay.click();
        await staffPay.fill(randNumber.toString());

        const gsaSection = this.page.locator(BurdenCalculatorLocators.GsaRate);
        await gsaSection.click();
        await gsaSection.fill(randNumber.toString());

        await this.addNewSections();
        await this.clickOnElement(BurdenCalculatorLocators.calculateSaveTemplateButton);
        const templateName = this.page.locator(BurdenCalculatorLocators.templateName);
        await templateName.click();
        await templateName.fill('Test Template ' + randString);

        await this.clickOnElement(BurdenCalculatorLocators.saveTemplateButton);
    }

    async deleteNewlyCreatedTemplate() {
        const templateDropdown = this.page.locator(BurdenCalculatorLocators.selectTemplateDropdown);
        await templateDropdown.click();

        await this.page.keyboard.press('ArrowDown');
        await this.page.keyboard.press('Enter');

        const deleteTemplate = this.page.locator(BurdenCalculatorLocators.deleteTemplate);
        this.page.once('dialog', async dialog => {
            console.log(dialog.message());
            await dialog.accept();
        });
        await deleteTemplate.click();

        await templateDropdown.click();
        await expect(templateDropdown).toHaveCount(1);
    }


}