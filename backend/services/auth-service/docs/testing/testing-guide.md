# Testing - Auth Service

This document explains how to run and write tests for the Auth Service.

## 📋 Tipos de Tests

### **🧪 Tests Unitarios**
- **Ubicación**: `src/**/*.spec.ts`
- **Propósito**: Probar funciones y métodos individuales
- **Ejecución**: `npm run test:unit`

### **🔗 Tests de Integración (E2E)**
- **Ubicación**: `test/**/*.e2e-spec.ts`
- **Propósito**: Probar endpoints completos con base de datos real
- **Ejecución**: `npm run test:integration`

## 🚀 Comandos de Testing

### **Ejecutar Todos los Tests**
```bash
npm run test:all
```

### **Tests Unitarios**
```bash
npm run test:unit
```

### **Tests de Integración**
```bash
npm run test:integration
```

### **Tests con Coverage**
```bash
npm run test:cov
```

### **Tests en Modo Watch**
```bash
npm run test:watch
```

### **Tests para CI/CD**
```bash
npm run test:ci
```

## 📊 Test Coverage

### **AuthService Tests**
- ✅ **register**: Successful registration, validations, duplicates
- ✅ **login**: Login with email/username, invalid credentials
- ✅ **refreshToken**: Successful renewal, invalid tokens
- ✅ **logout**: Successful logout
- ✅ **validateUser**: Credential validation
- ✅ **getProfile**: Profile retrieval, user not found

### **AuthController Tests**
- ✅ **register**: Registration endpoint
- ✅ **login**: Login endpoint
- ✅ **refreshToken**: Token renewal endpoint
- ✅ **logout**: Logout endpoint
- ✅ **validateUser**: Validation endpoint
- ✅ **getProfile**: Profile endpoint

### **E2E Tests**
- ✅ **Registration**: Complete registration flow
- ✅ **Login**: Complete login flow
- ✅ **Refresh**: Token renewal
- ✅ **Profile**: Authenticated profile retrieval
- ✅ **Validation**: Credential validation
- ✅ **Logout**: Session closure
- ✅ **Errors**: Error cases and validations

## 🔧 Test Configuration

### **Environment Variables for Tests**
```env
NODE_ENV=test
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=kanban_test
JWT_SECRET=test-jwt-secret-key-for-testing-only
```

### **Test Database**
- **Separate database**: `kanban_test`
- **Automatic synchronization**: `synchronize: true`
- **No logging**: `logging: false`

## 📝 Writing New Tests

### **Unit Test Example**
```typescript
describe('MyService', () => {
  let service: MyService;
  let mockRepository: Repository<MyEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MyService,
        {
          provide: getRepositoryToken(MyEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<MyService>(MyService);
  });

  it('should do something', async () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = await service.doSomething(input);
    
    // Assert
    expect(result).toBeDefined();
  });
});
```

### **E2E Test Example**
```typescript
describe('MyController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/my-endpoint (GET)', () => {
    return request(app.getHttpServer())
      .get('/my-endpoint')
      .expect(200)
      .expect((res) => {
        expect(res.body.success).toBe(true);
      });
  });
});
```

## 🎯 Mejores Prácticas

### **1. Estructura AAA**
- **Arrange**: Preparar datos y mocks
- **Act**: Ejecutar la función a testear
- **Assert**: Verificar resultados

### **2. Nombres Descriptivos**
```typescript
it('should throw UnauthorizedException when password is incorrect', async () => {
  // Test implementation
});
```

### **3. Mocks Apropiados**
- **Repositorios**: Mock de TypeORM
- **Servicios externos**: Mock de APIs
- **Configuración**: Mock de ConfigService

### **4. Limpieza**
```typescript
afterEach(() => {
  jest.clearAllMocks();
});
```

## 🚨 Troubleshooting

### **Error: Database Connection**
```bash
# Verificar que PostgreSQL esté corriendo
# Crear base de datos de test
createdb kanban_test
```

### **Error: JWT Secret**
```bash
# Asegurar que JWT_SECRET esté configurado
export JWT_SECRET=test-secret
```

### **Error: Port Already in Use**
```bash
# Cambiar puerto en .env.test
APP_PORT=3002
```

## 📈 Métricas de Calidad

### **Cobertura Mínima**
- **Statements**: 90%
- **Branches**: 85%
- **Functions**: 90%
- **Lines**: 90%

### **Ejecutar Coverage**
```bash
npm run test:cov
```

### **Ver Reporte**
```bash
# Abrir coverage/lcov-report/index.html
```

## 🔄 CI/CD Integration

### **GitHub Actions**
```yaml
- name: Run Tests
  run: |
    npm run test:ci
    npm run test:cov
```

### **Pre-commit Hooks**
```bash
# Ejecutar tests antes de commit
npm run test:unit
```

## 📚 Recursos Adicionales

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [Supertest](https://github.com/visionmedia/supertest)
- [TypeORM Testing](https://typeorm.io/testing) 