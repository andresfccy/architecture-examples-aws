# Guardrails de Costo y Proteccion de Wallet

## Caso de uso

Evitar sorpresas de factura, abuso accidental, loops, ataques de consumo o workloads mal dimensionados.

```mermaid
flowchart LR
  Usage[AWS usage] --> CE[Cost Explorer]
  Usage --> CUR[CUR 2.0 to S3]
  CE --> Budgets[AWS Budgets]
  CE --> Anomaly[Cost Anomaly Detection]
  Usage --> CO[Compute Optimizer]
  Budgets --> SNS[SNS alerts]
  CUR --> Athena[Athena cost queries]
```

## Decision principal

Activa **Budgets, Cost Anomaly Detection, Cost Explorer, tags, Compute Optimizer y CUR** antes de que el sistema crezca.

No confies en revisar la factura manualmente. El costo tambien es una senal de seguridad y arquitectura.

## Preguntas clave

- Cual es el presupuesto mensual por ambiente?
- Que tag identifica producto, equipo, ambiente y owner?
- Que servicio podria crecer sin limite?
- Que metrica de consumo dispara alerta temprana?
- Que accion automatica es segura y cual requiere aprobacion?
- Que costo unitario importa: por usuario, orden, request, GB?

## Por que estos servicios

- **Budgets**: umbrales y alertas.
- **Cost Anomaly Detection**: spikes inusuales.
- **Cost Explorer**: analisis por servicio/tag/cuenta.
- **CUR + Athena**: detalle line-item.
- **Compute Optimizer**: rightsizing.
- **Cost Optimization Hub**: recomendaciones agregadas.

## Pros

- Detecta problemas antes de fin de mes.
- Facilita ownership por tags.
- Permite decisiones con datos.
- Identifica recursos idle o sobredimensionados.
- Ayuda a prevenir wallet DoS accidental.

## Contras

- Budgets no es rate limiter tecnico.
- Acciones automaticas pueden romper produccion si no se disenan.
- Tags incompletos reducen visibilidad.
- Cost Explorer no siempre tiene datos inmediatos.
- Recomendaciones necesitan contexto.

## Alertas recomendadas

- Budget mensual por cuenta/ambiente.
- Budget de forecast al 80% y 100%.
- Anomaly Detection por servicio.
- Alarma por NAT Gateway bytes/costo estimado.
- Alarma por CloudWatch Logs growth.
- Alarma por SQS backlog o EventBridge loop.
- Service Quotas donde un limite protege el gasto.

## Guardrails practicos

- Tags obligatorios: `app`, `env`, `owner`, `cost-center`.
- Retencion de logs explicita.
- Lifecycle en S3 y snapshots.
- WAF rate-based rules para endpoints publicos.
- Throttling en API Gateway.
- Reserved concurrency en Lambda para limitar explosion.
- VPC endpoints para reducir NAT cuando aplique.

## Evolucion natural

- Si hay gasto estable: Savings Plans o RIs con analisis.
- Si hay recursos idle: Compute Optimizer y schedules.
- Si logs dominan: sampling, retencion y clases.
- Si DynamoDB on-demand se estabiliza: evaluar provisioned.
- Si Fargate corre continuo: Savings Plans o right-sizing.

## Ejemplos aplicados

### Ejemplo 1: Startup con ambientes efimeros por pull request

**Contexto:** Cada pull request levanta stacks temporales para pruebas. El equipo quiere velocidad sin descubrir costos tarde.

**Preguntas y respuestas:**

- **Un Budget corta el gasto?** No. Alerta; el control tecnico viene de quotas, TTL, automatizacion de limpieza y SCPs.
- **Que etiquetas son obligatorias?** `owner`, `env`, `project`, `ttl`, `cost-center` y `created-by` para atribuir gasto y borrar recursos huerfanos.
- **Que senales disparan accion?** Forecast sobre presupuesto, anomaly detection, NAT/DataTransfer inusual, logs sin retencion y recursos sin tag.

**Diseno por etapa:**

- **Proyecto inicial:** Budgets por cuenta/ambiente, Cost Anomaly Detection, tags obligatorios en IaC y alarmas de gasto diario.
- **Etapa media:** Lambda Scheduler borra stacks expirados, AWS Config detecta tags/log retention, Service Quotas limita servicios caros y dashboards Cost Explorer.
- **Gran escala:** CUR 2.0 en S3 + Athena, chargeback por equipo, SCPs por OU, Savings Plans evaluados con datos y aprobacion financiera.

**Migracion/evolucion:** Si no hay tagging, empezar por nuevos stacks, luego backfill de recursos vivos y finalmente bloquear despliegues sin tags en pipeline.

```mermaid
flowchart LR
  Cdk[Ephemeral CDK stacks] --> Tags[Mandatory tags]
  Tags --> Cost[Cost Explorer]
  Cost --> Budget[Budgets alerts]
  Cost --> Anomaly[Cost Anomaly Detection]
  Tags --> Cleanup[TTL cleanup Lambda]
  Config[AWS Config rules] --> Cleanup
  Cur[CUR 2.0] --> S3[S3 billing lake]
  S3 --> Athena[Athena chargeback]
  Org[SCP and quotas] --> Cdk
```

**Patrones relacionados:** [security-iam-secrets-oidc](../security-iam-secrets-oidc/index.md), [observability-cloudwatch-xray-adot](../observability-cloudwatch-xray-adot/index.md), [multi-account-networking-vpc-endpoints](../multi-account-networking-vpc-endpoints/index.md).

## Ejercicio de practica

Define guardrails para una API publica: API throttling, WAF rate limit, Lambda reserved concurrency, budget, anomaly alert y dashboard de costo por request.

