# Orquestacion con Step Functions

## Caso de uso

Proceso de orden con varios pasos: validar carrito, reservar inventario, cobrar pago, generar factura, notificar y compensar si algo falla.

```mermaid
flowchart LR
  Trigger[API or EventBridge] --> Sfn[Step Functions Standard]
  Sfn --> Validate[Lambda validate]
  Sfn --> Charge[SDK Payment or Lambda]
  Sfn --> Choice{Success?}
  Choice --> Ship[Start fulfillment]
  Choice --> Refund[Compensation]
  Sfn --> Audit[DynamoDB or S3]
```

## Decision principal

Usa **Step Functions** cuando necesitas pasos visibles, retries, catch, branching, timeouts, paralelismo o compensaciones.

Usa **Lambda simple** si la operacion es corta y lineal. Usa **EventBridge** si solo enrutas eventos independientes. Usa **MWAA** para data pipelines complejos con DAGs de analitica.

## Preguntas clave

- Hay mas de un paso con estados intermedios?
- Necesitas reintentos por paso?
- Existe compensacion tipo saga?
- El flujo puede durar minutos, horas o dias?
- El payload supera 256 KB?
- Hay aprobacion humana o callbacks?

## Por que estos servicios

- **Standard workflows**: exactamente una ejecucion logica y hasta un ano.
- **Express workflows**: alto volumen y duracion corta.
- **SDK integrations**: llaman servicios AWS sin Lambda intermedia.
- **Choice/Parallel/Map**: control de flujo administrado.
- **CloudWatch/X-Ray**: visibilidad por estado.

## Pros

- Estado y errores visibles.
- Menos codigo de orquestacion propio.
- Retries y timeouts declarativos.
- Buen fit para sagas.
- Facil auditar ejecuciones.

## Contras

- Costo por state transition.
- Payload limitado.
- ASL agrega curva de aprendizaje.
- Workflows muy grandes pueden volverse dificiles de mantener.
- Express tiene semanticas distintas a Standard.

## Alertas y costos

Minimo:

- ExecutionsFailed, ExecutionsTimedOut, ExecutionsAborted.
- Lambda task errors por estado.
- DLQ/backlog si se integra con colas.
- Budget por state transitions.

Guardrails:

- Guardar payloads grandes en S3 y pasar referencias.
- Preferir SDK integrations sobre Lambda pegamento.
- Definir retry y catch por error esperado.
- Loggear correlation ID de punta a punta.

## Evolucion natural

- Si el flujo es de datos batch: Glue/MWAA.
- Si necesita eventos entre dominios: publicar eventos en EventBridge.
- Si un paso es lento o CPU-heavy: moverlo a ECS task.
- Si el costo de transitions sube: agrupar pasos o usar Express donde aplique.
- Si se repiten subflujos: crear workflows hijos.

## Ejercicio de practica

Modela una saga de pedido con compensacion de pago. Define estados, errores recuperables, errores finales y metricas de exito.

