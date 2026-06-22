import { Page, expect } from '@playwright/test';

export default class BasePage {
    constructor(public page: Page) {}

    async clickOnElement(selector: string) {
        await this.page.click(selector);
    }

    async fillInputField(selector: string, text: string) {
        await this.page.locator(selector).fill(text);
    }

    async setExtraHeaders(headers: Record<string, string>) {
        await this.page.setExtraHTTPHeaders(headers);
    }

    async validateUrl(expectedPattern: any) {
        await expect(this.page).toHaveURL(expectedPattern);
    }

    async hoverOverElement(selector: string) {
        await this.page.hover(selector);
    }

    async validateElementIsDisplayed(selector: string): Promise<boolean> {
        return await this.page.locator(selector).isVisible();
    }

    async validateElementIsNotDisplayed(selector: string): Promise<boolean> {
        // const locator = this.page.locator(selector);
        // const isVisible = await locator.isVisible();
        //
        // return !isVisible; // Return true if the element is not visible
        const locator = this.page.locator(selector);
        try {
            await expect(locator).toHaveCount(0, {timeout: 7000});
            return true;
        } catch {
            const count = await locator.count();
            return count === 0;
        }
    }

    async validateConnectorCountIsOne(selector: string): Promise<boolean> {
        const elementCount = await this.page.locator(selector).count();
        return elementCount === 1;
    }

    async validateElementIsVisibleWithText(selector: string, expectedText: string) {
        const element = this.page.locator(selector);
        await expect(element).toBeVisible({ timeout: 30000 });
        await expect(element).toContainText(expectedText);
    }

    async validateElementIsNotVisible(selector: string) {
        const element = this.page.locator(selector);
        await expect(element).not.toBeVisible({ timeout: 30000 });
    }

    async validateElementWithTextIsNotVisible(selector: string, text: string) {
        const element = this.page.locator(`${selector}:has-text("${text}")`);
        await expect(element).toBeHidden({ timeout: 30000 });
    }
}
