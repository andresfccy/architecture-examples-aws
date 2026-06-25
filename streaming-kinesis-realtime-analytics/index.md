# Streaming Realtime Analytics con Kinesis

## Caso de uso

Capturar eventos continuos de clickstream, IoT, logs de aplicacion o telemetria para agregaciones en tiempo real y almacenamiento historico.

```mermaid
flowchart LR
  Producers[Apps devices services] --> Kds[Kinesis Data Streams]
  Kds --> Flink[Managed Service for Apache Flink]
  Kds --> Firehose[Data Firehose]
  Firehose --> S3[S3 data lake]
  Flink --> Dash[OpenSearch or DynamoDB]
  S3 --> Athena[Athena]
```

## Decision principal

Usa **Kinesis Data Streams** cuando necesitas ingestion continua, orden por shard/partition key, retencion y consumidores independientes dentro del ecosistema AWS.

Usa **SQS** para tareas asincronas sin replay. Usa **MSK** si tu organizacion ya opera Kafka o necesita APIs Kafka. Usa **Firehose directo** si solo quieres entregar datos a S3/OpenSearch/Redshift sin consumidores custom.

## Preguntas clave

- Necesitas replay desde una posicion anterior?
- Hay varios consumidores leyendo lo mismo?
- Importa orden por entidad?
- El volumen es sostenido o solo picos?
- Necesitas ventanas, joins o agregaciones?
- Cuanto tiempo debes retener eventos?

## Por que estos servicios

- **Kinesis Data Streams**: log administrado con retencion y consumidores.
- **Flink**: procesamiento stateful, ventanas, joins y enriquecimiento.
- **Firehose**: entrega administrada a S3/OpenSearch/Redshift.
- **S3 + Athena**: historico consultable.

## Pros

- Buen fit para AWS-native streaming.
- Replay dentro de retencion.
- Integracion directa con Lambda, Flink y Firehose.
- Menos operacion que Kafka.
- Orden por partition key.

## Contras

- Diseno de partition key es critico.
- Shards/capacidad deben entenderse si no usas modo on-demand.
- No es cola de tareas simple.
- Procesamiento stateful agrega complejidad.
- Costos crecen con volumen y retencion.

## Alertas y costos

Minimo:

- IteratorAgeMilliseconds o consumer lag.
- PutRecord throttling.
- IncomingBytes/Records.
- Flink checkpoint failures y backpressure.
- Firehose delivery failures.
- Budget por ingestion, enhanced fan-out, retencion y procesamiento.

## Evolucion natural

- Si solo guardas en S3: simplificar con Firehose.
- Si necesitas API Kafka: migrar o integrar con MSK.
- Si una agregacion se vuelve critica: Flink con checkpoints y alarmas.
- Si particiones calientes aparecen: redisenar partition key.
- Si analitica historica domina: modelar S3 Tables/Iceberg.

## Ejemplos aplicados

### Ejemplo 1: Telemetria IoT para cadena de frio

**Contexto:** Camiones refrigerados envian temperatura, ubicacion y bateria cada pocos segundos. Operaciones necesita alertas inmediatas y analitica historica.

**Preguntas y respuestas:**

- **Es mensajeria o streaming?** Streaming. Se requiere retencion, replay, orden por dispositivo y multiples consumidores independientes.
- **Cuando usar Flink?** Cuando hay ventanas, deteccion de eventos complejos o joins con umbrales por ruta; Firehose basta para entrega simple a S3.
- **Como se maneja backpressure?** Shards/on-demand, particion por `vehicleId`, alarmas de IteratorAge y DLQ/on-failure para consumidores Lambda.

**Diseno por etapa:**

- **Proyecto inicial:** Dispositivos publican por API/IoT Core a Kinesis Data Streams; Lambda detecta umbrales y Firehose entrega Parquet a S3.
- **Etapa media:** Managed Service for Apache Flink calcula ventanas, DynamoDB guarda estado operativo, SNS alerta incidentes y Athena consulta historicos.
- **Gran escala:** Multi-region ingestion, enhanced fan-out para consumidores criticos, S3 Tables/Iceberg para lakehouse y OpenSearch para busqueda operacional.

**Migracion/evolucion:** Si hoy se insertan lecturas directo en una base SQL, poner Kinesis delante, replicar a la base actual como consumidor y mover analitica a S3 sin parar productores.

```mermaid
flowchart LR
  Devices[IoT devices] --> Stream[Kinesis Data Streams]
  Stream --> Lambda[Lambda threshold alerts]
  Stream --> Firehose[Firehose]
  Firehose --> S3[S3 Parquet]
  Stream --> Flink[Flink windows]
  Flink --> Ddb[DynamoDB live state]
  Flink --> Topic[SNS incidents]
  S3 --> Athena[Athena]
  S3 --> Tables[S3 Tables]
```

**Patrones relacionados:** [data-lake-s3-tables-athena](../data-lake-s3-tables-athena/index.md), [observability-cloudwatch-xray-adot](../observability-cloudwatch-xray-adot/index.md), [kafka-msk-event-streaming](../kafka-msk-event-streaming/index.md).

## Ejercicio de practica

Disena ingestion de eventos `page_view`. Define partition key, retencion, consumidor realtime, entrega a S3 y alarma por lag.

