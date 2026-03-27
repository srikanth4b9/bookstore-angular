import {defineConfig} from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    specPattern: 'e2e/**/*.cy.ts',
    supportFile: 'e2e/support/e2e.ts',
    fixturesFolder: 'e2e/fixtures',
    videosFolder: 'e2e/videos',
    screenshotsFolder: 'e2e/screenshots',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
  },
});
