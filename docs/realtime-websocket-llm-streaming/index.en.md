# Realtime WebSocket and LLM Streaming

## Use case

Chat, live notifications, live dashboards, or token-by-token LLM responses.

```mermaid
flowchart LR
  Client[Browser or mobile] --> WS[API Gateway WebSocket]
  WS --> Conn[Lambda connection handler]
  Conn --> Ddb[DynamoDB connections TTL]
  Sender[Events or worker] --> Push[Lambda push message]
  Push --> WS
  Client --> Stream[Lambda Function URL streaming optional]
  Stream --> Bedrock[Bedrock ConverseStream]
```

## Main decision

Use **API Gateway WebSocket + Lambda + DynamoDB TTL** for bidirectional communication and notifications. Use **Lambda Function URL streaming + Bedrock ConverseStream** for LLM token streaming.

Use **AppSync subscriptions** if your client already uses GraphQL. Use **SSE** if you only need simple server-to-client streaming. Use **ECS WebSocket** if you need connections with complex persistent logic.

## Key questions

- Do you need bidirectional communication or only push?
- How long does a connection last?
- How do you authenticate on `$connect`?
- How do you clean stale connections?
- What happens if the client disconnects?
- Do you need token streaming or discrete messages?

## Why these services

- **API Gateway WebSocket**: managed connections.
- **Lambda**: handlers for connect/disconnect/message.
- **DynamoDB TTL**: connectionId state.
- **Function URL streaming**: token streaming responses.
- **Bedrock ConverseStream**: incremental generation.

## Pros

- No WebSocket servers to manage.
- Scales by events.
- DynamoDB handles connection state.
- Good fit for chats and notifications.
- LLM streaming improves UX.

## Cons

- Timeout and message size limits.
- Connection state must be cleaned.
- WebSocket auth requires design.
- Lambda is not ideal for long persistent logic.
- Streaming can increase cost without limits.

## Alerts and cost

Minimum:

- Connect/disconnect/message errors.
- Lambda Errors/Duration/Throttles.
- DynamoDB throttling and TTL cleanup.
- Bedrock token usage and throttling.
- Budget for WebSocket messages, Lambda, and tokens.

Guardrails:

- TTL for connection records.
- Rate limit per user.
- Auth on `$connect`.
- Do not expose a production Function URL with auth `NONE`.
- Correlation ID per conversation.

## Natural evolution

- If there are only GraphQL notifications: AppSync subscriptions.
- If connections need in-memory state: ECS.
- If LLM cost rises: semantic cache and token limits.
- If multi-region: think about global state and routing.
- If there is backpressure: SQS between events and push.

## Applied Examples

### Example 1: AI tutor with live chat and token streaming

**Context:** An edtech product wants bidirectional chat, token-by-token LLM responses, classroom presence, and exercise notifications.

**Questions and answers:**

- **WebSocket or SSE?** WebSocket fits presence, client-server messages, and notifications; Function URL streaming or SSE works for one-way token streaming.
- **Where are connections stored?** DynamoDB with TTL by `connectionId`, user, and classroom; ElastiCache if presence throughput becomes very high.
- **How are LLM cost and abuse controlled?** Auth on `$connect`, quotas by user, explicit maxTokens, guardrails, and budget/anomaly detection.

**Architecture by stage:**

- **Initial project:** API Gateway WebSocket, Lambda connect/message/disconnect, DynamoDB connections, Bedrock streaming, and CloudWatch metrics.
- **Middle stage:** Step Functions for tutor flows, SQS for asynchronous grading, semantic cache, and moderation with Guardrails.
- **Large-scale projection:** Sharding by classroom/tenant, multi-region for latency, OpenSearch/S3 for history, and separate accounts for AI and platform workloads.

**Migration/evolution:** If the current chat uses REST polling, introduce WebSocket only for live events, keep REST for history, and move LLM responses to streaming later.

```mermaid
flowchart LR
  Student[Student client] <--> Ws[API Gateway WebSocket]
  Ws --> Conn[Lambda connection handlers]
  Conn --> Ddb[DynamoDB connections]
  Ws --> Chat[Lambda chat handler]
  Chat --> Bedrock[Bedrock ConverseStream]
  Chat --> Guard[Guardrails]
  Chat --> Queue[SQS async grading]
  Queue --> Tutor[Step Functions tutor flow]
  Chat --> History[S3 or OpenSearch history]
```

**Related patterns:** [ai-rag-bedrock-vectors](../ai-rag-bedrock-vectors/index.md), [workflow-orchestration-step-functions](../workflow-orchestration-step-functions/index.md), [cost-guardrails-budgets-anomaly](../cost-guardrails-budgets-anomaly/index.md).

## Practice exercise

Design a support chat with WebSocket and RAG streaming. Define auth, connections table, per-user limits, alarms, and token budget.

