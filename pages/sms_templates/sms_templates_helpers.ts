import {expect, Page, TestInfo} from "@playwright/test";
import BasePage from "../../base/base_page";
import {SmsTemplateLocators} from "./sms_templates_locators";
import {Constants} from "../../utils/constants";
export default class SmsTemplatesHelpers extends BasePage {
    constructor(public page: Page) {
        super(page);
    }
    constants = new Constants();

    async goToSmsTemplates() {
        await this.clickOnElement(SmsTemplateLocators.smsTemplates);
    }
    async addTemplate() {
        await this.clickOnElement(SmsTemplateLocators.addTemplateButton);
    }

    async createTemplate() {
        await this.page.locator(SmsTemplateLocators.templateName).fill('test');
        await this.page.locator(SmsTemplateLocators.typeDropdown).click();

        const jobOption = this.page
            .locator('[role="option"], [data-value]')
            .filter({hasText: "Job"})
            .locator(':visible')
            .first();
        await jobOption.click();
    }

    async validateTriggers() {
        await this.page.locator(SmsTemplateLocators.triggersDropdown).first().click();
        const expected = this.constants.jobTriggerTestData.map(s => s.trim());

        const dropdownList = this.page.locator(
            '//div[contains(@class, \'multiselect__content-wrapper\')]//li[contains(@class, \'multiselect__element\')]' +
            '//span[contains(text(), \'Status Change Notification\') or contains(text(), \'Placement Job Status Change Notification\') ' +
            'or contains(text(), \'Placement Job Broadcast\') or contains(text(), \'Bulk Email Placement Job Applicant\') or contains(text(), ' +
            '\'Shift Job Broadcast\') or contains(text(), \'Placement Job Bulk Broadcast\') or contains(text(), \'Shift Job Bulk Broadcast\') ' +
            'or contains(text(), \'Candidate Booking Confirmation\') or contains(text(), \'Client Booking Confirmation\') or contains(text(), ' +
            '\'Client Self Booking Confirmation\') or contains(text(), \'Shift Job Updated Candidate Notification\') or contains(text(), ' +
            '\'Bright Horizons Case Successfully Staffed Candidate Notification\') or contains(text(), \'Shift Job Accepted Candidate Notification\') ' +
            'or contains(text(), \'Shift Job Declined Candidate Notification\') or contains(text(), \'Shift Job Accepted Client Notification\') or contains(text(), ' +
            '\'Shift Job Declined Client Notification\') or contains(text(), \'Shift Job Report Client Notification\') or contains(text(), ' +
            '\'Shift Job Mark as Completed Client Notification\') or contains(text(), \'Shift Job Accepted Admin Notification\') or contains(text(), ' +
            '\'Shift Job Status Change Admin Notification\') or contains(text(), \'Shift Job Created Admin Notification\') or contains(text(), ' +
            '\'Shift Job Auto Assignment Admin Notification\') or contains(text(), \'Shift Job Interested Admin Notification\') or contains(text(), ' +
            '\'Shift Job MAYBE Interested Admin Notification\') or contains(text(), \'Shift Job Cancelled Admin Notification\') or contains(text(), ' +
            '\'Shift Job Interested Client Notification\') or contains(text(), \'Shift Job Unassigned Candidate Notification\') or contains(text(), ' +
            '\'Shift Job Unassigned Client Notification\') or contains(text(), \'Shift Job Candidate Reminder\') or contains(text(), ' +
            '\'Shift Job Client Reminder\') or contains(text(), \'Unfilled Shift Job Client Reminder\') or contains(text(), \'Unfilled Shift Job Admin Reminder\')' +
            ' or contains(text(), \'Shift Job Clock In Reminder\') or contains(text(), \'Shift Job Clock Out Reminder\') or contains(text(), \'Shift Job Tipping Notification\')' +
            ' or contains(text(), \'Shift Job Status Reminder\') or contains(text(), \'Payment Information Poster Reminder\') or contains(text(), ' +
            '\'Placement Job Application Status Reminder\') or contains(text(), \'Application Status Change Candidate Notification\') or contains(text(), ' +
            '\'Application Status Change Client Notification\') or contains(text(), \'Automatically Broadcast new Shift Job\') or contains(text(), ' +
            '\'Automatically Broadcast new Shift Job to Favorite\') or contains(text(), \'Automatically Rebroadcast Shift Job\') or contains(text(), ' +
            '\'Notification of New Backup Care Assistant Jobs\') or contains(text(), \'Bulk Assign Candidate Confirmation\') or contains(text(), ' +
            '\'Bulk Assign Client Confirmation\') or contains(text(), \'Complete Associated Bookings Client Notification\') or contains(text(), ' +
            '\'Job Charged Client Notification\') or contains(text(), \'Job Charge Failed Client Notification\') or contains(text(), \'Job Charged Candidate Notification\') ' +
            'or contains(text(), \'Job Cancel Charged Client Notification\') or contains(text(), \'Job Cancel Charged Candidate Notification\') or contains(text(), ' +
            '\'Job Assigned To Other Candidate Applicant Notification\') or contains(text(), \'Placement Job Application Interested Client Notification\') or contains(text(), ' +
            '\'Placement Job Applicant Added Candidate Notification\') or contains(text(), \'Shift Job Declined Admin Notification\') or contains(text(), ' +
            '\'Client Left Star Review\') or contains(text(), \'Candidate Left Star Review\')]');

        const texts = (await dropdownList.allInnerTexts()).map(t => t.trim()).filter(Boolean);

        // Validate with diffs
        const unexpected = texts.filter(t => !expected.includes(t));
        const missing = expected.filter(t => !texts.includes(t));

        expect(unexpected, `Unexpected items (wrong list mixed in): ${unexpected.join(" | ")}`).toEqual([]);
        expect(missing, `Missing expected items: ${missing.join(" | ")}`).toEqual([]);
        expect(texts.length).toBe(expected.length);

        console.log("Trigger dropdown items:", texts);
    }

    async closeCreateTemplate() {
        await this.clickOnElement(SmsTemplateLocators.closeTemplate);
    }
}