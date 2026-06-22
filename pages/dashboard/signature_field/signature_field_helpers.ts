import BasePage from "../../../base/base_page";
import {Page, ElementHandle, expect} from "@playwright/test";
import {DashboardLocators} from "../dashboard_locators"
import {SignatureFieldLocators} from "./signature_field_locators";



export default class SignatureHelpers extends BasePage {
    constructor(public page: Page) {
        super(page);
    }
    async openDocTemplates (){
        await this.clickOnElement(SignatureFieldLocators.documentTemplates);
    }
    async searchImageBasedTemplate(templateName:string) {
        await this.fillInputField(SignatureFieldLocators.searchTemplates, templateName);
    }
    async inspectTemplate (){
        await this.clickOnElement(SignatureFieldLocators.inspectTemplate);
    }
    async signTemplate() {
        const canvas = this.page.locator('.signature-container canvas').nth(0);
        await canvas.isVisible()
        const box = await canvas.boundingBox();
        if (!box) throw new Error('Canvas not found');

        await this.page.mouse.move(box.x + 30, box.y + 50);
        await this.page.mouse.down();
        await this.page.mouse.move(box.x + 200, box.y + 120, { steps: 15 });
        await this.page.mouse.move(box.x + box.width - 30, box.y + 150, { steps: 15 });
        await this.page.mouse.up();

        const firstStroke = await this.page.$eval('.signature-container canvas', (c: HTMLCanvasElement) => c.toDataURL());

        await this.page.mouse.move(box.x + 30, box.y + box.height - 50); // start near bottom-left
        await this.page.mouse.down();
        await this.page.mouse.move(box.x + box.width / 2, box.y + box.height - 100, { steps: 15 });
        await this.page.mouse.move(box.x + box.width - 30, box.y + box.height - 50, { steps: 15 }); // end near bottom-right
        await this.page.mouse.up();

        const pixelsChanged = await this.page.$eval('.signature-container canvas', (c: HTMLCanvasElement, first: string) => {
            const ctx = c.getContext('2d')!;
            const img = new Image();
            img.src = first;
            const tmpCanvas = document.createElement('canvas');
            tmpCanvas.width = c.width;
            tmpCanvas.height = c.height;
            const tmpCtx = tmpCanvas.getContext('2d')!;
            tmpCtx.drawImage(img, 0, 0);
            const currData = ctx.getImageData(0, 0, c.width, c.height).data;
            const prevData = tmpCtx.getImageData(0, 0, c.width, c.height).data;
            return Array.from(currData).some((v, i) => v !== prevData[i]);
        }, firstStroke);

        expect(pixelsChanged).toBeTruthy();
    }
    async expendSignatureField() {
        await this.page.locator('[class="fullscreen-button"]').nth(0).click();
    }
    async isCanvasBlank(canvasLocator:any) {
        return await canvasLocator.evaluate((canvas:any) => {
            const ctx = canvas.getContext('2d');
            const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

            for (let i = 0; i < pixels.length; i += 4) {
                const r = pixels[i];
                const g = pixels[i + 1];
                const b = pixels[i + 2];
                const a = pixels[i + 3];

                if (a !== 0) {

                    return false;
                }
            }
            return true;
        });
    }
    async signExpandedTemplate() {

            const canvas = this.page.locator('.signature-container canvas').nth(0);
            const box = await canvas.boundingBox();
            if (!box) throw new Error('Canvas not found');

            await this.page.mouse.move(box.x + 30, box.y + 50);
            await this.page.mouse.down();
            await this.page.mouse.move(box.x + 200, box.y + 120, { steps: 15 });
            await this.page.mouse.move(box.x + box.width - 30, box.y + 150, { steps: 15 });
            await this.page.mouse.up();
        const blank = await this.isCanvasBlank(canvas);

        expect(blank).toBeFalsy();

    }

}