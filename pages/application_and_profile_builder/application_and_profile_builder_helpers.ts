import BasePage from "../../base/base_page";
import {expect, Page} from "@playwright/test";
import {ApplicationAndProfileBuilderLocators} from "./application_and_profile_builder_locators";
import {Constants} from "../../utils/constants";
import { Browser, BrowserContext } from "@playwright/test";

export default class ApplicationAndProfileBuilderPage extends BasePage {
    constructor(public page: Page) {
        super(page);
    }

    async clickOnAddButton(){
        await this.clickOnElement(ApplicationAndProfileBuilderLocators.addButton);
    }

    async fillNameField(fillText: String){
        const nameField = this.page.locator(ApplicationAndProfileBuilderLocators.nameField).first();
        await nameField.fill(`${fillText}`);
    }

    async clickOnApplicationRadioButton(){
        await this.clickOnElement(ApplicationAndProfileBuilderLocators.applicationRadioButton);
    }

    async clickOnCandidateRadioButton(){
        await this.clickOnElement(ApplicationAndProfileBuilderLocators.candidateRadioButton);
    }

    async clickOnAddFieldButton(){
        await this.clickOnElement(ApplicationAndProfileBuilderLocators.addFieldButton);
    }

    async typeQuestion(question: string){
        const textField = this.page.locator(ApplicationAndProfileBuilderLocators.questionField).first();
        await textField.fill(question);
    }

    async chooseFieldType() {
        const fieldType = this.page.locator('[data-test-id="multiselect-field-type0"]');
        const fieldOption = this.page.locator('//span[contains(text(), "Textarea")]');

        await expect(fieldType).toBeVisible();
        await fieldType.click();

        await expect(fieldOption).toBeVisible();
        await fieldOption.click();
    }
    async clickSubmit() {
        await this.page.locator(ApplicationAndProfileBuilderLocators.clickSubmit).click()
    }

    async clickEditName() {
        await this.page.locator(ApplicationAndProfileBuilderLocators.editName).click();
    }
    async validateTheBuilderIsCreated(fillText: String) {
        await this.page.locator(ApplicationAndProfileBuilderLocators.builderNameSearchBox).fill(`${fillText}`);
        await this.page.waitForTimeout(2000);
        const textLocator = await this.page.locator(ApplicationAndProfileBuilderLocators.nameTest).innerText();
        expect(textLocator.toUpperCase()).toMatch(fillText.toUpperCase())
    }
    async delBuilder(fillText: String) {
        await this.page.reload()
        await this.page.locator(ApplicationAndProfileBuilderLocators.builderNameSearchBox).fill(`${fillText}`);
        await this.page.locator(ApplicationAndProfileBuilderLocators.delBuilder).nth(1).click()
        await this.page.locator(ApplicationAndProfileBuilderLocators.delButton).click()
    }

    async searchBuilderName(fillText: String) {
        await this.page.locator(ApplicationAndProfileBuilderLocators.builderNameSearchBox).fill(`${fillText}`);
    }

    async fillApplicationFormStaging() {
        const randString = Constants.randStr();
        const randPhone = Constants.generateRandomPhoneNumber();
        const randEmail = Constants.generateRandomEmail();

        const context = this.page.context();
        const [formPage] = await Promise.all([
            context.waitForEvent("page"),
            this.page.locator('[data-test-id="view-application-form"]').click(),
        ]);

        await formPage.bringToFront();
        await expect(formPage).toHaveURL(/application-form/i, { timeout: 30000 });
        await formPage.waitForLoadState("domcontentloaded");

        await formPage
            .locator("#svg-spinner")
            .waitFor({ state: "hidden", timeout: 15000 })
            .catch(() => {});

        const firstNameInput = formPage.locator(
            '[data-test-id="text-box-with-label-first_name"] input');
        await expect(firstNameInput).toBeVisible({ timeout: 30000 });

        const lastNameInput = formPage.locator(
            '[data-test-id="text-box-with-label-last_name"] input');
        await expect(lastNameInput).toBeVisible({ timeout: 30000 });

        const locationsChecklist = formPage.locator('[data-test-id="checkbox-group-locations"]');
        await expect(locationsChecklist).toBeVisible({ timeout: 30000 });

        const locationCheckbox = formPage.locator(ApplicationAndProfileBuilderLocators.locationCheckbox);
        await locationCheckbox.check();
        await expect(locationCheckbox).toBeChecked();

        await firstNameInput.fill(randString);
        await expect(firstNameInput).toHaveValue(randString);

        await lastNameInput.fill(randString);
        await expect(lastNameInput).toHaveValue(randString);

        const phoneInput = formPage.locator('[data-test-id="text-box-with-label-phone"] input');
        await expect(phoneInput).toBeVisible({ timeout: 30000 });
        await phoneInput.fill(randPhone);
        await expect(phoneInput).toHaveValue(randPhone);

        const emailInput = formPage.locator('[data-test-id="text-box-with-label-email"] input');
        if ((await emailInput.count()) === 0) {

            const emailFallback = formPage.locator(ApplicationAndProfileBuilderLocators.emailClientFormStg).first();
            await expect(emailFallback).toBeVisible({ timeout: 30000 });
            await emailFallback.fill(randEmail);
            await expect(emailFallback).toHaveValue(randEmail);
        } else {
            await expect(emailInput).toBeVisible({ timeout: 30000 });
            await emailInput.fill(randEmail);
            await expect(emailInput).toHaveValue(randEmail);
        }

        const addressInput = formPage.locator('[data-test-id="text-box-with-label-address1"] input');
        await expect(addressInput).toBeVisible({ timeout: 30000 });
        await addressInput.fill(randString);
        await expect(addressInput).toHaveValue(randString);

        const cityInput = formPage.locator('[data-test-id="text-box-with-label-city"] input');
        await expect(cityInput).toBeVisible({ timeout: 30000 });
        await cityInput.fill(randString);
        await expect(cityInput).toHaveValue(randString);

        const radioButtons = formPage.locator('[class="row radio-scroll"]').first()
        await expect(radioButtons).toBeVisible({ timeout: 30000 });
        const radio = formPage.locator('input[type="radio"][value="No"]');
        await radio.check();
        await expect(radio).toBeChecked();

        const errorModal = formPage.getByText("There is an error");
        await expect(errorModal).not.toBeVisible();
    }

    async fillApplicationFormStagingInIncognito() {
        const randString = Constants.randStr();
        const randPhone = Constants.generateRandomPhoneNumber();
        const randEmail = Constants.generateRandomEmail();

        const context = this.page.context();

        const [formPage] = await Promise.all([
            context.waitForEvent("page"),
            this.page.locator('[data-test-id="view-application-form"]').click(),
        ]);

        await formPage.bringToFront();

        await expect(formPage).toHaveURL(/application-form/i, {
            timeout: 30000,
        });

        await formPage.waitForLoadState("domcontentloaded");

        await formPage
            .locator("#svg-spinner")
            .waitFor({ state: "hidden", timeout: 15000 })
            .catch(() => {});

        const firstNameInput = formPage.locator(
            '[data-test-id="text-box-with-label-first_name"] input'
        );

        await expect(firstNameInput).toBeVisible({ timeout: 30000 });
        await firstNameInput.fill(randString);
        await expect(firstNameInput).toHaveValue(randString);

        const lastNameInput = formPage.locator(
            '[data-test-id="text-box-with-label-last_name"] input'
        );

        await expect(lastNameInput).toBeVisible({ timeout: 30000 });
        await lastNameInput.fill(randString);
        await expect(lastNameInput).toHaveValue(randString);

        const locationsChecklist = formPage.locator(
            '[data-test-id="checkbox-group-locations"]'
        );

        await expect(locationsChecklist).toBeVisible({ timeout: 30000 });

        const locationCheckbox = formPage.locator(
            ApplicationAndProfileBuilderLocators.locationCheckbox
        );

        await locationCheckbox.check();
        await expect(locationCheckbox).toBeChecked();

        const phoneInput = formPage.locator(
            '[data-test-id="text-box-with-label-phone"] input'
        );

        await expect(phoneInput).toBeVisible({ timeout: 30000 });
        await phoneInput.fill(randPhone);
        await expect(phoneInput).toHaveValue(randPhone);

        const emailInput = formPage.locator(
            '[data-test-id="text-box-with-label-email"] input'
        );

        if ((await emailInput.count()) > 0) {
            await expect(emailInput.first()).toBeVisible({ timeout: 30000 });
            await emailInput.first().fill(randEmail);
            await expect(emailInput.first()).toHaveValue(randEmail);
        } else {
            const emailFallback = formPage
                .locator(ApplicationAndProfileBuilderLocators.emailClientFormStg)
                .first();

            await expect(emailFallback).toBeVisible({ timeout: 30000 });
            await emailFallback.fill(randEmail);
            await expect(emailFallback).toHaveValue(randEmail);
        }

        const addressInput = formPage.locator(
            '[data-test-id="text-box-with-label-address1"] input'
        );

        await expect(addressInput).toBeVisible({ timeout: 30000 });
        await addressInput.fill(randString);
        await expect(addressInput).toHaveValue(randString);

        const cityInput = formPage.locator(
            '[data-test-id="text-box-with-label-city"] input'
        );

        await expect(cityInput).toBeVisible({ timeout: 30000 });
        await cityInput.fill(randString);
        await expect(cityInput).toHaveValue(randString);

        const radioButtons = formPage.locator(".row.radio-scroll").first();
        await expect(radioButtons).toBeVisible({ timeout: 30000 });

        const radio = formPage.locator('input[type="radio"][value="No"]').first();
        await radio.check();
        await expect(radio).toBeChecked();

        const submit = formPage
            .locator('button#submit-button, button:has-text("Submit"), input[type="submit"]')
            .last();

        await expect(submit).toBeAttached({ timeout: 30000 });
        await submit.scrollIntoViewIfNeeded();
        await expect(submit).toBeVisible({ timeout: 30000 });
        await expect(submit).toBeEnabled({ timeout: 30000 });

        await submit.click();

        const closeResultDialog = formPage.locator(
            '[data-test-id="result-dialog-close-button"]'
        );

        const submittedModal = formPage.locator('[data-test-id="result-dialog-inner-html"]');
        await expect(submittedModal).toBeVisible();
        await expect(submittedModal).toContainText('Thank you for submitting your registration!');

        if (await closeResultDialog.isVisible().catch(() => false)) {
            await closeResultDialog.click();
        }

        await expect(submittedModal).not.toBeVisible();

        await formPage.close();

        return randEmail;
    }

    async fillApplicationFormProduction() {
        const randString = Constants.randStr();
        const randPhone = Constants.generateRandomPhoneNumber();
        const randEmail = Constants.generateRandomEmail();

        const context = this.page.context();
        const [formPage] = await Promise.all([
            context.waitForEvent("page"),
            this.page.locator('[data-test-id="view-application-form"]').click(),
        ]);

        await formPage.bringToFront();
        await expect(formPage).toHaveURL(/application-form/i, {timeout: 30000});
        await formPage.waitForLoadState("domcontentloaded");

        await formPage
            .locator("#svg-spinner")
            .waitFor({state: "hidden", timeout: 15000})
            .catch(() => {
            });

        const locationsChecklist = formPage.locator('[data-test-id="checkbox-group-locations"]');
        await expect(locationsChecklist).toBeVisible({timeout: 30000});

        const locationCheckbox = formPage.locator(ApplicationAndProfileBuilderLocators.locationCheckbox);
        await locationCheckbox.check();
        await expect(locationCheckbox).toBeChecked();

        const firstNameInput = formPage.locator('[data-test-id="text-box-with-label-text13"] input');
        await expect(firstNameInput).toBeVisible({timeout: 30000});
        await firstNameInput.fill(randString);
        await expect(firstNameInput).toHaveValue(randString);

        const phoneInput = formPage.locator('[data-test-id="text-box-with-label-info__custom_phone1"] input');
        await expect(phoneInput).toBeVisible({timeout: 30000});
        await phoneInput.fill(randPhone);
        await expect(phoneInput).toHaveValue(randPhone);

        const emailInput = formPage.locator('[data-test-id="text-box-with-label-text15"] input');
        if ((await emailInput.count()) === 0) {

            const emailFallback = formPage.locator(ApplicationAndProfileBuilderLocators.emailClientFormProd).first();
            await expect(emailFallback).toBeVisible({timeout: 30000});
            await emailFallback.fill(randEmail);
            await expect(emailFallback).toHaveValue(randEmail);
        } else {
            await expect(emailInput).toBeVisible({timeout: 30000});
            await emailInput.fill(randEmail);
            await expect(emailInput).toHaveValue(randEmail);
        }

        const addressInput = formPage.locator('[data-test-id="text-box-with-label-text16"] input');
        await expect(addressInput).toBeVisible({timeout: 30000});
        await addressInput.fill(randString);
        await expect(addressInput).toHaveValue(randString);

        const cityInput = formPage.locator('[data-test-id="text-box-with-label-text18"] input');
        await expect(cityInput).toBeVisible({timeout: 30000});
        await cityInput.fill(randString);
        await expect(cityInput).toHaveValue(randString);

        const radioButtons = formPage.locator('[class="row radio-scroll"]').nth(1)
        await expect(radioButtons).toBeVisible({timeout: 30000});
        const radio = formPage.locator('input[type="radio"][value="No"]');
        await radio.check();
        await expect(radio).toBeChecked();

        const errorModal = formPage.getByText("There is an error");
        await expect(errorModal).not.toBeVisible();
    }

    async fillApplicationFormProductionInIncognito() {
        const randString = Constants.randStr();
        const randPhone = Constants.generateRandomPhoneNumber();
        const randEmail = Constants.generateRandomEmail();

        const context = this.page.context();

        const [formPage] = await Promise.all([
            context.waitForEvent("page"),
            this.page.locator('[data-test-id="view-application-form"]').click(),
        ]);

        await formPage.bringToFront();

        await expect(formPage).toHaveURL(/application-form/i, {
            timeout: 30000,
        });

        await formPage.waitForLoadState("domcontentloaded");

        await formPage
            .locator("#svg-spinner")
            .waitFor({ state: "hidden", timeout: 15000 })
            .catch(() => {});

        const firstNameInput = formPage.locator(
            '[data-test-id="text-box-with-label-first_name"] input'
        );

        await expect(firstNameInput).toBeVisible({ timeout: 30000 });
        await firstNameInput.fill(randString);
        await expect(firstNameInput).toHaveValue(randString);

        const lastNameInput = formPage.locator(
            '[data-test-id="text-box-with-label-last_name"] input'
        );

        await expect(lastNameInput).toBeVisible({ timeout: 30000 });
        await lastNameInput.fill(randString);
        await expect(lastNameInput).toHaveValue(randString);

        const phoneInput = formPage.locator(
            '[data-test-id="text-box-with-label-phone"] input'
        );

        await expect(phoneInput).toBeVisible({ timeout: 30000 });
        await phoneInput.fill(randPhone);
        await expect(phoneInput).toHaveValue(randPhone);

        const emailInput = formPage.locator(
            '[data-test-id="text-box-with-label-email"] input'
        );

        if ((await emailInput.count()) > 0) {
            await expect(emailInput.first()).toBeVisible({ timeout: 30000 });
            await emailInput.first().fill(randEmail);
            await expect(emailInput.first()).toHaveValue(randEmail);
        } else {
            const emailFallback = formPage
                .locator(ApplicationAndProfileBuilderLocators.emailClientFormStg)
                .first();

            await expect(emailFallback).toBeVisible({ timeout: 30000 });
            await emailFallback.fill(randEmail);
            await expect(emailFallback).toHaveValue(randEmail);
        }

        const addressInput = formPage.locator(
            '[data-test-id="text-box-with-label-address1"] input'
        );

        await expect(addressInput).toBeVisible({ timeout: 30000 });
        await addressInput.fill(randString);
        await expect(addressInput).toHaveValue(randString);

        const cityInput = formPage.locator(
            '[data-test-id="text-box-with-label-city"] input'
        );

        await expect(cityInput).toBeVisible({ timeout: 30000 });
        await cityInput.fill(randString);
        await expect(cityInput).toHaveValue(randString);

        const radioButtons = formPage.locator(".row.radio-scroll").first();
        await expect(radioButtons).toBeVisible({ timeout: 30000 });

        const radio = formPage.locator('input[type="radio"][value="No"]').first();
        await radio.check();
        await expect(radio).toBeChecked();

        const submit = formPage.locator('button#submit-button');
        await expect(submit).toBeAttached({ timeout: 30000 });
        await submit.scrollIntoViewIfNeeded();
        await expect(submit).toBeVisible({ timeout: 30000 });
        await expect(submit).toBeEnabled({ timeout: 30000 });

        await submit.evaluate((button: HTMLButtonElement) => {
            button.click();
        })

        const closeResultDialog = formPage.locator(
            '[data-test-id="result-dialog-close-button"]'
        );

        const submittedModal = formPage.locator('[data-test-id="result-dialog-inner-html"]');
        await expect(submittedModal).toBeVisible();
        await expect(submittedModal).toContainText('Thank you for submitting your registration!');

        if (await closeResultDialog.isVisible().catch(() => false)) {
            await closeResultDialog.click();
        }

        await expect(submittedModal).not.toBeVisible();

        await formPage.close();

        return randEmail;
    }

    async clickGearIconForFirstResult() {
        const gearIcon = this.page.locator(ApplicationAndProfileBuilderLocators.gearIcon).last();
        await expect(gearIcon).toBeVisible();
        await gearIcon.click();
    }

    async clickOnNotificationsTab() {
        const tab = this.page.locator(ApplicationAndProfileBuilderLocators.notificationsTab).first();
        await expect(tab).toBeVisible({ timeout: 10000 });
        await tab.click();
    }

    async validateNotificationSettings(expectedEmail: string) {
        const option = this.page.locator(ApplicationAndProfileBuilderLocators.sendSubmissionNotificationOption);
        await expect(option).toBeChecked();

        const emailField = this.page.locator(ApplicationAndProfileBuilderLocators.submissionNotificationEmailField).first();
        await emailField.click()

        const emailInput = this.page.locator('input[class="form-control drag-drop-item"]');
        await expect(emailInput).toBeVisible();
        await expect(emailInput).toHaveValue(expectedEmail);

        const summaryCheckbox = this.page.locator(ApplicationAndProfileBuilderLocators.sendSummaryToApplicantCheckbox).first();
        await expect(summaryCheckbox).toBeChecked();
    }

    async closeSettingsModal() {
        await this.clickOnElement(ApplicationAndProfileBuilderLocators.closeSettingsButton);
    }

    async openClientFormInNewTabAndSubmit(isProduction: boolean) {
        if (isProduction) {
            await this.fillApplicationFormProduction();
        } else {
            await this.fillApplicationFormStaging();
        }
    }

    async searchAndValidateEmailLogForClientForm(subjectKeyword: string) {
        const searchIcon = this.page.locator(ApplicationAndProfileBuilderLocators.logSearchIcon);
        const searchField = this.page.locator(ApplicationAndProfileBuilderLocators.logSearchSubjectField);

        await searchIcon.click();
        await searchField.fill(subjectKeyword);
        await this.page.waitForTimeout(3000);

        const logItems = this.page.locator(ApplicationAndProfileBuilderLocators.logItems);
        await expect(logItems.first()).toBeVisible({ timeout: 15000 });
        const count = await logItems.count();
        expect(count).toBeGreaterThanOrEqual(1);
    }
};