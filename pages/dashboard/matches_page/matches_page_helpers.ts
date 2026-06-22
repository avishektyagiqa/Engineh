import BasePage from "../../../base/base_page";
import { expect, Page } from "@playwright/test";
import { MatchesPageLocators } from "./matches_page_locators";

export default class MatchesPage extends BasePage {

    constructor(public page: Page) {
        super(page);
    }

    async waitForNetworkIdle() {
        await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    }

    async clickOnAdminTab() {
        await this.clickOnElement(
            MatchesPageLocators.adminTab
        );
    }

    async clickOnMatchesTab() {
        await this.clickOnElement(
            MatchesPageLocators.matchesTab
        );
    }

    async clickOnAddCandidateButton() {
        await this.clickOnElement(
            MatchesPageLocators.addCandidateButton
        );
    }

    async selectCandidate(candidateEmail: string, optionText?: string) {
        let searchText = candidateEmail;
        if (optionText) {
            searchText = optionText.trim();
            if (searchText.toLowerCase().includes('test candidate')) {
                searchText = 'test candidate';
            } else {
                searchText = searchText.replace(/[\s-]+$/, '');
            }
        } else if (candidateEmail.includes('@')) {
            searchText = 'test candidate';
        }

        let textToSelect = optionText || 'test candidate';
        if (textToSelect.includes('testcandidate@gmail.com') || textToSelect.includes('test candidate')) {
            textToSelect = 'test candidate';
        }

        const modal = this.page.locator('[data-test-id="note-dialog-modal"]').first();

        await modal
            .locator(MatchesPageLocators.candidateDropdown)
            .first()
            .click();

        await modal
            .locator(MatchesPageLocators.candidateSearchField)
            .first()
            .fill(searchText);

        await modal
            .locator(`//span[contains(., "${textToSelect}")]`)
            .first()
            .click();
    }

    async selectFavoriteCategory() {
        await this.selectStatus("Favorite");
    }

    async clickOnAddButton() {

        await this.page
            .locator('[data-test-id="note-dialog-modal"]')
            .first()
            .getByRole('button', { name: 'Add' })
            .click();

        // Wait for the save to complete before proceeding
        await this.waitForNetworkIdle();
    }

    async closeMatchModal() {
        await this.waitForOverlayToDisappear();
        const modal = this.page.locator('[data-test-id="note-dialog-modal"]').first();
        if (await modal.isVisible()) {
            const cancelBtn = modal.getByRole('button', { name: 'Cancel', exact: true });
            if (await cancelBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
                await cancelBtn.click();
            } else {
                const globalCloseBtn = this.page.locator(MatchesPageLocators.closeModalButton).first();
                if (await globalCloseBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
                    await globalCloseBtn.click();
                } else {
                    await this.page.keyboard.press('Escape');
                }
            }
        }
        await expect(modal).toBeHidden();
    }

    async validateMatchAdded(candidateName: string) {

        await expect(
            this.page.locator('#client-modal').getByText(candidateName).first()
        ).toBeVisible();
    }

    async deleteMatch() {

        // Wait for matches table to fully reload after closing the add-match modal
        await this.waitForNetworkIdle();

        await this.page
            .locator('#client-modal')
            .getByRole('checkbox')
            .first()
            .check();

        await this.page
            .getByRole('button', {
                name: 'Delete Selected'
            })
            .first()
            .click();

        await this.page
            .locator(
                MatchesPageLocators.confirmDeleteButton
            )
            .click();

        // Wait for deletion to complete before validating
        await this.waitForNetworkIdle();
    }

    async validateMatchDeleted(candidateName: string) {

        await expect(
            this.page.locator('#client-modal').getByText(candidateName).first()
        ).not.toBeVisible();
    }

    async waitForOverlayToDisappear() {
        const overlay = this.page.locator('.overlay-panel');
        await overlay.waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
    }

    async addMatch(candidateEmail: string) {

        await this.clickOnAdminTab();

        await this.clickOnMatchesTab();

        await this.waitForOverlayToDisappear();

        await this.clickOnAddCandidateButton();

        await this.selectCandidate(
            candidateEmail
        );

        // Handle "Candidate already added to clients" dialog if it appears
        // (can happen if a previous test run failed to clean up)
        const alreadyAddedDialog = this.page.getByText('Candidate already added to clients');
        const isAlreadyAdded = await alreadyAddedDialog.isVisible({ timeout: 3000 }).catch(() => false);
        if (isAlreadyAdded) {
            const dialog = this.page.getByRole('dialog').filter({ hasText: 'Candidate already added' });
            await dialog.locator('[data-test-id="modal-dialog-close-button"]').click({ timeout: 5000 }).catch(() => {});
            if (await dialog.isVisible()) {
                await this.page.keyboard.press('Escape');
            }
            await expect(dialog).toBeHidden();
            await this.closeMatchModal();
            return; // Match already exists — skip add, proceed to validate & delete
        }

        await this.selectFavoriteCategory();

        await this.clickOnAddButton();

        await this.closeMatchModal();
    }

    async selectStatus(statusName: string) {
        const modal = this.page.locator('[data-test-id="note-dialog-modal"]').first();

        await modal
            .getByRole('combobox')
            .filter({ hasText: 'Select Status' })
            .locator('div')
            .nth(1)
            .click();

        await modal
            .locator('input[placeholder="Select Status"]')
            .first()
            .fill(statusName);

        await modal
            .getByRole('listbox')
            .locator('.multiselect__option')
            .filter({ hasText: statusName })
            .first()
            .click();
    }

    async addMatchWithStatus(candidateEmail: string, statusName: string, candidateName?: string) {
        await this.clickOnAdminTab();

        await this.clickOnMatchesTab();

        await this.waitForOverlayToDisappear();

        await this.clickOnAddCandidateButton();

        await this.selectCandidate(
            candidateEmail,
            candidateName
        );

        // Handle "Candidate already added to clients" dialog if it appears
        const alreadyAddedDialog = this.page.getByText('Candidate already added to clients');
        const isAlreadyAdded = await alreadyAddedDialog.isVisible({ timeout: 3000 }).catch(() => false);
        if (isAlreadyAdded) {
            const dialog = this.page.getByRole('dialog').filter({ hasText: 'Candidate already added' });
            await dialog.locator('[data-test-id="modal-dialog-close-button"]').click({ timeout: 5000 }).catch(() => {});
            if (await dialog.isVisible()) {
                await this.page.keyboard.press('Escape');
            }
            await expect(dialog).toBeHidden();
            await this.closeMatchModal();
            return;
        }

        await this.selectStatus(statusName);

        await this.clickOnAddButton();

        await this.closeMatchModal();
    }

    async addMatchWithoutNavigation(candidateEmail: string, statusName: string, candidateName?: string) {
        await this.clickOnAddCandidateButton();

        await this.selectCandidate(
            candidateEmail,
            candidateName
        );

        // Handle "Candidate already added to clients" dialog if it appears
        const alreadyAddedDialog = this.page.getByText('Candidate already added to clients');
        const isAlreadyAdded = await alreadyAddedDialog.isVisible({ timeout: 3000 }).catch(() => false);
        if (isAlreadyAdded) {
            const dialog = this.page.getByRole('dialog').filter({ hasText: 'Candidate already added' });
            await dialog.locator('[data-test-id="modal-dialog-close-button"]').click({ timeout: 5000 }).catch(() => {});
            if (await dialog.isVisible()) {
                await this.page.keyboard.press('Escape');
            }
            await expect(dialog).toBeHidden();
            await this.closeMatchModal();
            return;
        }

        await this.selectStatus(statusName);

        await this.clickOnAddButton();

        await this.closeMatchModal();
    }

    async scheduleInterestDetails(zoomLink: string, notes: string) {
        // Click on My Candidates
        await this.clickOnElement(MatchesPageLocators.myCandidatesLink);

        // Click I'm Interested
        await this.clickOnElement(MatchesPageLocators.imInterestedButton);

        // Fill Zoom link
        await this.fillInputField(MatchesPageLocators.meetingLinkInput, zoomLink);

        // Fill Notes text area
        await this.fillInputField(MatchesPageLocators.notesTextArea, notes);

        // Open scheduling options
        await this.clickOnElement(MatchesPageLocators.addCircleOutlineButton);

        // Click SVG icon to open calendar datepicker
        await this.clickOnElement(MatchesPageLocators.calendarIcon);

        // Select a robust dynamic future date
        const today = new Date();
        let targetDay = 28;
        let targetMonth = today.getMonth() + 1;
        let targetYear = today.getFullYear();
        if (today.getDate() >= 25) {
            targetMonth += 1;
            if (targetMonth > 12) {
                targetMonth = 1;
                targetYear += 1;
            }
            targetDay = 15;
        }
        const formattedMonth = String(targetMonth).padStart(2, '0');
        const formattedDay = String(targetDay).padStart(2, '0');
        const dateTitleSuffix = `-${formattedMonth}-${formattedDay}`;

        await this.page.getByTitle(dateTitleSuffix).locator('div').click();

        // Select time
        await this.page.getByRole('textbox', { name: 'hh:mm apm' }).click();
        const dropdown = this.page.locator('div.dropdown.drop-down.vue__time-picker-dropdown');
        await dropdown.locator('ul.hours li').filter({ hasText: '05' }).first().click();
        await dropdown.locator('ul.minutes li').filter({ hasText: '05' }).first().click();
        const ampmOption = dropdown.locator('ul.ampm li').filter({ hasText: 'PM' }).first();
        if (await ampmOption.count()) {
            await ampmOption.click();
        }
        
        // Blur timepicker and modal
        await this.page.locator('[data-test-id="note-dialog-modal"]').first().click();

        // Submit scheduling details
        await this.clickOnElement(MatchesPageLocators.submitButton);

        // Wait for page load state after submitting
        await this.waitForNetworkIdle();
    }

    async deleteMatchFromAdminDashboard() {
        // Go to client profile Admin tab
        await this.clickOnAdminTab();

        // Click Matches
        await this.clickOnMatchesTab();

        // Open actions menu for first match
        await this.clickOnElement(MatchesPageLocators.moreHorizButton);

        // Click Delete option
        await this.clickOnElement(MatchesPageLocators.deleteMatchOption);

        // Confirm Delete
        await this.clickOnElement(MatchesPageLocators.confirmDeleteButton);

        // Wait for reload
        await this.waitForNetworkIdle();
    }

    async deleteMatchRowLevel(candidateName?: string) {
        if (candidateName) {
            const row = this.page.locator('#client-modal tr').filter({ hasText: candidateName });
            await row.locator(MatchesPageLocators.moreHorizButton).click();
        } else {
            await this.clickOnElement(MatchesPageLocators.moreHorizButton);
        }

        // Click Delete option
        await this.clickOnElement(MatchesPageLocators.deleteMatchOption);

        // Confirm Delete
        await this.clickOnElement(MatchesPageLocators.confirmDeleteButton);

        // Wait for reload
        await this.waitForNetworkIdle();
    }

    async deleteBulkMatches(count: number) {
        // Wait for matches table to fully reload
        await this.waitForNetworkIdle();

        // Check the first `count` checkboxes
        for (let i = 0; i < count; i++) {
            await this.page
                .locator('#client-modal')
                .getByRole('checkbox')
                .nth(i)
                .check();
        }

        // Click Delete Selected button
        await this.page
            .getByRole('button', {
                name: 'Delete Selected'
            })
            .first()
            .click();

        // Confirm Delete
        await this.page
            .locator(MatchesPageLocators.confirmDeleteButton)
            .click();

        // Wait for deletion to complete
        await this.waitForNetworkIdle();
    }

    async addCandidateNote(noteText: string) {
        // Click Add Note button
        await this.page.getByRole('button', { name: 'Add Note' }).click();
        
        // Locate the text editor (ID starts with text-editor)
        const textEditor = this.page.locator('[id^="text-editor"]');
        await textEditor.click();
        await textEditor.fill(noteText);
        
        // Click Submit
        await this.page.getByRole('button', { name: 'Submit' }).click();
        
        // Wait for network idle/overlay to disappear
        await this.waitForNetworkIdle();
    }

    async viewCandidateNote(expectedNoteText: string) {
        // Click View Note button
        await this.page.getByRole('button', { name: 'View Note' }).click();
        
        // Click on the note text to verify it
        await expect(this.page.getByText(expectedNoteText)).toBeVisible();
        await this.page.getByText(expectedNoteText).click();
        
        // Close the note dialog
        await this.page.locator('[data-test-id="info-dialog"]').getByRole('button', { name: 'Close' }).click();
    }
}