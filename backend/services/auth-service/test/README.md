# Test Structure - Auth Service

This document explains the organization of tests in the Auth Service.

## 📁 Folder Structure

```
test/
├── fixtures/           # Reusable test data
│   ├── index.ts       # Fixture exports
│   └── users.fixture.ts # User fixtures
├── e2e/               # Integration tests (end-to-end)
│   └── auth.e2e-spec.ts # E2E tests for authentication
├── jest-e2e.json      # Jest configuration for e2e
└── README.md          # This file
```

## 🧪 Test Types

### **Fixtures (`test/fixtures/`)**
- **Purpose**: Reusable test data
- **Content**: Mock data, DTOs, expected responses
- **Usage**: Import in unit and e2e tests

### **E2E Tests (`test/e2e/`)**
- **Purpose**: Integration tests with real database
- **Content**: Complete endpoint flows
- **Execution**: `npm run test:integration`

### **Unit Tests (`src/**/*.spec.ts`)**
- **Purpose**: Individual function tests
- **Content**: Service and controller tests
- **Execution**: `npm run test:unit`

## 🔧 Available Fixtures

### **Users Fixture**
```typescript
import { 
  mockUsers, 
  mockRegisterDto, 
  mockLoginDto, 
  mockAuthResponse,
  mockJwtPayload 
} from '../../test/fixtures';
```

### **Included Data**
- ✅ Valid and invalid users
- ✅ Registration and login DTOs
- ✅ Authentication responses
- ✅ JWT payloads
- ✅ Example tokens
- ✅ Validation errors

## 🚀 Testing Commands

### **Run Specific Tests**
```bash
# Unit tests
npm run test:unit

# Integration tests (includes DB setup)
npm run test:integration

# Test database setup
npm run test:setup

# All tests
npm run test:all

# Tests with coverage
npm run test:cov
```

### **Database Configuration**
E2E tests require a PostgreSQL test database:
- **URL**: `postgresql://kanban_user:kanban_password@localhost:5432/kanban_test`
- **Automatic setup**: Runs automatically with `npm run test:integration`
- **Manual**: `npm run test:setup` to create test DB

### **Jest Configuration**
- **Unit Tests**: `jest.config.js` (project root)
- **E2E Tests**: `test/jest-e2e.json`

## 📝 Writing New Tests

### **1. Create Fixtures**
```typescript
// test/fixtures/new.fixture.ts
export const mockNewData = {
  // Test data
};
```

### **2. Create Unit Test**
```typescript
// src/new/new.service.spec.ts
import { mockNewData } from '../../test/fixtures';

describe('NewService', () => {
  it('should do something', () => {
    // Use mockNewData
  });
});
```

### **3. Create E2E Test**
```typescript
// test/e2e/new.e2e-spec.ts
import { mockNewData } from '../fixtures';

describe('NewController (e2e)', () => {
  it('/new (POST)', () => {
    return request(app.getHttpServer())
      .post('/new')
      .send(mockNewData)
      .expect(201);
  });
});
```

## 🎯 Best Practices

### **1. Use Fixtures**
- ✅ Reuse test data
- ✅ Maintain consistency
- ✅ Easy maintenance

### **2. Clear Organization**
- ✅ Unit tests in `src/`
- ✅ E2E tests in `test/e2e/`
- ✅ Fixtures in `test/fixtures/`

### **3. Descriptive Names**
- ✅ `auth.e2e-spec.ts` for auth tests
- ✅ `users.fixture.ts` for user data
- ✅ Clear test names

### **4. Cleanup**
- ✅ Clean mocks after each test
- ✅ Use `beforeEach` and `afterEach`
- ✅ Close connections in `afterAll`

## 🔄 Maintenance

### **Update Fixtures**
1. Modify fixture file
2. Update tests that use that data
3. Verify all tests pass

### **Add New Tests**
1. Create test file
2. Import necessary fixtures
3. Follow AAA structure (Arrange, Act, Assert)
4. Run tests to verify

### **Debugging**
```bash
# Debug unit tests
npm run test:debug

# View coverage
npm run test:cov
# Open coverage/lcov-report/index.html
```

## 📊 Metrics

### **Current Coverage**
- **AuthService**: 100%
- **AuthController**: 100%
- **E2E Tests**: 100% of endpoints

### **Execution Time**
- **Unit Tests**: ~2-3 seconds
- **E2E Tests**: ~10-15 seconds
- **Total**: ~15-20 seconds 