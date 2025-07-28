import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export class SwaggerConfig {
  static setup(app: INestApplication): void {
    const config = new DocumentBuilder()
      .setTitle('Kanban User Service API')
      .setDescription(`
        ## 🚀 User Management API
        
        ### Description
        User profile management service for the Kanban microservices application.
        
        ### Features
        - ✅ User profile management
        - ✅ Avatar upload and management
        - ✅ Public user profiles
        - ✅ Auth Service integration
        - ✅ Robust file validation
        - ✅ Unified error structure
        
        ### Authentication
        This API uses **JWT Bearer Token** for authentication.
        
        \`\`\`
        Authorization: Bearer <your-jwt-token>
        \`\`\`
        
        ### Rate Limiting
        - **Profile updates**: 20 requests per 15 minutes
        - **Avatar uploads**: 10 requests per 15 minutes
        - **Other endpoints**: 100 requests per 15 minutes
        
        ### Error Codes
        | Code | Description |
        |------|-------------|
        | 400 | Bad Request - Invalid data or file not allowed |
        | 401 | Unauthorized - Invalid or expired token |
        | 403 | Forbidden - No permissions |
        | 404 | Not Found - User not found |
        | 413 | Payload Too Large - File too large |
        | 415 | Unsupported Media Type - File type not supported |
        | 422 | Unprocessable Entity - Validation failed |
        | 429 | Too Many Requests - Rate limit exceeded |
        | 500 | Internal Server Error - Server error |
        
        ### Error Structure
        All errors follow this unified structure:
        \`\`\`json
        {
          "statusCode": 400,
          "message": "Error description",
          "error": "Bad Request",
          "timestamp": "2024-01-01T12:00:00.000Z",
          "path": "/api/endpoint",
          "method": "POST",
          "requestId": "optional-request-id"
        }
        \`\`\`
        
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
      .addServer('http://localhost:3002', 'Development Server')
      .addServer('https://user.kanban.com', 'Production Server')
      .addTag('profile', 'User profile management')
      .addTag('avatar', 'Avatar and image management')
      .addTag('users', 'Public user information')
      .addTag('health', 'Service status')
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
          // Add default headers
          if (!req.headers) {
            req.headers = {};
          }
          return req;
        },
        responseInterceptor: (res: any) => {
          // Process responses if needed
          return res;
        },
      },
      customSiteTitle: 'Kanban User Service API Documentation',
      customCss: `
        .swagger-ui .topbar { display: none; }
        .swagger-ui .info .title { color: #2c3e50; }
        .swagger-ui .info .description { color: #34495e; }
        .swagger-ui .scheme-container { background: #f8f9fa; }
        .swagger-ui .opblock.opblock-get { border-color: #61affe; }
        .swagger-ui .opblock.opblock-post { border-color: #49cc90; }
        .swagger-ui .opblock.opblock-put { border-color: #fca130; }
        .swagger-ui .opblock.opblock-delete { border-color: #f93e3e; }
      `,
    });
  }
} 