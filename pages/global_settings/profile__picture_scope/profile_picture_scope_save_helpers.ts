import {expect, Page} from "@playwright/test";
import BasePage from "../../../base/base_page";
import DashboardHelpers from "../../dashboard/dashboard_helpers";
import {ProfilePictureScopeLocators} from "./profile_picture_scope_save_locators";

export default class ProfilePictureScopeHelpers extends BasePage {
    dashboard: DashboardHelpers;
    constructor(public page: Page) {
        super(page);
        this.dashboard = new DashboardHelpers(page);
    }

    async goToProfilePictureScope() {
        await this.dashboard.searchInGlobalSettings('Client Profile Picture Scope');
        await this.page.locator('//h4[contains(text(),"Access Control and Visibility Settings")]').isVisible();
    }
    async chooseFromProfilePictureScopeAndValidateVisibility(scopeSettingName: string) {

        const dropdown = this.page.locator(ProfilePictureScopeLocators.profilePictureScopeDropdown);
        await dropdown.click();

        // await this.page.keyboard.press("ArrowDown");
        // await this.page.keyboard.press("ArrowDown");
        // await this.page.keyboard.press("Enter");

        const option = this.page.locator('.multiselect__option:visible', {
            hasText: scopeSettingName,
        }).first();

        await expect(option).toBeVisible();

       await option.click();

        await expect(dropdown).toContainText(scopeSettingName);

        //await this.page.locator(ProfilePictureScopeLocators.saveSetting).click();
        const saveValidation = this.page.getByText('Setting Saved');
        await expect(saveValidation).toBeVisible();
        await this.dashboard.waitForSpinnerToDisappear();
    }

    async validateSelectedScope(scopeSettingName:string){
        await this.dashboard.waitForSpinnerToDisappear();
        const optionText = await this.page.locator(ProfilePictureScopeLocators.profilePictureScopeDropdown).innerText();
        expect(optionText).toMatch(scopeSettingName);
    }
}

