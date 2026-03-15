# Contributing Guide

Thank you for your interest in contributing to the Bookstore Angular project.

## Branch Naming

Use prefixed branch names:

| Prefix | Use case | Example |
|--------|----------|---------|
| `feat/` | New feature | `feat/wishlist-page` |
| `fix/` | Bug fix | `fix/cart-quantity-bug` |
| `docs/` | Documentation | `docs/update-readme` |
| `ci/` | CI/CD changes | `ci/pr-pipelines` |
| `refactor/` | Code refactoring | `refactor/signal-migration` |
| `test/` | Test additions | `test/order-service-specs` |

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

<optional body>
```

**Types:** `feat`, `fix`, `docs`, `ci`, `test`, `refactor`, `style`, `chore`

**Examples:**
```
feat(books): add price range filter to book listing
fix(cart): correct quantity update when item already exists
ci: add security audit workflow
docs: update API documentation
```

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Ensure all checks pass locally:
   ```bash
   npm run lint:all
   npm run format:check
   npm test
   npm run build
   ```
4. Push and open a PR to `main`
5. All CI pipelines must pass:
   - ESLint (Angular + server)
   - Prettier formatting check
   - Jest unit tests with coverage
   - Production build + server TypeScript check
   - Security audit
   - CodeQL code scanning
   - Reviewdog inline PR comments
6. Get a code review approval
7. Merge

## Code Guidelines

### Components
- Use standalone components (no NgModules)
- Prefix selectors with `app-` (elements: kebab-case, attributes: camelCase)
- Use Angular Signals for state, not BehaviorSubjects

### Services
- Use `providedIn: 'root'` for singleton services
- Expose state as readonly signals
- Use private writable signals internally

### Testing
- Use `ng-mocks` with `MockBuilder` for component tests
- Mock services with signals and `jest.fn()` methods
- Test user interactions, not implementation details

### Server
- Validate all inputs with Joi schemas
- Use the structured logger (`logger.info/warn/error/debug`)
- Handle errors through the centralized error handler