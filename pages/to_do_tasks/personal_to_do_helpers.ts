import BasePage from "../../base/base_page";
import {expect, Page} from "@playwright/test";
import {ToDoLocators} from "./personal_to_do_locators";
import {Constants} from "../../utils/constants";
import path from "path";

export default class TodoPage extends BasePage {
    constructor(public page: Page) {
        super(page);
    }

    async openToDoFullView() {
        const bar = this.page.locator(ToDoLocators.iconBarToDoTasks);
        const modal = this.page.locator(ToDoLocators.toDoModal);

        await bar.click();
        await modal.waitFor({state: "visible"});
        await modal.nth(0).click();
        await this.page.locator(ToDoLocators.fullView).click({});
    }
    async clickRandomCalendarDay() {
        const days = this.page.locator('div.cv-day');

        await days.first().waitFor({ state: 'visible' });

        const count = await days.count();

        const emptyDayIndexes: number[] = [];

        for (let i = 0; i < count; i++) {
            const day = days.nth(i);
            const eventsCount = await day.locator('.cv-event').count();

            if (eventsCount === 0) {
                emptyDayIndexes.push(i);
            }
        }

        if (emptyDayIndexes.length === 0) {
            throw new Error('No empty future calendar days found.');
        }

        const randomIndex =
            emptyDayIndexes[Math.floor(Math.random() * emptyDayIndexes.length)];

        await days.nth(randomIndex).click();
    }

    async clickAddNewTodoItem() {
        await this.clickOnElement(ToDoLocators.addToDoItem);
    }

    async createNewTaskAndValidateAssignedToGagik(taskTitle: string) {
        await this.createNewTaskWithTitle(taskTitle);

        const taskRow = this.page
            .locator('[data-test-id="data-table-row"]')
            .filter({ hasText: taskTitle });

        const assignToCell = taskRow.locator('[data-test-id="-Assign To"]');

        await expect(assignToCell).toContainText('Gagik Vardanyan');
        await expect(assignToCell).toBeVisible();
    }

    async bulkAssignToOtherAdmin(taskTitle: string) {
        await this.clickOnElement(ToDoLocators.moreFilters);

        const checkbox = this.page.getByLabel('Show all admin tasks');
        await expect(checkbox).toBeVisible();
        await checkbox.check();
        await expect(checkbox).toBeChecked();

        const row = this.page.locator('table tbody tr', { hasText: taskTitle });
        await expect(row).toBeVisible();

        const tableCheckbox = row.locator('[class*="form-check-input"]').first();
        await expect(tableCheckbox).toBeVisible();

        if (!(await tableCheckbox.isChecked())) {
            await tableCheckbox.check();
        }

        await expect(tableCheckbox).toBeChecked();

        const bulkButton = this.page.getByRole('button', { name: 'Bulk Reassign' }).first();
        await expect(bulkButton).toBeVisible();
        await bulkButton.click();

        const modal = this.page.locator('[data-portal]').filter({
            hasText: 'Bulk Reassign',
        });

        await expect(modal).toBeVisible({ timeout: 10000 });

        const dropdown = modal.locator('.multiselect__tags').first();
        await expect(dropdown).toBeVisible({ timeout: 10000 });
        await dropdown.click();

        const option = modal
            .locator('.multiselect__option, span')
            .filter({ hasText: 'Enginehire  (armendemo@enginehire.io)' })
            .first();

        await expect(option).toBeVisible({ timeout: 10000 });
        await option.click();

        await modal.getByRole('button', { name: 'Bulk Reassign' }).click();

        await this.clickOnElement(ToDoLocators.acceptReassignTask);

        await expect(row).toContainText('Enginehire');
    }

    async addNewTaskAndUploadImage(imageName: string) {
        const addImageButton = this.page.locator('[class="mylisting-button dark-button"]');
        const chooseImageButton = this.page.locator('[class="mylisting-button secondary-button mt-2 cursor-pointer"]');

        await addImageButton.click();

        const imagePath = path.join(__dirname, "..", "..", "test_data", imageName);
        const [fileChooser] = await Promise.all([
            this.page.waitForEvent('filechooser'),
            chooseImageButton.click(),
        ]);

        await fileChooser.setFiles(imagePath);
    }

    async addNewTaskAndParseText() {
        const textToDoTask =
            "1. Pay phone bill" +
            "2. Buy Groceries";
        const addContentButton = this.page.locator('[class="mylisting-button dark-button"]');
        const parseTextOption = this.page.locator('button[class="mylisting-button secondary-button"] i');
        const input = this.page.locator('[placeholder="Paste your text here..."]');

        await addContentButton.click();
        await parseTextOption.click();
        await input.fill(textToDoTask);
    }

    async analyseDataAndValidateItShowsCorrectly() {
        await this.clickOnElement(ToDoLocators.analyseAndAutoFill);
        await this.page.waitForTimeout(7000);

        const amountOfTask = this.page.locator('[class="mb-3 p-3 border rounded mt-2"]');
        const count = await amountOfTask.count();
        await this.page.waitForTimeout(7000);
        await expect(count).toBeGreaterThanOrEqual(2);

        await this.clickOnElement(ToDoLocators.createToDoButton);
        await this.clickOnDontSendButton();

        const taskRow = await this.page.locator(ToDoLocators.tableRow).count();
        expect(taskRow).toBeGreaterThanOrEqual(2);
    }

    async markCompletedTaskHidden() {
        await this.page.reload();
        const markCompleted = this.page.locator('[class="mylisting-button dark-button"]', {hasText: " Mark Selected as Complete "})
        const tableCheckbox = this.page.locator('[class=" has-tooltip"]');
        await this.clickOnElement(ToDoLocators.moreFilters);
        await tableCheckbox.click();
        await markCompleted.click();
    }

    async clickOnDontSendButton(){
        await this.clickOnElement(ToDoLocators.dontSendButton);
    }

    async clickOnSendButton(){
        await this.clickOnElement(ToDoLocators.sendButton);
    }

    async createNewTaskAndValidateIsVsible() {
        const randString = Constants.randStr();
        await this.openToDoFullView();
        await this.clickRandomCalendarDay();

        const title = this.page.locator(ToDoLocators.title);
        await title.fill("Test task " + randString);

        await this.clickOnElement(ToDoLocators.createToDoButton);
        await this.clickOnDontSendButton();

        const taskRow = this.page.locator(ToDoLocators.tableRow).nth(1);
        await expect(taskRow).toBeVisible();
        await expect(taskRow).toHaveValue(randString);
    }

    async createNewTaskWithTitle(taskTitle: string) {
        await this.clickAddNewTodoItem();

        const title = this.page.locator(ToDoLocators.title);
        await title.fill(taskTitle);

        const adminCheckbox = this.page.getByLabel(/Gagik Vardanyan/);

        if (!(await adminCheckbox.isChecked())) {
            await adminCheckbox.check();
        }

        await expect(adminCheckbox).toBeChecked();
        await this.clickOnElement(ToDoLocators.createToDoButton);
        await this.clickOnDontSendButton();
    }

    async deleteNewlyCreatedTask() {
        const taskRows = this.page.locator(ToDoLocators.tableRow);
        const overlay = this.page.locator('.overlay-panel');

        while (true) {
            await overlay.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
            const countBefore = await taskRows.count();

            if (countBefore === 0) {
                break;
            }

            const firstRow = taskRows.first();
            const deleteButton = firstRow.locator(ToDoLocators.deleteToDo);

            await expect(deleteButton).toBeVisible();
            await deleteButton.click();

            const acceptDeleteButton = this.page.locator(ToDoLocators.acceptDeleteTask);
            await expect(acceptDeleteButton).toBeVisible();
            await acceptDeleteButton.click();
            await expect.poll(async() => await taskRows.count()).toBeLessThanOrEqual(countBefore);
        }

        await expect(taskRows).toHaveCount(0);
        }

    async settingsAccesableFroGlobalSettings() {
        const gearIcon = this.page.locator(ToDoLocators.toDoGearIcon)
            .or(this.page.locator('[class="icon-btn-container icon-btn icon-btn-secondary has-tooltip"]'));
        await gearIcon.click();
        //await this.clickOnElement(ToDoLocators.toDoGearIcon)

        const label =  this.page.locator(ToDoLocators.labelToDoTasks);
        const checkbox = this.page.locator(ToDoLocators.settingsCheckbox);
        await label.click();
        await expect(checkbox).toBeVisible();
    }

    async changeToDoViewToKanban() {
        await this.clickOnElement(ToDoLocators.moreFilters);
        const kanabanView = this.page.locator(ToDoLocators.kanbanView);
        const checkbox = this.page.locator(ToDoLocators.kanbanToggleCheckbox).first();

        await checkbox.click();
        await expect(checkbox).toBeChecked();
        await expect(kanabanView).toBeVisible();
    }

    async changeToDoViewToList() {
        const checkbox = this.page.locator(ToDoLocators.kanbanToggleCheckbox).first();
        const tableView = this.page.locator(ToDoLocators.tableView);

        await checkbox.click();
        await expect(checkbox).not.toBeChecked();
        await expect(tableView).toBeVisible();

    }
}