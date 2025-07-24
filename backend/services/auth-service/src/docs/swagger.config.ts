import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export class SwaggerConfig {
  static setup(app: INestApplication): void {
    const config = new DocumentBuilder()
      .setTitle('Kanban Auth Service API')
      .setDescription(`
        ## 🚀 Authentication and Authorization API
        
        ### Description
        Authentication service for the Kanban microservices application.
        
        ### Features
        - ✅ User registration with validation
        - ✅ Login with email/username
        - ✅ JWT Authentication with refresh tokens
        - ✅ Logout with token invalidation
        - ✅ Credential validation
        - ✅ Protected user profile
        
        ### Authentication
        This API uses **JWT Bearer Token** for authentication.
        
        \`\`\`
        Authorization: Bearer <your-jwt-token>
        \`\`\`
        
        ### Rate Limiting
        - **Registration/Login**: 5 requests per 15 minutes
        - **Refresh Token**: 10 requests per 15 minutes
        - **Other endpoints**: 100 requests per 15 minutes
        
        ### Error Codes
        | Code | Description |
        |------|-------------|
        | 400 | Bad Request - Invalid data |
        | 401 | Unauthorized - Invalid token |
        | 403 | Forbidden - No permissions |
        | 404 | Not Found - Resource not found |
        | 409 | Conflict - Resource already exists |
        | 422 | Unprocessable Entity - Validation failed |
        | 429 | Too Many Requests - Rate limit exceeded |
        | 500 | Internal Server Error - Server error |
        
        ### Usage Examples
        See examples in each endpoint to better understand how to use the API.
      `)
      .setVersion('1.0.0')
      .setContact(
        'Kanban Team',
        'https://github.com/kanban-microservices',
        'dev@kanban.com'
      )
      .setLicense(
        'MIT License',
        'https://opensource.org/licenses/MIT'
      )
      .addServer('http://localhost:3001', 'Development Server')
      .addServer('https://auth.kanban.com', 'Production Server')
      .addTag('auth', 'Authentication and authorization endpoints')
      .addTag('users', 'User management')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter your JWT token. Example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          in: 'header',
        },
        'JWT-auth',
      )
      .addApiKey(
        {
          type: 'apiKey',
          name: 'X-API-Key',
          description: 'API key for premium endpoint access',
          in: 'header',
        },
        'API-Key',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config, {
      extraModels: [],
      operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
    });

    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true,
        showRequestHeaders: true,
        showExtensions: true,
        showCommonExtensions: true,
        docExpansion: 'list',
        defaultModelsExpandDepth: 2,
        defaultModelExpandDepth: 2,
        tryItOutEnabled: true,
        requestInterceptor: (req: any) => {
          // Add default headers for testing
          req.headers['Content-Type'] = 'application/json';
          return req;
        },
        responseInterceptor: (res: any) => {
          // Log responses for debugging
          console.log('Swagger Response:', res);
          return res;
        },
        onComplete: (data: any) => {
          console.log('Swagger documentation loaded successfully');
        },
        onFailure: (error: any) => {
          console.error('Swagger documentation failed to load:', error);
        },
      },
      customCss: `
        .swagger-ui .topbar { display: none; }
        .swagger-ui .info .title { color: #2c3e50; }
        .swagger-ui .info .description { color: #34495e; }
        .swagger-ui .scheme-container { background: #ecf0f1; }
        .swagger-ui .opblock.opblock-get { border-color: #3498db; }
        .swagger-ui .opblock.opblock-post { border-color: #27ae60; }
        .swagger-ui .opblock.opblock-put { border-color: #f39c12; }
        .swagger-ui .opblock.opblock-delete { border-color: #e74c3c; }
      `,
      customSiteTitle: 'Kanban Auth Service - API Documentation',
      customfavIcon: '/favicon.ico',
      customJs: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
      ],
      customCssUrl: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
      ],
    });
  }
} 