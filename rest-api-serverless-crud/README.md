# REST API Serverless CRUD

## Caso de uso

Backend para una aplicacion web o mobile: usuarios crean pedidos, consultan catalogo, suben imagenes y reciben respuestas sincronas.

```mermaid
flowchart LR
  Client[Web or mobile] --> Api[API Gateway HTTP API]
  Api --> Auth[Cognito or JWT authorizer]
  Api --> Fn[Lambda per route]
  Fn --> Db[DynamoDB]
  Fn --> Obj[S3 presigned URLs]
  Fn --> Bus[EventBridge optional]
  Fn --> Logs[CloudWatch Logs and X-Ray]
```

## Decision principal

Empieza con **API Gateway HTTP API + Lambda + DynamoDB** cuando el dominio es CRUD, el trafico es variable y quieres bajo mantenimiento operacional.

Usa **API Gateway REST API** si necesitas WAF directo, API keys, usage plans, request validation o caching nativo. Usa **ECS/Fargate** si necesitas conexiones largas, procesos mayores a 15 minutos, dependencias pesadas o control de runtime.

## Preguntas clave

- La respuesta debe ser inmediata o puede ser asincrona?
- Los patrones de acceso son por clave y conocidos?
- Hay joins, reportes complejos o transacciones multi-tabla?
- El payload supera 10 MB?
- Necesitas WAF, API keys, throttling avanzado o caching?
- El equipo quiere funciones por ruta o un lambdalith tipo Express/FastAPI?

## Por que estos servicios

- **HTTP API**: menor complejidad para APIs modernas.
- **Lambda**: escala por demanda y reduce administracion.
- **DynamoDB on-demand**: buen inicio cuando el patron de trafico no esta claro.
- **S3 presigned URLs**: evita pasar archivos grandes por API Gateway.
- **EventBridge**: publica eventos de dominio sin acoplar consumidores.

## Pros

- Time-to-market alto.
- Costo bajo con trafico irregular.
- Escala sin administrar servidores.
- IAM granular por funcion si usas micro-Lambda.
- Facil agregar SQS, EventBridge o Step Functions despues.

## Contras

- Cold starts posibles.
- Limite de 15 minutos en Lambda.
- Debugging distribuido requiere buena observabilidad.
- DynamoDB exige disenar por patrones de acceso.
- APIs muy acopladas al frontend pueden crecer desordenadas.

## Alertas y costos

Minimo:

- API Gateway 4xx, 5xx y latency p99.
- Lambda Errors, Throttles, Duration p99, ConcurrentExecutions.
- DynamoDB ThrottledRequests, ConsumedRead/WriteCapacity, SystemErrors.
- DLQ depth si hay invocaciones asincronas.
- Budget mensual por ambiente y Cost Anomaly Detection.

Cost drivers:

- Requests de API Gateway.
- Duracion y memoria de Lambda.
- RCU/WCU o requests on-demand de DynamoDB.
- Logs de CloudWatch sin retencion.

## Evolucion natural

- Si una operacion tarda mucho: mover a SQS + worker o Step Functions.
- Si varios consumidores reaccionan al pedido: publicar evento en EventBridge.
- Si hay lecturas repetidas: agregar ElastiCache o DAX segun caso.
- Si aparecen consultas relacionales: mover esa parte a Aurora, no todo el sistema.
- Si hay frontend con muchas agregaciones: evaluar AppSync GraphQL.

## Ejemplos aplicados

### Ejemplo 1: Clinica de reservas y pagos

**Contexto:** Una clinica pequena necesita agenda online, cobro de copagos, carga de documentos y consulta de estado desde web y mobile sin operar servidores.

**Preguntas y respuestas:**

- **La reserva debe responder al instante?** Si. Crear cita, consultar disponibilidad y devolver confirmacion quedan sincronas; recordatorios, facturacion y analitica pueden salir por EventBridge.
- **El modelo exige joins complejos desde el dia uno?** No. DynamoDB resuelve pacientes, citas y estados con `PK/SK`; S3 guarda documentos mediante Presigned URL para no pasar archivos por API Gateway.
- **Que senal obliga a evolucionar?** Latencia p99 alta, consultas relacionales de facturacion o muchas tareas posteriores a la reserva.

**Diseno por etapa:**

- **Proyecto inicial:** CloudFront para el frontend, API Gateway HTTP API, Cognito, Lambda por ruta, DynamoDB on-demand, S3 privado con KMS y CloudWatch Logs con retencion.
- **Etapa media:** EventBridge publica `AppointmentBooked`, SQS desacopla recordatorios y pagos, Step Functions maneja reembolsos y X-Ray traza llamadas externas.
- **Gran escala:** Cuentas separadas por ambiente, DynamoDB global tables si hay sedes multi-region, Aurora para facturacion relacional y S3 Tables para reportes historicos.

**Migracion/evolucion:** Si ya existe un monolito Express, arrancar como lambdalith o ECS/Fargate, extraer rutas calientes a micro-Lambda y mover procesos de mas de 30 segundos a workers.

```mermaid
flowchart LR
  subgraph I[Proyecto inicial]
    Web[Web and mobile] --> Api[HTTP API]
    Api --> Auth[Cognito]
    Api --> Fn[Lambda routes]
    Fn --> Db[DynamoDB]
    Fn --> Files[S3 documents]
  end
  subgraph M[Etapa media]
    Fn --> Bus[EventBridge]
    Bus --> Queue[SQS reminders]
    Queue --> Worker[Lambda worker]
    Bus --> Flow[Step Functions refunds]
  end
  subgraph G[Gran escala]
    Db --> Global[Global tables]
    Bus --> Lake[S3 Tables analytics]
    Fn --> Aurora[Aurora billing]
  end
```

**Patrones relacionados:** [async-worker-sqs-lambda](../async-worker-sqs-lambda/index.md), [event-driven-domain-bus-eventbridge](../event-driven-domain-bus-eventbridge/index.md), [relational-sql-aurora-postgresql](../relational-sql-aurora-postgresql/index.md).

## Ejercicio de practica

Disena una API de ordenes con endpoints `POST /orders`, `GET /orders/{id}` y `GET /customers/{id}/orders`. Define tabla DynamoDB, alarms, presupuesto y un evento `OrderCreated`.

