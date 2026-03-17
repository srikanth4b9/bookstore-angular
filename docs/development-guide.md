# Development Guide

## Prerequisites

- **Node.js** v20+
- **npm** v10+
- **MongoDB** v7.0+ (local instance or Atlas)

## Setup

### 1. Install Dependencies

```bash
# Frontend dependencies
npm install --legacy-peer-deps

# Server dependencies
cd server && npm install && cd ..
```

> `--legacy-peer-deps` is required because `ng-mocks@14` does not declare support for Angular 21.

### 2. Database Setup

Ensure MongoDB is running:

```bash
# macOS with Homebrew
brew services start mongodb-community@7.0
```

Default connection: `mongodb://localhost:27017/bookstore`

Override with the `MONGODB_URI` environment variable.

### 3. Seed the Database

```bash
cd server && npm run seed
```

This creates 6 categories and 1,000 sample books.

### 4. Start Development Servers

```bash
# Terminal 1: Backend (port 3000)
cd server && npm start

# Terminal 2: Frontend (port 4200)
npm start
```

Navigate to `http://localhost:4200`.

## Available Scripts

### Frontend

| Script | Description |
|--------|-------------|
| `npm start` | Start Angular dev server |
| `npm run build` | Production build |
| `npm test` | Run Jest unit tests |
| `npm run test:coverage` | Tests with coverage report |
| `npm run lint` | ESLint check on Angular app |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm run format` | Format with Prettier |
| `npm run format:check` | Check formatting (CI) |
| `npm run storybook` | Launch Storybook dev server |
| `npm run build-storybook` | Build static Storybook |

### Server

| Script | Description |
|--------|-------------|
| `npm start` | Start with tsx watch (auto-reload) |
| `npm run seed` | Seed database with sample data |
| `npm run build` | Compile TypeScript |

### Combined

| Script | Description |
|--------|-------------|
| `npm run lint:all` | Lint frontend + server |
| `npm run lint:fix:all` | Fix all lint + formatting issues |

## Code Style

### Prettier

Configuration in `.prettierrc`:
- Print width: 100
- Single quotes
- No bracket spacing (`{foo}` not `{ foo }`)
- Angular parser for HTML files

### ESLint

Configuration in `eslint.config.js`:

**Angular code:**
- Component selectors: `app-` prefix, kebab-case
- Directive selectors: `app` prefix, camelCase
- Uses `angular-eslint` recommended rules

**Server code:**
- `no-console` warning (info/error/warn/debug allowed)
- Promise handling enforcement
- Unused vars with `_` prefix ignored

### TypeScript

- Strict mode enabled
- ES2022 target
- Strict Angular compiler options (`strictInjectionParameters`, `strictTemplates`)

## Project Structure

```
src/
  app/
    .storybook/       # Shared mock data & providers for stories
      mock-data.ts    # Reusable mock books, users, orders, etc.
      mock-providers.ts # createMockDataService() factory
    components/       # Shared UI components
      navbar/         # Top navigation bar
    config/           # Frontend configuration
      api.config.ts   # API base URL
    models/           # TypeScript interfaces and enums
      models.ts       # Book, User, Order, Cart, Category, etc.
    pages/            # Route-level components (each has *.stories.ts)
    services/         # Angular services (state + API calls)
      mock-data.service.ts
  styles.scss         # Global Material theme
  test-setup.ts       # Jest test environment config
  main.ts             # App entry point

server/
  config/             # Database connection
    db.ts
  middleware/         # Express middleware
    error-handler.ts  # 404 + global error handler
    request-logger.ts # Request logging
  models/             # Mongoose schemas
    book.model.ts
    category.model.ts
    order.model.ts
  routes/             # API route handlers
    books.ts
    categories.ts
    orders.ts
  types/              # Shared TypeScript types
    models.ts
  utils/              # Utilities
    logger.ts         # Structured logging
  validation/         # Joi schemas
    book.validation.ts
  seed.ts             # Database seeder
  server.ts           # Express app entry point
```