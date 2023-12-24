import { defineConfig } from '@playwright/test'

export default defineConfig({
  expect: {
    timeout: 10 * 1000,
  },
  forbidOnly: !!process.env.CI,
  reporter: [['list']],
  retries: process.env.CI ? 3 : 1,
  workers: process.env.CI ? 2 : 4,
  testDir: './__tests__/e2e',
  use: {
    baseURL: 'http://localhost:3000',
    browserName: 'chromium',
    bypassCSP: true,
    launchOptions: {
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-gpu',
        '--disable-dev-shm-usage',
      ],
    },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    viewport: { width: 1440, height: 900 },
  },
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
