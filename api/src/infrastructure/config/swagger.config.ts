import { INestApplication, Injectable } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';
import { OrderResponseDto } from '../../application/dto/create-order.dto';
import { UpdateOrderDto } from '../../application/dto/update-order.dto';
import { CreateOrderDto } from '../../application/dto/create-order.dto';
import { OrderStatus } from '../../domain/entities/order.entity';

@Injectable()
export class SwaggerConfig {
    private readonly apiTitle = 'Orders API';
    private readonly apiDescription = 'API REST para la gestión de órdenes con persistencia en DynamoDB. Permite crear, leer, actualizar y eliminar órdenes del sistema de ventas.';
    private readonly apiVersion = '1.0.0';
    private readonly apiTag = 'Orders';

    buildDocument(): ReturnType<typeof DocumentBuilder.prototype.build> {
        const builder = new DocumentBuilder()
            .setTitle(this.apiTitle)
            .setDescription(this.apiDescription)
            .setVersion(this.apiVersion)
            .addTag(this.apiTag)
            .addBearerAuth(
                {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    name: 'Authorization',
                    description: 'Ingrese el token JWT válido',
                    in: 'header',
                },
                'JWT-auth',
            )
            .addApiKey(
                {
                    type: 'apiKey',
                    name: 'X-API-Key',
                    in: 'header',
                    description: 'API Key para autenticación alternativa',
                },
                'API-Key',
            )
            .addServer('http://localhost:3000', 'Servidor local de desarrollo')
            .setContactEmail('soporte@empresa.com')
            .setTermsOfService('https://empresa.com/terminos')
            .setLicense('MIT', 'https://opensource.org/licenses/MIT')
            .build();
        return builder;
    }

    setupSwagger(app: INestApplication): void {
        const document = SwaggerModule.createDocument(app, this.buildDocument());
        SwaggerModule.setup('api/docs', app, document, {
            swaggerOptions: {
                persistAuthorization: true,
                displayRequestDuration: true,
                docExpansion: 'none',
                filter: true,
                showExtensions: true,
                showCommonExtensions: true,
                tryItOutEnabled: true,
                supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
            },
            customCss: `
                .swagger-ui .topbar { display: none }
                .swagger-ui .info .title { font-size: 2.5em; }
                .swagger-ui .info .description { font-size: 1.1em; line-height: 1.6; }
            `,
            customCssUrl: 'https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.0/themes/3.x/theme-flattop.css',
            customSiteTitle: 'Orders API - Documentación',
            customfavIcon: '/favicon.ico',
        });
    }

    configureOptions(): SwaggerDocumentOptions {
        return {
            operationIdFactory: (controllerKey: string, methodKey: string) => {
                return `${controllerKey}_${methodKey}`;
            },
            ignoreGlobalPrefix: false,
            include: [OrderResponseDto, UpdateOrderDto, CreateOrderDto],
        };
    }

    getApiInfo(): { title: string; description: string; version: string } {
        return {
            title: this.apiTitle,
            description: this.apiDescription,
            version: this.apiVersion,
        };
    }
}