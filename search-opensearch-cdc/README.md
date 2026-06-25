# Busqueda con OpenSearch y CDC

## Caso de uso

Un ecommerce necesita busqueda por texto, filtros, facetas, ordenamiento y sugerencias. La fuente de verdad esta en DynamoDB o Aurora.

```mermaid
flowchart LR
  Source[DynamoDB or Aurora] --> CDC[Streams or DMS]
  CDC --> Indexer[Lambda or Glue job]
  Indexer --> OS[OpenSearch Service or Serverless]
  Api[Search API] --> OS
  OS --> Dash[Dashboards optional]
```

## Decision principal

Usa **OpenSearch** cuando necesitas full-text search, facetas, ranking, filtros flexibles o busqueda hibrida/vectorial.

No uses OpenSearch como base transaccional primaria. Usa **DynamoDB/Aurora** como source of truth. Usa **Athena** para analitica historica. Usa **S3 Vectors** para almacenamiento vectorial de bajo QPS.

## Preguntas clave

- Que entidad es source of truth?
- Necesitas busqueda textual o solo lookup por clave?
- Que tan rapido debe reflejar cambios?
- Puedes tolerar consistencia eventual?
- Que campos se indexan y cuales son sensibles?
- Necesitas facetas, autocomplete o vector search?

## Por que estos servicios

- **OpenSearch**: motor de busqueda y agregaciones.
- **DynamoDB Streams/Lambda**: CDC simple desde DynamoDB.
- **DMS**: CDC desde bases relacionales.
- **S3**: dead-letter o reindex snapshots.
- **CloudWatch**: salud de cluster/indexacion.

## Pros

- Busqueda potente.
- Facetas y filtros flexibles.
- Buen complemento para OLTP.
- Puede soportar dashboards.
- Permite reindexacion controlada.

## Contras

- Consistencia eventual.
- Indices requieren tuning.
- Costos de cluster pueden ser relevantes.
- Mapeos mal definidos son dificiles de cambiar.
- Reindexacion debe planearse.

## Alertas y costos

Minimo:

- Cluster status red/yellow.
- CPU, JVM memory pressure, storage.
- Indexing latency y rejected writes.
- Search latency p99.
- DLQ del indexer.
- Budget por nodos/OCU, storage y snapshots.

## Evolucion natural

- Si el indice se desincroniza: pipeline de reindex desde source of truth.
- Si QPS sube: replicas, shards y cache de queries.
- Si aparecen vectores: evaluar OpenSearch vector o S3 Vectors + OpenSearch.
- Si solo hay filtros simples: quizas DynamoDB GSI basta.
- Si analytics domina: mandar datos a S3 Tables.

## Ejercicio de practica

Disena busqueda de productos. Define source of truth, mapeo de indice, pipeline CDC, DLQ y proceso de reindex completo.

