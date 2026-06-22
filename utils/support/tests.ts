import { test as base, expect, type TestInfo } from '@playwright/test';
import { shouldRun } from './testRunGate';

export const test = base.extend<{ _gate: void }>({
    _gate: [
        async ({}, use, testInfo: TestInfo) => {
            const { ok, reason } = await shouldRun(testInfo);
            if (!ok) base.skip(true, reason ?? 'Gated off');
            await use();
        },
        { auto: true },
    ],
});

export { expect };
