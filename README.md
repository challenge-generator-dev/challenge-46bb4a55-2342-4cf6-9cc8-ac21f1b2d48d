# Implementación de operaciones CRUD de órdenes en DynamoDB

El sistema de gestión de órdenes requiere la implementación de operaciones CRUD (Crear, Leer, Actualizar, Eliminar) en DynamoDB desde la interfaz de usuario. Las órdenes son gestionadas por el equipo de ventas y deben ser persistidas de manera eficiente y segura. Cada orden tiene atributos como ID, cliente, productos, fecha y estado. El sistema debe manejar correctamente los casos borde, como órdenes con productos duplicados o clientes inexistentes, y proporcionar feedback al usuario en tiempo real.

## Informacion General

| Campo | Valor |
|-------|-------|
| **Tema** | Persistir ordenes en DynamoDB desde la interfaz |
| **Nivel** | advanced-l2 |
| **Tipo** | practical |
| **Tiempo estimado** | 8 horas |

## Fases del Reto

### Fase 0: Configuración del Proyecto

**Objetivo:** Obtener el proyecto base funcional enviando el Código Base a un asistente de IA, que lo analizará, corregirá errores y entregará cada archivo con su ruta.

**Tiempo estimado:** 15-30 minutos

**Instrucciones:**

- Asegúrate de tener instalado para ejecutar el proyecto: Node.js 18+, npm, VS Code o similar.
- Copia todo el contenido del campo **Código Base** de este reto — incluyendo el texto de instrucciones que aparece al inicio.
- Abre un asistente de IA (Claude en claude.ai, ChatGPT o Gemini — se recomienda Claude), pega el contenido copiado en el chat y envíalo.
- El asistente analizará los archivos, corregirá errores y entregará cada archivo con su ruta. Guárdalos en la carpeta donde quieras trabajar, respetando las rutas.
- Ejecuta `npm install && npm run build` (o `npm start`). Si no hay errores, estás listo.

**Entregable:** El proyecto compila/arranca sin errores.

<details>
<summary>Pistas de conocimiento</summary>

- Copia el Código Base completo incluyendo el texto de instrucciones al inicio — esas instrucciones le indican al asistente exactamente qué hacer con los archivos.
- Si el asistente no entrega todos los archivos al terminar el análisis, escríbele: "entrégame todos los archivos con su ruta".
- Si el proyecto tiene errores al arrancar, comparte el mensaje de error con el mismo asistente para que lo corrija.

</details>

### Fase 1: Configuración inicial y persistencia de órdenes

**Objetivo:** Configurar la infraestructura para permitir la persistencia de órdenes en DynamoDB y desarrollar la funcionalidad básica de creación de órdenes.

**Tiempo estimado:** 3 horas

**Instrucciones:**

- Configurar DynamoDB para almacenar órdenes.
- Desarrollar la funcionalidad para crear una orden desde la interfaz, asegurando que los datos se persistan correctamente en DynamoDB.
- Manejar errores comunes durante la persistencia, como validaciones fallidas o conflictos de claves.

**Entregable:** Configuración de DynamoDB y funcionalidad de creación de órdenes verificable.

<details>
<summary>Pistas de conocimiento</summary>

- Considera las restricciones de DynamoDB al diseñar la estructura de datos para las órdenes.
- Utiliza Terraform para versionar la infraestructura de DynamoDB.

</details>

### Fase 2: Implementación de lectura y actualización de órdenes

**Objetivo:** Desarrollar las funcionalidades para leer y actualizar órdenes en DynamoDB desde la interfaz.

**Tiempo estimado:** 3 horas

**Instrucciones:**

- Implementar la funcionalidad para leer una orden existente desde DynamoDB y mostrarla en la interfaz.
- Desarrollar la funcionalidad para actualizar una orden existente, asegurando que los cambios se reflejen correctamente en DynamoDB.
- Manejar casos borde, como órdenes con productos eliminados o cambios en el estado de la orden.

**Entregable:** Funcionalidades de lectura y actualización de órdenes verificables.

<details>
<summary>Pistas de conocimiento</summary>

- Considera la consistencia de los datos al implementar las funcionalidades de lectura y actualización.
- Utiliza Terraform para versionar los cambios en la infraestructura de DynamoDB.

</details>

### Fase 3: Implementación de eliminación de órdenes y versionado de infraestructura

**Objetivo:** Desarrollar la funcionalidad para eliminar órdenes en DynamoDB y versionar la infraestructura utilizando Terraform.

**Tiempo estimado:** 2 horas

**Instrucciones:**

- Implementar la funcionalidad para eliminar una orden existente de DynamoDB desde la interfaz.
- Asegurar que la eliminación de una orden no afecte negativamente a otras órdenes o a la integridad del sistema.
- Versionar la infraestructura de DynamoDB utilizando Terraform para asegurar la trazabilidad y la reproducibilidad de los cambios.
- Documentar las decisiones de diseño tomadas durante la implementación de las funcionalidades CRUD.

**Entregable:** Funcionalidad de eliminación de órdenes verificable y documentación de decisiones de diseño.

<details>
<summary>Pistas de conocimiento</summary>

- Considera las implicaciones de la eliminación de órdenes en la integridad del sistema y la experiencia del usuario.
- Utiliza Terraform para versionar y documentar los cambios en la infraestructura de DynamoDB.

</details>

## Dimensiones Evaluadas

- **queEs**: ¿Qué son las operaciones CRUD y cómo se aplican en el contexto de gestión de órdenes en DynamoDB?
- **paraQueSirve**: ¿Para qué sirve implementar operaciones CRUD en DynamoDB desde la interfaz en el contexto de gestión de órdenes?
- **comoSeUsa**: ¿Cómo se usa Terraform para versionar la infraestructura de DynamoDB en el contexto de este reto?
- **erroresComunes**: ¿Cuáles son los errores comunes que pueden ocurrir durante la implementación de operaciones CRUD en DynamoDB y cómo se manejan?
- **queDecisionesImplica**: ¿Qué decisiones de diseño implica la implementación de operaciones CRUD en DynamoDB desde la interfaz y cómo se documentan?

## Criterios de Evaluacion

- Configuración correcta de DynamoDB para almacenar órdenes.
- Funcionalidad verificable para crear órdenes desde la interfaz.
- Funcionalidad verificable para leer órdenes desde DynamoDB.
- Funcionalidad verificable para actualizar órdenes en DynamoDB.
- Funcionalidad verificable para eliminar órdenes de DynamoDB.
- Uso correcto de Terraform para versionar la infraestructura de DynamoDB.
- Documentación adecuada de las decisiones de diseño tomadas durante la implementación.

## Como trabajar con un asistente de IA

Hay dos caminos, elegi uno:

- **AGENTS.md** (recomendado) — instrucciones nativas del repo. Abri esta carpeta con tu agente local (Claude Code, Cursor, Codex, Copilot, Gemini) y las carga solo. Sabe que archivos faltan y con que comando se verifica, y completa el scaffold escribiendo en disco.
- **PROMPT_MEJORA.md** — para copiar y pegar en un chat (claude.ai, ChatGPT) si no tenes un agente en el IDE. Declara lo mismo que AGENTS.md; los archivos que te devuelva el chat los guardas en esta carpeta respetando las rutas.

Ninguno de los dos resuelve las fases del reto: eso es tu trabajo.

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

## Verificacion

El proyecto esta listo para trabajar cuando este comando corre sin errores:

```bash
(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && (cd infra && terraform fmt -check -recursive && terraform init -backend=false && terraform validate) && docker compose config -q
```

---

*Reto generado automaticamente por Challenge Generator - Pragma*
