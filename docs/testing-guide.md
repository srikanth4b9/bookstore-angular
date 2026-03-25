# Testing Guide

## Overview

| Tool                     | Purpose                                           |
| ------------------------ | ------------------------------------------------- |
| **Jest 30**              | Test runner and assertion library                 |
| **jest-preset-angular**  | Angular-specific Jest setup (zoneless)            |
| **ng-mocks**             | Mocking Angular components, services, directives  |
| **@testing-library/dom** | DOM querying utilities                            |
| **Cypress**              | End-to-end browser testing                        |
| **Storybook**            | Isolated component development and visual testing |

## Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run a specific test file
npx jest src/app/pages/books/books.component.spec.ts

# Run tests matching a pattern
npx jest --testPathPattern="login"
```

## Configuration

### Jest (`jest.config.js`)

- **Preset:** `jest-preset-angular`
- **Setup:** `src/test-setup.ts` (zoneless Angular environment)
- **Environment:** jsdom
- **Coverage directory:** `coverage/`
  yes - **Coverage reporters:** text, lcov, clover, json-summary
- **Coverage includes:** `src/app/**/*.ts`
- **Coverage excludes:** `*.spec.ts`, `*.module.ts`, `src/app/models/**`

### Test Setup (`src/test-setup.ts`)

The setup file:

1. Imports `jest-preset-angular/setup-env/zoneless` for zone-free testing
2. Initializes `TestBed` with `BrowserDynamicTestingModule`
3. Mocks `IntersectionObserver` globally
4. Configures `ng-mocks`

## Writing Tests

### Component Test Pattern

```typescript
import {MyComponent} from './my.component';
import {MockBuilder, MockRender, ngMocks} from 'ng-mocks';
import {MockDataService} from '../../services/mock-data.service';
import {signal} from '@angular/core';

describe('MyComponent', () => {
  beforeEach(() => {
    return MockBuilder(MyComponent).mock(MockDataService, {
      books: signal([]),
      isLoading: signal(false),
      fetchBooks: jest.fn(),
    });
  });

  it('should create', () => {
    const fixture = MockRender(MyComponent);
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  it('should call service method', () => {
    const fixture = MockRender(MyComponent);
    const service = ngMocks.get(MockDataService);

    fixture.point.componentInstance.someAction();

    expect(service.fetchBooks).toHaveBeenCalled();
  });
});
```

### Key Patterns

**MockBuilder** — Declares which component to test and what to mock:

```typescript
MockBuilder(ComponentUnderTest)
  .mock(ServiceToMock, {
    /* mock implementation */
  })
  .mock(Router);
```

**MockRender** — Renders the component and returns a fixture:

```typescript
const fixture = MockRender(MyComponent);
const component = fixture.point.componentInstance;
```

**ngMocks.get** — Retrieves a mocked dependency:

```typescript
const service = ngMocks.get(MockDataService);
const router = ngMocks.get(Router);
```

**DOM interactions with ngMocks:**

```typescript
// Trigger events
ngMocks.trigger(element, 'input', {target: {value: 'search'}});
ngMocks.trigger(element, 'click');

// Change values
ngMocks.change(element, 'new value');
```

**Mocking signals:**

```typescript
import {signal, WritableSignal} from '@angular/core';

// In MockBuilder
.mock(MockDataService, {
  books: signal([mockBook1, mockBook2]),
  isLoading: signal(false),
})

// Update signal in test
const service = ngMocks.get(MockDataService);
(service.books as WritableSignal<Book[]>).set([newBook]);
fixture.detectChanges();
```

**Spying on Router.navigate:**

```typescript
const router = ngMocks.get(Router);
router.navigate = jest.fn();

component.goToLogin();

expect(router.navigate).toHaveBeenCalledWith(['/login']);
```

### Async Tests

```typescript
it('should handle async operations', async () => {
  const fixture = MockRender(MyComponent);

  fixture.point.componentInstance.triggerAsync();

  // Wait for debounce or setTimeout
  await new Promise((resolve) => setTimeout(resolve, 500));

  expect(service.fetchBooks).toHaveBeenCalled();
});
```

## Coverage

Coverage reports are generated in the `coverage/` directory. View the HTML report:

```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

## E2E Testing (Cypress)

### Running E2E Tests

```bash
# Run E2E tests headless
npm run e2e

# Open Cypress interactive runner
npm run e2e:open
```

> **Note:** The Angular dev server (`npm start`) must be running on port 4200 before running E2E tests.

### Configuration

- **Config file:** `cypress.config.ts`
- **Spec pattern:** `e2e/specs/**/*.cy.ts`
- **Base URL:** `http://localhost:4200`
- **Support file:** `e2e/support/e2e.ts`
- **Viewport:** 1280x720

### E2E Test Specs

| Spec                 | Description                                                        |
| -------------------- | ------------------------------------------------------------------ |
| `home.cy.ts`         | Hero section, CTA navigation, featured books, category links       |
| `navbar.cy.ts`       | Navigation links, cart icon, login/account link, brand link        |
| `books.cy.ts`        | Search, grid/list toggle, category filter, pagination, add to cart |
| `categories.cy.ts`   | Category cards display and navigation                              |
| `login.cy.ts`        | Form fields, login flow, password visibility, register link        |
| `register.cy.ts`     | Registration form, submit flow, login link                         |
| `cart.cy.ts`         | Empty cart, add items, quantity controls, promo codes, checkout    |
| `checkout.cy.ts`     | Stepper flow, address form, payment selection, order placement     |
| `account.cy.ts`      | User profile, order history, addresses                             |
| `admin.cy.ts`        | Dashboard, books table, add book form                              |
| `book-details.cy.ts` | Book info display, add to cart, back navigation                    |
| `full-flow.cy.ts`    | End-to-end shopping flow: browse → cart → checkout → order         |

## E2E Testing (Playwright)

### Running E2E Tests

```bash
# Run all Playwright tests (headless)
npm run e2e:pw

# Open interactive UI mode
npm run e2e:pw:ui

# Run in headed browser
npm run e2e:pw:headed

# View HTML report
npm run e2e:pw:report
```

> **Note:** Playwright auto-starts the dev server via `webServer` config. No need to run `npm start` manually.

### Configuration

- **Config file:** `playwright.config.ts`
- **Test directory:** `playwright/specs/`
- **Base URL:** `http://localhost:4200`
- **Browsers:** Chromium (expandable to Firefox, WebKit)
- **Retries:** 2 in CI, 0 locally
- **Traces:** Captured on first retry
- **Screenshots:** On failure only

### Playwright Test Specs

| Spec                   | Description                                                        |
| ---------------------- | ------------------------------------------------------------------ |
| `home.spec.ts`         | Hero section, CTA, featured books, categories, View All link       |
| `navbar.spec.ts`       | Nav links, cart icon, login/account, brand routing                 |
| `books.spec.ts`        | Search, grid/list toggle, category filter, pagination, add to cart |
| `categories.spec.ts`   | Category cards display and navigation                              |
| `login.spec.ts`        | Form fields, login flow, password visibility, register link        |
| `register.spec.ts`     | Registration form, submit flow, login link                         |
| `cart.spec.ts`         | Empty cart, add items, quantity controls, promo codes, checkout    |
| `checkout.spec.ts`     | Stepper flow, address form, payment selection, order placement     |
| `account.spec.ts`      | User profile, email, tab navigation, addresses                     |
| `admin.spec.ts`        | Dashboard, books/orders tabs, table display, add book form         |
| `book-details.spec.ts` | Book info display, add to cart, back navigation                    |
| `full-flow.spec.ts`    | Full shopping flow: browse → cart → checkout → order               |

### Cypress vs Playwright

| Feature             | Cypress (`e2e/`)        | Playwright (`playwright/`) |
| ------------------- | ----------------------- | -------------------------- |
| Config              | `cypress.config.ts`     | `playwright.config.ts`     |
| Run command         | `npm run e2e`           | `npm run e2e:pw`           |
| Interactive mode    | `npm run e2e:open`      | `npm run e2e:pw:ui`        |
| Dev server          | Manual (`npm start`)    | Auto-start via `webServer` |
| Cross-browser       | Chromium, Firefox, Edge | Chromium, Firefox, WebKit  |
| Spec file extension | `.cy.ts`                | `.spec.ts`                 |

### CI Coverage

The Tests workflow in GitHub Actions runs `jest --coverage` on every PR. It posts a coverage summary table (statements, branches, functions, lines) as a PR comment with the full per-file report in a collapsible section. The comment is updated on subsequent pushes to avoid duplicates.

### CI E2E Regression (`.github/workflows/e2e.yml`)

The E2E workflow runs on every pull request to `main` with three jobs:

1. **Cypress E2E** — Builds the Angular app, serves it via `angular-http-server`, runs `cypress run`
2. **Playwright E2E** — Builds the Angular app, installs Chromium, runs `playwright test`
3. **E2E Summary** — Posts a combined regression report as a PR comment showing pass/fail status for both frameworks with expandable output details

Both Cypress and Playwright jobs run **in parallel** for faster feedback. Artifacts (screenshots, videos, reports) are uploaded and retained for 7 days.
