import type { TestInfo } from '@playwright/test';
import { getTestRunByTestId } from './testRunApi';

type Env =
    'staging' |
    'production' |
    'dev1' |
    'dev2' |
    'dev3' |
    'dev4' |
    'dev5' |
    'dev6' |
    'dev7' |
    'dev8' |
    'dev9' |
    'dev10'|
    'local';

function projectEnv(testInfo: TestInfo): Env {
    const metaEnv = (testInfo.project.metadata as any)?.env as Env | undefined;
    if (metaEnv) return metaEnv;

    const appEnv = process.env.APP_ENV as Env | undefined;
    if (appEnv) return appEnv;

    const n = testInfo.project.name.toLowerCase();
    if (n.includes('prod')) return 'production';
    if (n.includes('stag')) return 'staging';
    if (n.includes('dev1')) return 'dev1';
    if (n.includes('dev2')) return 'dev2';
    if (n.includes('dev3')) return 'dev3';
    if (n.includes('dev4')) return 'dev4';
    if (n.includes('dev5')) return 'dev5';
    if (n.includes('dev6')) return 'dev6';
    if (n.includes('dev7')) return 'dev7';
    if (n.includes('dev8')) return 'dev8';
    if (n.includes('dev9')) return 'dev9';
    if (n.includes('dev10')) return 'dev10';

    return 'local';
}

function getFullTitle(testInfo: TestInfo): string {
    const anyInfo = testInfo as any;
    const tp = anyInfo.titlePath;

    if (typeof tp === 'function') {
        const parts = tp.call(testInfo) as string[];
        return parts.join(' > ');
    }

    if (Array.isArray(tp)) {
        return (tp as string[]).join(' > ');
    }

    return testInfo.title;
}

export function extractTestIdFromTestInfo(testInfo: TestInfo): string | null {
    const full = getFullTitle(testInfo);
    const m = full.match(/\[(?<id>[^\]]+)\]/);
    return m?.groups?.id?.trim() ?? null;
}

function envEnabledByToggle(env: Env): boolean {
    if (env.startsWith('dev')) return (process.env.RUN_DEV_TESTS ?? 'true') === 'true';
    if (env === 'local') return (process.env.RUN_LOCAL_TESTS ?? 'false') === 'true';
    return true;
}

/**
 * Cache final decisions per (env, id) so repeated tests don't re-hit the API.
 * Note: this cache is per-process/worker.
 */
const decisionCache = new Map<string, Promise<{ ok: boolean; reason?: string }>>();

export async function shouldRun(testInfo: TestInfo): Promise<{ ok: boolean; reason?: string }> {
    const env = projectEnv(testInfo);
    const id = extractTestIdFromTestInfo(testInfo);

    if (!envEnabledByToggle(env)) return { ok: false, reason: `Env '${env}' disabled by toggle` };

    // ✅ Allow dev to run by default (no DB gating)
    if (env.startsWith('dev')) {
        // still enforce IDs if you want; otherwise remove this block too
        if (!id) return { ok: false, reason: 'Missing [test-XXX] id in title; dev requires id' };
        return { ok: true };
    }

    // Existing behavior for staging/prod/local:
    if (!id) return { ok: false, reason: 'Missing [test-XXX] id in title; gating blocks by default' };

    const apiConfigured = !!process.env.TEST_RUN_API_BASE && !!process.env.TEST_RUN_API_TOKEN;
    if (!apiConfigured) return { ok: false, reason: 'TestRun API not configured; gating blocks by default' };

    const key = `${env}:${id}`;
    if (decisionCache.has(key)) return decisionCache.get(key)!;

    const promise = (async () => {
        let run: Awaited<ReturnType<typeof getTestRunByTestId>>;

        try {
            run = await getTestRunByTestId(id);
        } catch (e: any) {
            // Fail closed, but don't poison the cache forever on transient errors.
            decisionCache.delete(key);
            return { ok: false, reason: `TestRun API error for ${id}: ${e?.message ?? String(e)}` };
        }

        console.log('[GATE API]', {
            test_id: id,
            found: !!run,
            is_active_on_production: run?.is_active_on_production,
            is_active_on_staging: run?.is_active_on_staging,
            is_active_on_dev1: run?.is_active_on_dev1,
            is_active_on_dev2: run?.is_active_on_dev2,
            is_active_on_dev3: run?.is_active_on_dev3,
            is_active_on_dev4: run?.is_active_on_dev4,
            is_active_on_dev5: run?.is_active_on_dev5,
            is_active_on_dev6: run?.is_active_on_dev6,
            is_active_on_dev7: run?.is_active_on_dev7,
            is_active_on_dev8: run?.is_active_on_dev8,
            is_active_on_dev9: run?.is_active_on_dev9,
            is_active_on_dev10: run?.is_active_on_dev10,


        });

        if (!run) return { ok: false, reason: `No TestRun found for test_id=${id}` };

        if (env === 'staging' && !run.is_active_on_staging) return { ok: false, reason: `Disabled on staging (${id})` };
        if (env === 'production' && !run.is_active_on_production)
            return { ok: false, reason: `Disabled on production (${id})` };

        if (env === 'dev1' && !run.is_active_on_dev1) return { ok: false, reason: `Disabled on dev1 (${id})` };
        if (env === 'dev2' && !run.is_active_on_dev2) return { ok: false, reason: `Disabled on dev2 (${id})` };
        if (env === 'dev3' && !run.is_active_on_dev3) return { ok: false, reason: `Disabled on dev3 (${id})` };
        if (env === 'dev4' && !run.is_active_on_dev4) return { ok: false, reason: `Disabled on dev4 (${id})` };
        if (env === 'dev5' && !run.is_active_on_dev5) return { ok: false, reason: `Disabled on dev5 (${id})` };
        if (env === 'dev6' && !run.is_active_on_dev6) return { ok: false, reason: `Disabled on dev6 (${id})` };
        if (env === 'dev7' && !run.is_active_on_dev7) return { ok: false, reason: `Disabled on dev7 (${id})` };
        if (env === 'dev8' && !run.is_active_on_dev8) return { ok: false, reason: `Disabled on dev8 (${id})` };
        if (env === 'dev9' && !run.is_active_on_dev9) return { ok: false, reason: `Disabled on dev9 (${id})` };
        if (env === 'dev10' && !run.is_active_on_dev10) return { ok: false, reason: `Disabled on dev10 (${id})` };


        // local has no DB gating beyond existence + toggles (current behavior)
        return { ok: true };
    })();

    decisionCache.set(key, promise);
    return promise;
}
