# Quick Test Commands Reference

## Frontend Tests

### Unit Tests (Jasmine/Karma)

```bash
cd frontend
npm install
npm test                 # Watch mode
npm run test:ci          # CI mode - headless, single-run, coverage
```

### E2E Tests (Cypress)

```bash
cd frontend
npm run e2e              # Headless mode
npm run e2e:open         # Interactive UI
```

## Backend Tests

### All Services

```bash
cd backend
mvn clean test
```

### Individual Services

```bash
# User Service
cd backend/services/user && mvn test

# Product Service
cd backend/services/product && mvn test

# Media Service
cd backend/services/media && mvn test
```

### With Coverage Reports

```bash
cd backend
mvn test jacoco:report
# Reports in: backend/services/*/target/site/jacoco/index.html
```

## Quick CI Test Run

```bash
# From project root
cd backend && mvn clean test && cd ../frontend && npm ci && npm run test:ci
```

## Test Files Created

### Frontend

- `frontend/src/app/components/auth/login.component.spec.ts`
- `frontend/src/app/components/home/home.component.spec.ts`
- `frontend/src/app/services/auth.service.spec.ts`
- `frontend/src/app/services/product.service.spec.ts`
- `frontend/src/app/services/cart.service.spec.ts`
- `frontend/cypress/e2e/critical-path.cy.ts`
- `frontend/cypress.config.ts`
- `frontend/karma.conf.js`

### Backend

- `backend/services/user/src/test/java/com/buyapp/userservice/service/UserServiceTest.java`
- `backend/services/product/src/test/java/com/buyapp/productservice/service/ProductServiceTest.java`
- `backend/services/media/src/test/java/com/buyapp/mediaservice/service/MediaServiceTest.java`

## Documentation

- `TESTING.md` - Complete test suite documentation
- `TEST-COMMANDS.md` - This file

## Notes

- Tests run without servers (mocked dependencies)
- E2E tests can run with API mocks or against live services
- All tests produce JUnit XML reports for Jenkins
- Coverage reports generated automatically
