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
- **Advanced Search**: Filter books by Title, Author, or ISBN.
- **Dynamic Filtering**: Narrow down results by Category (Fiction, Non-fiction, Technology, etc.).
- **Smart Sorting**: Sort books by Price (Asc/Desc), Popularity, and New Arrivals.
- **Rich Details**: Comprehensive book pages featuring ratings, availability, and detailed descriptions.

### 3️⃣ Shopping Experience
- **Signal-Based Cart**: Real-time cart updates with Angular Signals.
- **Quantity Management**: Seamlessly add, remove, or update book quantities.
- **Checkout Flow**: Multi-step checkout with address selection and payment method integration.

### 4️⃣ Admin Dashboard
- **Inventory Management**: Add, edit, and delete books in real-time.
- **Sales Analytics**: View total sales and monitor order statuses.
- **Admin Portal**: Specialized UI for managing the entire store's backend data.

---

## 🛠 Tech Stack & Modern Concepts

### Frontend (Angular 21)
- **Standalone Components**: Modular architecture without the overhead of NgModules.
- **Angular Signals**: Modern, fine-grained reactivity for state management (Cart, Books, User).
- **Reactive Routing**: Seamless navigation with lazy loading and query parameter handling.
- **SCSS Architecture**: Professional styling with global variables, mixins, and a consistent design system.
- **HttpClient**: Robust API communication with typed responses.

### Backend (Node.js & Express)
- **TypeScript & ESM**: Full type safety with modern ES Modules (`type: module`).
- **Modular Routing**: Organized API structure (Books, Categories, Orders) using Express Routers.
- **Production-Grade Middleware**:
    - **Global Error Handler**: Centralized 404 and 500 error management.
    - **Structured Logging**: Custom logger utility with timestamps and log levels.
    - **Request Logger**: Monitoring incoming traffic for better observability.
- **CORS & JSON Parsing**: Secure and efficient API communication.

### Tools & Quality
- **ESLint**: Strictly enforced code quality for both Frontend and Backend.
- **TypeScript Strict Mode**: Zero-tolerance policy for `any` type and implicit returns.
- **REST API Design**: Professionally documented endpoints in `API_DESIGN.md`.

---

## 📂 Project Structure

```text
├── src/                    # Frontend (Angular)
│   ├── app/
│   │   ├── components/     # Reusable UI components (Navbar, etc.)
│   │   ├── pages/          # Page-level components (Home, Books, Admin, etc.)
│   │   ├── services/       # State management and API services (Signals)
│   │   ├── models/         # Shared TypeScript interfaces
│   │   └── styles/         # Global SCSS variables and mixins
│   └── styles.scss         # Global styles
├── server/                 # Backend (Node.js)
│   ├── routes/             # API Endpoints (Books, Orders, etc.)
│   ├── data/               # Data layer (Mock database)
│   ├── middleware/         # Custom Express middleware
│   ├── utils/              # Helper utilities (Logger)
│   └── server.ts           # Server entry point
└── API_DESIGN.md           # Backend API Documentation
```

---

## 🚦 Getting Started

### Prerequisites
- Node.js (v20+)
- npm (v10+)

### 1. Install Dependencies
```bash
# Install root (Frontend) dependencies
npm install

# Install server (Backend) dependencies
cd server
npm install
cd ..
```

### 2. Run the Application
You need to run both the Frontend and the Backend simultaneously.

**Start the Backend Server (Port 3000):**
```bash
cd server
npm start
```

**Start the Angular Frontend (Port 4200):**
```bash
# Open a new terminal window
npm start
```

Navigate to `http://localhost:4200` to see the app in action!

---

## 🧪 Quality Assurance

### Linting
Maintain clean code standards with unified linting:
```bash
# Run lint for everything (Frontend + Backend)
npm run lint:all

# Automatically fix lint issues
npm run lint:fix:all
```

### Build
Verify production readiness:
```bash
npm run build
```

