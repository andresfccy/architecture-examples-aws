# Event Streaming with Amazon MSK

## Use case

Company with an existing Kafka ecosystem: microservices publish events, connectors integrate databases and data lake, consumers run analytics and near-realtime processing.

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

## Main decision

Use **Amazon MSK** when you need Kafka compatibility, partitions, offsets, replay, consumer groups, and connector ecosystem.

Use **Kinesis** if you want lower operational burden and do not need Kafka APIs. Use **EventBridge** for domain events with managed routing. Use **SQS** for task distribution.

## Key questions

- Do Kafka producers/consumers already exist?
- Do you need long retention and replay by offset?
- Can the team manage partitions and consumer lag?
- Do you need exactly-once or Kafka transactions?
- What serialization/schema approach will you use?
- How will you manage SASL/SCRAM or mTLS credentials?

## Why these services

- **MSK**: managed Kafka with API compatibility.
- **MSK Connect**: connectors to S3, JDBC, and other destinations.
- **Flink**: complex stream processing.
- **Secrets Manager**: secure Kafka credentials.
- **CloudWatch**: broker and consumer metrics.

## Pros

- Compatible with existing Kafka tools.
- Replay and multiple consumer groups.
- Broad connector ecosystem.
- Good fit for event sourcing and CDC.
- Granular partition control.

## Cons

- More complex than SQS/EventBridge.
- Poorly designed partitions create hot spots.
- Operation and versioning require Kafka knowledge.
- Broker costs run continuously.
- Client security must be handled carefully.

## Alerts and cost

Minimum:

- Consumer lag per group.
- Broker CPU, memory, disk, and network.
- Under-replicated partitions.
- Offline partitions.
- Produce/consume error rate.
- Budget for brokers, storage, data transfer, and connectors.

Guardrails:

- Credentials in Secrets Manager, not connection strings.
- Encryption in transit.
- Schema governance from day one.
- Do not use Kafka for simple tasks that SQS would solve.

## Natural evolution

- If operational load is heavy: evaluate Kinesis.
- If you only route events: EventBridge.
- If the stream feeds BI: sink to S3 Tables/Iceberg.
- If consumer lag grows: review partitions, batch size, and scaling.
- If contracts break: schema registry and backward compatibility.

## Practice exercise

Model topics for `orders`, `payments`, and `inventory`. Define partitioning, retention, consumer groups, and lag alarms.

