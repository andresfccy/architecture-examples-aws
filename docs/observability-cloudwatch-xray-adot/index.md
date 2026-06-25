# Observabilidad con CloudWatch, X-Ray y ADOT

## Caso de uso

Cualquier sistema productivo necesita saber si esta sano, donde falla, quien cambio algo y cuanto tarda cada operacion.

```mermaid
flowchart LR
  App[Lambda ECS API] --> Logs[CloudWatch Logs JSON]
  App --> Metrics[CloudWatch Metrics EMF]
  App --> Traces[X-Ray or ADOT]
  Metrics --> Alarms[CloudWatch Alarms]
  Alarms --> SNS[SNS Notifications]
  Audit[CloudTrail] --> Investigate[Audit queries]
  Metrics --> Dash[Dashboards]
```

## Decision principal

Usa **CloudWatch Logs, Metrics, Alarms, Dashboards, X-Ray/ADOT y CloudTrail** como base operacional desde el primer despliegue.

No lo dejes para despues: sin observabilidad, no puedes tomar decisiones de escalado, costo, confiabilidad ni seguridad.

## Preguntas clave

- Como sabes que el usuario esta afectado?
- Cual es la metrica SLO: latencia, errores, disponibilidad?
- Que logs permiten depurar sin exponer secretos?
- Donde ves trazas entre API, Lambda/ECS, DB y colas?
- Que alarma despierta a alguien y cual solo va a dashboard?
- Como respondes "quien borro o cambio esto"?

## Por que estos servicios

- **CloudWatch Logs**: logs centralizados.
- **EMF/Powertools**: metricas custom sin llamada sincrona.
- **CloudWatch Alarms**: deteccion y notificacion.
- **X-Ray/ADOT**: trazas distribuidas.
- **CloudTrail**: auditoria de API calls.
- **SNS**: canal de notificacion de alarmas.

## Pros

- Base nativa AWS.
- Facil conectar alarmas a SNS/Incident Manager.
- Trazas ayudan en sistemas distribuidos.
- CloudTrail da auditoria.
- Dashboards aceleran operacion.

## Contras

- Logs sin retencion controlada cuestan.
- Muchas dimensiones custom elevan costo.
- High-resolution alarms cuestan mas.
- Trazas requieren instrumentacion.
- Alertas mal calibradas generan fatiga.

## Alertas minimas recomendadas

- Error rate, no solo conteo bruto.
- Latencia p99, no Average.
- Throttles.
- Saturacion: concurrency, CPU, memory, connections.
- Backlog: SQS age/depth, stream iterator age.
- DLQ depth > 0.
- Billing/Budgets por ambiente.

Practicas de alarmas:

- Usar M-of-N: por ejemplo 2 de 3.
- Elegir `treatMissingData` explicitamente.
- `notBreaching` para metricas de errores es comun.
- `breaching` para heartbeats.
- Composite alarms para reducir ruido.

## Evolucion natural

- Si hay muchas cuentas: cross-account observability.
- Si hay trazas fuera de AWS: ADOT/OpenTelemetry.
- Si hay canarios: CloudWatch Synthetics.
- Si hay incidentes recurrentes: runbooks y dashboards por servicio.
- Si logs suben de costo: retencion, sampling y log levels.

## Ejemplos aplicados

### Ejemplo 1: Observabilidad de checkout multi-servicio

**Contexto:** Un checkout usa API, pagos, inventario, cupones y notificaciones. El equipo ve errores, pero no sabe donde se rompe la experiencia.

**Preguntas y respuestas:**

- **Que SLI importa primero?** Tasa de ordenes exitosas, latencia p95/p99 del checkout y errores por dependencia.
- **Que se instrumenta?** Structured logging con correlation id, metricas EMF por dominio, X-Ray/ADOT para trazas y CloudTrail para cambios de infraestructura.
- **Como evitar ruido de alarmas?** Alarmas por sintomas de usuario, composite alarms para dependencias y dashboards por servicio con runbooks.

**Diseno por etapa:**

- **Proyecto inicial:** CloudWatch Logs con retencion, metricas de API/Lambda/ECS, alarmas basicas y dashboard de checkout.
- **Etapa media:** ADOT collector, X-Ray traces, CloudWatch Logs Insights, metricas custom de negocio y SNS/PagerDuty para alarmas accionables.
- **Gran escala:** Observabilidad cross-account, SLOs por dominio, canaries, CloudTrail Lake/Athena para auditoria y OpenSearch para logs de alta cardinalidad.

**Migracion/evolucion:** Si solo hay logs de texto, pasar primero a JSON con correlation id, despues agregar metricas EMF y finalmente trazas distribuidas.

```mermaid
flowchart LR
  Client[Checkout clients] --> Api[API Gateway or ALB]
  Api --> Services[Lambda and ECS services]
  Services --> Logs[CloudWatch Logs]
  Services --> Metrics[EMF metrics]
  Services --> Traces[X-Ray and ADOT]
  CloudTrail[CloudTrail] --> Audit[S3 or CloudTrail Lake]
  Metrics --> Alarms[Composite alarms]
  Alarms --> Notify[SNS on-call]
  Logs --> Insights[Logs Insights dashboards]
```

**Patrones relacionados:** [container-web-app-fargate-alb](../container-web-app-fargate-alb/index.md), [rest-api-serverless-crud](../rest-api-serverless-crud/index.md), [cost-guardrails-budgets-anomaly](../cost-guardrails-budgets-anomaly/index.md).

## Ejercicio de practica

Define un dashboard para una API con Lambda, SQS y DynamoDB. Incluye 6 alarmas, un composite alarm y politica de retencion.

