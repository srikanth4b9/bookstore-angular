# Testing Guide

## Overview

| Tool | Purpose |
|------|---------|
| **Jest 30** | Test runner and assertion library |
| **jest-preset-angular** | Angular-specific Jest setup (zoneless) |
| **ng-mocks** | Mocking Angular components, services, directives |
| **@testing-library/dom** | DOM querying utilities |
| **Playwright** | End-to-end browser testing |
| **Storybook** | Isolated component development and visual testing |

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
  .mock(ServiceToMock, { /* mock implementation */ })
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

### CI Coverage

The Tests workflow in GitHub Actions runs `jest --coverage` on every PR. It posts a coverage summary table (statements, branches, functions, lines) as a PR comment with the full per-file report in a collapsible section. The comment is updated on subsequent pushes to avoid duplicates.
