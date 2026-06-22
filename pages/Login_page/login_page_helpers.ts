import BasePage from "../../base/base_page";
import {chromium, devices, expect, Page} from "@playwright/test";
import {LoginLocators} from "./login_page_locators";

export default class LoginPage extends BasePage {
    constructor(public page: Page) {
        super(page);
    }

    async enterUserName(username: string) {
        await this.page.waitForSelector(LoginLocators.emailInputField);

        await this.fillInputField(LoginLocators.emailInputField, username);
    }

    async enterPassword(password: string) {
        await this.page.waitForSelector(LoginLocators.passwordInputField);
        await this.fillInputField(LoginLocators.passwordInputField, password);
    }

    async clickOnLoginButton() {
        await this.page.waitForSelector(LoginLocators.submitButton);
        await this.clickOnElement(LoginLocators.submitButton);
    }

    async userLogin(agency: string, userName: string, password: string) {
        await this.page.goto(agency);
        await this.page.waitForSelector(LoginLocators.emailInputField)
        await this.enterUserName(userName);
        await this.enterPassword(password);
        await this.clickOnLoginButton();
    }

    async logoutFromClientAccountAndLogin(agency: string, clientEmail: string, password: string) {
        const cancelButton = this.page.locator('//span[contains(text(), " Cancel ")]');
        const gearIcon = this.page.locator('[class="settings-icon material-icons"]');
        const logoutDropdown = this.page.locator('[class="dropdown-item logout-btn"]');

        await cancelButton.click();

        // await expect(this.page.locator('[class="mt-2 mb-2"]')).toContainText('Welcome to Isar Test QA, test')

        await gearIcon.click();
        await logoutDropdown.click();
    }

    async userLoginAfterLogOut(agency: string, userName: string, password: string) {
        await this.page.goto(agency);
        await this.page.waitForTimeout(5000);
        const loginLogoutButton = this.page.locator('[data-test-id="login-logout-button"]');
        const isVisible = await loginLogoutButton.isVisible();

        if (isVisible) {
            await this.page.locator('[data-test-id="login-logout-button"]').waitFor({state: 'attached'});
            await this.page.locator('[data-test-id="login-logout-button"]').click();
        }

        await this.page.waitForSelector(LoginLocators.emailInputField);
        await this.page.click(LoginLocators.emailInputField);
        await this.enterUserName(userName);
        await this.page.waitForSelector(LoginLocators.passwordInputField);
        await this.page.click(LoginLocators.passwordInputField);
        await this.enterPassword(password);
        expect(userName).not.toBe('');
        expect(password).not.toBe('');
        await this.clickOnLoginButton();
    }
    async userLoginMobile(agency: string, userName: string, password: string) {
        const browser = await chromium.launch();
        const context = await browser.newContext({
            ...devices['iPhone 13 Pro'], // built-in device emulation
        });
        const page = await context.newPage();
        await page.goto(agency);

        await page.waitForSelector(LoginLocators.emailInputField);

        await this.fillInputField(LoginLocators.emailInputField, userName);
        await this.enterPassword(password);
        await this.clickOnLoginButton();
    }

    async validateValidationMessage(selector: string, validationMessage: string) {
        const errorElement = this.page.locator(
            ` `,
        );
        await expect(errorElement).toContainText(validationMessage);
    }

    async toShowValidationMessage(field: string, expectedMessage: string) {
        const validationMessage = await this.page.$eval(field, element => {
            if (
                element instanceof HTMLInputElement ||
                element instanceof HTMLTextAreaElement ||
                element instanceof HTMLSelectElement
            ) {
                return element.validationMessage;
            }
            throw new Error(
                'Element is not a form control with a validation message.',
            );
        });
        expect(validationMessage).toBe(expectedMessage);
    }

    async userLogout() {

    }
    async validateMyDashboardButtonNotVisible() {
        const myDashboard = this.page.locator(LoginLocators.myDashboardButton);
        const alreadyLoggedInText = this.page.locator(LoginLocators.youAreAlreadyLoggedIn);
        await expect(myDashboard).not.toBeVisible();
        await expect(alreadyLoggedInText).not.toBeVisible();
    }
}