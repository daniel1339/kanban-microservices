# Estructura de Tests - Auth Service

Este documento explica la organización de los tests en el Auth Service.

## 📁 Estructura de Carpetas

```
test/
├── fixtures/           # Datos de prueba reutilizables
│   ├── index.ts       # Exportaciones de fixtures
│   └── users.fixture.ts # Fixtures para usuarios
├── e2e/               # Tests de integración (end-to-end)
│   └── auth.e2e-spec.ts # Tests e2e para autenticación
├── jest-e2e.json      # Configuración de Jest para e2e
└── README.md          # Este archivo
```

## 🧪 Tipos de Tests

### **Fixtures (`test/fixtures/`)**
- **Propósito**: Datos de prueba reutilizables
- **Contenido**: Mock data, DTOs, respuestas esperadas
- **Uso**: Importar en tests unitarios y e2e

### **Tests E2E (`test/e2e/`)**
- **Propósito**: Tests de integración con base de datos real
- **Contenido**: Flujos completos de endpoints
- **Ejecución**: `npm run test:integration`

### **Tests Unitarios (`src/**/*.spec.ts`)**
- **Propósito**: Tests de funciones individuales
- **Contenido**: Tests de servicios y controladores
- **Ejecución**: `npm run test:unit`

## 🔧 Fixtures Disponibles

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

### **Datos Incluidos**
- ✅ Usuarios válidos e inválidos
- ✅ DTOs de registro y login
- ✅ Respuestas de autenticación
- ✅ Payloads de JWT
- ✅ Tokens de ejemplo
- ✅ Errores de validación

## 🚀 Comandos de Testing

### **Ejecutar Tests Específicos**
```bash
# Tests unitarios
npm run test:unit

# Tests de integración (incluye setup de DB)
npm run test:integration

# Setup de base de datos de test
npm run test:setup

# Todos los tests
npm run test:all

# Tests con coverage
npm run test:cov
```

### **Configuración de Base de Datos**
Los tests e2e requieren una base de datos PostgreSQL de test:
- **URL**: `postgresql://kanban_user:kanban_password@localhost:5432/kanban_test`
- **Setup automático**: Se ejecuta automáticamente con `npm run test:integration`
- **Manual**: `npm run test:setup` para crear la DB de test

### **Configuración de Jest**
- **Unit Tests**: `jest.config.js` (raíz del proyecto)
- **E2E Tests**: `test/jest-e2e.json`

## 📝 Escribir Nuevos Tests

### **1. Crear Fixtures**
```typescript
// test/fixtures/nuevo.fixture.ts
export const mockNuevoData = {
  // Datos de prueba
};
```

### **2. Crear Test Unitario**
```typescript
// src/nuevo/nuevo.service.spec.ts
import { mockNuevoData } from '../../test/fixtures';

describe('NuevoService', () => {
  it('should do something', () => {
    // Usar mockNuevoData
  });
});
```

### **3. Crear Test E2E**
```typescript
// test/e2e/nuevo.e2e-spec.ts
import { mockNuevoData } from '../fixtures';

describe('NuevoController (e2e)', () => {
  it('/nuevo (POST)', () => {
    return request(app.getHttpServer())
      .post('/nuevo')
      .send(mockNuevoData)
      .expect(201);
  });
});
```

## 🎯 Mejores Prácticas

### **1. Usar Fixtures**
- ✅ Reutilizar datos de prueba
- ✅ Mantener consistencia
- ✅ Fácil mantenimiento

### **2. Organización Clara**
- ✅ Tests unitarios en `src/`
- ✅ Tests e2e en `test/e2e/`
- ✅ Fixtures en `test/fixtures/`

### **3. Nombres Descriptivos**
- ✅ `auth.e2e-spec.ts` para tests de auth
- ✅ `users.fixture.ts` para datos de usuarios
- ✅ Nombres de tests claros

### **4. Limpieza**
- ✅ Limpiar mocks después de cada test
- ✅ Usar `beforeEach` y `afterEach`
- ✅ Cerrar conexiones en `afterAll`

## 🔄 Mantenimiento

### **Actualizar Fixtures**
1. Modificar archivo de fixture
2. Actualizar tests que usen esos datos
3. Verificar que todos los tests pasen

### **Agregar Nuevos Tests**
1. Crear archivo de test
2. Importar fixtures necesarios
3. Seguir estructura AAA (Arrange, Act, Assert)
4. Ejecutar tests para verificar

### **Debugging**
```bash
# Debug tests unitarios
npm run test:debug

# Ver coverage
npm run test:cov
# Abrir coverage/lcov-report/index.html
```

## 📊 Métricas

### **Cobertura Actual**
- **AuthService**: 100%
- **AuthController**: 100%
- **E2E Tests**: 100% de endpoints

### **Tiempo de Ejecución**
- **Unit Tests**: ~2-3 segundos
- **E2E Tests**: ~10-15 segundos
- **Total**: ~15-20 segundos 