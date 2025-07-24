# 📚 SWAGGER/OPENAPI DOCUMENTATION STANDARDS

## 🎯 **FOLLOWED STANDARDS**

### **✅ OpenAPI 3.0 Specification**
- **Version**: OpenAPI 3.0.3
- **Format**: JSON/YAML
- **Tool**: @nestjs/swagger
- **UI**: Swagger UI 5.9.0

### **✅ Naming Standards**
- **Tags**: In English, descriptive
- **Endpoints**: RESTful conventions
- **Responses**: Consistent and typed
- **Errors**: Standard HTTP codes

---

## 🏗️ **DOCUMENTATION ARCHITECTURE**

### **📁 Folder Structure**
```
src/
├── docs/
│   ├── swagger.config.ts          # Main configuration
│   ├── examples/                  # Request/response examples
│   │   ├── auth.examples.ts
│   │   ├── user.examples.ts
│   │   └── common.examples.ts
│   ├── schemas/                   # Reusable schemas
│   │   ├── auth.schemas.ts
│   │   └── common.schemas.ts
│   └── responses/                 # Typed responses
│       ├── auth.responses.ts
│       └── error.responses.ts
```

### **🔧 Centralized Configuration**
```typescript
// src/docs/swagger.config.ts
export class SwaggerConfig {
  static setup(app: INestApplication): void {
    // Centralized configuration
  }
}
```

---

## 📋 **ENDPOINT STANDARDS**

### **1. Operations (ApiOperation)**
```typescript
@ApiOperation({ 
  summary: 'Short and descriptive title',
  description: 'Detailed description of the endpoint, use cases and behavior.',
  tags: ['auth'] // Group by functionality
})
```

### **2. Request Body (ApiBody)**
```typescript
@ApiBody({
  type: DtoClass,
  description: 'Body description',
  examples: {
    'Success case': SuccessExample,
    'Error case': ErrorExample
  }
})
```

### **3. Responses (ApiResponse)**
```typescript
@ApiResponse({ 
  status: 200, 
  description: 'Success description',
  type: ResponseDto,
  content: {
    'application/json': {
      example: ResponseExample
    }
  }
})
```

### **4. Authentication (ApiBearerAuth)**
```typescript
@ApiBearerAuth('JWT-auth') // Reference to auth schema
```

---

## 📝 **EXAMPLE STANDARDS**

### **✅ Request Examples**
```typescript
export const RegisterRequestExample = {
  summary: 'Successful registration',
  description: 'Example with valid data',
  value: {
    email: 'user@example.com',
    username: 'user123',
    password: 'Password123!',
    confirmPassword: 'Password123!'
  }
}
```

### **✅ Response Examples**
```typescript
export const RegisterResponseExample = {
  summary: 'Registration response',
  description: 'User created successfully',
  value: {
    user: {
      id: 'uuid',
      email: 'user@example.com',
      username: 'user123',
      is_verified: false,
      created_at: '2024-01-01T12:00:00.000Z'
    },
    accessToken: 'jwt-token',
    refreshToken: 'refresh-token',
    expiresIn: 900
  }
}
```

### **✅ Error Examples**
```typescript
export const ValidationErrorExample = {
  summary: 'Validation error',
  description: 'Invalid input data',
  value: {
    statusCode: 400,
    message: 'Validation failed',
    error: 'Bad Request',
    timestamp: '2024-01-01T12:00:00.000Z',
    path: '/auth/register',
    details: [
      {
        field: 'email',
        message: 'Email must be valid'
      }
    ]
  }
}
```

---

## 🏷️ **TAGGING STANDARDS**

### **📋 Tag Categories**
```typescript
// Authentication operations
@ApiTags(['auth'])

// User management operations
@ApiTags(['users'])

// Health and status operations
@ApiTags(['health'])

// Testing operations
@ApiTags(['testing'])
```

### **🎯 Tag Naming**
- **auth**: Authentication and authorization
- **users**: User management
- **health**: Health checks and monitoring
- **testing**: Testing endpoints

---

## 🔒 **SECURITY STANDARDS**

### **🔑 Authentication Schemes**
```typescript
// JWT Bearer Token
@ApiBearerAuth('JWT-auth')

// API Key (if needed)
@ApiHeader({
  name: 'X-API-Key',
  description: 'API Key for authentication'
})
```

### **🛡️ Security Definitions**
```typescript
// In swagger.config.ts
components: {
  securitySchemes: {
    'JWT-auth': {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'JWT token for authentication'
    }
  }
}
```

---

## 📊 **RESPONSE STANDARDS**

### **✅ Success Responses**
```typescript
@ApiResponse({
  status: 200,
  description: 'Operation completed successfully',
  type: SuccessDto
})

@ApiResponse({
  status: 201,
  description: 'Resource created successfully',
  type: CreatedDto
})
```

### **❌ Error Responses**
```typescript
@ApiResponse({
  status: 400,
  description: 'Bad request - validation failed',
  type: ValidationErrorDto
})

@ApiResponse({
  status: 401,
  description: 'Unauthorized - invalid credentials',
  type: UnauthorizedErrorDto
})

@ApiResponse({
  status: 404,
  description: 'Not found - resource not found',
  type: NotFoundErrorDto
})

@ApiResponse({
  status: 409,
  description: 'Conflict - resource already exists',
  type: ConflictErrorDto
})

@ApiResponse({
  status: 422,
  description: 'Unprocessable entity - validation failed',
  type: ValidationErrorDto
})

@ApiResponse({
  status: 429,
  description: 'Too many requests - rate limit exceeded',
  type: RateLimitErrorDto
})

@ApiResponse({
  status: 500,
  description: 'Internal server error',
  type: InternalErrorDto
})
```

---

## 📝 **DTO STANDARDS**

### **✅ Property Decorators**
```typescript
export class RegisterDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    type: 'string',
    format: 'email'
  })
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @ApiProperty({
    description: 'Username for login',
    example: 'user123',
    type: 'string',
    minLength: 3,
    maxLength: 20
  })
  @IsString({ message: 'Username must be a string' })
  @MinLength(3, { message: 'Username must be at least 3 characters' })
  @MaxLength(20, { message: 'Username cannot exceed 20 characters' })
  username: string;

  @ApiProperty({
    description: 'User password',
    example: 'Password123!',
    type: 'string',
    minLength: 8
  })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @IsStrongPassword({}, { message: 'Password must be strong' })
  password: string;
}
```

### **✅ Response DTOs**
```typescript
export class UserResponseDto {
  @ApiProperty({
    description: 'Unique user identifier',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com'
  })
  email: string;

  @ApiProperty({
    description: 'User verification status',
    example: true
  })
  is_verified: boolean;

  @ApiProperty({
    description: 'User creation timestamp',
    example: '2024-01-01T12:00:00.000Z'
  })
  created_at: Date;
}
```

---

## 🔧 **CONFIGURATION STANDARDS**

### **✅ Main Configuration**
```typescript
// src/docs/swagger.config.ts
export class SwaggerConfig {
  static setup(app: INestApplication): void {
    const config = new DocumentBuilder()
      .setTitle('Auth Service API')
      .setDescription('Complete authentication service for Kanban platform')
      .setVersion('1.0.0')
      .addTag('auth', 'Authentication operations')
      .addTag('users', 'User management operations')
      .addTag('health', 'Health and monitoring')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth'
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true,
        showRequestHeaders: true,
      },
    });
  }
}
```

### **✅ Environment Configuration**
```typescript
// Different configurations for different environments
if (process.env.NODE_ENV === 'development') {
  // Development configuration
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showRequestHeaders: true,
    },
  });
} else {
  // Production configuration (minimal)
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: false,
      displayRequestDuration: false,
      filter: false,
      showRequestHeaders: false,
    },
  });
}
```

---

## 📊 **QUALITY STANDARDS**

### **✅ Documentation Coverage**
- **100% of endpoints** must be documented
- **All DTOs** must have ApiProperty decorators
- **All responses** must be documented
- **All errors** must be documented

### **✅ Example Quality**
- **Realistic examples** with valid data
- **Edge cases** documented
- **Error scenarios** covered
- **Consistent formatting**

### **✅ Code Quality**
- **Type safety** with TypeScript
- **Validation decorators** on DTOs
- **Consistent naming** conventions
- **Proper error handling**

---

## 🧪 **TESTING STANDARDS**

### **✅ Documentation Testing**
```typescript
// Test that documentation is generated correctly
describe('Swagger Documentation', () => {
  it('should generate valid OpenAPI spec', async () => {
    const response = await request(app.getHttpServer())
      .get('/api-json')
      .expect(200);

    expect(response.body).toHaveProperty('openapi');
    expect(response.body.openapi).toBe('3.0.0');
  });

  it('should have all endpoints documented', async () => {
    const response = await request(app.getHttpServer())
      .get('/api-json')
      .expect(200);

    const paths = Object.keys(response.body.paths);
    expect(paths.length).toBeGreaterThan(0);
  });
});
```

### **✅ Example Validation**
```typescript
// Test that examples are valid
describe('API Examples', () => {
  it('should have valid request examples', () => {
    // Validate that all examples match their DTOs
  });

  it('should have valid response examples', () => {
    // Validate that all response examples are correct
  });
});
```

---

## 📚 **ADDITIONAL RESOURCES**

### **🔗 Useful Links**
- **OpenAPI Specification**: https://swagger.io/specification/
- **NestJS Swagger**: https://docs.nestjs.com/openapi/introduction
- **Swagger UI**: https://swagger.io/tools/swagger-ui/

### **📖 Best Practices**
- Keep documentation up to date
- Use descriptive examples
- Include all possible responses
- Test documentation regularly
- Follow naming conventions consistently

---

## ✅ **CHECKLIST**

### **📋 Implementation Checklist**
- [ ] All endpoints documented with @ApiOperation
- [ ] All DTOs have @ApiProperty decorators
- [ ] All responses documented with @ApiResponse
- [ ] All errors documented with proper status codes
- [ ] Authentication schemes configured
- [ ] Examples provided for all endpoints
- [ ] Tags used for grouping endpoints
- [ ] Swagger UI accessible at /api
- [ ] OpenAPI spec accessible at /api-json
- [ ] Documentation tested and validated

### **🎯 Quality Checklist**
- [ ] Documentation is clear and complete
- [ ] Examples are realistic and valid
- [ ] Error responses are comprehensive
- [ ] Naming conventions are consistent
- [ ] Code is type-safe and validated
- [ ] Documentation is up to date
- [ ] All edge cases are covered
- [ ] Performance considerations documented 