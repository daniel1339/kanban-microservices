import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export class SwaggerConfig {
  static setup(app: INestApplication): void {
    const config = new DocumentBuilder()
      .setTitle('Kanban Auth Service API')
      .setDescription(`
        ## 🚀 API de Autenticación y Autorización
        
        ### Descripción
        Servicio de autenticación para la aplicación Kanban con microservicios.
        
        ### Características
        - ✅ Registro de usuarios con validación
        - ✅ Login con email/username
        - ✅ JWT Authentication con refresh tokens
        - ✅ Logout con invalidación de tokens
        - ✅ Validación de credenciales
        - ✅ Perfil de usuario protegido
        
        ### Autenticación
        Esta API utiliza **JWT Bearer Token** para autenticación.
        
        \`\`\`
        Authorization: Bearer <your-jwt-token>
        \`\`\`
        
        ### Rate Limiting
        - **Registro/Login**: 5 requests por 15 minutos
        - **Refresh Token**: 10 requests por 15 minutos
        - **Otros endpoints**: 100 requests por 15 minutos
        
        ### Códigos de Error
        | Código | Descripción |
        |--------|-------------|
        | 400 | Bad Request - Datos inválidos |
        | 401 | Unauthorized - Token inválido |
        | 403 | Forbidden - Sin permisos |
        | 404 | Not Found - Recurso no encontrado |
        | 409 | Conflict - Recurso ya existe |
        | 422 | Unprocessable Entity - Validación fallida |
        | 429 | Too Many Requests - Rate limit excedido |
        | 500 | Internal Server Error - Error del servidor |
        
        ### Ejemplos de Uso
        Vea los ejemplos en cada endpoint para entender mejor cómo usar la API.
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
      .addTag('auth', 'Endpoints de autenticación y autorización')
      .addTag('users', 'Gestión de usuarios')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Ingrese su token JWT. Ejemplo: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          in: 'header',
        },
        'JWT-auth',
      )
      .addApiKey(
        {
          type: 'apiKey',
          name: 'X-API-Key',
          description: 'Clave API para acceso a endpoints premium',
          in: 'header',
        },
        'API-Key',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config, {
      extraModels: [],
      operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
    });

    SwaggerModule.setup('api', app, document, {
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
        displayOperationId: true,
        tryItOutEnabled: true,
        requestInterceptor: (req: any) => {
          // Agregar headers por defecto
          req.headers['Content-Type'] = 'application/json';
          return req;
        },
        responseInterceptor: (res: any) => {
          // Procesar respuestas
          return res;
        },
      },
      customSiteTitle: 'Kanban Auth API Documentation',
      customCss: `
        .swagger-ui .topbar { display: none }
        .swagger-ui .info .title { color: #2c3e50; font-size: 2.5em; }
        .swagger-ui .info .description { font-size: 1.1em; line-height: 1.6; }
        .swagger-ui .opblock.opblock-post { border-color: #61affe; background: rgba(97, 175, 254, 0.1); }
        .swagger-ui .opblock.opblock-get { border-color: #49cc90; background: rgba(73, 204, 144, 0.1); }
        .swagger-ui .opblock.opblock-put { border-color: #fca130; background: rgba(252, 161, 48, 0.1); }
        .swagger-ui .opblock.opblock-delete { border-color: #f93e3e; background: rgba(249, 62, 62, 0.1); }
      `,
      customJs: [
        'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui-bundle.js',
        'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js',
      ],
    });

    console.log('📚 Swagger documentation available at http://localhost:3001/api');
  }
} 