export type TestRun = {
    test_id: string;
    is_active_on_production: boolean;
    is_active_on_staging: boolean;
    is_active_on_dev1?: boolean;
    is_active_on_dev2?: boolean;
    is_active_on_dev3?: boolean;
    is_active_on_dev4?: boolean;
    is_active_on_dev5?: boolean;
    is_active_on_dev6?: boolean;
    is_active_on_dev7?: boolean;
    is_active_on_dev8?: boolean;
    is_active_on_dev9?: boolean;
    is_active_on_dev10?: boolean;

    settings?: Record<string, unknown>;
};

const cache = new Map<string, Promise<TestRun | null>>();

export function getTestRunByTestId(testId: string): Promise<TestRun | null> {
    if (cache.has(testId)) return cache.get(testId)!;

    const promise = (async () => {
        const base = process.env.TEST_RUN_API_BASE;
        const token = process.env.TEST_RUN_API_TOKEN;

        if (!base || !token) return null;

        const url = new URL('/logs-management/test-runs/by-test-id/', base);
        url.searchParams.set('test_id', testId);

        const controller = new AbortController();
        const t = setTimeout(() => controller.abort(), 10_000);

        try {
            const res = await fetch(url.toString(), {
                headers: { Authorization: `Token ${token}`, accept: 'application/json' },
                signal: controller.signal,
            });

            if (res.status === 404) return null;
            if (!res.ok) throw new Error(`TestRun API error: ${res.status} ${res.statusText}`);

            return (await res.json()) as TestRun;
        } finally {
            clearTimeout(t);
        }
    })();

    cache.set(testId, promise);
    return promise;
}
