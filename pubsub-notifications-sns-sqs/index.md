# Pub/Sub de Notificaciones con SNS y SQS

## Caso de uso

Un evento simple debe llegar a varios destinos: email, auditoria, facturacion, CRM, webhook y procesamiento interno.

```mermaid
flowchart LR
  Producer[Producer] --> Topic[SNS Topic]
  Topic --> Q1[SQS Audit Queue]
  Topic --> Q2[SQS Billing Queue]
  Topic --> Fn[Lambda Notification]
  Topic --> Webhook[HTTP/S endpoint]
  Q1 --> Dlq1[DLQ]
  Q2 --> Dlq2[DLQ]
```

## Decision principal

Usa **SNS + SQS** para fan-out simple donde cada consumidor necesita su propia cola y retry independiente.

Usa **EventBridge** si necesitas routing por contenido, SaaS integrations, schema registry o buses por dominio. Usa **SQS directo** si solo hay un consumidor. Usa **Kinesis/MSK** si necesitas replay.

## Preguntas clave

- Hay multiples consumidores independientes?
- Cada consumidor debe fallar sin afectar a los demas?
- El filtrado se puede hacer por atributos simples?
- Necesitas push a HTTP/email/SMS?
- El mensaje debe poder reproducirse despues?
- Como controlas permisos contra confused deputy?

## Por que estos servicios

- **SNS**: publicacion a multiples suscriptores.
- **SQS por consumidor**: buffer y retry aislado.
- **DLQ por suscripcion/cola**: errores recuperables.
- **KMS**: cifrado de topics y colas.

## Pros

- Simple y efectivo.
- Consumidores desacoplados.
- Permite protocolos variados.
- SQS protege consumidores lentos.
- Menor complejidad que Kafka para notificaciones.

## Contras

- Routing menos expresivo que EventBridge.
- No hay replay general despues de consumir.
- Requiere politicas correctas en colas para permitir SNS.
- Orden solo con FIFO y restricciones asociadas.
- Puede crecer como "topic sprawl" sin gobierno.

## Alertas y costos

Minimo:

- SNS NumberOfNotificationsFailed.
- SQS backlog y DLQ depth por consumidor.
- Lambda subscriber Errors.
- Budget por requests y SMS/email si aplica.

Guardrails:

- Cifrar topic y colas con KMS si hay datos sensibles.
- Queue policy debe permitir `sns.amazonaws.com` con `aws:SourceArn`.
- Mensajes grandes: guardar payload en S3 y mandar referencia.

## Evolucion natural

- Si el routing depende de contenido complejo: EventBridge.
- Si consumidores necesitan historico: Kinesis/MSK.
- Si un consumidor se vuelve lento: ajustar batch/concurrency.
- Si hay integraciones externas criticas: usar DLQ y replay controlado.
- Si hay dominios separados: topic por dominio o bus por dominio.

## Ejercicio de practica

Disena el evento `PaymentCaptured` con tres consumidores: auditoria, email y fulfillment. Define sus DLQ y politicas de cola.

