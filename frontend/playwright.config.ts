import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60 * 1000,
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'retain-on-failure'
  },
  webServer: {
    command: 'npx nx serve portal',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env.CI,
    stdout: 'inherit',
    stderr: 'inherit',
    timeout: 120 * 1000
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
