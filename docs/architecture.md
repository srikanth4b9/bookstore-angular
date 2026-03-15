# Architecture Overview

## High-Level Architecture

```
┌─────────────────────────┐       ┌─────────────────────────┐
│   Angular 21 Frontend   │       │   Express 5 Backend     │
│   (Port 4200)           │──────▶│   (Port 3000)           │
│                         │  HTTP │                         │
│  Standalone Components  │◀──────│  REST API (/api/*)      │
│  Angular Signals        │       │  Joi Validation         │
│  Angular Material UI    │       │  Helmet + CORS          │
└─────────────────────────┘       └──────────┬──────────────┘
                                             │
                                             ▼
                                  ┌─────────────────────────┐
                                  │   MongoDB               │
                                  │   (Port 27017)          │
                                  │                         │
                                  │   Collections:          │
                                  │   - books               │
                                  │   - categories          │
                                  │   - orders              │
                                  └─────────────────────────┘
```

## Frontend Architecture

### Bootstrap Chain

1. `src/main.ts` — Calls `bootstrapApplication(AppComponent, appConfig)`
2. `src/app/app.config.ts` — Registers providers:
   - `provideBrowserGlobalErrorListeners()` — Global error handling
   - `provideRouter(routes)` — Angular Router
   - `provideHttpClient()` — HTTP client for API calls
3. `src/app/app.routes.ts` — Defines all application routes

### Component Architecture

All components use Angular's standalone component pattern (no NgModules).

### State Management

State is managed via Angular Signals in `MockDataService` (singleton, `providedIn: 'root'`):

| Signal | Type | Description |
|--------|------|-------------|
| `books` | `Signal<Book[]>` | Current page of books |
| `pagination` | `Signal<Pagination>` | Pagination metadata |
| `categories` | `Signal<Category[]>` | All categories |
| `currentUser` | `Signal<User>` | Logged-in user |
| `cartItems` | `Signal<CartItem[]>` | Shopping cart items |
| `cartSubtotal` | `computed<number>` | Derived cart total |
| `orders` | `Signal<Order[]>` | User's orders |
| `isLoading` | `Signal<boolean>` | Loading state |

### Routing

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | HomeComponent | Landing page |
| `/categories` | CategoriesComponent | Browse categories |
| `/books` | BooksComponent | Book listing with search, filter, sort |
| `/books/:id` | BookDetailsComponent | Book detail view |
| `/cart` | CartComponent | Shopping cart |
| `/checkout` | CheckoutComponent | Multi-step checkout |
| `/account` | AccountComponent | User profile |
| `/login` | LoginComponent | Authentication |
| `/register` | RegisterComponent | New user signup |
| `/admin` | AdminComponent | Admin dashboard |
| `**` | Redirect → `/` | Fallback |

## Backend Architecture

### Middleware Stack (executed in order)

```
Request
  │
  ▼
helmet()              → Security headers
cors()                → Cross-origin support
express.json()        → JSON body parsing
requestLogger         → Logs [METHOD] [URL]
  │
  ▼
Route Handler         → /api/books, /api/categories, /api/orders
  │
  ▼
notFound              → 404 for unmatched routes
errorHandler          → Centralized error response
```

### API Base URL

- Backend: `http://localhost:3000/api`
- Configured in frontend at `src/app/config/api.config.ts`

### Compatibility Redirects

Top-level routes (`/books`, `/categories`, `/orders`) redirect to their `/api/*` counterparts for backward compatibility.

## Data Flow

```
User Interaction
  │
  ▼
Angular Component (calls service method)
  │
  ▼
MockDataService (HTTP request via HttpClient)
  │
  ▼
Express Route Handler (validates with Joi, queries MongoDB)
  │
  ▼
Mongoose Model (executes query)
  │
  ▼
MongoDB (returns data)
  │
  ▼
Response flows back through the chain, updating Angular Signals
```
