# Data Lake con S3 Tables, Glue y Athena

## Caso de uso

Equipo de analitica necesita consultar ventas, eventos, inventario y facturacion historica sin cargar la base transaccional.

```mermaid
flowchart LR
  Sources[S3 files apps exports] --> Glue[Glue ETL]
  Glue --> S3T[S3 Tables Iceberg]
  S3T --> Catalog[Glue Data Catalog]
  Analysts[Analysts] --> Athena[Athena Workgroup]
  Athena --> S3T
  Athena --> Results[S3 query results]
```

## Decision principal

Usa **S3 Tables con Iceberg + Glue Catalog + Athena** para tablas analiticas administradas, historicas y consultables con SQL.

Usa **Aurora/RDS** para OLTP. Usa **Redshift** si necesitas warehouse con performance BI mas predecible y cargas agregadas. Usa **raw S3 Parquet** solo si aceptas administrar compactacion, evolucion de schema y metadatos con mas cuidado.

## Preguntas clave

- La carga es analitica o transaccional?
- Los datos llegan batch, streaming o ambos?
- Que particiones corresponden a tus queries?
- Necesitas schema evolution?
- Quien gobierna permisos: IAM, Lake Formation o ambos?
- Cuanto cuesta cada query por datos escaneados?

## Por que estos servicios

- **S3 Tables**: Iceberg administrado con compactacion/snapshots.
- **Glue Data Catalog**: catalogo para motores de consulta.
- **Athena**: SQL serverless.
- **Glue ETL**: cargas y transformaciones.
- **S3**: storage durable y barato.

## Pros

- Separa analytics de OLTP.
- Pago por uso para consultas.
- Abierto a motores compatibles con Iceberg.
- Buen fit para historico grande.
- Reduce carga sobre bases operacionales.

## Contras

- Latencia no es OLTP.
- Partitioning mal definido aumenta costo.
- Athena cobra por datos escaneados.
- Gobierno de permisos requiere diseno.
- ETL y calidad de datos no desaparecen.

## Alertas y costos

Minimo:

- Athena data scanned por workgroup.
- Glue job failures y duration.
- S3 storage growth.
- Query failures.
- Budget por S3, Athena y Glue.

Practicas:

- Workgroups con limites de bytes escaneados.
- Particionar por patrones de acceso, no por intuicion.
- Convertir CSV/JSON a Parquet/Iceberg.
- Validar row count, nulls criticos y muestras.

## Evolucion natural

- Si BI necesita baja latencia: Redshift o materializaciones.
- Si ingestion es streaming: Kinesis/Firehose hacia S3.
- Si hay CDC desde DB: Glue/DMS hacia Iceberg.
- Si hay muchos dominios: data products por namespace.
- Si queries son caras: compactacion, particiones y columnas.

## Ejemplos aplicados

### Ejemplo 1: Lakehouse de ventas omnicanal

**Contexto:** Una marca combina ventas web, tiendas fisicas, devoluciones y campanas para reportes diarios y exploracion ad hoc.

**Preguntas y respuestas:**

- **Por que S3 Tables e Iceberg?** Se necesitan tablas con schema evolution, particiones y mantenimiento administrado sobre S3 sin operar clusters.
- **Que datos son bronze, silver y gold?** Bronze recibe crudos, silver normaliza ventas/devoluciones, gold agrega KPIs por canal y dia.
- **Como controlar costo de Athena?** Parquet, particiones por fecha/canal, compaction, workgroups con limites y presupuestos.

**Diseno por etapa:**

- **Proyecto inicial:** S3 Tables, Glue Data Catalog, Athena workgroup, jobs Glue para cargar CSV/Parquet y Lake Formation/IAM para permisos.
- **Etapa media:** Ingest incremental desde Aurora/DynamoDB, validaciones de calidad, QuickSight/Redshift Spectrum y catalogo por dominio.
- **Gran escala:** S3 Tables por dominio, cuentas productoras/consumidoras, Flink para streaming a Iceberg y gobierno con tags de datos sensibles.

**Migracion/evolucion:** Si hoy hay reportes sobre OLTP, exportar tablas a S3, recrear reportes en Athena y retirar consultas pesadas de la base transaccional.

```mermaid
flowchart LR
  Web[Web sales] --> Bronze[S3 Tables bronze]
  Store[Store POS] --> Bronze
  Returns[Returns] --> Bronze
  Bronze --> Glue[Glue ETL]
  Glue --> Silver[S3 Tables silver]
  Silver --> Gold[S3 Tables gold]
  Gold --> Athena[Athena workgroup]
  Gold --> BI[BI dashboards]
  Catalog[Glue Data Catalog] --> Athena
```

**Patrones relacionados:** [batch-etl-glue-redshift](../batch-etl-glue-redshift/index.md), [streaming-kinesis-realtime-analytics](../streaming-kinesis-realtime-analytics/index.md), [cost-guardrails-budgets-anomaly](../cost-guardrails-budgets-anomaly/index.md).

## Ejercicio de practica

Disena tabla `sales_orders` en Iceberg. Define schema, particion, workgroup Athena, limite de bytes y validaciones de calidad.

