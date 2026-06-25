# Worker Asincrono con SQS y Lambda

## Caso de uso

Procesar tareas que no necesitan respuesta inmediata: enviar emails, generar PDFs, sincronizar inventario, procesar pagos diferidos o ejecutar jobs por lotes pequenos.

```mermaid
flowchart LR
  Api[API or Producer] --> Queue[SQS Queue]
  Queue --> Lambda[Lambda Worker]
  Lambda --> Db[DynamoDB Aurora or S3]
  Queue --> Dlq[SQS DLQ]
  Lambda --> Metrics[CloudWatch Metrics and Logs]
```

## Decision principal

Usa **SQS + Lambda** cuando quieres desacoplar productor y consumidor, absorber picos y procesar mensajes con retries administrados.

Usa **SQS FIFO** si necesitas orden por grupo o deduplicacion. Usa **Kinesis/MSK** si necesitas replay, multiples consumidores independientes o alto volumen continuo. Usa **ECS worker** si cada tarea dura mas de 15 minutos o necesita binarios pesados.

## Preguntas clave

- El usuario puede esperar o solo necesita un acuse?
- La tarea es idempotente?
- Que pasa si se procesa dos veces?
- Importa el orden?
- Cuanto tarda el procesamiento p95/p99?
- Como vas a manejar mensajes venenosos?

## Por que estos servicios

- **SQS**: buffer durable con retries y DLQ.
- **Lambda event source mapping**: escala workers segun cola.
- **DLQ**: separa fallos permanentes.
- **CloudWatch alarms**: detecta backlog y errores.

## Pros

- Desacopla picos.
- Reduce fallos en cascada.
- No administra workers.
- Facil limitar concurrencia para proteger downstreams.
- DLQ permite recuperacion.

## Contras

- Semantica at-least-once exige idempotencia.
- Latencia no siempre es inmediata.
- Orden global no existe en SQS Standard.
- Mensajes grandes deben ir a S3.
- Debugging requiere correlation IDs.

## Alertas y costos

Minimo:

- SQS ApproximateAgeOfOldestMessage.
- SQS ApproximateNumberOfMessagesVisible.
- DLQ depth > 0.
- Lambda Errors, Throttles, Duration p99.
- ConcurrentExecutions contra limite reservado.

Reglas practicas:

- Visibility timeout al menos 6x timeout de Lambda.
- Activar partial batch failure reporting.
- Usar reserved concurrency para proteger bases de datos.
- Retencion de logs explicita.

## Evolucion natural

- Si necesitas fan-out: SNS o EventBridge antes de SQS.
- Si necesitas orquestacion: Step Functions.
- Si necesitas replay y consumidores paralelos: Kinesis o MSK.
- Si los workers son CPU-heavy: ECS/Fargate.
- Si el backlog crece siempre: revisar capacidad downstream y batch size.

## Ejemplos aplicados

### Ejemplo 1: Generacion asincrona de facturas PDF

**Contexto:** Una plataforma de pagos debe generar facturas PDF despues del cobro, notificar al cliente y reintentar si el proveedor fiscal falla.

**Preguntas y respuestas:**

- **El usuario debe esperar el PDF?** No. La API confirma el pago y encola `InvoiceRequested`; el PDF llega por email o aparece en el panel.
- **Que pasa si el proveedor fiscal falla?** SQS maneja retries, DLQ conserva poison messages y la operacion es idempotente por `paymentId`.
- **Como se protege la base?** Reserved concurrency limita Lambda y el Visibility timeout queda al menos 6x sobre el timeout del worker.

**Diseno por etapa:**

- **Proyecto inicial:** API Gateway o ECS publica en SQS Standard, Lambda worker genera PDF, S3 guarda documentos y DynamoDB registra estado.
- **Etapa media:** DLQ con redrive controlado, SNS para notificaciones, alarmas por DLQ depth y Duration p99, y Step Functions para flujos con aprobacion manual.
- **Gran escala:** Particionar por tenant o region, workers ECS si la libreria PDF es pesada, S3 lifecycle para retencion y data lake para auditoria fiscal.

**Migracion/evolucion:** Si hoy el PDF se genera en la request, extraerlo primero detras de una cola manteniendo el endpoint actual y devolver un estado `PROCESSING`.

```mermaid
flowchart LR
  Api[Payment API] --> Queue[SQS invoice queue]
  Queue --> Fn[Lambda PDF worker]
  Fn --> Fiscal[Tax provider]
  Fn --> S3[S3 invoice PDFs]
  Fn --> Ddb[DynamoDB status]
  Fn --> Topic[SNS email event]
  Queue --> Dlq[DLQ]
  Dlq --> Redrive[Controlled redrive]
```

**Patrones relacionados:** [pubsub-notifications-sns-sqs](../pubsub-notifications-sns-sqs/index.md), [workflow-orchestration-step-functions](../workflow-orchestration-step-functions/index.md), [file-processing-s3-stepfunctions](../file-processing-s3-stepfunctions/index.md).

## Ejercicio de practica

Disena un flujo de generacion de facturas PDF. Define cola, DLQ, idempotency key, alarmas y estrategia de redrive.

