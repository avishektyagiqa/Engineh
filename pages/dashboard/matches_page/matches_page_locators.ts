export const MatchesPageLocators = {

    adminTab:
        '[data-test-id="menu-bar-admin"]',

    matchesTab:
        '[data-test-id="menu-bar-relationships"]',

    addCandidateButton:
        '//button[contains(text(),"Add Candidate")]',

    candidateDropdown:
        '.multi-select-container > .multiselect-container > .multiselect > .multiselect__tags',

    candidateSearchField:
        '//input[@placeholder="Select Candidate"]',

    candidateOption:
        '//span[contains(text(),"test candidate -")]',

    statusSearchField:
        '[data-test-id="note-dialog-modal"] input[placeholder="Select Status"]',

    favoriteOption:
        '//span[contains(text(),"Favorite")]',

    closeModalButton:
        '[data-test-id="modal-dialog-close-button"]',

    confirmDeleteButton:
        '[data-test-id="accept-button"]',

    myCandidatesLink:
        '//a[contains(., "My Candidates")]',

    imInterestedButton:
        '//button[contains(., "I\'m Interested")]',

    meetingLinkInput:
        '[data-test-id="note-dialog-modal"] input[type="text"]',

    notesTextArea:
        '[data-test-id="text-area"]',

    addCircleOutlineButton:
        '//button[contains(., "add_circle_outline")]',

    calendarIcon:
        '[data-test-id="note-dialog-modal"] svg',

    submitButton:
        '//button[contains(., "Submit")]',

    moreHorizButton:
        '//button[contains(., "more_horiz")]',

    deleteMatchOption:
        '//button[contains(., "delete Delete")]'
};