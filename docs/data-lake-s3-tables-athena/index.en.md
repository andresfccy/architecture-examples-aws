# Data Lake with S3 Tables, Glue, and Athena

## Use case

An analytics team needs to query historical sales, events, inventory, and billing without loading the transactional database.

```mermaid
flowchart LR
  Sources[S3 files apps exports] --> Glue[Glue ETL]
  Glue --> S3T[S3 Tables Iceberg]
  S3T --> Catalog[Glue Data Catalog]
  Analysts[Analysts] --> Athena[Athena Workgroup]
  Athena --> S3T
  Athena --> Results[S3 query results]
```

## Main decision

Use **S3 Tables with Iceberg + Glue Catalog + Athena** for managed analytical, historical tables queryable with SQL.

Use **Aurora/RDS** for OLTP. Use **Redshift** if you need a warehouse with more predictable BI performance and aggregated workloads. Use **raw S3 Parquet** only if you accept managing compaction, schema evolution, and metadata more carefully.

## Key questions

- Is the workload analytical or transactional?
- Does data arrive by batch, streaming, or both?
- Which partitions match your queries?
- Do you need schema evolution?
- Who governs permissions: IAM, Lake Formation, or both?
- How much does each query cost by scanned data?

## Why these services

- **S3 Tables**: managed Iceberg with compaction/snapshots.
- **Glue Data Catalog**: catalog for query engines.
- **Athena**: serverless SQL.
- **Glue ETL**: loads and transformations.
- **S3**: durable and low-cost storage.

## Pros

- Separates analytics from OLTP.
- Pay-per-use queries.
- Open to Iceberg-compatible engines.
- Good fit for large history.
- Reduces load on operational databases.

## Cons

- Latency is not OLTP.
- Poor partitioning increases cost.
- Athena charges by scanned data.
- Permission governance requires design.
- ETL and data quality still matter.

## Alerts and cost

Minimum:

- Athena data scanned per workgroup.
- Glue job failures and duration.
- S3 storage growth.
- Query failures.
- Budget for S3, Athena, and Glue.

Practices:

- Workgroups with scanned-byte limits.
- Partition by access patterns, not intuition.
- Convert CSV/JSON to Parquet/Iceberg.
- Validate row count, critical nulls, and samples.

## Natural evolution

- If BI needs low latency: Redshift or materializations.
- If ingestion is streaming: Kinesis/Firehose to S3.
- If there is CDC from DB: Glue/DMS to Iceberg.
- If there are many domains: data products by namespace.
- If queries are expensive: compaction, partitions, and columns.

## Practice exercise

Design the `sales_orders` table in Iceberg. Define schema, partitioning, Athena workgroup, byte limit, and quality validations.

