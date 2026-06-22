import {expect, Page, TestInfo} from "@playwright/test";
import BasePage from "../../base/base_page";
import {EmailTemplatesLocators} from "./email_templates_locators";


export default class EmailTemplatesHelpers extends BasePage {
    constructor(public page: Page) {
        super(page);
    }

    async getSelectors(projectName: string) {
        const isProd = projectName.includes("prod");
        const isDev = projectName.includes("dev");
        const isStagingOrLocal = projectName.includes("staging") || projectName.includes("local");

        if (isProd) {
            return {
                BLOCK_SEL: "#u_content_text_2",
                EDITABLE_SEL: '//div[@id= "u_content_text_2"]/div',
                OVERLAY_SEL: '[id="u_column_1"]'
            };
        }

        if (isDev) {
            return {
                BLOCK_SEL: "#u_content_paragraph_1",
                EDITABLE_SEL: '//div[@id="u_content_paragraph_1"]/div',
                OVERLAY_SEL: '[id="u_row_2"]'
            };
        }

        if (isStagingOrLocal) {
            return {
                BLOCK_SEL: "#u_content_paragraph_1",
                EDITABLE_SEL: '//div[@id="u_content_paragraph_1"]/div',
                OVERLAY_SEL: '[id="u_row_2"]'
            };
        }
        return {BLOCK_SEL: "", EDITABLE_SEL: "", OVERLAY_SEL: ""};
    }

    async clickOnEmailTemplates() {
        const emailTemplate = this.page.locator(EmailTemplatesLocators.emailTemplates);

        await emailTemplate.scrollIntoViewIfNeeded();
        await emailTemplate.click({force: true});
    }

    async searchTemplateViaName(name: string) {
        await this.fillInputField(EmailTemplatesLocators.templateSearchField, name);
        await this.clickOnElement(EmailTemplatesLocators.templateSelector);
    }

    async clickOnProgressStep() {
        await this.page.waitForTimeout(5000);
        const stepContent = this.page.locator(EmailTemplatesLocators.progressContentStep);
        await expect(stepContent).toBeVisible();
        await expect(stepContent).toBeEnabled();
        await stepContent.click();
    }

    async clickOnSelectDesignTemplateButton() {
        await this.page.waitForTimeout(6000);
        const templateButton = this.page.locator(EmailTemplatesLocators.selectDesignTemplateButton);
        await expect(templateButton).toBeVisible();
        await expect(templateButton).toBeEnabled();
        await templateButton.click();
        // await this.page.locator(EmailTemplatesLocators.selectDesignTemplateButton).isVisible();
        // await this.page.locator(EmailTemplatesLocators.selectDesignTemplateButton).isEnabled();
        // await this.clickOnElement(EmailTemplatesLocators.selectDesignTemplateButton);
    }

    async clickOnTemplateEditButton() {
        await this.clickOnElement(EmailTemplatesLocators.templateEditButton);
        await this.page.waitForTimeout(10000);
    }

    async updateTemplateContent(newToken: string, BLOCK_SEL: string, EDITABLE_SEL: string, OVERLAY_SEL: string) {
        const NEW_TOKEN = /^\s*\[\[.*\]\]\s*$/.test(newToken) ? newToken : `[[${newToken}]]`;

        let frame = this.page.mainFrame();
        if (!(await frame.locator(BLOCK_SEL).count())) {
            for (const f of this.page.frames()) {
                if (await f.locator(BLOCK_SEL).count()) { frame = f; break; }
            }
        }

        const overlay = frame.locator(OVERLAY_SEL).first();
        await expect(overlay).toBeVisible({ timeout: 15000 });

        try {
            await overlay.click({ timeout: 3000 });
        } catch {
            const box = await overlay.boundingBox();
            if (!box) throw new Error("Overlay not clickable");
            await this.page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
        }

        const editable = frame.locator(EDITABLE_SEL).first();
        await expect(editable).toBeVisible({ timeout: 15000 });
        await editable.click();

        const selectAll = process.platform === "darwin" ? "Meta+A" : "Control+A";
        await this.page.keyboard.press(selectAll);
        await this.page.keyboard.press("Backspace");
        const text = `Hello ${NEW_TOKEN},`;
        await this.page.keyboard.type(text, { delay: 10 });


        await this.page.waitForTimeout(5000);
        await expect(editable).toContainText(NEW_TOKEN, { timeout: 15000 });

        let submit = this.page.locator(EmailTemplatesLocators.submitButton).first();
        await expect(submit).toBeVisible({ timeout: 15000 });
        await expect(submit).toBeEnabled({ timeout: 15000 });
        await submit.click({ trial: true });
        await submit.click();
    }

    async clickOnSubmitButton(){
        await this.clickOnElement(EmailTemplatesLocators.submitButton);
    }

    async validateTemplateContent(note: string, BLOCK_SEL: string, EDITABLE_SEL: string, OVERLAY_SEL: string) {
        let frame = this.page.mainFrame();
        if (!(await frame.locator(BLOCK_SEL).count())) {
            frame = (await Promise.all(this.page.frames().map(async f => (await f.locator(BLOCK_SEL).count()) ? f : null)))
                .find(Boolean) || frame;
        }

        // Ensure overlay visible & stable
        const overlay = frame.locator(OVERLAY_SEL).first();
        await expect(overlay).toBeVisible({ timeout: 15000 });
        try {
            await overlay.click({ timeout: 3000 });
        } catch {
            const box = await overlay.boundingBox();
            if (!box) throw new Error("Overlay not clickable");
            await this.page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
            await frame.locator(BLOCK_SEL).dblclick().catch(() => {});
        }

        // Validate content
        await expect(frame.locator(EDITABLE_SEL).first()).toContainText(note);
    }
    async AIgenerateTemplate(templateDescription:string) {
        await this.clickOnElement(EmailTemplatesLocators.generateEmailTemplateAI);
        await this.page.locator(EmailTemplatesLocators.templateDescriptionField).nth(1).fill(templateDescription);
        await this.page.locator(EmailTemplatesLocators.createdTemplateAI).nth(2).click();
        const successText = await this.page.locator(EmailTemplatesLocators.templateGeneratedText).innerText();
        expect(successText).toContain("Generation Complete!")
    }
    async closeTemplateGeneratedModal() {
        await this.page.locator(EmailTemplatesLocators.closeTemplateGeneratedModal).nth(1).click();
    }
    async validateContent() {
        const content = await this.page
            .locator(EmailTemplatesLocators.contentText)
            .innerText();

        //expect(content).toMatch(/Hi \{\{candidate_(?:first_)?name\}\}/);
        //expect(content).toContain("Hi");
        expect(content).not.toBe("");
    }
}