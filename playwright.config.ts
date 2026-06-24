import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

/**
 * Read environment variables from the file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  //workers: 15,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  // forbidOnly: !!process.env.CI,
  // /* Retry on CI only */
  // retries: process.env.CI ? 2 : 0,
  // /* Opt out of parallel tests on CI. */
  // workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['allure-playwright'],
    ['json', { outputFile: 'test-results.json' }],
  ],

  expect: {
    timeout:20000,
  },
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: (globalThis as any).process?.env.BASE_URL || 'https://agency.stagingenginehire.com',
    actionTimeout: 120000, // timeout for each action like click, fill etc. (in ms)
    navigationTimeout: 120000, // timeout for navigation actions (in ms)

    screenshot: 'only-on-failure',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    headless: !!(globalThis as any).process?.env.CI, // headless if running on CI,
  },
  timeout: 240000, // total test timeout (in ms)

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'staging - chromium',
      metadata: { env: 'staging' },
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.BASE_URL_STAGING || 'https://agency.stagingenginehire.com',
      },
    },
    {
      name: 'production - chromium',
      metadata: { env: 'production' },
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.BASE_URL_PROD || 'https://armendemo.enginehire.io',
      },
    },
    {
      name: 'dev1 - chromium',
      metadata: {
        env: 'dev1',
        backendURL:
            process.env.DEV1_URL_BACKEND ||
            'https://dev1api.stagingenginehire.com',
      },
      use: {
        ...devices['Desktop Chrome'],
        baseURL:
            process.env.DEV1_URL_FRONTEND ||
            'https://dev1.stagingenginehire.com',
      },
    },
    {
      name: 'dev2 - chromium',
      metadata: {
        env: 'dev2',
        backendURL:
            process.env.DEV2_URL_BACKEND ||
            'https://dev2api.stagingenginehire.com',
      },
      use: {
        ...devices['Desktop Chrome'],
        baseURL:
            process.env.DEV2_URL_FRONTEND ||
            'https://dev2.stagingenginehire.com',
      },
    },
    {
      name: 'dev3 - chromium',
      metadata: {
        env: 'dev3',
        backendURL:
            process.env.DEV3_URL_BACKEND ||
            'https://dev3api.stagingenginehire.com',
      },
      use: {
        ...devices['Desktop Chrome'],
        baseURL:
            process.env.DEV3_URL_FRONTEND ||
            'https://dev3.stagingenginehire.com',
      },
    },
    {
      name: 'dev4 - chromium',
      metadata: {
        env: 'dev4',
        backendURL:
            process.env.DEV4_URL_BACKEND ||
            'https://dev4api.stagingenginehire.com',
      },
      use: {
        ...devices['Desktop Chrome'],
        baseURL:
            process.env.DEV4_URL_FRONTEND ||
            'https://dev4.stagingenginehire.com',
      },
    },
    {
      name: 'dev5 - chromium',
      metadata: {
        env: 'dev5',
        backendURL:
            process.env.DEV5_URL_BACKEND ||
            'https://dev5api.stagingenginehire.com',
      },
      use: {
        ...devices['Desktop Chrome'],
        baseURL:
            process.env.DEV5_URL_FRONTEND ||
            'https://dev5.stagingenginehire.com',
      },
    },
    {
      name: 'dev6 - chromium',
      metadata: {
        env: 'dev6',
        backendURL:
            process.env.DEV6_URL_BACKEND ||
            'https://dev6api.stagingenginehire.com',
      },
      use: {
        ...devices['Desktop Chrome'],
        baseURL:
            process.env.DEV6_URL_FRONTEND ||
            'https://dev6.stagingenginehire.com',
      },
    },
    {
      name: 'dev7 - chromium',
      metadata: {
        env: 'dev7',
        backendURL:
            process.env.DEV7_URL_BACKEND ||
            'https://dev7api.stagingenginehire.com',
      },
      use: {
        ...devices['Desktop Chrome'],
        baseURL:
            process.env.DEV7_URL_FRONTEND ||
            'https://dev7.stagingenginehire.com',
      },
    },
    {
      name: 'dev8 - chromium',
      metadata: {
        env: 'dev8',
        backendURL:
            process.env.DEV8_URL_BACKEND ||
            'https://dev8api.stagingenginehire.com',
      },
      use: {
        ...devices['Desktop Chrome'],
        baseURL:
            process.env.DEV8_URL_FRONTEND ||
            'https://dev8.stagingenginehire.com',
      },
    },
    {
      name: 'dev9 - chromium',
      metadata: {
        env: 'dev9',
        backendURL:
            process.env.DEV9_URL_BACKEND ||
            'https://dev9api.stagingenginehire.com',
      },
      use: {
        ...devices['Desktop Chrome'],
        baseURL:
            process.env.DEV9_URL_FRONTEND ||
            'https://dev9.stagingenginehire.com',
      },
    },
    {
      name: 'dev10 - chromium',
      metadata: {
        env: 'dev10',
        backendURL:
            process.env.DEV10_URL_BACKEND ||
            'https://dev10api.stagingenginehire.com',
      },
      use: {
        ...devices['Desktop Chrome'],
        baseURL:
            process.env.DEV10_URL_FRONTEND ||
            'https://dev10.stagingenginehire.com',
      },
    },
    {
      name: 'local - chromium',
      metadata: { env: 'local' },
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.BASE_URL_LOCAL || 'http://localhost:8080',
        actionTimeout: 420000,
        navigationTimeout: 420000,
        launchOptions: {
          slowMo: 200,
        },
      },
      retries: 2,
    },

// {
//   name: 'firefox',
//   use: { ...devices['Desktop Firefox'] },
// },
//
// {
//   name: 'webkit',
//   use: { ...devices['Desktop Safari'] },
// },

    /* Test against mobile viewports. */
// {
//   name: 'Mobile Chrome',
//   use: { ...devices['Pixel 5'] },
// },
// {
//   name: 'Mobile Safari',
//   use: { ...devices['iPhone 12'] },
// },

    /* Test against branded browsers. */
// {
//   name: 'Microsoft Edge',
//   use: { ...devices['Desktop Edge'], channel: 'msedge' },
// },
// {
//   name: 'Google Chrome',
//   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
// },
  ],

  /* Run your local dev server before starting the tests */
// webServer: {
//   command: 'npm run start',
//   url: 'http://localhost:3000',
//   reuseExistingServer: !process.env.CI,
// },
});
