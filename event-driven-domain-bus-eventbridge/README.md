# Event-Driven Domain Bus con EventBridge

## Caso de uso

Una plataforma SaaS publica eventos de dominio: `OrderCreated`, `InvoicePaid`, `UserUpgraded`. Distintos equipos consumen eventos sin acoplarse al servicio origen.

```mermaid
flowchart LR
  Orders[Orders Service] --> Bus[EventBridge Custom Bus]
  Billing[Billing Service] --> Bus
  Bus --> RuleA[Rule: invoice events]
  Bus --> RuleB[Rule: customer events]
  RuleA --> Sfn[Step Functions]
  RuleB --> Queue[SQS Queue]
  RuleB --> Lambda[Lambda]
  Bus --> Archive[Archive and Replay optional]
```

## Decision principal

Usa **EventBridge** cuando los eventos representan hechos de dominio y necesitas routing por contenido, integracion con AWS/SaaS o buses separados por contexto.

Usa **SNS** si el fan-out es simple y por topic. Usa **SQS** si hay un solo consumidor. Usa **MSK/Kinesis** si necesitas log replay de alto volumen y consumidores por offset.

## Preguntas clave

- El evento es un hecho de dominio o una orden de trabajo?
- Necesitas filtros por campos del payload?
- Los consumidores pertenecen a otros equipos/cuentas?
- Necesitas archive/replay?
- Que versionado de eventos usaras?
- Como evitaras loops de eventos?

## Por que estos servicios

- **Custom event bus**: separa dominios y permisos.
- **Rules**: routing declarativo por contenido.
- **Pipes**: conecta source-target sin Lambda intermedia.
- **DLQ por target**: errores visibles.
- **Schema registry**: documenta contratos.

## Pros

- Desacoplamiento organizacional.
- Facil agregar consumidores.
- Buen fit cross-account.
- Reduce Lambdas "pegamento".
- Compatible con muchos servicios AWS.

## Contras

- No reemplaza streaming de alto volumen.
- Patrones amplios pueden causar loops.
- El versionado de eventos requiere disciplina.
- Debugging depende de correlation IDs.
- Payload maximo y throughput deben revisarse.

## Alertas y costos

Minimo:

- FailedInvocations por rule.
- DLQ depth por target.
- Invocations inesperadas por patron demasiado amplio.
- Budget por eventos publicados y targets.

Guardrails:

- Bus dedicado por dominio.
- Event pattern especifico.
- DLQ en targets importantes.
- `aws:SourceArn` y `aws:SourceAccount` en politicas hacia SQS/SNS.

## Evolucion natural

- Si hay necesidad de replay largo y orden: Kinesis/MSK.
- Si reglas se vuelven workflows: Step Functions.
- Si hay un consumidor lento: poner SQS entre rule y worker.
- Si eventos cruzan cuentas: definir owner del schema.
- Si el costo sube por ruido: revisar patrones y eventos duplicados.

## Ejemplos aplicados

### Ejemplo 1: Plataforma de seguros con eventos de poliza

**Contexto:** Ventas, cobranzas, siniestros y analitica necesitan reaccionar a cambios de poliza sin depender de llamadas directas entre equipos.

**Preguntas y respuestas:**

- **El evento representa un hecho de negocio o una orden?** `PolicyIssued` y `PaymentFailed` son hechos; comandos como recalcular riesgo van por SQS o Step Functions.
- **Por que EventBridge y no SNS?** Se necesita routing por contenido, buses por dominio, integraciones SaaS y archive/replay selectivo.
- **Como se evita un loop?** Event patterns estrictos, `source` por dominio, una regla por target y DLQ por target.

**Diseno por etapa:**

- **Proyecto inicial:** Bus `insurance-domain`, reglas para cobranzas y CRM, Lambda targets y schema registry documentado.
- **Etapa media:** EventBridge Pipes desde DynamoDB Streams, Step Functions para siniestros, cross-account bus para data platform y alarmas por failed invocations.
- **Gran escala:** Buses por dominio, archive/replay para reconstruir proyecciones, contratos versionados y cuentas separadas para productores y consumidores criticos.

**Migracion/evolucion:** Si hoy los servicios se llaman en cadena, publicar eventos despues de confirmar la transaccion y mover consumidores a reglas EventBridge sin romper el flujo sincrono existente.

```mermaid
flowchart LR
  Policy[Policy service] --> Bus[EventBridge domain bus]
  Billing[Billing service] --> Bus
  Bus --> Rule1[Rule payment failed]
  Bus --> Rule2[Rule policy issued]
  Rule1 --> ClaimsFlow[Step Functions claims]
  Rule2 --> Crm[Lambda CRM]
  Bus --> DataBus[Cross-account data bus]
  DataBus --> Lake[S3 Tables]
  Rule1 --> Dlq[Target DLQ]
```

**Patrones relacionados:** [workflow-orchestration-step-functions](../workflow-orchestration-step-functions/index.md), [nosql-dynamodb-single-table](../nosql-dynamodb-single-table/index.md), [data-lake-s3-tables-athena](../data-lake-s3-tables-athena/index.md).

## Ejercicio de practica

Define un bus `commerce`. Publica `OrderCreated` y crea reglas para fulfillment, analytics y email. Agrega DLQ y schema versionado.

