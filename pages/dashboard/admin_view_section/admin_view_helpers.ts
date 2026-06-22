import BasePage from "../../../base/base_page";
import {expect, Page} from "@playwright/test";
import {CandidatesPageLocators} from "../candidates_page/candidates_page_locators";
import {ClientPageLocators} from "../client_page/client_page_locators";
import {Locator} from "playwright";
import {adminViewSectionLocators} from "./admin_view_locators";


export default class AdminVewHelpers extends BasePage {
    constructor(public page: Page) {
        super(page);
    }
    async validateLocationDropdown(){

        await this.fillInputField(adminViewSectionLocators.adminViewLocations, 'New York')
        const locator = this.page.locator(adminViewSectionLocators.locationsDropdown)
        expect(locator).toBeVisible()
    }
}