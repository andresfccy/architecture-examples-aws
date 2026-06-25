# Event Streaming con Amazon MSK

## Caso de uso

Empresa con ecosistema Kafka existente: microservicios publican eventos, conectores integran bases y data lake, consumidores hacen analitica y procesamiento near real-time.

```mermaid
flowchart LR
  Producers[Services] --> MSK[Amazon MSK Kafka]
  MSK --> Consumers[Consumer groups]
  MSK --> Connect[MSK Connect]
  Connect --> S3[S3 data lake]
  MSK --> Flink[Flink apps]
  MSK --> Lambda[Lambda ESM optional]
  MSK --> Obs[CloudWatch metrics]
```

## Decision principal

Usa **Amazon MSK** cuando necesitas compatibilidad Kafka, particiones, offsets, replay, consumer groups y ecosistema de conectores.

Usa **Kinesis** si quieres menor carga operacional y no necesitas API Kafka. Usa **EventBridge** para eventos de dominio con routing administrado. Usa **SQS** para distribucion de tareas.

## Preguntas clave

- Ya existen productores/consumidores Kafka?
- Necesitas retencion larga y replay por offset?
- El equipo sabe manejar particiones y consumer lag?
- Necesitas exactly-once o transacciones Kafka?
- Que esquema de serializacion usaras?
- Como manejaras credenciales SASL/SCRAM o mTLS?

## Por que estos servicios

- **MSK**: Kafka administrado con compatibilidad de API.
- **MSK Connect**: conectores hacia S3, JDBC y otros destinos.
- **Flink**: procesamiento complejo sobre streams.
- **Secrets Manager**: credenciales Kafka seguras.
- **CloudWatch**: broker y consumer metrics.

## Pros

- Compatible con herramientas Kafka existentes.
- Replay y multiples consumer groups.
- Amplio ecosistema de connectors.
- Buen fit para event sourcing y CDC.
- Control granular de particiones.

## Contras

- Mas complejo que SQS/EventBridge.
- Particiones mal disenadas generan hot spots.
- Operacion y versionado requieren conocimiento Kafka.
- Costos de brokers corren continuamente.
- Seguridad de clientes debe cuidarse mucho.

## Alertas y costos

Minimo:

- Consumer lag por grupo.
- Broker CPU, memoria, disco y network.
- Under replicated partitions.
- Offline partitions.
- Produce/consume error rate.
- Budget por brokers, storage, data transfer y connectors.

Guardrails:

- Credenciales en Secrets Manager, no en connection strings.
- Cifrado en transito.
- Schema governance desde el inicio.
- No usar Kafka para tareas simples que SQS resolveria.

## Evolucion natural

- Si la carga operacional pesa: evaluar Kinesis.
- Si solo haces routing de eventos: EventBridge.
- Si el stream alimenta BI: sink a S3 Tables/Iceberg.
- Si consumer lag crece: revisar particiones, batch size y escalado.
- Si hay contratos rotos: schema registry y compatibilidad hacia atras.

## Ejercicio de practica

Modela topics para `orders`, `payments` y `inventory`. Define particionamiento, retencion, consumer groups y alarmas de lag.

