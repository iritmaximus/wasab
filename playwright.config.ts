import { defineConfig, devices } from '@playwright/test';

const port = 4173;

export default defineConfig({
  testDir: './e2e',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL: `http://localhost:${port}` },
  // Firefox has no mobile emulation, so phones are covered by viewport size only
  projects: [
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], viewport: { width: 1280, height: 720 } },
    },
    {
      name: 'firefox-laptop',
      use: { ...devices['Desktop Firefox'], viewport: { width: 1024, height: 640 } },
    },
    {
      name: 'firefox-phone',
      use: { ...devices['Desktop Firefox'], viewport: { width: 390, height: 844 } },
    },
  ],
  webServer: {
    command: `npm run build && npx vite preview --port ${port} --strictPort`,
    port,
    reuseExistingServer: !process.env.CI,
  },
});
