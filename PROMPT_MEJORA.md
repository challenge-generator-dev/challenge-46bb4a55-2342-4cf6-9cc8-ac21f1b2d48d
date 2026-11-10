# Prompt para Mejorar el Codigo Base

Copia y pega el contenido del bloque de abajo en un asistente de IA (Claude, ChatGPT)
para obtener el proyecto completo y arrancable. Guarda los archivos que te devuelva en la
carpeta del repo, respetando exactamente las rutas.

Si preferis trabajar en tu editor con un agente local (Claude Code, Cursor, Copilot), usa `AGENTS.md` en vez de este archivo: dice lo mismo pero para que escriba los archivos en disco.

## Las dos reglas que no se negocian

1. **Completa el boilerplate.** Todo lo que el proyecto necesita para compilar y arrancar: manifiesto de dependencias, punto de entrada, configuracion, capa de interfaz, y las capas del patron arquitectonico declarado. Eso es andamiaje y es tu trabajo.
2. **NO resuelvas el reto.** Los entregables de las fases son el trabajo de la persona. El hueco pedagogico se deja como esta: el proyecto arranca, pero lo que el reto pide implementar NO esta implementado.

Dicho de otra forma: si algo impide compilar, arreglalo. Si algo es logica de negocio incompleta, validaciones ausentes, un secreto hardcodeado o un patron mejorable, dejalo exactamente como esta — es lo que la persona tiene que encontrar.

## Mapa de componentes

El repo tiene una carpeta por componente. Cada uno se instala y verifica dentro de la suya.

| Componente | Carpeta | Rol | Capa | Track | Tecnologias |
|---|---|---|---|---|---|
| `api` | `api/` | practice | server | Node | DynamoDB |
| `client` | `client/` | chapter, support | client | React | React |
| `infra` | `infra/` | support | infra | Terraform (AWS) | Terraform |
| `infra-local` | (raiz) | support | infra | Compose local | DynamoDB |

## Orden de arranque

1. `docker compose up -d` (en la raiz) — levanta la infraestructura local.
2. `cd infra && terraform fmt -check -recursive && terraform init -backend=false && terraform validate` — componente `infra` (support).
3. `cd api && npm install && npm run build` — componente `api` (practice).
4. `cd client && npm install && npm run build` — componente `client` (chapter, support).

### Contratos entre componentes

- `api` expone http (api: http://localhost:3000):
  - `POST /orders`
  - `GET /orders/:id`
  - `PUT /orders/:id`
  - `DELETE /orders/:id`
- `client` expone http (api: http://localhost:3000):
  - `GET /orders`
  - `POST /orders`
  - `PUT /orders/:id`
  - `DELETE /orders/:id`

## Herramientas

- **Terraform**: Herramienta de trabajo del candidato: usala en la fase donde se depura o se prueba la solucion (no es una dependencia del proyecto).

## Lo que le falta a este proyecto

Esto NO lo tenes que adivinar: salio de comparar el proyecto contra la arquitectura declarada del reto y de un analisis estatico del codigo. Completalo TODO.

### Referencias colgando en el codigo que si esta

Cada una rompe la compilacion:

- `api/src/application/dto/create-order.dto.ts` — `CreateOrderProductDto.map`: Se invoca `map` sobre `CreateOrderProductDto`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `api/src/shared/utils/validation.utils.ts` — `OrderProduct.map`: Se invoca `map` sobre `OrderProduct`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `api/src/shared/utils/validation.utils.ts` — `OrderProduct.forEach`: Se invoca `forEach` sobre `OrderProduct`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `api/src/shared/utils/validation.utils.ts` — `OrderProduct.reduce`: Se invoca `reduce` sobre `OrderProduct`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `client/src/shared/components/ErrorBoundary.tsx` — `ErrorBoundaryProps.onError`: Se invoca `onError` sobre `ErrorBoundaryProps`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `client/src/shared/utils/validation.ts` — `ProductFormData.map`: Se invoca `map` sobre `ProductFormData`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.

## Como saber que terminaste

```bash
(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && (cd infra && terraform fmt -check -recursive && terraform init -backend=false && terraform validate) && docker compose config -q
```

Ese comando corriendo sin errores es la definicion de "listo".

---

```
## Briefing del reto (autoridad)
Este bloque manda sobre los archivos adjuntos. El stack y el rol salen de AQUÍ, no de un topic genérico ni de markdown placeholder.

### Perfil
Chapter Frontend, Especialidad Desarrollador, Tecnología React, Advanced L2

### Brecha de conocimiento
CRUD de ordenes en DynamoDB desde la interfaz (corrida e2e 20261110141755634), Implementa operaciones CRUD de ordenes en DynamoDB desde la interfaz y versiona la infraestructura

### Misión / candidato
Gestionar ordenes

### Reto
- Tema: Persistir ordenes en DynamoDB desde la interfaz
- Seniority: advanced-l2
- Tipo: practical
- Título: Implementación de operaciones CRUD de órdenes en DynamoDB
- Tiempo estimado: 8 horas

### Fases (trabajo del HUMANO — PROHIBIDO completarlas)
No implementes estos entregables. Dejalos como hueco pedagógico. El asistente solo materializa el proyecto arrancable para que el participante pueda trabajar.
- Fase 1: Configuración inicial y persistencia de órdenes — objetivo: Configurar la infraestructura para permitir la persistencia de órdenes en DynamoDB y desarrollar la funcionalidad básica de creación de órdenes. — entregable (NO resolver): Configuración de DynamoDB y funcionalidad de creación de órdenes verificable.
- Fase 2: Implementación de lectura y actualización de órdenes — objetivo: Desarrollar las funcionalidades para leer y actualizar órdenes en DynamoDB desde la interfaz. — entregable (NO resolver): Funcionalidades de lectura y actualización de órdenes verificables.
- Fase 3: Implementación de eliminación de órdenes y versionado de infraestructura — objetivo: Desarrollar la funcionalidad para eliminar órdenes en DynamoDB y versionar la infraestructura utilizando Terraform. — entregable (NO resolver): Funcionalidad de eliminación de órdenes verificable y documentación de decisiones de diseño.

Eres un asistente experto en análisis, corrección y generación de archivos de cualquier tipo:
código fuente, documentación, hojas de cálculo, documentos Word, configuraciones, entre otros.
Voy a enviarte una cadena de texto que contiene uno o más archivos. Cada archivo está delimitado por un marcador con el siguiente formato:
// === ARCHIVO: ruta/del/archivo.extension ===
o también puede aparecer como:
## === ARCHIVO: ruta/del/archivo.extension ===
Lo que sigue al marcador puede ser:

El contenido real del archivo (código, texto, YAML, etc.)
Una descripción en lenguaje natural de lo que debe contener el archivo


TU TAREA
PASO 0 — ¿Esto es un proyecto o una carcasa?
Antes de extraer archivos, leé el Briefing (si está) y diagnosticá el adjunto.

Es CARCASA si ocurre CUALQUIERA de estas:
- No hay manifiesto de dependencias del stack del briefing (manifest.json de VTEX IO / package.json / pom.xml / build.gradle / requirements.txt / go.mod / *.tf / *.csproj, según corresponda)
- Hay un "binario" que en realidad es un comentario ("no puede ser mostrado como texto plano", placeholder .fig/.docx vacío)
- Los markdowns ya completan entregables de fases posteriores ("se implementó fade-in", lista de áreas ya resuelta)

Si es CARCASA:
- MATERIALIZÁ un proyecto que arranca en el stack del briefing (VTEX IO Store Framework, Angular, Terraform, pytest, Nest, etc.). Incluí manifiesto, punto de entrada y capa de interfaz reales.
- NO copies los markdowns de "solución" como si fueran el producto. Son ruido de generación.
- NO resuelvas las fases del briefing (están marcadas PROHIBIDO). Dejá el hueco pedagógico: el flujo existe, las microinteracciones/calidad/infra que el reto pide NO están hechas.
- Después seguí al PASO 5 (entrega de archivos).

Si es un proyecto REAL (manifiesto + código que compila o arranca):
- Seguí PASO 1 en adelante. 🔴 compilación sí. 🟡 pedagógico no.

PASO 1 — Detección y extracción
Identifica todos los archivos presentes en la cadena. Para cada archivo extrae:

Su ruta completa (ej: src/main/java/com/pragma/Service.java)
Su contenido o descripción

PASO 2 — Clasificación por tipo
Clasifica cada archivo en una de estas categorías:
A) Código fuente (Java, Python, TypeScript, JavaScript, Kotlin, etc.)
B) Configuración / documentación (YAML, properties, Markdown, JSON, txt, etc.)
C) Excel (.xlsx, .xls, .csv)
D) Word (.docx, .doc)
E) Otro tipo de archivo binario o especial
PASO 3 — Clasificación de errores en código fuente

Objetivo prioritario: que el proyecto compile. No corrijas flujo de negocio ni lógica funcional.

Antes de modificar cualquier archivo de código fuente, clasifica cada problema encontrado en una de estas dos categorías:
🔴 ERROR DE COMPILACIÓN — corregir siempre
Son errores que impiden que el proyecto arranque, sin valor pedagógico:

Import faltante o incorrecto
Clase, método o variable referenciada que no existe en ningún archivo del proyecto
Error de sintaxis
Anotación con atributos inválidos
Dependencia ausente en pom.xml, package.json, etc.
Archivo referenciado que no existe y debe ser creado con implementación mínima

→ CORREGIR estos errores.
🟡 PROBLEMA FUNCIONAL O DE CALIDAD — preservar siempre
Son problemas que no impiden compilar. Pueden ser intencionales para el aprendizaje:

Clave secreta hardcodeada ("secret", "password123")
API deprecada que funciona pero tiene reemplazo moderno
Lógica de negocio incorrecta o incompleta
Código redundante o de baja legibilidad
Falta de validaciones en flujo de negocio
Patrones de diseño incorrectos pero funcionales
Concurrencia no segura
Configuración funcional pero no óptima

→ PRESERVAR tal cual. No corregir, no mejorar, no comentar.
PASO 4 — Procesamiento según tipo de archivo
Tipo A — Código fuente
Aplica únicamente las correcciones clasificadas como 🔴 ERROR DE COMPILACIÓN.
No alteres ningún elemento clasificado como 🟡 PROBLEMA FUNCIONAL O DE CALIDAD.
Si falta un archivo referenciado, créalo con la implementación mínima necesaria para compilar.
Tipo B — Configuración / documentación
Extrae el contenido tal cual, sin modificaciones salvo errores evidentes de sintaxis
(ej: YAML mal indentado).
Tipo C — Excel (.xlsx)
Si viene con contenido real, genera el archivo respetando ese contenido.
Si viene con descripción en lenguaje natural, genera un archivo Excel funcional con:

Fila de encabezados en negrita con color de fondo distintivo
Columnas con ancho ajustado al contenido
Tipos de dato correctos por columna
Validaciones si la descripción lo indica
Hojas nombradas descriptivamente si hay más de una
Filas de ejemplo si no hay datos reales

Tipo D — Word (.docx)
Si viene con contenido real, genera el archivo respetando ese contenido.
Si viene con descripción en lenguaje natural, genera un documento Word funcional con:

Estilos de título (Título 1, Título 2) para jerarquía de secciones
Fuente legible (Calibri o equivalente), tamaño 11-12pt para cuerpo
Márgenes estándar
Tabla de contenido si tiene múltiples secciones
Tablas con encabezados en negrita si aplica

Tipo E — Otro
Genera el archivo con el contenido o estructura más apropiada según la descripción.
PASO 5 — Entrega de archivos
Entregá cada archivo con su ruta completa, respetando exactamente la estructura de rutas
indicada por los marcadores: un bloque por archivo, precedido por su ruta. No generes ZIPs
ni archivos adjuntos.
La entrega debe incluir:

Archivos de código con únicamente los errores de compilación corregidos
Archivos de configuración y documentación sin cambios
Archivos nuevos creados para resolver dependencias de compilación faltantes
Archivos Excel y Word generados desde descripción

IMPORTANTE: Entregá los archivos completos al finalizar. No preguntes si el usuario
quiere recibirlos. Simplemente entregalos; No debes desplegar en el chat el resumen de lo que arreglaste, solo entregá los archivos.

REGLAS IMPORTANTES

No omitas ningún archivo aunque no tenga errores ni modificaciones
Respeta los nombres y rutas exactas indicadas por los marcadores
Si un archivo no tiene marcador claro, infiere el nombre desde su contenido
Si la cadena contiene solo documentación, placeholders o binarios fake, NO la reproduzcas:
aplicá PASO 0 (materializar el proyecto del briefing). Reproducir la carcasa es un fallo.
No agregues texto después del último archivo entregado
No preguntes si el usuario quiere los archivos: simplemente entregalos siempre
Si detectas que falta un archivo de configuración necesario para compilar
(pom.xml, package.json, requirements.txt, build.gradle, etc.), créalo e inclúyelo
inferiendo su contenido desde los imports y frameworks detectados en el código
Nunca corrijas problemas 🟡 aunque parezcan obvios o fáciles de mejorar.
El participante que recibirá este proyecto los debe encontrar y resolver él mismo.


INPUT
Aquí está la cadena con los archivos:

// === ARCHIVO: api/package.json ===
{
  "name": "orders-api",
  "version": "1.0.0",
  "description": "API para gestión de órdenes con persistencia en DynamoDB",
  "main": "dist/main.js",
  "scripts": {
    "build": "tsc",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "ts-node src/main.ts",
    "start:dev": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  },
  "dependencies": {
    "@aws-sdk/client-dynamodb": "^3.600.0",
    "@aws-sdk/lib-dynamodb": "^3.600.0",
    "@nestjs/common": "^11.0.0",
    "@nestjs/core": "^11.0.0",
    "@nestjs/platform-express": "^11.0.0",
    "@nestjs/swagger": "^11.4.8",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.1",
    "reflect-metadata": "^0.2.2",
    "rxjs": "^7.8.1",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^11.0.0",
    "@nestjs/testing": "^11.0.0",
    "@types/express": "^5.0.0",
    "@types/jest": "^29.5.12",
    "@types/supertest": "^2.0.16",
    "@types/uuid": "^9.0.8",
    "eslint": "^8.57.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-prettier": "^5.1.3",
    "jest": "^29.7.0",
    "prettier": "^3.3.2",
    "supertest": "^7.0.0",
    "ts-jest": "^29.1.2",
    "ts-node": "^10.9.2",
    "typescript": "^5.7.0"
  },
  "jest": {
    "moduleFileExtensions": [
      "js",
      "json",
      "ts"
    ],
    "rootDir": "src",
    "testRegex": ".spec.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}

// === ARCHIVO: api/tsconfig.json ===
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2022",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": ".",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false,
    "strict": true,
    "strictPropertyInitialization": false,
    "esModuleInterop": true
  },
  "exclude": ["node_modules", "dist", "test"]
}

// === ARCHIVO: api/src/domain/entities/order.entity.ts ===
import { v4 as uuidv4 } from 'uuid';

export enum OrderStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

export class OrderProduct {
    constructor(
        public readonly productId: string,
        public readonly name: string,
        public readonly quantity: number,
        public readonly price: number
    ) {
        if (quantity <= 0) {
            throw new Error('Quantity must be greater than zero');
        }
        if (price <= 0) {
            throw new Error('Price must be greater than zero');
        }
    }
}

export class Order {
    public readonly id: string;
    public readonly createdAt: Date;
    public updatedAt: Date;
    public status: OrderStatus;

    constructor(
        public clientId: string,
        public products: OrderProduct[],
        status?: OrderStatus,
        id?: string,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        this.id = id || uuidv4();
        this.createdAt = createdAt || new Date();
        this.updatedAt = updatedAt || new Date();
        this.status = status || OrderStatus.PENDING;
        
        if (!clientId || clientId.trim() === '') {
            throw new Error('Client ID cannot be empty');
        }
        if (!products || products.length === 0) {
            throw new Error('Order must have at least one product');
        }
        
        const productIds = new Set<string>();
        for (const product of products) {
            if (productIds.has(product.productId)) {
                throw new Error(`Duplicate product found: ${product.productId}`);
            }
            productIds.add(product.productId);
        }
    }
    
    updateStatus(newStatus: OrderStatus): void {
        if (this.status === OrderStatus.COMPLETED || this.status === OrderStatus.CANCELLED) {
            throw new Error(`Order cannot be updated from ${this.status} status`);
        }
        this.status = newStatus;
        this.updatedAt = new Date();
    }
    
    updateProducts(newProducts: OrderProduct[]): void {
        if (newProducts.length === 0) {
            throw new Error('Order must have at least one product');
        }
        
        const productIds = new Set<string>();
        for (const product of newProducts) {
            if (productIds.has(product.productId)) {
                throw new Error(`Duplicate product found: ${product.productId}`);
            }
            productIds.add(product.productId);
        }
        
        this.products = newProducts;
        this.updatedAt = new Date();
    }
}

// === ARCHIVO: api/src/domain/repositories/order.repository.ts ===
import { Order, OrderStatus } from '../entities/order.entity';

export interface OrderRepository {
    create(order: Order): Promise<Order>;
    findById(id: string): Promise<Order | null>;
    update(order: Order): Promise<Order>;
    delete(id: string): Promise<void>;
    
    // Additional query methods
    findByClientId(clientId: string): Promise<Order[]>;
    findByStatus(status: OrderStatus): Promise<Order[]>;
    findByDateRange(startDate: Date, endDate: Date): Promise<Order[]>;
}

// === ARCHIVO: api/src/application/dto/create-order.dto.ts ===
import { IsString, IsNotEmpty, IsArray, ValidateNested, IsNumber, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../../domain/entities/order.entity';

export class CreateOrderProductDto {
    @IsString()
    @IsNotEmpty()
    productId: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @Min(1)
    quantity: number;

    @IsNumber()
    @Min(0.01)
    price: number;
}

export class CreateOrderDto {
    @IsString()
    @IsNotEmpty()
    clientId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderProductDto)
    products: CreateOrderProductDto[];

    @IsOptional()
    @IsString()
    status?: OrderStatus;
    
    validate(): void {
        if (!this.products || this.products.length === 0) {
            throw new Error('Order must have at least one product');
        }
        
        const productIds = new Set<string>();
        for (const product of this.products) {
            if (productIds.has(product.productId)) {
                throw new Error(`Duplicate product found: ${product.productId}`);
            }
            productIds.add(product.productId);
        }
    }
}

export class OrderResponseDto {
    public readonly id: string;
    public readonly clientId: string;
    private _products: { productId: string; name: string; quantity: number; price: number; }[];
    public status: OrderStatus;
    public readonly createdAt: Date;
    public updatedAt: Date;

    constructor(
        id: string,
        clientId: string,
        products: { productId: string; name: string; quantity: number; price: number; }[],
        status: OrderStatus,
        createdAt: Date,
        updatedAt: Date
    ) {
        this.id = id;
        this.clientId = clientId;
        this._products = products;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    get products(): { productId: string; name: string; quantity: number; price: number; }[] {
        return this._products;
    }
    
    static fromOrder(order: any): OrderResponseDto {
        if (order instanceof OrderResponseDto) {
            return order;
        }
        return new OrderResponseDto(
            order.id,
            order.clientId,
            order.products.map((product: any) => ({
                productId: product.productId,
                name: product.name,
                quantity: product.quantity,
                price: product.price
            })),
            order.status,
            order.createdAt,
            order.updatedAt
        );
    }

    updateStatus(newStatus: OrderStatus): void {
        this.status = newStatus;
    }

    updateProducts(newProducts: any[]): void {
        this._products = newProducts.map(p => ({
            productId: p.productId,
            name: p.name,
            quantity: p.quantity,
            price: p.price
        }));
    }
}

// === ARCHIVO: api/src/application/dto/update-order.dto.ts ===
import { IsString, IsOptional, IsArray, ValidateNested, IsEnum, IsNumber, Min, Max, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../../domain/entities/order.entity';

class UpdateOrderProductDto {
    @IsString({ message: 'El ID del producto debe ser una cadena de texto' })
    productId!: string;

    @IsString({ message: 'El nombre del producto debe ser una cadena de texto' })
    name!: string;

    @IsNumber({}, { message: 'La cantidad debe ser un número' })
    @Min(1, { message: 'La cantidad mínima es 1' })
    @Max(999, { message: 'La cantidad máxima es 999' })
    quantity!: number;

    @IsNumber({}, { message: 'El precio debe ser un número' })
    @Min(0, { message: 'El precio no puede ser negativo' })
    price!: number;
}

export class UpdateOrderDto {
    @IsString({ message: 'El ID de la orden es obligatorio' })
    id!: string;

    @IsOptional()
    @IsString({ message: 'El ID del cliente debe ser una cadena de texto' })
    clientId?: string;

    @IsOptional()
    @IsArray({ message: 'Los productos deben ser un arreglo' })
    @ValidateNested({ each: true, message: 'Cada producto debe ser válido' })
    @Type(() => UpdateOrderProductDto)
    @ArrayMinSize(1, { message: 'Debe haber al menos un producto' })
    products?: UpdateOrderProductDto[];

    @IsOptional()
    @IsEnum(OrderStatus, { message: 'El estado debe ser uno de: PENDING, PROCESSING, COMPLETED, CANCELLED' })
    status?: OrderStatus;

    validate(): void {
        const hasClientId = this.clientId !== undefined && this.clientId !== null && this.clientId.trim() !== '';
        const hasProducts = this.products !== undefined && this.products !== null && this.products.length > 0;
        const hasStatus = this.status !== undefined && this.status !== null;

        if (!hasClientId && !hasProducts && !hasStatus) {
            throw new Error('Debe proporcionar al menos un campo para actualizar: clientId, products o status');
        }

        if (hasProducts && this.products) {
            this.products.forEach((product, index) => {
                if (!product.productId || product.productId.trim() === '') {
                    throw new Error(`El producto en posición ${index} no tiene un ID válido`);
                }
                if (!product.name || product.name.trim() === '') {
                    throw new Error(`El producto en posición ${index} no tiene un nombre válido`);
                }
                if (product.quantity <= 0) {
                    throw new Error(`La cantidad del producto en posición ${index} debe ser mayor a 0`);
                }
                if (product.price < 0) {
                    throw new Error(`El precio del producto en posición ${index} no puede ser negativo`);
                }
            });
        }
    }
}

// === ARCHIVO: api/src/application/services/order.service.ts ===
import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { OrderRepository } from '../../domain/repositories/order.repository';
import { Order, OrderStatus, OrderProduct } from '../../domain/entities/order.entity';
import { CreateOrderDto, OrderResponseDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { InvalidOrderDataException } from '../../shared/exceptions/order.exceptions';

@Injectable()
export class OrderService {
    constructor(private readonly orderRepository: OrderRepository) {}

    async createOrder(createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
        try {
            createOrderDto.validate();

            const products = createOrderDto.products.map(
                p => new OrderProduct(p.productId, p.name, p.quantity, p.price)
            );

            const order = new Order(
                createOrderDto.clientId,
                products,
                createOrderDto.status || OrderStatus.PENDING
            );

            const createdOrder = await this.orderRepository.create(order);
            return OrderResponseDto.fromOrder(createdOrder);
        } catch (error) {
            if (error instanceof InvalidOrderDataException) {
                throw new BadRequestException(error.message);
            }
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            throw new InternalServerErrorException('Error al crear la orden: ' + errorMessage);
        }
    }

    async getOrder(id: string): Promise<OrderResponseDto> {
        if (!id || id.trim() === '') {
            throw new BadRequestException('El ID de la orden es requerido');
        }

        const order = await this.orderRepository.findById(id);
        
        if (!order) {
            throw new NotFoundException(`Orden con ID ${id} no encontrada`);
        }

        return OrderResponseDto.fromOrder(order);
    }

    async updateOrder(updateOrderDto: UpdateOrderDto): Promise<OrderResponseDto> {
        if (!updateOrderDto.id || updateOrderDto.id.trim() === '') {
            throw new BadRequestException('El ID de la orden es requerido para la actualización');
        }

        const existingOrder = await this.orderRepository.findById(updateOrderDto.id);
        
        if (!existingOrder) {
            throw new NotFoundException(`Orden con ID ${updateOrderDto.id} no encontrada para actualizar`);
        }

        try {
            updateOrderDto.validate();

            if (updateOrderDto.clientId !== undefined && updateOrderDto.clientId !== null) {
                existingOrder.clientId = updateOrderDto.clientId;
            }

            if (updateOrderDto.products !== undefined && updateOrderDto.products !== null) {
                const updatedProducts = updateOrderDto.products.map(
                    p => new OrderProduct(p.productId, p.name, p.quantity, p.price)
                );
                existingOrder.updateProducts(updatedProducts);
            }

            if (updateOrderDto.status !== undefined && updateOrderDto.status !== null) {
                this.validateStatusTransition(existingOrder.status, updateOrderDto.status);
                existingOrder.updateStatus(updateOrderDto.status);
            }

            const updatedOrder = await this.orderRepository.update(existingOrder);
            return OrderResponseDto.fromOrder(updatedOrder);
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            throw new InternalServerErrorException('Error al actualizar la orden: ' + errorMessage);
        }
    }

    async deleteOrder(id: string): Promise<void> {
        if (!id || id.trim() === '') {
            throw new BadRequestException('El ID de la orden es requerido para eliminar');
        }

        const existingOrder = await this.orderRepository.findById(id);
        
        if (!existingOrder) {
            throw new NotFoundException(`Orden con ID ${id} no encontrada para eliminar`);
        }

        await this.orderRepository.delete(id);
    }

    private validateStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus): void {
        const validTransitions: Record<OrderStatus, OrderStatus[]> = {
            [OrderStatus.PENDING]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
            [OrderStatus.PROCESSING]: [OrderStatus.COMPLETED, OrderStatus.CANCELLED],
            [OrderStatus.COMPLETED]: [],
            [OrderStatus.CANCELLED]: []
        };

        const allowedStatuses = validTransitions[currentStatus];
        
        if (!allowedStatuses.includes(newStatus)) {
            throw new BadRequestException(
                `No se puede transiciónar de ${currentStatus} a ${newStatus}. ` +
                `Estados permitidos desde ${currentStatus}: ${allowedStatuses.join(', ') || 'ninguno'}`
            );
        }
    }

    async getOrdersByClient(clientId: string): Promise<OrderResponseDto[]> {
        if (!clientId || clientId.trim() === '') {
            throw new BadRequestException('El ID del cliente es requerido');
        }

        const orders = await this.orderRepository.findByClientId(clientId);
        return orders.map(order => OrderResponseDto.fromOrder(order));
    }

    async getOrdersByStatus(status: OrderStatus): Promise<OrderResponseDto[]> {
        const orders = await this.orderRepository.findByStatus(status);
        return orders.map(order => OrderResponseDto.fromOrder(order));
    }

    async getOrdersByDateRange(startDate: Date, endDate: Date): Promise<OrderResponseDto[]> {
        if (!startDate || !endDate) {
            throw new BadRequestException('Las fechas de inicio y fin son requeridas');
        }

        if (startDate > endDate) {
            throw new BadRequestException('La fecha de inicio debe ser anterior a la fecha de fin');
        }

        const orders = await this.orderRepository.findByDateRange(startDate, endDate);
        return orders.map(order => OrderResponseDto.fromOrder(order));
    }
}

// === ARCHIVO: api/src/infrastructure/config/dynamodb.config.ts ===
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const DYNAMODB_ENDPOINT = process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000';
const DYNAMODB_REGION = process.env.DYNAMODB_REGION || 'us-east-1';
const DYNAMODB_ACCESS_KEY_ID = process.env.DYNAMODB_ACCESS_KEY_ID || 'local';
const DYNAMODB_SECRET_ACCESS_KEY = process.env.DYNAMODB_SECRET_ACCESS_KEY || 'local';

const isLocal = process.env.NODE_ENV !== 'production' && DYNAMODB_ENDPOINT.includes('localhost');

const clientConfig: any = {
  region: DYNAMODB_REGION,
  credentials: isLocal
    ? { accessKeyId: DYNAMODB_ACCESS_KEY_ID, secretAccessKey: DYNAMODB_SECRET_ACCESS_KEY }
    : undefined,
};

if (isLocal) {
  clientConfig.endpoint = DYNAMODB_ENDPOINT;
  clientConfig.tls = false;
}

export const dynamoDBClient = new DynamoDBClient(clientConfig);

export const dynamoDBDocumentClient = DynamoDBDocumentClient.from(dynamoDBClient, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
  unmarshallOptions: {
    wrapNumbers: false,
  },
});

export const ORDERS_TABLE_NAME = process.env.ORDERS_TABLE_NAME || 'orders';

export interface DynamoDBConfig {
  client: DynamoDBClient;
  documentClient: DynamoDBDocumentClient;
  tableName: string;
}

export function getDynamoDBConfig(): DynamoDBConfig {
  return {
    client: dynamoDBClient,
    documentClient: dynamoDBDocumentClient,
    tableName: ORDERS_TABLE_NAME,
  };
}

// === ARCHIVO: api/src/infrastructure/repositories/order.repository.impl.ts ===
import { Injectable, Logger } from '@nestjs/common';
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, DeleteCommand, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { OrderRepository } from '../../domain/repositories/order.repository';
import { Order, OrderProduct, OrderStatus } from '../../domain/entities/order.entity';

@Injectable()
export class OrderRepositoryImpl implements OrderRepository {
  private readonly logger = new Logger(OrderRepositoryImpl.name);
  private readonly docClient: DynamoDBDocumentClient;
  private readonly tableName: string;

  constructor(docClient: DynamoDBDocumentClient, tableName: string) {
    this.docClient = docClient;
    this.tableName = tableName;
  }

  private mapToOrder(item: any): Order | null {
    if (!item) return null;

    const products: OrderProduct[] = (item.products || []).map(
      (p: any) => new OrderProduct(p.productId, p.name, p.quantity, p.price)
    );

    const order = new Order(
      item.clientId,
      products,
      item.status as OrderStatus,
      item.id,
      new Date(item.createdAt),
      new Date(item.updatedAt)
    );

    return order;
  }

  private mapToItem(order: Order): Record<string, any> {
    return {
      id: order.id,
      clientId: order.clientId,
      status: order.status,
      products: (order.products as OrderProduct[]).map(p => ({
        productId: p.productId,
        name: p.name,
        quantity: p.quantity,
        price: p.price,
      })),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };
  }

  async create(order: Order): Promise<Order> {
    this.logger.log(`Creating order with id: ${order.id}`);
    
    const item = this.mapToItem(order);
    
    await this.docClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: item,
        ConditionExpression: 'attribute_not_exists(id)',
      })
    );

    this.logger.log(`Order created successfully: ${order.id}`);
    return order;
  }

  async findById(id: string): Promise<Order | null> {
    this.logger.log(`Finding order by id: ${id}`);

    const result = await this.docClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { id },
      })
    );

    return this.mapToOrder(result.Item);
  }

  async update(order: Order): Promise<Order> {
    this.logger.log(`Updating order with id: ${order.id}`);

    const updateExpressions: string[] = [];
    const expressionAttributeValues: Record<string, any> = {};
    const expressionAttributeNames: Record<string, string> = {};

    if (order.clientId) {
      updateExpressions.push('clientId = :clientId');
      expressionAttributeValues[':clientId'] = order.clientId;
    }

    if (order.products) {
      updateExpressions.push('products = :products');
      expressionAttributeValues[':products'] = (order.products as OrderProduct[]).map(p => ({
        productId: p.productId,
        name: p.name,
        quantity: p.quantity,
        price: p.price,
      }));
    }

    if (order.status) {
      updateExpressions.push('#status = :status');
      expressionAttributeNames['#status'] = 'status';
      expressionAttributeValues[':status'] = order.status;
    }

    updateExpressions.push('updatedAt = :updatedAt');
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    const result = await this.docClient.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { id: order.id },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: Object.keys(expressionAttributeNames).length > 0 ? expressionAttributeNames : undefined,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      })
    );

    this.logger.log(`Order updated successfully: ${order.id}`);
    return this.mapToOrder(result.Attributes);
  }

  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting order with id: ${id}`);

    await this.docClient.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: { id },
      })
    );

    this.logger.log(`Order deleted successfully: ${id}`);
  }

  async findByClientId(clientId: string): Promise<Order[]> {
    this.logger.log(`Finding orders by clientId: ${clientId}`);

    const result = await this.docClient.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'clientId-index',
        KeyConditionExpression: 'clientId = :clientId',
        ExpressionAttributeValues: {
          ':clientId': clientId,
        },
      })
    );

    return (result.Items || []).map(item => this.mapToOrder(item)).filter((o): o is Order => o !== null);
  }

  async findByStatus(status: OrderStatus): Promise<Order[]> {
    this.logger.log(`Finding orders by status: ${status}`);

    const result = await this.docClient.send(
      new ScanCommand({
        TableName: this.tableName,
        FilterExpression: '#status = :status',
        ExpressionAttributeNames: { '#status': 'status' },
        ExpressionAttributeValues: {
          ':status': status,
        },
      })
    );

    return (result.Items || []).map(item => this.mapToOrder(item)).filter((o): o is Order => o !== null);
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Order[]> {
    this.logger.log(`Finding orders by date range: ${startDate.toISOString()} to ${endDate.toISOString()}`);

    const result = await this.docClient.send(
      new ScanCommand({
        TableName: this.tableName,
        FilterExpression: 'createdAt >= :startDate AND createdAt <= :endDate',
        ExpressionAttributeValues: {
          ':startDate': startDate.toISOString(),
          ':endDate': endDate.toISOString(),
        },
      })
    );

    return (result.Items || []).map(item => this.mapToOrder(item)).filter((o): o is Order => o !== null);
  }
}

// === ARCHIVO: api/src/infrastructure/controllers/order.controller.ts ===
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  Logger,
  ParseUUIDPipe,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { OrderService } from '../../application/services/order.service';
import { CreateOrderDto, OrderResponseDto } from '../../application/dto/create-order.dto';
import { UpdateOrderDto } from '../../application/dto/update-order.dto';
import { OrderStatus, Order } from '../../domain/entities/order.entity';
import { OrderNotFoundException, InvalidOrderDataException } from '../../shared/exceptions/order.exceptions';

@ApiTags('orders')
@ApiBearerAuth()
@Controller('orders')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully', type: OrderResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid order data' })
  @ApiResponse({ status: 409, description: 'Order already exists' })
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    this.logger.log(`Creating order for client: ${createOrderDto.clientId}`);

    try {
      createOrderDto.validate();
    } catch (error) {
      throw new BadRequestException(`Invalid order data: ${(error as Error).message}`);
    }

    const order = await this.orderService.createOrder(createOrderDto);
    return order;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an order by ID' })
  @ApiParam({ name: 'id', description: 'Order UUID', type: String })
  @ApiResponse({ status: 200, description: 'Order found', type: OrderResponseDto })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async getOrder(@Param('id', ParseUUIDPipe) id: string): Promise<OrderResponseDto> {
    this.logger.log(`Fetching order: ${id}`);

    const order = await this.orderService.getOrder(id);
    
    if (!order) {
      throw new OrderNotFoundException(id);
    }

    return order;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing order' })
  @ApiParam({ name: 'id', description: 'Order UUID', type: String })
  @ApiBody({ type: UpdateOrderDto })
  @ApiResponse({ status: 200, description: 'Order updated successfully', type: OrderResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid update data' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async updateOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto
  ): Promise<OrderResponseDto> {
    this.logger.log(`Updating order: ${id}`);

    const existingOrder = await this.orderService.getOrder(id);
    
    if (!existingOrder) {
      throw new OrderNotFoundException(id);
    }

    updateOrderDto.id = id;
    
    try {
      updateOrderDto.validate();
    } catch (error) {
      throw new BadRequestException(`Invalid update data: ${(error as Error).message}`);
    }

    const updatedOrder = await this.orderService.updateOrder(updateOrderDto);
    return updatedOrder;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an order' })
  @ApiParam({ name: 'id', description: 'Order UUID', type: String })
  @ApiResponse({ status: 204, description: 'Order deleted successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async deleteOrder(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    this.logger.log(`Deleting order: ${id}`);

    const existingOrder = await this.orderService.getOrder(id);
    
    if (!existingOrder) {
      throw new OrderNotFoundException(id);
    }

    await this.orderService.deleteOrder(id);
  }

  @Get('client/:clientId')
  @ApiOperation({ summary: 'Get all orders for a client' })
  @ApiParam({ name: 'clientId', description: 'Client UUID', type: String })
  @ApiResponse({ status: 200, description: 'Orders found', type: [OrderResponseDto] })
  async getOrdersByClient(@Param('clientId', ParseUUIDPipe) clientId: string): Promise<OrderResponseDto[]> {
    this.logger.log(`Fetching orders for client: ${clientId}`);

    const orders = await this.orderService.getOrdersByClient(clientId);
    return orders;
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get all orders by status' })
  @ApiParam({ name: 'status', description: 'Order status', enum: OrderStatus, type: String })
  @ApiResponse({ status: 200, description: 'Orders found', type: [OrderResponseDto] })
  async getOrdersByStatus(@Param('status') status: string): Promise<OrderResponseDto[]> {
    this.logger.log(`Fetching orders by status: ${status}`);

    const orderStatus = Object.values(OrderStatus).find(s => s === status.toUpperCase());
    
    if (!orderStatus) {
      throw new BadRequestException(`Invalid status: ${status}. Valid values: ${Object.values(OrderStatus).join(', ')}`);
    }

    const orders = await this.orderService.getOrdersByStatus(orderStatus);
    return orders;
  }
}

// === ARCHIVO: api/src/infrastructure/config/swagger.config.ts ===
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

// === ARCHIVO: api/src/shared/exceptions/order.exceptions.ts ===
import { HttpException, HttpStatus } from '@nestjs/common';

export class OrderException extends HttpException {
    constructor(
        message: string,
        status: HttpStatus,
        public readonly code?: string,
        public readonly details?: Record<string, unknown>,
    ) {
        super(
            {
                statusCode: status,
                message: message,
                error: HttpStatus[status],
                code: code,
                details: details,
                timestamp: new Date().toISOString(),
            },
            status,
        );
    }
}

export class OrderNotFoundException extends OrderException {
    constructor(orderId: string) {
        super(
            `La orden con ID '${orderId}' no fue encontrada en el sistema`,
            HttpStatus.NOT_FOUND,
            'ORDER_NOT_FOUND',
            { orderId, suggestion: 'Verifique que el ID de la orden sea correcto' },
        );
    }
}

export class OrderAlreadyExistsException extends OrderException {
    constructor(orderId: string) {
        super(
            `Ya existe una orden con el ID '${orderId}' en el sistema`,
            HttpStatus.CONFLICT,
            'ORDER_ALREADY_EXISTS',
            { orderId, suggestion: 'Use un ID único para la nueva orden' },
        );
    }
}

export class InvalidOrderDataException extends OrderException {
    constructor(reason: string, details?: Record<string, unknown>) {
        super(
            `Los datos de la orden son inválidos: ${reason}`,
            HttpStatus.BAD_REQUEST,
            'INVALID_ORDER_DATA',
            details,
        );
    }
}

export class DuplicateProductException extends OrderException {
    constructor(duplicateProducts: string[]) {
        super(
            `Se detectaron productos duplicados en la orden: ${duplicateProducts.join(', ')}`,
            HttpStatus.BAD_REQUEST,
            'DUPLICATE_PRODUCTS',
            {
                duplicateProducts,
                suggestion: 'Elimine los productos duplicados o agrupe las cantidades del mismo producto',
            },
        );
    }
}

export class ClientNotFoundException extends OrderException {
    constructor(clientId: string) {
        super(
            `El cliente con ID '${clientId}' no existe en el sistema`,
            HttpStatus.BAD_REQUEST,
            'CLIENT_NOT_FOUND',
            { clientId, suggestion: 'Verifique que el ID del cliente sea válido' },
        );
    }
}

export class InvalidOrderStatusException extends OrderException {
    constructor(currentStatus: string, requestedStatus: string) {
        super(
            `No se puede cambiar el estado de '${currentStatus}' a '${requestedStatus}'`,
            HttpStatus.UNPROCESSABLE_ENTITY,
            'INVALID_STATUS_TRANSITION',
            {
                currentStatus,
                requestedStatus,
                validTransitions: {
                    PENDING: ['PROCESSING', 'CANCELLED'],
                    PROCESSING: ['COMPLETED', 'CANCELLED'],
                    COMPLETED: [],
                    CANCELLED: [],
                },
            },
        );
    }
}

export class OrderHasNoProductsException extends OrderException {
    constructor() {
        super(
            'La orden debe contener al menos un producto',
            HttpStatus.BAD_REQUEST,
            'ORDER_WITHOUT_PRODUCTS',
            { suggestion: 'Agregue productos a la orden antes de guardarla' },
        );
    }
}

export class OrderLimitExceededException extends OrderException {
    constructor(limit: number, current: number) {
        super(
            `Se excedió el límite máximo de productos por orden (${limit}). Actualmente hay ${current} productos`,
            HttpStatus.BAD_REQUEST,
            'ORDER_LIMIT_EXCEEDED',
            { limit, current, suggestion: 'Reduzca la cantidad de productos o cree múltiples órdenes' },
        );
    }
}

export class DatabaseOrderException extends OrderException {
    constructor(operation: string, originalError: Error) {
        super(
            `Error en la base de datos al realizar la operación '${operation}': ${originalError.message}`,
            HttpStatus.INTERNAL_SERVER_ERROR,
            'DATABASE_ERROR',
            { operation, originalError: originalError.message },
        );
    }
}

export class OrderValidationException extends OrderException {
    constructor(validationErrors: string[]) {
        super(
            `Error de validación en la orden`,
            HttpStatus.BAD_REQUEST,
            'ORDER_VALIDATION_ERROR',
            { validationErrors },
        );
    }
}

// === ARCHIVO: api/src/shared/utils/validation.utils.ts ===
import { OrderStatus, OrderProduct } from '../../domain/entities/order.entity';
import {
    DuplicateProductException,
    ClientNotFoundException,
    OrderHasNoProductsException,
    OrderLimitExceededException,
    InvalidOrderStatusException,
} from '../exceptions/order.exceptions';

const MAX_PRODUCTS_PER_ORDER = 50;
const VALID_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.PENDING]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
    [OrderStatus.PROCESSING]: [OrderStatus.COMPLETED, OrderStatus.CANCELLED],
    [OrderStatus.COMPLETED]: [],
    [OrderStatus.CANCELLED]: [],
};

const VALID_CLIENT_IDS = new Set([
    'client-001',
    'client-002',
    'client-003',
    'client-004',
    'client-005',
    'client-006',
    'client-007',
    'client-008',
    'client-009',
    'client-010',
]);

export function validateNoDuplicateProducts(products: OrderProduct[]): void {
    if (!products || products.length === 0) {
        return;
    }

    const productIds = products.map((p) => p.productId);
    const uniqueProductIds = new Set(productIds);

    if (productIds.length !== uniqueProductIds.size) {
        const duplicates = productIds.filter((id, index) => productIds.indexOf(id) !== index);
        const uniqueDuplicates = [...new Set(duplicates)];
        throw new DuplicateProductException(uniqueDuplicates);
    }
}

export function validateClientExists(clientId: string): void {
    if (!clientId || clientId.trim().length === 0) {
        throw new ClientNotFoundException(clientId || 'undefined');
    }

    if (!VALID_CLIENT_IDS.has(clientId)) {
        throw new ClientNotFoundException(clientId);
    }
}

export function validateOrderHasProducts(products: OrderProduct[]): void {
    if (!products || products.length === 0) {
        throw new OrderHasNoProductsException();
    }
}

export function validateProductLimit(products: OrderProduct[]): void {
    if (products && products.length > MAX_PRODUCTS_PER_ORDER) {
        throw new OrderLimitExceededException(MAX_PRODUCTS_PER_ORDER, products.length);
    }
}

export function validateStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus): void {
    if (currentStatus === newStatus) {
        return;
    }

    const allowedTransitions = VALID_STATUS_TRANSITIONS[currentStatus];

    if (!allowedTransitions || !allowedTransitions.includes(newStatus)) {
        throw new InvalidOrderStatusException(currentStatus, newStatus);
    }
}

export function validateProductQuantity(quantity: number): void {
    if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new Error('La cantidad del producto debe ser un número entero positivo');
    }
}

export function validateProductPrice(price: number): void {
    if (typeof price !== 'number' || price < 0) {
        throw new Error('El precio del producto debe ser un número no negativo');
    }
}

export function validateProductData(product: OrderProduct): void {
    if (!product.productId || product.productId.trim().length === 0) {
        throw new Error('El ID del producto es requerido');
    }

    if (!product.name || product.name.trim().length === 0) {
        throw new Error('El nombre del producto es requerido');
    }

    validateProductQuantity(product.quantity);
    validateProductPrice(product.price);
}

export function validateAllProducts(products: OrderProduct[]): void {
    validateOrderHasProducts(products);
    validateProductLimit(products);
    validateNoDuplicateProducts(products);

    products.forEach((product, index) => {
        try {
            validateProductData(product);
        } catch (error) {
            throw new Error(`Error en el producto ${index + 1}: ${(error as Error).message}`);
        }
    });
}

export function validateOrderId(id: string): void {
    if (!id || id.trim().length === 0) {
        throw new Error('El ID de la orden es requerido');
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
        throw new Error('El ID de la orden debe ser un UUID válido');
    }
}

export function calculateOrderTotal(products: OrderProduct[]): number {
    if (!products || products.length === 0) {
        return 0;
    }

    return products.reduce((total, product) => {
        return total + product.price * product.quantity;
    }, 0);
}

export function sanitizeOrderInput(input: Record<string, unknown>): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(input)) {
        if (typeof value === 'string') {
            sanitized[key] = value.trim();
        } else {
            sanitized[key] = value;
        }
    }

    return sanitized;
}

export function isValidStatus(status: string): status is OrderStatus {
    return Object.values(OrderStatus).includes(status as OrderStatus);
}

export function normalizeStatus(status: string): OrderStatus {
    const upperStatus = status.toUpperCase();

    if (!isValidStatus(upperStatus)) {
        throw new Error(`Estado inválido: ${status}`);
    }

    return upperStatus as OrderStatus;
}

// === ARCHIVO: api/src/main.ts ===
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Orders API')
    .setDescription('API para gestión de órdenes con persistencia en DynamoDB')
    .setVersion('1.0')
    .addTag('orders', 'Operaciones CRUD de órdenes')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Orders API - Documentación',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  const baseUrl = await app.getUrl();
  console.log(`🚀 Aplicación iniciada en: ${baseUrl}`);
  console.log(`📚 Documentación Swagger disponible en: ${baseUrl}/api/docs`);
  console.log(`🌱 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📦 Tabla DynamoDB: ${process.env.DYNAMODB_TABLE_NAME || 'orders-dev'}`);
}

bootstrap();

// === ARCHIVO: api/src/app.module.ts ===
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { OrderController } from './infrastructure/controllers/order.controller';
import { OrderService } from './application/services/order.service';
import { OrderRepositoryImpl } from './infrastructure/repositories/order.repository.impl';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { TransformInterceptor } from './shared/interceptors/transform.interceptor';

@Module({
  imports: [],
  controllers: [OrderController],
  providers: [
    {
      provide: 'DYNAMODB_CLIENT',
      useFactory: () => {
        const client = new DynamoDBClient({
          region: process.env.AWS_REGION || 'us-east-1',
          endpoint: process.env.DYNAMODB_ENDPOINT,
          credentials: process.env.AWS_ACCESS_KEY_ID
            ? {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
              }
            : undefined,
        });
        return client;
      },
    },
    {
      provide: 'DYNAMODB_DOCUMENT_CLIENT',
      inject: ['DYNAMODB_CLIENT'],
      useFactory: (client: DynamoDBClient) => {
        return DynamoDBDocumentClient.from(client, {
          marshallOptions: {
            removeUndefinedValues: true,
            convertClassInstanceToMap: true,
          },
          unmarshallOptions: {
            wrapNumbers: false,
          },
        });
      },
    },
    {
      provide: 'DYNAMODB_TABLE_NAME',
      useValue: process.env.DYNAMODB_TABLE_NAME || 'orders-dev',
    },
    {
      provide: OrderRepositoryImpl,
      inject: ['DYNAMODB_DOCUMENT_CLIENT', 'DYNAMODB_TABLE_NAME'],
      useFactory: (docClient: DynamoDBDocumentClient, tableName: string) => {
        return new OrderRepositoryImpl(docClient, tableName);
      },
    },
    {
      provide: OrderService,
      inject: [OrderRepositoryImpl],
      useFactory: (orderRepository: OrderRepositoryImpl) => {
        return new OrderService(orderRepository);
      },
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}

// === ARCHIVO: api/test/order.service.spec.ts ===
import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '../src/application/services/order.service';
import { OrderRepository } from '../src/domain/repositories/order.repository';
import { Order, OrderStatus, OrderProduct } from '../src/domain/entities/order.entity';
import { CreateOrderDto } from '../src/application/dto/create-order.dto';
import { UpdateOrderDto } from '../src/application/dto/update-order.dto';
import { OrderResponseDto } from '../src/application/dto/create-order.dto';
import { OrderNotFoundException, InvalidOrderStatusException } from '../src/shared/exceptions/order.exceptions';

describe('OrderService', () => {
  let service: OrderService;
  let repository: jest.Mocked<OrderRepository>;

  const mockOrderProduct = new OrderProduct('prod-1', 'Product 1', 2, 100);
  const mockOrder: Order = new Order(
    'client-123',
    [mockOrderProduct],
    OrderStatus.PENDING,
    'order-123',
    new Date('2024-01-15'),
    new Date('2024-01-15')
  );

  const mockOrderResponse: OrderResponseDto = {
    id: 'order-123',
    clientId: 'client-123',
    products: [{ productId: 'prod-1', name: 'Product 1', quantity: 2, price: 100 }],
    status: OrderStatus.PENDING,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  };

  const createOrderDto: CreateOrderDto = {
    clientId: 'client-123',
    products: [{ productId: 'prod-1', name: 'Product 1', quantity: 2, price: 100 }],
    validate: () => {}
  };

  const updateOrderDto: UpdateOrderDto = {
    id: 'order-123',
    status: OrderStatus.PROCESSING,
    validate: () => {}
  };

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByClientId: jest.fn(),
      findByStatus: jest.fn(),
      findByDateRange: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: OrderRepository,
          useValue: mockRepository
        }
      ]
    }).compile();

    service = module.get<OrderService>(OrderService);
    repository = module.get(OrderRepository);
  });

  describe('createOrder', () => {
    it('debería crear una orden exitosamente', async () => {
      repository.create.mockResolvedValue(mockOrder);

      const result = await service.createOrder(createOrderDto);

      expect(repository.create).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.clientId).toBe(createOrderDto.clientId);
    });

    it('debería lanzar excepción cuando falla la creación', async () => {
      repository.create.mockRejectedValue(new Error('Database error'));

      await expect(service.createOrder(createOrderDto)).rejects.toThrow();
    });
  });

  describe('getOrder', () => {
    it('debería obtener una orden por ID', async () => {
      repository.findById.mockResolvedValue(mockOrder);

      const result = await service.getOrder('order-123');

      expect(repository.findById).toHaveBeenCalledWith('order-123');
      expect(result).toBeDefined();
      expect(result.id).toBe('order-123');
    });

    it('debería lanzar OrderNotFoundException cuando la orden no existe', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.getOrder('non-existent')).rejects.toThrow(OrderNotFoundException);
    });
  });

  describe('updateOrder', () => {
    it('debería actualizar una orden exitosamente', async () => {
      const updatedOrder = { ...mockOrder, status: OrderStatus.PROCESSING };
      repository.findById.mockResolvedValue(mockOrder);
      repository.update.mockResolvedValue(updatedOrder as Order);

      const result = await service.updateOrder(updateOrderDto);

      expect(repository.update).toHaveBeenCalled();
      expect(result.status).toBe(OrderStatus.PROCESSING);
    });

    it('debería lanzar excepción cuando la orden no existe', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.updateOrder(updateOrderDto)).rejects.toThrow(OrderNotFoundException);
    });

    it('debería lanzar excepción para transición de estado inválida', async () => {
      repository.findById.mockResolvedValue(mockOrder);

      const invalidUpdate: UpdateOrderDto = {
        id: 'order-123',
        status: OrderStatus.CANCELLED,
        validate: () => {}
      };

      await expect(service.updateOrder(invalidUpdate)).rejects.toThrow(InvalidOrderStatusException);
    });
  });

  describe('deleteOrder', () => {
    it('debería eliminar una orden exitosamente', async () => {
      repository.findById.mockResolvedValue(mockOrder);
      repository.delete.mockResolvedValue();

      await service.deleteOrder('order-123');

      expect(repository.delete).toHaveBeenCalledWith('order-123');
    });

    it('debería lanzar excepción cuando la orden no existe', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.deleteOrder('non-existent')).rejects.toThrow(OrderNotFoundException);
    });
  });

  describe('getOrdersByClient', () => {
    it('debería obtener órdenes por cliente', async () => {
      const orders = [mockOrder];
      repository.findByClientId.mockResolvedValue(orders);

      const result = await service.getOrdersByClient('client-123');

      expect(repository.findByClientId).toHaveBeenCalledWith('client-123');
      expect(result).toHaveLength(1);
    });
  });

  describe('getOrdersByStatus', () => {
    it('debería obtener órdenes por estado', async () => {
      const orders = [mockOrder];
      repository.findByStatus.mockResolvedValue(orders);

      const result = await service.getOrdersByStatus(OrderStatus.PENDING);

      expect(repository.findByStatus).toHaveBeenCalledWith(OrderStatus.PENDING);
      expect(result).toHaveLength(1);
    });
  });

  describe('getOrdersByDateRange', () => {
    it('debería obtener órdenes por rango de fechas', async () => {
      const orders = [mockOrder];
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      repository.findByDateRange.mockResolvedValue(orders);

      const result = await service.getOrdersByDateRange(startDate, endDate);

      expect(repository.findByDateRange).toHaveBeenCalledWith(startDate, endDate);
      expect(result).toHaveLength(1);
    });
  });
});

// === ARCHIVO: api/test/order.controller.spec.ts ===
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { OrderController } from '../src/infrastructure/controllers/order.controller';
import { OrderService } from '../src/application/services/order.service';
import { OrderStatus } from '../src/domain/entities/order.entity';
import { OrderResponseDto } from '../src/application/dto/create-order.dto';
import { OrderNotFoundException } from '../src/shared/exceptions/order.exceptions';

describe('OrderController (e2e)', () => {
  let app: INestApplication;
  let service: jest.Mocked<OrderService>;

  const mockOrderResponse: OrderResponseDto = {
    id: 'order-123',
    clientId: 'client-123',
    products: [{ productId: 'prod-1', name: 'Product 1', quantity: 2, price: 100 }],
    status: OrderStatus.PENDING,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  };

  const mockOrderService = {
    createOrder: jest.fn(),
    getOrder: jest.fn(),
    updateOrder: jest.fn(),
    deleteOrder: jest.fn(),
    getOrdersByClient: jest.fn(),
    getOrdersByStatus: jest.fn(),
    getOrdersByDateRange: jest.fn()
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService
        }
      ]
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    service = moduleFixture.get<OrderService>(OrderService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /orders', () => {
    it('debería crear una orden exitosamente', async () => {
      mockOrderService.createOrder.mockResolvedValue(mockOrderResponse);

      const createDto = {
        clientId: 'client-123',
        products: [{ productId: 'prod-1', name: 'Product 1', quantity: 2, price: 100 }]
      };

      const response = await request(app.getHttpServer())
        .post('/orders')
        .send(createDto)
        .expect(201);

      expect(mockOrderService.createOrder).toHaveBeenCalledWith(createDto);
      expect(response.body.id).toBeDefined();
    });

    it('debería retornar 400 para datos inválidos', async () => {
      const invalidDto = { clientId: '', products: [] };

      await request(app.getHttpServer())
        .post('/orders')
        .send(invalidDto)
        .expect(400);
    });
  });

  describe('GET /orders/:id', () => {
    it('debería obtener una orden por ID', async () => {
      mockOrderService.getOrder.mockResolvedValue(mockOrderResponse);

      const response = await request(app.getHttpServer())
        .get('/orders/order-123')
        .expect(200);

      expect(mockOrderService.getOrder).toHaveBeenCalledWith('order-123');
      expect(response.body.id).toBe('order-123');
    });

    it('debería retornar 404 cuando la orden no existe', async () => {
      mockOrderService.getOrder.mockRejectedValue(new OrderNotFoundException('non-existent'));

      await request(app.getHttpServer())
        .get('/orders/non-existent')
        .expect(404);
    });

    it('debería retornar 400 para ID inválido', async () => {
      await request(app.getHttpServer())
        .get('/orders/invalid-uuid')
        .expect(400);
    });
  });

  describe('PUT /orders/:id', () => {
    it('debería actualizar una orden exitosamente', async () => {
      const updatedResponse = { ...mockOrderResponse, status: OrderStatus.PROCESSING };
      mockOrderService.updateOrder.mockResolvedValue(updatedResponse);

      const updateDto = { status: OrderStatus.PROCESSING };

      const response = await request(app.getHttpServer())
        .put('/orders/order-123')
        .send(updateDto)
        .expect(200);

      expect(mockOrderService.updateOrder).toHaveBeenCalled();
      expect(response.body.status).toBe(OrderStatus.PROCESSING);
    });

    it('debería retornar 404 cuando la orden no existe', async () => {
      mockOrderService.updateOrder.mockRejectedValue(new OrderNotFoundException('non-existent'));

      const updateDto = { status: OrderStatus.COMPLETED };

      await request(app.getHttpServer())
        .put('/orders/non-existent')
        .send(updateDto)
        .expect(404);
    });
  });

  describe('DELETE /orders/:id', () => {
    it('debería eliminar una orden exitosamente', async () => {
      mockOrderService.deleteOrder.mockResolvedValue();

      await request(app.getHttpServer())
        .delete('/orders/order-123')
        .expect(204);

      expect(mockOrderService.deleteOrder).toHaveBeenCalledWith('order-123');
    });

    it('debería retornar 404 cuando la orden no existe', async () => {
      mockOrderService.deleteOrder.mockRejectedValue(new OrderNotFoundException('non-existent'));

      await request(app.getHttpServer())
        .delete('/orders/non-existent')
        .expect(404);
    });
  });

  describe('GET /orders/client/:clientId', () => {
    it('debería obtener órdenes por cliente', async () => {
      mockOrderService.getOrdersByClient.mockResolvedValue([mockOrderResponse]);

      const response = await request(app.getHttpServer())
        .get('/orders/client/client-123')
        .expect(200);

      expect(mockOrderService.getOrdersByClient).toHaveBeenCalledWith('client-123');
      expect(response.body).toHaveLength(1);
    });
  });

  describe('GET /orders/status/:status', () => {
    it('debería obtener órdenes por estado', async () => {
      mockOrderService.getOrdersByStatus.mockResolvedValue([mockOrderResponse]);

      const response = await request(app.getHttpServer())
        .get('/orders/status/PENDING')
        .expect(200);

      expect(mockOrderService.getOrdersByStatus).toHaveBeenCalledWith(OrderStatus.PENDING);
      expect(response.body).toHaveLength(1);
    });

    it('debería retornar 400 para estado inválido', async () => {
      await request(app.getHttpServer())
        .get('/orders/status/INVALID_STATUS')
        .expect(400);
    });
  });
});

// === ARCHIVO: api/test/jest-e2e.json ===
{
  "moduleFileExtensions": [
    "js",
    "json",
    "ts"
  ],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  }
}


// === ARCHIVO: api/src/shared/filters/http-exception.filter.ts ===
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Error interno del servidor';
    let errorDetails: any = undefined;
    let code: string | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as Record<string, any>;
        message = responseObj.message || exception.message;
        errorDetails = responseObj.details;
        code = responseObj.code;
      } else {
        message = exception.message;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(`Error no controlado: ${exception.message}`, exception.stack);
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      ...(code && { code }),
      ...(errorDetails && { details: errorDetails }),
    };

    this.logger.warn(
      `[${request.method}] ${request.url} - ${status} - ${message}`,
    );

    response.status(status).json(errorResponse);
  }
}

// === ARCHIVO: api/src/shared/interceptors/logging.interceptor.ts ===
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const { method, url, body, headers } = request;
    const startTime = Date.now();

    const sanitizedHeaders = { ...headers };
    if (sanitizedHeaders.authorization) {
      sanitizedHeaders.authorization = '***';
    }

    this.logger.log(`→ ${method} ${url}`);
    this.logger.debug(`Headers: ${JSON.stringify(sanitizedHeaders)}`);
    
    if (Object.keys(body || {}).length > 0) {
      this.logger.debug(`Body: ${JSON.stringify(body)}`);
    }

    return next.handle().pipe(
      tap({
        next: (data) => {
          const duration = Date.now() - startTime;
          this.logger.log(
            `← ${method} ${url} ${response.statusCode} - ${duration}ms`,
          );
          this.logger.debug(`Response: ${JSON.stringify(data)}`);
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          const statusCode = error.status || 500;
          this.logger.error(
            `← ${method} ${url} ${statusCode} - ${duration}ms - ${error.message}`,
          );
        },
      }),
    );
  }
}

// === ARCHIVO: api/src/shared/interceptors/transform.interceptor.ts ===
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, T> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<T> {
    return next.handle().pipe(
      map((data) => {
        if (data === null || data === undefined) {
          return data;
        }
        return data;
      }),
    );
  }
}

// === ARCHIVO: client/vite.config.ts ===
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    css: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true
  }
});

// === ARCHIVO: client/package.json ===
{
  "name": "order-management-client",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write src"
  },
  "dependencies": {
    "react": "19.3.1",
    "react-dom": "19.3.1",
    "react-router-dom": "6.23.1",
    "axios": "1.7.2",
    "react-hook-form": "7.91.0",
    "@hookform/resolvers": "3.6.0",
    "zod": "3.23.8",
    "@tanstack/react-query": "5.107.1"
  },
  "devDependencies": {
    "@types/react": "18.3.3",
    "@types/react-dom": "18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "vite": "5.2.12",
    "vitest": "1.6.0",
    "@testing-library/react": "16.3.3",
    "@testing-library/jest-dom": "6.4.5",
    "@testing-library/user-event": "14.5.2",
    "typescript": "^5.7.3",
    "eslint": "^8.56.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "prettier": "^3.2.5"
  }
}

// === ARCHIVO: client/tsconfig.json ===
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [
    { "path": "./tsconfig.node.json" }
  ]
}

// === ARCHIVO: client/tsconfig.node.json ===
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}

// === ARCHIVO: client/index.html ===
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Sistema de gestión de órdenes" />
    <title>Gestión de Órdenes</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>

// === ARCHIVO: client/src/features/orders/services/order.service.ts ===
import {
  fetchOrders as apiFetchOrders,
  createOrder as apiCreateOrder,
  updateOrder as apiUpdateOrder,
  deleteOrder as apiDeleteOrder,
  getOrder as apiGetOrder,
  type Order,
  type CreateOrderDto,
  type UpdateOrderDto,
} from '@/shared/utils/api';

const API_BASE_URL = 'http://localhost:3000';

export const orderService = {
  async fetchOrders(): Promise<Order[]> {
    const response = await apiFetchOrders();
    return response.data;
  },

  async getOrder(id: string): Promise<Order> {
    const response = await apiGetOrder(id);
    return response.data;
  },

  async createOrder(data: CreateOrderDto): Promise<Order> {
    const response = await apiCreateOrder(data);
    return response.data;
  },

  async updateOrder(id: string, data: UpdateOrderDto): Promise<Order> {
    const response = await apiUpdateOrder(id, data);
    return response.data;
  },

  async deleteOrder(id: string): Promise<void> {
    await apiDeleteOrder(id);
  },
};

// Reexportar funciones para otros módulos que las importan directamente
export const fetchOrders = apiFetchOrders;
export const createOrder = apiCreateOrder;
export const updateOrder = apiUpdateOrder;
export const deleteOrder = apiDeleteOrder;

// === ARCHIVO: client/src/features/orders/hooks/useOrders.ts ===
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../services/order.service';
import type { Order, CreateOrderDto, UpdateOrderDto } from '../../../shared/utils/api';

const QUERY_KEYS = {
  orders: ['orders'] as const,
  order: (id: string) => ['orders', id] as const,
};

export function useOrders() {
  const queryClient = useQueryClient();

  const ordersQuery = useQuery({
    queryKey: QUERY_KEYS.orders,
    queryFn: () => orderService.fetchOrders(),
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  const createOrderMutation = useMutation({
    mutationFn: (data: CreateOrderDto) => orderService.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders });
    },
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderDto }) =>
      orderService.updateOrder(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.order(id) });
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: (id: string) => orderService.deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders });
    },
  });

  return {
    orders: ordersQuery.data ?? [],
    isLoading: ordersQuery.isLoading,
    isError: ordersQuery.isError,
    error: ordersQuery.error,
    refetch: ordersQuery.refetch,
    createOrder: createOrderMutation.mutate,
    updateOrder: updateOrderMutation.mutate,
    deleteOrder: deleteOrderMutation.mutate,
    isCreating: createOrderMutation.isPending,
    isUpdating: updateOrderMutation.isPending,
    isDeleting: deleteOrderMutation.isPending,
    createError: createOrderMutation.error,
    updateError: updateOrderMutation.error,
    deleteError: deleteOrderMutation.error,
    createSuccess: createOrderMutation.isSuccess,
    updateSuccess: updateOrderMutation.isSuccess,
    deleteSuccess: deleteOrderMutation.isSuccess,
  };
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.order(id),
    queryFn: () => orderService.getOrder(id),
    enabled: !!id,
  });
}

// === ARCHIVO: client/src/features/orders/components/OrderCard.tsx ===
import type { Order } from '../types/order.types';
import { formatDate } from '@/shared/utils/date';
import styles from './OrderCard.module.css';

interface OrderCardProps {
  order: Order;
  onEdit?: (order: Order) => void;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  processing: 'Procesando',
  completed: 'Completada',
  cancelled: 'Cancelada',
};

const STATUS_CLASSES: Record<string, string> = {
  pending: styles.statusPending,
  processing: styles.statusProcessing,
  completed: styles.statusCompleted,
  cancelled: styles.statusCancelled,
};

export function OrderCard({ order, onEdit, onDelete, isDeleting }: OrderCardProps) {
  const totalAmount = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleDelete = () => {
    if (onDelete && window.confirm('¿Está seguro de eliminar esta orden?')) {
      onDelete(order.id);
    }
  };

  return (
    <article className={styles.card} aria-label={`Orden ${order.id}`}>
      <header className={styles.header}>
        <div className={styles.idSection}>
          <span className={styles.label}>Orden</span>
          <span className={styles.orderId}>#{order.id.slice(0, 8)}</span>
        </div>
        <span className={`${styles.status} ${STATUS_CLASSES[order.status]}`}>
          {STATUS_LABELS[order.status] || order.status}
        </span>
      </header>

      <section className={styles.content}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Cliente</h3>
          <p className={styles.clientName}>{order.customerName}</p>
          <p className={styles.clientEmail}>{order.customerEmail}</p>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Productos</h3>
          <ul className={styles.itemsList} role="list">
            {order.items.map((item, index) => (
              <li key={index} className={styles.item}>
                <span className={styles.itemName}>{item.productName}</span>
                <span className={styles.itemQuantity}>x{item.quantity}</span>
                <span className={styles.itemPrice}>
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Resumen</h3>
          <div className={styles.summary}>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Impuestos</span>
              <span>${(totalAmount * 0.16).toFixed(2)}</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.total}`}>
              <span>Total</span>
              <span>${(totalAmount * 1.16).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Fecha</h3>
          <time className={styles.date} dateTime={order.createdAt}>
            {formatDate(order.createdAt)}
          </time>
        </div>
      </section>

      <footer className={styles.footer}>
        <button
          className={styles.editButton}
          onClick={() => onEdit?.(order)}
          disabled={isDeleting}
          aria-label={`Editar orden ${order.id}`}
        >
          Editar
        </button>
        <button
          className={styles.deleteButton}
          onClick={handleDelete}
          disabled={isDeleting}
          aria-label={`Eliminar orden ${order.id}`}
        >
          {isDeleting ? 'Eliminando...' : 'Eliminar'}
        </button>
      </footer>
    </article>
  );
}

// === ARCHIVO: client/src/shared/components/ErrorBoundary.tsx ===
import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({
      errorInfo,
    });
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    console.error('ErrorBoundary capturó un error:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div style={{
          padding: '2rem',
          margin: '1rem',
          border: '1px solid #dc3545',
          borderRadius: '8px',
          backgroundColor: '#fff5f5',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#dc3545', marginBottom: '1rem' }}>
            Algo salió mal
          </h2>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            {this.state.error?.message || 'Ha ocurrido un error inesperado'}
          </p>
          {this.state.errorInfo && (
            <details style={{ 
              textAlign: 'left', 
              marginBottom: '1rem',
              padding: '0.5rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px'
            }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                Detalles del error
              </summary>
              <pre style={{ 
                overflow: 'auto', 
                fontSize: '0.875rem',
                marginTop: '0.5rem'
              }}>
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
          <button
            onClick={this.handleReset}
            style={{
              padding: '0.5rem 1.5rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Reintentar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// === ARCHIVO: client/src/shared/utils/api.ts ===
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

const API_BASE_URL = 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<{ message?: string; code?: string }>) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      switch (status) {
        case 401:
          localStorage.removeItem('authToken');
          window.location.href = '/login';
          break;
        case 403:
          console.error('Acceso denegado');
          break;
        case 404:
          console.error('Recurso no encontrado');
          break;
        case 500:
          console.error('Error interno del servidor');
          break;
      }
      
      return Promise.reject<ApiError>({
        message: data?.message || error.message || 'Error desconocido',
        status,
        code: data?.code,
      });
    } else if (error.request) {
      return Promise.reject<ApiError>({
        message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
        status: 0,
        code: 'NETWORK_ERROR',
      });
    } else {
      return Promise.reject<ApiError>({
        message: error.message || 'Error al procesar la solicitud',
        status: 0,
        code: 'UNKNOWN_ERROR',
      });
    }
  }
);

export async function fetchOrders(): Promise<ApiResponse<Order[]>> {
  const response = await apiClient.get<Order[]>('/orders');
  return {
    data: response.data,
    status: response.status,
  };
}

export async function createOrder(order: CreateOrderDto): Promise<ApiResponse<Order>> {
  const response = await apiClient.post<Order>('/orders', order);
  return {
    data: response.data,
    status: response.status,
    message: 'Orden creada exitosamente',
  };
}

export async function updateOrder(id: string, order: UpdateOrderDto): Promise<ApiResponse<Order>> {
  const response = await apiClient.put<Order>(`/orders/${id}`, order);
  return {
    data: response.data,
    status: response.status,
    message: 'Orden actualizada exitosamente',
  };
}

export async function deleteOrder(id: string): Promise<ApiResponse<void>> {
  const response = await apiClient.delete(`/orders/${id}`);
  return {
    data: undefined,
    status: response.status,
    message: 'Orden eliminada exitosamente',
  };
}

export async function getOrder(id: string): Promise<ApiResponse<Order>> {
  const response = await apiClient.get<Order>(`/orders/${id}`);
  return {
    data: response.data,
    status: response.status,
  };
}

export { apiClient };

// Exportar 'api' como alias de apiClient para compatibilidad
export const api = apiClient;

// Tipos complementarios para las operaciones de API
export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  products: Product[];
  createdAt: string;
  updatedAt: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  total: number;
}

export interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface CreateOrderDto {
  customerId: string;
  customerName: string;
  products: Omit<Product, 'id'>[];
}

export interface UpdateOrderDto {
  customerId?: string;
  customerName?: string;
  products?: Omit<Product, 'id'>[];
  status?: Order['status'];
}

// === ARCHIVO: client/src/shared/utils/validation.ts ===
import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'El nombre del producto es requerido'),
  quantity: z.number().int().positive('La cantidad debe ser mayor a 0'),
  price: z.number().positive('El precio debe ser mayor a 0'),
});

export const createOrderSchema = z.object({
  customerId: z.string().min(1, 'El ID del cliente es requerido'),
  customerName: z.string().min(1, 'El nombre del cliente es requerido'),
  products: z
    .array(productSchema)
    .min(1, 'Debe incluir al menos un producto')
    .refine(
      (products) => {
        const names = products.map((p) => p.name.toLowerCase().trim());
        const uniqueNames = new Set(names);
        return names.length === uniqueNames.size;
      },
      {
        message: 'No se permiten productos duplicados en la orden',
      }
    ),
});

export const updateOrderSchema = z.object({
  customerId: z.string().min(1).optional(),
  customerName: z.string().min(1).optional(),
  products: z.array(productSchema).optional(),
  status: z.enum(['pending', 'processing', 'completed', 'cancelled']).optional(),
});

export type CreateOrderFormData = z.infer<typeof createOrderSchema>;
export type UpdateOrderFormData = z.infer<typeof updateOrderSchema>;
export type ProductFormData = z.infer<typeof productSchema>;

export function validateCreateOrder(data: unknown): { success: boolean; data?: CreateOrderFormData; error?: string } {
  const result = createOrderSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const firstError = result.error.errors[0];
  return { success: false, error: `${firstError.path.join('.')}: ${firstError.message}` };
}

export function validateUpdateOrder(data: unknown): { success: boolean; data?: UpdateOrderFormData; error?: string } {
  const result = updateOrderSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const firstError = result.error.errors[0];
  return { success: false, error: `${firstError.path.join('.')}: ${firstError.message}` };
}

export function hasDuplicateProducts(products: ProductFormData[]): boolean {
  const names = products.map((p) => p.name.toLowerCase().trim());
  const uniqueNames = new Set(names);
  return names.length !== uniqueNames.size;
}

export function getDuplicateProductNames(products: ProductFormData[]): string[] {
  const nameCounts = new Map<string, number>();
  const duplicates: string[] = [];
  
  products.forEach((product) => {
    const normalizedName = product.name.toLowerCase().trim();
    const count = nameCounts.get(normalizedName) || 0;
    nameCounts.set(normalizedName, count + 1);
  });
  
  nameCounts.forEach((count, name) => {
    if (count > 1) {
      duplicates.push(name);
    }
  });
  
  return duplicates;
}

export function calculateOrderTotal(products: ProductFormData[]): number {
  return products.reduce((total, product) => {
    return total + product.price * product.quantity;
  }, 0);
}

export function validateCustomerId(customerId: string): { valid: boolean; message?: string } {
  if (!customerId || customerId.trim().length === 0) {
    return { valid: false, message: 'El ID del cliente es requerido' };
  }
  
  if (customerId.length < 3) {
    return { valid: false, message: 'El ID del cliente debe tener al menos 3 caracteres' };
  }
  
  return { valid: true };
}

export function validateProductQuantity(quantity: number): { valid: boolean; message?: string } {
  if (!Number.isInteger(quantity)) {
    return { valid: false, message: 'La cantidad debe ser un número entero' };
  }
  
  if (quantity <= 0) {
    return { valid: false, message: 'La cantidad debe ser mayor a 0' };
  }
  
  if (quantity > 1000) {
    return { valid: false, message: 'La cantidad no puede exceder 1000 unidades' };
  }
  
  return { valid: true };
}

export function validateProductPrice(price: number): { valid: boolean; message?: string } {
  if (typeof price !== 'number' || isNaN(price)) {
    return { valid: false, message: 'El precio debe ser un número válido' };
  }
  
  if (price <= 0) {
    return { valid: false, message: 'El precio debe ser mayor a 0' };
  }
  
  if (price > 1000000) {
    return { valid: false, message: 'El precio no puede exceder 1,000,000' };
  }
  
  return { valid: true };
}

export interface ValidationRule<T> {
  validate: (value: T) => boolean;
  message: string;
}

export function createValidationChain<T>(rules: ValidationRule<T>[]): (value: T) => string | null {
  return (value: T): string | null => {
    for (const rule of rules) {
      if (!rule.validate(value)) {
        return rule.message;
      }
    }
    return null;
  };
}

// === ARCHIVO: client/src/main.tsx ===
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from './shared/components/ErrorBoundary';
import { App } from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found. Ensure index.html contains <div id="root"></div>');
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ErrorBoundary
          fallback={
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              padding: '2rem',
              textAlign: 'center',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              <h1 style={{ color: '#dc2626', marginBottom: '1rem' }}>Something went wrong</h1>
              <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>Please refresh the page or try again later.</p>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500'
                }}
              >
                Refresh Page
              </button>
            </div>
          }
        >
          <App />
        </ErrorBoundary>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);

// === ARCHIVO: client/src/App.tsx ===
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import OrderList from './features/orders/OrderList';
import OrderForm from './features/orders/OrderForm';

export function App() {
  const location = useLocation();
  const isEditing = location.pathname.startsWith('/orders/') && location.pathname !== '/orders/new';

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <header style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '1rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#1e293b',
            margin: 0
          }}>
            Order Management
          </h1>
          <span style={{
            fontSize: '0.75rem',
            backgroundColor: '#dbeafe',
            color: '#1e40af',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            fontWeight: '500'
          }}>
            Client
          </span>
        </div>
        <nav style={{ display: 'flex', gap: '0.5rem' }}>
          <Link
            to="/orders"
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'all 0.15s ease',
              backgroundColor: location.pathname === '/orders' ? '#2563eb' : 'transparent',
              color: location.pathname === '/orders' ? '#ffffff' : '#64748b'
            }}
          >
            Orders
          </Link>
          <Link
            to="/orders/new"
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'all 0.15s ease',
              backgroundColor: location.pathname === '/orders/new' ? '#2563eb' : '#2563eb',
              color: '#ffffff'
            }}
          >
            + New Order
          </Link>
        </nav>
      </header>

      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1.5rem'
      }}>
        <Routes>
          <Route path="/" element={<Navigate to="/orders" replace />} />
          <Route path="/orders" element={<OrderList />} />
          <Route path="/orders/new" element={<OrderForm />} />
          <Route path="/orders/:id" element={<OrderForm />} />
        </Routes>
      </main>

      <footer style={{
        borderTop: '1px solid #e2e8f0',
        padding: '1.5rem',
        textAlign: 'center',
        color: '#94a3b8',
        fontSize: '0.875rem'
      }}>
        <p style={{ margin: 0 }}>
          Order Management Client • Powered by React & TanStack Query
        </p>
      </footer>
    </div>
  );
}

// === ARCHIVO: client/src/features/orders/OrderList.tsx ===
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchOrders, deleteOrder } from './services/order.service';
import { Order, ApiError } from '@/shared/utils/api';
import { OrderCard } from './components/OrderCard';
import ErrorBoundary from '@/shared/components/ErrorBoundary';
import './OrderList.scss';

interface OrderListProps {
  onEditOrder: (order: Order) => void;
}

const OrderList: React.FC<OrderListProps> = ({ onEditOrder }) => {
  const [filterStatus, setFilterStatus] = useState<Order['status'] | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();
  const itemsPerPage = 5;

  const { data: orders = [], error, isLoading } = useQuery<Order[], ApiError>({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });

  const deleteMutation = useMutation<void, ApiError, string>({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error) => {
      console.error('Error deleting order:', error);
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta orden?')) {
      deleteMutation.mutate(id);
    }
  };

  const filteredOrders = orders.filter(order =>
    filterStatus === 'all' ? true : order.status === filterStatus
  );

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  if (isLoading) {
    return <div className="order-list-loading">Cargando órdenes...</div>;
  }

  if (error) {
    return (
      <div className="order-list-error">
        Error al cargar órdenes: {error.message}
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="order-list-container">
        <div className="order-list-header">
          <h2>Lista de Órdenes</h2>
          <div className="order-list-filter">
            <label htmlFor="status-filter">Filtrar por estado:</label>
            <select
              id="status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as Order['status'] | 'all')}
            >
              <option value="all">Todos</option>
              <option value="pending">Pendiente</option>
              <option value="processing">En Proceso</option>
              <option value="completed">Completado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
        </div>

        {paginatedOrders.length === 0 ? (
          <div className="order-list-empty">No hay órdenes disponibles</div>
        ) : (
          <>
            <div className="order-list-grid">
              {paginatedOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onEdit={() => onEditOrder(order)}
                  onDelete={handleDelete}
                  isDeleting={deleteMutation.isPending}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="order-list-pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </button>
                <span>
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default OrderList;

// === ARCHIVO: client/src/features/orders/OrderForm.tsx ===
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrder, updateOrder } from './services/order.service';
import { CreateOrderDto, UpdateOrderDto, Order, ApiError } from '@/shared/utils/api';
import { createOrderSchema, updateOrderSchema } from '@/shared/utils/validation';
import './OrderForm.scss';

interface OrderFormProps {
  orderToEdit?: Order | null;
  onSuccess?: () => void;
}

type FormData = OrderFormProps['orderToEdit'] extends Order ? UpdateOrderDto : CreateOrderDto;

const OrderForm: React.FC<OrderFormProps> = ({ orderToEdit, onSuccess }) => {
  const queryClient = useQueryClient();
  const isEditing = !!orderToEdit;

  const { mutate, isPending, error } = useMutation<Order, ApiError, FormData>({
    mutationFn: (data) =>
      isEditing
        ? updateOrder(orderToEdit.id, data as UpdateOrderDto)
        : createOrder(data as CreateOrderDto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      if (onSuccess) onSuccess();
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    control,
    watch,
    setValue,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(isEditing ? updateOrderSchema : createOrderSchema),
    mode: 'onChange',
    defaultValues: isEditing
      ? {
          customerId: orderToEdit.customerId,
          customerName: orderToEdit.customerName,
          products: orderToEdit.products.map(product => ({
            name: product.name,
            quantity: product.quantity,
            price: product.price,
          })),
          status: orderToEdit.status,
        }
      : {
          customerId: '',
          customerName: '',
          products: [{ name: '', quantity: 1, price: 0 }],
        },
  });

  const products = watch('products');

  const onSubmit: SubmitHandler<FormData> = (data) => {
    mutate(data);
  };

  const addProduct = () => {
    setValue('products', [...products, { name: '', quantity: 1, price: 0 }]);
  };

  const removeProduct = (index: number) => {
    if (products.length > 1) {
      const newProducts = [...products];
      newProducts.splice(index, 1);
      setValue('products', newProducts);
    }
  };

  const updateProduct = (index: number, field: keyof Omit<Product, 'id'>, value: string | number) => {
    const newProducts = [...products];
    newProducts[index] = { ...newProducts[index], [field]: value };
    setValue('products', newProducts);
  };

  const total = products.reduce((sum, product) => sum + (product.quantity * product.price), 0);

  return (
    <div className="order-form-container">
      <h2>{isEditing ? 'Editar Orden' : 'Crear Nueva Orden'}</h2>

      {error && (
        <div className="order-form-error">
          Error: {error.message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="order-form">
        <div className="order-form-group">
          <label htmlFor="customerId">ID del Cliente</label>
          <input
            id="customerId"
            {...register('customerId')}
            type="text"
            placeholder="Ingrese ID del cliente"
          />
          {errors.customerId && <span className="error-message">{errors.customerId.message}</span>}
        </div>

        <div className="order-form-group">
          <label htmlFor="customerName">Nombre del Cliente</label>
          <input
            id="customerName"
            {...register('customerName')}
            type="text"
            placeholder="Ingrese nombre del cliente"
          />
          {errors.customerName && <span className="error-message">{errors.customerName.message}</span>}
        </div>

        <div className="order-form-products">
          <h3>Productos</h3>
          {products.map((product, index) => (
            <div key={index} className="order-form-product">
              <div className="order-form-product-field">
                <label>Nombre</label>
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) => updateProduct(index, 'name', e.target.value)}
                  placeholder="Nombre del producto"
                />
                {errors.products?.[index]?.name && (
                  <span className="error-message">{errors.products[index]?.name?.message}</span>
                )}
              </div>

              <div className="order-form-product-field">
                <label>Cantidad</label>
                <input
                  type="number"
                  value={product.quantity}
                  onChange={(e) => updateProduct(index, 'quantity', Number(e.target.value))}
                  min="1"
                />
                {errors.products?.[index]?.quantity && (
                  <span className="error-message">{errors.products[index]?.quantity?.message}</span>
                )}
              </div>

              <div className="order-form-product-field">
                <label>Precio</label>
                <input
                  type="number"
                  value={product.price}
                  onChange={(e) => updateProduct(index, 'price', Number(e.target.value))}
                  min="0"
                  step="0.01"
                />
                {errors.products?.[index]?.price && (
                  <span className="error-message">{errors.products[index]?.price?.message}</span>
                )}
              </div>

              <button
                type="button"
                onClick={() => removeProduct(index)}
                className="order-form-remove-product"
                disabled={products.length <= 1}
              >
                Eliminar
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addProduct}
            className="order-form-add-product"
          >
            Añadir Producto
          </button>
        </div>

        {isEditing && (
          <div className="order-form-group">
            <label htmlFor="status">Estado</label>
            <select
              id="status"
              {...register('status')}
            >
              <option value="pending">Pendiente</option>
              <option value="processing">En Proceso</option>
              <option value="completed">Completado</option>
              <option value="cancelled">Cancelado</option>
            </select>
            {errors.status && <span className="error-message">{errors.status.message}</span>}
          </div>
        )}

        <div className="order-form-total">
          <strong>Total: ${total.toFixed(2)}</strong>
        </div>

        <button
          type="submit"
          className="order-form-submit"
          disabled={!isValid || isPending}
        >
          {isPending ? 'Procesando...' : isEditing ? 'Actualizar Orden' : 'Crear Orden'}
        </button>
      </form>
    </div>
  );
};

export default OrderForm;

// === ARCHIVO: client/src/features/orders/__tests__/OrderForm.spec.tsx ===
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import OrderForm from '../OrderForm';
import { createOrder, updateOrder } from '../services/order.service';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('../services/order.service');

const queryClient = new QueryClient();

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('OrderForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders create order form by default', () => {
    render(<OrderForm />, { wrapper: Wrapper });

    expect(screen.getByText('Crear Nueva Orden')).toBeInTheDocument();
    expect(screen.getByLabelText('ID del Cliente')).toHaveValue('');
    expect(screen.getByLabelText('Nombre del Cliente')).toHaveValue('');
    expect(screen.getByText('Añadir Producto')).toBeInTheDocument();
  });

  it('renders edit order form when orderToEdit is provided', () => {
    const mockOrder = {
      id: '1',
      customerId: 'cust123',
      customerName: 'John Doe',
      products: [
        { id: 'p1', name: 'Product 1', quantity: 2, price: 10 },
        { id: 'p2', name: 'Product 2', quantity: 1, price: 20 },
      ],
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
      status: 'pending',
      total: 40,
    };

    render(<OrderForm orderToEdit={mockOrder} />, { wrapper: Wrapper });

    expect(screen.getByText('Editar Orden')).toBeInTheDocument();
    expect(screen.getByLabelText('ID del Cliente')).toHaveValue('cust123');
    expect(screen.getByLabelText('Nombre del Cliente')).toHaveValue('John Doe');
    expect(screen.getByDisplayValue('Product 1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
    expect(screen.getByDisplayValue('10')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<OrderForm />, { wrapper: Wrapper });

    fireEvent.click(screen.getByText('Crear Orden'));

    await waitFor(() => {
      expect(screen.getByText('ID del cliente es requerido')).toBeInTheDocument();
      expect(screen.getByText('Nombre del cliente es requerido')).toBeInTheDocument();
      expect(screen.getByText('Nombre del producto es requerido')).toBeInTheDocument();
    });
  });

  it('validates product quantity and price', async () => {
    render(<OrderForm />, { wrapper: Wrapper });

    const nameInput = screen.getByPlaceholderText('Nombre del producto');
    const quantityInput = screen.getAllByLabelText('Cantidad')[0];
    const priceInput = screen.getAllByLabelText('Precio')[0];
    const submitButton = screen.getByText('Crear Orden');

    fireEvent.change(nameInput, { target: { value: 'Test Product' } });
    fireEvent.change(quantityInput, { target: { value: '0' } });
    fireEvent.change(priceInput, { target: { value: '-1' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('La cantidad debe ser mayor que 0')).toBeInTheDocument();
      expect(screen.getByText('El precio debe ser mayor que 0')).toBeInTheDocument();
    });
  });

  it('adds and removes products', async () => {
    render(<OrderForm />, { wrapper: Wrapper });

    expect(screen.getAllByLabelText('Nombre')).toHaveLength(1);

    fireEvent.click(screen.getByText('Añadir Producto'));
    expect(screen.getAllByLabelText('Nombre')).toHaveLength(2);

    fireEvent.click(screen.getAllByText('Eliminar')[0]);
    expect(screen.getAllByLabelText('Nombre')).toHaveLength(1);
  });

  it('submits create order form', async () => {
    const mockCreate = vi.mocked(createOrder).mockResolvedValue({
      id: '1',
      customerId: 'cust123',
      customerName: 'John Doe',
      products: [{ id: 'p1', name: 'Product 1', quantity: 2, price: 10 }],
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
      status: 'pending',
      total: 20,
    });

    render(<OrderForm />, { wrapper: Wrapper });

    fireEvent.change(screen.getByLabelText('ID del Cliente'), { target: { value: 'cust123' } });
    fireEvent.change(screen.getByLabelText('Nombre del Cliente'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Nombre del producto'), { target: { value: 'Product 1' } });
    fireEvent.change(screen.getAllByLabelText('Cantidad')[0], { target: { value: '2' } });
    fireEvent.change(screen.getAllByLabelText('Precio')[0], { target: { value: '10' } });

    fireEvent.click(screen.getByText('Crear Orden'));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith({
        customerId: 'cust123',
        customerName: 'John Doe',
        products: [{ name: 'Product 1', quantity: 2, price: 10 }],
      });
    });
  });

  it('submits update order form', async () => {
    const mockUpdate = vi.mocked(updateOrder).mockResolvedValue({
      id: '1',
      customerId: 'cust123',
      customerName: 'John Doe Updated',
      products: [{ id: 'p1', name: 'Product 1 Updated', quantity: 3, price: 15 }],
      createdAt: '2023-01-01',
      updatedAt: '2023-01-02',
      status: 'processing',
      total: 45,
    });

    const mockOrder = {
      id: '1',
      customerId: 'cust123',
      customerName: 'John Doe',
      products: [{ id: 'p1', name: 'Product 1', quantity: 2, price: 10 }],
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
      status: 'pending',
      total: 20,
    };

    render(<OrderForm orderToEdit={mockOrder} />, { wrapper: Wrapper });

    fireEvent.change(screen.getByLabelText('Nombre del Cliente'), { target: { value: 'John Doe Updated' } });
    fireEvent.change(screen.getByDisplayValue('Product 1'), { target: { value: 'Product 1 Updated' } });
    fireEvent.change(screen.getAllByLabelText('Cantidad')[0], { target: { value: '3' } });
    fireEvent.change(screen.getAllByLabelText('Precio')[0], { target: { value: '15' } });
    fireEvent.change(screen.getByLabelText('Estado'), { target: { value: 'processing' } });

    fireEvent.click(screen.getByText('Actualizar Orden'));

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith('1', {
        customerName: 'John Doe Updated',
        products: [{ name: 'Product 1 Updated', quantity: 3, price: 15 }],
        status: 'processing',
      });
    });
  });

  it('calls onSuccess callback after successful submission', async () => {
    const mockOnSuccess = vi.fn();
    vi.mocked(createOrder).mockResolvedValue({
      id: '1',
      customerId: 'cust123',
      customerName: 'John Doe',
      products: [{ id: 'p1', name: 'Product 1', quantity: 2, price: 10 }],
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
      status: 'pending',
      total: 20,
    });

    render(<OrderForm onSuccess={mockOnSuccess} />, { wrapper: Wrapper });

    fireEvent.change(screen.getByLabelText('ID del Cliente'), { target: { value: 'cust123' } });
    fireEvent.change(screen.getByLabelText('Nombre del Cliente'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Nombre del producto'), { target: { value: 'Product 1' } });
    fireEvent.change(screen.getAllByLabelText('Cantidad')[0], { target: { value: '2' } });
    fireEvent.change(screen.getAllByLabelText('Precio')[0], { target: { value: '10' } });

    fireEvent.click(screen.getByText('Crear Orden'));

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });
});

// === ARCHIVO: client/src/features/orders/components/OrderCard.module.css ===
/* Estilos pendientes: archivo creado automaticamente porque otro modulo lo importa. */


// === ARCHIVO: client/src/index.css ===
/* Estilos pendientes: archivo creado automaticamente porque otro modulo lo importa. */


// === ARCHIVO: client/src/features/orders/OrderList.scss ===
/* Estilos pendientes: archivo creado automaticamente porque otro modulo lo importa. */


// === ARCHIVO: client/src/features/orders/OrderForm.scss ===
/* Estilos pendientes: archivo creado automaticamente porque otro modulo lo importa. */


// === ARCHIVO: client/src/setupTests.ts ===
// Setup de tests generado automaticamente (referenciado por la config del runner).
// Agrega aca matchers globales o mocks compartidos.
export {};


// === ARCHIVO: client/src/features/orders/types/order.types.ts ===
export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  products: Product[];
  createdAt: string;
  updatedAt: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  total: number;
}

export interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface CreateOrderDto {
  customerId: string;
  customerName: string;
  products: Omit<Product, 'id'>[];
}

export interface UpdateOrderDto {
  customerId?: string;
  customerName?: string;
  products?: Omit<Product, 'id'>[];
  status?: Order['status'];
}

// === ARCHIVO: infra/providers.tf ===
# Configuración de providers para Terraform
# Este archivo define los providers necesarios para desplegar la infraestructura
# en AWS y sus versiones correspondientes.

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.40.0"
    }
  }
  required_version = ">= 1.7.0"
}

# Provider principal para AWS
# Configura la región por defecto y permite asumir roles para despliegues en
# diferentes entornos.
provider "aws" {
  region = var.aws_region

  # Permitir la asunción de roles para entornos específicos
  dynamic "assume_role" {
    for_each = var.aws_assume_role_arn != "" ? [1] : []
    content {
      role_arn = var.aws_assume_role_arn
    }
  }
}

# Variables esperadas por este provider
# Estas variables se definen en variables.tf y se pasan desde el entorno

# Outputs para exponer información útil del provider
# Estos outputs pueden ser utilizados por otros módulos o configuraciones



// === ARCHIVO: infra/variables.tf ===
# Definición de variables de entrada para la configuración de Terraform
# Estas variables permiten parametrizar la infraestructura para diferentes entornos
# (dev, staging, prod) sin modificar el código.

# Variables globales
variable "environment" {
  description = "Entorno en el que se despliega la infraestructura (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "aws_region" {
  description = "Región de AWS donde se desplegará la infraestructura"
  type        = string
  default     = "us-east-1"
}

variable "aws_assume_role_arn" {
  description = "ARN del rol de AWS a asumir para despliegues en entornos específicos"
  type        = string
  default     = ""
}

# Variables específicas para DynamoDB
variable "dynamodb_table_name" {
  description = "Nombre de la tabla DynamoDB para órdenes"
  type        = string
  default     = "orders"
}

variable "dynamodb_billing_mode" {
  description = "Modo de facturación para la tabla DynamoDB (PROVISIONED o PAY_PER_REQUEST)"
  type        = string
  default     = "PAY_PER_REQUEST"
}

variable "dynamodb_read_capacity" {
  description = "Capacidad de lectura provisionada para la tabla DynamoDB"
  type        = number
  default     = 5
}

variable "dynamodb_write_capacity" {
  description = "Capacidad de escritura provisionada para la tabla DynamoDB"
  type        = number
  default     = 5
}

variable "dynamodb_hash_key" {
  description = "Clave hash (partition key) para la tabla DynamoDB"
  type        = string
  default     = "order_id"
}

variable "dynamodb_range_key" {
  description = "Clave de rango (sort key) para la tabla DynamoDB"
  type        = string
  default     = ""
}

variable "dynamodb_attributes" {
  description = "Lista de atributos para la tabla DynamoDB"
  type = list(object({
    name = string
    type = string
  }))
  default = [
    {
      name = "order_id"
      type = "S"
    },
    {
      name = "client_id"
      type = "S"
    },
    {
      name = "order_date"
      type = "S"
    },
    {
      name = "status"
      type = "S"
    }
  ]
}

variable "dynamodb_global_secondary_indexes" {
  description = "Lista de índices secundarios globales para la tabla DynamoDB"
  type = list(object({
    name            = string
    hash_key        = string
    range_key       = string
    projection_type = string
    read_capacity   = number
    write_capacity  = number
  }))
  default = [
    {
      name            = "client_id-index"
      hash_key        = "client_id"
      range_key       = "order_date"
      projection_type = "ALL"
      read_capacity   = 5
      write_capacity  = 5
    }
  ]
}

variable "dynamodb_ttl_attribute" {
  description = "Nombre del atributo para Time To Live (TTL) en DynamoDB"
  type        = string
  default     = "expiry_time"
}

variable "dynamodb_tags" {
  description = "Tags para la tabla DynamoDB"
  type        = map(string)
  default = {
    Name        = "orders-table"
    Environment = "dev"
    ManagedBy   = "terraform"
  }
}

# Variables para IAM
variable "iam_policy_name" {
  description = "Nombre de la política IAM para acceso a DynamoDB"
  type        = string
  default     = "dynamodb-orders-policy"
}

variable "iam_role_name" {
  description = "Nombre del rol IAM para acceso a DynamoDB"
  type        = string
  default     = "dynamodb-orders-role"
}

variable "iam_policy_description" {
  description = "Descripción de la política IAM"
  type        = string
  default     = "Política para acceso a la tabla DynamoDB de órdenes"
}

# Outputs globales
# Estos outputs exponen información crítica que puede ser utilizada por otros
# módulos o herramientas externas.



// === ARCHIVO: infra/modules/dynamodb/variables.tf ===
# Variables de entrada para el módulo DynamoDB
# Este archivo define las variables específicas que el módulo DynamoDB
# necesita para crear y configurar la tabla.

variable "aws_region" {
  description = "Región de AWS donde se creará la tabla DynamoDB"
  type        = string
  default     = "us-east-1"
}

variable "region" {
  description = "Alias de región para compatibilidad con módulos que usan var.region"
  type        = string
  default     = "us-east-1"
}

variable "table_name" {
  description = "Nombre de la tabla DynamoDB"
  type        = string
}

variable "billing_mode" {
  description = "Modo de facturación para la tabla DynamoDB (PROVISIONED o PAY_PER_REQUEST)"
  type        = string
  default     = "PAY_PER_REQUEST"
}

variable "read_capacity" {
  description = "Capacidad de lectura provisionada para la tabla DynamoDB"
  type        = number
  default     = 5
}

variable "write_capacity" {
  description = "Capacidad de escritura provisionada para la tabla DynamoDB"
  type        = number
  default     = 5
}

variable "hash_key" {
  description = "Clave hash (partition key) para la tabla DynamoDB"
  type        = string
}

variable "range_key" {
  description = "Clave de rango (sort key) para la tabla DynamoDB"
  type        = string
  default     = ""
}

variable "attributes" {
  description = "Lista de atributos para la tabla DynamoDB"
  type = list(object({
    name = string
    type = string
  }))
}

variable "global_secondary_indexes" {
  description = "Lista de índices secundarios globales para la tabla DynamoDB"
  type = list(object({
    name            = string
    hash_key        = string
    range_key       = string
    projection_type = string
    read_capacity   = number
    write_capacity  = number
  }))
  default = []
}

variable "ttl_attribute" {
  description = "Nombre del atributo para Time To Live (TTL) en DynamoDB"
  type        = string
  default     = ""
}

variable "tags" {
  description = "Tags para la tabla DynamoDB"
  type        = map(string)
  default     = {}
}

variable "enable_stream" {
  description = "Habilitar streams para la tabla DynamoDB"
  type        = bool
  default     = false
}

variable "stream_view_type" {
  description = "Tipo de vista para el stream de DynamoDB (KEYS_ONLY, NEW_IMAGE, OLD_IMAGE, NEW_AND_OLD_IMAGES)"
  type        = string
  default     = ""
}

variable "server_side_encryption_enabled" {
  description = "Habilitar cifrado del lado del servidor para la tabla DynamoDB"
  type        = bool
  default     = true
}

variable "server_side_encryption_kms_key_arn" {
  description = "ARN de la clave KMS para cifrado del lado del servidor"
  type        = string
  default     = ""
}

// === ARCHIVO: infra/environments/dev/terraform.tfvars ===
environment         = "dev"
aws_region          = "us-east-1"
aws_assume_role_arn = ""

dynamodb_table_name     = "orders-dev"
dynamodb_billing_mode   = "PAY_PER_REQUEST"
dynamodb_read_capacity  = 5
dynamodb_write_capacity = 5
dynamodb_hash_key       = "order_id"
dynamodb_range_key      = ""
dynamodb_ttl_attribute  = "expiry_time"

dynamodb_attributes = [
  {
    name = "order_id"
    type = "S"
  },
  {
    name = "customer_id"
    type = "S"
  },
  {
    name = "status"
    type = "S"
  },
  {
    name = "created_at"
    type = "S"
  }
]

dynamodb_global_secondary_indexes = []

dynamodb_tags = {
  Environment = "dev"
  Project     = "orders-management"
  ManagedBy   = "terraform"
}

iam_policy_name        = "dynamodb-orders-dev-policy"
iam_role_name          = "dynamodb-orders-dev-role"
iam_policy_description = "Política para acceso a la tabla DynamoDB de órdenes en entorno dev"

// === ARCHIVO: infra/README.md ===
# Infraestructura de Órdenes con Terraform

Este módulo de infraestructura define los recursos necesarios para persistir órdenes en DynamoDB y gestionar el acceso mediante políticas IAM.

## Recursos definidos

### DynamoDB
- Tabla `orders` con clave de partición `order_id`
- Modo de facturación PAY_PER_REQUEST
- TTL habilitado en atributo `expiry_time`
- Cifrado del lado del servidor con AWS managed key

### IAM
- Política para operaciones Get, Put, Update, Delete en la tabla
- Rol ejecutable por servicios que necesiten acceder a DynamoDB

## Uso del módulo

```hcl
module "orders_infra" {
  source = "./"

  environment           = "prod"
  aws_region            = "us-east-1"
  dynamodb_table_name   = "orders-prod"
  dynamodb_hash_key     = "order_id"
  dynamodb_attributes   = [...]
  dynamodb_tags         = { Environment = "prod" }
}
```

## Validación local

Ejecutar para verificar la configuración:

```bash
cd environments/dev
terraform init
terraform validate
terraform plan
```

## Estructura del módulo

```
infra/
├── environments/
│   └── dev/
│       └── terraform.tfvars    # Valores para entorno dev
├── modules/
│   ├── dynamodb/               # Módulo de tabla DynamoDB
│   └── iam/                    # Módulo de políticas y roles
├── providers.tf                # Configuración de providers
├── variables.tf                # Variables del módulo raíz
├── main.tf                     # Composición de recursos
├── outputs.tf                  # Outputs del módulo
└── terraform.tfvars            # Valores por defecto
```

## Outputs disponibles

- `environment` - Nombre del entorno desplegado
- `aws_region` - Región de AWS configurada
- `dynamodb_table_name` - Nombre de la tabla creada
- `dynamodb_table_arn` - ARN de la tabla (del módulo dynamodb)
- `iam_policy_arn` - ARN de la política de acceso

## Notas de diseño

- La tabla usa clave de partición simple (`order_id`) para optimizar consultas por ID
- El TTL en `expiry_time` permite limpieza automática de órdenes expiradas
- La política IAM sigue el principio de mínimo privilegio
- El estado de Terraform se versiona en S3 para entornos de producción

// === ARCHIVO: infra/terraform.tfvars ===
# Valores por defecto para la configuración de infraestructura
# Estos valores se aplican cuando no se especifica un archivo tfvars específico

environment         = "dev"
aws_region          = "us-east-1"
aws_assume_role_arn = ""

# Configuración de DynamoDB
dynamodb_table_name     = "orders"
dynamodb_billing_mode   = "PAY_PER_REQUEST"
dynamodb_read_capacity  = 5
dynamodb_write_capacity = 5
dynamodb_hash_key       = "order_id"
dynamodb_range_key      = ""
dynamodb_ttl_attribute  = "expiry_time"

# Atributos de la tabla DynamoDB
# Define los atributos que se utilizan como claves o índices
dynamodb_attributes = [
  {
    name        = "order_id"
    type        = "S"
    description = "Clave de partición principal - ID único de la orden"
  },
  {
    name        = "customer_id"
    type        = "S"
    description = "Identificador del cliente que realizó la orden"
  },
  {
    name        = "status"
    type        = "S"
    description = "Estado actual de la orden: pending, confirmed, shipped, delivered, cancelled"
  },
  {
    name        = "created_at"
    type        = "S"
    description = "Timestamp de creación de la orden en formato ISO 8601"
  },
  {
    name        = "updated_at"
    type        = "S"
    description = "Timestamp de última actualización de la orden"
  },
  {
    name        = "expiry_time"
    type        = "N"
    description = "Timestamp Unix para expiración automática de la orden"
  }
]

# Índices secundarios globales (GSI)
# Vacío por defecto - agregar según necesidades de consulta
dynamodb_global_secondary_indexes = []

# Tags aplicados a todos los recursos
dynamodb_tags = {
  Project            = "orders-management"
  ManagedBy          = "terraform"
  CostCenter         = "engineering"
  DataClassification = "internal"
}

# Configuración de IAM
iam_policy_name        = "dynamodb-orders-policy"
iam_role_name          = "dynamodb-orders-role"
iam_policy_description = "Política para acceso completo a la tabla DynamoDB de órdenes"

// === ARCHIVO: infra/modules/dynamodb/main.tf ===
terraform {
  # Este módulo crea una tabla de DynamoDB para persistir órdenes
  # Soporta: GSI, TTL, Streams, Encriptación KMS
}

resource "aws_dynamodb_table" "this" {
  name           = var.table_name
  billing_mode   = var.billing_mode
  hash_key       = var.hash_key
  range_key      = var.range_key != "" ? var.range_key : null
  read_capacity  = var.billing_mode == "PROVISIONED" ? var.read_capacity : null
  write_capacity = var.billing_mode == "PROVISIONED" ? var.write_capacity : null

  # Habilitar streams de DynamoDB para captura de cambios
  stream_enabled   = var.enable_stream
  stream_view_type = var.enable_stream ? var.stream_view_type : null

  # Definición de atributos de la tabla
  dynamic "attribute" {
    for_each = var.attributes
    content {
      name = attribute.value.name
      type = attribute.value.type
    }
  }

  # Índices secundarios globales (GSI)
  dynamic "global_secondary_index" {
    for_each = var.global_secondary_indexes
    content {
      name               = global_secondary_index.value.name
      hash_key           = global_secondary_index.value.hash_key
      range_key          = lookup(global_secondary_index.value, "range_key", null)
      projection_type    = global_secondary_index.value.projection_type
      non_key_attributes = lookup(global_secondary_index.value, "non_key_attributes", [])
      read_capacity      = var.billing_mode == "PROVISIONED" ? lookup(global_secondary_index.value, "read_capacity", var.read_capacity) : null
      write_capacity     = var.billing_mode == "PROVISIONED" ? lookup(global_secondary_index.value, "write_capacity", var.write_capacity) : null
    }
  }

  # Time-to-Live (TTL) para expiración automática de ítems
  dynamic "ttl" {
    for_each = var.ttl_attribute != "" ? [var.ttl_attribute] : []
    content {
      attribute_name = var.ttl_attribute
      enabled        = true
    }
  }

  # Encriptación del lado del servidor
  server_side_encryption {
    enabled     = var.server_side_encryption_enabled
    kms_key_arn = var.server_side_encryption_kms_key_arn != "" ? var.server_side_encryption_kms_key_arn : null
  }

  # Etiquetas para identificación y gestión
  tags = var.tags

  # Configuración de punto de tiempo de recuperación
  point_in_time_recovery {
    enabled = true
  }

  # Configuración de capacidad bajo demanda (si aplica)
  dynamic "replica" {
    for_each = var.aws_region != "us-east-1" && var.billing_mode == "PAY_PER_REQUEST" ? [1] : []
    content {
      region_name = var.aws_region
    }
  }
}

# Recurso auxiliar para obtener el ARN del recurso de la tabla
# Se usa para referenciar correctamente en políticas IAM
data "aws_dynamodb_table" "this" {
  name = aws_dynamodb_table.this.name
}

// === ARCHIVO: infra/modules/dynamodb/outputs.tf ===
# Outputs del módulo DynamoDB para consumir en otros módulos
# Exponen información crítica de la tabla creada

output "table_name" {
  description = "Nombre de la tabla DynamoDB"
  value       = aws_dynamodb_table.this.name
}

output "table_id" {
  description = "Identificador único de la tabla"
  value       = aws_dynamodb_table.this.id
}

output "table_arn" {
  description = "ARN completo de la tabla DynamoDB"
  value       = aws_dynamodb_table.this.arn
}

output "table_stream_arn" {
  description = "ARN del stream de DynamoDB (si está habilitado)"
  value       = try(aws_dynamodb_table.this.stream_arn, "")
  sensitive   = false
}

output "table_endpoint" {
  description = "Endpoint de la tabla para conexión"
  value       = "https://dynamodb.${var.region}.amazonaws.com"
}

output "table_region" {
  description = "Región donde se creó la tabla"
  value       = var.region
}

output "billing_mode" {
  description = "Modo de facturación de la tabla"
  value       = aws_dynamodb_table.this.billing_mode
}

output "hash_key_attribute_name" {
  description = "Nombre del atributo de clave de partición"
  value       = aws_dynamodb_table.this.hash_key
}

output "range_key_attribute_name" {
  description = "Nombre del atributo de clave de ordenación"
  value       = aws_dynamodb_table.this.range_key
}

output "global_secondary_index_names" {
  description = "Lista de nombres de índices secundarios globales"
  value       = [for gsi in aws_dynamodb_table.this.global_secondary_index : gsi.name]
}

output "tags" {
  description = "Etiquetas aplicadas a la tabla"
  value       = aws_dynamodb_table.this.tags
}

// === ARCHIVO: infra/modules/iam/main.tf ===
# Módulo IAM para crear políticas y roles de acceso a DynamoDB
# Proporciona permisos granulares para operaciones CRUD sobre la tabla de órdenes

# Política IAM para acceso completo a la tabla de órdenes
resource "aws_iam_policy" "dynamodb_access" {
  name        = var.iam_policy_name
  description = var.iam_policy_description

  # Policy document con permisos específicos para DynamoDB
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      # Permiso para describir la tabla
      {
        Sid    = "DescribeTable"
        Effect = "Allow"
        Action = [
          "dynamodb:DescribeTable",
          "dynamodb:DescribeTimeToLive",
          "dynamodb:DescribeContinuousBackups",
          "dynamodb:DescribeBackup",
          "dynamodb:ListTagsOfResource"
        ]
        Resource = var.table_arn
      },
      # Permisos de lectura sobre la tabla
      {
        Sid    = "ReadOrders"
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Resource = [
          var.table_arn,
          "${var.table_arn}/index/*"
        ]
      },
      # Permisos de escritura sobre la tabla
      {
        Sid    = "WriteOrders"
        Effect = "Allow"
        Action = [
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:BatchWriteItem"
        ]
        Resource = var.table_arn
      },
      # Permisos para streams de DynamoDB (si están habilitados)
      {
        Sid    = "StreamAccess"
        Effect = "Allow"
        Action = [
          "dynamodb:GetRecords",
          "dynamodb:GetShardIterator",
          "dynamodb:ListStreams"
        ]
        Resource = "${var.table_arn}/stream/*"
      }
    ]
  })

  tags = var.tags
}

# Rol IAM que será asumido por las aplicaciones/funciones lambda
resource "aws_iam_role" "dynamodb_app_role" {
  name = var.iam_role_name

  # Asumir rol desde servicios de AWS (EC2, Lambda, ECS, etc.)
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = [
            "ec2.amazonaws.com",
            "lambda.amazonaws.com",
            "ecs-tasks.amazonaws.com",
            "apigateway.amazonaws.com"
          ]
        }
      }
    ]
  })

  tags = var.tags
}

# Adjuntar la política de DynamoDB al rol
resource "aws_iam_role_policy_attachment" "dynamodb_policy_attachment" {
  role       = aws_iam_role.dynamodb_app_role.name
  policy_arn = aws_iam_policy.dynamodb_access.arn
}

# Política adicional para CloudWatch Logs (necesaria para Lambda)
resource "aws_iam_policy" "cloudwatch_logs" {
  name        = "${var.iam_policy_name}-logs"
  description = "Política para acceso a CloudWatch Logs"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

# Adjuntar política de CloudWatch al rol
resource "aws_iam_role_policy_attachment" "cloudwatch_logs_attachment" {
  role       = aws_iam_role.dynamodb_app_role.name
  policy_arn = aws_iam_policy.cloudwatch_logs.arn
}

# Output: ARN de la política de DynamoDB
output "policy_arn" {
  description = "ARN de la política IAM de acceso a DynamoDB"
  value       = aws_iam_policy.dynamodb_access.arn
}

# Output: Nombre del rol IAM
output "role_name" {
  description = "Nombre del rol IAM para acceso a DynamoDB"
  value       = aws_iam_role.dynamodb_app_role.name
}

# Output: ARN del rol IAM
output "role_arn" {
  description = "ARN completo del rol IAM"
  value       = aws_iam_role.dynamodb_app_role.arn
}

# Output: ARN de la política de CloudWatch Logs
output "cloudwatch_policy_arn" {
  description = "ARN de la política IAM de CloudWatch Logs"
  value       = aws_iam_policy.cloudwatch_logs.arn
}

// === ARCHIVO: infra/versions.tf ===
terraform {
  required_version = ">= 1.7.0"

}

# Configuración del provider AWS
# El provider se configura en providers.tf con las variables de región y role de asunción
# Esta declaración de versión asegura compatibilidad con la sintaxis de Terraform 1.7+

# Backend para almacenamiento remoto del estado de Terraform
# Se utiliza S3 para mantener el estado de infraestructura versionado y compartido
terraform {
  backend "s3" {
    bucket         = "terraform-state-${var.environment}"
    key            = "infra/state.tfstate"
    region         = var.aws_region
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}

# Notas sobre versionado de providers:
# - hashicorp/aws 5.40.0 es una versión estable release en 2024
# - Esta versión incluye soporte completo para todos los recursos de DynamoDB v2
# - El proveedor oficial de AWS es requerido para crear recursos en AWS

// === ARCHIVO: infra/main.tf ===
# Archivo principal de Terraform para la infraestructura del sistema de órdenes
# Este módulo orquesta la creación de todos los recursos de infraestructura
# necesarios para el sistema de gestión de órdenes con persistencia en DynamoDB

# Módulo de DynamoDB para almacenar las órdenes del sistema
# Se parametrizan todos los atributos de la tabla según las variables definidas
module "dynamodb" {
  source = "./modules/dynamodb"

  table_name               = var.dynamodb_table_name
  billing_mode             = var.dynamodb_billing_mode
  read_capacity            = var.dynamodb_read_capacity
  write_capacity           = var.dynamodb_write_capacity
  hash_key                 = var.dynamodb_hash_key
  range_key                = var.dynamodb_range_key
  attributes               = var.dynamodb_attributes
  global_secondary_indexes = var.dynamodb_global_secondary_indexes
  ttl_attribute            = var.dynamodb_ttl_attribute
  tags                     = var.dynamodb_tags

  # Habilitar streams para capturar cambios en la tabla
  # Útil para event-driven architecture y auditoría
  enable_stream    = true
  stream_view_type = "NEW_AND_OLD_IMAGES"

  # Cifrado del lado del servidor con KMS
  server_side_encryption_enabled = true
}

# Módulo de IAM para crear políticas y roles de acceso a DynamoDB
# El rol creado será utilizado por las aplicaciones que accedan a las órdenes
module "iam" {
  source = "./modules/iam"

  # El módulo IAM espera table_arn, no table_name
  # Se obtiene el ARN del módulo de DynamoDB
  table_arn = module.dynamodb.table_arn

  # Variables que el módulo IAM realmente acepta
  # policy_name y role_name sin prefijo iam_ ya que el módulo las define así
  policy_name        = var.iam_policy_name
  role_name          = var.iam_role_name
  policy_description = var.iam_policy_description

  # Tags para los recursos IAM
  tags = var.dynamodb_tags
}

# Recurso adicional: Bucket S3 para logs de la aplicación
# Almacena logs de acceso y aplicación para auditoría y debugging
resource "aws_s3_bucket" "app_logs" {
  bucket = "app-logs-${var.environment}-${data.aws_caller_identity.current.account_id}"

  tags = merge(var.dynamodb_tags, {
    Name        = "app-logs-${var.environment}"
    Environment = var.environment
    ManagedBy   = "terraform"
  })
}

# Configuración de lifecycle para el bucket de logs
resource "aws_s3_bucket_versioning" "app_logs" {
  bucket = aws_s3_bucket.app_logs.id

  versioning_configuration {
    status = "Enabled"
  }
}

# Bloqueo público del bucket de logs por seguridad
resource "aws_s3_bucket_public_access_block" "app_logs" {
  bucket = aws_s3_bucket.app_logs.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Recurso adicional: Topic SNS para notificaciones de pedidos
# Utilizado para enviar alertas cuando se crean, actualizan o eliminan pedidos
resource "aws_sns_topic" "orders_notifications" {
  name = "orders-notifications-${var.environment}"

  tags = merge(var.dynamodb_tags, {
    Name        = "orders-notifications"
    Environment = var.environment
  })
}

# Política de acceso al topic SNS
resource "aws_sns_topic_policy" "orders_notifications" {
  arn = aws_sns_topic.orders_notifications.arn

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "s3.amazonaws.com"
        }
        Action   = "sns:Publish"
        Resource = aws_sns_topic.orders_notifications.arn
        Condition = {
          ArnEquals = {
            "aws:SourceArn" = aws_s3_bucket.app_logs.arn
          }
        }
      }
    ]
  })
}

# Bucket S3 para almacenar el estado de Terraform de forma remota
# Este bucket es crítico para el workflow de Terraform
resource "aws_s3_bucket" "terraform_state" {
  bucket = "terraform-state-${var.environment}"

  tags = merge(var.dynamodb_tags, {
    Name        = "terraform-state"
    Environment = var.environment
  })
}

# Versioning del estado de Terraform para mantener historial
resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  versioning_configuration {
    status = "Enabled"
  }
}

# Bloqueo público del bucket de estado
resource "aws_s3_bucket_public_access_block" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Tabla DynamoDB para bloqueos de estado de Terraform
# Previene cambios concurrentes al estado
resource "aws_dynamodb_table" "terraform_locks" {
  name         = "terraform-locks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }

  tags = {
    Name        = "terraform-locks"
    Environment = var.environment
  }
}

# Data source para obtener información de la cuenta actual
# Utilizada para construir ARNs y nombres de recursos
data "aws_caller_identity" "current" {}

# Data source para obtener la región actual
data "aws_region" "current" {}

// === ARCHIVO: infra/outputs.tf ===
# Outputs de la infraestructura completa del sistema de órdenes
# Estos valores son consumidos por otros módulos o pipelines de CI/CD

# Información de la cuenta y región de AWS
output "aws_account_id" {
  description = "ID de la cuenta de AWS"
  value       = data.aws_caller_identity.current.account_id
}

output "aws_region" {
  description = "Región de AWS configurada"
  value       = var.aws_region
}

output "environment" {
  description = "Entorno de despliegue"
  value       = var.environment
}

# Outputs del módulo de DynamoDB
output "dynamodb_table_name" {
  description = "Nombre de la tabla de DynamoDB para órdenes"
  value       = module.dynamodb.table_name
}

output "dynamodb_table_arn" {
  description = "ARN de la tabla de DynamoDB"
  value       = module.dynamodb.table_arn
}

output "dynamodb_table_id" {
  description = "ID de la tabla de DynamoDB"
  value       = module.dynamodb.table_id
}

output "dynamodb_table_endpoint" {
  description = "Endpoint de la tabla de DynamoDB"
  value       = module.dynamodb.table_endpoint
}

output "dynamodb_table_stream_arn" {
  description = "ARN del stream de DynamoDB para captura de cambios"
  value       = module.dynamodb.table_stream_arn
}

output "dynamodb_hash_key_attribute_name" {
  description = "Nombre del atributo de clave hash"
  value       = module.dynamodb.hash_key_attribute_name
}

output "dynamodb_range_key_attribute_name" {
  description = "Nombre del atributo de clave de rango"
  value       = module.dynamodb.range_key_attribute_name
}

output "dynamodb_global_secondary_index_names" {
  description = "Nombres de los índices secundarios globales"
  value       = module.dynamodb.global_secondary_index_names
}

output "dynamodb_billing_mode" {
  description = "Modo de facturación de la tabla"
  value       = module.dynamodb.billing_mode
}

# Outputs del módulo de IAM
output "iam_role_name" {
  description = "Nombre del rol IAM para acceso a DynamoDB"
  value       = module.iam.role_name
}

output "iam_role_arn" {
  description = "ARN del rol IAM para acceso a DynamoDB"
  value       = module.iam.role_arn
}

output "iam_policy_arn" {
  description = "ARN de la política de acceso a DynamoDB"
  value       = module.iam.policy_arn
}

output "iam_cloudwatch_policy_arn" {
  description = "ARN de la política de CloudWatch Logs"
  value       = module.iam.cloudwatch_policy_arn
}

# Outputs de recursos adicionales
output "s3_app_logs_bucket_name" {
  description = "Nombre del bucket S3 para logs de la aplicación"
  value       = aws_s3_bucket.app_logs.id
}

output "s3_app_logs_bucket_arn" {
  description = "ARN del bucket S3 para logs de la aplicación"
  value       = aws_s3_bucket.app_logs.arn
}

output "sns_orders_notifications_topic_arn" {
  description = "ARN del topic SNS para notificaciones de pedidos"
  value       = aws_sns_topic.orders_notifications.arn
}

output "sns_orders_notifications_topic_name" {
  description = "Nombre del topic SNS para notificaciones de pedidos"
  value       = aws_sns_topic.orders_notifications.name
}

output "terraform_state_bucket_name" {
  description = "Nombre del bucket S3 para estado de Terraform"
  value       = aws_s3_bucket.terraform_state.id
}

output "terraform_state_bucket_arn" {
  description = "ARN del bucket S3 para estado de Terraform"
  value       = aws_s3_bucket.terraform_state.arn
}

output "terraform_locks_table_name" {
  description = "Nombre de la tabla DynamoDB para bloqueos de Terraform"
  value       = aws_dynamodb_table.terraform_locks.name
}

output "terraform_locks_table_arn" {
  description = "ARN de la tabla DynamoDB para bloqueos de Terraform"
  value       = aws_dynamodb_table.terraform_locks.arn
}

# Resumen de configuración completa para consumo externo
output "infrastructure_summary" {
  description = "Resumen de la infraestructura creada"
  value = {
    environment    = var.environment
    aws_region     = var.aws_region
    aws_account_id = data.aws_caller_identity.current.account_id
    dynamodb_table = module.dynamodb.table_name
    dynamodb_arn   = module.dynamodb.table_arn
    iam_role       = module.iam.role_name
    iam_policy     = module.iam.policy_arn
    logs_bucket    = aws_s3_bucket.app_logs.id
    sns_topic      = aws_sns_topic.orders_notifications.name
    state_bucket   = aws_s3_bucket.terraform_state.id
    locks_table    = aws_dynamodb_table.terraform_locks.name
  }
}

// === ARCHIVO: infra/modules/iam/variables.tf ===
# Variables de entrada para el módulo IAM
# Este archivo define las variables necesarias para crear políticas y roles IAM
# que permiten el acceso a la tabla DynamoDB y otros recursos.

variable "iam_policy_name" {
  description = "Nombre de la política IAM para acceso a DynamoDB"
  type        = string
  default     = "dynamodb-orders-policy"
}

variable "iam_policy_description" {
  description = "Descripción de la política IAM para acceso a DynamoDB"
  type        = string
  default     = "Política para acceso a la tabla DynamoDB de órdenes"
}

variable "table_arn" {
  description = "ARN de la tabla DynamoDB a la que se otorgará acceso"
  type        = string
  default     = ""
}

variable "tags" {
  description = "Tags para los recursos IAM creados"
  type        = map(string)
  default     = {}
}

variable "iam_role_name" {
  description = "Nombre del rol IAM que utilizará la aplicación para acceder a DynamoDB"
  type        = string
  default     = "dynamodb-orders-role"
}

# Variables adicionales que main.tf intentaba pasar pero faltaban en el módulo
# Estas variables permiten una configuración más flexible del módulo IAM

variable "environment" {
  description = "Entorno de despliegue (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "region" {
  description = "Región de AWS donde se crearán los recursos"
  type        = string
  default     = "us-east-1"
}

# Variables alias para compatibilidad con main.tf que usa nombres sin prefijo
# El módulo puede recibir tanto policy_name como iam_policy_name

variable "policy_name" {
  description = "Nombre de la política IAM (alias para iam_policy_name)"
  type        = string
  default     = "dynamodb-orders-policy"
}

variable "role_name" {
  description = "Nombre del rol IAM (alias para iam_role_name)"
  type        = string
  default     = "dynamodb-orders-role"
}

variable "policy_description" {
  description = "Descripción de la política IAM (alias para iam_policy_description)"
  type        = string
  default     = "Política para acceso a la tabla DynamoDB de órdenes"
}

// === ARCHIVO: docker-compose.yml ===
# Infraestructura local del reto. SOLO desarrollo: credenciales de ejemplo (local-dev-only), puertos en loopback.
# Levantar: docker compose up -d --wait
name: infra-local
services:
  dynamodb-local:
    image: "amazon/dynamodb-local:2.5.2"
    command: ["-jar","DynamoDBLocal.jar","-sharedDb","-inMemory"]
    ports:
      - "127.0.0.1:8000:8000"
    healthcheck:
      test: ["CMD-SHELL","bash -c ':> /dev/tcp/127.0.0.1/8000' || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 10
      start_period: 5s


// === ARCHIVO: infra-local/README.md ===
# Infraestructura local

Servicios de soporte para el reto, definidos en `docker-compose.yml` (raiz del repo).

```bash
docker compose up -d --wait
```

| Servicio | Imagen | Puertos (host) |
|---|---|---|
| DynamoDB Local | `amazon/dynamodb-local:2.5.2` | 8000 |

Credenciales: solo de desarrollo local (`local-dev-only`, `local`). No son secretos ni deben reutilizarse.
Los scripts de `infra-local/` (tablas, topics) se ejecutan con el compose en estado healthy.


// === ARCHIVO: infra-local/dynamodb/create-tables.sh ===
#!/usr/bin/env bash
# Crea las tablas en DynamoDB Local (idempotente). Credenciales dummy: DynamoDB Local no valida firmas.
set -euo pipefail

export AWS_ACCESS_KEY_ID=local
export AWS_SECRET_ACCESS_KEY=local
export AWS_REGION=us-east-1
ENDPOINT="${DYNAMODB_ENDPOINT:-http://localhost:8000}"

create_table() {
  local name="$1" pk="$2" sk="${3:-}"
  if aws dynamodb describe-table --table-name "$name" --endpoint-url "$ENDPOINT" >/dev/null 2>&1; then
    echo "Tabla $name ya existe"
    return
  fi
  local attrs="AttributeName=$pk,AttributeType=S"
  local keys="AttributeName=$pk,KeyType=HASH"
  if [ -n "$sk" ]; then
    attrs="$attrs AttributeName=$sk,AttributeType=S"
    keys="$keys AttributeName=$sk,KeyType=RANGE"
  fi
  # shellcheck disable=SC2086
  aws dynamodb create-table --table-name "$name" --attribute-definitions $attrs --key-schema $keys \
    --billing-mode PAY_PER_REQUEST --endpoint-url "$ENDPOINT" >/dev/null
  echo "Tabla $name creada"
}

create_table "app-items" "id"

```
