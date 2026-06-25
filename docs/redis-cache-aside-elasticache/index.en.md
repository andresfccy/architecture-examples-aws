# Cache-Aside with ElastiCache Valkey/Redis

## Use case

An API repeatedly reads expensive data from Aurora, DynamoDB, or Bedrock. Latency rises and backend cost grows.

```mermaid
flowchart LR
  App[Lambda ECS or EC2] --> Cache[ElastiCache Valkey/Redis]
  App --> Db[Aurora DynamoDB or Bedrock]
  Cache --> Metrics[CloudWatch cache metrics]
  App --> Logs[CloudWatch Logs]
```

## Main decision

Use **ElastiCache Valkey/Redis** for cache-aside, sessions, rate limiting, counters, leaderboards, lightweight locks, or semantic cache.

Use **DynamoDB** if you need primary persistence. Use **CloudFront** for HTTP cache at the edge. Use **OpenSearch/S3 Vectors** for sustained vector search depending on QPS.

## Key questions

- Which read repeats, and how expensive is it?
- What TTL is acceptable per data type?
- How do you invalidate after a write?
- What happens if cache is unavailable?
- Do you need persistence, replicas, or global datastore?
- Serverless or node-based?

## Why these services

- **ElastiCache Serverless**: lower administration for general caching.
- **Node-based Valkey**: more control, global datastore, and vector search.
- **Valkey**: recommended option in skills for new caches.
- **CloudWatch**: hit rate, CPU, memory, and evictions.

## Pros

- Reduces latency.
- Reduces DB/LLM load and cost.
- Rich patterns: TTL, sorted sets, pub/sub, counters.
- Can implement rate limiting.
- Good complement to Aurora/DynamoDB.

## Cons

- Invalidation is hard.
- Cache stampede without protection.
- Stale data is possible.
- Access is VPC-centric.
- Serverless does not cover every advanced case.

## Alerts and cost

Minimum:

- Cache hit rate.
- CPU, memory usage, evictions.
- Connections.
- Replication lag if applicable.
- Latency and command errors.
- Budget for cache, data transfer, and nodes.

Guardrails:

- Do not create Redis clients at import time; initialize lazily.
- Use TLS/auth/IAM where applicable.
- Do not store secrets or PII unless needed.
- Test behavior when cache is down.

## Natural evolution

- If hit rate is low: review keys, TTL, and invalidation.
- If memory fills: compress, lower TTL, or scale.
- If one key is hot: logical sharding or local cache.
- If LLM cost is high: semantic cache.
- If you need vector search: node-based Valkey 8.2+ or OpenSearch.

## Applied Examples

### Example 1: Fitness app leaderboard and profile cache

**Context:** A fitness app shows live rankings, user profiles, and personalized plans. The primary database should not absorb every repeated read.

**Questions and answers:**

- **What is cached?** Public profile, challenge ranking, and expensive query results. Canonical data remains in DynamoDB or Aurora.
- **Which TTL should be used?** Profiles for minutes, ranking for seconds, feature flags longer; add jitter to avoid cache stampede.
- **Serverless or node-based?** Serverless for common cache-aside; node-based Valkey when vector search or fine topology control is required.

**Architecture by stage:**

- **Initial project:** API on Lambda/ECS queries ElastiCache with lazy connection, falls back to DB on miss, and writes with TTL.
- **Middle stage:** Event-driven invalidation, recompute locks, cache hit rate, CPU, memory, and connection metrics.
- **Large-scale projection:** Sharding by tenant/challenge, Global Datastore if a secondary region applies, semantic cache for AI responses, and snapshots for important derived data.

**Migration/evolution:** Measure slow endpoints first, introduce cache-aside on one high-volume read, then move sessions/rate limiting and finally leaderboard patterns.

```mermaid
flowchart LR
  App[API app] --> Cache[ElastiCache Valkey]
  Cache -->|miss| Db[DynamoDB or Aurora]
  Db --> Cache
  App --> Rank[Sorted sets leaderboard]
  Events[EventBridge changes] --> Invalidate[Lambda invalidation]
  Invalidate --> Cache
  Cache --> Metrics[CloudWatch hit rate]
  Ai[Bedrock app] --> Semantic[Semantic cache]
  Semantic --> Cache
```

**Related patterns:** [container-web-app-fargate-alb](../container-web-app-fargate-alb/index.md), [nosql-dynamodb-single-table](../nosql-dynamodb-single-table/index.md), [ai-rag-bedrock-vectors](../ai-rag-bedrock-vectors/index.md).

## Practice exercise

Add cache-aside to `GET /products/{id}`. Define key, TTL, invalidation after product update, and a low-hit-rate alarm.

