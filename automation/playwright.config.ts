import { defineConfig, devices } from '@playwright/test';

// Load .env if present (Node 20.12+). Values there override nothing already set in the shell.
try { process.loadEnvFile(); } catch { /* no .env file: use defaults below */ }

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';
const API_URL = process.env.API_URL ?? BASE_URL;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
  },
  projects: [
    {
      name: 'ui',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Chrome'],
        // Optional: point at a pre-installed Chromium (e.g. in a locked-down CI image).
        launchOptions: process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {},
      },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: { baseURL: API_URL, extraHTTPHeaders: { Accept: 'application/json' } },
    },
  ],
  webServer: {
    command: "npm --prefix .. run dev",
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
