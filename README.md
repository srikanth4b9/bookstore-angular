# 📚 Library Book Store (Full-Stack Angular 21 & Node.js)

A modern, production-ready, full-stack E-commerce application for a Library/Bookstore. This project showcases enterprise-level development standards using the latest Angular 21 features and a modular Node.js/Express backend.

---

## 🚀 Key Features

### 1️⃣ User Management

- **Registration & Login**: Secure user authentication flows.
- **Profile Management**: Manage user details, addresses, and account settings.
- **Order History**: Track past purchases and view detailed order summaries.
- **Wishlist**: Save favorite books for future purchase.

### 2️⃣ Book Catalog & Discovery

- **Advanced Search**: Case-insensitive, partial matching for Title, Author, or ISBN using MongoDB Regex, with debounced input to optimize performance.
- **Dynamic Filtering**: Narrow down results by Category with real-time book count badges.
- **Smart Sorting**: Fully functional server-side sorting by Price, Rating, Title, and New Arrivals.
- **Performance Optimized**: Reactive Signal-based state management with loop-free updates and RxJS debouncing.
- **Dual View Modes**: Seamlessly toggle between a visual **Grid View** and a detailed **List View**.
- **Rich Details**: Comprehensive book pages featuring interactive ratings, chip-based genres, and customer reviews.

### 3️⃣ Shopping Experience

- **Signal-Based Cart**: High-performance, real-time cart updates using Angular Signals.
- **Quantity Management**: Intuitive controls to update or remove items directly in the cart.
- **Wizard-Style Checkout**: A smooth, multi-step `mat-stepper` flow for Shipping, Payment, and Review.

### 4️⃣ Admin Dashboard

- **Inventory Management**: Add, edit, and delete books in real-time.
- **Sales Analytics**: View total sales and monitor order statuses.
- **Admin Portal**: Specialized UI for managing the entire store's backend data.

---

## 🛠 Tech Stack & Modern Concepts

### Frontend (Angular 21)

- **Angular Material UI**: Integrated a comprehensive Design System using `mat-card`, `mat-toolbar`, `mat-stepper`, `mat-table`, and more.
- **Deferrable Views (`@defer`)**: Optimized performance using the latest Angular deferral concepts with custom `@loading`, `@placeholder`, and `@error` states.
- **Standalone Components**: Modular architecture without the overhead of NgModules.
- **Angular Signals**: Modern, fine-grained reactivity for state management (Cart, Books, User, Loading states).
- **Reactive Routing**: Seamless navigation with lazy loading and query parameter handling.
- **SCSS Architecture**: Professional styling with global variables, mixins, and a responsive Design System.

### Backend (Node.js & Express)

- **MongoDB & Mongoose**: Fully dynamic data persistence replacing previous mock data files.
- **Advanced Querying**: Implemented server-side **Pagination**, **Regex Search**, and **Relational Aggregations** (e.g., book counts per category).
- **TypeScript & ESM**: Full type safety with modern ES Modules (`type: module`).
- **Production-Grade Middleware**:
  - **Helmet & Security**: Integrated security headers for production readiness.
  - **Joi Validation**: Robust request payload validation schemas.
  - **Global Error Handler**: Centralized 404 and 500 error management.
  - **Structured Logging**: Custom logger utility with timestamps and log levels.
  - **Request Logger**: Monitoring incoming traffic for better observability.
- **CORS & JSON Parsing**: Secure and efficient API communication.

### Testing

- **Jest 30**: Unit and component testing framework.
- **jest-preset-angular**: Angular-specific Jest utilities for standalone components.
- **ng-mocks**: Lightweight mocking for Angular services, components, and directives.
- **@testing-library/dom**: DOM querying utilities for readable, user-centric assertions.
- **Cypress**: End-to-end browser testing with Angular-native syntax and full user flow coverage.
- **Storybook**: Isolated component development, visual testing, and living documentation.

### Tools & Quality

- **ESLint**: Strictly enforced code quality for both Frontend (`angular-eslint`) and Backend (`eslint-plugin-n`, `eslint-plugin-promise`, `eslint-plugin-import`).
- **Prettier**: Consistent formatting with `bracketSpacing: false`, single quotes, and 100-char print width.
- **TypeScript Strict Mode**: Zero-tolerance policy for `any` type and implicit returns.
- **REST API Design**: Professionally documented endpoints in `API_DESIGN.md`.

### CI/CD

GitHub Actions pipelines run on every pull request to `main`:

| Workflow           | Description                                                  |
| ------------------ | ------------------------------------------------------------ |
| **Lint**           | ESLint checks for Angular app and server                     |
| **Prettier**       | Code formatting validation                                   |
| **Tests**          | Jest unit tests with coverage reporting                      |
| **Build**          | Production build verification (frontend + server)            |
| **Security Audit** | npm audit for known vulnerabilities                          |
| **CodeQL**         | GitHub code scanning for JS/TS                               |
| **Code Review**    | Reviewdog posts ESLint findings as inline PR review comments |
| **Wiki Sync**      | Auto-syncs `docs/` to GitHub Wiki on push to main            |

---

## 📂 Project Structure

```text
├── .storybook/             # Storybook configuration
│   ├── main.ts             # Storybook framework & addon config
│   └── preview.ts          # Global decorators & parameters
├── src/                    # Frontend (Angular 21)
│   ├── app/
│   │   ├── .storybook/     # Shared mock data & providers for stories
│   │   ├── components/     # Reusable UI components (Navbar, etc.)
│   │   ├── pages/          # Page-level components (Home, Books, Admin, etc.)
│   │   ├── services/       # State management and API services (Signals)
│   │   ├── models/         # Shared TypeScript interfaces
│   │   ├── config/         # API and App configurations
│   │   └── styles/         # Global SCSS variables and mixins
│   └── styles.scss         # Global Material theme entry
├── server/                 # Backend (Node.js & MongoDB)
│   ├── routes/             # API Endpoints (Books, Orders, Categories)
│   ├── models/             # Mongoose Data Models
│   ├── validation/         # Joi Request Validation schemas
│   ├── middleware/         # Custom security and logging middleware
│   ├── utils/              # Helper utilities (Logger)
│   ├── config/             # Database connection config
│   ├── seed.ts             # Database seeding script (1000+ books)
│   └── server.ts           # Server entry point
├── e2e/                    # Cypress E2E tests
│   ├── specs/              # E2E test specs (home, books, cart, checkout, etc.)
│   ├── support/            # Cypress support files and custom commands
│   └── fixtures/           # Test fixtures
├── docs/                   # Project documentation (synced to GitHub Wiki)
└── API_DESIGN.md           # Backend API Documentation
```

---

## 🚦 Getting Started

### Prerequisites

- **Node.js**: v20+
- **npm**: v10+
- **MongoDB**: v7.0+ (Local instance or Atlas)

### 1. Database Setup

Ensure MongoDB is running. If you're on macOS using Homebrew:

```bash
brew services start mongodb-community@7.0
```

### 2. Install Dependencies

```bash
# Install root (Frontend) dependencies
npm install --legacy-peer-deps

# Install server (Backend) dependencies
cd server
npm install
cd ..
```

### 3. Seed & Run

```bash
# 1. Seed the database with 1000+ books (Required for first run)
cd server
npm run seed

# 2. Start the Backend Server (Port 3000)
npm start

# 3. Start the Angular Frontend (Port 4200) - Open new terminal
cd ..
npm start
```

Navigate to `http://localhost:4200` to see the app in action!

---

## 📖 Documentation

Detailed documentation is available in the [`docs/`](docs/) directory:

| Document                                       | Description                                       |
| ---------------------------------------------- | ------------------------------------------------- |
| [Architecture Overview](docs/architecture.md)  | Frontend/backend architecture, data flow, routing |
| [API Documentation](docs/api-documentation.md) | All REST endpoints, request/response formats      |
| [Development Guide](docs/development-guide.md) | Setup, scripts, code style, project structure     |
| [Deployment Guide](docs/deployment-guide.md)   | Build, environment variables, production setup    |
| [Contributing Guide](docs/contributing.md)     | Branch naming, commit conventions, PR process     |
| [Database Schema](docs/database-schema.md)     | MongoDB collections, fields, indexes, seeding     |
| [Testing Guide](docs/testing-guide.md)         | Jest, ng-mocks patterns, coverage, CI             |

---

## 🧪 Quality Assurance

### Available Scripts

| Script                    | Description                              |
| ------------------------- | ---------------------------------------- |
| `npm start`               | Start Angular dev server                 |
| `npm run build`           | Production build                         |
| `npm test`                | Run unit tests                           |
| `npm run test:coverage`   | Run tests with coverage report           |
| `npm run lint`            | Lint Angular app                         |
| `npm run lint:server`     | Lint server code                         |
| `npm run lint:all`        | Lint everything                          |
| `npm run lint:fix`        | Auto-fix lint issues                     |
| `npm run lint:fix:all`    | Auto-fix all lint and formatting issues  |
| `npm run format`          | Format code with Prettier                |
| `npm run format:check`    | Check formatting without modifying files |
| `npm run storybook`       | Launch Storybook dev server              |
| `npm run build-storybook` | Build static Storybook for deployment    |
| `npm run e2e`             | Run Cypress E2E tests (headless)         |
| `npm run e2e:open`        | Open Cypress interactive test runner     |
