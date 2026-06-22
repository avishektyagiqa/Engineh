---
name: Test Assertion Patterns — toContainText vs toHaveValue
description: The existing createNewTaskAndValidateIsVsible helper uses toHaveValue on a data-table-row (non-input), which is a bug — new tests must use toContainText for row text assertions
type: feedback
---

The existing `createNewTaskAndValidateIsVsible` method in `personal_to_do_helpers.ts` calls `toHaveValue(randString)` on `[data-test-id="data-table-row"]`, which is not an input element. This assertion is incorrect — `toHaveValue` only works on form controls.

**Why:** If this incorrect assertion pattern is copied into new tests it will fail at runtime, not at compile time.

**How to apply:** Always use `toContainText(title)` when asserting that a data-table-row displays a particular string. Never apply `toHaveValue` to non-input locators.
