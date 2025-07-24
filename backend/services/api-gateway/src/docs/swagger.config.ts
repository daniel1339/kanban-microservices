import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export class SwaggerConfig {
  static setup(app: INestApplication): void {
    const config = new DocumentBuilder()
      .setTitle('Kanban API Gateway')
      .setDescription(`
        ## 🚀 API Gateway
        Central entry point for all Kanban microservices.
        
        ### Features
        - ✅ Dynamic routing
        - ✅ JWT authentication
        - ✅ Rate limiting
        - ✅ Health checks
        - ✅ Unified error structure
        
        ### Authentication
        This API uses **JWT Bearer Token** for authentication.
        
        \`\`\`
        Authorization: Bearer <your-jwt-token>
        \`\`\`
        
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
      `)
      .setVersion('1.0.0')
      .setContact('Kanban Team', 'https://github.com/kanban-microservices', 'dev@kanban.com')
      .setLicense('MIT License', 'https://opensource.org/licenses/MIT')
      .addServer('http://localhost:3000', 'Development Server')
      .addTag('gateway', 'API Gateway endpoints')
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
      },
      customSiteTitle: 'Kanban API Gateway Documentation',
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