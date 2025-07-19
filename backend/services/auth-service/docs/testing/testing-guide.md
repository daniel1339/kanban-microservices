# Testing - Auth Service

Este documento explica cómo ejecutar y escribir tests para el Auth Service.

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

## 📊 Cobertura de Tests

### **AuthService Tests**
- ✅ **register**: Registro exitoso, validaciones, duplicados
- ✅ **login**: Login con email/username, credenciales inválidas
- ✅ **refreshToken**: Renovación exitosa, tokens inválidos
- ✅ **logout**: Logout exitoso
- ✅ **validateUser**: Validación de credenciales
- ✅ **getProfile**: Obtención de perfil, usuario no encontrado

### **AuthController Tests**
- ✅ **register**: Endpoint de registro
- ✅ **login**: Endpoint de login
- ✅ **refreshToken**: Endpoint de renovación
- ✅ **logout**: Endpoint de logout
- ✅ **validateUser**: Endpoint de validación
- ✅ **getProfile**: Endpoint de perfil

### **E2E Tests**
- ✅ **Registro**: Flujo completo de registro
- ✅ **Login**: Flujo completo de login
- ✅ **Refresh**: Renovación de tokens
- ✅ **Profile**: Obtención de perfil autenticado
- ✅ **Validación**: Validación de credenciales
- ✅ **Logout**: Cierre de sesión
- ✅ **Errores**: Casos de error y validaciones

## 🔧 Configuración de Tests

### **Variables de Entorno para Tests**
```env
NODE_ENV=test
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=kanban_test
JWT_SECRET=test-jwt-secret-key-for-testing-only
```

### **Base de Datos de Tests**
- **Base de datos separada**: `kanban_test`
- **Sincronización automática**: `synchronize: true`
- **Sin logging**: `logging: false`

## 📝 Escribir Nuevos Tests

### **Test Unitario Ejemplo**
```typescript
describe('MiServicio', () => {
  let service: MiServicio;
  let mockRepository: Repository<MiEntidad>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MiServicio,
        {
          provide: getRepositoryToken(MiEntidad),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<MiServicio>(MiServicio);
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

### **Test E2E Ejemplo**
```typescript
describe('MiController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/mi-endpoint (GET)', () => {
    return request(app.getHttpServer())
      .get('/mi-endpoint')
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