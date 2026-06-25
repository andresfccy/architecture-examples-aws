# NoSQL con DynamoDB Single Table

## Caso de uso

Aplicacion con accesos predecibles y alta escala: perfiles, ordenes por usuario, sesiones, carrito, estados de workflow o metadata de archivos.

```mermaid
flowchart LR
  Api[Lambda or ECS] --> Ddb[DynamoDB Table]
  Ddb --> Streams[DynamoDB Streams]
  Streams --> Lambda[Stream Processor]
  Lambda --> Bus[EventBridge optional]
  Ddb --> Backup[PITR and backups]
  Api --> Metrics[CloudWatch]
```

## Decision principal

Usa **DynamoDB** cuando puedes listar patrones de acceso por clave y necesitas latencia baja con escala administrada.

Usa **Aurora PostgreSQL** si necesitas joins, SQL ad hoc o transacciones relacionales complejas. Usa **OpenSearch** para busqueda textual/facetas. Usa **S3 Tables/Athena** para analitica historica.

## Preguntas clave

- Puedes escribir las queries antes de disenar la tabla?
- Cuales son PK/SK y GSIs?
- Hay hot partitions?
- Necesitas orden por entidad?
- El item puede superar 400 KB?
- Necesitas TTL, Streams o global tables?

## Por que estos servicios

- **DynamoDB**: key-value/document con latencia baja.
- **On-demand capacity**: buen inicio con trafico desconocido.
- **Provisioned + autoscaling**: mejor costo con trafico estable.
- **Streams**: CDC hacia Lambda/EventBridge.
- **PITR**: recuperacion ante errores.

## Pros

- Escala operacional excelente.
- Latencia consistente.
- No administra servidores.
- TTL y streams integrados.
- Buen fit para serverless.

## Contras

- Diseno inicial importa mucho.
- No reemplaza SQL general.
- GSIs agregan costo y consistencia eventual.
- Hot keys pueden limitar throughput.
- Cambiar patrones de acceso puede requerir remodelar.

## Alertas y costos

Minimo:

- ThrottledRequests.
- ConsumedReadCapacityUnits y ConsumedWriteCapacityUnits.
- SystemErrors.
- GSI throttling.
- UserErrors por conditional checks si aplica.
- Budget por tabla, backups, streams y global tables.

Cost decisions:

- Empezar on-demand y migrar a provisioned cuando el patron sea estable.
- Usar TTL para datos temporales.
- Evitar scans frecuentes.

## Evolucion natural

- Si aparecen consultas flexibles: duplicar hacia OpenSearch.
- Si hay analitica: exportar a S3 Tables.
- Si hay eventos de cambio: Streams + Lambda/EventBridge.
- Si hay alto costo por lecturas repetidas: cache con ElastiCache o DAX.
- Si hay multi-region activo: evaluar global tables.

## Ejemplos aplicados

### Ejemplo 1: Plataforma de tickets para eventos masivos

**Contexto:** Una ticketera vende entradas con picos fuertes durante preventas, necesita baja latencia y consultas por usuario, evento y codigo de entrada.

**Preguntas y respuestas:**

- **Se conocen los patrones de acceso?** Si: buscar evento, listar tickets por usuario, validar QR por ticketId y consultar disponibilidad por seccion.
- **Como evitar hot partitions?** Claves distribuidas por evento/seccion, counters con sharding y escrituras idempotentes por `purchaseId`.
- **Que sale de la tabla principal?** Busqueda textual y reportes historicos no van por scans; usan Streams hacia OpenSearch y S3.

**Diseno por etapa:**

- **Proyecto inicial:** Tabla single-table on-demand con `PK/SK`, GSI por usuario, TTL para reservas temporales y Lambda/API Gateway.
- **Etapa media:** DynamoDB Streams publica proyecciones a OpenSearch, EventBridge emite `TicketSold`, SQS procesa emails y alarmas vigilan throttling/hot keys.
- **Gran escala:** Capacidad provisionada con autoscaling para eventos conocidos, global tables para validacion regional y data lake para ventas historicas.

**Migracion/evolucion:** Si existe una tabla relacional, identificar access patterns primero; migrar lecturas de alto QPS a DynamoDB y mantener Aurora para contabilidad.

```mermaid
flowchart LR
  Api[Ticket API] --> Table[DynamoDB single table]
  Table --> Gsi[GSI by user]
  Table --> Stream[DynamoDB Streams]
  Stream --> Search[OpenSearch tickets]
  Stream --> Bus[EventBridge]
  Bus --> EmailQ[SQS email]
  EmailQ --> Email[Lambda email]
  Stream --> Lake[S3 sales lake]
  Validator[Gate validator] --> Table
```

**Patrones relacionados:** [search-opensearch-cdc](../search-opensearch-cdc/index.md), [event-driven-domain-bus-eventbridge](../event-driven-domain-bus-eventbridge/index.md), [redis-cache-aside-elasticache](../redis-cache-aside-elasticache/index.md).

## Ejercicio de practica

Disena una tabla para ecommerce: customer, order, order items y shipment. Lista 8 patrones de acceso antes de definir claves.

