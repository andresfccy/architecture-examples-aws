# NoSQL with DynamoDB Single Table

## Use case

Application with predictable access and high scale: profiles, orders by user, sessions, cart, workflow states, or file metadata.

```mermaid
flowchart LR
  Api[Lambda or ECS] --> Ddb[DynamoDB Table]
  Ddb --> Streams[DynamoDB Streams]
  Streams --> Lambda[Stream Processor]
  Lambda --> Bus[EventBridge optional]
  Ddb --> Backup[PITR and backups]
  Api --> Metrics[CloudWatch]
```

## Main decision

Use **DynamoDB** when you can list key-based access patterns and need low latency with managed scale.

Use **Aurora PostgreSQL** if you need joins, ad hoc SQL, or complex relational transactions. Use **OpenSearch** for text search/facets. Use **S3 Tables/Athena** for historical analytics.

## Key questions

- Can you write the queries before designing the table?
- What are the PK/SK and GSIs?
- Are there hot partitions?
- Do you need ordering by entity?
- Can an item exceed 400 KB?
- Do you need TTL, Streams, or global tables?

## Why these services

- **DynamoDB**: key-value/document with low latency.
- **On-demand capacity**: good start with unknown traffic.
- **Provisioned + autoscaling**: better cost with stable traffic.
- **Streams**: CDC to Lambda/EventBridge.
- **PITR**: recovery from errors.

## Pros

- Excellent operational scale.
- Consistent latency.
- No server administration.
- Integrated TTL and streams.
- Good serverless fit.

## Cons

- Initial design matters a lot.
- Does not replace general SQL.
- GSIs add cost and eventual consistency.
- Hot keys can limit throughput.
- Changing access patterns can require remodeling.

## Alerts and cost

Minimum:

- ThrottledRequests.
- ConsumedReadCapacityUnits and ConsumedWriteCapacityUnits.
- SystemErrors.
- GSI throttling.
- UserErrors from conditional checks if applicable.
- Budget for table, backups, streams, and global tables.

Cost decisions:

- Start on-demand and move to provisioned when traffic is stable.
- Use TTL for temporary data.
- Avoid frequent scans.

## Natural evolution

- If flexible queries appear: duplicate into OpenSearch.
- If analytics appears: export to S3 Tables.
- If change events are needed: Streams + Lambda/EventBridge.
- If repeated reads cost too much: cache with ElastiCache or DAX.
- If active multi-region is needed: evaluate global tables.

## Applied Examples

### Example 1: Ticketing platform for high-demand events

**Context:** A ticketing company sells seats with intense spikes during presales, requiring low latency and queries by user, event, and ticket code.

**Questions and answers:**

- **Are access patterns known?** Yes: get event, list tickets by user, validate QR by ticketId, and query availability by section.
- **How are hot partitions avoided?** Distributed keys by event/section, sharded counters, and idempotent writes by `purchaseId`.
- **What leaves the main table?** Text search and historical reports do not use scans; they use Streams to OpenSearch and S3.

**Architecture by stage:**

- **Initial project:** On-demand single-table design with `PK/SK`, GSI by user, TTL for temporary reservations, and Lambda/API Gateway.
- **Middle stage:** DynamoDB Streams publishes projections to OpenSearch, EventBridge emits `TicketSold`, SQS processes emails, and alarms watch throttling/hot keys.
- **Large-scale projection:** Provisioned capacity with autoscaling for known events, global tables for regional validation, and a data lake for historical sales.

**Migration/evolution:** If a relational table exists, identify access patterns first; migrate high-QPS reads to DynamoDB and keep Aurora for accounting.

```mermaid
flowchart LR
  Api[Ticket API] --> Table[DynamoDB single table]
  Table --> Gsi[GSI by user]
  Table --> Stream[DynamoDB Streams]
  Stream --> Search[OpenSearch tickets]
  Stream --> Bus[EventBridge]
  Bus --> EmailQ[SQS email]
  EmailQ --> Email[Lambda email]
  Stream --> Lake[S3 sales lake]
  Validator[Gate validator] --> Table
```

**Related patterns:** [search-opensearch-cdc](../search-opensearch-cdc/index.md), [event-driven-domain-bus-eventbridge](../event-driven-domain-bus-eventbridge/index.md), [redis-cache-aside-elasticache](../redis-cache-aside-elasticache/index.md).

## Practice exercise

Design a table for ecommerce: customer, order, order items, and shipment. List 8 access patterns before defining keys.

