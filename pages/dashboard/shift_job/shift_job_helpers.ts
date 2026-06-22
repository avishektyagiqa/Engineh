import BasePage from "../../../base/base_page";
import {Page, ElementHandle, expect} from "@playwright/test";
import {ShiftJobLocators} from "./shift_job_locators";
import {DashboardLocators} from "../dashboard_locators";
import ClientPage from "../client_page/client_page_helpers";


export default class ShiftJobHelpers extends BasePage {
    constructor(public page: Page) {
        super(page);
    }

    async clickOnNextYearArrow (){
        await this.clickOnElement(ShiftJobLocators.nextYearArrow);
    }

    async clickNextYearArrowMultiple(times: number) {
        for (let i = 0; i < times; i++) {
            await this.clickOnNextYearArrow();
        }
    }

    async chooseRandomDayOnCalendar(){
        await this.clickNextYearArrowMultiple(2);
        await this.clickRandomCalendarDay();
        await this.page.waitForTimeout(10000);
    }

    async clickRandomCalendarDay() {
        const days = await this.page.$$('div.cv-day.future');

        if (days.length === 0) {
            throw new Error('No selectable calendar days found.');
        }

        const randomIndex = Math.floor(Math.random() * days.length);
        const randomDay = days[randomIndex];

        await randomDay.click();
    }

    async selectRandomTime(): Promise<{ start: string; end: string }> {
        const to12h = (totalMins: number) => {
            const mins = ((totalMins % 1440) + 1440) % 1440;
            const hh24 = Math.floor(mins / 60);
            const mm = mins % 60;
            const ampm = hh24 >= 12 ? "PM" : "AM";
            let hh12 = hh24 % 12;
            if (hh12 === 0) hh12 = 12;
            const hh = String(hh12).padStart(2, "0");
            const m = String(mm).padStart(2, "0");
            return `${hh}:${m} ${ampm}`;
        };

        const randInt = (min: number, max: number) =>
            Math.floor(Math.random() * (max - min + 1)) + min;

        // Inputs: 0 = Start, 1 = End
        const startInput = this.page.locator('[data-test-id="vue-timepicker"] input.display-time').nth(0);
        const endInput = this.page.locator('[data-test-id="vue-timepicker"] input.display-time').nth(1);

        // pick a random start time in 15-min steps, leaving room for +60 mins
        const step = 15;
        const minStart = 0;                 // 12:00 AM
        const maxStart = 23 * 60;           // 11:00 PM (end will be at most midnight)
        const startMins = randInt(minStart / step, maxStart / step) * step;

        // end must be at least +60 mins (your validation)
        const endMins = startMins + 60;

        const start = to12h(startMins);
        const end = to12h(endMins);

        await startInput.fill(start);
        await startInput.press("Tab"); // trigger blur/validation

        await endInput.fill(end);
        await endInput.press("Tab");

        return { start, end };
    }


    async selectSmartStartAndEndTime() {
        const startHour = '10';
        const startMinute = '00';
        const startPeriod: 'AM' | 'PM' = 'AM';

        const endHour = '01';
        const endMinute = '15';
        const endPeriod: 'PM' = 'PM';

        await this.selectTimeByIndex(0, startHour, startMinute, startPeriod); // Start
        await this.selectTimeByIndex(1, endHour, endMinute, endPeriod);       // End
    }

    async selectTimeByIndex(
        index: number,
        hour: string,
        minute: string,
        period: 'AM' | 'PM'
    ) {
        const inputs = await this.page.$$('input[placeholder="hh:mm A"]');
        if (inputs.length <= index) throw new Error(`Time input at index ${index} not found`);

        // Blur previous input to close dropdown if needed
        if (index === 1 && inputs.length > 1) {
            await this.page.evaluate(() => {
                const first = document.querySelectorAll('input[placeholder="hh:mm A"]')[0] as HTMLInputElement;
                first?.blur();
            });
        }

        // Click to open time picker
        await inputs[index].click({ force: true });

        const dropdown = this.page.locator('div.dropdown.drop-down.vue__time-picker-dropdown');

        const hourOption = dropdown.locator('ul.hours li', { hasText: hour }).first();
        const minuteOption = dropdown.locator('ul.minutes li', { hasText: minute }).first();
        const ampmOption = dropdown.locator('ul.ampm li', { hasText: period }).first();

        await hourOption.click();
        await minuteOption.click();
        if (await ampmOption.count()) await ampmOption.click();

        // Blur input to apply value
        await inputs[index].evaluate((el: any) => el.blur());

        console.log(`Set time ${hour}:${minute} ${period} for input ${index}`);
    }


    async writeNote(noteText: string) {
        const noteLocator = this.page.locator(ShiftJobLocators.noteTextArea);
        await noteLocator.fill(noteText);
    }

    async enterBillingRate(billingRate: string) {
        const noteLocator = this.page.locator(ShiftJobLocators.clientBillingRateInput);
        await noteLocator.fill(billingRate);
    }
    async enterBaseRate(baseRate: string) {
        const noteLocator = this.page.locator(ShiftJobLocators.baseRateInput);
        await noteLocator.fill(baseRate);
    }
    async enterAgencyBookingFee(bookingFee: string) {
        const noteLocator = this.page.locator(ShiftJobLocators.agencyBookingFeeInput);
        await noteLocator.fill(bookingFee);
    }

    async enterAddressLine2(address: string) {
        const noteLocator = this.page.locator(ShiftJobLocators.addressLine2Input);
        await noteLocator.fill(address);
    }

    async fillBookingAddress(address: string) {
        const noteLocator = this.page.locator(ShiftJobLocators.bookingAddressInput).first();
        await noteLocator.fill(address);
    }

    async fillCity(city: string) {
        const noteLocator = this.page.locator(ShiftJobLocators.cityInput).first();
        await noteLocator.fill(city);
    }

    async fillProvince(province: string) {
        const noteLocator = this.page.locator(ShiftJobLocators.provinceInput).first();
        await noteLocator.fill(province);
    }

    async fillZipCode(zip: string) {
        const noteLocator = this.page.locator(ShiftJobLocators.zipCodeInput).first();
        await noteLocator.fill(zip);
    }

    async numberFillerNeededDropdown() {
        const dropdownButton = this.page
            .locator('[data-test-id="drop-down-with-label"]')
            .nth(0);

        await dropdownButton.click();

        const option = this.page.locator('select.form-control').first();
        await option.waitFor({ state: 'visible' });
        await option.selectOption({label: '2'})
        await option.click();
    }

    async selectFirstVisibleDropdownOption() {
        const firstVisibleOption = this.page.locator(
            '(//ul[contains(@class, "multiselect__content") and not(contains(@style, "display: none"))]//li[contains(@class, "multiselect__element")])[1]'
        );
        await firstVisibleOption.click();
    }

    async submitForm(){
        await this.clickOnElement(ShiftJobLocators.submitButton);
    }

    async selectFamilies(email: string) {
        const selector = this.page.locator(`[data-test-id="multi-select-with-label-poster"]`).first();

        await selector.click();

        const inputFamily = this.page.locator('[id="multi-select-with-label-poster"]');
        const option = this.page.locator('//span[contains(text(),"testuser@enginehire.ca")]');

        await inputFamily.fill('testuser@enginehire.ca')
        await option.click();
    }

    async assignCandidate(email: string) {
        const selector = this.page.locator(`[data-test-id="multi-select-with-label-filler"]`).first();
        const inputClient = this.page.locator('[id="multi-select-with-label-filler"]');
        const suggestion = this.page.locator('//span[contains(text(),"test candidate - testcandidate@enginehire.ca")]');

        await selector.click();
        await this.page.waitForTimeout(1000);
        await inputClient.fill('testcandidate@enginehire.ca')
        await suggestion.waitFor({state: "visible"})
        await suggestion.click();
    }

    async selectOptionFromDropdown(selectorIndex: string, count: string) {
        const selector = `(//*[@id="multiselect-select-field"])[${selectorIndex}]`;
        const input = this.page.locator(selector);

        // Scroll to the input
        await input.scrollIntoViewIfNeeded();

        const elementHandle = await input.elementHandle();
        if (elementHandle) {
            await elementHandle.evaluate((el, value) => {
                el.focus();
                el.dispatchEvent(new Event('click', { bubbles: true }));
                el.dispatchEvent(new Event('focus', { bubbles: true }));
                (el as HTMLInputElement).value = value;
                el.dispatchEvent(new Event('input', { bubbles: true }));
            }, count);
        } else {
            throw new Error('Could not find input field');
        }

        await this.page.keyboard.press('ArrowDown');
        await this.page.keyboard.press('Enter');
    }

    async clickOnYesButton() {
        const yesButton = await this.page.$(ShiftJobLocators.yesButton);
        if (yesButton && await yesButton.isVisible()) {
            await yesButton.click();
        }
        // else: do nothing
    }

    async clickOnTableSection(){
        await this.clickOnElement(ShiftJobLocators.tableSection);
    }

    async clickOnDaySectionAndVerifyItsVisible() {
        await this.clickOnElement(ShiftJobLocators.daySection);
        const dayViewTable = this.page.locator('[id="g-gantt-chart"]');
        await dayViewTable.waitFor({state: "visible"});
        await dayViewTable.scrollIntoViewIfNeeded();
        await expect(dayViewTable).toBeVisible();
    }

    async clickOnWeekSectionAndVerifyItsVisible() {
        await this.clickOnElement(ShiftJobLocators.weekSection);
        const weekViewTable = this.page.locator('div[class="calendar mb-3 mt-3"]');
        await weekViewTable.waitFor({state: "visible"});
        await weekViewTable.scrollIntoViewIfNeeded();
        await expect(weekViewTable).toBeVisible();
    }

    async clickOnMonthSectionAndVerifyItsVisible() {
        await this.clickOnElement(ShiftJobLocators.monthSection);
        const monthViewTable = this.page.locator('div[class="calendar month-view-calendar"]');
        await monthViewTable.waitFor({state: "visible"});
        await monthViewTable.scrollIntoViewIfNeeded();
        await expect(monthViewTable).toBeVisible();
    }

    async clickOnSchedulerSectionAndVerifyItsVisible() {
        await this.clickOnElement(ShiftJobLocators.schedulerSection);
        const schedulerViewTable = this.page.locator('div[class="schedule-candidates--container"]');
        await schedulerViewTable.waitFor({state: "visible"});
        await schedulerViewTable.scrollIntoViewIfNeeded();
        await expect(schedulerViewTable).toBeVisible();
    }

    async clickOnAnalyticsSection(){
        await this.clickOnElement(ShiftJobLocators.analyticsSection);
        const analyticsViewTable = this.page.locator('[class="data-table mt-2"]');
        await analyticsViewTable.waitFor({state: "visible"});
        await analyticsViewTable.scrollIntoViewIfNeeded();
        await expect(analyticsViewTable).toBeVisible();
    }

    async clickOnTimeOffSectionAndValidateIsVisible(){
        await this.clickOnElement(ShiftJobLocators.timeOffSection);//stg1
        const timeOffViewTable = this.page.locator('[class="table table-striped mt-2 shadow"]').first();
        await timeOffViewTable.waitFor({state: "visible"});
        await timeOffViewTable.scrollIntoViewIfNeeded();
        await expect(timeOffViewTable).toBeVisible();
    }

    async clickOnShiftReportsSection(){
        await this.clickOnElement(ShiftJobLocators.shiftReportsSection);//stg
        const reportViewTable = this.page.locator('[class="data-table mt-2 py-2"]');
        await reportViewTable.waitFor({state: "visible"});
        await reportViewTable.scrollIntoViewIfNeeded();
        await expect(reportViewTable).toBeVisible();
    }

    async verifyDaySectionIsVisible() {
        await this.clickOnDaySectionAndVerifyItsVisible();
        await this.page.waitForTimeout(15000);
        const dayViewTable = this.page.locator('[id="g-gantt-chart"]');
        await dayViewTable.waitFor({state: "visible"});
        await dayViewTable.scrollIntoViewIfNeeded();
        await expect(dayViewTable).toBeVisible();
    }

    async clickOnCancelButton() {
        const cancelButton = await this.page.$(ShiftJobLocators.cancelButton);
        if (cancelButton && await cancelButton.isVisible()) {
            await cancelButton.click();
        }
    }

    async clickOnSendEmailButton(){
        await this.clickOnElement(ShiftJobLocators.sendEmailButton)
    }

    async clearClientType(){
        await this.clickOnElement(ShiftJobLocators.clientTypeClearIcon);
    }

    async clickOnEmailSmsPushNotificationLogButton(){
        await this.clickOnElement(ShiftJobLocators.emailSmsPushNotificationLog)
    }

    async clickOnCommunicationChannelRadioButton(index: number){
        await this.clickOnElement(ShiftJobLocators.communicationChannelRadioButtons(index))
    }

    async clickOnUnassignCandidateButton(){
        await this.clickOnElement(ShiftJobLocators.unassignCandidateButton);
    }

    async confirmUnassignCandidateByClickingYes(){
        await this.clickOnElement(ShiftJobLocators.confirmUnassignCandidateButton);
    }

    async closeLogsModal(){
        await this.clickOnElement(ShiftJobLocators.closeLogsModalButton)
    }

    async searchAndVerifyShiftJobInTable(email: string, candidateName: string ) {
        await this.clickOnTableSection();
        await this.clickOnElement(DashboardLocators.searchIcon);
        await this.filterByFamilies(email);
        await this.page.waitForTimeout(5000);
        //await this.clickOnRefreshButtonTable();
        await this.verifyNewlyCreatedShiftJobIsVisibleOnTable(candidateName);
    }
    async searchAndVerifyShiftJobInTableOnMobile(email: string, candidateName: string ) {
        await this.page.locator(ShiftJobLocators.tableMobile).nth(1).click();
        await this.clickOnElement(DashboardLocators.searchIcon);
        await this.filterByFamilies(email);
        await this.verifyNewlyCreatedShiftJobIsVisibleOnTable(candidateName);
    }
    async selectDropdownOptionByIndex(optionValue: string) {
        const dropdown = this.page.locator('(//select[contains(@class, "form-control")])[1]');
        await dropdown.selectOption({ value: optionValue });
    }

    async selectBookingCategory(category: string) {
        const dropdownButton = this.page
            .locator('[data-test-id="drop-down-with-label"]')
            .nth(1);

        await dropdownButton.click();
        const select = this.page.locator('select.form-control').nth(1);
        await select.selectOption({ label: category });

    }

    async filterByFamilies(email: string) {
        const multiselect = this.page
            .locator('[data-test-id="multiselect-select-client"]')
            .nth(0);

        await multiselect.click();

        const inputClient = this.page.locator('[id="multiselect-select-client"]');
        const suggestion = this.page.locator('//span[contains(text(),"testuser@enginehire.ca")]');
        await inputClient.fill(email);
        await suggestion.click();
    }

    async deleteShiftJobFromTheTable() {
        const checkbox = this.page.locator(ShiftJobLocators.allJobsCheckboxInTable);
        const row = this.page.locator('tr[data-test-id="data-table-row"]', {hasText: /test candidate|test user|Requested|Broadcasted/});
        await this.clickOnRefreshButtonTable();

        await expect(row.first()).toBeVisible();
        await checkbox.check();

        // Proceed with deletion
        const deleteButton = this.page.locator(ShiftJobLocators.deleteSelectedButton);
        await deleteButton.waitFor({ state: 'visible', timeout: 5000 });
        await deleteButton.click();

        const confirmButton = this.page.locator(ShiftJobLocators.confirmDelete);
        await confirmButton.waitFor({ state: 'visible', timeout: 5000 });
        await confirmButton.click();

        console.log('✅ Shift job successfully deleted');
    }

    async clickSecondClearButton() {
        const clearButtons = this.page.locator('[class="vdp-datepicker__clear-button input-group-append"]');

        // Ensure at least 2 exist
        const count = await clearButtons.count();
        if (count < 2) {
            throw new Error('Less than 2 clear buttons found.');
        }

        // Scroll to the second and click
        const secondButton = clearButtons.nth(1);
        await secondButton.scrollIntoViewIfNeeded();
        await secondButton.click({ force: true });
    }

    async uncheckBroadcastCheckbox() {
        const broadcastCheckbox = this.page.locator(ShiftJobLocators.broadcastCheckbox);
        await broadcastCheckbox.evaluate((el: HTMLInputElement) => {
            el.checked = false;
            el.dispatchEvent(new Event('change', { bubbles: true }));
            el.dispatchEvent(new Event('input', { bubbles: true }));
        });
    }

    async verifyNewlyCreatedShiftJobIsVisibleOnTable(candidateName: string){
        const shiftJobRow = this.page
            .locator('[data-test-id="data-table-row"]')
            .filter({
                has: this.page.locator('span').filter({ hasText: candidateName }),
            });

        await this.clickOnRefreshButtonTable();
        await expect(shiftJobRow.first()).toBeVisible();
    }

    async verifyShiftJobCurrentStatus(status: string){
        await this.validateElementIsVisibleWithText(ShiftJobLocators.shiftJobStatus(status), `Current Status: ${status}`);
    }

    async verifyConfirmUnassignCandidateModalTextIsVisible(){
        await this.validateElementIsVisibleWithText(ShiftJobLocators.confirmUnassignCandidateModalText,'Are you sure you want to unassign test?');
    }

    async verifyUnassignedCandidateTextIsVisible(){
        await this.validateElementIsVisibleWithText(ShiftJobLocators.unassignedCandidateText,'candidate is unassigned');
    }

    async openCreatedShiftJobFromTable(email: string){
        await this.clickOnTableSection();
        await this.clickOnElement(DashboardLocators.searchIcon);
        await this.filterByFamilies(email);
        await this.clickOnRefreshButtonTable();
        const shiftJobRow = this.page.locator('[data-test-id="data-table-row"]').nth(0);
        await shiftJobRow.click();
    }

    async verifyBroadcastCheckboxState(expectedState: 'checked' | 'unchecked') {
        const broadcastCheckbox = this.page.locator(ShiftJobLocators.broadcastCheckbox);
        const isChecked = await broadcastCheckbox.isChecked();

        // Assert the expected state
        if (expectedState === 'checked') {
            expect(isChecked).toBe(true);
        } else if (expectedState === 'unchecked') {
            expect(isChecked).toBe(false);
        }
    }

    async closeCreatedShiftJobModal() {
        await this.clickOnElement(ShiftJobLocators.createdShiftJobModal)
    }

    async selectBookingSection(name: string) {
        const selectBookingSection = this.page.locator(ShiftJobLocators.bookingSection).nth(2);
        const field = this.page.locator(ShiftJobLocators.inputBookingSection);
        await selectBookingSection.click();
        await field.click();
        await field.fill(name);
        const option = this.page.locator('//span[contains(text(), "Temporary Bookings Staging")]');
        await option.waitFor({state: "visible"});
        await option.click();
    }

    async submitShiftJobForm(
        projectName: string,
        bookingSection: string,
        assignCandidate: boolean = true,
        uncheckBroadcastCheckbox: boolean = false,
        verifyCheckedBroadcastCheckbox: boolean = false,
        verifyUncheckedBroadcastCheckbox: boolean = false
    ) {
        const env = (projectName ?? "").toLowerCase();
        const isStagingOrLocal =
            env.includes("staging") ||
            env.includes("localhost") ||
            env.includes("local");
        const isProd = env.includes("prod") || env.includes("dev");

        await this.selectBookingSection(bookingSection);
        await this.selectRandomTime();
        await this.writeNote("test note");
        await this.numberFillerNeededDropdown();
        await this.selectBookingCategory("Babysitter");

        await this.selectFamilies("testuser@enginehire.ca");

        if (assignCandidate) {
            await this.assignCandidate("testcandidate@enginehire.ca");
        }

        await this.fillBookingAddress("456 Demo St, Brooklyn, NY 11201");

        if (isStagingOrLocal) {
            await this.enterAddressLine2("test address 2");
            await this.fillCity("New York");
            await this.fillProvince("Brooklyn");
            await this.fillZipCode("11201");
        }

        if (uncheckBroadcastCheckbox) {
            await this.uncheckBroadcastCheckbox();
        }

        if (verifyCheckedBroadcastCheckbox) {
            await this.verifyBroadcastCheckboxState('checked');
        }

        if (verifyUncheckedBroadcastCheckbox) {
            await this.verifyBroadcastCheckboxState('unchecked');
        }

        await this.submitForm();
    }
    async goToBroadcast() {
        const settings = this.page.locator('span[class="ml-1 more-icon web-only"] i').first();
        await expect(settings).toBeAttached();
        await expect(settings).toBeEnabled();
        await settings.scrollIntoViewIfNeeded();
        await settings.click();

        const broadcastBtn = this.page.locator('//button[contains(text(),"Broadcast")]');
        await broadcastBtn.waitFor({ state: 'visible' });
        await broadcastBtn.evaluate(el => (el as HTMLElement).click());
    }
    async uncheckCheckboxes() {
        const checkboxes = [
            'div input[data-test-id="checkbox-item-hide_already_booked_candidates"]',
            'div input[data-test-id="checkbox-item-hide_time_off_candiates"]',
            'div input[data-test-id="checkbox-item-hide_unavailable_candidates"]',
        ];

        for (const checkbox of checkboxes) {
            const locator = this.page.locator(checkbox);
            const isChecked = await locator.isChecked();
            if (isChecked) {
                await locator.evaluate((el: HTMLInputElement) => {
                    el.checked = false;
                    el.dispatchEvent(new Event('change', { bubbles: true }));
                    el.dispatchEvent(new Event('input', { bubbles: true }));
                });
            }
        }
    }

    async clearFilters() {
        const tagIcon = this.page.locator('[class="multiselect__tags"]');

        try {
            await tagIcon.nth(0).waitFor({ state: 'visible', timeout: 5000 });
            await tagIcon.nth(0).click();
        } catch (error) {
            console.log('Tag icon is not visible, continuing the test...');
        }

        try {
            await tagIcon.nth(0).waitFor({ state: 'visible', timeout: 5000 });
            await tagIcon.nth(0).click();
        } catch (error) {

            console.log('Tag icon is not visible on second check, continuing the test...');
        }
    }

   async validateOnlyOneConflictSectionIsVisible(){
       const conflicts = this.page.locator(ShiftJobLocators.conflictSectionTitle);

       await expect(conflicts).toHaveCount(1);
       await expect(conflicts).toBeVisible();
    }


    async validateDistanceIsVisible() {
        const distance = this.page.locator('[class="cell-content"]').nth(7);
        expect(distance.isVisible());
    }
    async validateClientAndCandidatesDropdowns(
        projectName: string,
        bookingSection: string,
        clientEmail: string,
        candidateEmail:string) {
        // const env = (projectName ?? "").toLowerCase();
        // const isProd = env.includes("prod") || env.includes("dev");
        // const isStagingOrLocal =
        //     env.includes("staging") ||
        //     env.includes("localhost") ||
        //     env.includes("local");

        // if (isProd) {
            await this.selectBookingSection(bookingSection);
            await this.selectFamilies(clientEmail);
            await this.page.waitForTimeout(10000)
            await expect(
                this.page.locator(`(//div[@data-test-id="multi-select-with-label-poster"])[3]`)
            ).toContainText(clientEmail);
            await this.assignCandidate(candidateEmail);
            const CandidateEmailText = this.page.locator(ShiftJobLocators.candidateEmailInform).nth(0);
            await expect(CandidateEmailText).toContainText(candidateEmail);
        // }

        // if (isStagingOrLocal) {
        //     await this.selectBooingSectionStaging(bookingSection);
        //     await this.selectFamiliesStaging(clientEmail);
        //     await this.page.waitForTimeout(10000)
        //     await expect(
        //         this.page.locator('(//div[@data-test-id="multi-select-with-label-poster"])[3]')
        //     ).toContainText(clientEmail);
        //     await this.assignCandidateStaging(candidateEmail);
        //
        // }
        // await this.selectFamilies(clientEmail);
        // await this.page.waitForTimeout(10000)
        // await expect(
        //     this.page.locator(`(//div[@data-test-id="multi-select-with-label-poster"])[3]`)
        // ).toContainText(clientEmail);


    }
    async performMultipleYesClicks(times: number, delayMs: number = 10000) {
        const yesBtn = this.page.getByRole('button', { name: 'Yes' });

        for (let i = 0; i < times; i++) {
            await this.page.waitForTimeout(delayMs);

            if (await yesBtn.isVisible() && await yesBtn.isEnabled()) {
                await this.clickOnYesButton();
                await yesBtn.waitFor({ state: 'hidden', timeout: 1000 }).catch(() => {});
            }
        }
    }

    async performMultipleDontSendClicks(times: number = 3, delayMs: number = 10000) {
        const clientPage = new ClientPage(this.page);
        const dontSend = this.page.getByRole('button', { name: /^don'?t send$/i });

        for (let i = 0; i < times; i++) {
            const appeared = await dontSend
                .waitFor({ state: 'visible', timeout: 5000 })
                .then(() => true)
                .catch(() => false);

            if (!appeared) {
                break;
            }

            const handle = await dontSend.elementHandle();
            if (!handle) break;

            await clientPage.clickOnDontSendButton();

            await handle.waitForElementState('visible', { timeout: 5000 }).catch(() => {});

            if (i < times - 1) {
                await this.page.waitForTimeout(delayMs);
            }
        }
    }

    async sendEmailMultipleTimes(times: number, delayMs: number) {
        for (let i = 0; i < times; i++) {
            await this.clickOnSendEmailButton();
            await this.page.waitForTimeout(delayMs);
        }
    }

    async handleDontSendPopupSequence() {
        const popup = this.page.locator('.dialog-container').first();
        const clientPage = new ClientPage(this.page)

        // First 2 times: focus + Don't Send
        for (let i = 0; i < 2; i++) {
            await popup.focus();
            await clientPage.clickOnDontSendButton();
        }

        // Wait and focus + Cancel
        await this.page.waitForTimeout(2000);
        await popup.focus();
        await this.clickOnCancelButton();

        // Final wait + Don't Send
        await this.page.waitForTimeout(2000);
        await clientPage.clickOnDontSendButton();

        await this.page.waitForTimeout(2000);
    }

    async getBookingDateText(): Promise<string> {
        const rawText = await this.page.locator('h3.dialog-title span').textContent();
        return rawText?.replace('Add a booking – ', '').trim() || '';
    }

    async getLatestEmailDateText(): Promise<string> {
        // Adjust the locator as needed to only get the FIRST/latest log block
        const rawDate = await this.page.locator('p:has-text("Date:")').first().textContent();
        return rawDate?.replace('Date:', '').trim() || '';
    }

    async clickOnSendSmsButton(){
        await this.clickOnElement(ShiftJobLocators.sendButton)
    }

    async selectChannel(index: number){
        const channelLocator = this.page.locator(ShiftJobLocators.channelCard).nth(index);
        await channelLocator.click();
    }
    async validateSendEmailButtonIsVisibleOnMobile() {
        const sendEmailButton = this.page.locator(ShiftJobLocators.sendEmail);
        expect(sendEmailButton).toBeVisible();
    }
    async searchInTable(email:string) {
            await this.clickOnTableSection();
            await this.clickOnElement(DashboardLocators.searchIcon);
            await this.filterByFamilies(email);
    }
    async searchInTableMobile(email:string) {
        await this.page.locator('//span[contains(text(),"table")]').nth(1).click();
        await this.clickOnElement(DashboardLocators.searchIcon);
        await this.filterByFamilies(email);
    }

    async validateClientsDropdown(projectName:string, bookingSection: string, candidateEmail:string, clientEmail: string) {
        const userNames: string[] = [];
        const env = (projectName ?? "").toLowerCase();
        const isProd = env.includes("prod") || env.includes("dev");
        if (isProd) {
            await this.selectBookingSection(bookingSection);
        }
        await this.page.waitForTimeout(3000);
        await this.selectFamilies(clientEmail);
        const items = this.page.locator(ShiftJobLocators.clientsInDropdown);
        const count = await items.count();
        for(let i = 0; i < count; i++) {
            const text: string = await items.nth(i).innerText();
            userNames.push(text);
        }
        console.log(userNames);
        expect(userNames).not.toContain(candidateEmail);
    }
    async validateCandidatesDropdown(clientEmail:string) {
        const candidateNames: string[] = [];
        let isTrue = true;
        await this.page.locator(ShiftJobLocators.candidatesDropdown).nth(2).click();
        while (isTrue) {
            let i = 0;
            try {
                await this.page.locator(ShiftJobLocators.candidatesDropdown).nth(2).click();
                await this.page.locator(`[id="multi-select-with-label-filler-${i}"]`).click();
                const text = await this.page.locator(ShiftJobLocators.candidatesDropdown).nth(2).innerText();

                i++
                if (candidateNames.includes(text)) {
                    isTrue = false;
                }
                else {
                    candidateNames.push(text);
                }
            }
            catch (err) {
                if (err instanceof Error) console.error(err.message);
                else console.error('Unknown error', err);
                isTrue = false;
            }

        }
        console.log(candidateNames);
        expect(candidateNames).not.toContain(clientEmail);
    }
    async validateShiftJobFormClosed() {
        const shiftJobForm = this.page.locator(ShiftJobLocators.shiftJobFormTitle);
        await expect(shiftJobForm).not.toBeVisible();
    }
    async validateEmailIsSentAndVisible() {
        const search = this.page.locator('//i[contains(text(), "search")]');
        const filter = this.page.locator('[data-test-id="multiselect-select-candidate"]').first();
        const input = this.page.locator('[data-test-id="multiselect-select-candidate"] input');
        const canEmail = 'testcandidate@enginehire.ca';
        const suggestion = this.page.locator('//span[contains(text(), "test candidate - testcandidate@enginehire.ca")]');
        const listEmails = this.page.locator('[class="log-item--body--items"]');
        const items = this.page.locator('[class="item"]');
        const count = await items.count();

        await search.click();
        await filter.click();
        await input.fill(canEmail);
        await suggestion.click();
        await this.page.waitForTimeout(3000);
        await listEmails.scrollIntoViewIfNeeded();
        await expect(listEmails).toBeVisible();
        expect(count).toBeGreaterThan(0);
        console.log('Received email amount: ', count);
    }
   async verifyWeekdaysAreVisible() {
        const weekdays = this.page.locator(ShiftJobLocators.calendarWeekdays);
        await expect(weekdays).toHaveCount(7);
   }
   async verifyDaysAreVisible() {
       const days = this.page.locator(ShiftJobLocators.calendarDays);
       const countDays = await days.count();
       expect(countDays).toBeGreaterThan(0)

       for(let i = 0 ; i < countDays; i++) {
           await expect(days.nth(i)).toBeVisible();
       }
   }
   async verifyRowsAreVisible() {
       const weeks = this.page.locator(ShiftJobLocators.calendarRows);
       await expect(weeks).toBeVisible();
   }
   async clickOnRefreshButtonTable() {
        await this.clickOnElement(ShiftJobLocators.refreshButton);
   }

   async clickOnMultiDayShiftsAndVerifyIsOpened() {
        await this.clickOnElement(ShiftJobLocators.multiDayShifts);
        const modal = this.page.locator('[class="mds-dialog-box"]').first();
        await modal.waitFor({state: "attached"});
        await expect(modal).toBeVisible();
   }

   async verifyMultiDayShiftInPastDateIsNotWorking() {
       const pastDateButton = this.page
           .locator('button.mds-cell.mds-cell--past')
           .first();

       await expect(pastDateButton).toBeVisible({ timeout: 10000 });

       const isClickable = await pastDateButton
           .click({ trial: true, timeout: 3000 })
           .then(() => true)
           .catch(() => false);

       if (!isClickable) {
           console.log('Submit job in past date is not possible');
           return;
       }

       throw new Error('Bug, past date button is clickable');
   }

   async verifyMultiDayShiftFunctionality(projectName: string) {
       const isStaging = projectName.includes("staging") || projectName.includes("stage");
       const isProd = projectName.includes("production") || projectName.includes("prod");

       const days = await this.page.$$('[class="mds-cell"]');

       const futureDayIndices = [];
       for (let i = 0; i < days.length; i++) {
           const className = await days[i].getAttribute('class');
           if (!className?.includes('past') && !className?.includes('disabled')) {
               futureDayIndices.push(i);
           }
       }

       if (futureDayIndices.length === 0) {
           throw new Error('No selectable future calendar days found.');
       }

       const randomIndex = futureDayIndices[Math.floor(Math.random() * futureDayIndices.length)];
       const randomDay = days[randomIndex];
       const dayBox = await randomDay.boundingBox();

       const clickedDayText = await randomDay.textContent();
       console.log(`Clicked day text: "${clickedDayText?.trim()}"`);

       await randomDay.click({force: true});

       if (isProd) {
           const apply = this.page.locator('[class="btn btn-primary mds-apply-btn"]').nth(0);
           await apply.click();
       }

       if (isStaging) {
           const apply = this.page.locator('[class="btn btn-primary mds-apply-btn"]').nth(1);
           await apply.click();
       }

       await this.page.waitForSelector('[class*="cv-event calendar-cv-event"]', { timeout: 10000 });

       const allJobs = this.page.locator('[class*="cv-event calendar-cv-event"]');
       const jobCount = await allJobs.count();

       const columnXPositions = new Set<number>();
       for (let i = 0; i < jobCount; i++) {
           const jobBox = await allJobs.nth(i).boundingBox();
           if (jobBox) columnXPositions.add(Math.round(jobBox.x));
       }

       const sortedColumns = Array.from(columnXPositions).sort((a, b) => a - b);

       const dayCenterX = dayBox!.x + dayBox!.width / 2;
       let closestColumnIndex = 0;
       let minDistance = Infinity;
       for (let i = 0; i < sortedColumns.length; i++) {
           const distance = Math.abs(sortedColumns[i] - dayCenterX);
           if (distance < minDistance) {
               minDistance = distance;
               closestColumnIndex = i;
           }
       }

       const expectedJobX = sortedColumns[closestColumnIndex];

       let jobFoundInCorrectColumn = false;
       for (let i = 0; i < jobCount; i++) {
           const jobBox = await allJobs.nth(i).boundingBox();
           if (jobBox && Math.round(jobBox.x) === expectedJobX) {
               jobFoundInCorrectColumn = true;
               break;
           }
       }

       console.log(`---- SUMMARY ----`);
       console.log(`Day clicked: "${clickedDayText?.trim()}"`);
       console.log(`Job found in correct column: ${jobFoundInCorrectColumn}`);
       console.log(`----------------`);

       expect(jobFoundInCorrectColumn).toBe(true);
   }

    async deleteLastCreatedJob() {
        const allJobs = this.page.locator('[class*="cv-event calendar-cv-event"]')
            .filter({ has: this.page.locator('[title*="Broadcasted"]') });
        await allJobs.first().click();
        await this.page.waitForTimeout(10000)
        // const jobCount = await allJobs.count();
        //
        // if (jobCount === 0) {
        //     throw new Error('No jobs found in calendar view');
        // }
        //
        // const lastJob = allJobs.nth(jobCount - 1);
        // const jobText = await lastJob.textContent();
        // console.log(`[DEBUG] Clicking job #${jobCount - 1}: "${jobText?.trim()}"`);
        //
        // await lastJob.scrollIntoViewIfNeeded();
        // await lastJob.dispatchEvent('click');
        //
        // console.log(`[DEBUG] Clicked last created job: "${jobText?.trim()}" successfully`);
    }


}
    // async selectSmartStartAndEndTime() {
    //     // Wait until both Start and End time inputs are rendered
    //     await this.page.waitForFunction(() => {
    //         return document.querySelectorAll('input[placeholder="hh:mm A"]').length >= 2;
    //     }, null, { timeout: 10000 });
    //
    //     const timeInputs = await this.page.$$('input[placeholder="hh:mm A"]');
    //     if (timeInputs.length < 2) throw new Error('Start or End time inputs not found');
    //
    //     // Define possible time values
    //     const hours = Array.from({ length: 12 }, (_, i) => i + 1); // 1 to 12
    //     const minutes = ['00', '15', '30', '45'];
    //     const ampm = ['AM', 'PM'];
    //
    //     // Random Start Time
    //     const startHour = hours[Math.floor(Math.random() * hours.length)];
    //     const startMinute = minutes[Math.floor(Math.random() * minutes.length)];
    //     const startAmPm = ampm[Math.floor(Math.random() * ampm.length)];
    //
    //     // Convert to 24-hour for time math
    //     const start24h = startAmPm === 'AM'
    //         ? (startHour === 12 ? 0 : startHour)
    //         : (startHour === 12 ? 12 : startHour + 12);
    //     const startMinutesTotal = start24h * 60 + parseInt(startMinute);
    //
    //     // Valid End Time: +60–240 min
    //     const validEndMinutes = startMinutesTotal + 60 + Math.floor(Math.random() * 180); // +1 to +4 hrs
    //     const endHour24 = Math.floor(validEndMinutes / 60) % 24;
    //     const endMinute = minutes[Math.floor(Math.random() * minutes.length)];
    //     const endAmPm = endHour24 >= 12 ? 'PM' : 'AM';
    //     const endHour12 = endHour24 % 12 === 0 ? 12 : endHour24 % 12;
    //
    //     // Select both times
    //     await this.selectTimeByIndex(0, startHour, startMinute, startAmPm as 'AM' | 'PM');
    //     await this.selectTimeByIndex(1, endHour12, endMinute, endAmPm as 'AM' | 'PM');
    // }
    //
    //
    //
    // async selectTimeByIndex(
    //     index: number,
    //     hour: number | string,
    //     minute: string,
    //     period: 'AM' | 'PM'
    // ) {
    //     const inputs = await this.page.$$('input[placeholder="hh:mm A"]');
    //     if (inputs.length <= index) throw new Error(`Time input at index ${index} not found`);
    //
    //     // Blur if needed
    //     if (index === 1 && inputs.length > 1) {
    //         await this.page.evaluate(() => {
    //             const i = document.querySelectorAll('input[placeholder="hh:mm A"]')[0] as HTMLInputElement;
    //             i?.blur();
    //         });
    //
    //         // Wait for first dropdown to close
    //         await this.page.waitForFunction(() => {
    //             const d = document.querySelector('.vue__time-picker-dropdown');
    //             return d && getComputedStyle(d).display === 'none';
    //         }, null, { timeout: 5000 });
    //     }
    //
    //     // Focus & click target input
    //     await this.page.evaluate((el) => {
    //         const input = el as HTMLInputElement;
    //         input.focus();
    //         input.click();
    //     }, inputs[index]);
    //
    //     // Wait for a visible dropdown container
    //     const dropdown = this.page.locator('.vue__time-picker-dropdown');
    //     await dropdown.waitFor({ state: 'visible', timeout: 10000 });
    //
    //     // Click hour
    //     const hourStr = hour.toString().padStart(2, '0');
    //     const hourOption = dropdown.locator(`ul.hours li`, { hasText: hourStr }).first();
    //     await hourOption.click();
    //
    //     // Click minute
    //     const minuteOption = dropdown.locator(`ul.minutes li`, { hasText: minute }).first();
    //     await minuteOption.click();
    //
    //     // Click AM/PM
    //     const ampmOption = dropdown.locator(`ul.ampm li`, { hasText: period }).first();
    //     if (!(await ampmOption.count())) {
    //         // fallback: use 3rd column (if no .ampm class)
    //         const fallbackOption = dropdown.locator(`ul:nth-of-type(3) li`, { hasText: period }).first();
    //         await fallbackOption.click();
    //     } else {
    //         await ampmOption.click();
    //     }
    // }

    // async selectTimeByIndex(index: number, hour: string, minute: string, period: 'AM' | 'PM') {
    //     const inputs = await this.page.$$('input.display-time[placeholder="hh:mm A"]');
    //     if (inputs.length <= index) throw new Error(`Time input at index ${index} not found`);
    //
    //     // Blur the first before going to second
    //     if (index === 1) {
    //         await this.page.evaluate(() => {
    //             const first = document.querySelectorAll('input.display-time[placeholder="hh:mm A"]')[0] as HTMLInputElement;
    //             first?.blur();
    //         });
    //         await this.page.waitForTimeout(300);
    //     }
    //
    //     await inputs[index].click({ force: true });
    //
    //     const dropdown = this.page.locator('div.dropdown.drop-down.vue__time-picker-dropdown');
    //     await dropdown.waitFor({ state: 'visible', timeout: 5000 });
    //
    //     const hourLocator = dropdown.locator('ul.hours li', { hasText: hour });
    //     const minuteLocator = dropdown.locator('ul.minutes li', { hasText: minute });
    //     const ampmLocator = dropdown.locator('ul.ampm li', { hasText: period });
    //
    //     await hourLocator.first().click();
    //     await minuteLocator.first().click();
    //     if (await ampmLocator.count()) await ampmLocator.first().click();
    //
    //     await inputs[index].evaluate((el: any) => el.blur());
    //     await this.page.waitForTimeout(200);
    //
    //     console.log(`✅ Set time ${hour}:${minute} ${period} for input ${index}`);
    // }


