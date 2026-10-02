// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: 'http://127.0.0.1:8765',
    viewport: { width: 1280, height: 860 },
    trace: 'retain-on-failure'
  },
  webServer: {
    command: 'python3 -m http.server --directory docs 8765 --bind 127.0.0.1',
    url: 'http://127.0.0.1:8765/data/index.json',
    reuseExistingServer: !process.env.CI,
    timeout: 20000
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }]
});
