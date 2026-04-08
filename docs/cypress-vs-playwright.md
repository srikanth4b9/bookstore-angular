# Cypress vs Playwright

---

## Table of Contents

1. [Why E2E Testing?](#1-why-e2e-testing)
2. [Architecture & How They Work](#2-architecture--how-they-work)
3. [Setup & Configuration](#3-setup--configuration)
4. [Core API Comparison](#4-core-api-comparison)
5. [Selectors & Locators](#5-selectors--locators)
6. [Assertions](#6-assertions)
7. [Waiting & Auto-Retry](#7-waiting--auto-retry)
8. [Network Interception](#8-network-interception)
9. [Page Navigation & Routing](#9-page-navigation--routing)
10. [Reusable Utilities & Page Objects](#10-reusable-utilities--page-objects)
11. [Fixtures & Test Data](#11-fixtures--test-data)
12. [Hooks & Lifecycle](#12-hooks--lifecycle)
13. [Running Tests](#13-running-tests)
14. [Debugging](#14-debugging)
15. [Parallel Execution](#15-parallel-execution)
16. [Cross-Browser Testing](#16-cross-browser-testing)
17. [Visual Testing & Screenshots](#17-visual-testing--screenshots)
18. [CI/CD Integration](#18-cicd-integration)
19. [Performance & Speed](#19-performance--speed)
20. [Common Interview Q&A](#20-common-interview-qa)

---

## 1. Why E2E Testing?

### Q: What is E2E testing and why do we need it?

**A:** End-to-end testing simulates real user workflows from start to finish — clicking buttons, filling forms, navigating pages — against a running application. It validates that the entire system (frontend + backend + database) works together correctly.

### Q: Where does E2E fit in the testing pyramid?

```
        /  E2E  \          ← Few, slow, high confidence
       /----------\
      / Integration \      ← Medium count, moderate speed
     /----------------\
    /    Unit Tests     \  ← Many, fast, low-level
   /____________________\
```

| Layer       | Count  | Speed  | Scope                     |
| ----------- | ------ | ------ | ------------------------- |
| Unit        | Many   | Fast   | Single function/component |
| Integration | Medium | Medium | Multiple units together   |
| E2E         | Few    | Slow   | Full user journey         |

### Q: What should E2E tests cover?

- **Critical user paths**: login, checkout, form submission
- **Cross-page workflows**: add to cart → view cart → checkout
- **Integration points**: API calls, auth flows, third-party services
- **Regression-prone areas**: features that broke before
- **Conditional/branching flows**: behavior that changes based on multiple conditions — unit tests verify each condition in isolation, but E2E tests catch when the **combination** breaks across pages. Examples:
  - Logged-in vs guest checkout (different forms, saved addresses, order history)
  - Empty cart vs items in cart (empty state, checkout button disabled/enabled)
  - Free shipping threshold (subtotal < $50 shows shipping fee, >= $50 hides it)
  - Admin vs regular user (different nav items, route guards, visible actions)
  - Coupon applied vs not (price recalculation, invalid coupon error handling)
- **Repetitive flows with variations**: the same workflow executed under different states — these share the same steps but exercise different code paths end-to-end. Examples:
  - Checkout with credit card vs PayPal vs COD (different form fields per method)
  - Adding 1 item vs 10 items (quantity stepper, cart totals, pagination)
  - Shipping to domestic vs international address (different validation, tax rules)
  - First-time user vs returning user (onboarding flow vs dashboard)
  - Valid vs expired coupon in the same checkout flow

### Q: Are all Cypress/Playwright tests "E2E"?

**A:** No. Cypress and Playwright are E2E **frameworks**, but the tests you write can be at different levels:

```
┌──────────────────────────────────────────────────────────────────┐
│                    Cypress / Playwright                          │
│                                                                  │
│  ┌─────────────────────────┐  ┌───────────────────────────────┐  │
│  │  Page-level tests       │  │  Full-flow E2E tests          │  │
│  │  (Integration/Functional)│  │  (True End-to-End)            │  │
│  │                         │  │                               │  │
│  │  - Test one page        │  │  - Span multiple pages        │  │
│  │  - Small it() blocks    │  │  - Simulate real user journey │  │
│  │  - "should show search" │  │  - Home→Books→Cart→Checkout   │  │
│  │  - "should add to cart" │  │  - Register→Login→Purchase    │  │
│  │                         │  │                               │  │
│  │  books.cy.ts            │  │  full-flow.cy.ts              │  │
│  │  login.cy.ts            │  │  full-flow.spec.ts            │  │
│  └─────────────────────────┘  └───────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

**Interview tip:** "We use Cypress/Playwright for both page-level integration tests (fast feedback on individual features) and full-flow E2E tests (validate critical user journeys). The granular tests catch regressions quickly; the flow tests catch integration issues between pages."

### Q: What should E2E tests NOT cover?

- Edge cases in business logic (use unit tests)
- Component rendering details (use component tests)
- Every permutation of form validation
- Styling/CSS (use visual regression tools)

---

## 2. Architecture & How They Work

### Q: How does Cypress architecture work?

**A:** Cypress runs **inside the browser** in the same event loop as the app.

```
┌─────────────────────────────────────┐
│           Browser (Chrome)          │
│  ┌──────────┐    ┌───────────────┐  │
│  │  Your App │◄──►│ Cypress Test  │  │
│  │ (iframe)  │    │   Runner      │  │
│  └──────────┘    └───────────────┘  │
│                                     │
│  Cypress Proxy (intercepts all      │
│  HTTP traffic)                      │
└─────────────────────────────────────┘
        │
        ▼
┌──────────────┐
│ Node.js      │  cy.task(), plugins,
│ Server       │  file system access
└──────────────┘
```

Key points:

- Runs in the **same origin** as the app
- Uses a **proxy** to intercept and modify network requests
- Has **direct DOM access** — no WebDriver or serialization
- Node.js server handles tasks outside the browser (file I/O, DB seeds)
- **Single tab only** — cannot test multi-tab flows

### Q: How does Playwright architecture work?

**A:** Playwright controls browsers **from outside** via the CDP (Chrome DevTools Protocol) or equivalent.

```
┌─────────────────┐       CDP/WebSocket       ┌─────────────────┐
│   Node.js        │◄────────────────────────►│    Browser       │
│   Test Runner    │                           │  (Chromium/      │
│   (Playwright)   │   sends commands like     │   Firefox/       │
│                  │   "click", "fill", etc.   │   WebKit)        │
└─────────────────┘                           └─────────────────┘
```

Key points:

- Runs **outside the browser** in Node.js
- Uses **browser-specific protocols** (CDP for Chromium, similar for FF/WebKit)
- Can control **multiple tabs, windows, and even browsers** simultaneously
- Full access to **browser contexts** (like incognito profiles)
- Can intercept network at the **browser level** (not just proxy)

### Q: What's the fundamental difference?

| Aspect          | Cypress                    | Playwright                |
| --------------- | -------------------------- | ------------------------- |
| Execution model | In-browser (same process)  | Out-of-browser (Node.js)  |
| Protocol        | Direct DOM access          | CDP / browser protocols   |
| Multi-tab       | Not supported              | Full support              |
| Multi-origin    | Limited (cy.origin)        | Full support              |
| Iframe support  | Limited                    | Native support            |
| Language        | JavaScript/TypeScript only | JS/TS, Python, Java, C#   |
| Browser engines | Chromium, Firefox, WebKit  | Chromium, Firefox, WebKit |

---

## 3. Setup & Configuration

### Q: How do you set up Cypress?

```bash
npm install cypress --save-dev
npx cypress open          # Interactive mode
npx cypress run           # Headless mode
```

**Config file: `cypress.config.ts`**

```typescript
import {defineConfig} from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    specPattern: 'e2e/specs/**/*.cy.ts',
    supportFile: 'e2e/support/e2e.ts',
    fixturesFolder: 'e2e/fixtures',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000, // Timeout for cy commands
    requestTimeout: 10000, // Timeout for cy.request()
    responseTimeout: 30000, // Timeout for server responses
    video: false, // Record video of test runs
    screenshotOnRunFailure: true,
    retries: {
      runMode: 2, // Retries in CI (headless)
      openMode: 0, // Retries in interactive mode
    },
    env: {
      apiUrl: 'http://localhost:3000/api',
    },
    setupNodeEvents(on, config) {
      // Register plugins here
      on('task', {
        seedDatabase() {
          // Node.js code to seed DB
          return null;
        },
      });
      return config;
    },
  },
});
```

### Q: How do you set up Playwright?

```bash
npm install @playwright/test --save-dev
npx playwright install     # Download browsers
npx playwright test        # Run tests
```

**Config file: `playwright.config.ts`**

```typescript
import {defineConfig, devices} from '@playwright/test';

export default defineConfig({
  testDir: './playwright/specs',
  timeout: 30000, // Per-test timeout
  expect: {
    timeout: 5000, // Assertion timeout
  },
  fullyParallel: true, // Run tests in parallel
  forbidOnly: !!process.env.CI, // Fail if .only in CI
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', {open: 'never'}],
    ['list'], // Console output
  ],
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry', // Capture trace on failure
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },
  projects: [
    {
      name: 'chromium',
      use: {...devices['Desktop Chrome']},
    },
    {
      name: 'firefox',
      use: {...devices['Desktop Firefox']},
    },
    {
      name: 'webkit',
      use: {...devices['Desktop Safari']},
    },
    {
      name: 'mobile-chrome',
      use: {...devices['Pixel 5']},
    },
  ],
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
```

### Q: Key config differences?

| Config Feature   | Cypress                           | Playwright                |
| ---------------- | --------------------------------- | ------------------------- |
| Config file      | `cypress.config.ts`               | `playwright.config.ts`    |
| Base URL         | `e2e.baseUrl`                     | `use.baseURL`             |
| Timeouts         | Per-command type                  | Global + per-action       |
| Browser setup    | Built-in (auto-detects)           | `npx playwright install`  |
| Parallel         | Paid (Cypress Cloud) or 3rd party | Built-in `fullyParallel`  |
| Multi-browser    | `--browser chrome`                | `projects` array          |
| Dev server       | Manual / plugins                  | Built-in `webServer`      |
| Retries          | `retries.runMode/openMode`        | `retries` (single number) |
| Environment vars | `env` in config or `--env`        | `.env` or `process.env`   |

---

## 4. Core API Comparison

### Q: Side-by-side API comparison?

#### Navigation

```typescript
// Cypress
cy.visit('/books');
cy.visit('/books', {timeout: 10000});
cy.go('back');
cy.reload();
cy.url().should('include', '/books');

// Playwright
await page.goto('/books');
await page.goto('/books', {timeout: 10000});
await page.goBack();
await page.reload();
await expect(page).toHaveURL(/\/books/);
```

#### Clicking

```typescript
// Cypress
cy.get('.btn').click();
cy.get('.btn').click({force: true}); // Skip actionability checks
cy.get('.btn').dblclick();
cy.get('.btn').rightclick();
cy.contains('Submit').click();

// Playwright
await page.locator('.btn').click();
await page.locator('.btn').click({force: true});
await page.locator('.btn').dblclick();
await page.locator('.btn').click({button: 'right'});
await page.getByText('Submit').click();
```

#### Typing / Input

```typescript
// Cypress
cy.get('input[name=email]').type('test@example.com');
cy.get('input[name=email]').clear().type('new@example.com');
cy.get('input[name=email]').type('{enter}'); // Special keys
cy.get('input[name=email]').type('slow', {delay: 100});

// Playwright
await page.locator('input[name=email]').fill('test@example.com');
await page.locator('input[name=email]').clear();
await page.locator('input[name=email]').fill('new@example.com');
await page.locator('input[name=email]').press('Enter');
await page.locator('input[name=email]').pressSequentially('slow', {delay: 100});
```

#### Dropdowns / Select

```typescript
// Cypress
cy.get('select').select('Option 1'); // By visible text
cy.get('select').select('opt1'); // By value
cy.get('select').select(2); // By index

// Playwright
await page.locator('select').selectOption({label: 'Option 1'});
await page.locator('select').selectOption('opt1'); // By value
await page.locator('select').selectOption({index: 2});
```

#### Checkboxes & Radio

```typescript
// Cypress
cy.get('[type="checkbox"]').check();
cy.get('[type="checkbox"]').uncheck();
cy.get('[type="radio"]').check('value1');

// Playwright
await page.locator('[type="checkbox"]').check();
await page.locator('[type="checkbox"]').uncheck();
await page.locator('[type="radio"]').check();
```

#### Hover

```typescript
// Cypress — no native hover, use trigger
cy.get('.menu').trigger('mouseover');
// Or use a plugin: cypress-real-events
cy.get('.menu').realHover();

// Playwright — native hover
await page.locator('.menu').hover();
```

#### File Upload

```typescript
// Cypress
cy.get('input[type="file"]').selectFile('cypress/fixtures/image.png');
cy.get('input[type="file"]').selectFile(
  ['file1.png', 'file2.png'], // Multiple files
);

// Playwright
await page.locator('input[type="file"]').setInputFiles('playwright/fixtures/image.png');
await page.locator('input[type="file"]').setInputFiles(['file1.png', 'file2.png']);
await page.locator('input[type="file"]').setInputFiles([]); // Clear files
```

#### Drag and Drop

```typescript
// Cypress
cy.get('.source').drag('.target'); // Requires cypress-drag-drop plugin

// Playwright — native support
await page.locator('.source').dragTo(page.locator('.target'));
```

#### iFrames

```typescript
// Cypress — limited, need special handling
cy.get('iframe')
  .its('0.contentDocument.body')
  .should('not.be.empty')
  .then(cy.wrap)
  .find('.inside-iframe')
  .click();

// Playwright — first-class support
const frame = page.frameLocator('iframe');
await frame.locator('.inside-iframe').click();
```

#### Multiple Tabs / Windows

```typescript
// Cypress — NOT supported natively
// Workaround: remove target="_blank" and test in same tab
cy.get('a[target="_blank"]').invoke('removeAttr', 'target').click();

// Playwright — full support
const [newPage] = await Promise.all([
  context.waitForEvent('page'),
  page.locator('a[target="_blank"]').click(),
]);
await newPage.waitForLoadState();
await expect(newPage).toHaveURL(/new-page/);
```

---

## 5. Selectors & Locators

### Q: What selectors does each framework support?

#### Cypress Selectors

```typescript
// CSS selectors (primary)
cy.get('.class-name');
cy.get('#id');
cy.get('[data-testid="submit"]');
cy.get('input[type=email]');

// Text content
cy.contains('Submit'); // Finds element containing text
cy.contains('.btn', 'Submit'); // Scoped to selector
cy.contains(/^exact match$/); // Regex

// Chaining
cy.get('.parent').find('.child');
cy.get('.list').children();
cy.get('.item').parent();
cy.get('.item').siblings();
cy.get('.item').first();
cy.get('.item').last();
cy.get('.item').eq(2); // Index-based
cy.get('.item').filter('.active');
cy.get('.item').not('.disabled');
cy.get('.child').closest('.parent');

// Within (scoping)
cy.get('.modal').within(() => {
  cy.get('input').type('text');
  cy.get('button').click();
});
```

#### Playwright Locators

```typescript
// CSS selectors
page.locator('.class-name');
page.locator('#id');
page.locator('[data-testid="submit"]');

// Built-in semantic locators (RECOMMENDED)
page.getByRole('button', {name: 'Submit'});
page.getByText('Welcome');
page.getByLabel('Email'); // Finds input by label
page.getByPlaceholder('Enter email');
page.getByTestId('submit'); // Uses data-testid
page.getByAltText('Logo');
page.getByTitle('Close');

// Filtering
page.locator('.item').filter({hasText: 'Active'});
page.locator('.item').filter({has: page.locator('.icon')});
page.locator('.item').filter({hasNot: page.locator('.disabled')});

// Chaining
page.locator('.parent').locator('.child');
page.locator('.list').nth(2);
page.locator('.item').first();
page.locator('.item').last();
page.locator('.item').and(page.locator('.active')); // Intersection
page.locator('.item').or(page.locator('.fallback')); // Union

// Scoping
const modal = page.locator('.modal');
await modal.locator('input').fill('text');
await modal.locator('button').click();
```

### Q: Best practices for selectors?

| Priority  | Selector Type           | Example                          |
| --------- | ----------------------- | -------------------------------- |
| 1         | `data-testid`           | `[data-testid="submit-btn"]`     |
| 2         | Semantic / Role         | `getByRole('button', {name:..})` |
| 3         | Text content            | `contains('Submit')`             |
| 4         | CSS class (stable only) | `.btn-primary`                   |
| 5 (avoid) | ID / XPath / nth-child  | Brittle, breaks on refactor      |

---

## 6. Assertions

### Q: How do assertions compare?

#### Cypress Assertions (Chai + Chai-jQuery)

```typescript
// Should (chainable, retries automatically)
cy.get('.title').should('be.visible');
cy.get('.title').should('have.text', 'Hello');
cy.get('.title').should('contain.text', 'Hel');
cy.get('.title').should('not.exist');
cy.get('.title').should('have.class', 'active');
cy.get('.title').should('have.attr', 'href', '/home');
cy.get('.title').should('have.css', 'color', 'rgb(255, 0, 0)');
cy.get('.list .item').should('have.length', 5);
cy.get('input').should('have.value', 'test');
cy.get('input').should('be.disabled');
cy.get('input').should('be.focused');
cy.get('[type="checkbox"]').should('be.checked');
cy.url().should('include', '/books');
cy.title().should('eq', 'My App');

// Chained multiple assertions
cy.get('.btn').should('be.visible').and('have.text', 'Submit').and('not.be.disabled');

// Custom callback (for complex assertions)
cy.get('.price').should(($el) => {
  const price = parseFloat($el.text().replace('$', ''));
  expect(price).to.be.greaterThan(0);
  expect(price).to.be.lessThan(1000);
});

// Explicit expect (does NOT retry)
cy.get('.items').then(($items) => {
  expect($items).to.have.length(3);
});
```

#### Playwright Assertions (built-in, auto-retrying)

```typescript
// Auto-retrying assertions (RECOMMENDED — all async)
await expect(page.locator('.title')).toBeVisible();
await expect(page.locator('.title')).toHaveText('Hello');
await expect(page.locator('.title')).toContainText('Hel');
await expect(page.locator('.title')).toBeHidden();
await expect(page.locator('.title')).not.toBeVisible();
await expect(page.locator('.title')).toHaveClass(/active/);
await expect(page.locator('.title')).toHaveAttribute('href', '/home');
await expect(page.locator('.title')).toHaveCSS('color', 'rgb(255, 0, 0)');
await expect(page.locator('.list .item')).toHaveCount(5);
await expect(page.locator('input')).toHaveValue('test');
await expect(page.locator('input')).toBeDisabled();
await expect(page.locator('input')).toBeFocused();
await expect(page.locator('[type="checkbox"]')).toBeChecked();
await expect(page).toHaveURL(/\/books/);
await expect(page).toHaveTitle('My App');

// Custom timeout per assertion
await expect(page.locator('.title')).toBeVisible({timeout: 10000});

// Negation
await expect(page.locator('.title')).not.toBeVisible();

// Soft assertions (don't stop the test on failure)
await expect.soft(page.locator('.title')).toHaveText('Hello');
await expect.soft(page.locator('.count')).toHaveText('5');
// Test continues even if above fail, reports all failures at end

// Non-retrying (standard expect, for plain values)
const count = await page.locator('.item').count();
expect(count).toBe(5); // Standard Jest-like expect
```

### Q: Key difference in assertion behavior?

| Behavior         | Cypress                                | Playwright                   |
| ---------------- | -------------------------------------- | ---------------------------- |
| Auto-retry       | `.should()` retries, `.then()` doesn't | `await expect()` retries     |
| Default timeout  | `defaultCommandTimeout` (4s)           | `expect.timeout` (5s)        |
| Soft assertions  | Not built-in                           | `expect.soft()` built-in     |
| Snapshot testing | Plugin needed                          | `toMatchSnapshot()` built-in |

---

## 7. Waiting & Auto-Retry

### Q: How does Cypress handle waiting?

Cypress **automatically waits** and retries commands until they pass or timeout.

```typescript
// GOOD — Cypress auto-waits for element to appear
cy.get('.dynamic-content').should('be.visible'); // Retries up to defaultCommandTimeout

// BAD — never use arbitrary waits
cy.wait(5000); // Anti-pattern!

// Acceptable cy.wait — waiting for a specific network request
cy.intercept('GET', '/api/books').as('getBooks');
cy.visit('/books');
cy.wait('@getBooks'); // Waits for specific request to complete

// Command retry chain
cy.get('.list') // Retries finding .list
  .find('.item') // Retries finding .item within .list
  .should('have.length', 5); // Retries the assertion
// NOTE: Only the LAST command before .should() retries
// cy.get('.list') does NOT re-query if .find() fails
```

**Cypress retry rules:**

- Only **queries** retry: `get`, `find`, `contains`, `its`
- **Actions** do NOT retry: `click`, `type`, `check`
- Only the **last command** before `.should()` retries
- `.then()` does NOT retry

### Q: How does Playwright handle waiting?

Playwright uses **auto-waiting** on actions and **auto-retrying** on assertions.

```typescript
// Actions auto-wait for element to be:
// - Attached to DOM
// - Visible
// - Stable (not animating)
// - Enabled
// - Not obscured by other elements
await page.locator('.btn').click(); // Waits for all above conditions

// Assertions auto-retry
await expect(page.locator('.count')).toHaveText('5'); // Retries until true or timeout

// Explicit wait for specific conditions
await page.locator('.spinner').waitFor({state: 'hidden'});
await page.locator('.content').waitFor({state: 'visible'});
await page.locator('.old-item').waitFor({state: 'detached'});

// Wait for network
await page.waitForResponse('**/api/books');
const responsePromise = page.waitForResponse('**/api/books');
await page.locator('.refresh').click();
const response = await responsePromise;

// Wait for navigation
await page.waitForURL('**/books/*');

// Wait for load state
await page.waitForLoadState('networkidle');
await page.waitForLoadState('domcontentloaded');

// NEVER do this
await page.waitForTimeout(5000); // Anti-pattern!
```

### Q: Comparison of waiting strategies?

| Strategy              | Cypress                        | Playwright                      |
| --------------------- | ------------------------------ | ------------------------------- |
| Auto-wait on actions  | Partial (checks visibility)    | Full (visible, stable, enabled) |
| Auto-retry assertions | `.should()` only               | All `expect()` assertions       |
| Wait for network      | `cy.intercept()` + `cy.wait()` | `waitForResponse()`             |
| Wait for element      | Built into `cy.get()`          | `.waitFor()` or auto on action  |
| Wait for URL          | `cy.url().should('include',..) | `page.waitForURL()`             |
| Hard wait             | `cy.wait(ms)` — avoid!         | `waitForTimeout(ms)` — avoid!   |

---

## 8. Network Interception

### Q: How to intercept and mock API calls?

#### Cypress

```typescript
// Intercept and alias
cy.intercept('GET', '/api/books').as('getBooks');
cy.visit('/books');
cy.wait('@getBooks');

// Mock response (stub)
cy.intercept('GET', '/api/books', {
  statusCode: 200,
  body: [{id: 1, title: 'Mocked Book'}],
}).as('getBooks');

// Mock with fixture file
cy.intercept('GET', '/api/books', {fixture: 'books.json'}).as('getBooks');

// Modify response on the fly
cy.intercept('GET', '/api/books', (req) => {
  req.reply((res) => {
    res.body[0].title = 'Modified Title';
    res.send();
  });
});

// Modify request
cy.intercept('POST', '/api/books', (req) => {
  req.headers['Authorization'] = 'Bearer fake-token';
  req.continue();
});

// Delay response
cy.intercept('GET', '/api/books', (req) => {
  req.reply({
    delay: 2000,
    body: [],
  });
});

// Simulate error
cy.intercept('GET', '/api/books', {
  statusCode: 500,
  body: {error: 'Server Error'},
});

// Assert on request
cy.wait('@getBooks').its('request.body').should('deep.equal', {
  page: 1,
  limit: 12,
});

// Glob pattern matching
cy.intercept('GET', '**/api/books?*').as('filteredBooks');
```

#### Playwright

```typescript
// Intercept and mock (route)
await page.route('**/api/books', (route) => {
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify([{id: 1, title: 'Mocked Book'}]),
  });
});

// Mock with JSON file
await page.route('**/api/books', (route) => {
  route.fulfill({path: 'playwright/fixtures/books.json'});
});

// Modify response
await page.route('**/api/books', async (route) => {
  const response = await route.fetch(); // Get real response
  const json = await response.json();
  json[0].title = 'Modified Title';
  await route.fulfill({json});
});

// Modify request
await page.route('**/api/books', (route) => {
  const headers = {
    ...route.request().headers(),
    Authorization: 'Bearer fake-token',
  };
  route.continue({headers});
});

// Simulate error
await page.route('**/api/books', (route) => {
  route.fulfill({status: 500, body: JSON.stringify({error: 'Server Error'})});
});

// Abort request
await page.route('**/analytics/**', (route) => route.abort());

// Wait for response
const response = await page.waitForResponse('**/api/books');
const data = await response.json();
expect(data.length).toBeGreaterThan(0);

// Wait for request + response together
const [response2] = await Promise.all([
  page.waitForResponse('**/api/books'),
  page.locator('.search-btn').click(),
]);

// Remove route
await page.unroute('**/api/books');

// Route per context (applies to all pages)
await context.route('**/api/auth', (route) => route.fulfill({json: {token: 'test'}}));
```

---

## 9. Page Navigation & Routing

### Q: Navigation patterns comparison?

```typescript
// Cypress
cy.visit('/'); // Full page load
cy.visit('/books?category=Tech');
cy.visit('/books', {
  qs: {category: 'Tech'}, // Query params
  headers: {'X-Custom': 'value'},
  auth: {username: 'user', password: 'pass'},
  timeout: 30000,
  onBeforeLoad(win) {
    // Modify window before load
    cy.stub(win.console, 'log');
  },
});

cy.location('pathname').should('eq', '/books');
cy.location('search').should('include', 'category=Tech');
cy.hash().should('eq', '#section1');

// SPA navigation (no full page load)
cy.get('a[href="/books"]').click();
cy.url().should('include', '/books');

// Playwright
await page.goto('/');
await page.goto('/books?category=Tech');
await page.goto('/books', {
  waitUntil: 'networkidle', // or 'load', 'domcontentloaded', 'commit'
  timeout: 30000,
});

await expect(page).toHaveURL('/books');
await expect(page).toHaveURL(/category=Tech/);

// SPA navigation
await page.locator('a[href="/books"]').click();
await page.waitForURL('**/books');
```

---

## 10. Reusable Utilities & Page Objects

### Q: How to create reusable utilities in Cypress?

#### Custom Commands (`e2e/support/commands.ts`)

```typescript
// Define custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      addBookToCart(bookIndex?: number): Chainable<void>;
      getByTestId(testId: string): Chainable<JQuery<HTMLElement>>;
      shouldBeVisible(selector: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

Cypress.Commands.add('login', (email: string, password: string) => {
  // Programmatic login (fast — bypasses UI)
  cy.request('POST', '/api/auth/login', {email, password}).then((res) => {
    window.localStorage.setItem('token', res.body.token);
  });
});

Cypress.Commands.add('addBookToCart', (bookIndex = 0) => {
  cy.get('.book-card').eq(bookIndex).find('.add-btn').click();
});

Cypress.Commands.add('getByTestId', (testId: string) => {
  return cy.get(`[data-testid="${testId}"]`);
});
```

#### Usage in Tests

```typescript
describe('Checkout', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'password');
    cy.visit('/books');
  });

  it('should complete checkout', () => {
    cy.addBookToCart(0);
    cy.visit('/cart');
    cy.getByTestId('checkout-btn').click();
    cy.url().should('include', '/checkout');
  });
});
```

#### Page Object Pattern in Cypress

```typescript
// e2e/support/pages/books.page.ts
export class BooksPage {
  visit() {
    cy.visit('/books');
    return this;
  }

  searchFor(term: string) {
    cy.get('input[placeholder*="Title"]').clear().type(term);
    return this;
  }

  selectCategory(category: string) {
    cy.get('mat-select[placeholder=Category]').click();
    cy.get('mat-option').contains(category).click();
    return this;
  }

  getBookCards() {
    return cy.get('.book-card');
  }

  addToCart(index = 0) {
    this.getBookCards().eq(index).find('.add-btn').click();
    return this;
  }

  assertBookCount(count: number) {
    this.getBookCards().should('have.length', count);
    return this;
  }
}

// Usage
const booksPage = new BooksPage();

it('should filter books', () => {
  booksPage.visit().selectCategory('Technology').assertBookCount(5);
});
```

#### Utility Functions (simple helpers)

```typescript
// e2e/support/utils.ts
export function addBookToCart() {
  cy.get('.book-card').first().find('.add-btn').click({force: true});
}

export function waitForPageLoad() {
  cy.get('.loading-spinner').should('not.exist');
}

export function interceptBookApi(fixture = 'books.json') {
  cy.intercept('GET', '**/api/books*', {fixture}).as('getBooks');
}
```

### Q: How to create reusable utilities in Playwright?

#### Page Object Model (POM) — Standard Pattern

```typescript
// playwright/pages/books.page.ts
import {Page, Locator, expect} from '@playwright/test';

export class BooksPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly categorySelect: Locator;
  readonly bookCards: Locator;
  readonly loadingSpinner: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('input[placeholder*="Title"]');
    this.categorySelect = page.locator('mat-select[placeholder=Category]');
    this.bookCards = page.locator('.book-card');
    this.loadingSpinner = page.locator('.loading-spinner');
  }

  async goto() {
    await this.page.goto('/books');
    await this.loadingSpinner.waitFor({state: 'hidden'});
  }

  async searchFor(term: string) {
    await this.searchInput.fill(term);
    await this.page.waitForResponse('**/api/books*');
  }

  async selectCategory(category: string) {
    await this.categorySelect.click();
    await this.page.locator('mat-option').filter({hasText: category}).click();
  }

  async addToCart(index = 0) {
    await this.bookCards.nth(index).locator('.add-btn').click();
  }

  async assertBookCount(count: number) {
    await expect(this.bookCards).toHaveCount(count);
  }
}

// Usage in test
import {test, expect} from '@playwright/test';
import {BooksPage} from '../pages/books.page';

test('should filter books', async ({page}) => {
  const booksPage = new BooksPage(page);
  await booksPage.goto();
  await booksPage.selectCategory('Technology');
  await booksPage.assertBookCount(5);
});
```

#### Fixtures for Reusable Setup

```typescript
// playwright/fixtures/index.ts
import {test as base} from '@playwright/test';
import {BooksPage} from '../pages/books.page';
import {CartPage} from '../pages/cart.page';

// Extend test with custom fixtures
type MyFixtures = {
  booksPage: BooksPage;
  cartPage: CartPage;
  authenticatedPage: BooksPage;
};

export const test = base.extend<MyFixtures>({
  booksPage: async ({page}, use) => {
    const booksPage = new BooksPage(page);
    await booksPage.goto();
    await use(booksPage);
  },

  cartPage: async ({page}, use) => {
    await use(new CartPage(page));
  },

  authenticatedPage: async ({page}, use) => {
    // Login via API
    const response = await page.request.post('/api/auth/login', {
      data: {email: 'test@example.com', password: 'password'},
    });
    const {token} = await response.json();
    await page.evaluate((t) => localStorage.setItem('token', t), token);
    const booksPage = new BooksPage(page);
    await booksPage.goto();
    await use(booksPage);
  },
});

export {expect} from '@playwright/test';

// Usage — fixtures are auto-injected
import {test, expect} from '../fixtures';

test('should add to cart', async ({booksPage}) => {
  // booksPage is already navigated and ready
  await booksPage.addToCart(0);
});

test('authenticated flow', async ({authenticatedPage}) => {
  // Already logged in
  await authenticatedPage.addToCart(0);
});
```

#### Helper Utilities

```typescript
// playwright/utils/api.ts
import {Page} from '@playwright/test';

export async function mockBooksApi(page: Page, books: any[]) {
  await page.route('**/api/books*', (route) => {
    route.fulfill({json: books});
  });
}

export async function loginViaApi(page: Page, email: string, password: string) {
  const response = await page.request.post('/api/auth/login', {
    data: {email, password},
  });
  const {token} = await response.json();
  await page.evaluate((t) => localStorage.setItem('token', t), token);
}
```

---

## 11. Fixtures & Test Data

### Q: How do fixtures work?

#### Cypress Fixtures

```json
// e2e/fixtures/books.json
[
  {
    "id": "1",
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "price": 34.99
  }
]
```

```typescript
// Load fixture in test
cy.fixture('books.json').then((books) => {
  cy.intercept('GET', '/api/books', books);
});

// Shorthand
cy.intercept('GET', '/api/books', {fixture: 'books.json'});

// Use fixture data in assertions
cy.fixture('books.json').as('booksData');
cy.get('@booksData').then((books) => {
  cy.get('.book-card').should('have.length', books.length);
});
```

#### Playwright Fixtures

Playwright "fixtures" are **dependency injection**, not just data files:

```typescript
// Data files — just import them
import booksData from '../fixtures/books.json';

test('should display books', async ({page}) => {
  await page.route('**/api/books', (route) => {
    route.fulfill({json: booksData});
  });
  await page.goto('/books');
  await expect(page.locator('.book-card')).toHaveCount(booksData.length);
});
```

---

## 12. Hooks & Lifecycle

### Q: What hooks are available?

```typescript
// Cypress
describe('Books', () => {
  before(() => {
    // Runs ONCE before all tests in this describe
    cy.task('seedDatabase');
  });

  beforeEach(() => {
    // Runs before EACH test
    cy.login('user@test.com', 'pass');
    cy.visit('/books');
  });

  afterEach(() => {
    // Runs after EACH test
    cy.clearLocalStorage();
  });

  after(() => {
    // Runs ONCE after all tests
    cy.task('cleanupDatabase');
  });
});

// Playwright
import {test} from '@playwright/test';

test.describe('Books', () => {
  test.beforeAll(async () => {
    // Runs ONCE before all tests in this describe
  });

  test.beforeEach(async ({page}) => {
    // Runs before EACH test — gets fresh page
    await page.goto('/books');
  });

  test.afterEach(async ({page}) => {
    // Runs after EACH test
  });

  test.afterAll(async () => {
    // Runs ONCE after all tests
  });
});
```

| Hook        | Cypress        | Playwright          |
| ----------- | -------------- | ------------------- |
| Before all  | `before()`     | `test.beforeAll()`  |
| Before each | `beforeEach()` | `test.beforeEach()` |
| After each  | `afterEach()`  | `test.afterEach()`  |
| After all   | `after()`      | `test.afterAll()`   |

---

## 13. Running Tests

### Q: How to run tests in different modes?

#### Cypress

```bash
# Interactive mode (browser UI with time-travel debugger)
npx cypress open

# Headless mode (CI)
npx cypress run

# Specific spec file
npx cypress run --spec "e2e/specs/books.cy.ts"

# Specific browser
npx cypress run --browser chrome
npx cypress run --browser firefox
npx cypress run --browser electron  # Default

# With environment variables
npx cypress run --env apiUrl=http://staging.api.com

# Run specific test by grep (requires cypress-grep plugin)
npx cypress run --env grep="should add to cart"

# Record to Cypress Cloud (paid)
npx cypress run --record --key <key>

# Headed mode (see browser in CLI run)
npx cypress run --headed

# Specific config overrides
npx cypress run --config viewportWidth=375,viewportHeight=667
```

#### Playwright

```bash
# Run all tests (headless by default)
npx playwright test

# Interactive UI mode (similar to Cypress open)
npx playwright test --ui

# Specific file
npx playwright test playwright/specs/books.spec.ts

# Specific test by title
npx playwright test -g "should add to cart"

# Specific browser/project
npx playwright test --project=chromium
npx playwright test --project=firefox

# Headed mode (see the browser)
npx playwright test --headed

# Debug mode (pauses, opens inspector)
npx playwright test --debug

# With specific workers
npx playwright test --workers=4

# Update snapshots
npx playwright test --update-snapshots

# Show HTML report
npx playwright show-report

# Run in specific directory
npx playwright test --config=playwright.config.ts

# Trace on
npx playwright test --trace on

# Retry failed tests
npx playwright test --retries=3

# List tests without running
npx playwright test --list
```

---

## 14. Debugging

### Q: How to debug failing tests?

#### Cypress Debugging

```typescript
// 1. Time-travel debugger (interactive mode)
// Just use `npx cypress open` — click any step to see DOM snapshot

// 2. cy.pause() — pauses execution
cy.get('.btn').click();
cy.pause(); // Test pauses here, resume manually
cy.get('.result').should('be.visible');

// 3. cy.debug() — triggers debugger in DevTools
cy.get('.btn')
  .debug() // Opens DevTools debugger
  .click();

// 4. Console log intermediate values
cy.get('.price').then(($el) => {
  console.log('Price element:', $el.text());
  cy.log('Price:', $el.text()); // Shows in Cypress command log
});

// 5. cy.log() — add messages to command log
cy.log('Starting checkout flow');

// 6. Screenshots
cy.screenshot('before-checkout'); // Manual screenshot
// Auto screenshot on failure (configured in cypress.config.ts)

// 7. Video recording
// Set `video: true` in cypress.config.ts

// 8. Print full subject
cy.get('.items').then(console.log);
```

#### Playwright Debugging

```typescript
// 1. Debug mode — opens browser with Playwright Inspector
// Run: npx playwright test --debug
// Or in specific test:
await page.pause(); // Opens Playwright Inspector

// 2. Trace Viewer (best debugging tool)
// Config: trace: 'on-first-retry' or 'on'
// After run: npx playwright show-trace trace.zip
// Shows: screenshots, DOM snapshots, network, console, source

// 3. UI mode (interactive, like Cypress open)
// Run: npx playwright test --ui
// Watch mode, step through, see traces live

// 4. Console log
console.log(await page.locator('.price').textContent());

// 5. Evaluate in browser console
const title = await page.evaluate(() => document.title);
console.log(title);

// 6. Screenshots
await page.screenshot({path: 'debug.png'});
await page.locator('.modal').screenshot({path: 'modal.png'});

// 7. Slow motion (see what's happening)
// In config:
// use: { launchOptions: { slowMo: 500 } }

// 8. Verbose API logging
// Run: DEBUG=pw:api npx playwright test
```

### Q: Debugging comparison?

| Tool                 | Cypress                    | Playwright                    |
| -------------------- | -------------------------- | ----------------------------- |
| Interactive debugger | `cypress open` (built-in)  | `--ui` mode                   |
| Step-through         | Time-travel snapshots      | Trace Viewer                  |
| Breakpoint           | `cy.pause()`, `cy.debug()` | `page.pause()`, `--debug`     |
| Network inspection   | DevTools + Command log     | Trace Viewer + HAR export     |
| Screenshots          | Auto on failure + manual   | Auto on failure + manual      |
| Video                | Built-in (`video: true`)   | Built-in (`video: 'on'`)      |
| Trace                | Not available              | Trace Viewer (killer feature) |
| Slow motion          | Not built-in               | `slowMo` option               |

---

## 15. Parallel Execution

### Q: How does parallel execution work?

#### Cypress

```bash
# FREE: Split specs across CI machines manually
# Machine 1:
npx cypress run --spec "e2e/specs/books.cy.ts"
# Machine 2:
npx cypress run --spec "e2e/specs/cart.cy.ts"

# PAID: Cypress Cloud auto-balances
npx cypress run --record --parallel --key <key>
```

- Tests within a single spec run **sequentially**
- Parallelism is at the **spec file level**
- Smart balancing requires **Cypress Cloud (paid)**
- Free alternative: use `cypress-split` or `sorry-cypress`

#### Playwright

```typescript
// Built-in, free, no setup needed

// playwright.config.ts
export default defineConfig({
  fullyParallel: true, // Parallelize tests WITHIN files
  workers: 4, // Number of parallel workers (or '50%')
});
```

```bash
# Run with specific worker count
npx playwright test --workers=4

# Fully serial (for debugging)
npx playwright test --workers=1
```

```typescript
// Control parallelism per describe block
test.describe.configure({mode: 'serial'}); // Force sequential
test.describe.configure({mode: 'parallel'}); // Force parallel (default if fullyParallel)
```

| Feature               | Cypress              | Playwright                     |
| --------------------- | -------------------- | ------------------------------ |
| Parallel within file  | No                   | Yes (`fullyParallel`)          |
| Parallel across files | Paid (Cypress Cloud) | Free (built-in `workers`)      |
| Worker count control  | N/A (per CI machine) | `--workers=N`                  |
| Serial mode           | Default              | `describe.configure({serial})` |
| Load balancing        | Cypress Cloud        | Built-in by worker pool        |

---

## 16. Cross-Browser Testing

### Q: Which browsers are supported?

| Browser       | Cypress             | Playwright                |
| ------------- | ------------------- | ------------------------- |
| Chrome        | Yes                 | Yes                       |
| Edge          | Yes                 | Yes (Chromium)            |
| Firefox       | Yes                 | Yes                       |
| Safari/WebKit | Yes (experimental)  | Yes (full)                |
| Mobile Chrome | Via viewport resize | Device emulation          |
| Mobile Safari | No                  | WebKit + device emulation |
| Electron      | Yes (default)       | No                        |

#### Playwright Device Emulation

```typescript
// playwright.config.ts — test on real device profiles
import {devices} from '@playwright/test';

projects: [
  {name: 'Desktop Chrome', use: {...devices['Desktop Chrome']}},
  {name: 'Desktop Safari', use: {...devices['Desktop Safari']}},
  {name: 'iPhone 14', use: {...devices['iPhone 14']}},
  {name: 'Pixel 7', use: {...devices['Pixel 7']}},
  {name: 'iPad Mini', use: {...devices['iPad Mini']}},
];

// Devices include: viewport, userAgent, deviceScaleFactor, isMobile, hasTouch
```

---

## 17. Visual Testing & Screenshots

### Q: How to do visual regression testing?

#### Cypress

```typescript
// Requires plugin: cypress-image-snapshot or percy
// With percy (cloud):
cy.percySnapshot('Books page');

// With cypress-image-snapshot:
cy.matchImageSnapshot('books-grid');

// Manual screenshot comparison
cy.screenshot('books-page-current');
```

#### Playwright (Built-in)

```typescript
// Full page snapshot
await expect(page).toHaveScreenshot('books-page.png');

// Element snapshot
await expect(page.locator('.book-grid')).toHaveScreenshot('book-grid.png');

// With options
await expect(page).toHaveScreenshot('books.png', {
  maxDiffPixels: 100, // Allow small differences
  maxDiffPixelRatio: 0.01, // 1% difference allowed
  threshold: 0.2, // Per-pixel color threshold
  fullPage: true,
  mask: [page.locator('.dynamic-date')], // Mask flaky elements
  animations: 'disabled', // Freeze animations
});

// Update baselines
// npx playwright test --update-snapshots
```

---

## 18. CI/CD Integration

### Q: How to integrate with GitHub Actions?

#### Cypress

```yaml
# .github/workflows/e2e-cypress.yml
name: Cypress E2E
on: [push, pull_request]
jobs:
  cypress:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - name: Start app
        run: npm start &
      - name: Wait for app
        run: npx wait-on http://localhost:4200
      - name: Run Cypress
        uses: cypress-io/github-action@v6
        with:
          wait-on: 'http://localhost:4200'
          browser: chrome
          spec: e2e/specs/**/*.cy.ts
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: cypress-screenshots
          path: cypress/screenshots
```

#### Playwright

```yaml
# .github/workflows/e2e-playwright.yml
name: Playwright E2E
on: [push, pull_request]
jobs:
  playwright:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      # Playwright can auto-start the app via webServer config
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 19. Performance & Speed

### Q: Which is faster?

| Factor                | Cypress                     | Playwright                   |
| --------------------- | --------------------------- | ---------------------------- |
| Startup time          | Slower (boots Electron)     | Faster (direct browser)      |
| Per-test execution    | Moderate                    | Faster (parallel by default) |
| Network mocking       | Proxy-based (slower)        | Protocol-level (faster)      |
| DOM queries           | Fast (in-process)           | Slightly slower (CDP calls)  |
| Full suite (50 tests) | ~3-5 min (sequential)       | ~1-2 min (parallel)          |
| CI cost               | Higher (sequential + Cloud) | Lower (free parallelism)     |

---

## 20. Common Interview Q&A

### Q: When would you choose Cypress over Playwright?

**A:**

- Team is **JavaScript-only** and wants a simpler learning curve
- Need the **interactive time-travel debugger** for developer experience
- Project is a **single-origin SPA** without multi-tab or iframe needs
- Already have **Cypress Cloud** investment for dashboards and analytics
- Team prefers the **chained API** style (`cy.get().should().and()`)

### Q: When would you choose Playwright over Cypress?

**A:**

- Need **multi-browser testing** including real WebKit/Safari
- Need **multi-tab, multi-origin, or iframe** support
- Want **free built-in parallel execution** (no paid service)
- Need to test **mobile device emulation** with real device profiles
- Want the **Trace Viewer** for advanced debugging
- Need **multi-language** support (Python, Java, C#)
- Team prefers **async/await** over chained commands
- Want **built-in visual regression** without plugins

### Q: What is flaky test and how to handle it?

**A:** A flaky test passes sometimes and fails other times without code changes.

**Common causes and fixes:**

| Cause                    | Cypress Fix                            | Playwright Fix                      |
| ------------------------ | -------------------------------------- | ----------------------------------- |
| Element not ready        | `cy.get('.el', {timeout: 10000})`      | Auto-waiting handles this           |
| Animation                | `cy.get('.el').should('be.visible')`   | `animations: 'disabled'` in config  |
| Network race             | `cy.intercept()` + `cy.wait('@alias')` | `page.waitForResponse()`            |
| State leak between tests | `beforeEach` cleanup                   | Each test gets fresh `page`         |
| Dynamic content          | `cy.contains()` with regex             | `getByText()` / `filter({hasText})` |

**Strategies:**

```typescript
// Cypress — retry the whole test
// cypress.config.ts
retries: { runMode: 2, openMode: 0 }

// Playwright — retry the whole test
// playwright.config.ts
retries: 2

// Playwright — retry specific assertion
await expect(page.locator('.count'))
  .toHaveText('5', { timeout: 15000 });
```

### Q: How do you handle authentication in E2E tests?

**A:** Never test login via UI for every test. Login once, reuse the session.

```typescript
// Cypress — programmatic login
Cypress.Commands.add('login', (email, password) => {
  cy.request('POST', '/api/auth/login', {email, password}).then((res) => {
    window.localStorage.setItem('token', res.body.token);
  });
});

// Playwright — reuse storage state
// global-setup.ts
async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('/login');
  await page.fill('#email', 'test@example.com');
  await page.fill('#password', 'password');
  await page.click('#login-btn');
  await page.context().storageState({path: 'auth.json'});
  await browser.close();
}

// playwright.config.ts
use: {
  storageState: 'auth.json';
}
// Now ALL tests start logged in
```

### Q: What's the difference between `cy.get()` and `page.locator()`?

**A:**

- `cy.get()` **immediately queries the DOM** and retries until found or timeout. It returns a Cypress chainable (not a promise).
- `page.locator()` **creates a locator object** but does NOT query the DOM yet. It's lazy — the query runs when you perform an action (`.click()`) or assertion (`expect().toBeVisible()`).

```typescript
// Cypress — eagerly queries
cy.get('.btn'); // Queries DOM NOW, retries if not found

// Playwright — lazy locator
const btn = page.locator('.btn'); // No DOM query yet
await btn.click(); // NOW it queries and clicks
```

### Q: How do you handle dynamic data in tests?

**A:**

```typescript
// Option 1: Mock the API (deterministic)
// Cypress
cy.intercept('GET', '/api/books', {fixture: 'books.json'});

// Playwright
await page.route('**/api/books', (route) => route.fulfill({json: mockBooks}));

// Option 2: Use flexible assertions
// Cypress
cy.get('.book-card').should('have.length.at.least', 1);
cy.get('.price')
  .invoke('text')
  .should('match', /\$\d+\.\d{2}/);

// Playwright
await expect(page.locator('.book-card')).not.toHaveCount(0);
await expect(page.locator('.price')).toHaveText(/\$\d+\.\d{2}/);

// Option 3: Seed the database
// Cypress
cy.task('seedDatabase', {books: 5});

// Playwright (in global setup or beforeAll)
await request.post('/api/test/seed', {data: {books: 5}});
```

### Q: Explain the Cypress command queue.

**A:** Cypress commands are **enqueued, not executed immediately**. They run asynchronously in order.

```typescript
// This does NOT work as expected:
const text = cy.get('.title').text(); // WRONG — returns Chainable, not string

// This is correct:
cy.get('.title').then(($el) => {
  const text = $el.text(); // Access value inside .then()
  expect(text).to.equal('Hello');
});

// Command queue visualization:
cy.visit('/books'); // Enqueued: [visit]
cy.get('.title'); // Enqueued: [visit, get]
cy.get('.title').click(); // Enqueued: [visit, get, click]
// Nothing has executed yet — Cypress runs the queue after the test function returns
```

### Q: How does Playwright handle test isolation?

**A:** Each test gets a **fresh BrowserContext** (like an incognito window):

- Fresh cookies, localStorage, sessionStorage
- Fresh service workers
- No shared state between tests
- Tests can run in **parallel** safely

```typescript
// Each test function receives a fresh `page` from a fresh context
test('test 1', async ({page}) => {
  // Fresh browser context — no cookies, no storage
  await page.goto('/');
});

test('test 2', async ({page}) => {
  // Completely independent from test 1
  await page.goto('/');
});

// Share state within a describe block
test.describe(() => {
  let sharedPage: Page;
  test.beforeAll(async ({browser}) => {
    sharedPage = await browser.newPage();
  });
  // All tests in this block share sharedPage
});
```

### Q: What is `cy.intercept()` vs Playwright's `page.route()`?

| Feature            | cy.intercept()               | page.route()                  |
| ------------------ | ---------------------------- | ----------------------------- |
| Scope              | Per-test (reset in each)     | Per-page (must unroute)       |
| Wait for request   | `cy.wait('@alias')`          | `waitForResponse()`           |
| Modify request     | `req.continue({headers})`    | `route.continue({headers})`   |
| Modify response    | `req.reply()` / `res.send()` | `route.fulfill()` / `fetch()` |
| Abort request      | Not built-in                 | `route.abort()`               |
| Pattern matching   | Glob + minimatch             | Glob + regex + function       |
| Request assertions | `cy.wait('@alias').its(..)`  | `const req = route.request()` |

### Q: How do you handle flaky selectors?

**A:** Use a **selector strategy** that resists UI refactoring:

```typescript
// BAD — breaks when CSS or structure changes
cy.get('div > ul > li:nth-child(3) > button.MuiButton-root');

// GOOD — data attributes (most resilient)
cy.get('[data-testid="add-to-cart"]');

// GOOD — semantic Playwright locators
page.getByRole('button', {name: 'Add to Cart'});

// GOOD — text content (user-facing)
cy.contains('Add to Cart');
page.getByText('Add to Cart');

// Add data-testid in your Angular components
// <button data-testid="add-to-cart">Add to Cart</button>
```

### Q: How to test file downloads?

```typescript
// Cypress
cy.get('.download-btn').click();
const downloadsFolder = Cypress.config('downloadsFolder');
cy.readFile(`${downloadsFolder}/report.pdf`).should('exist');

// Playwright
const [download] = await Promise.all([
  page.waitForEvent('download'),
  page.locator('.download-btn').click(),
]);
const path = await download.path();
expect(path).toBeTruthy();
await download.saveAs('test-results/report.pdf');
```

### Q: How to test responsive design?

```typescript
// Cypress
cy.viewport('iphone-x'); // Preset
cy.viewport(375, 667); // Custom
// Must set before visit or mid-test

// Playwright — via projects (runs ALL tests on each device)
projects: [
  {name: 'Desktop', use: {viewport: {width: 1280, height: 720}}},
  {name: 'Mobile', use: {...devices['iPhone 14']}},
];
// Or per-test:
test.use({viewport: {width: 375, height: 667}});
```

### Q: What testing patterns should be avoided?

1. **Testing implementation details** — test behavior, not DOM structure
2. **Shared state between tests** — each test should be independent
3. **Hard-coded waits** — `cy.wait(5000)` / `waitForTimeout(5000)`
4. **Testing third-party apps** — don't test Stripe's checkout page
5. **Too many E2E tests** — use the testing pyramid; E2E for critical paths only
6. **Logging in via UI for every test** — use programmatic/API login
7. **Asserting on exact timestamps** — use ranges or mock time
8. **Chaining too many actions** without assertions — add checkpoints

---

## Quick Reference Card

```
┌─────────────────────┬────────────────────────┬──────────────────────────┐
│ Task                │ Cypress                │ Playwright               │
├─────────────────────┼────────────────────────┼──────────────────────────┤
│ Visit page          │ cy.visit('/')          │ page.goto('/')           │
│ Find element        │ cy.get('.btn')         │ page.locator('.btn')     │
│ Click               │ .click()               │ .click()                 │
│ Type                │ .type('text')          │ .fill('text')            │
│ Assert visible      │ .should('be.visible')  │ expect().toBeVisible()   │
│ Assert text         │ .should('have.text')   │ expect().toHaveText()    │
│ Assert count        │ .should('have.length') │ expect().toHaveCount()   │
│ Assert URL          │ cy.url().should()      │ expect(page).toHaveURL() │
│ Wait for API        │ cy.wait('@alias')      │ waitForResponse()        │
│ Mock API            │ cy.intercept()         │ page.route()             │
│ Screenshot          │ cy.screenshot()        │ page.screenshot()        │
│ Pause               │ cy.pause()             │ page.pause()             │
│ Run headed          │ cypress open            │ --ui or --headed         │
│ Run headless        │ cypress run             │ playwright test          │
│ Debug               │ cy.debug()             │ --debug                  │
│ Parallel            │ Paid (Cloud)           │ Free (--workers)         │
│ Trace               │ N/A                    │ --trace on               │
│ Visual compare      │ Plugin needed          │ toHaveScreenshot()       │
└─────────────────────┴────────────────────────┴──────────────────────────┘
```
